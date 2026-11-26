import { useState } from 'react'
import { Header } from '../../components/Header'
import { LevelScreen } from '../../components/LevelScreen'
import { tap } from '../../components/tap'
import type { Level } from '../../game/levels'
import { CONTINENTS, type Continent } from './countries'
import { GEO_MODES, type GeoMode, type GeoSettings } from './settings'

const LEVEL_TEXTS: Record<GeoMode, Record<Level, string>> = {
  karta: { latt: 'Stora och kända länder', medel: 'Lite mindre länder', svar: 'Små och kluriga länder' },
  flaggor: { latt: 'Kända länders flaggor', medel: 'Flaggor som liknar varandra', svar: 'Kluriga flaggor – titta noga!' },
}

/** Geografi: välj spelläge → världsdel → nivå. */
export function GeoSetup({ onStart, onBack }: { onStart: (settings: GeoSettings) => void; onBack: () => void }) {
  const [mode, setMode] = useState<GeoMode | null>(null)
  const [continent, setContinent] = useState<Continent | null>(null)

  if (mode === null) {
    return (
      <div className="screen">
        <Header onBack={onBack}>
          <span className="chip">🌍 Geografi</span>
        </Header>
        <h2 className="question-title">Vad vill du öva på?</h2>
        <div className="grid grid-1">
          {(Object.keys(GEO_MODES) as GeoMode[]).map((m) => (
            <button key={m} className="tile tile-row tile-mode" style={{ background: GEO_MODES[m].color }} onClick={tap(() => setMode(m))}>
              <span className="tile-big">
                {GEO_MODES[m].icon} {GEO_MODES[m].label}
              </span>
              <span className="tile-small">{GEO_MODES[m].text}</span>
            </button>
          ))}
        </div>
      </div>
    )
  }

  const modeChip = <span className="chip">{GEO_MODES[mode].icon}</span>

  if (continent === null) {
    return (
      <div className="screen">
        <Header onBack={() => setMode(null)}>{modeChip}</Header>
        <h2 className="question-title">Vilken världsdel?</h2>
        <div className="grid grid-2">
          {(Object.keys(CONTINENTS) as Continent[]).map((c) => (
            <button key={c} className="tile" style={{ background: CONTINENTS[c].color }} onClick={tap(() => setContinent(c))}>
              <span className="tile-big">{CONTINENTS[c].icon}</span>
              <span className="tile-small">{CONTINENTS[c].name}</span>
            </button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <LevelScreen
      texts={LEVEL_TEXTS[mode]}
      chips={
        <>
          {modeChip}
          <span className="chip">
            {CONTINENTS[continent].icon} {CONTINENTS[continent].name}
          </span>
        </>
      }
      onBack={() => setContinent(null)}
      choices={{ mode, continent }}
      onStart={onStart}
    />
  )
}
