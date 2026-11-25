import { describe, expect, it } from 'vitest'
import { GRADES } from '../../game/grades'
import { LEVELS } from '../../game/levels'
import { isEnglishWord, isSwedishWord } from '../../testing/dictionaries'
import { confusablesOf, makeQuestion, makeRound, pickGlosses, type Direction } from './quiz'
import { CONFUSABLES, GLOSSES } from './words'

const DIRECTIONS: Direction[] = ['en-sv', 'sv-en']

describe('glosorna', () => {
  it('alla engelska ord är rättstavade (brittisk engelska)', () => {
    const bad = GLOSSES.filter((g) => !isEnglishWord(g.en)).map((g) => g.en)
    expect(bad, `Felstavade engelska ord: ${bad.join(', ')}`).toEqual([])
  })

  it('alla svenska ord är rättstavade', () => {
    const bad = GLOSSES.filter((g) => !isSwedishWord(g.sv)).map((g) => g.sv)
    expect(bad, `Svenska ord som inte finns i ordlistan: ${bad.join(', ')}`).toEqual([])
  })

  it('ett ord per glosa, utan "a/an" och "to"', () => {
    for (const g of GLOSSES) {
      expect(g.en, g.en).toMatch(/^[A-Za-z]+$/)
      expect(g.sv, g.sv).toMatch(/^[a-zåäöé]+$/)
    }
  })

  it('varje engelskt och svenskt ord finns bara en gång – så att det aldrig blir två rätta svar', () => {
    const dup = (list: string[]) => list.filter((w, i) => list.indexOf(w) !== i)
    expect(dup(GLOSSES.map((g) => g.en.toLowerCase())), 'engelska dubbletter').toEqual([])
    expect(dup(GLOSSES.map((g) => g.sv)), 'svenska dubbletter').toEqual([])
  })

  it('varje årskurs har minst 40 vanliga och 10 svåra glosor, och varje område minst 4', () => {
    for (const grade of GRADES) {
      const all = GLOSSES.filter((g) => g.grade === grade)
      expect(all.filter((g) => !g.hard).length, `åk ${grade}`).toBeGreaterThanOrEqual(40)
      expect(all.filter((g) => g.hard).length, `åk ${grade}`).toBeGreaterThanOrEqual(10)
      for (const topic of new Set(all.map((g) => g.topic))) {
        expect(all.filter((g) => g.topic === topic).length, `åk ${grade} ${topic}`).toBeGreaterThanOrEqual(4)
      }
    }
  })

  it('förväxlingsorden finns alla bland glosorna', () => {
    for (const group of CONFUSABLES) {
      for (const en of group) expect(GLOSSES.some((g) => g.en === en), en).toBe(true)
    }
  })
})

describe.each(LEVELS)('frågor på nivå %s', (level) => {
  it('fyra olika alternativ med exakt ett rätt svar, i båda riktningarna', () => {
    for (const gloss of GLOSSES) {
      for (const direction of DIRECTIONS) {
        const q = makeQuestion(gloss, level, direction)
        expect(q.options).toHaveLength(4)
        expect(new Set(q.options.map((o) => o.en)).size).toBe(4)
        expect(new Set(q.options.map((o) => o.sv)).size).toBe(4)
        expect(q.options.filter((o) => o.en === gloss.en)).toHaveLength(1)
      }
    }
  })

  it('rundan får valt antal olika glosor från rätt årskurs, Blandat växlar riktning', () => {
    for (const grade of GRADES) {
      for (const length of [3, 10, 20]) {
        const round = makeRound(grade, level, 'mix', length)
        expect(round).toHaveLength(length)
        expect(new Set(round.map((q) => q.gloss.en)).size).toBe(length)
        for (const q of round) expect(q.gloss.grade).toBe(grade)
        expect(new Set(round.map((q) => q.direction)).size).toBe(2)
      }
    }
  })
})

describe('nivåerna skiljer sig', () => {
  const cat = GLOSSES.find((g) => g.en === 'cat')!
  const quiet = GLOSSES.find((g) => g.en === 'quiet')!

  it('Lätt: felalternativen kommer från andra områden', () => {
    for (let i = 0; i < 50; i++) {
      for (const o of makeQuestion(cat, 'latt', 'en-sv').options) if (o !== cat) expect(o.topic).not.toBe('djur')
    }
  })

  it('Medel: felalternativen kommer från samma område', () => {
    for (let i = 0; i < 50; i++) {
      for (const o of makeQuestion(cat, 'medel', 'en-sv').options) expect(o.topic).toBe('djur')
    }
  })

  it('Svår: förväxlingsord kommer med (quiet ⇒ quite)', () => {
    for (let i = 0; i < 50; i++) {
      expect(makeQuestion(quiet, 'svar', 'sv-en').options.map((o) => o.en)).toContain('quite')
    }
    expect(confusablesOf(quiet).map((g) => g.en)).toEqual(['quite'])
  })

  it('Svår använder årskursens svåra glosor först', () => {
    for (const grade of GRADES) {
      const hard = GLOSSES.filter((g) => g.grade === grade && g.hard)
      for (const g of pickGlosses(grade, 'svar', hard.length)) expect(g.hard).toBe(true)
    }
  })
})
