import { useEffect, useMemo, useState } from 'react'
import { CATEGORIES } from './categories'
import type { Category, RoundSummary } from './categories/types'
import { AlbumScreen, StartScreen } from './components/Menus'
import { ProfileEditScreen, WhoIsPlayingScreen } from './components/ProfileScreens'
import { Result } from './components/Result'
import { SettingsScreen } from './components/SettingsScreen'
import { SoundContext } from './components/SoundContext'
import { DEFAULT_ROUND_LENGTH, starsFor } from './game/constants'
import { GameSettingsContext } from './game/gameSettings'
import {
  askForPersistentStorage,
  loadData,
  newProfile,
  recordRound,
  resultKey,
  saveData,
  type Profile,
  type SavedData,
} from './game/profiles'
import { setSoundEnabled, sounds } from './game/sound'
import { pickSticker, type Sticker } from './game/stickers'

type Screen =
  | 'start'
  | 'setup'
  | 'play'
  | 'result'
  | 'album'
  | 'settings'
  /** "Vem spelar?" */
  | 'profiles'
  | 'profile-new'
  | 'profile-edit'

/** Var spelet börjar: skapa första profilen, gå direkt till start, eller fråga vem som spelar. */
function firstScreen(data: SavedData): Screen {
  if (data.profiles.length === 0) return 'profile-new'
  return data.profiles.length === 1 ? 'start' : 'profiles'
}

/**
 * Skolspelet: (vem spelar?) → startskärm → kategori (egna val) → runda → resultat.
 * Profiler, album, inställningar och bästa resultat sparas på enheten (se game/profiles.ts).
 */
export default function App() {
  const [data, setData] = useState(loadData)
  const [activeId, setActiveId] = useState(() => (data.profiles.length === 1 ? data.profiles[0].id : null))
  const [screen, setScreen] = useState<Screen>(() => firstScreen(data))
  const [editId, setEditId] = useState<string | null>(null)
  const [category, setCategory] = useState<Category<unknown>>(CATEGORIES[0])
  const [settings, setSettings] = useState<unknown>(null)
  const [playId, setPlayId] = useState(0)
  const [result, setResult] = useState<{ firstTryCorrect: number; total: number; sticker: Sticker; practiceMore?: string[] } | null>(
    null,
  )
  const [albumBack, setAlbumBack] = useState<Screen>('start')
  // Ljudet innan någon profil är vald (t.ex. på "Vem spelar?").
  const [soundWithoutProfile, setSoundWithoutProfile] = useState(true)

  const profile = data.profiles.find((p) => p.id === activeId) ?? null

  // Allt som ändras sparas direkt.
  useEffect(() => saveData(data), [data])

  const updateProfile = (id: string, change: (p: Profile) => Profile) =>
    setData((d) => ({ ...d, profiles: d.profiles.map((p) => (p.id === id ? change(p) : p)) }))

  const soundOn = profile?.soundOn ?? soundWithoutProfile
  useEffect(() => setSoundEnabled(soundOn), [soundOn])

  const sound = useMemo(
    () => ({
      on: soundOn,
      toggle: () => {
        const on = !soundOn
        setSoundEnabled(on)
        if (profile) updateProfile(profile.id, (p) => ({ ...p, soundOn: on }))
        else setSoundWithoutProfile(on)
        if (on) sounds.tap()
      },
    }),
    [soundOn, profile],
  )

  const gameSettings = useMemo(
    () => ({
      roundLength: profile?.roundLength ?? DEFAULT_ROUND_LENGTH,
      setRoundLength: (n: number) => {
        if (profile) updateProfile(profile.id, (p) => ({ ...p, roundLength: n }))
      },
      bestStars: (choices: object) => profile?.best[resultKey(category.id, choices)],
      homework: profile?.homework ?? [],
      setHomework: (list: Profile['homework']) => {
        if (profile) updateProfile(profile.id, (p) => ({ ...p, homework: list }))
      },
    }),
    [profile, category],
  )

  function play(newSettings: unknown) {
    setSettings(newSettings)
    setPlayId((id) => id + 1)
    setScreen('play')
  }

  function finish(firstTryCorrect: number, total: number, summary?: RoundSummary) {
    const sticker = pickSticker(profile?.album ?? [])
    if (profile) {
      const key = summary?.saveBest === false ? null : resultKey(category.id, settings as object)
      updateProfile(profile.id, (p) => recordRound(p, key, starsFor(firstTryCorrect, total), sticker.id))
    }
    setResult({ firstTryCorrect, total, sticker, practiceMore: summary?.practiceMore })
    setScreen('result')
  }

  function openAlbum(from: Screen) {
    setAlbumBack(from)
    setScreen('album')
  }

  function pickProfile(id: string) {
    setActiveId(id)
    setScreen('start')
  }

  function createProfile(name: string, avatar: string) {
    const created = newProfile(name, avatar)
    setData((d) => ({ ...d, profiles: [...d.profiles, created] }))
    askForPersistentStorage()
    pickProfile(created.id)
  }

  function deleteProfile(id: string) {
    const remaining = data.profiles.filter((p) => p.id !== id)
    setData((d) => ({ ...d, profiles: d.profiles.filter((p) => p.id !== id) }))
    if (activeId === id) setActiveId(null)
    setScreen(remaining.length === 0 ? 'profile-new' : 'profiles')
  }

  const { Setup, Play } = category
  const editing = data.profiles.find((p) => p.id === editId)
  // Utan vald profil finns bara profilskärmarna.
  const shown: Screen = profile || screen.startsWith('profile') ? screen : 'profiles'

  return (
    <SoundContext.Provider value={sound}>
      <GameSettingsContext.Provider value={gameSettings}>
        <main className="app">
          {shown === 'profiles' && (
            <WhoIsPlayingScreen
              profiles={data.profiles}
              onPick={pickProfile}
              onEdit={(id) => {
                setEditId(id)
                setScreen('profile-edit')
              }}
              onNew={() => setScreen('profile-new')}
              onBack={profile ? () => setScreen('start') : undefined}
            />
          )}
          {shown === 'profile-new' && (
            <ProfileEditScreen
              key="new"
              profiles={data.profiles}
              onSave={createProfile}
              onCancel={data.profiles.length > 0 ? () => setScreen('profiles') : undefined}
            />
          )}
          {shown === 'profile-edit' && editing && (
            <ProfileEditScreen
              key={editing.id}
              profile={editing}
              profiles={data.profiles}
              onSave={(name, avatar) => {
                updateProfile(editing.id, (p) => ({ ...p, name, avatar }))
                setScreen('profiles')
              }}
              onDelete={() => deleteProfile(editing.id)}
              onCancel={() => setScreen('profiles')}
            />
          )}
          {shown === 'start' && profile && (
            <StartScreen
              categories={CATEGORIES}
              profile={profile}
              onPick={(c) => {
                setCategory(c)
                setScreen('setup')
              }}
              onAlbum={() => openAlbum('start')}
              onSettings={() => setScreen('settings')}
              onProfiles={() => setScreen('profiles')}
            />
          )}
          {shown === 'settings' && <SettingsScreen onBack={() => setScreen('start')} />}
          {shown === 'setup' && <Setup key={category.id} onStart={play} onBack={() => setScreen('start')} />}
          {shown === 'play' && <Play key={playId} settings={settings} onFinish={finish} onQuit={() => setScreen('start')} />}
          {shown === 'result' && result && (
            <Result
              {...result}
              onAgain={() => play(settings)}
              onHome={() => setScreen('start')}
              onAlbum={() => openAlbum('result')}
            />
          )}
          {shown === 'album' && profile && <AlbumScreen album={profile.album} onBack={() => setScreen(albumBack)} />}
        </main>
      </GameSettingsContext.Provider>
    </SoundContext.Provider>
  )
}
