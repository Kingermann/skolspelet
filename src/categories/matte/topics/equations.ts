import { randInt } from '../generator'
import type { Grade, Level } from '../types'
import type { Task } from './task'
import { intChoices, pickOne, retry, withChoices } from './util'

/**
 * ❓ Ekvationer.
 * - Åk 1–3: obekant tal i en likhet, "? + 3 = 7" (läroplanen: "obekanta tal och hur de kan
 *   betecknas med en symbol"). Svaret skrivs där frågetecknet står.
 * - Åk 4–6: enkla ekvationer med x, "x + 7 = 15", "4x = 28", "2x + 3 = 11".
 */

/** En form, t.ex. "? + a = b". `make` slumpar fram talen och svaret. */
interface Form {
  make: () => { text: string; answer: number; check: string }
}

const MINUS = '−'

/** Tal i en form: x är svaret, a och b andra tal. */
const add = (max: number, side: 'left' | 'right' | 'flip' = 'left'): Form => ({
  make: () => {
    const sum = randInt(2, max)
    const x = randInt(1, sum - 1)
    const a = sum - x
    const text = side === 'left' ? `? + ${a} = ${sum}` : side === 'right' ? `${a} + ? = ${sum}` : `${sum} = ? + ${a}`
    return { text, answer: x, check: `${x} + ${a} = ${sum}` }
  },
})

const sub = (max: number, unknown: 'first' | 'second' | 'flip' = 'first'): Form => ({
  make: () => {
    const a = randInt(2, max)
    const b = randInt(1, a - 1)
    // a − b = c
    const c = a - b
    if (unknown === 'first') return { text: `? ${MINUS} ${b} = ${c}`, answer: a, check: `${a} ${MINUS} ${b} = ${c}` }
    if (unknown === 'second') return { text: `${a} ${MINUS} ? = ${c}`, answer: b, check: `${a} ${MINUS} ${b} = ${c}` }
    return { text: `${c} = ${a} ${MINUS} ?`, answer: b, check: `${a} ${MINUS} ${b} = ${c}` }
  },
})

const mul = (tables: number[], maxX: number, unknown: 'first' | 'second' | 'flip' = 'first'): Form => ({
  make: () => {
    const a = pickOne(tables)
    const x = randInt(1, maxX)
    const p = a * x
    const text = unknown === 'first' ? `? × ${a} = ${p}` : unknown === 'second' ? `${a} × ? = ${p}` : `${p} = ${a} × ?`
    return { text, answer: x, check: `${a} × ${x} = ${p}` }
  },
})

const div = (tables: number[], maxQ: number, unknown: 'first' | 'second' = 'first'): Form => ({
  make: () => {
    const d = pickOne(tables)
    const q = randInt(1, maxQ)
    const n = d * q
    if (unknown === 'first') return { text: `? ÷ ${d} = ${q}`, answer: n, check: `${n} ÷ ${d} = ${q}` }
    return { text: `${n} ÷ ? = ${q}`, answer: d, check: `${n} ÷ ${d} = ${q}` }
  },
})

// ---------- Med x (åk 4–6) ----------

const xAdd = (max: number, form: 'x+a' | 'a+x' | 'b=x+a' | 'x-a' | 'a-x'): Form => ({
  make: () => {
    const a = randInt(2, max - 2)
    const x = randInt(1, max - a)
    switch (form) {
      case 'x+a':
        return { text: `x + ${a} = ${x + a}`, answer: x, check: `${x} + ${a} = ${x + a}` }
      case 'a+x':
        return { text: `${a} + x = ${x + a}`, answer: x, check: `${a} + ${x} = ${x + a}` }
      case 'b=x+a':
        return { text: `${x + a} = x + ${a}`, answer: x, check: `${x} + ${a} = ${x + a}` }
      case 'x-a':
        return { text: `x ${MINUS} ${a} = ${x}`, answer: x + a, check: `${x + a} ${MINUS} ${a} = ${x}` }
      case 'a-x':
        return { text: `${x + a} ${MINUS} x = ${a}`, answer: x, check: `${x + a} ${MINUS} ${x} = ${a}` }
    }
  },
})

const xMul = (maxA: number, maxX: number, form: 'ax' | 'b=ax' | 'x/a'): Form => ({
  make: () => {
    const a = randInt(2, maxA)
    const x = randInt(2, maxX)
    if (form === 'ax') return { text: `${a}x = ${a * x}`, answer: x, check: `${a} · ${x} = ${a * x}` }
    if (form === 'b=ax') return { text: `${a * x} = ${a}x`, answer: x, check: `${a} · ${x} = ${a * x}` }
    return { text: `{x/${a}} = ${x}`, answer: a * x, check: `${a * x} ÷ ${a} = ${x}` }
  },
})

const xTwoStep = (maxA: number, maxX: number, maxB: number, form: 'ax+b' | 'ax-b' | 'c=ax+b' | 'b+ax'): Form => ({
  make: () => {
    const a = randInt(2, maxA)
    const x = randInt(1, maxX)
    // ax − b får inte bli negativt.
    const b = randInt(1, form === 'ax-b' ? Math.max(1, Math.min(maxB, a * x - 1)) : maxB)
    switch (form) {
      case 'ax+b':
        return { text: `${a}x + ${b} = ${a * x + b}`, answer: x, check: `${a} · ${x} + ${b} = ${a * x + b}` }
      case 'ax-b':
        return { text: `${a}x ${MINUS} ${b} = ${a * x - b}`, answer: x, check: `${a} · ${x} ${MINUS} ${b} = ${a * x - b}` }
      case 'c=ax+b':
        return { text: `${a * x + b} = ${a}x + ${b}`, answer: x, check: `${a} · ${x} + ${b} = ${a * x + b}` }
      case 'b+ax':
        return { text: `${b} + ${a}x = ${a * x + b}`, answer: x, check: `${b} + ${a} · ${x} = ${a * x + b}` }
    }
  },
})

/** Former per årskurs och nivå. Justera gärna! */
export const EQUATIONS: Record<Grade, Record<Level, Form[]>> = {
  1: {
    latt: [add(10)],
    medel: [add(20), add(20, 'right')],
    svar: [add(20, 'right'), add(20, 'flip'), sub(20)],
  },
  2: {
    latt: [add(20), sub(20)],
    medel: [add(100), sub(100), sub(100, 'second')],
    svar: [add(100, 'flip'), sub(100, 'second'), sub(100, 'flip')],
  },
  3: {
    latt: [mul([2, 5, 10], 10)],
    medel: [mul([2, 3, 4, 5, 10], 10), mul([2, 3, 4, 5, 10], 10, 'second'), div([2, 5, 10], 10)],
    svar: [mul([3, 4, 6, 7, 8, 9], 10, 'flip'), div([3, 4, 6, 7, 8, 9], 10), div([2, 3, 4, 5], 10, 'second'), add(1000, 'right')],
  },
  4: {
    latt: [xAdd(100, 'x+a')],
    medel: [xAdd(1000, 'x+a'), xAdd(1000, 'a+x'), xAdd(1000, 'x-a')],
    svar: [xAdd(1000, 'b=x+a'), xAdd(1000, 'a-x'), xAdd(1000, 'x-a')],
  },
  5: {
    latt: [xMul(10, 10, 'ax')],
    medel: [xMul(10, 20, 'ax'), xMul(10, 10, 'x/a')],
    svar: [xMul(12, 50, 'ax'), xMul(12, 50, 'b=ax'), xMul(12, 20, 'x/a'), xAdd(1000, 'a-x')],
  },
  6: {
    latt: [xTwoStep(5, 10, 10, 'ax+b')],
    medel: [xTwoStep(9, 12, 20, 'ax+b'), xTwoStep(9, 12, 20, 'ax-b')],
    svar: [xTwoStep(12, 30, 50, 'c=ax+b'), xTwoStep(12, 30, 50, 'b+ax'), xTwoStep(12, 30, 50, 'ax-b')],
  },
}

export function generateEquation(grade: Grade, level: Level): Task {
  const form = pickOne(EQUATIONS[grade][level])
  // Inga negativa tal och inget över 1000 någonstans.
  const eq = retry(form.make, (e) => !/-\d/.test(e.check) && (e.check.match(/\d+/g) ?? []).every((n) => Number(n) <= 1000))
  const withX = grade >= 4
  const task: Task = withX
    ? { prompt: 'Vad är x?', text: eq.text, answerPrefix: 'x =', answer: { kind: 'int', value: eq.answer }, solution: `x = ${eq.answer} (${eq.check})` }
    : { prompt: 'Vilket tal ska stå i rutan?', text: eq.text, answer: { kind: 'int', value: eq.answer }, solution: eq.text.replace('?', String(eq.answer)) }

  // Vanliga fel: räknat åt fel håll (lagt ihop i stället för dragit ifrån), bara högerledet, ±1.
  const nums = (eq.text.match(/\d+/g) ?? []).map(Number)
  const [p, q] = [nums[0] ?? 0, nums[nums.length - 1] ?? 0]
  const mistakes = [p + q, Math.abs(q - p), q, p, p * q, eq.answer * 2, eq.answer + 10]
  return withChoices(task, { label: String(eq.answer), correct: true }, intChoices(eq.answer, mistakes), level === 'latt')
}
