import { useEffect, useRef, useState } from 'react'
import { Header } from '../../components/Header'
import { Progress } from '../../components/Progress'
import { sounds } from '../../game/sound'
import { useRoundFlow, type RoundFlow } from '../../game/useRoundFlow'
import { fmt, makeChoices, shuffle } from './generator'
import { LEVEL_STYLE } from '../../game/levels'
import { OP_INFO } from './labels'
import { generateRound } from './round'
import type { Grade, Level, OpChoice, Problem } from './types'

export interface MatteSettings {
  grade: Grade
  op: OpChoice
  level: Level
}

interface Item {
  problem: Problem
  /** Svarsalternativ (bara på Lätt). */
  choices: number[]
}

const RETRY = ['Nästan! Försök igen 💪', 'Inte riktigt – en gång till! 🤔', 'Ett försök till! 🍀']
const MAX_DIGITS = 7

interface Props {
  settings: MatteSettings
  onFinish: (firstTryCorrect: number) => void
  onQuit: () => void
}

export function MatteRound({ settings, onFinish, onQuit }: Props) {
  const { grade, level, op } = settings
  const isEasy = level === 'latt'
  const toItem = (problem: Problem): Item => ({ problem, choices: isEasy ? makeChoices(problem) : [] })

  const flow = useRoundFlow<Item>({
    makeItems: () => generateRound(grade, level, op).map(toItem),
    onFinish,
    remake: (item) => toItem(item.problem),
  })

  return (
    <div className="screen round">
      <Header
        onBack={() => {
          if (window.confirm('Vill du avsluta rundan?')) onQuit()
        }}
        backIcon="✕"
        backLabel="Avsluta rundan"
      >
        <span className="chip">Åk {grade}</span>
        <span className="chip">{OP_INFO[op].icon}</span>
        <span className="chip">{LEVEL_STYLE[level].label}</span>
      </Header>
      <Progress marks={flow.marks} index={flow.index} isRetake={flow.isRetake} />
      {/* Ny nyckel per fråga ⇒ inmatning, 50/50 m.m. nollställs automatiskt. */}
      <MathQuestion key={flow.index} flow={flow} isEasy={isEasy} />
    </div>
  )
}

function MathQuestion({ flow, isEasy }: { flow: RoundFlow<Item>; isEasy: boolean }) {
  const { item, phase, done, message, streak, attempts } = flow
  const { problem } = item
  const [input, setInput] = useState('')
  const [removed, setRemoved] = useState<number[]>([])
  const [fiftyUsed, setFiftyUsed] = useState(false)

  function submit(value: number) {
    if (done) return
    if (value === problem.answer) {
      flow.correct()
      return
    }
    setInput('')
    setRemoved((r) => [...r, value])
    flow.wrong(shuffle(RETRY)[0], 'Så här blir det:')
  }

  const wrongLeft = item.choices.filter((c) => c !== problem.answer && !removed.includes(c))

  function fiftyFifty() {
    if (fiftyUsed || done || wrongLeft.length <= 1) return
    sounds.tap()
    setFiftyUsed(true)
    setRemoved((r) => [...r, ...shuffle(wrongLeft).slice(0, wrongLeft.length - 1)])
  }

  function typeDigit(d: string) {
    if (done) return
    sounds.tap()
    if (phase === 'retry') flow.setPhase('answering')
    setInput((cur) => (cur === '0' ? d : cur.length >= MAX_DIGITS ? cur : cur + d))
  }

  function backspace() {
    if (done) return
    sounds.tap()
    setInput((cur) => cur.slice(0, -1))
  }

  function ok() {
    if (input !== '') submit(Number(input))
  }

  // Tangentbord på datorn: siffror, Backspace, Enter (och 1–4 på Lätt).
  const keyHandler = useRef<(e: KeyboardEvent) => void>(() => {})
  const handleKey = (e: KeyboardEvent) => {
    if (phase === 'reveal' && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault()
      flow.advance()
      return
    }
    if (isEasy) {
      const n = Number(e.key)
      if (n >= 1 && n <= item.choices.length) {
        const choice = item.choices[n - 1]
        if (!removed.includes(choice)) submit(choice)
      }
      return
    }
    if (/^\d$/.test(e.key)) typeDigit(e.key)
    else if (e.key === 'Backspace') backspace()
    else if (e.key === 'Enter') ok()
  }
  useEffect(() => {
    keyHandler.current = handleKey
  })
  useEffect(() => {
    const listener = (e: KeyboardEvent) => keyHandler.current(e)
    window.addEventListener('keydown', listener)
    return () => window.removeEventListener('keydown', listener)
  }, [])

  const [before, after] = problem.question.split('?')
  const slot = done ? fmt(problem.answer) : isEasy ? '?' : input || '?'
  const long = problem.question.length > 14
  const slotEl = <span className={`slot ${input && !done ? 'slot-filled' : ''}`}>{slot}</span>

  return (
    <>
      <div className={`card phase-${phase}`} key={attempts}>
        {problem.story ? (
          <>
            <p className="story">{problem.story}</p>
            <div className="story-answer">
              {slotEl} {problem.answerLabel}
            </div>
          </>
        ) : (
          <div className={`problem ${long ? 'problem-long' : ''}`}>
            {before}
            {slotEl}
            {after}
          </div>
        )}
        <div className="message">{message}</div>
        {phase === 'correct' && streak >= 2 && <div className="streak">🔥 {streak} rätt i rad!</div>}
        {phase === 'reveal' && <div className="solution">{problem.solution}</div>}
      </div>

      <div className="answer-area">
        {phase === 'reveal' ? (
          <button className="big-btn primary" onClick={flow.advance}>
            Nästa ➜
          </button>
        ) : isEasy ? (
          <>
            <div className="choices">
              {item.choices.map((c) => {
                const gone = removed.includes(c)
                const isRight = phase === 'correct' && c === problem.answer
                return (
                  <button
                    key={c}
                    className={`choice ${gone ? 'choice-gone' : ''} ${isRight ? 'choice-right' : ''}`}
                    disabled={gone || done}
                    onClick={() => submit(c)}
                  >
                    {fmt(c)}
                  </button>
                )
              })}
            </div>
            <button className="fifty" onClick={fiftyFifty} disabled={fiftyUsed || done || wrongLeft.length <= 1}>
              ✨ 50/50
            </button>
          </>
        ) : (
          <div className="numpad">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((d) => (
              <button key={d} onClick={() => typeDigit(d)} disabled={done}>
                {d}
              </button>
            ))}
            <button className="numpad-back" onClick={backspace} disabled={done} aria-label="Sudda">
              ⌫
            </button>
            <button onClick={() => typeDigit('0')} disabled={done}>
              0
            </button>
            <button className="numpad-ok" onClick={ok} disabled={done || input === ''} aria-label="Svara">
              ✓
            </button>
          </div>
        )}
      </div>
    </>
  )
}
