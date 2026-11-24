/**
 * Ljudeffekter skapade direkt i koden (Web Audio API) – inga ljudfiler behövs.
 * OBS iPhone: om telefonen står på ljudlöst (knappen på sidan) hörs inget.
 */

let ctx: AudioContext | null = null
let enabled = true

export function setSoundEnabled(on: boolean) {
  enabled = on
}

function audio(): AudioContext | null {
  if (!enabled) return null
  try {
    ctx ??= new AudioContext()
    if (ctx.state === 'suspended') void ctx.resume()
    return ctx
  } catch {
    return null
  }
}

function tone(freq: number, start: number, dur: number, type: OscillatorType = 'sine', volume = 0.15, slideTo?: number) {
  const a = audio()
  if (!a) return
  const t0 = a.currentTime + start
  const osc = a.createOscillator()
  const gain = a.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(freq, t0)
  if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, t0 + dur)
  gain.gain.setValueAtTime(0.0001, t0)
  gain.gain.exponentialRampToValueAtTime(volume, t0 + 0.01)
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur)
  osc.connect(gain).connect(a.destination)
  osc.start(t0)
  osc.stop(t0 + dur + 0.05)
}

export const sounds = {
  tap: () => tone(700, 0, 0.05, 'sine', 0.05),
  correct: () => {
    tone(1047, 0, 0.12)
    tone(1319, 0.1, 0.22)
  },
  wrong: () => tone(260, 0, 0.3, 'triangle', 0.2, 160),
  fanfare: () => {
    ;[523, 659, 784].forEach((f, i) => tone(f, i * 0.12, 0.15, 'triangle', 0.18))
    ;[523, 659, 784, 1047].forEach((f) => tone(f, 0.4, 0.7, 'triangle', 0.08))
  },
  sticker: () => {
    tone(1568, 0, 0.08)
    tone(2093, 0.08, 0.18)
  },
}
