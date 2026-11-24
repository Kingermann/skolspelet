import { describe, expect, it } from 'vitest'
import { ROUND_LENGTH_OPTIONS, starsFor } from './constants'

describe('stjärnor', () => {
  it('räknas på andel rätt, oavsett antal frågor', () => {
    expect(starsFor(10, 10)).toBe(3)
    expect(starsFor(9, 10)).toBe(3)
    expect(starsFor(8, 10)).toBe(2)
    expect(starsFor(6, 10)).toBe(2)
    expect(starsFor(5, 10)).toBe(1)
    expect(starsFor(3, 3)).toBe(3)
    expect(starsFor(2, 3)).toBe(2)
    expect(starsFor(1, 3)).toBe(1)
    expect(starsFor(5, 5)).toBe(3)
    expect(starsFor(4, 5)).toBe(2)
    expect(starsFor(18, 20)).toBe(3)
    expect(starsFor(17, 20)).toBe(2)
    expect(starsFor(0, 0)).toBe(1)
  })

  it('alla val i inställningarna är positiva heltal', () => {
    for (const n of ROUND_LENGTH_OPTIONS) expect(Number.isInteger(n) && n > 0).toBe(true)
  })
})
