/** Antal frågor per runda om man inte ändrat i inställningarna. */
export const DEFAULT_ROUND_LENGTH = 10

/** Valen i inställningarna för antal frågor per runda. */
export const ROUND_LENGTH_OPTIONS = [3, 5, 10, 15, 20]

/** Antal stjärnor för en runda. */
export type Stars = 1 | 2 | 3

/** Stjärnor räknas på andel rätt vid första försöket: 90 % ⇒ 3, 60 % ⇒ 2, annars 1. */
export function starsFor(firstTryCorrect: number, total: number): Stars {
  const share = total > 0 ? firstTryCorrect / total : 0
  if (share >= 0.9) return 3
  if (share >= 0.6) return 2
  return 1
}
