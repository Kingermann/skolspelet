/**
 * Uppgifter i de nya momenten (mönster, klockan, bråk, ekvationer).
 *
 * Till skillnad från + − × ÷ är svaret inte alltid ett heltal: det kan vara ett
 * bråk (3/4), ett decimaltal (0,25), en klocktid (3:45) eller ett val ("Vilket är störst?").
 */

export type Answer =
  | { kind: 'int'; value: number }
  | { kind: 'decimal'; value: number }
  /** `equivalent`: 2/4 godtas när svaret är 1/2. */
  | { kind: 'fraction'; num: number; den: number; equivalent: boolean }
  /** 12-timmarsklocka, h = 1–12. 15:45 godtas för 3:45 (analog klocka visar inte fm/em). */
  | { kind: 'time'; h: number; m: number }
  /** Man måste välja – inget att skriva (t.ex. jämföra bråk). */
  | { kind: 'choice' }

export interface Choice {
  label: string
  correct: boolean
  /** Visas som ett riktigt bråk (täljare över nämnare). */
  frac?: [number, number]
}

/** Bilder som ritas i koden. */
export type Picture =
  | { kind: 'pizza'; parts: number; colored: number }
  | { kind: 'bar'; parts: number; colored: number }
  /**
   * Saker i grupper om `group` (t.ex. ⅓ av 12: tre grupper om 4; group = total ⇒ en enda hög).
   * `marked` (svaret) markeras först när svaret visas – annars räknar man bara de markerade.
   */
  | { kind: 'set'; emoji: string; total: number; marked: number; group: number }
  | { kind: 'clock'; h: number; m: number }

export interface Task {
  /** Liten text överst, t.ex. "Vad är klockan?" */
  prompt?: string
  /** Stor text. Innehåller den "?" står svarsrutan där, t.ex. "2, 5, 8, ?" eller "? + 3 = 7". */
  text?: string
  /** Står före svarsrutan på en egen rad när svaret inte är inne i texten, t.ex. "x =". */
  answerPrefix?: string
  picture?: Picture
  answer: Answer
  /** Svarsalternativ: alltid på Lätt, och för uppgifter som bara går att välja. */
  choices?: Choice[]
  /** Visas när svaret avslöjas, t.ex. "x = 8 eftersom 8 + 7 = 15". */
  solution: string
}

// ---------- Det man skrivit ----------

/** Det barnet har skrivit in. Bråk och klocktider har två rutor. */
export type Typed =
  | { kind: 'int' | 'decimal'; text: string }
  | { kind: 'fraction'; num: string; den: string }
  | { kind: 'time'; h: string; m: string }

/** Decimaltal som skrivits med komma: "0,25" eller ",25". */
export function parseDecimal(text: string): number | null {
  const t = text.replace(',', '.')
  if (!/^\d*\.?\d*$/.test(t) || t === '' || t === '.') return null
  return Number(t)
}

const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b))

export function simplify(num: number, den: number): [number, number] {
  const g = gcd(num, den) || 1
  return [num / g, den / g]
}

export function isCorrect(answer: Answer, typed: Typed): boolean {
  switch (answer.kind) {
    case 'int':
      return typed.kind === 'int' && typed.text !== '' && Number(typed.text) === answer.value
    case 'decimal': {
      if (typed.kind !== 'decimal') return false
      const v = parseDecimal(typed.text)
      return v !== null && Math.abs(v - answer.value) < 1e-9
    }
    case 'fraction': {
      if (typed.kind !== 'fraction' || typed.num === '' || typed.den === '') return false
      const num = Number(typed.num)
      const den = Number(typed.den)
      if (den === 0) return false
      return answer.equivalent ? num * answer.den === answer.num * den : num === answer.num && den === answer.den
    }
    case 'time': {
      if (typed.kind !== 'time' || typed.h === '' || typed.m === '') return false
      const h = Number(typed.h)
      const m = Number(typed.m)
      return h <= 24 && h % 12 === answer.h % 12 && m === answer.m
    }
    case 'choice':
      return false
  }
}

/** Är svaret ifyllt så mycket att det går att trycka ✓? */
export function isComplete(typed: Typed): boolean {
  if (typed.kind === 'fraction') return typed.num !== '' && typed.den !== ''
  if (typed.kind === 'time') return typed.h !== '' && typed.m.length === 2
  return typed.kind === 'decimal' ? parseDecimal(typed.text) !== null : typed.text !== ''
}

export function emptyTyped(answer: Answer): Typed | null {
  switch (answer.kind) {
    case 'int':
    case 'decimal':
      return { kind: answer.kind, text: '' }
    case 'fraction':
      return { kind: 'fraction', num: '', den: '' }
    case 'time':
      return { kind: 'time', h: '', m: '' }
    case 'choice':
      return null
  }
}

// ---------- Utskrift ----------

/** Decimaltal med komma: 0.25 ⇒ "0,25". */
export const fmtDecimal = (v: number) => String(Number(v.toFixed(6))).replace('.', ',')

export const fmtTime = (h: number, m: number) => `${h}:${String(m).padStart(2, '0')}`

export function fmtAnswer(answer: Answer): string {
  switch (answer.kind) {
    case 'int':
      return String(answer.value)
    case 'decimal':
      return fmtDecimal(answer.value)
    case 'fraction':
      return `${answer.num}/${answer.den}`
    case 'time':
      return fmtTime(answer.h, answer.m)
    case 'choice':
      return ''
  }
}
