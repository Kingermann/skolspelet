import { useEffect, useState } from 'react'
import { Header } from '../../components/Header'
import { Progress } from '../../components/Progress'
import { useGameSettings } from '../../game/gameSettings'
import { LEVEL_STYLE, type Level } from '../../game/levels'
import { useRoundFlow } from '../../game/useRoundFlow'
import { CONTINENTS } from './countries'
import { buildContinentMap, loadTopology, type ContinentMap, type MapShape } from './map'
import { pickRoundCountries } from './round'
import type { GeoSettings } from './settings'
import { WorldMap } from './WorldMap'


interface Props {
  settings: GeoSettings
  onFinish: (firstTryCorrect: number, total: number) => void
  onQuit: () => void
}

/** Kartspelet: man får ett land och ska trycka där det ligger. */
export function MapRound({ settings, onFinish, onQuit }: Props) {
  const [map, setMap] = useState<ContinentMap | null>(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    let alive = true
    loadTopology()
      .then((topology) => alive && setMap(buildContinentMap(topology, settings.continent)))
      .catch(() => alive && setError(true))
    return () => {
      alive = false
    }
  }, [settings.continent])

  const header = <RoundHeader settings={settings} onQuit={onQuit} />
  if (!map) {
    return (
      <div className="screen round">
        {header}
        <p className="loading">{error ? 'Kartan gick inte att ladda 😕' : 'Laddar kartan… 🗺️'}</p>
      </div>
    )
  }
  return <MapGame map={map} level={settings.level} header={header} onFinish={onFinish} />
}

function RoundHeader({ settings, onQuit }: { settings: GeoSettings; onQuit: () => void }) {
  const info = CONTINENTS[settings.continent]
  return (
    <Header
      onBack={() => {
        if (window.confirm('Vill du avsluta rundan?')) onQuit()
      }}
      backIcon="✕"
      backLabel="Avsluta rundan"
    >
      <span className="chip">🗺️ {info.name}</span>
      <span className="chip">{LEVEL_STYLE[settings.level].label}</span>
    </Header>
  )
}

interface GameProps {
  map: ContinentMap
  level: Level
  header: React.ReactNode
  onFinish: (firstTryCorrect: number, total: number) => void
}

function MapGame({ map, level, header, onFinish }: GameProps) {
  const { roundLength } = useGameSettings()
  const flow = useRoundFlow<MapShape>({
    makeItems: () => pickRoundCountries(map.shapes.filter((s) => s.kind === 'country'), level, roundLength),
    onFinish,
  })
  const [found, setFound] = useState<Set<string>>(() => new Set())
  const [tapped, setTapped] = useState<{ index: number; id: string } | null>(null)

  const target = flow.item
  const wrongId = tapped?.index === flow.index && flow.phase !== 'correct' ? tapped.id : null

  function tap(id: string) {
    if (flow.done) return
    if (id === target.id) {
      setFound((prev) => new Set(prev).add(id))
      flow.correct()
      return
    }
    const name = map.shapes.find((s) => s.id === id)?.sv ?? 'ett annat land'
    setTapped({ index: flow.index, id })
    flow.wrong(`Det där är ${name} 🤔 Försök igen!`, `Det där är ${name}. Här ligger ${target.sv}! 👉`)
  }

  // Enter/mellanslag = "Nästa" efter att svaret visats (på datorn).
  useEffect(() => {
    if (flow.phase !== 'reveal') return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        flow.advance()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  return (
    <div className="screen round map-round">
      {header}
      <Progress marks={flow.marks} index={flow.index} />

      <div className={`card map-card phase-${flow.phase}`} key={`${flow.index}-${flow.attempts}`}>
        <div className="map-question">
          Var ligger <strong>{target.sv}</strong>?
        </div>
        {flow.message && <div className="message">{flow.message}</div>}
        {flow.phase === 'correct' && flow.streak >= 2 && <div className="streak">🔥 {flow.streak} rätt i rad!</div>}
      </div>

      <WorldMap
        map={map}
        found={found}
        wrong={wrongId}
        reveal={flow.phase === 'reveal' ? target.id : null}
        onTap={tap}
      />

      {flow.phase === 'reveal' ? (
        <button className="big-btn primary" onClick={flow.advance}>
          Nästa ➜
        </button>
      ) : (
        <p className="map-hint">Nyp eller scrolla för att zooma 🔍</p>
      )}
    </div>
  )
}
