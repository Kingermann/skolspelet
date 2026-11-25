import { useEffect, useRef, useState } from 'react'
import { Header } from '../../components/Header'
import { Progress } from '../../components/Progress'
import { useGameSettings } from '../../game/gameSettings'
import type { Grade } from '../../game/grades'
import { LEVEL_STYLE, type Level } from '../../game/levels'
import { randomOf } from '../../game/random'
import { useRoundFlow, type RoundFlow } from '../../game/useRoundFlow'
import { TIPS } from './misspell'
import { makeQuestion, pickWords, type SpellingQuestion } from './spelling'

export interface SvenskaSettings {
  grade: Grade
  level: Level
}

interface Props {
  settings: SvenskaSettings
  onFinish: (firstTryCorrect: number, total: number) => void
  onQuit: () => void
}

const RETRY = ['Nej, så stavas det inte 🤔 Försök igen!', 'Inte riktigt – titta noga! 🔍', 'Nästan! Ett försök till 💪']

/** Rättstavning: välj det rättstavade ordet bland fyra. */
export function SpellingRound({ settings, onFinish, onQuit }: Props) {
  const { grade, level } = settings
  const { roundLength } = useGameSettings()
  const flow = useRoundFlow<SpellingQuestion>({
    makeItems: () => pickWords(grade, level, roundLength).map((w) => makeQuestion(w, level)),
    onFinish,
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
        <span className="chip">📝 Åk {grade}</span>
        <span className="chip">{LEVEL_STYLE[level].label}</span>
      </Header>
      <Progress marks={flow.marks} index={flow.index} />
      <SpellingQuestionView key={flow.index} flow={flow} />
    </div>
  )
}

function SpellingQuestionView({ flow }: { flow: RoundFlow<SpellingQuestion> }) {
  const { item, phase, done, message, streak, attempts } = flow
  const [picked, setPicked] = useState<string[]>([])

  function choose(option: string) {
    if (done || picked.includes(option)) return
    if (option === item.word) {
      flow.correct()
      return
    }
    setPicked((p) => [...p, option])
    flow.wrong(randomOf(RETRY), 'Så här stavas det:')
  }

  // Tangentbord på datorn: 1–4 väljer alternativ, Enter = Nästa.
  const keyHandler = useRef<(e: KeyboardEvent) => void>(() => {})
  const handleKey = (e: KeyboardEvent) => {
    if (phase === 'reveal' && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault()
      flow.advance()
      return
    }
    const n = Number(e.key)
    if (n >= 1 && n <= item.options.length) choose(item.options[n - 1])
  }
  useEffect(() => {
    keyHandler.current = handleKey
  })
  useEffect(() => {
    const listener = (e: KeyboardEvent) => keyHandler.current(e)
    window.addEventListener('keydown', listener)
    return () => window.removeEventListener('keydown', listener)
  }, [])

  return (
    <>
      <div className={`card spelling-card phase-${phase}`} key={attempts}>
        <div className="spelling-question">Vilket av följande ord är rättstavat?</div>
        {message && <div className="message">{message}</div>}
        {phase === 'reveal' && (
          <>
            <div className="spelling-answer">{item.word}</div>
            <div className="tip">💡 {TIPS[item.tip]}</div>
          </>
        )}
        {phase === 'correct' && streak >= 2 && <div className="streak">🔥 {streak} rätt i rad!</div>}
      </div>

      <div className="answer-area">
        <div className="spelling-options">
          {item.options.map((o) => {
            const wrong = picked.includes(o)
            const right = (phase === 'correct' || phase === 'reveal') && o === item.word
            return (
              <button
                key={o}
                className={`choice spelling-option ${wrong ? 'choice-gone' : ''} ${right ? 'choice-right' : ''}`}
                disabled={wrong || done}
                onClick={() => choose(o)}
              >
                {o}
              </button>
            )
          })}
        </div>
        {phase === 'reveal' && (
          <button className="big-btn primary" onClick={flow.advance}>
            Nästa ➜
          </button>
        )}
      </div>
    </>
  )
}
