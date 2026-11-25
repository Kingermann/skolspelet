import type { Grade } from '../../game/grades'
import type { Level } from '../../game/levels'
import { shuffle } from '../../game/random'
import { CONFUSABLES, GLOSSES, type Gloss } from './words'

/** en-sv = "Vad betyder frog?", sv-en = "Vilket är det engelska ordet för groda?" */
export type Direction = 'en-sv' | 'sv-en'
export type DirectionChoice = Direction | 'mix'

export interface GlossQuestion {
  gloss: Gloss
  direction: Direction
  /** Fyra glosor i slumpad ordning (en rätt + tre fel). */
  options: Gloss[]
}

/** Ord som lätt blandas ihop med glosan (t.ex. quiet ⇒ quite), från alla årskurser. */
export function confusablesOf(gloss: Gloss): Gloss[] {
  const group = CONFUSABLES.find((g) => g.includes(gloss.en))
  if (!group) return []
  return GLOSSES.filter((g) => g.en !== gloss.en && group.includes(g.en))
}

/**
 * Felalternativ efter nivå:
 * - Lätt: glosor från andra områden (lätta att skilja åt)
 * - Medel: glosor från samma område
 * - Svår: förväxlingsord först (quiet/quite), sedan samma område
 */
export function makeQuestion(gloss: Gloss, level: Level, direction: Direction): GlossQuestion {
  const sameGrade = GLOSSES.filter((g) => g.grade === gloss.grade && g.en !== gloss.en)
  const confusable = confusablesOf(gloss)
  const isConfusable = (g: Gloss) => confusable.some((c) => c.en === g.en)
  const wrong: Gloss[] = []
  const add = (pool: Gloss[]) => {
    for (const g of shuffle(pool)) {
      if (wrong.length >= 3) return
      if (!wrong.some((w) => w.en === g.en)) wrong.push(g)
    }
  }

  if (level === 'latt') {
    const other = sameGrade.filter((g) => g.topic !== gloss.topic && !isConfusable(g))
    add(other.filter((g) => !g.hard))
    add(other)
  } else {
    if (level === 'svar') add(confusable)
    add(sameGrade.filter((g) => g.topic === gloss.topic))
  }
  add(sameGrade)

  return { gloss, direction, options: shuffle([gloss, ...wrong]) }
}

/** Rundans glosor: vanliga på Lätt/Medel, svåra först på Svår (fylls på om det behövs). */
export function pickGlosses(grade: Grade, level: Level, length: number): Gloss[] {
  const all = GLOSSES.filter((g) => g.grade === grade)
  const primary = all.filter((g) => g.hard === (level === 'svar'))
  const secondary = all.filter((g) => g.hard !== (level === 'svar'))
  return [...shuffle(primary), ...shuffle(secondary)].slice(0, length)
}

export function makeRound(grade: Grade, level: Level, choice: DirectionChoice, length: number): GlossQuestion[] {
  return pickGlosses(grade, level, length).map((gloss, i) => {
    const direction: Direction = choice === 'mix' ? (i % 2 === 0 ? 'en-sv' : 'sv-en') : choice
    return makeQuestion(gloss, level, direction)
  })
}
