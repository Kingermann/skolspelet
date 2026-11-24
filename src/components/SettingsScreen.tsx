import { ROUND_LENGTH_OPTIONS } from '../game/constants'
import { useGameSettings } from '../game/gameSettings'
import { Header } from './Header'
import { tap } from './tap'

/** ⚙️ Inställningar för hela appen. */
export function SettingsScreen({ onBack }: { onBack: () => void }) {
  const { roundLength, setRoundLength } = useGameSettings()
  return (
    <div className="screen">
      <Header onBack={onBack}>
        <span className="chip">⚙️ Inställningar</span>
      </Header>
      <h2 className="question-title">Hur många frågor per runda?</h2>
      <div className="length-options">
        {ROUND_LENGTH_OPTIONS.map((n) => (
          <button
            key={n}
            className={`length-option ${n === roundLength ? 'selected' : ''}`}
            onClick={tap(() => setRoundLength(n))}
            aria-pressed={n === roundLength}
          >
            {n}
          </button>
        ))}
      </div>
      <p className="hint-text">Gäller alla kategorier tills du stänger spelet.</p>
      <button className="big-btn primary" onClick={tap(onBack)}>
        Klar ✓
      </button>
    </div>
  )
}
