import { afterEach, describe, expect, it, vi } from 'vitest'
import { AVATARS } from './avatars'
import { DEFAULT_ROUND_LENGTH } from './constants'
import {
  BROKEN_KEY,
  EMPTY_DATA,
  freeAvatar,
  loadData,
  MAX_PROFILES,
  NAME_MAX_LENGTH,
  nameProblem,
  newProfile,
  parseSavedData,
  recordRound,
  resultKey,
  saveData,
  STORAGE_KEY,
  type SavedData,
} from './profiles'

/** En localStorage i minnet, som i webbläsaren. */
function fakeStorage(initial: Record<string, string> = {}) {
  const items = new Map(Object.entries(initial))
  const storage = {
    getItem: (k: string) => items.get(k) ?? null,
    setItem: (k: string, v: string) => void items.set(k, v),
    removeItem: (k: string) => void items.delete(k),
  }
  vi.stubGlobal('localStorage', storage)
  return items
}

afterEach(() => vi.unstubAllGlobals())

const ella = { ...newProfile('Ella', '🦊'), id: 'ella' }

describe('sparad data', () => {
  it('sparas och läses tillbaka likadant', () => {
    fakeStorage()
    const data: SavedData = { version: 1, profiles: [recordRound(ella, 'matte:grade=3,level=medel,op=+', 2, 'messi')] }
    saveData(data)
    expect(loadData()).toEqual(data)
  })

  it('inget sparat ⇒ inga profiler', () => {
    fakeStorage()
    expect(loadData()).toEqual(EMPTY_DATA)
  })

  it('trasig data kraschar inte och sparas undan i stället för att skrivas över', () => {
    const items = fakeStorage({ [STORAGE_KEY]: '{inte json' })
    expect(loadData()).toEqual(EMPTY_DATA)
    expect(items.get(BROKEN_KEY)).toBe('{inte json')
  })

  it('okänd version eller fel form går inte att läsa', () => {
    for (const raw of ['null', '[]', '42', '{"version":2,"profiles":[]}', '{"version":1}', '{"version":1,"profiles":{}}']) {
      expect(parseSavedData(raw), raw).toBeNull()
    }
  })

  it('fungerar utan localStorage (spelet går att spela, inget sparas)', () => {
    vi.stubGlobal('localStorage', undefined)
    expect(loadData()).toEqual(EMPTY_DATA)
    expect(() => saveData({ version: 1, profiles: [ella] })).not.toThrow()
  })

  it('fungerar när lagringen kastar fel (avstängd eller full)', () => {
    const fail = () => {
      throw new Error('QuotaExceededError')
    }
    vi.stubGlobal('localStorage', { getItem: fail, setItem: fail })
    expect(loadData()).toEqual(EMPTY_DATA)
    expect(() => saveData({ version: 1, profiles: [ella] })).not.toThrow()
  })

  it('lagar trasiga fält i en profil i stället för att slänga den', () => {
    const raw = JSON.stringify({
      version: 1,
      profiles: [
        {
          id: 'ella',
          name: '  Ella med ett alldeles för långt namn  ',
          avatar: 42,
          album: ['messi', 7, null, '🐶'],
          roundLength: 7,
          soundOn: 'ja',
          best: { a: 3, b: 4, c: '2', d: 0 },
        },
      ],
    })
    const [p] = parseSavedData(raw)!.profiles
    expect(p.name).toBe('Ella med ett al')
    expect(p.name.length).toBe(NAME_MAX_LENGTH)
    expect(p.avatar).toBe(AVATARS[0])
    expect(p.album).toEqual(['messi', '🐶'])
    expect(p.roundLength).toBe(DEFAULT_ROUND_LENGTH)
    expect(p.soundOn).toBe(true)
    expect(p.best).toEqual({ a: 3 })
  })

  it('slänger profiler utan id eller namn, och dubbletter av samma id', () => {
    const raw = JSON.stringify({
      version: 1,
      profiles: [{ name: 'Utan id' }, { id: 'x', name: '   ' }, 'skräp', { id: 'ella', name: 'Ella' }, { id: 'ella', name: 'Kopia' }],
    })
    expect(parseSavedData(raw)!.profiles.map((p) => p.name)).toEqual(['Ella'])
  })
})

describe('profiler', () => {
  it('namnet måste finnas, vara kort nog och inte redan användas', () => {
    expect(nameProblem('', [])).not.toBeNull()
    expect(nameProblem('   ', [])).not.toBeNull()
    expect(nameProblem('x'.repeat(NAME_MAX_LENGTH + 1), [])).not.toBeNull()
    expect(nameProblem('x'.repeat(NAME_MAX_LENGTH), [])).toBeNull()
    expect(nameProblem(' ELLA ', [ella])).not.toBeNull()
    expect(nameProblem('Åsa', [ella])).toBeNull()
  })

  it('man får behålla sitt eget namn när man ändrar profilen', () => {
    expect(nameProblem('Ella', [ella], ella.id)).toBeNull()
  })

  it('nya profiler får en bild som ingen annan har', () => {
    expect(freeAvatar([])).toBe(AVATARS[0])
    expect(freeAvatar([{ ...ella, avatar: AVATARS[0] }])).toBe(AVATARS[1])
  })

  it('det finns bilder så att alla profiler kan få en egen, och inga dubbletter', () => {
    expect(AVATARS.length).toBeGreaterThanOrEqual(MAX_PROFILES)
    expect(new Set(AVATARS).size).toBe(AVATARS.length)
  })

  it('nya profiler får olika id', () => {
    const ids = new Set(Array.from({ length: 50 }, () => newProfile('A', '🦊').id))
    expect(ids.size).toBe(50)
  })
})

describe('resultat', () => {
  it('samma val ger samma nyckel oavsett ordning', () => {
    expect(resultKey('matte', { grade: 3, op: '+', level: 'medel' })).toBe(resultKey('matte', { level: 'medel', grade: 3, op: '+' }))
    expect(resultKey('matte', { grade: 3, op: '+', level: 'medel' })).not.toBe(resultKey('matte', { grade: 3, op: '+', level: 'svar' }))
    expect(resultKey('svenska', { grade: 3, level: 'medel' })).not.toBe(resultKey('engelska', { grade: 3, level: 'medel' }))
  })

  it('klistermärket hamnar i albumet och bästa resultat höjs bara om det blev bättre', () => {
    let p = recordRound(ella, 'k', 2, 'messi')
    expect(p.best.k).toBe(2)
    p = recordRound(p, 'k', 1, 'messi')
    expect(p.best.k).toBe(2)
    p = recordRound(p, 'k', 3, '🐶')
    expect(p.best.k).toBe(3)
    expect(p.album).toEqual(['messi', 'messi', '🐶'])
    expect(ella.album).toEqual([])
  })
})
