import { defineCategory } from '../types'
import { GeoSetup } from './GeoSetup'
import { MapRound, type GeoSettings } from './MapRound'

export const geografi = defineCategory<GeoSettings>({
  id: 'geografi',
  name: 'Geografi',
  icon: '🌍',
  color: '#2ec27e',
  Setup: GeoSetup,
  Play: MapRound,
})
