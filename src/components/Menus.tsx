import { opsForGrade } from '../game/config'
import { LEVEL_INFO, OP_INFO } from '../game/labels'
import { sounds } from '../game/sound'
import { STICKERS } from '../game/stickers'
import type { Grade, Level, OpChoice } from '../game/types'
import { Header } from './Header'

const tap = (fn: () => void) => () => {
  sounds.tap()
  fn()
}

// ---------- Start ----------

export function StartScreen({ albumCount, onPlay, onAlbum }: { albumCount: number; onPlay: () => void; onAlbum: () => void }) {
  return (
    <div className="screen">
      <Header />
      <div className="start">
        <div className="logo" aria-hidden>
          <span>🧮</span>
        </div>
        <h1 className="title">Mattespelet</h1>
        <p className="subtitle">Räkna, samla stjärnor och klistermärken!</p>
        <button className="big-btn primary" onClick={tap(onPlay)}>
          Spela! ▶
        </button>
        <button className="big-btn secondary" onClick={tap(onAlbum)}>
          📒 Mitt album <span className="badge">{albumCount}</span>
        </button>
      </div>
    </div>
  )
}

// ---------- Välj årskurs ----------

const GRADE_COLORS = ['#ff6f91', '#ff9f1c', '#2ec27e', '#3da5ff', '#9b5cff', '#ff5ccf']

export function GradeScreen({ onPick, onBack }: { onPick: (g: Grade) => void; onBack: () => void }) {
  return (
    <div className="screen">
      <Header onBack={onBack} />
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

// ---------- Välj räknesätt ----------

export function OpScreen({ grade, onPick, onBack }: { grade: Grade; onPick: (op: OpChoice) => void; onBack: () => void }) {
  const ops: OpChoice[] = [...opsForGrade(grade), 'mix']
  return (
    <div className="screen">
      <Header onBack={onBack}>
        <span className="chip">Åk {grade}</span>
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

// ---------- Välj nivå ----------

export function LevelScreen({
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
        <span className="chip">Åk {grade}</span>
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

// ---------- Album ----------

export function AlbumScreen({ album, onBack }: { album: string[]; onBack: () => void }) {
  const unique = new Set(album)
  return (
    <div className="screen">
      <Header onBack={onBack}>
        <span className="chip">
          {unique.size} / {STICKERS.length}
        </span>
      </Header>
      <h2 className="question-title">📒 Mitt album</h2>
      {album.length === 0 && <p className="hint-text">Spela en runda för att få ditt första klistermärke!</p>}
      <div className="album">
        {STICKERS.map((s) => {
          const count = album.filter((a) => a === s).length
          return (
            <div key={s} className={`sticker ${count > 0 ? 'owned' : 'missing'}`}>
              {count > 0 ? s : '?'}
              {count > 1 && <span className="sticker-count">×{count}</span>}
            </div>
          )
        })}
      </div>
    </div>
  )
}
