import { createContext, useContext } from 'react'
import { DEFAULT_ROUND_LENGTH, type Stars } from './constants'

/** Inställningar och framsteg för den som spelar just nu (sparas i profilen). */
export interface GameSettings {
  /** Antal frågor per runda. */
  roundLength: number
  setRoundLength: (n: number) => void
  /** Bästa antal stjärnor i den valda kategorin med de här valen, om man spelat dem. */
  bestStars: (settings: object) => Stars | undefined
}

export const GameSettingsContext = createContext<GameSettings>({
  roundLength: DEFAULT_ROUND_LENGTH,
  setRoundLength: () => {},
  bestStars: () => undefined,
})

export const useGameSettings = () => useContext(GameSettingsContext)
