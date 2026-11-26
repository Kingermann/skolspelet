import { useEffect, useRef, useState } from 'react'
import { Header } from '../../components/Header'
import { Progress } from '../../components/Progress'
import { useGameSettings } from '../../game/gameSettings'
import type { Grade } from '../../game/grades'
import { LEVEL_STYLE, type Level } from '../../game/levels'
import { randomOf } from '../../game/random'
import { canSpeak, speak } from '../../game/speech'
import { useRoundFlow, type RoundFlow } from '../../game/useRoundFlow'
import { DIRECTION_ICON, makeRound, type DirectionChoice, type GlossQuestion } from './quiz'
import type { Gloss } from './words'

/** Spelets egna glosor: årskurs, riktning och nivå. */
export interface GlossSettings {
  grade: Grade
  direction: DirectionChoice
  level: Level
}

interface Props {
  settings: GlossSettings
  onFinish: (firstTryCorrect: number, total: number) => void
  onQuit: () => void
}

const RETRY = ['Inte riktigt 🤔 Försök igen!', 'Nästan! Ett försök till 💪', 'Nej – tänk efter en gång till! 🍀']

/** 🔊-knapp som läser upp ett engelskt ord. */
export function SpeakButton({ word, small = false }: { word: string; small?: boolean }) {
  if (!canSpeak()) return null
  return (
    <button className={`speak-btn ${small ? 'speak-btn-small' : ''}`} onClick={() => speak(word)} aria-label={`Lyssna på ${word}`}>
      🔊
    </button>
  )
}

/** Glosor: översätt mellan engelska och svenska. */
export function GlossRound({ settings, onFinish, onQuit }: Props) {
  const { grade, direction, level } = settings
  const { roundLength } = useGameSettings()
  const flow = useRoundFlow<GlossQuestion>({
    makeItems: () => makeRound(grade, level, direction, roundLength),
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
        <span className="chip">Åk {grade}</span>
        <span className="chip">{DIRECTION_ICON[direction]}</span>
        <span className="chip">{LEVEL_STYLE[level].label}</span>
      </Header>
      <Progress marks={flow.marks} index={flow.index} />
      <GlossQuestionView key={flow.index} flow={flow} />
    </div>
  )
}

function GlossQuestionView({ flow }: { flow: RoundFlow<GlossQuestion> }) {
  const { item, phase, done, message, streak, attempts } = flow
  const { gloss, direction, options } = item
  const toSwedish = direction === 'en-sv'
  const [picked, setPicked] = useState<string[]>([])
  const label = (g: Gloss) => (toSwedish ? g.sv : g.en)

  function choose(option: Gloss) {
    if (done || picked.includes(option.en)) return
    if (option.en === gloss.en) {
      flow.correct()
      return
    }
    setPicked((p) => [...p, option.en])
    flow.wrong(randomOf(RETRY), 'Så här är det:')
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
    if (n >= 1 && n <= options.length) choose(options[n - 1])
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
      <div className={`card gloss-card phase-${phase}`} key={attempts}>
        <div className="gloss-question">{toSwedish ? 'Vad betyder' : 'Vilket är det engelska ordet för'}</div>
        <div className="gloss-word">
          {toSwedish ? gloss.en : gloss.sv}
          {toSwedish && <SpeakButton word={gloss.en} />}
          <span className="gloss-qmark">?</span>
        </div>
        {message && <div className="message">{message}</div>}
        {phase === 'reveal' && (
          <div className="gloss-pair">
            <strong>{gloss.en}</strong> = <strong>{gloss.sv}</strong>
            <SpeakButton word={gloss.en} small />
          </div>
        )}
        {phase === 'correct' && streak >= 2 && <div className="streak">🔥 {streak} rätt i rad!</div>}
      </div>

      <div className="answer-area">
        <div className="gloss-options">
          {options.map((o) => {
            const wrong = picked.includes(o.en)
            const right = (phase === 'correct' || phase === 'reveal') && o.en === gloss.en
            return (
              <button
                key={o.en}
                data-en={o.en}
                className={`choice gloss-option ${wrong ? 'choice-gone' : ''} ${right ? 'choice-right' : ''}`}
                disabled={wrong || done}
                onClick={() => choose(o)}
              >
                {label(o)}
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
