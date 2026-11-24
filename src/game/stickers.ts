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

export interface PlayerSticker {
  kind: 'player'
  id: string
  name: string
  flag: string
  number: number
  /** Tröjans färg. */
  shirt: string
  /** Nummrets färg. */
  numberColor: string
  /** Valfri egen bild i public/stickers/ som visas istället för tröjan. */
  image?: string
}

export type Sticker = EmojiSticker | PlayerSticker

const SWEDEN = { flag: '🇸🇪', shirt: '#fecc02', numberColor: '#006aa7' }
const SPAIN = { flag: '🇪🇸', shirt: '#c60b1e', numberColor: '#ffc400' }
const BRAZIL = { flag: '🇧🇷', shirt: '#fedf00', numberColor: '#009c3b' }
const ENGLAND = { flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', shirt: '#ffffff', numberColor: '#0b1f4b' }

export const PLAYERS: PlayerSticker[] = (
  [
    { id: 'ronaldo', name: 'Cristiano Ronaldo', number: 7, flag: '🇵🇹', shirt: '#c8102e', numberColor: '#ffd700' },
    { id: 'messi', name: 'Lionel Messi', number: 10, flag: '🇦🇷', shirt: '#75aadb', numberColor: '#0b2a5b' },
    { id: 'mbappe', name: 'Kylian Mbappé', number: 10, flag: '🇫🇷', shirt: '#1b2a5c', numberColor: '#ffffff' },
    { id: 'haaland', name: 'Erling Haaland', number: 9, flag: '🇳🇴', shirt: '#ba0c2f', numberColor: '#ffffff' },
    { id: 'zlatan', name: 'Zlatan Ibrahimović', number: 10, ...SWEDEN },
    { id: 'isak', name: 'Alexander Isak', number: 9, ...SWEDEN },
    { id: 'asllani', name: 'Kosovare Asllani', number: 9, ...SWEDEN },
    { id: 'neymar', name: 'Neymar Jr', number: 10, ...BRAZIL },
    { id: 'vinicius', name: 'Vinícius Júnior', number: 7, ...BRAZIL },
    { id: 'kane', name: 'Harry Kane', number: 9, ...ENGLAND },
    { id: 'bellingham', name: 'Jude Bellingham', number: 10, ...ENGLAND },
    { id: 'yamal', name: 'Lamine Yamal', number: 19, ...SPAIN },
    { id: 'putellas', name: 'Alexia Putellas', number: 11, ...SPAIN },
    { id: 'bonmati', name: 'Aitana Bonmatí', number: 6, ...SPAIN },
    { id: 'salah', name: 'Mohamed Salah', number: 10, flag: '🇪🇬', shirt: '#ce1126', numberColor: '#ffffff' },
    { id: 'modric', name: 'Luka Modrić', number: 10, flag: '🇭🇷', shirt: '#e30a17', numberColor: '#ffffff' },
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
