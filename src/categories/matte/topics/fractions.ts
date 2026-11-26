import { randInt, shuffle } from '../generator'
import type { Grade, Level } from '../types'
import { fmtDecimal, simplify, type Choice, type Task } from './task'
import { intChoices, pickOne, retry, withChoices } from './util'

/**
 * 🍕 Bråk.
 * - Åk 2: hur stor del är färgad? (pizza eller chokladkaka)
 * - Åk 3: del av antal (½ av 8)
 * - Åk 4: jämföra bråk (välj det största/minsta)
 * - Åk 5: bråk ↔ decimaltal
 * - Åk 6: bråk, decimaltal och procent
 *
 * I texten skrivs bråk som {3/4} – de visas som riktiga bråk (täljare över nämnare).
 */

const frac = (n: number, d: number) => `{${n}/${d}}`
const plain = (n: number, d: number) => `${n}/${d}`
const value = (n: number, d: number) => n / d
const fracChoice = (n: number, d: number, correct = false): Choice => ({ label: plain(n, d), correct, frac: [n, d] })

/** Bråkalternativ som inte är lika med svaret (2/4 får inte vara "fel" när svaret är 1/2). */
function fractionWrongs(n: number, d: number, candidates: [number, number][]): Choice[] {
  return candidates
    .filter(([cn, cd]) => cn > 0 && cd > 0 && cn <= 100 && cd <= 100 && Math.abs(value(cn, cd) - value(n, d)) > 1e-9)
    .map(([cn, cd]) => fracChoice(cn, cd))
}

// ---------- Åk 2: hur stor del är färgad? ----------

/** Antal delar per nivå. Justera gärna! */
export const PARTS: Record<Level, { parts: number[]; onlyOne: boolean }> = {
  latt: { parts: [2, 3, 4, 5, 6], onlyOne: true },
  medel: { parts: [2, 3, 4, 5, 6], onlyOne: false },
  svar: { parts: [4, 5, 6, 8, 10], onlyOne: false },
}

function coloredPart(level: Level): Task {
  const { parts, onlyOne } = PARTS[level]
  const d = pickOne(parts)
  const n = onlyOne ? 1 : randInt(1, d - 1)
  // Pizzor upp till åtta bitar, annars chokladkaka.
  const kind = d <= 8 && Math.random() < 0.5 ? 'pizza' : 'bar'
  const task: Task = {
    prompt: 'Hur stor del är färgad?',
    picture: { kind, parts: d, colored: n },
    answer: { kind: 'fraction', num: n, den: d, equivalent: true },
    solution: simplify(n, d)[1] !== d ? `${plain(n, d)} = ${plain(...simplify(n, d))}` : plain(n, d),
  }
  // Vanliga fel: färgade delar av ofärgade (1/3 i stället för 1/4), ofärgad del, upp och ner.
  const wrong = fractionWrongs(n, d, [
    [n, d - n],
    [d - n, d],
    [n, d + 1],
    [n, d - 1],
    [n + 1, d],
    ...shuffle([2, 3, 4, 5, 6, 8].map((x): [number, number] => [1, x])),
  ])
  return withChoices(task, fracChoice(n, d, true), wrong, level === 'latt')
}

// ---------- Åk 3: del av antal ----------

export const PART_OF: Record<Level, { dens: number[]; groupMax: number; numeratorOne: boolean }> = {
  latt: { dens: [2, 3, 4], groupMax: 5, numeratorOne: true },
  medel: { dens: [2, 3, 4, 5, 10], groupMax: 10, numeratorOne: true },
  svar: { dens: [3, 4, 5, 6, 10], groupMax: 10, numeratorOne: false },
}

const THINGS = ['🍎', '⚽', '🍓', '⭐', '🐟', '🧁']
/** Fler saker än så blir för plottrigt att visa. */
const MAX_PICTURE = 24

function partOf(level: Level): Task {
  const { dens, groupMax, numeratorOne } = PART_OF[level]
  const d = pickOne(dens)
  // Bara förkortade bråk (inte 3/6) och grupper om minst två (inte ¼ av 4).
  const n = numeratorOne ? 1 : pickOne(Array.from({ length: d - 2 }, (_, i) => i + 2).filter((k) => simplify(k, d)[1] === d))
  const group = randInt(2, groupMax)
  const total = d * group
  const answer = n * group
  const task: Task = {
    text: `${frac(n, d)} av ${total} = ?`,
    // Lätt: sakerna är redan uppdelade i grupper. Annars får man dela upp dem själv.
    picture: total <= MAX_PICTURE ? { kind: 'set', emoji: pickOne(THINGS), total, marked: answer, group: level === 'latt' ? group : total } : undefined,
    answer: { kind: 'int', value: answer },
    solution:
      n === 1 ? `${plain(1, d)} av ${total} = ${total} ÷ ${d} = ${answer}` : `${plain(n, d)} av ${total} = ${n} × (${total} ÷ ${d}) = ${answer}`,
  }
  // Vanliga fel: bara delat (glömt täljaren), resten, multiplicerat.
  const mistakes = [group, total - answer, total - group, d, total * n, answer + group]
  return withChoices(task, { label: String(answer), correct: true }, intChoices(answer, mistakes), level === 'latt')
}

// ---------- Åk 4: jämföra bråk ----------

function compare(level: Level): Task {
  const count = level === 'latt' ? 2 : 3
  const biggest = Math.random() < 0.6
  const pickSet = (): [number, number][] => {
    const kind = level === 'svar' ? 'any' : pickOne(['sameDen', 'unit'] as const)
    if (kind === 'sameDen') {
      const d = randInt(count + 2, 10)
      return shuffle(Array.from({ length: d - 1 }, (_, i): [number, number] => [i + 1, d])).slice(0, count)
    }
    if (kind === 'unit') return shuffle([2, 3, 4, 5, 6, 8, 10].map((d): [number, number] => [1, d])).slice(0, count)
    return Array.from({ length: count }, (): [number, number] => {
      const d = randInt(3, 10)
      return [randInt(2, d - 1), d]
    })
  }
  const set = retry(pickSet, (s) => new Set(s.map(([n, d]) => value(n, d))).size === s.length)
  const sorted = [...set].sort((a, b) => value(...a) - value(...b))
  const [an, ad] = biggest ? sorted[sorted.length - 1] : sorted[0]
  return {
    prompt: biggest ? 'Vilket bråk är störst?' : 'Vilket bråk är minst?',
    answer: { kind: 'choice' },
    choices: set.map(([n, d]) => fracChoice(n, d, n === an && d === ad)),
    solution: sorted.map(([n, d]) => plain(n, d)).join(' < '),
  }
}

// ---------- Åk 5: bråk ↔ decimaltal ----------

/** Nämnare per nivå (bara sådana som blir "jämna" decimaltal). Justera gärna! */
export const DECIMAL_DENS: Record<Level, number[]> = {
  latt: [2, 4, 10],
  medel: [2, 4, 5, 10],
  svar: [4, 5, 10, 20, 25, 50, 100],
}

function pickFraction(dens: number[]): [number, number] {
  const d = pickOne(dens)
  return simplify(randInt(1, d - 1), d)
}

/** Vanliga fel: "0,14" för 1/4, nämnaren delad med täljaren, tiondelar i stället för hundradelar. */
function decimalWrongs(n: number, d: number): Choice[] {
  const v = value(n, d)
  const candidates = [Number(`0.${n}${d}`), Number(`0.${d}`), Number(`0.${n}`), v * 10, v / 10, v + 0.1, v - 0.1, 1 - v, v + 0.05]
  return candidates
    .filter((c) => c > 0 && Math.abs(c - v) > 1e-9 && fmtDecimal(c).length <= 5)
    .map((c) => ({ label: fmtDecimal(c), correct: false }))
}

function fractionDecimal(level: Level): Task {
  const [n, d] = pickFraction(DECIMAL_DENS[level])
  const v = value(n, d)
  const easy = level === 'latt'
  if (Math.random() < 0.6) {
    const task: Task = {
      text: `${frac(n, d)} = ?`,
      answer: { kind: 'decimal', value: v },
      solution: `${plain(n, d)} = ${fmtDecimal(v)}`,
    }
    return withChoices(task, { label: fmtDecimal(v), correct: true }, decimalWrongs(n, d), easy)
  }
  const task: Task = {
    text: `${fmtDecimal(v)} = ?`,
    answer: { kind: 'fraction', num: n, den: d, equivalent: true },
    solution: `${fmtDecimal(v)} = ${plain(n, d)}`,
  }
  const wrong = fractionWrongs(n, d, [
    [1, Math.round(1 / v)],
    [n, d * 10],
    [d, n],
    [Math.round(v * 10), 100],
    ...shuffle(DECIMAL_DENS[level].map((x): [number, number] => [1, x])),
  ])
  return withChoices(task, fracChoice(n, d, true), wrong, easy)
}

// ---------- Åk 6: bråk, decimaltal och procent ----------

export const PERCENT_DENS: Record<Level, number[]> = {
  latt: [2, 4, 10],
  medel: [2, 4, 5, 10, 20],
  svar: [4, 5, 10, 20, 25, 50],
}

function percent(level: Level): Task {
  const [n, d] = pickFraction(PERCENT_DENS[level])
  const p = Math.round(value(n, d) * 100)
  const easy = level === 'latt'
  const kinds = level === 'svar' ? ['frac', 'dec', 'toFrac', 'toDec', 'of'] : ['frac', 'dec', 'toFrac']
  const kind = pickOne(kinds)
  const pctWrong = (extra: number[]) => intChoices(p, [...extra, p / 10, p * 10, 100 - p, n * 10 + d], 100)

  if (kind === 'frac' || kind === 'dec') {
    const shown = kind === 'frac' ? frac(n, d) : fmtDecimal(value(n, d))
    const task: Task = {
      text: `${shown} = ? %`,
      answer: { kind: 'int', value: p },
      solution: `${kind === 'frac' ? plain(n, d) : fmtDecimal(value(n, d))} = ${p} %`,
    }
    return withChoices(task, { label: `${p}`, correct: true }, pctWrong(kind === 'frac' ? [n, d, Number(`${n}${d}`)] : []), easy)
  }
  if (kind === 'toFrac') {
    const task: Task = {
      text: `${p} % = ?`,
      answer: { kind: 'fraction', num: n, den: d, equivalent: true },
      solution: `${p} % = ${plain(p, 100)} = ${plain(n, d)}`,
    }
    const wrong = fractionWrongs(n, d, [[1, p], [p, 10], [1, Math.max(2, Math.round(100 / p) + 1)], [n, d + 1], [d - n, d]])
    return withChoices(task, fracChoice(n, d, true), wrong, easy)
  }
  if (kind === 'toDec') {
    const task: Task = {
      text: `${p} % = ?`,
      answer: { kind: 'decimal', value: p / 100 },
      solution: `${p} % = ${fmtDecimal(p / 100)}`,
    }
    return withChoices(task, { label: fmtDecimal(p / 100), correct: true }, decimalWrongs(n, d), easy)
  }
  // "20 % av 300"
  const whole = pickOne([100, 200, 300, 400, 500, 600, 800, 1000].filter((w) => (w * p) % 100 === 0))
  const answer = (whole * p) / 100
  const task: Task = {
    text: `${p} % av ${whole} = ?`,
    answer: { kind: 'int', value: answer },
    solution: `${p} % av ${whole} = ${plain(n, d)} av ${whole} = ${answer}`,
  }
  return withChoices(task, { label: String(answer), correct: true }, intChoices(answer, [whole - answer, p, whole / p, answer * 10]), easy)
}

export function generateFraction(grade: Grade, level: Level): Task {
  switch (grade) {
    case 1:
    case 2:
      return coloredPart(level)
    case 3:
      return partOf(level)
    case 4:
      return compare(level)
    case 5:
      return fractionDecimal(level)
    case 6:
      return percent(level)
  }
}
