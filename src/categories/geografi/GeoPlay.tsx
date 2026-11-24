import { FlagRound } from './FlagRound'
import { MapRound } from './MapRound'
import type { GeoSettings } from './settings'

export type { GeoSettings } from './settings'

interface Props {
  settings: GeoSettings
  onFinish: (firstTryCorrect: number, total: number) => void
  onQuit: () => void
}

/** Startar rätt spelläge. */
export function GeoPlay(props: Props) {
  return props.settings.mode === 'flaggor' ? <FlagRound {...props} /> : <MapRound {...props} />
}
