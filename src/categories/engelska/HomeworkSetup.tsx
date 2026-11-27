import { useRef, useState } from 'react'
import { Header } from '../../components/Header'
import { tap } from '../../components/tap'
import { useGameSettings } from '../../game/gameSettings'
import { HOMEWORK_TEXT_MAX, makeId, type HomeworkGloss } from '../../game/profiles'
import { alternatives, display, glossProblem } from './homework'
import type { HomeworkSettings } from './HomeworkRound'
import type { DirectionChoice } from './quiz'
import { SwedishLetters } from './SwedishLetters'

const DIRECTIONS: { choice: DirectionChoice; label: string }[] = [
  { choice: 'en-sv', label: '🇬🇧 → 🇸🇪' },
  { choice: 'sv-en', label: '🇸🇪 → 🇬🇧' },
  { choice: 'mix', label: '🔀 Blandat' },
]

/** 📝 Mina läxglosor: se listan, välj riktning och bli förhörd – eller ändra glosorna. */
export function HomeworkSetup({ onStart, onBack }: { onStart: (settings: HomeworkSettings) => void; onBack: () => void }) {
  const { homework } = useGameSettings()
  const [editing, setEditing] = useState(false)
  const [direction, setDirection] = useState<DirectionChoice>('mix')

  if (editing) return <HomeworkEditor onDone={() => setEditing(false)} />

  return (
    <div className="screen">
      <Header onBack={onBack}>
        <span className="chip">📝 Mina läxglosor</span>
      </Header>
      {homework.length === 0 ? (
        <>
          <h2 className="question-title">Inga glosor än</h2>
          <p className="hint-text">Skriv in veckans glosor, så kan du bli förhörd på dem.</p>
          <button className="big-btn primary" onClick={tap(() => setEditing(true))}>
            ✏️ Skriv in glosor
          </button>
        </>
      ) : (
        <>
          <h2 className="question-title">Veckans glosor</h2>
          <GlossList glosses={homework} />
          <p className="field-label">Åt vilket håll?</p>
          <div className="direction-options">
            {DIRECTIONS.map((d) => (
              <button
                key={d.choice}
                className={`length-option direction-option ${d.choice === direction ? 'selected' : ''}`}
                aria-pressed={d.choice === direction}
                onClick={tap(() => setDirection(d.choice))}
              >
                {d.label}
              </button>
            ))}
          </div>
          <button className="big-btn primary" onClick={tap(() => onStart({ homework: true, direction }))}>
            Förhör mig! 🎯
          </button>
          <button className="big-btn secondary" onClick={tap(() => setEditing(true))}>
            ✏️ Ändra glosor
          </button>
        </>
      )}
    </div>
  )
}

function GlossList({ glosses, onRemove }: { glosses: HomeworkGloss[]; onRemove?: (id: string) => void }) {
  return (
    <ul className="homework-list">
      {glosses.map((g) => (
        <li key={g.id}>
          <span className="homework-en">{display(g.en)}</span>
          <span className="homework-sv">{display(g.sv)}</span>
          {onRemove && (
            <button className="homework-remove" aria-label={`Ta bort ${g.en}`} onClick={tap(() => onRemove(g.id))}>
              🗑️
            </button>
          )}
        </li>
      ))}
    </ul>
  )
}

/** ✏️ Skriv in glosor (engelska + svenska), ta bort enstaka eller töm hela listan. */
function HomeworkEditor({ onDone }: { onDone: () => void }) {
  const { homework, setHomework } = useGameSettings()
  const [en, setEn] = useState('')
  const [sv, setSv] = useState('')
  const enInput = useRef<HTMLInputElement>(null)
  const svInput = useRef<HTMLInputElement>(null)
  const problem = glossProblem(en, sv, homework)
  // "Skriv både …" behöver inte visas – knappen är grå tills båda rutorna är ifyllda.
  const showProblem = problem && alternatives(en).length > 0 && alternatives(sv).length > 0

  function add() {
    if (problem) return
    // Nyaste överst, så att man ser att det kom med.
    setHomework([{ id: makeId(), en: en.trim(), sv: sv.trim() }, ...homework])
    setEn('')
    setSv('')
    enInput.current?.focus()
  }

  function clearAll() {
    if (window.confirm(`Ta bort alla ${homework.length} glosor?`)) setHomework([])
  }

  return (
    <div className="screen">
      <Header onBack={onDone}>
        <span className="chip">✏️ Ändra glosor</span>
      </Header>
      <form
        className="profile-form"
        onSubmit={(e) => {
          e.preventDefault()
          add()
        }}
      >
        <label className="field-label" htmlFor="gloss-en">
          🇬🇧 Engelska
        </label>
        <input
          id="gloss-en"
          ref={enInput}
          className="text-input"
          lang="en"
          value={en}
          maxLength={HOMEWORK_TEXT_MAX}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="none"
          spellCheck={false}
          enterKeyHint="next"
          onChange={(e) => setEn(e.target.value)}
          onKeyDown={(e) => {
            // Enter i engelska rutan hoppar till den svenska.
            if (e.key === 'Enter') {
              e.preventDefault()
              svInput.current?.focus()
            }
          }}
        />
        <label className="field-label" htmlFor="gloss-sv">
          🇸🇪 Svenska
        </label>
        <input
          id="gloss-sv"
          ref={svInput}
          className="text-input"
          lang="sv"
          value={sv}
          maxLength={HOMEWORK_TEXT_MAX}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="none"
          spellCheck={false}
          enterKeyHint="done"
          onChange={(e) => setSv(e.target.value)}
        />
        <SwedishLetters input={svInput} value={sv} onChange={setSv} />
        {showProblem && <p className="form-problem">{problem}</p>}
        <p className="hint-text">Flera rätta svar? Skriv / emellan, t.ex. "you are / you're".</p>
        <button type="submit" className="big-btn primary" disabled={problem !== null}>
          ➕ Lägg till
        </button>
      </form>

      {homework.length > 0 && (
        <>
          <h3 className="album-section">Listan ({homework.length})</h3>
          <GlossList glosses={homework} onRemove={(id) => setHomework(homework.filter((g) => g.id !== id))} />
          <button className="big-btn secondary" onClick={tap(onDone)}>
            Klar ✓
          </button>
          <button className="text-btn danger" onClick={tap(clearAll)}>
            🗑️ Töm listan
          </button>
        </>
      )}
    </div>
  )
}
