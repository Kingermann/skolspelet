import { useState } from 'react'
import { GradeScreen } from '../../components/GradeScreen'
import { Header } from '../../components/Header'
import { tap } from '../../components/tap'
import { opsForGrade } from './config'
import { LevelScreen } from '../../components/LevelScreen'
import { LEVEL_TEXTS, OP_INFO } from './labels'
import type { MatteSettings } from './MatteRound'
import type { Grade, OpChoice } from './types'

interface Props {
  onStart: (settings: MatteSettings) => void
  onBack: () => void
}

/** Matte: välj årskurs → räknesätt → nivå. */
export function MatteSetup({ onStart, onBack }: Props) {
  const [grade, setGrade] = useState<Grade | null>(null)
  const [op, setOp] = useState<OpChoice | null>(null)

  if (grade === null) return <GradeScreen chips={<span className="chip">🧮 Matte</span>} onBack={onBack} onPick={setGrade} />
  if (op === null) return <OpScreen grade={grade} onBack={() => setGrade(null)} onPick={setOp} />
  return (
    <LevelScreen
      texts={LEVEL_TEXTS}
      chips={
        <>
          <span className="chip">🧮 Åk {grade}</span>
          <span className="chip">{OP_INFO[op].icon}</span>
        </>
      }
      onBack={() => setOp(null)}
      onPick={(level) => onStart({ grade, op, level })}
    />
  )
}


function OpScreen({ grade, onPick, onBack }: { grade: Grade; onPick: (op: OpChoice) => void; onBack: () => void }) {
  const ops: OpChoice[] = [...opsForGrade(grade), 'mix']
  return (
    <div className="screen">
      <Header onBack={onBack}>
        <span className="chip">🧮 Åk {grade}</span>
      </Header>
      <h2 className="question-title">Vad vill du räkna?</h2>
      <div className="grid grid-2">
        {ops.map((op) => (
          <button
            key={op}
            className={`tile ${op === 'mix' ? 'tile-wide' : ''}`}
            style={{ background: OP_INFO[op].color }}
            onClick={tap(() => onPick(op))}
          >
            <span className="tile-big">{OP_INFO[op].icon}</span>
            <span className="tile-small">{OP_INFO[op].label}</span>
          </button>
        ))}
      </div>
      {grade === 6 && <p className="hint-text">Tips: på Medel och Svår i åk 6 tränar du prioriteringsregler!</p>}
    </div>
  )
}
