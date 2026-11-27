import { useEffect, useRef, useState } from 'react'
import { tap } from './tap'
import { sounds } from '../game/sound'
import { shirtLabel, STATS_DATE, type PlayerSticker, type Sticker } from '../game/stickers'

/** En enkel fotbollströja sedd bakifrån: text över axlarna och nummer, som på en riktig rygg. */
function Shirt({ color, numberColor, number, label }: { color: string; numberColor: string; number: number | string; label?: string }) {
  return (
    <svg className="shirt" viewBox="0 0 100 100" aria-hidden>
      <path
        d="M34 8 Q50 18 66 8 L88 22 L80 42 L70 37 L70 94 L30 94 L30 37 L20 42 L12 22 Z"
        fill={color}
        stroke="rgba(0,0,0,0.18)"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      {label && (
        <text
          x="50"
          y="37"
          textAnchor="middle"
          fontSize="11"
          fontWeight="700"
          fill={numberColor}
          fontFamily="Fredoka, ui-rounded, system-ui"
          // Långa namn (ARGENTINA, BRASILIEN) trycks ihop så att de får plats mellan ärmarna.
          {...(label.length > 7 ? { textLength: 54, lengthAdjust: 'spacingAndGlyphs' } : {})}
        >
          {label}
        </text>
      )}
      <text x="50" y="80" textAnchor="middle" fontSize="36" fontWeight="700" fill={numberColor} fontFamily="Fredoka, ui-rounded, system-ui">
        {number}
      </text>
    </svg>
  )
}

function PlayerCard({ player }: { player: PlayerSticker }) {
  return (
    <div className="player-card" style={{ ['--shirt' as string]: player.shirt }}>
      <span className="player-flag">{player.flag}</span>
      {player.image ? (
        <img className="player-image" src={`${import.meta.env.BASE_URL}stickers/${player.image}`} alt="" />
      ) : (
        <Shirt color={player.shirt} numberColor={player.numberColor} number={player.number} label={shirtLabel(player)} />
      )}
      <span className="player-name">{player.name}</span>
    </div>
  )
}

/** Baksidan på ett fotbollskort: fakta som på ett tryckt kort. */
function PlayerCardBack({ player }: { player: PlayerSticker }) {
  const f = player.facts
  const rows: [string, string][] = []
  if (f?.position) rows.push(['Position', f.position])
  if (f) rows.push([f.retired ? 'Sista klubb' : 'Klubb', f.club])
  if (f?.retired) rows.push(['Slutade', String(f.retired)])
  if (f?.born) rows.push(['Född', f.birthplace ? `${f.born} i ${f.birthplace}` : String(f.born)])
  if (f?.caps !== undefined) rows.push(['Landskamper', String(f.caps)])
  if (f?.goals !== undefined) rows.push(['Landslagsmål', String(f.goals)])
  const hasStats = f?.caps !== undefined || f?.goals !== undefined
  return (
    <div className="player-back" style={{ ['--shirt' as string]: player.shirt, ['--shirt-ink' as string]: player.numberColor }}>
      <div className="player-back-head">
        <span className="player-back-number">{player.number}</span>
        <span className="player-back-name">{player.name}</span>
        <span className="player-back-country">
          {player.flag} {player.country}
        </span>
      </div>
      <div className="player-back-body">
        {rows.length > 0 ? (
          <dl className="player-back-facts">
            {rows.map(([label, value]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
        ) : (
          <p className="player-back-empty">Inga fakta än</p>
        )}
        {f?.funFact && (
          <p className="player-back-fun">
            <strong>⭐ Kul att veta</strong>
            {f.funFact}
          </p>
        )}
        <div className="player-back-foot">
          {hasStats ? <span>Statistik {STATS_DATE}</span> : <span />}
          <span>⚽ Skolspelet</span>
        </div>
      </div>
    </div>
  )
}

/** Visar ett klistermärke: antingen en emoji eller ett fotbollskort. */
export function StickerView({ sticker }: { sticker: Sticker }) {
  if (sticker.kind === 'player') return <PlayerCard player={sticker} />
  return <span className="emoji-sticker">{sticker.emoji}</span>
}

/** Ett tomt fotbollskort i albumet för en spelare man inte har fått än. */
export function MissingPlayerCard() {
  return (
    <div className="player-card player-card-missing">
      <Shirt color="rgba(255,255,255,0.5)" numberColor="rgba(43,34,80,0.3)" number="?" />
      <span className="player-name">???</span>
    </div>
  )
}

/**
 * Ett fotbollskort förstorat mitt på skärmen. Det vänds direkt när det öppnas (som när man
 * vänder på ett riktigt kort), och vänds fram och tillbaka när man trycker på det.
 * ✕, Escape eller ett tryck utanför kortet stänger.
 */
export function CardViewer({ player, onClose }: { player: PlayerSticker; onClose: () => void }) {
  const [flipped, setFlipped] = useState(false)
  const card = useRef<HTMLDivElement>(null)
  // I en ref, så att effekten nedan bara körs när kortet öppnas (annars kan kortet vända sig självt igen).
  const close = useRef(onClose)
  useEffect(() => {
    close.current = onClose
  })

  useEffect(() => {
    card.current?.focus()
    // En liten paus så att man hinner se framsidan innan kortet vänds.
    const timer = setTimeout(() => setFlipped(true), 350)
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close.current()
    window.addEventListener('keydown', onKey)
    return () => {
      clearTimeout(timer)
      window.removeEventListener('keydown', onKey)
    }
  }, [])

  function flip() {
    sounds.tap()
    setFlipped((f) => !f)
  }

  return (
    <div className="card-viewer" role="dialog" aria-modal="true" aria-label={player.name} onClick={onClose}>
      <button className="card-viewer-close" aria-label="Stäng" onClick={tap(onClose)}>
        ✕
      </button>
      <div
        ref={card}
        role="button"
        tabIndex={0}
        className={`flip-card ${flipped ? 'flipped' : ''}`}
        aria-label={flipped ? 'Vänd till framsidan' : 'Vänd kortet'}
        onClick={(e) => {
          e.stopPropagation()
          flip()
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            flip()
          }
        }}
      >
        <div className="flip-inner">
          <div className="flip-face flip-front" aria-hidden={flipped}>
            <PlayerCard player={player} />
          </div>
          <div className="flip-face flip-back" aria-hidden={!flipped}>
            <PlayerCardBack player={player} />
          </div>
        </div>
      </div>
      <p className="card-viewer-hint">Tryck på kortet för att vända det</p>
    </div>
  )
}
