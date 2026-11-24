import { useState } from 'react'

const COLORS = ['#ff5c8a', '#ffd23f', '#3da5ff', '#2ec27e', '#9b5cff', '#ff9f1c']

export function Confetti({ amount = 80 }: { amount?: number }) {
  const [pieces] = useState(() =>
    Array.from({ length: amount }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 0.8,
      duration: 2.2 + Math.random() * 1.8,
      color: COLORS[i % COLORS.length],
      size: 8 + Math.random() * 8,
      spin: Math.random() > 0.5 ? 1 : -1,
    })),
  )
  return (
    <div className="confetti" aria-hidden>
      {pieces.map((p) => (
        <span
          key={p.id}
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size * 0.6,
            background: p.color,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            ['--spin' as string]: p.spin,
          }}
        />
      ))}
    </div>
  )
}
