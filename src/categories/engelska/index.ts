import { defineCategory } from '../types'
import { EngelskaSetup } from './EngelskaSetup'
import { GlossRound, type EngelskaSettings } from './GlossRound'

export const engelska = defineCategory<EngelskaSettings>({
  id: 'engelska',
  name: 'Engelska',
  icon: '🇬🇧',
  color: '#3da5ff',
  Setup: EngelskaSetup,
  Play: GlossRound,
})
