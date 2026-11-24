import type { ReactNode } from 'react'
import { sounds } from '../game/sound'
import { useSound } from './SoundContext'

interface Props {
  /** Knapp till vänster, t.ex. "tillbaka" eller "hem". Utelämna för ingen knapp. */
  onBack?: () => void
  backIcon?: string
  backLabel?: string
  children?: ReactNode
}

export function Header({ onBack, backIcon = '←', backLabel = 'Tillbaka', children }: Props) {
  const sound = useSound()
  return (
    <header className="header">
      {onBack ? (
        <button
          className="icon-btn"
          aria-label={backLabel}
          onClick={() => {
            sounds.tap()
            onBack()
          }}
        >
          {backIcon}
        </button>
      ) : (
        <span className="icon-btn-placeholder" />
      )}
      <div className="header-center">{children}</div>
      <button className="icon-btn" aria-label={sound.on ? 'Stäng av ljud' : 'Sätt på ljud'} onClick={sound.toggle}>
        {sound.on ? '🔊' : '🔇'}
      </button>
    </header>
  )
}
