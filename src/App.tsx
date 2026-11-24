import { useMemo, useState } from 'react'
import { CATEGORIES } from './categories'
import type { Category } from './categories/types'
import { AlbumScreen, StartScreen } from './components/Menus'
import { Result } from './components/Result'
import { SettingsScreen } from './components/SettingsScreen'
import { SoundContext } from './components/SoundContext'
import { DEFAULT_ROUND_LENGTH } from './game/constants'
import { GameSettingsContext } from './game/gameSettings'
import { setSoundEnabled, sounds } from './game/sound'
import { pickSticker, type Sticker } from './game/stickers'

type Screen = 'start' | 'setup' | 'play' | 'result' | 'album' | 'settings'

/**
 * Skolspelet: startskärm → kategori (egna val) → runda → resultat.
 * Allt ligger i minnet – laddar man om sidan börjar allt om från början.
 */
export default function App() {
  const [screen, setScreen] = useState<Screen>('start')
  const [category, setCategory] = useState<Category<unknown>>(CATEGORIES[0])
  const [settings, setSettings] = useState<unknown>(null)
  const [playId, setPlayId] = useState(0)
  const [album, setAlbum] = useState<string[]>([])
  const [result, setResult] = useState<{ firstTryCorrect: number; total: number; sticker: Sticker } | null>(null)
  const [roundLength, setRoundLength] = useState(DEFAULT_ROUND_LENGTH)
  const gameSettings = useMemo(() => ({ roundLength, setRoundLength }), [roundLength])
  const [albumBack, setAlbumBack] = useState<Screen>('start')
  const [soundOn, setSoundOn] = useState(true)

  const sound = useMemo(
    () => ({
      on: soundOn,
      toggle: () => {
        setSoundEnabled(!soundOn)
        setSoundOn(!soundOn)
        if (!soundOn) sounds.tap()
      },
    }),
    [soundOn],
  )

  function play(newSettings: unknown) {
    setSettings(newSettings)
    setPlayId((id) => id + 1)
    setScreen('play')
  }

  function finish(firstTryCorrect: number, total: number) {
    const sticker = pickSticker(album)
    setAlbum((a) => [...a, sticker.id])
    setResult({ firstTryCorrect, total, sticker })
    setScreen('result')
  }

  function openAlbum(from: Screen) {
    setAlbumBack(from)
    setScreen('album')
  }

  const { Setup, Play } = category

  return (
    <SoundContext.Provider value={sound}>
      <GameSettingsContext.Provider value={gameSettings}>
        <main className="app">
          {screen === 'start' && (
            <StartScreen
              categories={CATEGORIES}
              albumCount={new Set(album).size}
              onPick={(c) => {
                setCategory(c)
                setScreen('setup')
              }}
              onAlbum={() => openAlbum('start')}
              onSettings={() => setScreen('settings')}
            />
          )}
          {screen === 'settings' && <SettingsScreen onBack={() => setScreen('start')} />}
          {screen === 'setup' && <Setup key={category.id} onStart={play} onBack={() => setScreen('start')} />}
          {screen === 'play' && <Play key={playId} settings={settings} onFinish={finish} onQuit={() => setScreen('start')} />}
          {screen === 'result' && result && (
            <Result
              {...result}
              onAgain={() => play(settings)}
              onHome={() => setScreen('start')}
              onAlbum={() => openAlbum('result')}
            />
          )}
          {screen === 'album' && <AlbumScreen album={album} onBack={() => setScreen(albumBack)} />}
        </main>
      </GameSettingsContext.Provider>
    </SoundContext.Provider>
  )
}
