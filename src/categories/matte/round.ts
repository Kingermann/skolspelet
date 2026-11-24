import { DEFAULT_ROUND_LENGTH } from '../../game/constants'
import { STORY_SHARE } from './config'
import { generateProblem, shuffle } from './generator'
import { generateStory } from './stories'
import type { Grade, Level, OpChoice, Problem } from './types'

/**
 * En runda: vanliga uppgifter blandat med några textuppgifter på slumpade platser.
 * Uppgifterna är unika (så långt det går).
 */
export function generateRound(
  grade: Grade,
  level: Level,
  choice: OpChoice,
  length = DEFAULT_ROUND_LENGTH,
  stories = Math.round(length * STORY_SHARE),
): Problem[] {
  const storySlots = new Set(shuffle([...Array(length).keys()]).slice(0, stories))
  const key = (p: Problem) => p.story ?? p.question
  const seen = new Set<string>()
  const round: Problem[] = []

  for (let i = 0; i < length; i++) {
    const make = () => (storySlots.has(i) ? generateStory(grade, level, choice) : generateProblem(grade, level, choice))
    let p = make()
    for (let tries = 0; tries < 50 && seen.has(key(p)); tries++) p = make()
    seen.add(key(p))
    round.push(p)
  }
  return round
}
