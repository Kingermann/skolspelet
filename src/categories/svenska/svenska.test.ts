/// <reference types="node" />
import dictionary from 'dictionary-sv'
import nspell from 'nspell'
import { describe, expect, it } from 'vitest'
import { GRADES } from '../../game/grades'
import { LEVELS } from '../../game/levels'
import { commonMisspellings, obviousMisspellings, TIPS } from './misspell'
import { REAL_WORDS } from './realWords'
import { allowedCommon, allowedObvious, makeQuestion, pickWords } from './spelling'
import { WORDS } from './words'

/**
 * Svensk ordlista (dictionary-sv) utan sammansättningsregler. Med dem godkänner
 * stavningskontrollen nästan vad som helst ("kat", "järta" …) eftersom felstavningar
 * kan tolkas som hopsatta ordbitar. Vanliga sammansättningar finns ändå som egna ord.
 */
const aff = new TextDecoder()
  .decode(dictionary.aff)
  .split('\n')
  .filter((line) => !/^(COMPOUND|ONLYINCOMPOUND|CHECKCOMPOUND)/.test(line))
  .join('\n')
const spell = nspell({ aff: Buffer.from(aff), dic: Buffer.from(dictionary.dic) })
const isWord = (w: string) => spell.correct(w)

const allWords = GRADES.flatMap((g) => [...WORDS[g].ord, ...WORDS[g].svåra])

describe('ordlistan', () => {
  it('varje ord finns i den svenska ordlistan', () => {
    const missing = allWords.filter((w) => !isWord(w))
    expect(missing, `Ord som inte finns i ordlistan: ${missing.join(', ')}`).toEqual([])
  })

  it('orden är skrivna med små bokstäver och utan mellanslag', () => {
    for (const w of allWords) expect(w, w).toMatch(/^[a-zåäöé]+$/)
  })

  it('inga dubbletter inom en årskurs', () => {
    for (const g of GRADES) {
      const words = [...WORDS[g].ord, ...WORDS[g].svåra]
      expect(new Set(words).size, `åk ${g}`).toBe(words.length)
    }
  })

  it('varje årskurs har minst 20 vanliga och 10 svåra ord', () => {
    for (const g of GRADES) {
      expect(WORDS[g].ord.length).toBeGreaterThanOrEqual(20)
      expect(WORDS[g].svåra.length).toBeGreaterThanOrEqual(10)
    }
  })
})

describe('felstavningar', () => {
  it('inga felstavningar som används är riktiga ord (annars: lägg till i realWords.ts)', () => {
    const real = new Set<string>()
    for (const w of allWords) {
      for (const m of allowedCommon(w)) if (isWord(m.word)) real.add(m.word)
      for (const m of allowedObvious(w)) if (isWord(m)) real.add(m)
    }
    const list = [...real].sort((a, b) => a.localeCompare(b, 'sv'))
    expect(list, `Lägg till i REAL_WORDS: ${JSON.stringify(list)}`).toEqual([])
  })

  it('listan med riktiga ord innehåller bara riktiga ord som reglerna faktiskt skapar', () => {
    const produced = new Set(allWords.flatMap((w) => [...commonMisspellings(w).map((m) => m.word), ...obviousMisspellings(w)]))
    for (const r of REAL_WORDS) {
      expect(isWord(r), `${r} är inget riktigt ord – ta bort det ur REAL_WORDS`).toBe(true)
      expect(produced.has(r), `${r} skapas inte längre av reglerna – ta bort det ur REAL_WORDS`).toBe(true)
    }
  })

  it('varje ord har minst tre användbara felstavningar', () => {
    for (const w of allWords) expect(allowedCommon(w).length + allowedObvious(w).length, w).toBeGreaterThanOrEqual(3)
  })

  it('de svåra orden har minst ett lurigt (vanligt) fel', () => {
    const without = GRADES.flatMap((g) => WORDS[g].svåra).filter((w) => allowedCommon(w).length === 0)
    expect(without, `Svåra ord utan vanliga fel: ${without.join(', ')}`).toEqual([])
  })

  it('varje feltyp har ett tips', () => {
    for (const tip of Object.values(TIPS)) expect(tip.length).toBeGreaterThan(10)
  })
})

describe.each(LEVELS)('frågor på nivå %s', (level) => {
  it('fyra olika alternativ, ett rättstavat och tre felstavade som inte är riktiga ord', () => {
    for (const w of allWords) {
      for (let i = 0; i < 5; i++) {
        const q = makeQuestion(w, level)
        expect(q.options).toHaveLength(4)
        expect(new Set(q.options).size).toBe(4)
        expect(q.options).toContain(w)
        for (const o of q.options) if (o !== w) expect(isWord(o), `${w}: ${o}`).toBe(false)
        expect(TIPS[q.tip]).toBeDefined()
      }
    }
  })

  it('rundan får valt antal olika ord ur rätt årskurs', () => {
    for (const g of GRADES) {
      for (const length of [3, 10, 20]) {
        const words = pickWords(g, level, length)
        expect(words).toHaveLength(length)
        expect(new Set(words).size).toBe(length)
        for (const w of words) expect([...WORDS[g].ord, ...WORDS[g].svåra]).toContain(w)
      }
    }
  })
})

describe('nivåerna skiljer sig', () => {
  it('Lätt har bara tydliga fel, Svår helst bara luriga', () => {
    expect(makeQuestion('katt', 'latt').tip).toBe('tydlig')
    const hard = makeQuestion('hjärta', 'svar')
    expect(hard.tip).not.toBe('tydlig')
  })

  it('sj-ljud (stj, skj) får aldrig tipset om tj-ljud', () => {
    for (const w of allWords.filter((x) => /s(t|k)j/.test(x))) {
      for (const m of allowedCommon(w)) expect(m.type, `${w} → ${m.word}`).not.toBe('tj')
    }
  })

  it('Svår använder årskursens svåra ord först', () => {
    for (const g of GRADES) {
      for (const w of pickWords(g, 'svar', WORDS[g].svåra.length)) expect(WORDS[g].svåra).toContain(w)
    }
  })
})
