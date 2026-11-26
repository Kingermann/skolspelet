import type { RoundSummary } from '../types'
import { GlossRound, type GlossSettings } from './GlossRound'
import { HomeworkRound, type HomeworkSettings } from './HomeworkRound'

/** Engelska har två sorters rundor: spelets glosor och mina läxglosor. */
export type EngelskaSettings = GlossSettings | HomeworkSettings

interface Props {
  settings: EngelskaSettings
  onFinish: (firstTryCorrect: number, total: number, summary?: RoundSummary) => void
  onQuit: () => void
}

export function EngelskaPlay({ settings, onFinish, onQuit }: Props) {
  return 'homework' in settings ? (
    <HomeworkRound settings={settings} onFinish={onFinish} onQuit={onQuit} />
  ) : (
    <GlossRound settings={settings} onFinish={onFinish} onQuit={onQuit} />
  )
}
