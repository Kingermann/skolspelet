import { useState } from 'react'
import { GradeScreen } from '../../components/GradeScreen'
import { LevelScreen } from '../../components/LevelScreen'
import type { Grade } from '../../game/grades'
import type { Level } from '../../game/levels'
import type { SvenskaSettings } from './SpellingRound'

const LEVEL_TEXTS: Record<Level, string> = {
  latt: 'Felen syns tydligt',
  medel: 'Vanliga stavningsfel',
  svar: 'Svåra ord och luriga fel',
}

/** Svenska: välj årskurs → nivå. */
export function SvenskaSetup({ onStart, onBack }: { onStart: (settings: SvenskaSettings) => void; onBack: () => void }) {
  const [grade, setGrade] = useState<Grade | null>(null)

  if (grade === null) return <GradeScreen chips={<span className="chip">📝 Svenska</span>} onBack={onBack} onPick={setGrade} />
  return (
    <LevelScreen
      texts={LEVEL_TEXTS}
      chips={<span className="chip">📝 Åk {grade}</span>}
      onBack={() => setGrade(null)}
      onPick={(level) => onStart({ grade, level })}
    />
  )
}
