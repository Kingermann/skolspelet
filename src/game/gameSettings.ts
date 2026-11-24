import { createContext, useContext } from 'react'
import { DEFAULT_ROUND_LENGTH } from './constants'

/** Inställningar som gäller hela appen. Sparas bara så länge appen är igång. */
export interface GameSettings {
  /** Antal frågor per runda. */
  roundLength: number
  setRoundLength: (n: number) => void
}

export const GameSettingsContext = createContext<GameSettings>({
  roundLength: DEFAULT_ROUND_LENGTH,
  setRoundLength: () => {},
})

export const useGameSettings = () => useContext(GameSettingsContext)
