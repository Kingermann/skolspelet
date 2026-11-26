import { defineCategory } from '../types'
import { EngelskaPlay, type EngelskaSettings } from './EngelskaPlay'
import { EngelskaSetup } from './EngelskaSetup'

export const engelska = defineCategory<EngelskaSettings>({
  id: 'engelska',
  name: 'Engelska',
  icon: '🇬🇧',
  color: '#3da5ff',
  Setup: EngelskaSetup,
  Play: EngelskaPlay,
})
