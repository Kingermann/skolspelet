/** Antal uppgifter/frågor i en runda (omtag kommer utöver dessa). */
export const ROUND_LENGTH = 10

/** Stjärnor räknas på rätt vid första försöket. */
export function starsFor(firstTryCorrect: number): 1 | 2 | 3 {
  if (firstTryCorrect >= 9) return 3
  if (firstTryCorrect >= 6) return 2
  return 1
}
