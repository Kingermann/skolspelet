import { createContext, useContext } from 'react'

export interface SoundState {
  on: boolean
  toggle: () => void
}

export const SoundContext = createContext<SoundState>({ on: true, toggle: () => {} })

export const useSound = () => useContext(SoundContext)
