import type { ReactNode } from 'react'
import { GRADE_COLORS, GRADES, type Grade } from '../game/grades'
import { Header } from './Header'
import { tap } from './tap'

/** "Vilken årskurs?" – samma skärm för alla kategorier som använder årskurs. */
export function GradeScreen({ chips, onPick, onBack }: { chips: ReactNode; onPick: (g: Grade) => void; onBack: () => void }) {
  return (
    <div className="screen">
      <Header onBack={onBack}>{chips}</Header>
      <h2 className="question-title">Vilken årskurs?</h2>
      <div className="grid grid-2">
        {GRADES.map((g) => (
          <button key={g} className="tile" style={{ background: GRADE_COLORS[g] }} onClick={tap(() => onPick(g))}>
            <span className="tile-big">{g}</span>
            <span className="tile-small">årskurs</span>
          </button>
        ))}
      </div>
    </div>
  )
}
