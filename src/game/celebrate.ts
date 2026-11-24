import confetti from 'canvas-confetti'

/**
 * Konfetti över hela skärmen (med biblioteket canvas-confetti).
 * Testa att ändra antal (particleCount), spridning (spread) och fart (startVelocity)!
 */

const COLORS = ['#ff5c8a', '#ffd23f', '#3da5ff', '#2ec27e', '#9b5cff', '#ff9f1c', '#ffffff']
const base = { colors: COLORS, disableForReducedMotion: true, zIndex: 50 }

/** Rätt svar: två konfettikanoner från nederkanten + en smäll i mitten. */
export function celebrateCorrect(big = false) {
  const amount = big ? 1.6 : 1
  confetti({ ...base, particleCount: 90 * amount, angle: 60, spread: 70, startVelocity: 75, origin: { x: 0, y: 1 } })
  confetti({ ...base, particleCount: 90 * amount, angle: 120, spread: 70, startVelocity: 75, origin: { x: 1, y: 1 } })
  confetti({ ...base, particleCount: 70 * amount, spread: 360, startVelocity: 35, scalar: 1.2, origin: { x: 0.5, y: 0.35 } })
}

/**
 * Slut på rundan: fyrverkeri i några sekunder (längre ju fler stjärnor).
 * Returnerar en funktion som stoppar fyrverkeriet direkt.
 */
export function celebrateRound(stars: number): () => void {
  const end = Date.now() + 1200 * stars + 800
  let frame = 0
  const tick = () => {
    confetti({ ...base, particleCount: 6, angle: 60, spread: 60, startVelocity: 70, origin: { x: 0, y: 0.9 } })
    confetti({ ...base, particleCount: 6, angle: 120, spread: 60, startVelocity: 70, origin: { x: 1, y: 0.9 } })
    if (Date.now() < end) frame = requestAnimationFrame(tick)
  }
  tick()
  confetti({ ...base, particleCount: 150, spread: 360, startVelocity: 45, scalar: 1.3, origin: { x: 0.5, y: 0.3 } })
  return () => {
    cancelAnimationFrame(frame)
    confetti.reset()
  }
}
