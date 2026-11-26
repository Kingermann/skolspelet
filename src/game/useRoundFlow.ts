import { useEffect, useState } from 'react'
import { celebrateCorrect } from './celebrate'
import { randomOf } from './random'
import { sounds } from './sound'

/**
 * Gemensam logik för en spelrunda, oavsett kategori:
 * två försök per fråga, visa svaret efter två fel, stjärnor på första
 * försöket, "rätt i rad" och firande med konfetti + applåder.
 */

export type Phase = 'answering' | 'retry' | 'correct' | 'reveal'
export type Mark = 'pending' | 'first' | 'later' | 'missed'

const PRAISE = ['Rätt! 🎉', 'Snyggt! ⭐', 'Grymt! 🚀', 'Wow! 🌟', 'Perfekt! ✨', 'Klockrent! 💯', 'Superbra! 🙌']

/** Hur länge man får njuta av firandet innan nästa fråga kommer (millisekunder). */
const CELEBRATION_MS = 1600

interface Options<T> {
  /** Skapar rundans frågor (anropas en gång). */
  makeItems: () => T[]
  /** Anropas när rundan är slut: antal rätt på första försöket, antal frågor, och hur det gick på varje fråga. */
  onFinish: (firstTryCorrect: number, total: number, marks: Mark[], items: T[]) => void
}

export function useRoundFlow<T>({ makeItems, onFinish }: Options<T>) {
  const [items] = useState<T[]>(makeItems)
  const [index, setIndex] = useState(0)
  const [attempts, setAttempts] = useState(0)
  const [phase, setPhase] = useState<Phase>('answering')
  const [marks, setMarks] = useState<Mark[]>(() => items.map(() => 'pending'))
  const [message, setMessage] = useState('')
  const [streak, setStreak] = useState(0)

  const done = phase === 'correct' || phase === 'reveal'

  const mark = (m: Mark) => setMarks((prev) => prev.map((old, i) => (i === index ? m : old)))

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

  /** Fel svar. Första gången: försök igen. Andra gången: visa svaret. */
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
    }
  }

  function advance() {
    if (index + 1 < items.length) {
      setIndex(index + 1)
      setAttempts(0)
      setPhase('answering')
      setMessage('')
    } else {
      onFinish(marks.filter((m) => m === 'first').length, items.length, marks, items)
    }
  }

  // Rätt svar ⇒ gå vidare automatiskt efter en liten stund.
  useEffect(() => {
    if (phase !== 'correct') return
    const t = setTimeout(advance, CELEBRATION_MS)
    return () => clearTimeout(t)
  })

  return {
    item: items[index],
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
