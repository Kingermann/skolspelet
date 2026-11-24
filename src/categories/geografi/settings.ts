import type { Level } from '../../game/levels'
import type { Continent } from './countries'

/** Spellägen i Geografi. Nya lägen (t.ex. huvudstäder) läggs till här. */
export type GeoMode = 'karta' | 'flaggor'

export const GEO_MODES: Record<GeoMode, { icon: string; label: string; text: string; color: string }> = {
  karta: { icon: '🗺️', label: 'Var ligger landet?', text: 'Tryck på rätt land på kartan', color: '#3da5ff' },
  flaggor: { icon: '🚩', label: 'Flaggor', text: 'Vilket land har flaggan?', color: '#ff6f91' },
}

export interface GeoSettings {
  mode: GeoMode
  continent: Continent
  level: Level
}
