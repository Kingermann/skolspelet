import type { ReactNode } from 'react'
import { LEVEL_STYLE, LEVELS, type Level } from '../game/levels'
import { Header } from './Header'
import { tap } from './tap'

interface Props {
  /** Förklaring under varje nivå, t.ex. "Stora och kända länder". */
  texts: Record<Level, string>
  /** Etiketter i sidhuvudet (det man redan valt). */
  chips: ReactNode
  onPick: (level: Level) => void
  onBack: () => void
}

/** "Hur svårt?" – samma nivåskärm för alla kategorier. */
export function LevelScreen({ texts, chips, onPick, onBack }: Props) {
  return (
    <div className="screen">
      <Header onBack={onBack}>{chips}</Header>
      <h2 className="question-title">Hur svårt?</h2>
      <div className="grid grid-1">
        {LEVELS.map((l) => (
          <button key={l} className="tile tile-row" style={{ background: LEVEL_STYLE[l].color }} onClick={tap(() => onPick(l))}>
            <span className="tile-big">{LEVEL_STYLE[l].label}</span>
            <span className="tile-small">{texts[l]}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
