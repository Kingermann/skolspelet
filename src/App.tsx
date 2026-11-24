import { useMemo, useState } from 'react'
import { AlbumScreen, GradeScreen, LevelScreen, OpScreen, StartScreen } from './components/Menus'
import { Result } from './components/Result'
import { Round } from './components/Round'
import { SoundContext } from './components/SoundContext'
import { setSoundEnabled, sounds } from './game/sound'
import { pickSticker, type Sticker } from './game/stickers'
import type { Grade, Level, OpChoice } from './game/types'

type Screen = 'start' | 'grade' | 'op' | 'level' | 'round' | 'result' | 'album'

/**
 * Hela spelets tillstånd ligger här, i minnet.
 * Inget sparas: laddar man om sidan börjar allt om från början.
 */
export default function App() {
  const [screen, setScreen] = useState<Screen>('start')
  const [grade, setGrade] = useState<Grade>(1)
  const [op, setOp] = useState<OpChoice>('+')
  const [level, setLevel] = useState<Level>('latt')
  const [album, setAlbum] = useState<string[]>([])
  const [result, setResult] = useState<{ firstTryCorrect: number; sticker: Sticker } | null>(null)
  const [roundId, setRoundId] = useState(0)
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

  function startRound() {
    setRoundId((id) => id + 1)
    setScreen('round')
  }

  function finishRound(firstTryCorrect: number) {
    const sticker = pickSticker(album)
    setAlbum((a) => [...a, sticker.id])
    setResult({ firstTryCorrect, sticker })
    setScreen('result')
  }

  function openAlbum(from: Screen) {
    setAlbumBack(from)
    setScreen('album')
  }

  return (
    <SoundContext.Provider value={sound}>
      <main className="app">
        {screen === 'start' && (
          <StartScreen albumCount={new Set(album).size} onPlay={() => setScreen('grade')} onAlbum={() => openAlbum('start')} />
        )}
        {screen === 'grade' && (
          <GradeScreen
            onBack={() => setScreen('start')}
            onPick={(g) => {
              setGrade(g)
              setScreen('op')
            }}
          />
        )}
        {screen === 'op' && (
          <OpScreen
            grade={grade}
            onBack={() => setScreen('grade')}
            onPick={(o) => {
              setOp(o)
              setScreen('level')
            }}
          />
        )}
        {screen === 'level' && (
          <LevelScreen
            grade={grade}
            op={op}
            onBack={() => setScreen('op')}
            onPick={(l) => {
              setLevel(l)
              startRound()
            }}
          />
        )}
        {screen === 'round' && (
          <Round key={roundId} grade={grade} level={level} op={op} onFinish={finishRound} onQuit={() => setScreen('start')} />
        )}
        {screen === 'result' && result && (
          <Result
            {...result}
            onAgain={startRound}
            onHome={() => setScreen('start')}
            onAlbum={() => openAlbum('result')}
          />
        )}
        {screen === 'album' && <AlbumScreen album={album} onBack={() => setScreen(albumBack)} />}
      </main>
    </SoundContext.Provider>
  )
}
