import { useEffect, useState } from 'react'
import { Header } from '../../components/Header'
import { Progress } from '../../components/Progress'
import { ROUND_LENGTH } from '../../game/constants'
import { shuffle } from '../../game/random'
import { useRoundFlow } from '../../game/useRoundFlow'
import { CONTINENTS, type Continent } from './countries'
import { buildContinentMap, loadTopology, type ContinentMap, type MapShape } from './map'
import { WorldMap } from './WorldMap'

export interface GeoSettings {
  continent: Continent
}

interface Props {
  settings: GeoSettings
  onFinish: (firstTryCorrect: number) => void
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

  const header = <RoundHeader continent={settings.continent} onQuit={onQuit} />
  if (!map) {
    return (
      <div className="screen round">
        {header}
        <p className="loading">{error ? 'Kartan gick inte att ladda 😕' : 'Laddar kartan… 🗺️'}</p>
      </div>
    )
  }
  return <MapGame map={map} header={header} onFinish={onFinish} />
}

function RoundHeader({ continent, onQuit }: { continent: Continent; onQuit: () => void }) {
  const info = CONTINENTS[continent]
  return (
    <Header
      onBack={() => {
        if (window.confirm('Vill du avsluta rundan?')) onQuit()
      }}
      backIcon="✕"
      backLabel="Avsluta rundan"
    >
      <span className="chip">
        {info.icon} {info.name}
      </span>
    </Header>
  )
}

function MapGame({ map, header, onFinish }: { map: ContinentMap; header: React.ReactNode; onFinish: (n: number) => void }) {
  const flow = useRoundFlow<MapShape>({
    makeItems: () => shuffle(map.shapes.filter((s) => s.kind === 'country')).slice(0, ROUND_LENGTH),
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
      <Progress marks={flow.marks} index={flow.index} isRetake={flow.isRetake} />

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
