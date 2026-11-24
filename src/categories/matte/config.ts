import type { Grade, Level, Op, TaskSpec } from './types'

/**
 * Talområden per årskurs, nivå och räknesätt.
 *
 * Här justerar ni svårigheten! Märker ni att något är för lätt eller för svårt,
 * ändra siffrorna och spara – spelet uppdateras direkt.
 */

type LevelTable = Record<Level, Partial<Record<Op, TaskSpec>>>

/** Inget tal i spelet (varken i uppgiften eller svaret) får vara större än detta. */
export const MAX_NUMBER = 1000

/** Talområde från min till max (inklusive). Listor som [2, 5, 10] betyder bara de talen. */
const r = (min: number, max: number) => ({ min, max })

const åk4Medel: Partial<Record<Op, TaskSpec>> = {
  '+': { kind: 'add', max: MAX_NUMBER, carry: 'yes' },
  '-': { kind: 'sub', max: MAX_NUMBER, borrow: 'yes' },
  '×': { kind: 'mul', a: r(11, 99), b: r(2, 9) },
  '÷': { kind: 'div', divisor: r(2, 9), quotient: r(11, 40) },
}

const åk5Medel: Partial<Record<Op, TaskSpec>> = {
  '+': { kind: 'add', max: MAX_NUMBER, carry: 'yes', missingChance: 0.3 },
  '-': { kind: 'sub', max: MAX_NUMBER, borrow: 'yes', missingChance: 0.3 },
  '×': { kind: 'mul', a: r(2, 99), b: [10, 100], max: MAX_NUMBER },
  '÷': { kind: 'div', divisor: [10, 100], quotient: r(2, 99), max: MAX_NUMBER },
}

export const CONFIG: Record<Grade, LevelTable> = {
  1: {
    latt: {
      '+': { kind: 'add', max: 10 },
      '-': { kind: 'sub', max: 10 },
    },
    medel: {
      '+': { kind: 'add', max: 20 },
      '-': { kind: 'sub', max: 20 },
    },
    svar: {
      '+': { kind: 'add', max: 20, missingChance: 0.6 },
      '-': { kind: 'sub', max: 20, missingChance: 0.6 },
    },
  },
  2: {
    latt: {
      '+': { kind: 'add', max: 20 },
      '-': { kind: 'sub', max: 20 },
      '×': { kind: 'mul', a: [2, 10], b: r(1, 10) },
    },
    medel: {
      '+': { kind: 'add', max: 100, carry: 'no' },
      '-': { kind: 'sub', max: 100, borrow: 'no' },
      '×': { kind: 'mul', a: [2, 5, 10], b: r(1, 10) },
    },
    svar: {
      '+': { kind: 'add', max: 100, carry: 'yes', missingChance: 0.4 },
      '-': { kind: 'sub', max: 100, borrow: 'yes', missingChance: 0.4 },
      '×': { kind: 'mul', a: [2, 5, 10], b: r(1, 10), missingChance: 0.6 },
    },
  },
  3: {
    latt: {
      '+': { kind: 'add', max: 100 },
      '-': { kind: 'sub', max: 100 },
      '×': { kind: 'mul', a: r(1, 5), b: r(1, 10) },
      '÷': { kind: 'div', divisor: r(1, 5), quotient: r(1, 10) },
    },
    medel: {
      '+': { kind: 'add', max: 1000 },
      '-': { kind: 'sub', max: 1000 },
      '×': { kind: 'mul', a: r(1, 10), b: r(1, 10) },
      '÷': { kind: 'div', divisor: r(1, 10), quotient: r(1, 10) },
    },
    svar: {
      '+': { kind: 'add', max: 1000, carry: 'yes', missingChance: 0.3, threeTermsChance: 0.3 },
      '-': { kind: 'sub', max: 1000, borrow: 'yes', missingChance: 0.3, threeTermsChance: 0.3 },
      '×': { kind: 'mul', a: r(2, 10), b: r(2, 10), missingChance: 0.5 },
      '÷': { kind: 'div', divisor: r(2, 10), quotient: r(2, 10), missingChance: 0.5 },
    },
  },
  4: {
    latt: {
      '+': { kind: 'add', max: 1000 },
      '-': { kind: 'sub', max: 1000 },
      '×': { kind: 'mul', a: r(1, 10), b: r(1, 10) },
      '÷': { kind: 'div', divisor: r(1, 10), quotient: r(1, 10) },
    },
    medel: åk4Medel,
    svar: {
      '+': { kind: 'add', max: MAX_NUMBER, carry: 'yes', threeTermsChance: 0.5 },
      '-': { kind: 'sub', max: MAX_NUMBER, borrow: 'yes', threeTermsChance: 0.5 },
      '×': { kind: 'mul', a: r(101, 499), b: r(2, 9), max: MAX_NUMBER },
      '÷': { kind: 'div', divisor: r(2, 9), quotient: r(21, 150), max: MAX_NUMBER },
    },
  },
  5: {
    latt: åk4Medel,
    medel: åk5Medel,
    svar: {
      '+': { kind: 'add', max: MAX_NUMBER, carry: 'yes', missingChance: 0.4, threeTermsChance: 0.3 },
      '-': { kind: 'sub', max: MAX_NUMBER, borrow: 'yes', missingChance: 0.4, threeTermsChance: 0.3 },
      '×': { kind: 'mul', a: r(11, 99), b: r(11, 99), max: MAX_NUMBER, missingChance: 0.2 },
      '÷': { kind: 'div', divisor: r(11, 25), quotient: r(2, 30), missingChance: 0.3 },
    },
  },
  6: {
    latt: åk5Medel,
    medel: {
      '+': { kind: 'prio', paren: false },
      '-': { kind: 'prio', paren: false },
      '×': { kind: 'prio', paren: false },
      '÷': { kind: 'prio', paren: false },
    },
    svar: {
      '+': { kind: 'prio', paren: true },
      '-': { kind: 'prio', paren: true },
      '×': { kind: 'prio', paren: true },
      '÷': { kind: 'prio', paren: true },
    },
  },
}

/** Vilka räknesätt som finns för en årskurs (samma för alla nivåer). */
export function opsForGrade(grade: Grade): Op[] {
  return Object.keys(CONFIG[grade].latt) as Op[]
}

export { ROUND_LENGTH } from '../../game/constants'

/** Hur många av rundans uppgifter som är textuppgifter ("Per har 2 äpplen…"). */
export const STORIES_PER_ROUND = 3
