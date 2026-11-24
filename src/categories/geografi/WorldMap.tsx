import { select } from 'd3-selection'
import { zoom, zoomIdentity, type ZoomBehavior } from 'd3-zoom'
import { useEffect, useRef, useState } from 'react'
import type { ContinentMap } from './map'

/** Ringens storlek runt pyttesmå länder (i kartenheter vid normal zoom). */
const RING_R = 9
/** Ringen som visar var rätt land ligger efter två fel. */
const REVEAL_R = 26

interface Props {
  map: ContinentMap
  /** Länder man hittat (gröna). */
  found: Set<string>
  /** Landet man tryckte fel på (blinkar orange). */
  wrong: string | null
  /** Rätt land som visas efter två fel (blinkar lila). */
  reveal: string | null
  onTap: (id: string) => void
}

export function WorldMap({ map, found, wrong, reveal, onTap }: Props) {
  const svgRef = useRef<SVGSVGElement>(null)
  const layerRef = useRef<SVGGElement>(null)
  const zoomRef = useRef<ZoomBehavior<SVGSVGElement, unknown> | null>(null)
  const [scale, setScale] = useState(1)

  // Nyp-zoom och dra (mobil), scrollhjul och dra (dator).
  useEffect(() => {
    const svg = select(svgRef.current!)
    const layer = layerRef.current!
    const behavior = zoom<SVGSVGElement, unknown>()
      .scaleExtent([1, 24])
      .translateExtent([
        [map.view.x, map.view.y],
        [map.view.x + map.view.width, map.view.y + map.view.height],
      ])
      .on('zoom', (event) => {
        layer.setAttribute('transform', event.transform.toString())
        // Håll ringarna lika stora på skärmen medan man zoomar.
        select(layer).selectAll('circle.tiny-ring').attr('r', RING_R / event.transform.k)
        select(layer).selectAll('circle.reveal-ring').attr('r', REVEAL_R / event.transform.k)
      })
      .on('end', (event) => setScale(event.transform.k))
    svg.call(behavior).on('dblclick.zoom', null)
    zoomRef.current = behavior
    return () => {
      svg.on('.zoom', null)
    }
  }, [map])

  function resetZoom() {
    if (svgRef.current && zoomRef.current) select(svgRef.current).call(zoomRef.current.transform, zoomIdentity)
  }

  const revealShape = reveal ? map.shapes.find((s) => s.id === reveal && s.center.every(Number.isFinite)) : undefined

  const stateClass = (id: string) =>
    [found.has(id) && 'found', wrong === id && 'wrong', reveal === id && 'reveal'].filter(Boolean).join(' ')

  return (
    <div className="map-wrap">
      <svg
        ref={svgRef}
        className="map"
        viewBox={`${map.view.x} ${map.view.y} ${map.view.width} ${map.view.height}`}
        preserveAspectRatio="xMidYMid meet"
      >
        <g ref={layerRef}>
          {map.shapes.map((s) =>
            s.kind === 'territory' ? (
              <path key={s.id} className="territory" d={s.d} />
            ) : (
              <path key={s.id} className={`country ${stateClass(s.id)}`} d={s.d} data-name={s.sv} onClick={() => onTap(s.id)} />
            ),
          )}
          {map.shapes
            .filter((s) => s.tiny)
            .map((s) => (
              <circle
                key={`ring-${s.id}`}
                data-name={s.sv}
                className={`tiny-ring ${stateClass(s.id)}`}
                cx={s.tiny![0]}
                cy={s.tiny![1]}
                r={RING_R / scale}
                onClick={() => onTap(s.id)}
              />
            ))}
          {revealShape && (
            <circle className="reveal-ring" cx={revealShape.center[0]} cy={revealShape.center[1]} r={REVEAL_R / scale} />
          )}
        </g>
      </svg>
      {scale > 1.01 && (
        <button className="map-reset" onClick={resetZoom} aria-label="Visa hela kartan">
          ⤢
        </button>
      )}
    </div>
  )
}
