import type { Grade, Level } from '../types'
import type { Task } from './task'
import { intChoices, pickOne, withChoices } from './util'
import { randInt } from '../generator'

/**
 * 🧩 Mönster i talföljder: "2, 5, 8, 11, ?". På Svår kan det saknade talet stå mitt i.
 * Läroplanen: "enkla mönster i talföljder" (åk 1–3), "mönster i talföljder" (åk 4–6).
 */

export type Rule =
  /** +steg varje gång (negativt = minus). */
  | { kind: 'add'; step: number }
  /** ×k varje gång. */
  | { kind: 'mul'; k: number }
  /** Steget växer: +a, +(a+1), +(a+2) … (`grow` = hur mycket steget växer). */
  | { kind: 'grow'; first: number; grow: number }
  /** Varannan gång: +a, +b, +a, +b … */
  | { kind: 'alt'; a: number; b: number }
  /** Två steg: ×k och sedan +b. */
  | { kind: 'affine'; k: number; b: number }

interface Spec {
  rules: Rule[]
  /** Starttal, min och max. */
  start: [number, number]
  /** Största tal i följden. */
  max: number
  /** Kan det saknade talet stå mitt i följden? */
  middle?: boolean
}

const add = (...steps: number[]): Rule[] => steps.map((step) => ({ kind: 'add', step }))

/** Talföljder per årskurs och nivå. Justera gärna! */
export const PATTERNS: Record<Grade, Record<Level, Spec>> = {
  1: {
    latt: { rules: add(1, 2), start: [0, 10], max: 20 },
    medel: { rules: add(2, 10), start: [0, 40], max: 100 },
    svar: { rules: [...add(-1, -2, 10), ...add(2)], start: [0, 50], max: 100, middle: true },
  },
  2: {
    latt: { rules: add(2, 5, 10), start: [0, 50], max: 100 },
    medel: { rules: add(5, -2, 3), start: [0, 60], max: 100 },
    svar: { rules: add(-5, -10, 4, 3), start: [0, 100], max: 100, middle: true },
  },
  3: {
    latt: { rules: add(3, 4, 25, 100), start: [0, 100], max: 1000 },
    medel: { rules: [{ kind: 'mul', k: 2 }, ...add(25, 50, -10)], start: [1, 200], max: 1000 },
    svar: { rules: [{ kind: 'mul', k: 2 }, ...add(-25, -50, 6, 7)], start: [1, 500], max: 1000, middle: true },
  },
  4: {
    latt: { rules: add(25, 50, 100, -10), start: [0, 300], max: 1000 },
    medel: { rules: add(-3, -25, -50, 15), start: [50, 600], max: 1000 },
    svar: { rules: [{ kind: 'mul', k: 2 }, { kind: 'mul', k: 3 }, ...add(-100, -15, 75)], start: [1, 900], max: 1000, middle: true },
  },
  5: {
    latt: { rules: [{ kind: 'grow', first: 1, grow: 1 }, ...add(-4, 12)], start: [0, 50], max: 1000 },
    medel: { rules: [{ kind: 'grow', first: 2, grow: 1 }, { kind: 'alt', a: 2, b: 3 }, { kind: 'alt', a: 5, b: 10 }], start: [0, 50], max: 1000 },
    svar: { rules: [{ kind: 'alt', a: 5, b: -2 }, { kind: 'alt', a: 10, b: -3 }, { kind: 'grow', first: 1, grow: 2 }], start: [0, 60], max: 1000, middle: true },
  },
  6: {
    latt: { rules: [{ kind: 'mul', k: 2 }, { kind: 'grow', first: 1, grow: 1 }], start: [1, 20], max: 1000 },
    medel: { rules: [{ kind: 'affine', k: 2, b: 1 }, { kind: 'affine', k: 2, b: -1 }, { kind: 'alt', a: 4, b: -1 }], start: [2, 20], max: 1000 },
    svar: { rules: [{ kind: 'affine', k: 3, b: -1 }, { kind: 'affine', k: 2, b: 2 }, { kind: 'alt', a: 7, b: -3 }, { kind: 'mul', k: 3 }], start: [2, 15], max: 1000, middle: true },
  },
}

/** Talföljden: starttal och sedan regeln `length − 1` gånger. */
export function sequence(rule: Rule, start: number, length: number): number[] {
  const seq = [start]
  for (let i = 1; i < length; i++) {
    const x = seq[i - 1]
    switch (rule.kind) {
      case 'add':
        seq.push(x + rule.step)
        break
      case 'mul':
        seq.push(x * rule.k)
        break
      case 'grow':
        seq.push(x + rule.first + rule.grow * (i - 1))
        break
      case 'alt':
        seq.push(x + (i % 2 === 1 ? rule.a : rule.b))
        break
      case 'affine':
        seq.push(x * rule.k + rule.b)
        break
    }
  }
  return seq
}

const signed = (n: number) => (n < 0 ? `−${-n}` : `+${n}`)

export function describeRule(rule: Rule): string {
  switch (rule.kind) {
    case 'add':
      return `${signed(rule.step)} varje gång`
    case 'mul':
      return `×${rule.k} varje gång`
    case 'grow':
      return `steget blir ${rule.grow} större varje gång`
    case 'alt':
      return `${signed(rule.a)}, ${signed(rule.b)}, ${signed(rule.a)}, ${signed(rule.b)} …`
    case 'affine':
      return `×${rule.k} och sedan ${signed(rule.b)} varje gång`
  }
}

export function generatePattern(grade: Grade, level: Level): Task {
  const spec = PATTERNS[grade][level]
  const rule = pickOne(spec.rules)
  const length = 5
  // Alla starttal som ger en följd inom talområdet (och utan upprepningar) – välj ett av dem.
  const ok = (s: number[]) => s.every((n) => n >= 0 && n <= spec.max) && new Set(s).size === s.length
  const starts: number[] = []
  for (let start = spec.start[0]; start <= spec.start[1]; start++) if (ok(sequence(rule, start, length))) starts.push(start)
  if (starts.length === 0) throw new Error(`Inga starttal fungerar för ${describeRule(rule)} (åk ${grade}, ${level})`)
  const seq = sequence(rule, pickOne(starts), length)
  // Svår: ibland saknas ett tal mitt i följden i stället för det sista.
  const missing = spec.middle && Math.random() < 0.5 ? randInt(2, length - 2) : length - 1
  const answer = seq[missing]
  const step = seq[missing] - seq[missing - 1]

  const task: Task = {
    prompt: missing === length - 1 ? 'Vilket tal kommer sedan?' : 'Vilket tal fattas?',
    text: seq.map((n, i) => (i === missing ? '?' : String(n))).join(', '),
    answer: { kind: 'int', value: answer },
    solution: `${seq.join(', ')} (${describeRule(rule)})`,
  }
  // Vanliga fel: samma tal som förut, fel håll, steget en gång till.
  const mistakes = [seq[missing - 1] - step, seq[missing - 1], answer + step, answer + 1, answer - 1]
  return withChoices(task, { label: String(answer), correct: true }, intChoices(answer, mistakes, spec.max), level === 'latt')
}
