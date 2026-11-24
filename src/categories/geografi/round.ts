import { ROUND_LENGTH } from '../../game/constants'
import type { Level } from '../../game/levels'
import { shuffle } from '../../game/random'
import { COUNTRIES, type CountryLevel } from './countries'
import type { MapShape } from './map'

const TIER: Record<Level, CountryLevel> = { latt: 1, medel: 2, svar: 3 }

/**
 * Om en nivå har för få länder (t.ex. Sydamerika) fylls rundan på från
 * närmaste nivå – helst nivån under, annars nivån över.
 */
const FILL_ORDER: Record<CountryLevel, CountryLevel[]> = {
  1: [1, 2, 3],
  2: [2, 1, 3],
  3: [3, 2, 1],
}

/** Väljer rundans länder: i första hand från vald nivå. */
export function pickRoundCountries(countries: MapShape[], level: Level, length = ROUND_LENGTH): MapShape[] {
  const picked: MapShape[] = []
  for (const tier of FILL_ORDER[TIER[level]]) {
    const pool = shuffle(countries.filter((c) => COUNTRIES[c.id]?.level === tier))
    picked.push(...pool.slice(0, length - picked.length))
    if (picked.length >= length) break
  }
  // Ordningen blandas så att påfyllda länder inte alltid kommer sist.
  return shuffle(picked)
}
