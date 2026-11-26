import { useEffect, useRef, useState } from 'react'
import { Header } from '../../../components/Header'
import { Progress } from '../../../components/Progress'
import { useGameSettings } from '../../../game/gameSettings'
import { LEVEL_STYLE } from '../../../game/levels'
import { sounds } from '../../../game/sound'
import { useRoundFlow, type RoundFlow } from '../../../game/useRoundFlow'
import { shuffle } from '../generator'
import type { Grade, Level } from '../types'
import { generateTopicRound, TOPIC_INFO, type Topic } from './index'
import { Frac, PictureView, RichText } from './Pictures'
import { emptyTyped, fmtAnswer, isComplete, isCorrect, type Task, type Typed } from './task'

const RETRY = ['Nästan! Försök igen 💪', 'Inte riktigt – en gång till! 🤔', 'Ett försök till! 🍀']
const MAX_DIGITS = 4

interface Props {
  grade: Grade
  level: Level
  topic: Topic
  onFinish: (firstTryCorrect: number, total: number) => void
  onQuit: () => void
}

/** En runda i ett av de nya momenten (bråk, ekvationer, klockan, mönster). */
export function TopicRound({ grade, level, topic, onFinish, onQuit }: Props) {
  const { roundLength } = useGameSettings()
  const flow = useRoundFlow<Task>({ makeItems: () => generateTopicRound(grade, level, topic, roundLength), onFinish })
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
        <span className="chip">{TOPIC_INFO[topic].icon}</span>
        <span className="chip">{LEVEL_STYLE[level].label}</span>
      </Header>
      <Progress marks={flow.marks} index={flow.index} />
      {/* Ny nyckel per fråga ⇒ inmatning m.m. nollställs. */}
      <TopicQuestion key={flow.index} flow={flow} />
    </div>
  )
}

/** Vilken av två rutor man skriver i (bråk: täljare/nämnare, klockan: timmar/minuter). */
type Part = 0 | 1

function TopicQuestion({ flow }: { flow: RoundFlow<Task> }) {
  const { item: task, phase, done, message, streak, attempts } = flow
  const [typed, setTyped] = useState<Typed | null>(() => emptyTyped(task.answer))
  const [part, setPart] = useState<Part>(0)
  const [removed, setRemoved] = useState<string[]>([])
  const [fiftyUsed, setFiftyUsed] = useState(false)
  const choices = task.choices

  function wrong(retryRemove?: string) {
    if (retryRemove) setRemoved((r) => [...r, retryRemove])
    setTyped(emptyTyped(task.answer))
    setPart(0)
    flow.wrong(shuffle(RETRY)[0], 'Så här blir det:')
  }

  function choose(label: string) {
    if (done || removed.includes(label)) return
    if (choices?.find((c) => c.label === label)?.correct) flow.correct()
    else wrong(label)
  }

  function submit() {
    if (done || !typed || !isComplete(typed)) return
    if (isCorrect(task.answer, typed)) flow.correct()
    else wrong()
  }

  function type(key: string) {
    if (done || !typed) return
    sounds.tap()
    if (phase === 'retry') flow.setPhase('answering')
    const add = (cur: string) => (cur.length >= MAX_DIGITS ? cur : cur === '0' ? key : cur + key)
    if (typed.kind === 'int') setTyped({ ...typed, text: add(typed.text) })
    else if (typed.kind === 'decimal') {
      if (key === ',' && typed.text.includes(',')) return
      setTyped({ ...typed, text: key === ',' || typed.text.includes(',') ? typed.text + key : add(typed.text) })
    } else if (typed.kind === 'fraction') {
      setTyped(part === 0 ? { ...typed, num: add(typed.num) } : { ...typed, den: add(typed.den) })
    } else if (typed.kind === 'time') {
      if (part === 0) {
        const h = typed.h.length >= 2 ? typed.h : typed.h + key
        setTyped({ ...typed, h })
        // Hoppa till minuterna när timmen är klar (två siffror, eller 3–9 som inte kan bli 13–23).
        if (h.length === 2 || Number(h) >= 3) setPart(1)
      } else if (typed.m.length < 2) setTyped({ ...typed, m: typed.m + key })
    }
  }

  function backspace() {
    if (done || !typed) return
    sounds.tap()
    if (typed.kind === 'int' || typed.kind === 'decimal') setTyped({ ...typed, text: typed.text.slice(0, -1) })
    else if (typed.kind === 'fraction') {
      if (part === 1 && typed.den === '') setPart(0)
      else setTyped(part === 0 ? { ...typed, num: typed.num.slice(0, -1) } : { ...typed, den: typed.den.slice(0, -1) })
    } else if (typed.kind === 'time') {
      if (part === 1 && typed.m === '') setPart(0)
      else setTyped(part === 0 ? { ...typed, h: typed.h.slice(0, -1) } : { ...typed, m: typed.m.slice(0, -1) })
    }
  }

  const switchPart = () => {
    sounds.tap()
    setPart((p) => (p === 0 ? 1 : 0))
  }

  // Tangentbord på datorn.
  const keyHandler = useRef<(e: KeyboardEvent) => void>(() => {})
  const handleKey = (e: KeyboardEvent) => {
    if (phase === 'reveal' && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault()
      flow.advance()
      return
    }
    if (choices) {
      const n = Number(e.key)
      if (n >= 1 && n <= choices.length) choose(choices[n - 1].label)
      return
    }
    if (/^\d$/.test(e.key)) type(e.key)
    else if ((e.key === ',' || e.key === '.') && typed?.kind === 'decimal') type(',')
    else if ((e.key === '/' || e.key === ':' || e.key === 'Tab') && (typed?.kind === 'fraction' || typed?.kind === 'time')) {
      e.preventDefault()
      setPart(1)
    } else if (e.key === 'Backspace') backspace()
    else if (e.key === 'Enter') submit()
  }
  useEffect(() => {
    keyHandler.current = handleKey
  })
  useEffect(() => {
    const listener = (e: KeyboardEvent) => keyHandler.current(e)
    window.addEventListener('keydown', listener)
    return () => window.removeEventListener('keydown', listener)
  }, [])

  const slot = <AnswerSlot task={task} typed={typed} part={part} done={done} onPart={setPart} />
  const inline = task.text?.includes('?')
  // Egen svarsrad när svaret inte står i texten: "x = ?", klocktiden, bråket – men inte bara ett
  // frågetecken medan man väljer, och inget när svaret var ett ord ("halv fyra" står i lösningen).
  const correctChoice = choices?.find((c) => c.correct)
  const showAnswerLine =
    !inline && (task.answerPrefix || !choices || done) && !(done && task.answer.kind === 'choice' && !correctChoice?.frac)
  const wrongLeft = (choices ?? []).filter((c) => !c.correct && !removed.includes(c.label))

  return (
    <>
      <div className={`card topic-card phase-${phase}`} key={attempts}>
        {task.prompt && <p className="topic-prompt">{task.prompt}</p>}
        {task.picture && <PictureView picture={task.picture} reveal={phase === 'reveal'} />}
        {task.text && (
          <div className={`problem topic-text ${task.text.length > 14 ? 'problem-long' : ''}`}>
            <RichText text={task.text} slot={slot} />
          </div>
        )}
        {showAnswerLine && (
          <div className="problem topic-answer-line">
            {task.answerPrefix && <span>{task.answerPrefix} </span>}
            {slot}
          </div>
        )}
        <div className="message">{message}</div>
        {phase === 'correct' && streak >= 2 && <div className="streak">🔥 {streak} rätt i rad!</div>}
        {phase === 'reveal' && <div className="solution">{task.solution}</div>}
      </div>

      <div className="answer-area">
        {phase === 'reveal' ? (
          <button className="big-btn primary" onClick={flow.advance}>
            Nästa ➜
          </button>
        ) : choices ? (
          <>
            <div className={`choices ${choices.length === 3 ? 'choices-3' : ''}`}>
              {choices.map((c) => {
                const gone = removed.includes(c.label)
                const isRight = phase === 'correct' && c.correct
                return (
                  <button
                    key={c.label}
                    className={`choice ${c.label.length > 6 ? 'choice-words' : ''} ${gone ? 'choice-gone' : ''} ${isRight ? 'choice-right' : ''}`}
                    disabled={gone || done}
                    onClick={() => choose(c.label)}
                  >
                    {c.frac ? <Frac num={c.frac[0]} den={c.frac[1]} /> : c.label}
                  </button>
                )
              })}
            </div>
            {choices.length >= 4 && (
              <button
                className="fifty"
                disabled={fiftyUsed || done || wrongLeft.length <= 1}
                onClick={() => {
                  sounds.tap()
                  setFiftyUsed(true)
                  setRemoved((r) => [...r, ...shuffle(wrongLeft).slice(0, wrongLeft.length - 1).map((c) => c.label)])
                }}
              >
                ✨ 50/50
              </button>
            )}
          </>
        ) : (
          typed && (
            <Numpad
              extra={
                typed.kind === 'decimal'
                  ? { label: ',', aria: 'Komma', onPress: () => type(',') }
                  : typed.kind === 'fraction'
                    ? { label: part === 0 ? '↓' : '↑', aria: part === 0 ? 'Till nämnaren' : 'Till täljaren', onPress: switchPart }
                    : typed.kind === 'time'
                      ? { label: part === 0 ? ':' : '←', aria: part === 0 ? 'Till minuterna' : 'Till timmarna', onPress: switchPart }
                      : undefined
              }
              disabled={done}
              canSubmit={isComplete(typed)}
              onDigit={type}
              onBack={backspace}
              onOk={submit}
            />
          )
        )}
      </div>
    </>
  )
}

/** Svarsrutan: ett tal, ett bråk (två rutor) eller en klocktid (två rutor). Null = ingen ruta. */
function AnswerSlot({ task, typed, part, done, onPart }: { task: Task; typed: Typed | null; part: Part; done: boolean; onPart: (p: Part) => void }) {
  const { answer } = task
  const correct = task.choices?.find((c) => c.correct)
  if (done) {
    if (answer.kind === 'fraction') return <span className="slot slot-frac"><Frac num={answer.num} den={answer.den} /></span>
    if (answer.kind !== 'choice') return <span className="slot">{fmtAnswer(answer)}</span>
    return correct?.frac ? <span className="slot slot-frac"><Frac num={correct.frac[0]} den={correct.frac[1]} /></span> : null
  }
  // Man väljer bland alternativ ⇒ bara ett frågetecken.
  if (task.choices || !typed) return <span className="slot">?</span>
  const box = (value: string, p: Part, placeholder = '?') => (
    <span className={`slot slot-part ${part === p ? 'slot-active' : ''} ${value ? 'slot-filled' : ''}`} onClick={() => onPart(p)}>
      {value || placeholder}
    </span>
  )
  switch (typed.kind) {
    case 'int':
    case 'decimal':
      return <span className={`slot ${typed.text ? 'slot-filled' : ''}`}>{typed.text || '?'}</span>
    case 'fraction':
      return <span className="slot-frac"><Frac num={box(typed.num, 0)} den={box(typed.den, 1)} /></span>
    case 'time':
      return (
        <span className="slot-time">
          {box(typed.h, 0, '–')}:{box(typed.m, 1, '––')}
        </span>
      )
  }
}

interface NumpadProps {
  extra?: { label: string; aria: string; onPress: () => void }
  disabled: boolean
  canSubmit: boolean
  onDigit: (d: string) => void
  onBack: () => void
  onOk: () => void
}

function Numpad({ extra, disabled, canSubmit, onDigit, onBack, onOk }: NumpadProps) {
  const back = (
    <button className="numpad-back" onClick={onBack} disabled={disabled} aria-label="Sudda">
      ⌫
    </button>
  )
  const ok = (
    <button className={`numpad-ok ${extra ? 'numpad-wide' : ''}`} onClick={onOk} disabled={disabled || !canSubmit} aria-label="Svara">
      ✓
    </button>
  )
  return (
    <div className={`numpad ${extra ? 'numpad-compact' : ''}`}>
      {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((d) => (
        <button key={d} onClick={() => onDigit(d)} disabled={disabled}>
          {d}
        </button>
      ))}
      {extra ? (
        <button className="numpad-extra" onClick={extra.onPress} disabled={disabled} aria-label={extra.aria}>
          {extra.label}
        </button>
      ) : (
        back
      )}
      <button onClick={() => onDigit('0')} disabled={disabled}>
        0
      </button>
      {extra ? back : ok}
      {extra && ok}
    </div>
  )
}
