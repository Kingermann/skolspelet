import type { ReactNode } from 'react'
import { useGameSettings } from '../game/gameSettings'
import { LEVEL_STYLE, LEVELS, type Level } from '../game/levels'
import { Header } from './Header'
import { tap } from './tap'

interface Props<Choices extends object> {
  /** Förklaring under varje nivå, t.ex. "Stora och kända länder". */
  texts: Record<Level, string>
  /** Etiketter i sidhuvudet (det man redan valt). */
  chips: ReactNode
  /** Det man valt innan nivån, t.ex. { grade, op }. Rundans inställningar blir dessa + nivån. */
  choices: Choices
  onStart: (settings: Choices & { level: Level }) => void
  onBack: () => void
}

/** "Hur svårt?" – samma nivåskärm för alla kategorier. Visar bästa resultatet för varje nivå. */
export function LevelScreen<Choices extends object>({ texts, chips, choices, onStart, onBack }: Props<Choices>) {
  const { bestStars } = useGameSettings()
  return (
    <div className="screen">
      <Header onBack={onBack}>{chips}</Header>
      <h2 className="question-title">Hur svårt?</h2>
      <div className="grid grid-1">
        {LEVELS.map((level) => {
          const settings = { ...choices, level }
          const best = bestStars(settings)
          return (
            <button
              key={level}
              className="tile tile-row level-tile"
              style={{ background: LEVEL_STYLE[level].color }}
              onClick={tap(() => onStart(settings))}
            >
              <span className="tile-big">{LEVEL_STYLE[level].label}</span>
              <span className="tile-small">{texts[level]}</span>
              {best && (
                <span className="level-best" aria-label={`Ditt bästa: ${best} av 3 stjärnor`}>
                  {[1, 2, 3].map((n) => (
                    <span key={n} className={n <= best ? 'star-on' : 'star-off'}>
                      ★
                    </span>
                  ))}
                </span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
