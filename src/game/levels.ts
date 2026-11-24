/** Svårighetsnivåer – samma för alla kategorier. */
export type Level = 'latt' | 'medel' | 'svar'

export const LEVELS: Level[] = ['latt', 'medel', 'svar']

export const LEVEL_STYLE: Record<Level, { label: string; color: string }> = {
  latt: { label: 'Lätt', color: '#2ec27e' },
  medel: { label: 'Medel', color: '#ffb703' },
  svar: { label: 'Svår', color: '#ff5c5c' },
}
