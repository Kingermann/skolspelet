import { defineCategory } from '../types'
import { GeoPlay, type GeoSettings } from './GeoPlay'
import { GeoSetup } from './GeoSetup'

export const geografi = defineCategory<GeoSettings>({
  id: 'geografi',
  name: 'Geografi',
  icon: '🌍',
  color: '#2ec27e',
  Setup: GeoSetup,
  Play: GeoPlay,
})
