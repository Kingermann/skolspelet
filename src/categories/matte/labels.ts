import type { Level, OpChoice } from './types'

export const OP_INFO: Record<OpChoice, { icon: string; label: string; color: string }> = {
  '+': { icon: '+', label: 'Plus', color: '#2ec27e' },
  '-': { icon: '−', label: 'Minus', color: '#3da5ff' },
  '×': { icon: '×', label: 'Gånger', color: '#ff9f1c' },
  '÷': { icon: '÷', label: 'Delat', color: '#9b5cff' },
  mix: { icon: '🎲', label: 'Blandat', color: '#ff6f91' },
}

export const LEVEL_TEXTS: Record<Level, string> = {
  latt: 'Välj bland fyra svar',
  medel: 'Skriv svaret själv',
  svar: 'Kluriga uppgifter',
}

