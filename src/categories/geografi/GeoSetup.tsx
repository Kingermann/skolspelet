import { Header } from '../../components/Header'
import { tap } from '../../components/tap'
import { CONTINENTS, type Continent } from './countries'
import type { GeoSettings } from './MapRound'

/** Geografi: välj världsdel. */
export function GeoSetup({ onStart, onBack }: { onStart: (settings: GeoSettings) => void; onBack: () => void }) {
  return (
    <div className="screen">
      <Header onBack={onBack}>
        <span className="chip">🌍 Geografi</span>
      </Header>
      <h2 className="question-title">Vilken världsdel?</h2>
      <div className="grid grid-2">
        {(Object.keys(CONTINENTS) as Continent[]).map((c) => (
          <button key={c} className="tile" style={{ background: CONTINENTS[c].color }} onClick={tap(() => onStart({ continent: c }))}>
            <span className="tile-big">{CONTINENTS[c].icon}</span>
            <span className="tile-small">{CONTINENTS[c].name}</span>
          </button>
        ))}
      </div>
      <p className="hint-text">Du får ett land – tryck där det ligger på kartan!</p>
    </div>
  )
}
