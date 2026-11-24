import { describe, expect, it } from 'vitest'
import { CONFIG, MAX_NUMBER, opsForGrade } from './config'
import { generateProblem, hasBorrow, hasCarry, makeChoices } from './generator'
import { generateRound } from './round'
import { generateStory } from './stories'
import type { Grade, Level, OpChoice, Problem } from './types'

const GRADES: Grade[] = [1, 2, 3, 4, 5, 6]
const LEVELS: Level[] = ['latt', 'medel', 'svar']
const SAMPLES = 400

/** Räknar ut ett uttryck som "45 300 + 12 800" eller "(4 + 5) × 3". */
function evaluate(expression: string): number {
  const js = expression.replace(/[\s ]/g, '').replace(/−/g, '-').replace(/×/g, '*').replace(/÷/g, '/')
  if (!/^[\d+\-*/()]+$/.test(js)) throw new Error(`Oväntat uttryck: ${expression}`)
  return Function(`"use strict"; return (${js})`)() as number
}

function numbersIn(text: string): number[] {
  return (text.replace(/ /g, '').match(/\d+/g) ?? []).map(Number)
}

function allCombos(): [Grade, Level, OpChoice][] {
  return GRADES.flatMap((g) =>
    LEVELS.flatMap((l) => [...opsForGrade(g), 'mix' as const].map((op) => [g, l, op] as [Grade, Level, OpChoice])),
  )
}

describe.each(allCombos())('åk %i, %s, %s', (grade, level, op) => {
  const problems: Problem[] = Array.from({ length: SAMPLES }, () => generateProblem(grade, level, op))

  it('facit stämmer: uträkningen går ihop', () => {
    for (const p of problems) {
      const [left, right] = p.solution.split('=')
      expect(evaluate(left), p.solution).toBe(evaluate(right))
    }
  })

  it('svaret är alltid ett heltal ≥ 0', () => {
    for (const p of problems) {
      expect(Number.isInteger(p.answer), p.question).toBe(true)
      expect(p.answer, p.question).toBeGreaterThanOrEqual(0)
    }
  })

  it('frågan har exakt ett frågetecken', () => {
    for (const p of problems) expect(p.question.split('?').length - 1, p.question).toBe(1)
  })

  it('svarsalternativen på Lätt: fyra olika, rätt svar finns med, inga negativa', () => {
    for (const p of problems) {
      const choices = makeChoices(p)
      expect(choices).toHaveLength(4)
      expect(new Set(choices).size).toBe(4)
      expect(choices).toContain(p.answer)
      for (const c of choices) {
        expect(Number.isInteger(c)).toBe(true)
        expect(c).toBeGreaterThanOrEqual(0)
      }
    }
  })
})

describe('talområden', () => {
  it(`inget tal är större än ${MAX_NUMBER} – varken i uppgifter, textuppgifter eller svar`, () => {
    for (const [grade, level, op] of allCombos()) {
      for (let i = 0; i < SAMPLES; i++) {
        for (const p of [generateProblem(grade, level, op), generateStory(grade, level, op)]) {
          const text = `${p.solution} ${p.story ?? ''}`.replace(/(\d)\u00A0(\d)/g, '$1$2')
          for (const x of numbersIn(text)) expect(x, `åk ${grade} ${level}: ${p.story ?? p.solution}`).toBeLessThanOrEqual(MAX_NUMBER)
        }
      }
    }
  })

  it(`svarsalternativen på Lätt är aldrig större än ${MAX_NUMBER}`, () => {
    for (const [grade, op] of GRADES.flatMap((g) => [...opsForGrade(g), 'mix' as const].map((o) => [g, o] as const))) {
      for (let i = 0; i < SAMPLES; i++) {
        for (const c of makeChoices(generateProblem(grade, 'latt', op))) expect(c).toBeLessThanOrEqual(MAX_NUMBER)
      }
    }
  })

  it('åk 1 använder bara tal upp till 20', () => {
    for (const level of LEVELS) {
      for (let i = 0; i < SAMPLES; i++) {
        const p = generateProblem(1, level, 'mix')
        for (const n of numbersIn(p.solution)) expect(n, p.solution).toBeLessThanOrEqual(20)
      }
    }
  })

  it('addition och subtraktion håller sig inom max', () => {
    for (const grade of GRADES) {
      for (const level of LEVELS) {
        for (const op of ['+', '-'] as const) {
          const spec = CONFIG[grade][level][op]
          if (spec?.kind !== 'add' && spec?.kind !== 'sub') continue
          for (let i = 0; i < SAMPLES; i++) {
            const p = generateProblem(grade, level, op)
            for (const n of numbersIn(p.solution)) {
              expect(n, `åk ${grade} ${level}: ${p.solution}`).toBeLessThanOrEqual(spec.max)
            }
          }
        }
      }
    }
  })

  it('åk 2 Lätt multiplikation: alltid 2:ans eller 10:ans tabell', () => {
    for (let i = 0; i < SAMPLES; i++) {
      const [a, b] = numbersIn(generateProblem(2, 'latt', '×').solution)
      expect([a, b].some((n) => n === 2 || n === 10)).toBe(true)
    }
  })

  it('åk 2 Medel: ingen växling', () => {
    for (let i = 0; i < SAMPLES; i++) {
      const [a, b] = numbersIn(generateProblem(2, 'medel', '+').solution)
      expect(hasCarry(a, b), `${a} + ${b}`).toBe(false)
      const [c, d] = numbersIn(generateProblem(2, 'medel', '-').solution)
      expect(hasBorrow(c, d), `${c} − ${d}`).toBe(false)
    }
  })

  it('åk 2 Svår (utan saknat tal): alltid växling', () => {
    for (let i = 0; i < SAMPLES; i++) {
      const p = generateProblem(2, 'svar', '+')
      if (!p.question.endsWith('?')) continue
      const [a, b] = numbersIn(p.solution)
      expect(hasCarry(a, b), p.solution).toBe(true)
    }
  })
})

describe('växlingskontroller', () => {
  it('hasCarry', () => {
    expect(hasCarry(23, 45)).toBe(false)
    expect(hasCarry(27, 45)).toBe(true)
    expect(hasCarry(150, 60)).toBe(true)
  })
  it('hasBorrow', () => {
    expect(hasBorrow(58, 23)).toBe(false)
    expect(hasBorrow(52, 27)).toBe(true)
    expect(hasBorrow(305, 20)).toBe(true)
  })
})

describe.each(allCombos())('textuppgifter åk %i, %s, %s', (grade, level, op) => {
  const stories: Problem[] = Array.from({ length: SAMPLES }, () => generateStory(grade, level, op))

  it('facit stämmer och svaret är ett heltal ≥ 0', () => {
    for (const p of stories) {
      const [left, right] = p.solution.split('=')
      expect(evaluate(left), p.story).toBe(evaluate(right))
      expect(Number.isInteger(p.answer), p.story).toBe(true)
      expect(p.answer, p.story).toBeGreaterThanOrEqual(0)
    }
  })

  it('har alltid en berättelse och en enhet för svaret', () => {
    for (const p of stories) {
      expect(p.story, p.question).toBeTruthy()
      expect(p.answerLabel, p.question).toBeTruthy()
      expect(p.story).not.toMatch(/undefined|NaN|\?\s*\?/)
      expect(p.story).toMatch(/\?$/)
    }
  })

  it('alla tal i uträkningen finns med i berättelsen', () => {
    for (const p of stories) {
      const storyNumbers = numbersIn(p.story!.replace(/(\d)\u00A0(\d)/g, '$1$2'))
      const [left] = p.solution.split('=')
      for (const x of numbersIn(left)) expect(storyNumbers, `${p.story} ⇒ ${p.solution}`).toContain(x)
    }
  })

  it('svarsalternativen på Lätt fungerar', () => {
    for (const p of stories) {
      const choices = makeChoices(p)
      expect(new Set(choices).size).toBe(4)
      expect(choices).toContain(p.answer)
    }
  })
})

describe('generateRound', () => {
  it('ger 10 unika uppgifter varav 3 textuppgifter', () => {
    for (const grade of GRADES) {
      for (const level of LEVELS) {
        const round = generateRound(grade, level, 'mix')
        expect(round).toHaveLength(10)
        expect(new Set(round.map((p) => p.story ?? p.question)).size).toBe(10)
        expect(round.filter((p) => p.story)).toHaveLength(3)
      }
    }
  })
})
