import type { Grade, Level } from '../types'
import { generateClock } from './clock'
import { generateEquation } from './equations'
import { generateFraction } from './fractions'
import { generatePattern } from './patterns'
import type { Task } from './task'

/** De nya momenten i Matte (utöver + − × ÷). */
export type Topic = 'brak' | 'ekvation' | 'klocka' | 'monster'

export const TOPIC_INFO: Record<Topic, { icon: string; label: string; color: string }> = {
  brak: { icon: '🍕', label: 'Bråk', color: '#ff5ccf' },
  ekvation: { icon: '❓', label: 'Ekvationer', color: '#00b4d8' },
  klocka: { icon: '🕐', label: 'Klockan', color: '#ffb703' },
  monster: { icon: '🧩', label: 'Mönster', color: '#2ec27e' },
}

/**
 * Vilka moment som finns i vilken årskurs. Läroplanen (Lgr22) säger bara åk 1–3 och 4–6 –
 * fördelningen inom stadiet följer hur läromedel brukar lägga upp det. Justera gärna!
 */
export const TOPICS_FOR_GRADE: Record<Grade, Topic[]> = {
  1: ['ekvation', 'klocka', 'monster'],
  2: ['brak', 'ekvation', 'klocka', 'monster'],
  3: ['brak', 'ekvation', 'klocka', 'monster'],
  4: ['brak', 'ekvation', 'klocka', 'monster'],
  5: ['brak', 'ekvation', 'monster'],
  6: ['brak', 'ekvation', 'monster'],
}

export const isTopic = (choice: string): choice is Topic => choice in TOPIC_INFO

export function generateTask(grade: Grade, level: Level, topic: Topic): Task {
  switch (topic) {
    case 'brak':
      return generateFraction(grade, level)
    case 'ekvation':
      return generateEquation(grade, level)
    case 'klocka':
      return generateClock(grade, level)
    case 'monster':
      return generatePattern(grade, level)
  }
}

/** Nyckel för att undvika samma uppgift två gånger i en runda. */
const taskKey = (t: Task) => JSON.stringify([t.text, t.picture, t.prompt, t.choices?.map((c) => c.label).sort()])

/** En runda med olika uppgifter (så långt det går). */
export function generateTopicRound(grade: Grade, level: Level, topic: Topic, length: number): Task[] {
  const seen = new Set<string>()
  const round: Task[] = []
  for (let i = 0; i < length; i++) {
    let t = generateTask(grade, level, topic)
    for (let tries = 0; tries < 50 && seen.has(taskKey(t)); tries++) t = generateTask(grade, level, topic)
    seen.add(taskKey(t))
    round.push(t)
  }
  return round
}
