import type { HomeworkGloss } from '../../game/profiles'
import { HOMEWORK_TEXT_MAX, MAX_HOMEWORK } from '../../game/profiles'
import { shuffle } from '../../game/random'
import type { Direction, DirectionChoice } from './quiz'

/**
 * Läxglosor: egna glosor som man skriver in och blir förhörd på genom att skriva svaret.
 *
 * Hur noga det är när man svarar:
 * - stora/små bokstäver, extra mellanslag och skiljetecken spelar ingen roll, ' och ’ är samma
 * - å, ä och ö måste vara rätt, och småord som "a", "to" och "en" måste vara med om de står i listan
 * - `/` i listan = flera rätta svar: "you are / you're" godtar båda
 */

export interface HomeworkQuestion {
  gloss: HomeworkGloss
  direction: Direction
}

/** Svaren som godtas, t.ex. "you are / you're" ⇒ ["you are", "you're"]. */
export function alternatives(text: string): string[] {
  return text
    .split('/')
    .map((a) => a.trim())
    .filter((a) => a !== '')
}

/** Som det ska visas: "you are / you're" (snyggt även om det skrevs "you are/you're"). */
export const display = (text: string) => alternatives(text).join(' / ')

/** Det som jämförs: små bokstäver, ett mellanslag mellan orden, inga skiljetecken. */
export function normalize(text: string): string {
  return text
    .normalize('NFC')
    .toLocaleLowerCase('sv')
    .replace(/[’‘´`]/g, "'")
    .replace(/[.,!?;:"“”()]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

/** Antal bokstäver som skiljer (Levenshtein): byta, ta bort eller lägga till en bokstav = 1. */
export function distance(a: string, b: string): number {
  let prev = Array.from({ length: b.length + 1 }, (_, j) => j)
  for (let i = 1; i <= a.length; i++) {
    const row = [i]
    for (let j = 1; j <= b.length; j++) {
      row[j] = Math.min(prev[j] + 1, row[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1))
    }
    prev = row
  }
  return prev[b.length]
}

export type Verdict = 'right' | 'almost' | 'wrong'

/** Rätt, nästan rätt (en bokstav fel i ett ord på minst tre bokstäver) eller fel. */
export function checkAnswer(answer: string, correct: string): Verdict {
  const given = normalize(answer)
  if (given === '') return 'wrong'
  const accepted = alternatives(correct).map(normalize)
  if (accepted.includes(given)) return 'right'
  if (accepted.some((a) => a.length >= 3 && distance(given, a) === 1)) return 'almost'
  return 'wrong'
}

/** Alla glosor en gång i slumpad ordning. Blandat: varannan åt vardera hållet. */
export function makeHomeworkRound(glosses: HomeworkGloss[], choice: DirectionChoice): HomeworkQuestion[] {
  return shuffle(glosses).map((gloss, i) => ({
    gloss,
    direction: choice === 'mix' ? (i % 2 === 0 ? 'en-sv' : 'sv-en') : choice,
  }))
}

/** Vad som är fel med en ny glosa, eller null om den kan läggas till. */
export function glossProblem(en: string, sv: string, list: HomeworkGloss[]): string | null {
  if (list.length >= MAX_HOMEWORK) return `Listan är full (högst ${MAX_HOMEWORK} glosor)`
  if (alternatives(en).length === 0 || alternatives(sv).length === 0) return 'Skriv både engelska och svenska'
  if (en.trim().length > HOMEWORK_TEXT_MAX || sv.trim().length > HOMEWORK_TEXT_MAX) return `Högst ${HOMEWORK_TEXT_MAX} tecken`
  const words = alternatives(en).map(normalize)
  if (list.some((g) => alternatives(g.en).map(normalize).some((w) => words.includes(w)))) return 'Den glosan finns redan'
  return null
}
