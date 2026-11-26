import { useEffect, useRef, useState } from 'react'
import { Header } from '../../components/Header'
import { Progress } from '../../components/Progress'
import { useGameSettings } from '../../game/gameSettings'
import { randomOf } from '../../game/random'
import { useRoundFlow } from '../../game/useRoundFlow'
import type { RoundSummary } from '../types'
import { SpeakButton } from './GlossRound'
import { alternatives, checkAnswer, display, makeHomeworkRound, type HomeworkQuestion } from './homework'
import { DIRECTION_ICON, type DirectionChoice } from './quiz'

/** Läxglosor: man skriver in egna glosor och blir förhörd genom att skriva svaret. */
export interface HomeworkSettings {
  homework: true
  direction: DirectionChoice
}

interface Props {
  settings: HomeworkSettings
  onFinish: (firstTryCorrect: number, total: number, summary?: RoundSummary) => void
  onQuit: () => void
}

const RETRY = ['Inte riktigt 🤔 Försök igen!', 'Nej – tänk efter en gång till! 🍀']
const ALMOST = 'Nästan! Kolla stavningen ✍️'

/** Förhör på läxglosorna: alla glosor en gång, man skriver svaret. */
export function HomeworkRound({ settings, onFinish, onQuit }: Props) {
  const { homework } = useGameSettings()
  const flow = useRoundFlow<HomeworkQuestion>({
    makeItems: () => makeHomeworkRound(homework, settings.direction),
    onFinish: (firstTryCorrect, total, marks, items) =>
      onFinish(firstTryCorrect, total, {
        saveBest: false,
        practiceMore: items.filter((_, i) => marks[i] !== 'first').map((q) => `${display(q.gloss.en)} = ${display(q.gloss.sv)}`),
      }),
  })
  const { item, phase, done, message, streak, attempts, index } = flow
  // Svaret hör till en fråga – ny fråga ⇒ tom ruta.
  const [typed, setTyped] = useState({ index, text: '' })
  const answer = typed.index === index ? typed.text : ''
  const setAnswer = (text: string) => setTyped({ index, text })
  const input = useRef<HTMLInputElement>(null)

  // Samma ruta används hela rundan, så att tangentbordet på iPhone/iPad
  // inte fälls ner och upp mellan frågorna.
  useEffect(() => input.current?.focus(), [index])

  // Tom lista (borde inte hända – "Förhör mig!" är grå då).
  if (!item) return null
  const { gloss, direction } = item
  const toSwedish = direction === 'en-sv'

  function submit() {
    if (done) {
      if (phase === 'reveal') flow.advance()
      return
    }
    if (answer.trim() === '') return
    const verdict = checkAnswer(answer, toSwedish ? gloss.sv : gloss.en)
    if (verdict === 'right') flow.correct()
    else flow.wrong(verdict === 'almost' ? ALMOST : randomOf(RETRY), 'Så här är det:')
  }

  return (
    <div className="screen round">
      <Header
        onBack={() => {
          if (window.confirm('Vill du avsluta rundan?')) onQuit()
        }}
        backIcon="✕"
        backLabel="Avsluta rundan"
      >
        <span className="chip">📝 Läxglosor</span>
        <span className="chip">{DIRECTION_ICON[settings.direction]}</span>
      </Header>
      <Progress marks={flow.marks} index={index} />

      <div className={`card gloss-card phase-${phase}`} key={`${index}-${attempts}`}>
        <div className="gloss-question">{toSwedish ? 'Vad betyder' : 'Vad heter det på engelska?'}</div>
        <div className="gloss-word">
          {display(toSwedish ? gloss.en : gloss.sv)}
          {toSwedish && <SpeakButton word={alternatives(gloss.en)[0]} />}
          {toSwedish && <span className="gloss-qmark">?</span>}
        </div>
        {message && <div className="message">{message}</div>}
        {done && (
          <div className="gloss-pair">
            <strong>{display(gloss.en)}</strong> = <strong>{display(gloss.sv)}</strong>
            <SpeakButton word={alternatives(gloss.en)[0]} small />
          </div>
        )}
        {phase === 'correct' && streak >= 2 && <div className="streak">🔥 {streak} rätt i rad!</div>}
      </div>

      <form
        className="answer-area homework-answer"
        onSubmit={(e) => {
          e.preventDefault()
          submit()
        }}
      >
        <input
          ref={input}
          className="text-input"
          aria-label={toSwedish ? 'Skriv på svenska' : 'Skriv på engelska'}
          placeholder={toSwedish ? 'Skriv på svenska…' : 'Skriv på engelska…'}
          lang={toSwedish ? 'sv' : 'en'}
          value={answer}
          readOnly={done}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="none"
          spellCheck={false}
          enterKeyHint={phase === 'reveal' ? 'next' : 'done'}
          onChange={(e) => setAnswer(e.target.value)}
        />
        {phase === 'reveal' ? (
          <button type="submit" className="big-btn primary">
            Nästa ➜
          </button>
        ) : (
          <button type="submit" className="big-btn primary" disabled={done || answer.trim() === ''}>
            Svara ✓
          </button>
        )}
      </form>
    </div>
  )
}
