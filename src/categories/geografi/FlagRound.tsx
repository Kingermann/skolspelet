import 'flag-icons/css/flag-icons.min.css'
import { useEffect, useRef, useState } from 'react'
import { Header } from '../../components/Header'
import { Progress } from '../../components/Progress'
import { useGameSettings } from '../../game/gameSettings'
import { LEVEL_STYLE } from '../../game/levels'
import { useRoundFlow, type RoundFlow } from '../../game/useRoundFlow'
import { CONTINENTS } from './countries'
import { countriesIn, makeFlagOptions, type FlagCountry } from './flags'
import type { GeoSettings } from './settings'
import { pickRoundCountries } from './round'

interface Item {
  country: FlagCountry
  options: FlagCountry[]
}

/** Svensk genitiv: Polen ⇒ Polens, Schweiz ⇒ Schweiz, USA ⇒ USA:s. */
function genitive(name: string): string {
  if (name === name.toUpperCase()) return `${name}:s`
  if (/[sxz]$/i.test(name)) return name
  return `${name}s`
}

/** En flagga (officiell design från paketet flag-icons). */
export function Flag({ iso, className = '' }: { iso: string; className?: string }) {
  return <span className={`fi fi-${iso} flag ${className}`} role="img" aria-label="flagga" />
}

interface Props {
  settings: GeoSettings
  onFinish: (firstTryCorrect: number, total: number) => void
  onQuit: () => void
}

/** Flaggquiz: man ser en flagga och väljer rätt land bland fyra. */
export function FlagRound({ settings, onFinish, onQuit }: Props) {
  const { continent, level } = settings
  const info = CONTINENTS[continent]
  const all = countriesIn(continent)
  const { roundLength } = useGameSettings()
  const toItem = (country: FlagCountry): Item => ({ country, options: makeFlagOptions(country, all, level) })

  const flow = useRoundFlow<Item>({
    makeItems: () => pickRoundCountries(all, level, roundLength).map(toItem),
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
        <span className="chip">🚩 {info.name}</span>
        <span className="chip">{LEVEL_STYLE[level].label}</span>
      </Header>
      <Progress marks={flow.marks} index={flow.index} />
      <FlagQuestion key={flow.index} flow={flow} />
    </div>
  )
}

function FlagQuestion({ flow }: { flow: RoundFlow<Item> }) {
  const { item, phase, done, message, streak, attempts } = flow
  const [picked, setPicked] = useState<FlagCountry[]>([])
  const lastWrong = picked.at(-1)

  function choose(option: FlagCountry) {
    if (done || picked.some((p) => p.id === option.id)) return
    if (option.id === item.country.id) {
      flow.correct()
      return
    }
    setPicked((p) => [...p, option])
    const text = `Nej! ${genitive(option.sv)} flagga ser ut så här 👉`
    flow.wrong(text, text)
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
      <div className={`card flag-card phase-${phase}`} key={attempts}>
        <div className="flag-question">Vilket land har den här flaggan?</div>
        <Flag iso={item.country.iso} className="flag-big" />
        {message && (
          <div className="message flag-message">
            {phase === 'correct' ? (
              message
            ) : (
              <>
                {message} {lastWrong && <Flag iso={lastWrong.iso} className="flag-mini" />}
              </>
            )}
          </div>
        )}
        {phase === 'reveal' && (
          <div className="solution">
            Rätt svar: <strong>{item.country.sv}</strong>
          </div>
        )}
        {phase === 'correct' && streak >= 2 && <div className="streak">🔥 {streak} rätt i rad!</div>}
      </div>

      <div className="answer-area">
        <div className="flag-options">
          {item.options.map((o) => {
            const wrong = picked.some((p) => p.id === o.id)
            const right = (phase === 'correct' || phase === 'reveal') && o.id === item.country.id
            return (
              <button
                key={o.id}
                data-iso={o.iso}
                className={`choice flag-option ${wrong ? 'choice-gone' : ''} ${right ? 'choice-right' : ''}`}
                disabled={wrong || done}
                onClick={() => choose(o)}
              >
                {o.sv}
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
