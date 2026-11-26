import type { Category } from '../categories/types'
import type { Profile } from '../game/profiles'
import { ALL_STICKERS, EMOJI_STICKERS, PLAYERS, stickerById } from '../game/stickers'
import { Header } from './Header'
import { MissingPlayerCard, StickerView } from './StickerView'
import { tap } from './tap'

// ---------- Start ----------

interface StartProps {
  categories: Category<unknown>[]
  profile: Profile
  onPick: (category: Category<unknown>) => void
  onAlbum: () => void
  onSettings: () => void
  /** Byt profil ("Vem spelar?"). */
  onProfiles: () => void
}

export function StartScreen({ categories, profile, onPick, onAlbum, onSettings, onProfiles }: StartProps) {
  return (
    <div className="screen">
      <Header onBack={onSettings} backIcon="⚙️" backLabel="Inställningar">
        <button className="chip profile-chip" aria-label={`${profile.name} spelar. Byt profil`} onClick={tap(onProfiles)}>
          {profile.avatar} {profile.name}
        </button>
      </Header>
      <div className="start">
        <div className="logo" aria-hidden>
          <span>🎒</span>
        </div>
        <h1 className="title">Skolspelet</h1>
        <p className="subtitle">Hej {profile.name}! Vad vill du öva på idag?</p>
        <div className="grid grid-2 categories">
          {categories.map((c) => (
            <button key={c.id} className="tile category-tile" style={{ background: c.color }} onClick={tap(() => onPick(c))}>
              <span className="tile-big">{c.icon}</span>
              <span className="tile-small">{c.name}</span>
            </button>
          ))}
        </div>
        <button className="big-btn secondary" onClick={tap(onAlbum)}>
          📒 Mitt album <span className="badge">{new Set(profile.album.filter((id) => stickerById(id))).size}</span>
        </button>
      </div>
    </div>
  )
}

// ---------- Album ----------

export function AlbumScreen({ album, onBack }: { album: string[]; onBack: () => void }) {
  // Bara klistermärken som finns kvar i spelet räknas – en borttagen spelare ska inte ge 57 / 56.
  const owned = new Set(album.filter((id) => stickerById(id)))
  const count = (id: string) => album.filter((a) => a === id).length
  const badge = (id: string) => count(id) > 1 && <span className="sticker-count">×{count(id)}</span>
  return (
    <div className="screen">
      <Header onBack={onBack}>
        <span className="chip">
          {owned.size} / {ALL_STICKERS.length}
        </span>
      </Header>
      <h2 className="question-title">📒 Mitt album</h2>
      {album.length === 0 && <p className="hint-text">Spela en runda för att få ditt första klistermärke!</p>}

      <h3 className="album-section">⚽ Fotbollsstjärnor</h3>
      <div className="album album-players">
        {PLAYERS.map((p) => (
          <div key={p.id} className="album-slot">
            {owned.has(p.id) ? <StickerView sticker={p} /> : <MissingPlayerCard />}
            {badge(p.id)}
          </div>
        ))}
      </div>

      <h3 className="album-section">🐶 Djur, mat och rymden</h3>
      <div className="album">
        {EMOJI_STICKERS.map((s) => (
          <div key={s.id} className={`sticker ${owned.has(s.id) ? 'owned' : 'missing'}`}>
            {owned.has(s.id) ? s.emoji : '?'}
            {badge(s.id)}
          </div>
        ))}
      </div>
    </div>
  )
}
