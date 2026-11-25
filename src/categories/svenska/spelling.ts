import type { Grade } from '../../game/grades'
import type { Level } from '../../game/levels'
import { shuffle } from '../../game/random'
import { commonMisspellings, obviousMisspellings, type ErrorType, type Misspelling } from './misspell'
import { REAL_WORDS } from './realWords'
import { WORDS } from './words'

export interface SpellingQuestion {
  /** Det rättstavade ordet. */
  word: string
  /** Fyra alternativ i slumpad ordning (ett rätt + tre felstavade). */
  options: string[]
  /** Vilken sorts stavningsfel frågan handlar om (för tipset vid fel svar). */
  tip: ErrorType
}

/** Felstavningar som får användas (aldrig riktiga ord). */
export function allowedCommon(word: string): Misspelling[] {
  return commonMisspellings(word).filter((m) => !REAL_WORDS.has(m.word))
}

export function allowedObvious(word: string): string[] {
  return obviousMisspellings(word).filter((w) => !REAL_WORDS.has(w))
}

/** Hur många av de tre felen som ska vara "vanliga" (luriga) fel per nivå. */
const COMMON_WANTED: Record<Level, number> = { latt: 0, medel: 2, svar: 3 }

export function makeQuestion(word: string, level: Level): SpellingQuestion {
  const common = shuffle(allowedCommon(word))
  const wrong: Misspelling[] = common.slice(0, COMMON_WANTED[level])
  for (const w of shuffle(allowedObvious(word))) {
    if (wrong.length >= 3) break
    if (!wrong.some((x) => x.word === w)) wrong.push({ word: w, type: 'tydlig' })
  }
  // Tipset handlar om det vanligaste felet bland alternativen.
  const tip = wrong.find((w) => w.type !== 'tydlig')?.type ?? 'tydlig'
  return { word, options: shuffle([word, ...wrong.map((w) => w.word)]), tip }
}

/** Rundans ord: vanliga ord på Lätt/Medel, svåra ord på Svår (fylls på om det behövs). */
export function pickWords(grade: Grade, level: Level, length: number): string[] {
  const { ord, svåra } = WORDS[grade]
  const primary = level === 'svar' ? svåra : ord
  const secondary = level === 'svar' ? ord : svåra
  return [...shuffle(primary), ...shuffle(secondary)].slice(0, length)
}
