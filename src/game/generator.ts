import { CONFIG, opsForGrade } from './config'
import type {
  AddSpec,
  DivSpec,
  Grade,
  Level,
  MulSpec,
  NumberSource,
  Op,
  OpChoice,
  PrioSpec,
  Problem,
  SubSpec,
} from './types'

// ---------- Slump-hjälpare ----------

export function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export function chance(p = 0): boolean {
  return Math.random() < p
}

function pick(source: NumberSource): number {
  if (Array.isArray(source)) return source[randInt(0, source.length - 1)]
  return randInt(source.min, source.max)
}

export function shuffle<T>(items: T[]): T[] {
  const a = [...items]
  for (let i = a.length - 1; i > 0; i--) {
    const j = randInt(0, i)
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/** Försök hitta värden som uppfyller ett villkor, annars ta det sista försöket. */
function tryUntil<T>(make: () => T, ok: (v: T) => boolean, tries = 200): T {
  let v = make()
  for (let i = 0; i < tries && !ok(v); i++) v = make()
  return v
}

// ---------- Formatering ----------

const NBSP = ' '

/** Svensk talformatering: 45 300 (mellanslag först från femsiffriga tal). */
export function fmt(n: number): string {
  const s = String(n)
  if (n < 10000) return s
  return s.replace(/\B(?=(\d{3})+(?!\d))/g, NBSP)
}

const SYMBOL: Record<Op, string> = { '+': '+', '-': '−', '×': '×', '÷': '÷' }

export function expr(...parts: (number | string)[]): string {
  return parts
    .map((p) => (typeof p === 'number' ? fmt(p) : (SYMBOL[p as Op] ?? p)))
    .join(' ')
}

export function makeProblem(template: string, answer: number, mistakes: number[], unit = 1): Problem {
  return {
    question: template,
    answer,
    solution: template.replace('?', fmt(answer)),
    mistakes: mistakes.filter((m) => Number.isInteger(m) && m >= 0 && m !== answer),
    unit,
  }
}

const isPowerOfTen = (n: number) => n >= 10 && /^10*$/.test(String(n))

// ---------- Siffer-kontroller (växling) ----------

function digits(n: number): number[] {
  return String(n).split('').reverse().map(Number)
}

/** Blir det minnessiffra (tiotalsövergång) någonstans i a + b? */
export function hasCarry(a: number, b: number): boolean {
  const da = digits(a)
  const db = digits(b)
  // Ingen minnessiffra tidigare ⇒ det räcker att kolla varje position för sig.
  return da.some((d, i) => d + (db[i] ?? 0) >= 10)
}

/** Behövs växling någonstans i a − b? */
export function hasBorrow(a: number, b: number): boolean {
  const da = digits(a)
  const db = digits(b)
  return db.some((d, i) => d > (da[i] ?? 0))
}

function matches(rule: 'no' | 'yes' | 'any' | undefined, has: boolean): boolean {
  if (rule === 'yes') return has
  if (rule === 'no') return !has
  return true
}

// ---------- Generatorer per räknesätt ----------

// ---------- Talval (används både av vanliga uppgifter och textuppgifter) ----------

function scale(spec: { max: number; step?: number }) {
  const step = spec.step ?? 1
  const max = Math.floor(spec.max / step)
  return { step, max, min: Math.max(1, Math.floor(max / 100)) }
}

/** Två termer a + b inom talområdet (och med/utan tiotalsövergång enligt spec). */
export function pickAddPair(spec: AddSpec): [number, number] {
  const { step, max, min } = scale(spec)
  const [a, b] = tryUntil(
    () => {
      const sum = randInt(2 * min, max)
      const a = randInt(min, sum - min)
      return [a, sum - a] as const
    },
    ([a, b]) => matches(spec.carry, hasCarry(a, b)),
  )
  return [a * step, b * step]
}

/** a − b där a > b, inom talområdet (och med/utan växling enligt spec). */
export function pickSubPair(spec: SubSpec): [number, number] {
  const { step, max, min } = scale(spec)
  const [a, b] = tryUntil(
    () => {
      const a = randInt(2 * min, max)
      return [a, randInt(min, a - min)] as const
    },
    ([a, b]) => matches(spec.borrow, hasBorrow(a, b)),
  )
  return [a * step, b * step]
}

export function pickMulPair(spec: MulSpec): [number, number] {
  const a = pick(spec.a)
  const b = pick(spec.b)
  return chance(0.5) ? [b, a] : [a, b]
}

/** [tal, nämnare, kvot] där divisionen alltid går jämnt ut. */
export function pickDivTriple(spec: DivSpec): [number, number, number] {
  const d = pick(spec.divisor)
  const q = pick(spec.quotient)
  return [d * q, d, q]
}

// ---------- Enkla uppgifter "a ○ b = ?" med smarta fel ----------

export function plainAdd(a: number, b: number, step = 1): Problem {
  const sum = a + b
  return makeProblem(expr(a, '+', b, '=', '?'), sum, [
    sum + step,
    sum - step,
    sum + 10 * step,
    sum - 10 * step,
    Math.abs(a - b),
  ], step)
}

export function plainSub(a: number, b: number, step = 1): Problem {
  const d = a - b
  return makeProblem(expr(a, '-', b, '=', '?'), d, [d + step, d - step, d + 10 * step, d - 10 * step, a + b], step)
}

export function plainMul(a: number, b: number): Problem {
  const p = a * b
  if (isPowerOfTen(a) || isPowerOfTen(b)) {
    // 37 × 100: vanliga fel är en nolla för mycket eller för lite
    const ten = isPowerOfTen(b) ? b : a
    return makeProblem(expr(a, '×', b, '=', '?'), p, [p * 10, p / 10, p + ten, p - ten], ten)
  }
  return makeProblem(expr(a, '×', b, '=', '?'), p, [a + b, p + a, p - a, p + b, p - b, p + 1, p - 1, p + 10])
}

export function plainDiv(n: number, d: number): Problem {
  const q = n / d
  if (isPowerOfTen(d)) {
    // 4500 ÷ 100: vanliga fel är en nolla för mycket eller för lite
    return makeProblem(expr(n, '÷', d, '=', '?'), q, [q * 10, q / 10, n / 10, q + 1, q - 1])
  }
  return makeProblem(expr(n, '÷', d, '=', '?'), q, [q + 1, q - 1, q + d, n - d, q + 10, d])
}

// ---------- Generatorer per räknesätt ----------

function genAdd(spec: AddSpec): Problem {
  const { step, max, min } = scale(spec)
  const s = (n: number) => n * step

  if (chance(spec.threeTermsChance)) {
    const sum = randInt(3 * min, max)
    const a = randInt(min, sum - 2 * min)
    const b = randInt(min, sum - a - min)
    const c = sum - a - b
    return makeProblem(expr(s(a), '+', s(b), '+', s(c), '=', '?'), s(sum), [
      s(sum) + step,
      s(sum) - step,
      s(sum) + 10 * step,
      s(sum) - 10 * step,
    ], step)
  }

  const [a, b] = pickAddPair(spec)
  const sum = a + b

  if (chance(spec.missingChance)) {
    // 3 + ? = 11  eller  ? + 8 = 11
    const hideFirst = chance(0.3)
    const known = hideFirst ? b : a
    const hidden = hideFirst ? a : b
    const template = hideFirst ? expr('?', '+', known, '=', sum) : expr(known, '+', '?', '=', sum)
    return makeProblem(template, hidden, [sum + known, hidden + step, hidden - step, hidden + 10 * step, sum], step)
  }

  return plainAdd(a, b, step)
}

function genSub(spec: SubSpec): Problem {
  const { step, max, min } = scale(spec)
  const s = (n: number) => n * step

  if (chance(spec.threeTermsChance)) {
    const a = randInt(3 * min, max)
    const b = randInt(min, a - 2 * min)
    const c = randInt(min, a - b - min)
    const d = s(a - b - c)
    return makeProblem(expr(s(a), '-', s(b), '-', s(c), '=', '?'), d, [
      d + step,
      d - step,
      s(a - b + c),
      d + 10 * step,
    ], step)
  }

  const [a, b] = pickSubPair(spec)
  const d = a - b

  if (chance(spec.missingChance)) {
    if (chance(0.5)) {
      // 12 − ? = 5
      return makeProblem(expr(a, '-', '?', '=', d), b, [a + d, d, b + step, b - step], step)
    }
    // ? − 7 = 5
    return makeProblem(expr('?', '-', b, '=', d), a, [Math.abs(d - b), a + step, a - step, a + 10 * step], step)
  }

  return plainSub(a, b, step)
}

function genMul(spec: MulSpec): Problem {
  const [a, b] = pickMulPair(spec)
  const p = a * b

  if (chance(spec.missingChance)) {
    // 6 × ? = 42
    return makeProblem(expr(a, '×', '?', '=', p), b, [b + 1, b - 1, p - a, a, b + 2])
  }

  return plainMul(a, b)
}

function genDiv(spec: DivSpec): Problem {
  const [n, d, q] = pickDivTriple(spec)

  if (!isPowerOfTen(d) && chance(spec.missingChance)) {
    if (chance(0.5)) {
      // ? ÷ 6 = 7
      return makeProblem(expr('?', '÷', d, '=', q), n, [n + d, n - d, q + d, n + 1, n - 1])
    }
    // 42 ÷ ? = 7
    return makeProblem(expr(n, '÷', '?', '=', q), d, [d + 1, d - 1, n - q, q])
  }

  return plainDiv(n, d)
}

function genPrio(spec: PrioSpec, op: Op): Problem {
  if (!spec.paren) {
    switch (op) {
      case '+': {
        // 7 + 3 × 4  eller  3 × 4 + 7
        const a = randInt(1, 50)
        const b = randInt(2, 10)
        const c = randInt(2, 10)
        const ans = a + b * c
        const t = chance(0.5) ? expr(a, '+', b, '×', c, '=', '?') : expr(b, '×', c, '+', a, '=', '?')
        return makeProblem(t, ans, [(a + b) * c, a + b + c, ans + 1, ans - 1])
      }
      case '-': {
        // 40 − 3 × 5
        const b = randInt(2, 10)
        const c = randInt(2, 10)
        const a = randInt(b * c, b * c + 40)
        const ans = a - b * c
        return makeProblem(expr(a, '-', b, '×', c, '=', '?'), ans, [(a - b) * c, a - b - c, ans + 1, ans + 10])
      }
      case '×': {
        // 6 × 7 − 5
        const a = randInt(2, 10)
        const b = randInt(2, 10)
        const c = randInt(1, a * b)
        const ans = a * b - c
        return makeProblem(expr(a, '×', b, '-', c, '=', '?'), ans, [a * (b - c), ans + 1, ans - 1, a * b + c])
      }
      case '÷': {
        // 24 ÷ 6 + 5  eller  5 + 24 ÷ 6
        const b = randInt(2, 10)
        const q = randInt(2, 10)
        const a = b * q
        const c = randInt(1, 30)
        const ans = q + c
        const t = chance(0.5) ? expr(a, '÷', b, '+', c, '=', '?') : expr(c, '+', a, '÷', b, '=', '?')
        return makeProblem(t, ans, [(a + c) / b, a / (b + c), ans + 1, ans - 1, a + c])
      }
    }
  }

  switch (op) {
    case '+': {
      // (4 + 5) × 3
      const a = randInt(1, 20)
      const b = randInt(1, 20)
      const c = randInt(2, 9)
      const ans = (a + b) * c
      return makeProblem(expr(`(${a}`, '+', `${b})`, '×', c, '=', '?'), ans, [a + b * c, ans + c, ans - c, ans + 1])
    }
    case '-': {
      // (20 − 8) × 3
      const a = randInt(5, 30)
      const b = randInt(1, a - 1)
      const c = randInt(2, 9)
      const ans = (a - b) * c
      return makeProblem(expr(`(${a}`, '-', `${b})`, '×', c, '=', '?'), ans, [a - b * c, ans + c, ans - c, ans + 1])
    }
    case '×': {
      // 4 × (6 + 3)
      const a = randInt(2, 9)
      const b = randInt(1, 15)
      const c = randInt(1, 15)
      const ans = a * (b + c)
      return makeProblem(expr(a, '×', `(${b}`, '+', `${c})`, '=', '?'), ans, [a * b + c, ans + a, ans - a, ans + 1])
    }
    case '÷': {
      // (17 + 7) ÷ 6
      const c = randInt(2, 9)
      const q = randInt(2, 12)
      const total = c * q
      const a = randInt(1, total - 1)
      const b = total - a
      return makeProblem(expr(`(${a}`, '+', `${b})`, '÷', c, '=', '?'), q, [a + b / c, q + 1, q - 1, total - c])
    }
  }
}

// ---------- Publika funktioner ----------

export function generateProblem(grade: Grade, level: Level, choice: OpChoice): Problem {
  const op: Op = choice === 'mix' ? shuffle(opsForGrade(grade))[0] : choice
  const spec = CONFIG[grade][level][op]
  if (!spec) throw new Error(`Räknesätt ${op} finns inte för åk ${grade}`)
  switch (spec.kind) {
    case 'add':
      return genAdd(spec)
    case 'sub':
      return genSub(spec)
    case 'mul':
      return genMul(spec)
    case 'div':
      return genDiv(spec)
    case 'prio':
      return genPrio(spec, op)
  }
}

/** Fyra svarsalternativ (för Lätt): rätt svar + tre "smarta" fel. */
export function makeChoices(problem: Problem): number[] {
  const { answer, unit } = problem
  const wrong = new Set<number>()
  const ok = (n: number) => Number.isInteger(n) && n >= 0 && n !== answer && !wrong.has(n)

  for (const m of shuffle(problem.mistakes)) {
    if (wrong.size >= 2) break
    if (ok(m)) wrong.add(m)
  }
  const near = [1, -1, 2, -2, 10, -10].map((k) => answer + k * unit)
  for (const n of shuffle(near)) {
    if (wrong.size >= 3) break
    if (ok(n)) wrong.add(n)
  }
  for (let k = 3; wrong.size < 3; k++) {
    if (ok(answer + k * unit)) wrong.add(answer + k * unit)
  }
  return shuffle([answer, ...wrong])
}
