import { defineCategory } from '../types'
import { MatteRound, type MatteSettings } from './MatteRound'
import { MatteSetup } from './MatteSetup'

export const matte = defineCategory<MatteSettings>({
  id: 'matte',
  name: 'Matte',
  icon: '🧮',
  color: '#7c4dff',
  Setup: MatteSetup,
  Play: MatteRound,
})
