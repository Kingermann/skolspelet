/**
 * Alla klistermärken man kan samla. Lägg gärna till era egna favoriter!
 *
 * Fotbollsspelare visas som ett kort med landslagströja, nummer, flagga och namn.
 * Vill ni ha en egen bild (t.ex. en teckning) på en spelare: lägg bilden i
 * mappen public/stickers/ och skriv filnamnet i `image`, t.ex. image: 'ronaldo.png'.
 */

export interface EmojiSticker {
  kind: 'emoji'
  id: string
  emoji: string
}

/** Position på planen – står på kortets baksida. */
export type Position = 'Målvakt' | 'Back' | 'Mittfältare' | 'Anfallare'

/**
 * Fakta på kortets baksida. Allt utom klubb är valfritt – det som saknas visas inte.
 * Siffrorna blir gamla: ändra dem här och ändra `STATS_DATE` när ni uppdaterar.
 */
export interface PlayerFacts {
  position?: Position
  /** Nuvarande klubb – eller sista klubben om spelaren har slutat (se `retired`). */
  club: string
  /** Året spelaren slutade spela. */
  retired?: number
  born?: number
  /** Födelseort, t.ex. "Malmö". */
  birthplace?: string
  /** Matcher och mål i A-landslaget. */
  caps?: number
  goals?: number
  /** En rolig sak, skriven så att ett barn förstår. Högst 120 tecken, annars får den inte plats. */
  funFact?: string
}

/** När statistiken på korten senast kollades – står som en stämpel på baksidan. */
export const STATS_DATE = 'nov 2026'

export interface PlayerSticker {
  kind: 'player'
  id: string
  name: string
  flag: string
  /** Landet på svenska, t.ex. "Sverige". */
  country: string
  /** Texten på tröjans rygg, om det inte ska vara landet (t.ex. klubben för Kareby-spelarna). */
  shirtText?: string
  number: number
  /** Tröjans färg. */
  shirt: string
  /** Nummrets färg. */
  numberColor: string
  /** Valfri egen bild i public/stickers/ som visas istället för tröjan. */
  image?: string
  /** Fakta på baksidan (man vänder kortet genom att trycka på det i albumet). */
  facts?: PlayerFacts
}

/** Det som står på tröjans rygg ovanför numret. */
export const shirtLabel = (p: PlayerSticker) => (p.shirtText ?? p.country).toLocaleUpperCase('sv')

export type Sticker = EmojiSticker | PlayerSticker

const SWEDEN = { flag: '🇸🇪', country: 'Sverige', shirt: '#fecc02', numberColor: '#006aa7' }
const SPAIN = { flag: '🇪🇸', country: 'Spanien', shirt: '#c60b1e', numberColor: '#ffc400' }
const BRAZIL = { flag: '🇧🇷', country: 'Brasilien', shirt: '#fedf00', numberColor: '#009c3b' }
/** Kareby IS (Kungälv): rött, blått och vitt – röd tröja med vitt nummer syns bäst på kortet. */
const KAREBY = { flag: '🇸🇪', country: 'Sverige', shirtText: 'Kareby', shirt: '#d7141a', numberColor: '#ffffff' }
const ENGLAND = { flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', country: 'England', shirt: '#ffffff', numberColor: '#0b1f4b' }

export const PLAYERS: PlayerSticker[] = (
  [
    {
      id: 'ronaldo', name: 'Cristiano Ronaldo', number: 7, flag: '🇵🇹', country: 'Portugal', shirt: '#c8102e', numberColor: '#ffd700',
      facts: {
        position: 'Anfallare', club: 'Al-Nassr', born: 1985, birthplace: 'Funchal', caps: 234, goals: 146,
        funFact: 'Ronaldo har gjort flest landslagsmål av alla herrar i världen: 146 stycken!',
      },
    },
    {
      id: 'messi', name: 'Lionel Messi', number: 10, flag: '🇦🇷', country: 'Argentina', shirt: '#75aadb', numberColor: '#0b2a5b',
      facts: {
        position: 'Anfallare', club: 'Inter Miami', born: 1987, birthplace: 'Rosario', caps: 208, goals: 126,
        funFact: "Messi vann VM 2022 och har utsetts till världens bästa spelare (Ballon d'Or) 8 gånger – rekord!",
      },
    },
    {
      id: 'mbappe', name: 'Kylian Mbappé', number: 10, flag: '🇫🇷', country: 'Frankrike', shirt: '#1b2a5c', numberColor: '#ffffff',
      facts: {
        position: 'Anfallare', club: 'Real Madrid', born: 1998, birthplace: 'Paris', caps: 108, goals: 67,
        funFact: 'Mbappé har gjort flest mål i VM genom tiderna: 22 stycken. Han vann VM redan som 19-åring!',
      },
    },
    {
      id: 'haaland', name: 'Erling Haaland', number: 9, flag: '🇳🇴', country: 'Norge', shirt: '#ba0c2f', numberColor: '#ffffff',
      facts: {
        position: 'Anfallare', club: 'Manchester City', born: 2000, birthplace: 'Leeds, England', caps: 61, goals: 68,
        funFact: 'Haaland föddes i England, där hans pappa spelade fotboll. Han har gjort fler landslagsmål än matcher!',
      },
    },
    {
      id: 'zlatan', name: 'Zlatan Ibrahimović', number: 10, ...SWEDEN,
      facts: {
        position: 'Anfallare', club: 'AC Milan', retired: 2023, born: 1981, birthplace: 'Malmö', caps: 122, goals: 62,
        funFact: 'Zlatans cykelspark från 30 meter mot England 2012 vann priset för årets snyggaste mål i världen!',
      },
    },
    {
      id: 'isak', name: 'Alexander Isak', number: 9, ...SWEDEN,
      facts: {
        position: 'Anfallare', club: 'Liverpool', born: 1999, birthplace: 'Solna', caps: 64, goals: 19,
        funFact: 'Isak var bara 17 år när han gjorde sitt första mål för Sverige – yngst någonsin!',
      },
    },
    {
      id: 'asllani', name: 'Kosovare Asllani', number: 9, ...SWEDEN,
      facts: {
        position: 'Anfallare', club: 'London City Lionesses', born: 1989, birthplace: 'Kristianstad', caps: 209, goals: 50,
        funFact: 'Kosovare har spelat över 200 matcher för Sverige och tagit två OS-silver!',
      },
    },
    {
      id: 'gyokeres', name: 'Viktor Gyökeres', number: 17, ...SWEDEN,
      facts: {
        position: 'Anfallare', club: 'Arsenal', born: 1998, birthplace: 'Stockholm', caps: 43, goals: 27,
        funFact: 'När Gyökeres gör mål håller han händerna som en mask framför ansiktet. Vad den betyder är hemligt!',
      },
    },
    {
      id: 'lindelof', name: 'Victor Nilsson Lindelöf', number: 3, ...SWEDEN,
      facts: {
        position: 'Back', club: 'Aston Villa', born: 1994, birthplace: 'Västerås', caps: 86, goals: 3,
        funFact: 'Lindelöf är Sveriges lagkapten och har fått Guldbollen (bäst i Sverige) två gånger!',
      },
    },
    {
      id: 'elanga', name: 'Anthony Elanga', number: 11, ...SWEDEN,
      facts: {
        position: 'Anfallare', club: 'Newcastle United', born: 2002, birthplace: 'Malmö', caps: 36, goals: 8,
        funFact: 'Elangas mamma och pappa har båda spelat i Kameruns landslag!',
      },
    },
    {
      id: 'carlsbogard', name: 'Mimmi Carlsbogård', number: 1, ...SWEDEN,
      facts: {
        position: 'Målvakt', club: 'IFK Göteborg', born: 2000, birthplace: 'Kungälv',
        funFact: 'Mimmi höll nollan i sista matchen 2026 – och IFK Göteborg gick upp till Damallsvenskan!',
      },
    },
    {
      id: 'neymar', name: 'Neymar Jr', number: 10, ...BRAZIL,
      facts: {
        position: 'Anfallare', club: 'Santos', born: 1992, birthplace: 'Mogi das Cruzes', caps: 130, goals: 80,
        funFact: 'Neymar var lagkapten när Brasilien vann OS-guld i fotboll för första gången, 2016!',
      },
    },
    {
      id: 'vinicius', name: 'Vinícius Júnior', number: 7, ...BRAZIL,
      facts: {
        position: 'Anfallare', club: 'Real Madrid', born: 2000, birthplace: 'São Gonçalo', caps: 59, goals: 19,
        funFact: 'Vinícius gjorde det enda målet när Real Madrid vann Champions League-finalen 2022!',
      },
    },
    {
      id: 'kane', name: 'Harry Kane', number: 9, ...ENGLAND,
      facts: {
        position: 'Anfallare', club: 'Bayern München', born: 1993, birthplace: 'London', caps: 127, goals: 93,
        funFact: 'Kane utsågs till världens bästa spelare 2026 och har gjort flest mål för England genom tiderna!',
      },
    },
    {
      id: 'bellingham', name: 'Jude Bellingham', number: 10, ...ENGLAND,
      facts: {
        position: 'Mittfältare', club: 'Real Madrid', born: 2003, birthplace: 'Stourbridge', caps: 62, goals: 14,
        funFact: 'Bellingham är den yngsta som har spelat 50 landskamper för England – han var bara 22!',
      },
    },
    {
      id: 'yamal', name: 'Lamine Yamal', number: 19, ...SPAIN,
      facts: {
        position: 'Anfallare', club: 'FC Barcelona', born: 2007, birthplace: 'Esplugues', caps: 38, goals: 11,
        funFact: 'Yamal var bara 16 år när han gjorde mål i EM 2024 – yngst någonsin! Han vann VM 2026 med Spanien.',
      },
    },
    {
      id: 'putellas', name: 'Alexia Putellas', number: 11, ...SPAIN,
      facts: {
        position: 'Mittfältare', club: 'London City Lionesses', born: 1994, birthplace: 'Mollet', caps: 150, goals: 43,
        funFact: 'Alexia har utsetts till världens bästa spelare tre gånger och vann VM med Spanien 2023!',
      },
    },
    {
      id: 'salah', name: 'Mohamed Salah', number: 10, flag: '🇪🇬', country: 'Egypten', shirt: '#ce1126', numberColor: '#ffffff',
      facts: {
        position: 'Anfallare', club: 'Trabzonspor', born: 1992, birthplace: 'Nagrig', caps: 123, goals: 70,
        funFact: 'Salah har gjort flest mål för Egypten genom tiderna. Han kallas "Egyptens kung"!',
      },
    },
    {
      id: 'modric', name: 'Luka Modrić', number: 10, flag: '🇭🇷', country: 'Kroatien', shirt: '#e30a17', numberColor: '#ffffff',
      facts: {
        position: 'Mittfältare', club: 'AC Milan', born: 1985, birthplace: 'Zadar', caps: 208,
        funFact: 'Modrić har spelat flest landskamper för Kroatien och utsågs till världens bästa spelare 2018!',
      },
    },
    {
      id: 'dylan', name: 'Dylan B', number: 13, ...KAREBY,
      facts: {
        club: 'Kareby IS', born: 2019,
      },
    },
    {
      id: 'mila', name: 'Mila B', number: 2, ...KAREBY,
      facts: {
        club: 'Kareby IS', born: 2016,
      },
    },
  ] satisfies Omit<PlayerSticker, 'kind'>[]
).map((p) => ({ ...p, kind: 'player' as const }))

const EMOJIS = [
  // Djur
  '🐶', '🐱', '🐰', '🦊', '🐼', '🐨', '🦁', '🐯', '🐸', '🐵', '🦄', '🐙', '🦋', '🐢', '🐬', '🦖',
  // Mat
  '🍕', '🍦', '🍩', '🍓', '🍉', '🧁', '🍪', '🍿',
  // Rymden
  '🚀', '🪐', '⭐', '🌈', '🛸', '👾', '🌙', '☄️',
  // Annat kul
  '⚽', '🎸', '🎨', '🏆', '💎', '🎈', '🧸', '🎁',
]

export const EMOJI_STICKERS: EmojiSticker[] = EMOJIS.map((emoji) => ({ kind: 'emoji', id: emoji, emoji }))

export const ALL_STICKERS: Sticker[] = [...PLAYERS, ...EMOJI_STICKERS]

export function stickerById(id: string): Sticker | undefined {
  return ALL_STICKERS.find((s) => s.id === id)
}

/**
 * Slumpa ett klistermärke – helst ett man inte redan har.
 * Hälften av gångerna blir det en fotbollsspelare (så länge det finns nya kvar).
 */
export function pickSticker(album: string[]): Sticker {
  const missing = (list: Sticker[]) => list.filter((s) => !album.includes(s.id))
  const groups = [missing(PLAYERS), missing(EMOJI_STICKERS)].filter((g) => g.length > 0)
  const pool = groups.length > 0 ? groups[Math.floor(Math.random() * groups.length)] : ALL_STICKERS
  return pool[Math.floor(Math.random() * pool.length)]
}
