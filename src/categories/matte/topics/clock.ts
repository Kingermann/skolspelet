import { randInt } from '../generator'
import type { Grade, Level } from '../types'
import { fmtTime, type Choice, type Task } from './task'
import { intChoices, pickOne, withChoices } from './util'

/**
 * 🕐 Klockan. Åk 1–3: läsa av en analog klocka (Lätt = välj tiden i ord, annars skriv
 * den digitalt). Åk 4: "Hur lång tid?" mellan två klockslag.
 */

const HOURS = ['tolv', 'ett', 'två', 'tre', 'fyra', 'fem', 'sex', 'sju', 'åtta', 'nio', 'tio', 'elva', 'tolv']

/** Klockslaget i ord, som man säger det: 3:30 = "halv fyra", 3:25 = "fem i halv fyra". */
export function clockWords(h: number, m: number): string {
  const now = HOURS[h]
  const next = HOURS[(h % 12) + 1]
  const words: Record<number, string> = {
    0: `klockan ${now}`,
    5: `fem över ${now}`,
    10: `tio över ${now}`,
    15: `kvart över ${now}`,
    20: `tjugo över ${now}`,
    25: `fem i halv ${next}`,
    30: `halv ${next}`,
    35: `fem över halv ${next}`,
    40: `tjugo i ${next}`,
    45: `kvart i ${next}`,
    50: `tio i ${next}`,
    55: `fem i ${next}`,
  }
  const w = words[m]
  if (!w) throw new Error(`Inga ord för ${fmtTime(h, m)}`)
  return w
}

/** Vilka minuter som kan förekomma, per årskurs och nivå. Justera gärna! */
const HEL_HALV = [0, 30]
const KVART = [0, 15, 30, 45]
const FEM = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55]
const ALLA = Array.from({ length: 60 }, (_, i) => i)

export const CLOCK_MINUTES: Record<1 | 2 | 3, Record<Level, number[]>> = {
  1: { latt: HEL_HALV, medel: HEL_HALV, svar: KVART },
  2: { latt: KVART, medel: KVART, svar: FEM },
  3: { latt: FEM, medel: FEM, svar: ALLA },
}

/** Åk 4 "Hur lång tid?": minutsteg och längsta tid (minuter). */
export const DURATION: Record<Level, { step: number; max: number }> = {
  latt: { step: 15, max: 120 },
  medel: { step: 5, max: 150 },
  svar: { step: 1, max: 180 },
}

const hour12 = (h: number) => ((h - 1 + 12) % 12) + 1

/** Läsa av klockan. */
function readClock(grade: 1 | 2 | 3, level: Level): Task {
  const h = randInt(1, 12)
  const m = pickOne(CLOCK_MINUTES[grade][level])
  const task: Task = {
    prompt: 'Vad är klockan?',
    picture: { kind: 'clock', h, m },
    answer: { kind: 'time', h, m },
    solution: m % 5 === 0 ? `${clockWords(h, m)} (${fmtTime(h, m)})` : fmtTime(h, m),
  }
  if (level !== 'latt') return task

  // Vanliga fel: timmen en för lite eller för mycket ("halv fyra" = 3:30, inte 4:30),
  // visarna förväxlade, kvart i/kvart över.
  const options = CLOCK_MINUTES[grade][level]
  const wrong: [number, number][] = [
    [hour12(h + 1), m],
    [hour12(h - 1), m],
    [m === 0 ? 12 : m / 5, h * 5 === 60 ? 0 : h * 5],
    [h, (m + 30) % 60],
    [h, (60 - m) % 60],
    [h, (m + 15) % 60],
    [hour12(h + 1), (m + 30) % 60],
  ]
  const choices: Choice[] = wrong
    .filter(([wh, wm]) => options.includes(wm) && wh >= 1 && wh <= 12)
    .map(([wh, wm]) => ({ label: clockWords(wh, wm), correct: false }))
  // Fyll på med slumpade tider om de vanliga felen inte räcker.
  for (let i = 0; i < 50; i++) choices.push({ label: clockWords(randInt(1, 12), pickOne(options)), correct: false })
  return { ...withChoices(task, { label: clockWords(h, m), correct: true }, choices, true), answer: { kind: 'choice' } }
}

/** Åk 4: Hur många minuter från 8:15 till 9:40? */
function duration(level: Level): Task {
  const { step, max } = DURATION[level]
  const startMin = randInt(7 * 60, 16 * 60) // 7:00–16:00
  const start = startMin - (startMin % step)
  const length = randInt(1, max / step) * step
  const end = start + length
  const sh = Math.floor(start / 60)
  const sm = start % 60
  const eh = Math.floor(end / 60)
  const em = end % 60
  const from = fmtTime(sh, sm)
  const to = fmtTime(eh, em)
  const task: Task = {
    prompt: 'Hur lång tid är det?',
    text: `${from} → ${to} = ? min`,
    answer: { kind: 'int', value: length },
    solution: `${from} → ${to} = ${length} min${length >= 60 ? ` (${Math.floor(length / 60)} h ${length % 60} min)` : ''}`,
  }
  // Vanligt fel: räkna klockslagen som vanliga tal (9:40 − 8:15 = 940 − 815 = 125).
  const asNumbers = eh * 100 + em - (sh * 100 + sm)
  const mistakes = [asNumbers, length + 60, length - 60, length + step, length - step]
  return withChoices(task, { label: String(length), correct: true }, intChoices(length, mistakes), level === 'latt')
}

export function generateClock(grade: Grade, level: Level): Task {
  if (grade <= 3) return readClock(grade as 1 | 2 | 3, level)
  return duration(level)
}
