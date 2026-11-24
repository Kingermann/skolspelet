import { useEffect } from 'react'
import { starsFor } from '../game/constants'
import { celebrateRound } from '../game/celebrate'
import { sounds } from '../game/sound'
import type { Sticker } from '../game/stickers'
import { Header } from './Header'
import { StickerView } from './StickerView'

const TITLES = { 1: 'Bra kämpat! 💪', 2: 'Bra jobbat! 😊', 3: 'Fantastiskt! 🤩' }

interface Props {
  firstTryCorrect: number
  total: number
  sticker: Sticker
  onAgain: () => void
  onHome: () => void
  onAlbum: () => void
}

export function Result({ firstTryCorrect, total, sticker, onAgain, onHome, onAlbum }: Props) {
  const stars = starsFor(firstTryCorrect, total)

  useEffect(() => {
    sounds.fanfare()
    const stopFireworks = celebrateRound(stars)
    const t = setTimeout(sounds.sticker, 1600)
    return () => {
      clearTimeout(t)
      stopFireworks()
    }
  }, [stars])

  return (
    <div className="screen">
      <Header onBack={onHome} backIcon="🏠" backLabel="Till start" />
      <div className="result">
        <h2 className="result-title">{TITLES[stars]}</h2>
        <div className="stars">
          {[1, 2, 3].map((n) => (
            <span key={n} className={`star ${n <= stars ? 'star-on' : 'star-off'}`} style={{ animationDelay: `${n * 0.3}s` }}>
              ★
            </span>
          ))}
        </div>
        <p className="result-text">
          Du fick <strong>{firstTryCorrect}</strong> av {total} rätt på första försöket!
        </p>
        <div className="new-sticker">
          <span className="new-sticker-label">
            {sticker.kind === 'player' ? 'Nytt fotbollskort! ⚽' : 'Nytt klistermärke!'}
          </span>
          <button className={`new-sticker-btn new-sticker-${sticker.kind}`} onClick={onAlbum} aria-label="Visa albumet">
            <StickerView sticker={sticker} />
          </button>
        </div>
        <button className="big-btn primary" onClick={onAgain}>
          Spela igen 🔁
        </button>
        <button className="big-btn secondary" onClick={onHome}>
          Till start 🏠
        </button>
      </div>
    </div>
  )
}
