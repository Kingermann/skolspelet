import { sounds } from '../game/sound'

/** Gör en klickhanterare som också spelar ett litet "klick"-ljud. */
export const tap = (fn: () => void) => () => {
  sounds.tap()
  fn()
}
