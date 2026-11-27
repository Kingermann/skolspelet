import { describe, expect, it } from 'vitest'
import { ALL_STICKERS, PLAYERS, shirtLabel, STATS_DATE } from './stickers'

describe('klistermärken', () => {
  it('alla har olika id', () => {
    const ids = ALL_STICKERS.map((s) => s.id)
    expect(new Set(ids).size).toBe(ids.length)
  })
})

describe('fotbollskort: framsidan', () => {
  it.each(PLAYERS)('$name har land och text på tröjan som får plats', (p) => {
    expect(p.country.trim()).not.toBe('')
    // Längre text än så blir för hoptryckt mellan ärmarna.
    expect(shirtLabel(p).length).toBeLessThanOrEqual(10)
    expect(shirtLabel(p)).toBe(shirtLabel(p).toLocaleUpperCase('sv'))
  })
})

describe('fotbollskort: baksidan', () => {
  const thisYear = Number(STATS_DATE.slice(-4))

  it('stämpeln har ett år', () => {
    expect(thisYear).toBeGreaterThan(2025)
  })

  it.each(PLAYERS)('$name har fakta som är rimliga och får plats', (p) => {
    const f = p.facts
    expect(f, 'alla kort ska gå att vända till en baksida med fakta').toBeDefined()
    if (!f) return
    expect(f.club.trim()).not.toBe('')
    expect(f.club.length).toBeLessThanOrEqual(22)
    if (f.born !== undefined) {
      expect(f.born).toBeGreaterThan(1970)
      expect(f.born).toBeLessThanOrEqual(thisYear - 5)
    }
    if (f.retired !== undefined) expect(f.retired).toBeLessThanOrEqual(thisYear)
    if (f.birthplace !== undefined) expect(f.birthplace.length).toBeLessThanOrEqual(16)
    if (f.caps !== undefined) expect(f.caps).toBeGreaterThanOrEqual(0)
    // Haaland har fler mål än matcher – så det går inte att jämföra med landskamperna.
    if (f.goals !== undefined) {
      expect(f.caps, 'mål utan landskamper går inte').toBeDefined()
      expect(f.goals).toBeGreaterThanOrEqual(0)
    }
    if (f.funFact !== undefined) {
      expect(f.funFact.length).toBeLessThanOrEqual(120)
      expect(f.funFact).toMatch(/[.!]$/)
    }
  })
})
