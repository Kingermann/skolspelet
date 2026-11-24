import { useState } from 'react'
import { Header } from '../../components/Header'
import { LevelScreen } from '../../components/LevelScreen'
import { tap } from '../../components/tap'
import type { Level } from '../../game/levels'
import { CONTINENTS, type Continent } from './countries'
import type { GeoSettings } from './MapRound'

const LEVEL_TEXTS: Record<Level, string> = {
  latt: 'Stora och kända länder',
  medel: 'Lite mindre länder',
  svar: 'Små och kluriga länder',
}

/** Geografi: välj världsdel → nivå. */
export function GeoSetup({ onStart, onBack }: { onStart: (settings: GeoSettings) => void; onBack: () => void }) {
  const [continent, setContinent] = useState<Continent | null>(null)

  if (continent === null) {
    return (
      <div className="screen">
        <Header onBack={onBack}>
          <span className="chip">🌍 Geografi</span>
        </Header>
        <h2 className="question-title">Vilken världsdel?</h2>
        <div className="grid grid-2">
          {(Object.keys(CONTINENTS) as Continent[]).map((c) => (
            <button key={c} className="tile" style={{ background: CONTINENTS[c].color }} onClick={tap(() => setContinent(c))}>
              <span className="tile-big">{CONTINENTS[c].icon}</span>
              <span className="tile-small">{CONTINENTS[c].name}</span>
            </button>
          ))}
        </div>
        <p className="hint-text">Du får ett land – tryck där det ligger på kartan!</p>
      </div>
    )
  }

  const info = CONTINENTS[continent]
  return (
    <LevelScreen
      texts={LEVEL_TEXTS}
      chips={
        <span className="chip">
          {info.icon} {info.name}
        </span>
      }
      onBack={() => setContinent(null)}
      onPick={(level) => onStart({ continent, level })}
    />
  )
}
