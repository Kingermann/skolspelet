import { randInt, shuffle } from '../generator'
import type { Choice, Task } from './task'

/** Ett slumpat element. */
export const pickOne = <T>(items: readonly T[]): T => items[randInt(0, items.length - 1)]

/** Försök tills villkoret uppfylls (annars sista försöket – testerna fångar det). */
export function retry<T>(make: () => T, ok: (v: T) => boolean, tries = 500): T {
  let v = make()
  for (let i = 0; i < tries && !ok(v); i++) v = make()
  return v
}

/**
 * Lägg till fyra svarsalternativ (ett rätt + tre fel) på Lätt.
 * Felalternativen tas i ordning – lägg de bästa "vanliga felen" först – och dubbletter hoppas över.
 */
export function withChoices(task: Task, correct: Choice, wrong: Choice[], easy: boolean, count = 3): Task {
  if (!easy) return task
  const picked: Choice[] = []
  for (const w of wrong) {
    if (picked.length >= count) break
    if (w.label !== correct.label && !picked.some((p) => p.label === w.label)) picked.push({ ...w, correct: false })
  }
  return { ...task, choices: shuffle([{ ...correct, correct: true }, ...picked]) }
}

/** Heltalsalternativ: de vanliga felen först, sedan tal nära svaret. */
export function intChoices(answer: number, mistakes: number[], max = 1000): Choice[] {
  const near = [1, -1, 2, -2, 10, -10, 5, -5, 3, -3]
  return [...mistakes, ...shuffle(near).map((d) => answer + d)]
    .filter((n) => Number.isInteger(n) && n >= 0 && n <= max && n !== answer)
    .map((n) => ({ label: String(n), correct: false }))
}
