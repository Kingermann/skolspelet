import { geoAzimuthalEqualArea, geoPath } from 'd3-geo'
import type { Feature, Geometry, MultiPoint } from 'geojson'
import { feature, merge } from 'topojson-client'
import type { GeometryObject, Topology } from 'topojson-specification'
import { COUNTRIES, CONTINENTS, IGNORED, MERGED_INTO, TERRITORIES, type Continent } from './countries'

/** Kartans bredd i "kartenheter" (SVG:n skalas sedan till skärmen). */
export const MAP_WIDTH = 1000

/** Länder vars yta är mindre än (andel × kartans storlek)² får en ring runt sig så att de går att hitta. */
const TINY_SHARE = 0.012

export interface MapShape {
  /** Namnet i kartdatan (engelska), används som id. */
  id: string
  /** Svenskt namn. */
  sv: string
  /** 'country' = går att klicka på och kan bli en fråga. 'territory' = grått, går inte att klicka på. */
  kind: 'country' | 'territory'
  /** SVG-sökväg. */
  d: string
  /** Mittpunkt för ringen runt pyttesmå länder (annars null). */
  tiny: [number, number] | null
  /** Landets mittpunkt på kartan (för ringen som visar rätt svar). */
  center: [number, number]
}

export interface ViewBox {
  x: number
  y: number
  width: number
  height: number
}

export interface ContinentMap {
  continent: Continent
  /** Den del av kartan som visas – anpassad efter var länderna faktiskt ligger. */
  view: ViewBox
  shapes: MapShape[]
}

/** Delar av ett land som är mindre än så här jämfört med landets största del (t.ex. Hawaii) styr inte kartans utsnitt. */
const MINOR_PART = 0.03

type Box = [[number, number], [number, number]]

function addBox(total: Box | null, box: Box): Box {
  if (!total) return box
  return [
    [Math.min(total[0][0], box[0][0]), Math.min(total[0][1], box[0][1])],
    [Math.max(total[1][0], box[1][0]), Math.max(total[1][1], box[1][1])],
  ]
}

type CountriesTopology = Topology<{ countries: { type: 'GeometryCollection'; geometries: GeometryObject<{ name: string }>[] } }>

/** Utsnittets kanter som punkter (för att passa in kartan och klippa bort resten). */
function boundsOutline([[west, south], [east, north]]: [[number, number], [number, number]]): MultiPoint {
  const points: [number, number][] = []
  for (let lon = west; lon <= east; lon += 1) points.push([lon, south], [lon, north])
  for (let lat = south; lat <= north; lat += 1) points.push([west, lat], [east, lat])
  return { type: 'MultiPoint', coordinates: points }
}

/** Bygger kartan för en världsdel: bara dess länder (och grå områden), inget annat. */
export function buildContinentMap(topology: CountriesTopology, continent: Continent): ContinentMap {
  const info = CONTINENTS[continent]
  const [[west, south], [east, north]] = info.bounds

  const projection = geoAzimuthalEqualArea().rotate([-(west + east) / 2, -(south + north) / 2])
  const outline = boundsOutline(info.bounds)
  projection.fitWidth(MAP_WIDTH, outline)
  const [, [, bottom]] = geoPath(projection).bounds(outline)
  const height = Math.ceil(bottom)
  projection.clipExtent([
    [0, 0],
    [MAP_WIDTH, height],
  ])
  const path = geoPath(projection)

  // Samla kartdatans områden per land (t.ex. Nordcypern ⇒ Cypern).
  const groups = new Map<string, { kind: MapShape['kind']; sv: string; geometries: GeometryObject<{ name: string }>[] }>()
  for (const geometry of topology.objects.countries.geometries) {
    const name = (geometry.properties as { name: string }).name
    if (IGNORED.includes(name)) continue
    const id = MERGED_INTO[name] ?? name
    const country = COUNTRIES[id]

    let kind: MapShape['kind'] | null = null
    if (country?.continents.includes(continent)) kind = 'country'
    else if (country?.greyIn?.includes(continent) || TERRITORIES[name]?.includes(continent)) kind = 'territory'
    if (!kind) continue

    const group = groups.get(id) ?? { kind, sv: country?.sv ?? name, geometries: [] }
    group.geometries.push(geometry)
    groups.set(id, group)
  }

  const shapes: MapShape[] = []
  const areas = new Map<string, number>()
  let content: Box | null = null
  for (const [id, group] of groups) {
    const geometry: Geometry =
      group.geometries.length === 1
        ? (feature(topology, group.geometries[0]) as Feature).geometry
        : merge(topology, group.geometries as Parameters<typeof merge>[1])
    const d = path(geometry)
    if (!d) continue // helt utanför utsnittet
    const area = path.area(geometry)
    const centroid = path.centroid(geometry)
    shapes.push({ id, sv: group.sv, kind: group.kind, d, tiny: null, center: centroid })
    areas.set(id, area)

    // Utsnittet: alla större delar av länder och grå områden, plus mittpunkten för varje land
    // (så att ringar runt små önationer också hamnar inom kartan).
    if (group.kind === 'country' && centroid.every(Number.isFinite)) {
      const [x, y] = centroid
      content = addBox(content, [
        [x - 12, y - 12],
        [x + 12, y + 12],
      ])
    }
    const parts: Geometry[] =
      geometry.type === 'MultiPolygon' ? geometry.coordinates.map((coordinates) => ({ type: 'Polygon', coordinates })) : [geometry]
    const partAreas = parts.map((p) => path.area(p))
    const largest = Math.max(...partAreas)
    parts.forEach((p, i) => {
      if (partAreas[i] > 0 && partAreas[i] >= largest * MINOR_PART) content = addBox(content, path.bounds(p) as Box)
    })
  }

  const [[x0, y0], [x1, y1]] = content ?? [
    [0, 0],
    [MAP_WIDTH, height],
  ]
  const pad = Math.max(x1 - x0, y1 - y0) * 0.03
  const view = { x: x0 - pad, y: y0 - pad, width: x1 - x0 + 2 * pad, height: y1 - y0 + 2 * pad }

  // Pyttesmå länder (jämfört med hur stor kartan är) får en ring.
  const tinyArea = (TINY_SHARE * Math.max(view.width, view.height)) ** 2
  for (const shape of shapes) {
    if (shape.kind === 'country' && areas.get(shape.id)! < tinyArea && shape.center.every(Number.isFinite)) shape.tiny = shape.center
  }

  // Grå områden först så att länderna ritas ovanpå.
  shapes.sort((a, b) => (a.kind === b.kind ? 0 : a.kind === 'territory' ? -1 : 1))
  return { continent, view, shapes }
}

/** Laddar kartdatan (ca 750 kB) första gången den behövs. */
let topologyPromise: Promise<CountriesTopology> | null = null
export function loadTopology(): Promise<CountriesTopology> {
  topologyPromise ??= import('world-atlas/countries-50m.json?url').then(async ({ default: url }) => {
    const response = await fetch(url)
    return (await response.json()) as CountriesTopology
  })
  return topologyPromise
}
