/** Alla klistermärken man kan samla. Byt gärna ut mot era egna favoriter! */
export const STICKERS = [
  // Djur
  '🐶', '🐱', '🐰', '🦊', '🐼', '🐨', '🦁', '🐯', '🐸', '🐵', '🦄', '🐙', '🦋', '🐢', '🐬', '🦖',
  // Mat
  '🍕', '🍦', '🍩', '🍓', '🍉', '🧁', '🍪', '🍿',
  // Rymden
  '🚀', '🪐', '⭐', '🌈', '🛸', '👾', '🌙', '☄️',
  // Annat kul
  '⚽', '🎸', '🎨', '🏆', '💎', '🎈', '🧸', '🎁',
]

/** Slumpa ett klistermärke – helst ett man inte redan har. */
export function pickSticker(album: string[]): string {
  const missing = STICKERS.filter((s) => !album.includes(s))
  const pool = missing.length > 0 ? missing : STICKERS
  return pool[Math.floor(Math.random() * pool.length)]
}
