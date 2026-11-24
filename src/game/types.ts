export type Grade = 1 | 2 | 3 | 4 | 5 | 6
export type Level = 'latt' | 'medel' | 'svar'
export type Op = '+' | '-' | '×' | '÷'
export type OpChoice = Op | 'mix'

/** Ett talområde {min, max} (inklusive) eller en lista med tillåtna tal. */
export type NumberSource = { min: number; max: number } | number[]

export interface AddSpec {
  kind: 'add'
  /** Största tillåtna summa. */
  max: number
  /** 'no' = ingen tiotalsövergång, 'yes' = minst en, 'any' = valfritt. */
  carry?: 'no' | 'yes' | 'any'
  /** Talen är jämna multiplar av detta (t.ex. 100 ⇒ 45 300 + 12 800). */
  step?: number
  /** Sannolikhet (0–1) att uppgiften blir "saknat tal": 3 + ? = 11. */
  missingChance?: number
  /** Sannolikhet (0–1) att uppgiften får tre termer. */
  threeTermsChance?: number
}

export interface SubSpec {
  kind: 'sub'
  /** Största tillåtna tal att räkna från. */
  max: number
  /** 'no' = ingen växling, 'yes' = minst en växling, 'any' = valfritt. */
  borrow?: 'no' | 'yes' | 'any'
  step?: number
  missingChance?: number
  threeTermsChance?: number
}

export interface MulSpec {
  kind: 'mul'
  a: NumberSource
  b: NumberSource
  missingChance?: number
}

export interface DivSpec {
  kind: 'div'
  divisor: NumberSource
  quotient: NumberSource
  missingChance?: number
}

/** Prioriteringsregler, t.ex. 3 + 4 × 5. Med parentes: (3 + 4) × 5. */
export interface PrioSpec {
  kind: 'prio'
  paren: boolean
}

export type TaskSpec = AddSpec | SubSpec | MulSpec | DivSpec | PrioSpec

export interface Problem {
  /** Uppgiften med "?" där svaret ska stå, t.ex. "7 × 8 = ?" eller "3 + ? = 11". */
  question: string
  answer: number
  /** Hela uträkningen med svaret ifyllt, t.ex. "7 × 8 = 56". */
  solution: string
  /** Vanliga felsvar, används för att göra smarta svarsalternativ på Lätt. */
  mistakes: number[]
  /** Hur "grovt" svaret är (1, 10, 100…). Smarta fel ändras med denna storlek. */
  unit: number
}
