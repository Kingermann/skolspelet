import type { Level, OpChoice } from './types'

export const OP_INFO: Record<OpChoice, { icon: string; label: string; color: string }> = {
  '+': { icon: '+', label: 'Plus', color: '#2ec27e' },
  '-': { icon: '−', label: 'Minus', color: '#3da5ff' },
  '×': { icon: '×', label: 'Gånger', color: '#ff9f1c' },
  '÷': { icon: '÷', label: 'Delat', color: '#9b5cff' },
  mix: { icon: '🎲', label: 'Blandat', color: '#ff6f91' },
}

export const LEVEL_INFO: Record<Level, { label: string; text: string; color: string }> = {
  latt: { label: 'Lätt', text: 'Välj bland fyra svar', color: '#2ec27e' },
  medel: { label: 'Medel', text: 'Skriv svaret själv', color: '#ffb703' },
  svar: { label: 'Svår', text: 'Kluriga uppgifter', color: '#ff5c5c' },
}

