import { Fragment, type ReactNode } from 'react'
import type { Picture } from './task'

/** Bilder till uppgifterna, ritade direkt i koden (inga bildfiler). */

/** Ett riktigt bråk: täljare över nämnare. */
export function Frac({ num, den }: { num: ReactNode; den: ReactNode }) {
  return (
    <span className="frac">
      <span className="frac-num">{num}</span>
      <span className="frac-den">{den}</span>
    </span>
  )
}

/** Text där {3/4} blir ett riktigt bråk och "?" blir svarsrutan. */
export function RichText({ text, slot }: { text: string; slot?: ReactNode }) {
  const parts = text.split(/(\{[\dx]+\/[\dx]+\}|\?)/)
  return (
    <>
      {parts.map((p, i) => {
        const f = p.match(/^\{([\dx]+)\/([\dx]+)\}$/)
        if (f) return <Frac key={i} num={f[1]} den={f[2]} />
        if (p === '?') return <Fragment key={i}>{slot ?? '?'}</Fragment>
        return <Fragment key={i}>{p}</Fragment>
      })}
    </>
  )
}

const point = (cx: number, cy: number, r: number, deg: number) => {
  const rad = ((deg - 90) * Math.PI) / 180
  return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)]
}

function Pizza({ parts, colored }: { parts: number; colored: number }) {
  const r = 90
  const slices = Array.from({ length: parts }, (_, i) => {
    const [x1, y1] = point(100, 100, r, (360 / parts) * i)
    const [x2, y2] = point(100, 100, r, (360 / parts) * (i + 1))
    const large = parts === 1 ? 1 : 0
    return { d: `M100,100 L${x1},${y1} A${r},${r} 0 ${large} 1 ${x2},${y2} Z`, on: i < colored }
  })
  return (
    <svg className="picture" viewBox="0 0 200 200" role="img" aria-label={`En pizza i ${parts} bitar, ${colored} är färgade`}>
      <circle cx="100" cy="100" r="96" fill="#d9a066" />
      {slices.map((s, i) => (
        <path key={i} d={s.d} fill={s.on ? '#ff7043' : '#fff3d6'} stroke="#8a5a2b" strokeWidth="3" strokeLinejoin="round" />
      ))}
    </svg>
  )
}

function Bar({ parts, colored }: { parts: number; colored: number }) {
  // Många bitar ⇒ två rader, som en chokladkaka.
  const rows = parts > 6 && parts % 2 === 0 ? 2 : 1
  const cols = parts / rows
  const w = 240 / cols
  const h = 100 / rows
  return (
    <svg className="picture picture-wide" viewBox="0 0 260 120" role="img" aria-label={`En chokladkaka i ${parts} bitar, ${colored} är färgade`}>
      {Array.from({ length: parts }, (_, i) => (
        <rect
          key={i}
          x={10 + (i % cols) * w}
          y={10 + Math.floor(i / cols) * h}
          width={w}
          height={h}
          rx="6"
          fill={i < colored ? '#7b4b2a' : '#f0e0cf'}
          stroke="#4a2c17"
          strokeWidth="3"
        />
      ))}
    </svg>
  )
}

function SetOf({ emoji, total, marked, group, reveal }: { emoji: string; total: number; marked: number; group: number; reveal: boolean }) {
  const groups = Array.from({ length: total / group }, (_, g) => g)
  return (
    <div className="picture-set" role="img" aria-label={`${total} saker`}>
      {groups.map((g) => (
        <span key={g} className={`set-group ${group < total ? 'set-boxed' : ''}`}>
          {Array.from({ length: group }, (_, i) => {
            const index = g * group + i
            return (
              <span key={i} className={reveal && index < marked ? 'set-marked' : ''}>
                {emoji}
              </span>
            )
          })}
        </span>
      ))}
    </div>
  )
}

function Clock({ h, m }: { h: number; m: number }) {
  const hourAngle = ((h % 12) + m / 60) * 30
  const minuteAngle = m * 6
  const [hx, hy] = point(100, 100, 48, hourAngle)
  const [mx, my] = point(100, 100, 74, minuteAngle)
  return (
    <svg className="picture" viewBox="0 0 200 200" role="img" aria-label="En klocka">
      <circle cx="100" cy="100" r="94" fill="white" stroke="#2b2250" strokeWidth="6" />
      {Array.from({ length: 60 }, (_, i) => {
        const big = i % 5 === 0
        const [x1, y1] = point(100, 100, big ? 80 : 85, i * 6)
        const [x2, y2] = point(100, 100, 89, i * 6)
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#2b2250" strokeWidth={big ? 3 : 1.2} />
      })}
      {Array.from({ length: 12 }, (_, i) => {
        const [x, y] = point(100, 100, 66, (i + 1) * 30)
        return (
          <text key={i} x={x} y={y} textAnchor="middle" dominantBaseline="central" fontSize="17" fontWeight="700" fill="#2b2250">
            {i + 1}
          </text>
        )
      })}
      <line x1="100" y1="100" x2={hx} y2={hy} stroke="#2b2250" strokeWidth="8" strokeLinecap="round" />
      <line x1="100" y1="100" x2={mx} y2={my} stroke="#7c4dff" strokeWidth="5" strokeLinecap="round" />
      <circle cx="100" cy="100" r="6" fill="#2b2250" />
    </svg>
  )
}

export function PictureView({ picture, reveal }: { picture: Picture; reveal: boolean }) {
  switch (picture.kind) {
    case 'pizza':
      return <Pizza parts={picture.parts} colored={picture.colored} />
    case 'bar':
      return <Bar parts={picture.parts} colored={picture.colored} />
    case 'set':
      return <SetOf {...picture} reveal={reveal} />
    case 'clock':
      return <Clock h={picture.h} m={picture.m} />
  }
}
