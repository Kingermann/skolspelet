import { useEffect } from 'react'
import { ROUND_LENGTH } from '../game/config'
import { starsFor } from '../game/labels'
import { sounds } from '../game/sound'
import { Confetti } from './Confetti'
import { Header } from './Header'

const TITLES = { 1: 'Bra kämpat! 💪', 2: 'Bra jobbat! 😊', 3: 'Fantastiskt! 🤩' }

interface Props {
  firstTryCorrect: number
  sticker: string
  onAgain: () => void
  onHome: () => void
  onAlbum: () => void
}

export function Result({ firstTryCorrect, sticker, onAgain, onHome, onAlbum }: Props) {
  const stars = starsFor(firstTryCorrect)

  useEffect(() => {
    sounds.fanfare()
    const t = setTimeout(sounds.sticker, 1600)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="screen">
      <Confetti amount={stars === 3 ? 120 : 60} />
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
          Du fick <strong>{firstTryCorrect}</strong> av {ROUND_LENGTH} rätt på första försöket!
        </p>
        <div className="new-sticker">
          <span className="new-sticker-label">Nytt klistermärke!</span>
          <button className="new-sticker-emoji" onClick={onAlbum} aria-label="Visa albumet">
            {sticker}
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
