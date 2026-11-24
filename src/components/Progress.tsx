import type { Mark } from '../game/useRoundFlow'

/** Prickarna överst i en runda (grön = rätt direkt, gul = rätt på andra, orange = missad). */
export function Progress({ marks, index }: { marks: Mark[]; index: number }) {
  return (
    <div className={`progress ${marks.length > 12 ? 'progress-many' : ''}`}>
      {marks.map((m, i) => (
        <span key={i} className={`dot dot-${m} ${i === index ? 'dot-current' : ''}`} />
      ))}
    </div>
  )
}
