import { useEffect, useRef, useState } from 'react'
import { ROUND_LENGTH } from '../game/config'
import { celebrateCorrect } from '../game/celebrate'
import { fmt, makeChoices, shuffle } from '../game/generator'
import { generateRound } from '../game/round'
import { LEVEL_INFO, OP_INFO } from '../game/labels'
import { sounds } from '../game/sound'
import type { Grade, Level, OpChoice, Problem } from '../game/types'
import { Header } from './Header'

interface Item {
  problem: Problem
  choices: number[]
  /** Ett "omtag" av en uppgift man missat – ger ingen stjärna. */
  retake: boolean
}

type Phase = 'answering' | 'retry' | 'correct' | 'reveal'
type Mark = 'pending' | 'first' | 'later' | 'missed'

const PRAISE = ['Rätt! 🎉', 'Snyggt! ⭐', 'Grymt! 🚀', 'Wow! 🌟', 'Perfekt! ✨', 'Klockrent! 💯', 'Superbra! 🙌']
const RETRY = ['Nästan! Försök igen 💪', 'Inte riktigt – en gång till! 🤔', 'Ett försök till! 🍀']
const MAX_DIGITS = 7
/** Hur länge man får njuta av firandet innan nästa uppgift kommer (millisekunder). */
const CELEBRATION_MS = 1600

interface Props {
  grade: Grade
  level: Level
  op: OpChoice
  onFinish: (firstTryCorrect: number) => void
  onQuit: () => void
}

export function Round({ grade, level, op, onFinish, onQuit }: Props) {
  const isEasy = level === 'latt'
  const toItem = (problem: Problem, retake: boolean): Item => ({
    problem,
    choices: isEasy ? makeChoices(problem) : [],
    retake,
  })

  const [items, setItems] = useState<Item[]>(() => generateRound(grade, level, op).map((p) => toItem(p, false)))
  const [index, setIndex] = useState(0)
  const [attempts, setAttempts] = useState(0)
  const [phase, setPhase] = useState<Phase>('answering')
  const [input, setInput] = useState('')
  const [removed, setRemoved] = useState<number[]>([])
  const [fiftyUsed, setFiftyUsed] = useState(false)
  const [marks, setMarks] = useState<Mark[]>(() => Array(ROUND_LENGTH).fill('pending'))
  const [message, setMessage] = useState('')
  /** Antal rätt på första försöket i rad. */
  const [streak, setStreak] = useState(0)

  const item = items[index]
  const { problem } = item
  const done = phase === 'correct' || phase === 'reveal'

  const mark = (m: Mark) => {
    if (item.retake) return
    setMarks((prev) => prev.map((old, i) => (i === index ? m : old)))
  }

  function submit(value: number) {
    if (done) return
    if (value === problem.answer) {
      const newStreak = attempts === 0 ? streak + 1 : 0
      // Var tredje rätt i rad blir det extra stort firande!
      const big = newStreak >= 3 && newStreak % 3 === 0
      sounds.correct(big)
      celebrateCorrect(big)
      setStreak(newStreak)
      setPhase('correct')
      setMessage(shuffle(PRAISE)[0])
      mark(attempts === 0 ? 'first' : 'later')
      return
    }
    sounds.wrong()
    setStreak(0)
    setInput('')
    if (attempts === 0) {
      setAttempts(1)
      setPhase('retry')
      setMessage(shuffle(RETRY)[0])
      setRemoved((r) => [...r, value])
    } else {
      setPhase('reveal')
      setMessage('Så här blir det:')
      mark('missed')
      if (!item.retake) setItems((prev) => [...prev, toItem(problem, true)])
    }
  }

  function advance() {
    if (index + 1 < items.length) {
      setIndex(index + 1)
      setAttempts(0)
      setPhase('answering')
      setInput('')
      setRemoved([])
      setFiftyUsed(false)
      setMessage('')
    } else {
      onFinish(marks.filter((m) => m === 'first').length)
    }
  }

  // Rätt svar ⇒ gå vidare automatiskt efter en liten stund.
  useEffect(() => {
    if (phase !== 'correct') return
    const t = setTimeout(advance, CELEBRATION_MS)
    return () => clearTimeout(t)
  })

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
    if (phase === 'retry') setPhase('answering')
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
      advance()
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
  const slot = done ? problem.answer : isEasy ? '?' : input || '?'
  const long = problem.question.length > 14

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
        <span className="chip">{LEVEL_INFO[level].label}</span>
      </Header>

      <div className="progress">
        {item.retake ? (
          <span className="retake-label">🔁 Omtag – ingen stjärna, men bra träning!</span>
        ) : (
          marks.map((m, i) => <span key={i} className={`dot dot-${m} ${i === index ? 'dot-current' : ''}`} />)
        )}
      </div>

      <div className={`card phase-${phase}`} key={`${index}-${attempts}`}>
        {problem.story ? (
          <>
            <p className="story">{problem.story}</p>
            <div className="story-answer">
              <span className={`slot ${input && !done ? 'slot-filled' : ''}`}>{slot}</span> {problem.answerLabel}
            </div>
          </>
        ) : (
          <div className={`problem ${long ? 'problem-long' : ''}`}>
            {before}
            <span className={`slot ${input && !done ? 'slot-filled' : ''}`}>{slot}</span>
            {after}
          </div>
        )}
        <div className="message">{message}</div>
        {phase === 'correct' && streak >= 2 && <div className="streak">🔥 {streak} rätt i rad!</div>}
        {phase === 'reveal' && <div className="solution">{problem.solution}</div>}
      </div>

      <div className="answer-area">
        {phase === 'reveal' ? (
          <button className="big-btn primary" onClick={advance}>
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
    </div>
  )
}
