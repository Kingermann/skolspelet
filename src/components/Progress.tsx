import type { Mark } from '../game/useRoundFlow'

/** Prickarna överst i en runda (grön = rätt direkt, gul = rätt på andra, orange = missad). */
export function Progress({ marks, index, isRetake }: { marks: Mark[]; index: number; isRetake: boolean }) {
  return (
    <div className="progress">
      {isRetake ? (
        <span className="retake-label">🔁 Omtag – ingen stjärna, men bra träning!</span>
      ) : (
        marks.map((m, i) => <span key={i} className={`dot dot-${m} ${i === index ? 'dot-current' : ''}`} />)
      )}
    </div>
  )
}
