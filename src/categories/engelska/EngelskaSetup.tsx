import { useState } from 'react'
import { GradeScreen } from '../../components/GradeScreen'
import { Header } from '../../components/Header'
import { LevelScreen } from '../../components/LevelScreen'
import { tap } from '../../components/tap'
import type { Grade } from '../../game/grades'
import type { Level } from '../../game/levels'
import type { EngelskaSettings } from './EngelskaPlay'
import { HomeworkSetup } from './HomeworkSetup'
import type { DirectionChoice } from './quiz'

const LEVEL_TEXTS: Record<Level, string> = {
  latt: 'Alternativ från olika områden',
  medel: 'Alternativ från samma område',
  svar: 'Svåra glosor och förväxlingsord',
}

const DIRECTIONS: Record<DirectionChoice, { icon: string; label: string; text: string; color: string }> = {
  'en-sv': { icon: '🇬🇧 → 🇸🇪', label: 'Engelska till svenska', text: 'Vad betyder frog?', color: '#3da5ff' },
  'sv-en': { icon: '🇸🇪 → 🇬🇧', label: 'Svenska till engelska', text: 'Vad heter groda på engelska?', color: '#9b5cff' },
  mix: { icon: '🔀', label: 'Blandat', text: 'Båda hållen om vartannat', color: '#ff6f91' },
}

type Source = 'spelet' | 'laxa'

/** Engelska: spelets glosor (årskurs → riktning → nivå) eller mina läxglosor. */
export function EngelskaSetup({ onStart, onBack }: { onStart: (settings: EngelskaSettings) => void; onBack: () => void }) {
  const [source, setSource] = useState<Source | null>(null)
  const [grade, setGrade] = useState<Grade | null>(null)
  const [direction, setDirection] = useState<DirectionChoice | null>(null)

  if (source === null) {
    return (
      <div className="screen">
        <Header onBack={onBack}>
          <span className="chip">🇬🇧 Engelska</span>
        </Header>
        <h2 className="question-title">Vilka glosor?</h2>
        <div className="grid grid-1">
          <button className="tile tile-row tile-mode" style={{ background: '#3da5ff' }} onClick={tap(() => setSource('spelet'))}>
            <span className="tile-big">📚 Spelets glosor</span>
            <span className="tile-small">Glosor för din årskurs</span>
          </button>
          <button className="tile tile-row tile-mode" style={{ background: '#ff9f1c' }} onClick={tap(() => setSource('laxa'))}>
            <span className="tile-big">📝 Mina läxglosor</span>
            <span className="tile-small">Skriv in veckans glosor och bli förhörd</span>
          </button>
        </div>
      </div>
    )
  }

  if (source === 'laxa') return <HomeworkSetup onStart={onStart} onBack={() => setSource(null)} />

  if (grade === null) {
    return <GradeScreen chips={<span className="chip">🇬🇧 Engelska</span>} onBack={() => setSource(null)} onPick={setGrade} />
  }

  const gradeChip = <span className="chip">🇬🇧 Åk {grade}</span>
  if (direction === null) {
    return (
      <div className="screen">
        <Header onBack={() => setGrade(null)}>{gradeChip}</Header>
        <h2 className="question-title">Åt vilket håll?</h2>
        <div className="grid grid-1">
          {(Object.keys(DIRECTIONS) as DirectionChoice[]).map((d) => (
            <button key={d} className="tile tile-row tile-mode" style={{ background: DIRECTIONS[d].color }} onClick={tap(() => setDirection(d))}>
              <span className="tile-big">{DIRECTIONS[d].icon}</span>
              <span className="tile-small">
                {DIRECTIONS[d].label} – {DIRECTIONS[d].text}
              </span>
            </button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <LevelScreen
      texts={LEVEL_TEXTS}
      chips={
        <>
          {gradeChip}
          <span className="chip">{DIRECTIONS[direction].icon}</span>
        </>
      }
      onBack={() => setDirection(null)}
      choices={{ grade, direction }}
      onStart={onStart}
    />
  )
}
