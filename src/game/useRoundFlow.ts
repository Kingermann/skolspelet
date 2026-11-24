import { useEffect, useState } from 'react'
import { celebrateCorrect } from './celebrate'
import { randomOf } from './random'
import { sounds } from './sound'

/**
 * Gemensam logik för en spelrunda, oavsett kategori:
 * två försök per fråga, visa svaret efter två fel, omtag av missade frågor,
 * stjärnor på första försöket, "rätt i rad" och firande med konfetti + applåder.
 */

export type Phase = 'answering' | 'retry' | 'correct' | 'reveal'
export type Mark = 'pending' | 'first' | 'later' | 'missed'

const PRAISE = ['Rätt! 🎉', 'Snyggt! ⭐', 'Grymt! 🚀', 'Wow! 🌟', 'Perfekt! ✨', 'Klockrent! 💯', 'Superbra! 🙌']

/** Hur länge man får njuta av firandet innan nästa fråga kommer (millisekunder). */
const CELEBRATION_MS = 1600

interface QueueItem<T> {
  value: T
  /** Ett "omtag" av en fråga man missat – ger ingen stjärna. */
  retake: boolean
}

interface Options<T> {
  /** Skapar rundans frågor (anropas en gång). */
  makeItems: () => T[]
  onFinish: (firstTryCorrect: number) => void
  /** Gör om en fråga inför omtaget (t.ex. blanda svarsalternativen på nytt). */
  remake?: (item: T) => T
}

export function useRoundFlow<T>({ makeItems, onFinish, remake = (v) => v }: Options<T>) {
  const [queue, setQueue] = useState<QueueItem<T>[]>(() => makeItems().map((value) => ({ value, retake: false })))
  const [index, setIndex] = useState(0)
  const [attempts, setAttempts] = useState(0)
  const [phase, setPhase] = useState<Phase>('answering')
  const [marks, setMarks] = useState<Mark[]>(() => queue.map(() => 'pending'))
  const [message, setMessage] = useState('')
  const [streak, setStreak] = useState(0)

  const current = queue[index]
  const done = phase === 'correct' || phase === 'reveal'

  const mark = (m: Mark) => {
    if (current.retake) return
    setMarks((prev) => prev.map((old, i) => (i === index ? m : old)))
  }

  /** Rätt svar: firande, stjärnmarkering och automatiskt vidare. */
  function correct() {
    if (done) return
    const newStreak = attempts === 0 ? streak + 1 : 0
    // Var tredje rätt i rad blir det extra stort firande!
    const big = newStreak >= 3 && newStreak % 3 === 0
    sounds.correct(big)
    celebrateCorrect(big)
    setStreak(newStreak)
    setPhase('correct')
    setMessage(randomOf(PRAISE))
    mark(attempts === 0 ? 'first' : 'later')
  }

  /**
   * Fel svar. Första gången: försök igen. Andra gången: visa svaret,
   * och frågan kommer tillbaka som omtag i slutet av rundan.
   */
  function wrong(retryMessage: string, revealMessage: string) {
    if (done) return
    sounds.wrong()
    setStreak(0)
    if (attempts === 0) {
      setAttempts(1)
      setPhase('retry')
      setMessage(retryMessage)
    } else {
      setPhase('reveal')
      setMessage(revealMessage)
      mark('missed')
      if (!current.retake) setQueue((prev) => [...prev, { value: remake(current.value), retake: true }])
    }
  }

  function advance() {
    if (index + 1 < queue.length) {
      setIndex(index + 1)
      setAttempts(0)
      setPhase('answering')
      setMessage('')
    } else {
      onFinish(marks.filter((m) => m === 'first').length)
    }
  }

  // Rätt svar ⇒ gå vidare automatiskt efter en liten stund.
  useEffect(() => {
    if (phase !== 'correct') return
    const t = setTimeout(advance, CELEBRATION_MS)
    return () => clearTimeout(t)
  })

  return {
    item: current.value,
    isRetake: current.retake,
    index,
    attempts,
    phase,
    done,
    marks,
    message,
    streak,
    correct,
    wrong,
    advance,
    /** Byt fas utan att svara (t.ex. dölj "försök igen" när man börjar skriva). */
    setPhase,
  }
}

export type RoundFlow<T> = ReturnType<typeof useRoundFlow<T>>
