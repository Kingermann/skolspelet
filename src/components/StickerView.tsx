import type { PlayerSticker, Sticker } from '../game/stickers'

/** En enkel fotbollströja med nummer. */
function Shirt({ color, numberColor, number }: { color: string; numberColor: string; number: number | string }) {
  return (
    <svg className="shirt" viewBox="0 0 100 100" aria-hidden>
      <path
        d="M34 8 Q50 18 66 8 L88 22 L80 42 L70 37 L70 94 L30 94 L30 37 L20 42 L12 22 Z"
        fill={color}
        stroke="rgba(0,0,0,0.18)"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <text x="50" y="72" textAnchor="middle" fontSize="36" fontWeight="700" fill={numberColor} fontFamily="Fredoka, ui-rounded, system-ui">
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
        <Shirt color={player.shirt} numberColor={player.numberColor} number={player.number} />
      )}
      <span className="player-name">{player.name}</span>
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
