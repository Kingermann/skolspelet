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

let noise: AudioBuffer | null = null

/** En sekund "brus" som varje handklapp klipps ut från. */
function noiseBuffer(a: AudioContext): AudioBuffer {
  if (noise) return noise
  noise = a.createBuffer(1, a.sampleRate, a.sampleRate)
  const data = noise.getChannelData(0)
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1
  return noise
}

/** En handklapp = en kort smäll av filtrerat brus. */
function clap(a: AudioContext, when: number, volume: number) {
  const src = a.createBufferSource()
  src.buffer = noiseBuffer(a)
  const filter = a.createBiquadFilter()
  filter.type = 'bandpass'
  filter.frequency.value = 900 + Math.random() * 1800
  filter.Q.value = 0.8 + Math.random()
  const gain = a.createGain()
  const decay = 0.03 + Math.random() * 0.05
  gain.gain.setValueAtTime(0.0001, when)
  gain.gain.exponentialRampToValueAtTime(volume, when + 0.002)
  gain.gain.exponentialRampToValueAtTime(0.0001, when + decay)
  src.connect(filter).connect(gain).connect(a.destination)
  src.start(when, Math.random() * 0.9, decay + 0.02)
}

/** Applåder: massor av handklappar från en "publik" som tystnar efter en stund. */
function applause(seconds = 1.8, people = 14) {
  const a = audio()
  if (!a) return
  const t0 = a.currentTime + 0.05
  for (let p = 0; p < people; p++) {
    // Varje person klappar i sin egen takt (ca 4–7 klapp per sekund).
    const interval = 0.14 + Math.random() * 0.1
    const stop = seconds * (0.6 + Math.random() * 0.4)
    for (let t = Math.random() * interval; t < stop; t += interval * (0.85 + Math.random() * 0.3)) {
      const fade = 1 - t / seconds
      clap(a, t0 + t, 0.12 * fade * (0.5 + Math.random() * 0.5))
    }
  }
}

export const sounds = {
  tap: () => tone(700, 0, 0.05, 'sine', 0.05),
  /** Rätt svar: "pling" + applåder. `big` = extra lång jubel (flera rätt i rad). */
  correct: (big = false) => {
    tone(1047, 0, 0.12)
    tone(1319, 0.1, 0.22)
    if (big) tone(1568, 0.22, 0.3)
    applause(big ? 2.8 : 1.8, big ? 24 : 14)
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
