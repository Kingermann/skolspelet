import { useState } from 'react'
import { Header } from '../../components/Header'
import { tap } from '../../components/tap'
import { opsForGrade } from './config'
import { LEVEL_INFO, OP_INFO } from './labels'
import type { MatteSettings } from './MatteRound'
import type { Grade, Level, OpChoice } from './types'

const GRADE_COLORS = ['#ff6f91', '#ff9f1c', '#2ec27e', '#3da5ff', '#9b5cff', '#ff5ccf']

interface Props {
  onStart: (settings: MatteSettings) => void
  onBack: () => void
}

/** Matte: välj årskurs → räknesätt → nivå. */
export function MatteSetup({ onStart, onBack }: Props) {
  const [grade, setGrade] = useState<Grade | null>(null)
  const [op, setOp] = useState<OpChoice | null>(null)

  if (grade === null) return <GradeScreen onBack={onBack} onPick={setGrade} />
  if (op === null) return <OpScreen grade={grade} onBack={() => setGrade(null)} onPick={setOp} />
  return <LevelScreen grade={grade} op={op} onBack={() => setOp(null)} onPick={(level) => onStart({ grade, op, level })} />
}

function GradeScreen({ onPick, onBack }: { onPick: (g: Grade) => void; onBack: () => void }) {
  return (
    <div className="screen">
      <Header onBack={onBack}>
        <span className="chip">🧮 Matte</span>
      </Header>
      <h2 className="question-title">Vilken årskurs?</h2>
      <div className="grid grid-2">
        {([1, 2, 3, 4, 5, 6] as Grade[]).map((g, i) => (
          <button key={g} className="tile" style={{ background: GRADE_COLORS[i] }} onClick={tap(() => onPick(g))}>
            <span className="tile-big">{g}</span>
            <span className="tile-small">årskurs</span>
          </button>
        ))}
      </div>
    </div>
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

function LevelScreen({
  grade,
  op,
  onPick,
  onBack,
}: {
  grade: Grade
  op: OpChoice
  onPick: (l: Level) => void
  onBack: () => void
}) {
  return (
    <div className="screen">
      <Header onBack={onBack}>
        <span className="chip">🧮 Åk {grade}</span>
        <span className="chip">{OP_INFO[op].icon}</span>
      </Header>
      <h2 className="question-title">Hur svårt?</h2>
      <div className="grid grid-1">
        {(Object.keys(LEVEL_INFO) as Level[]).map((l) => (
          <button key={l} className="tile tile-row" style={{ background: LEVEL_INFO[l].color }} onClick={tap(() => onPick(l))}>
            <span className="tile-big">{LEVEL_INFO[l].label}</span>
            <span className="tile-small">{LEVEL_INFO[l].text}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
