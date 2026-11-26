import { AVATARS } from './avatars'
import { DEFAULT_ROUND_LENGTH, ROUND_LENGTH_OPTIONS, type Stars } from './constants'

/**
 * Profiler och framsteg som sparas på enheten, i webbläsarens localStorage.
 * Ingenting skickas någonstans och inget synkas mellan enheter.
 *
 * Allt ligger under en enda nyckel som JSON. Ändras formatet: höj `version`
 * och skriv en översättning från den gamla versionen i parseSavedData, så att
 * barnens album inte försvinner.
 */

/** Nyckeln i localStorage. Hela github.io-adressen delar lagring, därav spelets namn. */
export const STORAGE_KEY = 'skolspelet'
/** Sparad data som inte gick att läsa flyttas hit i stället för att skrivas över. */
export const BROKEN_KEY = 'skolspelet-trasig'

export const NAME_MAX_LENGTH = 15
/** Fler profiler än så får inte plats snyggt på "Vem spelar?". */
export const MAX_PROFILES = 8
/** Högst så här många läxglosor, och så här långa (per språk). */
export const MAX_HOMEWORK = 50
export const HOMEWORK_TEXT_MAX = 40

/** En glosa man skrivit in själv. `/` mellan flera rätta svar, t.ex. "you are / you're". */
export interface HomeworkGloss {
  id: string
  en: string
  sv: string
}

export interface Profile {
  id: string
  name: string
  /** En emoji från AVATARS. */
  avatar: string
  /** Klistermärkes-id:n i den ordning de samlats – samma id kan finnas flera gånger. */
  album: string[]
  /** Antal frågor per runda. */
  roundLength: number
  soundOn: boolean
  /** Bästa antal stjärnor per kombination av val. Nyckeln kommer från resultKey(). */
  best: Record<string, Stars>
  /** Veckans läxglosor (Engelska → Mina läxglosor). */
  homework: HomeworkGloss[]
}

export interface SavedData {
  version: 1
  profiles: Profile[]
}

export const EMPTY_DATA: SavedData = { version: 1, profiles: [] }

// ---------- Läsa och skriva ----------

/**
 * Tolkar det som låg sparat. `null` in (inget sparat) ⇒ tom data.
 * Returnerar `null` om datan finns men inte går att läsa alls.
 * Enstaka trasiga fält lagas: en konstig inställning blir standardvärdet
 * i stället för att hela profilen försvinner.
 */
export function parseSavedData(raw: string | null): SavedData | null {
  if (raw === null) return EMPTY_DATA
  let json: unknown
  try {
    json = JSON.parse(raw)
  } catch {
    return null
  }
  if (!isObject(json) || json.version !== 1 || !Array.isArray(json.profiles)) return null

  const profiles: Profile[] = []
  for (const p of json.profiles) {
    const profile = parseProfile(p)
    if (profile && !profiles.some((other) => other.id === profile.id)) profiles.push(profile)
  }
  return { version: 1, profiles }
}

function parseProfile(p: unknown): Profile | null {
  if (!isObject(p) || typeof p.id !== 'string' || p.id === '' || typeof p.name !== 'string') return null
  const name = p.name.trim().slice(0, NAME_MAX_LENGTH)
  if (name === '') return null

  const best: Record<string, Stars> = {}
  if (isObject(p.best)) {
    for (const [key, stars] of Object.entries(p.best)) {
      if (stars === 1 || stars === 2 || stars === 3) best[key] = stars
    }
  }

  return {
    id: p.id,
    name,
    avatar: typeof p.avatar === 'string' && p.avatar !== '' && p.avatar.length <= 16 ? p.avatar : AVATARS[0],
    album: Array.isArray(p.album) ? p.album.filter((s): s is string => typeof s === 'string') : [],
    roundLength:
      typeof p.roundLength === 'number' && ROUND_LENGTH_OPTIONS.includes(p.roundLength) ? p.roundLength : DEFAULT_ROUND_LENGTH,
    soundOn: typeof p.soundOn === 'boolean' ? p.soundOn : true,
    best,
    homework: parseHomework(p.homework),
  }
}

/** Läxglosorna kom till efter version 1 – saknas de blir det en tom lista. */
function parseHomework(list: unknown): HomeworkGloss[] {
  if (!Array.isArray(list)) return []
  const glosses: HomeworkGloss[] = []
  for (const g of list) {
    if (!isObject(g) || typeof g.en !== 'string' || typeof g.sv !== 'string') continue
    const en = g.en.trim().slice(0, HOMEWORK_TEXT_MAX)
    const sv = g.sv.trim().slice(0, HOMEWORK_TEXT_MAX)
    const id = typeof g.id === 'string' && g.id !== '' && !glosses.some((o) => o.id === g.id) ? g.id : makeId()
    if (en && sv && glosses.length < MAX_HOMEWORK) glosses.push({ id, en, sv })
  }
  return glosses
}

const isObject = (x: unknown): x is Record<string, unknown> => typeof x === 'object' && x !== null && !Array.isArray(x)

/** localStorage, eller null om webbläsaren inte tillåter det (t.ex. vissa privata lägen). */
function storage(): Storage | null {
  try {
    return typeof localStorage === 'undefined' ? null : localStorage
  } catch {
    return null
  }
}

/** Läser det sparade. Går det inte blir det tom data – spelet fungerar ändå, men utan sparande. */
export function loadData(): SavedData {
  const s = storage()
  if (!s) return EMPTY_DATA
  try {
    const raw = s.getItem(STORAGE_KEY)
    const data = parseSavedData(raw)
    if (data) return data
    // Gick inte att läsa: spara undan det, så skrivs det inte över av misstag.
    if (raw !== null) s.setItem(BROKEN_KEY, raw)
  } catch {
    // Lagringen är avstängd eller full – spela vidare utan att spara.
  }
  return EMPTY_DATA
}

export function saveData(data: SavedData) {
  try {
    storage()?.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch {
    // Lagringen är avstängd eller full – spela vidare utan att spara.
  }
}

/**
 * Ber webbläsaren att inte rensa bort det sparade när enheten får ont om plats.
 * Webbläsaren bestämmer själv om den går med på det; det kostar inget att fråga.
 */
export function askForPersistentStorage() {
  try {
    void navigator.storage?.persist?.().catch(() => {})
  } catch {
    // Finns inte i den här webbläsaren.
  }
}

// ---------- Profiler ----------

/** Ett id som är unikt nog på en och samma enhet. */
export const makeId = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`

export function newProfile(name: string, avatar: string): Profile {
  return {
    id: makeId(),
    name: name.trim(),
    avatar,
    album: [],
    roundLength: DEFAULT_ROUND_LENGTH,
    soundOn: true,
    best: {},
    homework: [],
  }
}

/** Samma namn oavsett stora/små bokstäver och mellanslag runt omkring. */
export const sameName = (a: string, b: string) => a.trim().toLocaleLowerCase('sv') === b.trim().toLocaleLowerCase('sv')

/** Vad som är fel med namnet, eller null om det går bra. `exceptId` = profilen som byter namn. */
export function nameProblem(name: string, profiles: Profile[], exceptId?: string): string | null {
  if (name.trim() === '') return 'Skriv ditt namn'
  if (name.trim().length > NAME_MAX_LENGTH) return `Högst ${NAME_MAX_LENGTH} bokstäver`
  if (profiles.some((p) => p.id !== exceptId && sameName(p.name, name))) return 'Det namnet finns redan'
  return null
}

/** Första bilden som ingen annan profil har (eller den första om alla är tagna). */
export function freeAvatar(profiles: Profile[]): string {
  return AVATARS.find((a) => !profiles.some((p) => p.avatar === a)) ?? AVATARS[0]
}

// ---------- Resultat ----------

/**
 * Nyckel för "samma sak" när bästa resultat sparas: kategorin och alla val,
 * t.ex. "matte:grade=3,level=medel,op=+". Ordningen på valen spelar ingen roll.
 */
export function resultKey(categoryId: string, settings: object): string {
  const choices = Object.entries(settings)
    .sort(([a], [b]) => (a < b ? -1 : 1))
    .map(([k, v]) => `${k}=${String(v)}`)
  return `${categoryId}:${choices.join(',')}`
}

/**
 * En spelad runda: klistermärket hamnar i albumet och bästa resultat höjs om det blev bättre.
 * `key` null = spara inget bästa resultat (t.ex. läxglosor, där listan byts varje vecka).
 */
export function recordRound(profile: Profile, key: string | null, stars: Stars, stickerId: string): Profile {
  const best = key === null ? undefined : profile.best[key]
  const keep = key === null || (best !== undefined && best >= stars)
  return {
    ...profile,
    album: [...profile.album, stickerId],
    best: keep ? profile.best : { ...profile.best, [key]: stars },
  }
}
