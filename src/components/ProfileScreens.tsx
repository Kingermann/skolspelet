import { useState } from 'react'
import { AVATARS } from '../game/avatars'
import { GRADE_COLORS, GRADES } from '../game/grades'
import { freeAvatar, MAX_PROFILES, NAME_MAX_LENGTH, nameProblem, sameName, type Profile } from '../game/profiles'
import { Header } from './Header'
import { tap } from './tap'

/** Profilerna får färger i tur och ordning (samma färger som årskurserna). */
const profileColor = (index: number) => GRADE_COLORS[GRADES[index % GRADES.length]]

// ---------- Vem spelar? ----------

interface WhoProps {
  profiles: Profile[]
  onPick: (id: string) => void
  onEdit: (id: string) => void
  onNew: () => void
  /** Tillbaka till start – bara när någon redan spelar. */
  onBack?: () => void
}

export function WhoIsPlayingScreen({ profiles, onPick, onEdit, onNew, onBack }: WhoProps) {
  return (
    <div className="screen">
      <Header onBack={onBack} />
      <h2 className="question-title">Vem spelar?</h2>
      <div className="grid grid-2">
        {profiles.map((p, i) => (
          <div key={p.id} className="profile-slot">
            <button className="tile profile-tile" style={{ background: profileColor(i) }} onClick={tap(() => onPick(p.id))}>
              <span className="tile-big">{p.avatar}</span>
              <span className="tile-small">{p.name}</span>
            </button>
            <button className="profile-edit-btn" aria-label={`Ändra ${p.name}`} onClick={tap(() => onEdit(p.id))}>
              ✏️
            </button>
          </div>
        ))}
      </div>
      {profiles.length < MAX_PROFILES && (
        <button className="big-btn secondary" onClick={tap(onNew)}>
          ➕ Ny profil
        </button>
      )}
    </div>
  )
}

// ---------- Skapa och ändra profil ----------

interface EditProps {
  /** Profilen som ändras, eller undefined för en ny profil. */
  profile?: Profile
  profiles: Profile[]
  onSave: (name: string, avatar: string) => void
  onDelete?: () => void
  /** Avbryt – saknas första gången, då det inte finns någon profil att gå tillbaka till. */
  onCancel?: () => void
}

export function ProfileEditScreen({ profile, profiles, onSave, onDelete, onCancel }: EditProps) {
  const [name, setName] = useState(profile?.name ?? '')
  const [avatar, setAvatar] = useState(profile?.avatar ?? freeAvatar(profiles))
  const [deleting, setDeleting] = useState(false)
  const problem = nameProblem(name, profiles, profile?.id)

  if (profile && onDelete && deleting) {
    return <DeleteProfile profile={profile} onDelete={onDelete} onCancel={() => setDeleting(false)} />
  }

  return (
    <div className="screen">
      <Header onBack={onCancel} />
      <h2 className="question-title">{profile ? 'Ändra profil' : profiles.length === 0 ? 'Hej! Vem är du?' : 'Ny profil'}</h2>
      <form
        className="profile-form"
        onSubmit={(e) => {
          e.preventDefault()
          if (!problem) onSave(name.trim(), avatar)
        }}
      >
        <div className="profile-preview" aria-hidden>
          {avatar}
        </div>
        <label className="field-label" htmlFor="profile-name">
          Vad heter du?
        </label>
        <input
          id="profile-name"
          className="text-input"
          value={name}
          maxLength={NAME_MAX_LENGTH}
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          enterKeyHint="done"
          onChange={(e) => setName(e.target.value)}
        />
        {/* "Skriv ditt namn" behövs inte – knappen är grå tills det finns ett namn. */}
        {problem && name.trim() !== '' && <p className="form-problem">{problem}</p>}

        <p className="field-label">Välj en bild</p>
        <div className="avatar-grid">
          {AVATARS.map((a) => (
            <button
              key={a}
              type="button"
              className={`avatar-option ${a === avatar ? 'selected' : ''}`}
              aria-pressed={a === avatar}
              onClick={tap(() => setAvatar(a))}
            >
              {a}
            </button>
          ))}
        </div>

        <button type="submit" className="big-btn primary" disabled={problem !== null}>
          {profile ? 'Spara ✓' : 'Klar ✓'}
        </button>
      </form>
      {profile && onDelete && (
        <button className="text-btn danger" onClick={tap(() => setDeleting(true))}>
          🗑️ Ta bort profil
        </button>
      )}
    </div>
  )
}

/** Ta bort en profil: man måste skriva namnet, så att det inte händer av misstag. */
function DeleteProfile({ profile, onDelete, onCancel }: { profile: Profile; onDelete: () => void; onCancel: () => void }) {
  const [typed, setTyped] = useState('')
  const ok = sameName(typed, profile.name)
  return (
    <div className="screen">
      <Header onBack={onCancel} />
      <h2 className="question-title">
        Ta bort {profile.avatar} {profile.name}?
      </h2>
      <p className="hint-text">Albumet och alla stjärnor försvinner för alltid. Det går inte att ångra.</p>
      <form
        className="profile-form"
        onSubmit={(e) => {
          e.preventDefault()
          if (ok) onDelete()
        }}
      >
        <label className="field-label" htmlFor="confirm-name">
          Skriv <strong>{profile.name}</strong> för att ta bort
        </label>
        <input
          id="confirm-name"
          className="text-input"
          value={typed}
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          onChange={(e) => setTyped(e.target.value)}
        />
        <button type="submit" className="big-btn danger" disabled={!ok}>
          Ta bort för alltid
        </button>
      </form>
      <button className="big-btn secondary" onClick={tap(onCancel)}>
        Nej, behåll
      </button>
    </div>
  )
}
