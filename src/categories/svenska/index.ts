import { defineCategory } from '../types'
import { SpellingRound, type SvenskaSettings } from './SpellingRound'
import { SvenskaSetup } from './SvenskaSetup'

export const svenska = defineCategory<SvenskaSettings>({
  id: 'svenska',
  name: 'Svenska',
  icon: '📝',
  color: '#ff9f1c',
  Setup: SvenskaSetup,
  Play: SpellingRound,
})
