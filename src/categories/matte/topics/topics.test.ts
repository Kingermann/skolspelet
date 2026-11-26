import { describe, expect, it } from 'vitest'
import type { Grade, Level } from '../types'
import { clockWords } from './clock'
import { generateTask, generateTopicRound, TOPICS_FOR_GRADE, type Topic } from './index'
import { sequence } from './patterns'
import { fmtDecimal, isComplete, isCorrect, parseDecimal, type Answer, type Task, type Typed } from './task'

const GRADES: Grade[] = [1, 2, 3, 4, 5, 6]
const LEVELS: Level[] = ['latt', 'medel', 'svar']
const SAMPLES = 300

/** Det man skulle skriva för att svara rätt. */
function typedFor(answer: Answer): Typed {
  switch (answer.kind) {
    case 'int':
      return { kind: 'int', text: String(answer.value) }
    case 'decimal':
      return { kind: 'decimal', text: fmtDecimal(answer.value) }
    case 'fraction':
      return { kind: 'fraction', num: String(answer.num), den: String(answer.den) }
    case 'time':
      return { kind: 'time', h: String(answer.h), m: String(answer.m).padStart(2, '0') }
    case 'choice':
      throw new Error('val har inget att skriva')
  }
}

/** Räknar ut "3 · 4 + 2" eller "(36 ÷ 4)" (bara i testerna). */
function evaluate(expression: string): number {
  const js = expression.replace(/\s/g, '').replace(/−/g, '-').replace(/[×·]/g, '*').replace(/÷/g, '/')
  if (!/^[\d+\-*/().]+$/.test(js)) throw new Error(`Oväntat uttryck: ${expression}`)
  return Function(`"use strict"; return (${js})`)() as number
}

const combos = GRADES.flatMap((g) => TOPICS_FOR_GRADE[g].flatMap((t) => LEVELS.map((l) => [g, t, l] as [Grade, Topic, Level])))

describe.each(combos)('åk %i, %s, %s', (grade, topic, level) => {
  const tasks: Task[] = Array.from({ length: SAMPLES }, () => generateTask(grade, level, topic))

  it('rätt svar räknas som rätt', () => {
    for (const t of tasks) if (t.answer.kind !== 'choice') expect(isCorrect(t.answer, typedFor(t.answer)), t.solution).toBe(true)
  })

  it('svarsalternativ: exakt ett rätt, inga dubbletter, och på Lätt alltid fyra (utom jämförelser)', () => {
    for (const t of tasks) {
      if (level !== 'latt' && t.answer.kind !== 'choice') {
        expect(t.choices, t.solution).toBeUndefined()
        continue
      }
      expect(t.choices, t.solution).toBeDefined()
      const choices = t.choices!
      expect(choices.filter((c) => c.correct).length, t.solution).toBe(1)
      expect(new Set(choices.map((c) => c.label)).size, t.solution).toBe(choices.length)
      if (t.prompt?.startsWith('Vilket bråk')) expect(choices.length).toBeGreaterThanOrEqual(2)
      else expect(choices.length, t.solution).toBe(4)
    }
  })

  it('inget fel alternativ är också rätt (t.ex. 2/4 när svaret är 1/2)', () => {
    for (const t of tasks) {
      for (const c of t.choices ?? []) {
        if (c.correct || t.answer.kind === 'choice') continue
        const typed: Typed = c.frac
          ? { kind: 'fraction', num: String(c.frac[0]), den: String(c.frac[1]) }
          : t.answer.kind === 'decimal'
            ? { kind: 'decimal', text: c.label }
            : { kind: 'int', text: c.label }
        expect(isCorrect(t.answer, typed), `${t.solution}: ${c.label}`).toBe(false)
      }
    }
  })

  it('alla tal är heltal mellan 0 och 1000 (utom decimaltal)', () => {
    for (const t of tasks) {
      if (t.story) expect(t.story, t.story).not.toMatch(/\d[.,]\d/)
      const numbers = `${t.text ?? ''} ${t.solution}`.replace(/\d+,\d+/g, '').match(/-?\d+/g) ?? []
      for (const n of numbers) expect(Number(n), t.solution).toBeGreaterThanOrEqual(0)
      for (const n of numbers) expect(Number(n), t.solution).toBeLessThanOrEqual(1000)
      if (t.answer.kind === 'int') expect(Number.isInteger(t.answer.value) && t.answer.value >= 0).toBe(true)
    }
  })

  it('en runda har olika uppgifter', () => {
    const round = generateTopicRound(grade, level, topic, 10)
    const keys = round.map((t) => JSON.stringify([t.text, t.story, t.picture, t.prompt, t.choices?.map((c) => c.label).sort()]))
    expect(new Set(keys).size).toBeGreaterThanOrEqual(8)
  })

  // ---------- Per moment ----------

  if (topic === 'ekvation') {
    it('svaret stämmer i ekvationen', () => {
      for (const t of tasks) {
        const x = (t.answer as { value: number }).value
        const filled = t
          .text!.replace(/\{x\/(\d+)\}/, `(${x}/$1)`)
          .replace(/(\d)x/, `$1*${x}`)
          .replace(/[x?]/, String(x))
        const [left, right] = filled.split('=')
        expect(evaluate(left), `${t.text} med ${x}`).toBe(evaluate(right))
      }
    })
    it(grade >= 4 ? 'åk 4–6 skriver x' : 'åk 1–3 har en ruta (?) i stället för x', () => {
      for (const t of tasks) expect(t.text!.includes(grade >= 4 ? 'x' : '?')).toBe(true)
    })
  }

  if (topic === 'monster') {
    it('talföljden följer en regel som går att se', () => {
      for (const t of tasks) {
        const shown = t.text!.split(', ')
        const x = (t.answer as { value: number }).value
        const seq = shown.map((s) => (s === '?' ? x : Number(s)))
        // Regeln går att räkna ut från talen: konstant steg, ×k, växande steg, varannan, eller ×k + b.
        const d = seq.slice(1).map((n, i) => n - seq[i])
        const constant = d.every((v) => v === d[0])
        const ratio = seq[0] > 0 && seq.slice(1).every((n, i) => n === seq[i] * (seq[1] / seq[0]))
        const growing = d.slice(1).every((v, i) => v - d[i] === d[1] - d[0])
        const alternating = d.every((v, i) => v === d[i % 2])
        const k = (seq[2] - seq[1]) / (seq[1] - seq[0])
        const affine = Number.isInteger(k) && seq.slice(1).every((n, i) => n === seq[i] * k + (seq[1] - seq[0] * k))
        expect(constant || ratio || growing || alternating || affine, t.solution).toBe(true)
      }
    })
  }

  if (topic === 'klocka' && grade <= 3) {
    it('klockan visar svaret, och Lätt har rätt tid i ord', () => {
      for (const t of tasks) {
        expect(t.picture?.kind).toBe('clock')
        const { h, m } = t.picture as { h: number; m: number }
        expect(h >= 1 && h <= 12 && m >= 0 && m < 60).toBe(true)
        if (level === 'latt') expect(t.choices!.find((c) => c.correct)!.label).toBe(clockWords(h, m))
        else expect(t.answer).toEqual({ kind: 'time', h, m })
      }
    })
  }

  if (topic === 'klocka' && grade === 4) {
    it('"hur lång tid" stämmer', () => {
      for (const t of tasks) {
        const [, sh, sm, eh, em] = t.text!.match(/(\d+):(\d+) → (\d+):(\d+)/)!.map(Number)
        expect(eh * 60 + em - (sh * 60 + sm)).toBe((t.answer as { value: number }).value)
      }
    })
  }

  if (topic === 'procent') {
    it('procenten stämmer: hundraruta, "p % av", andel, rabatt och pris', () => {
      for (const t of tasks) {
        const value = (t.answer as { value?: number }).value
        if (t.picture?.kind === 'grid') expect(t.picture.colored).toBe(value)
        const of = t.text?.match(/^(\d+)\s%\sav (\d+) = \?$/)
        if (of) expect((Number(of[1]) * Number(of[2])) / 100).toBe(value)
        const share = t.text?.match(/^(\d+) av (\d+) = \?\s%$/)
        if (share) expect((Number(share[1]) * 100) / Number(share[2])).toBe(value)
        const story = t.solution.match(/^(\d+)\s%\sav (\d+)\skr = (\d+)\skr(?:, (\d+) − (\d+) = (\d+)\skr)?$/)
        if (t.story && story) {
          const [, p, price, off, , , now] = story.map(Number)
          expect((p * price) / 100).toBe(off)
          expect(t.story).toContain(`${price}\u00a0kr`)
          if (story[4]) expect(now).toBe(price - off)
          expect(p, t.story).toBeLessThanOrEqual(50)
          if (t.answer.kind === 'int') expect(t.answer.value).toBe(story[4] ? now : off)
        }
        const cyklar = t.story?.match(/har (\d+) elever\. (\d+) av dem/)
        if (cyklar) expect((Number(cyklar[2]) * 100) / Number(cyklar[1])).toBe(value)
        if (t.story) expect(cyklar || story, t.story).toBeTruthy()
        // Varje uppgift har en känd form – annars hoppas kontrollerna ovan över i tysthet.
        const known = [/^\d+\s%\s= \?$/, /^\{\d+\/\d+\} = \?\s%$/, /^0,\d+ = \?\s%$/]
        if (t.text) expect(of || share || known.some((k) => k.test(t.text!)), t.text).toBeTruthy()
        if (!t.text && !t.story) expect(t.picture?.kind).toBe('grid')
      }
    })
    if (level !== 'latt' && grade !== 4) {
      it('ungefär var tredje uppgift är en vardagsuppgift', () => {
        const share = tasks.filter((t) => t.story).length / tasks.length
        expect(share).toBeGreaterThan(0.15)
        expect(share).toBeLessThan(0.5)
      })
    }
  }

  if (topic === 'brak') {
    it('bilden och texten stämmer med svaret', () => {
      for (const t of tasks) {
        const pic = t.picture
        if (pic?.kind === 'pizza' || pic?.kind === 'bar') {
          expect(pic.colored).toBeGreaterThan(0)
          expect(pic.colored).toBeLessThan(pic.parts)
          expect(t.answer).toMatchObject({ kind: 'fraction', num: pic.colored, den: pic.parts })
        }
        if (pic?.kind === 'set') expect(pic.marked).toBe((t.answer as { value: number }).value)
        const conv = t.text?.match(/^\{(\d+)\/(\d+)\} = \?$/)
        if (conv && t.answer.kind === 'decimal') expect(t.answer.value).toBeCloseTo(Number(conv[1]) / Number(conv[2]), 9)
        const ofMatch = t.text?.match(/^\{(\d+)\/(\d+)\} av (\d+) = \?$/)
        if (ofMatch) expect(Number(ofMatch[1]) * (Number(ofMatch[3]) / Number(ofMatch[2]))).toBe((t.answer as { value: number }).value)
        const pct = t.text?.match(/^(\d+)\s%\sav (\d+) = \?$/)
        if (pct) expect((Number(pct[1]) * Number(pct[2])) / 100).toBe((t.answer as { value: number }).value)
      }
    })
    if (grade === 4) {
      it('jämförelsen har ett enda rätt svar', () => {
        for (const t of tasks) {
          const values = t.choices!.map((c) => c.frac![0] / c.frac![1])
          const right = t.choices!.findIndex((c) => c.correct)
          const best = t.prompt!.includes('störst') ? Math.max(...values) : Math.min(...values)
          expect(values[right]).toBe(best)
          expect(new Set(values).size).toBe(values.length)
        }
      })
    }
  }
})

describe('rättning', () => {
  it('bråk: likvärdiga godtas när det är tillåtet', () => {
    const half: Answer = { kind: 'fraction', num: 1, den: 2, equivalent: true }
    expect(isCorrect(half, { kind: 'fraction', num: '2', den: '4' })).toBe(true)
    expect(isCorrect(half, { kind: 'fraction', num: '1', den: '3' })).toBe(false)
    expect(isCorrect(half, { kind: 'fraction', num: '1', den: '0' })).toBe(false)
    expect(isCorrect({ ...half, equivalent: false }, { kind: 'fraction', num: '2', den: '4' })).toBe(false)
  })

  it('klockan: 15:45 godtas för 3:45, och 12 = 0', () => {
    expect(isCorrect({ kind: 'time', h: 3, m: 45 }, { kind: 'time', h: '15', m: '45' })).toBe(true)
    expect(isCorrect({ kind: 'time', h: 3, m: 45 }, { kind: 'time', h: '4', m: '45' })).toBe(false)
    expect(isCorrect({ kind: 'time', h: 12, m: 30 }, { kind: 'time', h: '0', m: '30' })).toBe(true)
    expect(isCorrect({ kind: 'time', h: 3, m: 45 }, { kind: 'time', h: '27', m: '45' })).toBe(false)
    expect(isComplete({ kind: 'time', h: '3', m: '4' })).toBe(false)
  })

  it('decimaltal: komma, och nollan före kommat får saknas', () => {
    const quarter: Answer = { kind: 'decimal', value: 0.25 }
    expect(isCorrect(quarter, { kind: 'decimal', text: '0,25' })).toBe(true)
    expect(isCorrect(quarter, { kind: 'decimal', text: ',25' })).toBe(true)
    expect(isCorrect(quarter, { kind: 'decimal', text: '0,250' })).toBe(true)
    expect(isCorrect(quarter, { kind: 'decimal', text: '0,2' })).toBe(false)
    expect(parseDecimal(',')).toBeNull()
    expect(parseDecimal('1,2,3')).toBeNull()
  })

  it('klockslag i ord', () => {
    expect(clockWords(3, 30)).toBe('halv fyra')
    expect(clockWords(3, 45)).toBe('kvart i fyra')
    expect(clockWords(3, 15)).toBe('kvart över tre')
    expect(clockWords(3, 25)).toBe('fem i halv fyra')
    expect(clockWords(12, 30)).toBe('halv ett')
    expect(clockWords(12, 45)).toBe('kvart i ett')
    expect(clockWords(1, 0)).toBe('klockan ett')
  })

  it('talföljder', () => {
    expect(sequence({ kind: 'add', step: 3 }, 2, 5)).toEqual([2, 5, 8, 11, 14])
    expect(sequence({ kind: 'grow', first: 1, grow: 1 }, 1, 5)).toEqual([1, 2, 4, 7, 11])
    expect(sequence({ kind: 'alt', a: 5, b: -2 }, 0, 5)).toEqual([0, 5, 3, 8, 6])
    expect(sequence({ kind: 'affine', k: 2, b: 1 }, 1, 5)).toEqual([1, 3, 7, 15, 31])
  })
})
