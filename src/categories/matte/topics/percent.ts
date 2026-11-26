import { randInt } from '../generator'
import type { Grade, Level } from '../types'
import { fmtDecimal, simplify, type Choice, type Task } from './task'
import { intChoices, pickOne, withChoices } from './util'

/**
 * 💯 Procent (åk 4–6). Läroplanen: "tal i procentform och deras samband med tal i bråk- och
 * decimalform" och "i vardagliga situationer".
 *
 * - Åk 4: procent = hundradelar (hundraruta), 50 % = hälften, 25 % och 10 % av tiotal
 * - Åk 5: hundraruta, procent ↔ bråk, 10 %, 5 %, 20 %, 75 % av …
 * - Åk 6: procent av …, procent ↔ decimaltal, andel (hur många procent är 15 av 60?)
 * Medel och Svår: ungefär var tredje uppgift är en vardagsuppgift (rabatt, pris).
 */

type Kind = 'grid' | 'of' | 'toFrac' | 'fromFrac' | 'toDec' | 'fromDec' | 'share' | 'discount' | 'newPrice' | 'shareStory'

interface Spec {
  kinds: Kind[]
  /** Procentsatser för "p % av …" och rabatter. */
  percents: number[]
  /** Största helhet (t.ex. pris) för "p % av …". */
  maxWhole: number
  /** Hundraruta: bara hela tiotal? */
  gridTens?: boolean
  /** Andel av vardagsuppgifter. */
  stories?: number
}

/** Per årskurs och nivå. Justera gärna! */
export const PERCENT: Record<4 | 5 | 6, Record<Level, Spec>> = {
  4: {
    latt: { kinds: ['grid'], percents: [], maxWhole: 0, gridTens: true },
    medel: { kinds: ['of', 'discount'], percents: [50, 100], maxWhole: 200, stories: 0.3 },
    svar: { kinds: ['of', 'discount'], percents: [25, 10, 50], maxWhole: 500, stories: 0.3 },
  },
  5: {
    latt: { kinds: ['grid'], percents: [], maxWhole: 0 },
    medel: { kinds: ['toFrac', 'fromFrac', 'of', 'discount'], percents: [10, 25, 50, 75], maxWhole: 1000, stories: 0.3 },
    svar: { kinds: ['of', 'discount', 'newPrice'], percents: [5, 20, 75], maxWhole: 1000, stories: 0.3 },
  },
  6: {
    latt: { kinds: ['of'], percents: [10, 25, 50], maxWhole: 1000 },
    medel: {
      kinds: ['of', 'toDec', 'fromDec', 'discount', 'newPrice'],
      percents: [5, 15, 20, 30, 35, 40, 45, 55, 60, 65, 70, 80, 85, 90, 95],
      maxWhole: 1000,
      stories: 0.3,
    },
    svar: { kinds: ['share', 'shareStory', 'newPrice'], percents: [5, 15, 20, 30, 40, 60, 70, 80, 90], maxWhole: 1000, stories: 0.3 },
  },
}

const STORY_KINDS: Kind[] = ['discount', 'newPrice', 'shareStory']
const THINGS = ['En tröja', 'En cykel', 'Ett spel', 'En bok', 'En fotboll', 'Ett par skor', 'En mössa', 'Ett par hörlurar']

const gcdOf = (a: number, b: number): number => (b === 0 ? a : gcdOf(b, a % b))

/**
 * En helhet (≤ max) där p % blir ett heltal. Minsta sådana är nämnaren i p/100 förkortat
 * (25 % ⇒ 4, 5 % ⇒ 20); helheten blir dessutom ett tiotal så att talen känns "runda".
 */
function wholeFor(p: number, max: number): number {
  const den = simplify(p, 100)[1]
  const unit = (den * 10) / gcdOf(den, 10)
  return unit * randInt(1, Math.max(1, Math.floor(max / unit)))
}

const pct = (n: number): Choice => ({ label: `${n} %`, correct: false })
const percentChoices = (answer: number, mistakes: number[]): Choice[] =>
  intChoices(answer, mistakes, 100)
    .filter((c) => Number(c.label) > 0)
    .map((c) => pct(Number(c.label)))

export function generatePercent(grade: Grade, level: Level): Task {
  const spec = PERCENT[(Math.min(6, Math.max(4, grade)) as 4 | 5 | 6)][level]
  const easy = level === 'latt'
  const storyKinds = spec.kinds.filter((k) => STORY_KINDS.includes(k))
  const plainKinds = spec.kinds.filter((k) => !STORY_KINDS.includes(k))
  const kind = storyKinds.length > 0 && (plainKinds.length === 0 || Math.random() < (spec.stories ?? 0)) ? pickOne(storyKinds) : pickOne(plainKinds)

  switch (kind) {
    case 'grid': {
      const colored = spec.gridTens ? randInt(1, 9) * 10 : randInt(1, 99)
      const task: Task = {
        prompt: 'Hur många procent är färgat?',
        picture: { kind: 'grid', colored },
        answerSuffix: '%',
        answer: { kind: 'int', value: colored },
        solution: `${colored} av 100 rutor = ${colored} %`,
      }
      // Vanliga fel: de ofärgade, tiotalen som ental.
      return withChoices(task, { ...pct(colored), correct: true }, percentChoices(colored, [100 - colored, colored / 10, colored + 10, colored - 10]), easy)
    }
    case 'of': {
      const p = pickOne(spec.percents)
      const whole = wholeFor(p, spec.maxWhole)
      const answer = (p * whole) / 100
      const task: Task = { text: `${p} % av ${whole} = ?`, answer: { kind: 'int', value: answer }, solution: `${p} % av ${whole} = ${answer}` }
      // Vanliga fel: procentsatsen själv, helheten delad med procenten, resten.
      return withChoices(task, { label: String(answer), correct: true }, intChoices(answer, [p, whole - answer, whole / p, whole / 10, answer * 10]), easy)
    }
    case 'toFrac':
    case 'fromFrac': {
      const p = pickOne(spec.percents)
      const [n, d] = simplify(p, 100)
      if (kind === 'toFrac') {
        const task: Task = {
          text: `${p} % = ?`,
          answer: { kind: 'fraction', num: n, den: d, equivalent: true },
          solution: `${p} % = ${p}/100 = ${n}/${d}`,
        }
        const wrong: Choice[] = (
          [[1, p], [p, 10], [n, d + 1], [d - n, d], [1, 3], [2, 3]] as [number, number][]
        )
          .filter(([a, b]) => a > 0 && b > 0 && Math.abs(a / b - n / d) > 1e-9)
          .map(([a, b]) => ({ label: `${a}/${b}`, correct: false, frac: [a, b] }))
        return withChoices(task, { label: `${n}/${d}`, correct: true, frac: [n, d] }, wrong, easy)
      }
      const task: Task = { text: `{${n}/${d}} = ? %`, answer: { kind: 'int', value: p }, solution: `${n}/${d} = ${p} %` }
      return withChoices(task, { ...pct(p), correct: true }, percentChoices(p, [n, d, n * 10, Number(`${n}${d}`), 100 - p]), easy)
    }
    case 'toDec': {
      const p = pickOne(spec.percents)
      const task: Task = { text: `${p} % = ?`, answer: { kind: 'decimal', value: p / 100 }, solution: `${p} % = ${fmtDecimal(p / 100)}` }
      const wrong = [p / 10, p, p / 1000, (100 - p) / 100].filter((v) => v !== p / 100).map((v) => ({ label: fmtDecimal(v), correct: false }))
      return withChoices(task, { label: fmtDecimal(p / 100), correct: true }, wrong, easy)
    }
    case 'fromDec': {
      const p = pickOne(spec.percents)
      const task: Task = { text: `${fmtDecimal(p / 100)} = ? %`, answer: { kind: 'int', value: p }, solution: `${fmtDecimal(p / 100)} = ${p} %` }
      return withChoices(task, { ...pct(p), correct: true }, percentChoices(p, [p / 10, 100 - p]), easy)
    }
    case 'share': {
      const whole = pickOne([10, 20, 25, 50, 200, 300, 400, 500, 60, 40, 80])
      const p = pickOne([...spec.percents, 50].filter((x) => (x * whole) % 100 === 0))
      const part = (p * whole) / 100
      const task: Task = {
        text: `${part} av ${whole} = ? %`,
        answer: { kind: 'int', value: p },
        solution: `${part} av ${whole} = ${part}/${whole} = ${p} %`,
      }
      return withChoices(task, { ...pct(p), correct: true }, percentChoices(p, [part, whole - part, 100 - p]), easy)
    }
    case 'shareStory': {
      const whole = pickOne([20, 25, 50])
      const p = pickOne([...spec.percents, 50].filter((x) => (x * whole) % 100 === 0))
      const part = (p * whole) / 100
      const task: Task = {
        story: `Klassen har ${whole} elever. ${part} av dem cyklar till skolan. Hur många procent cyklar?`,
        answerSuffix: '%',
        answer: { kind: 'int', value: p },
        solution: `${part} av ${whole} = ${part}/${whole} = ${p} %`,
      }
      return withChoices(task, { ...pct(p), correct: true }, percentChoices(p, [part, whole - part, 100 - p]), easy)
    }
    case 'discount':
    case 'newPrice': {
      // Rabatter i vardagen är sällan mer än hälften ("95 % rabatt" finns inte på riktigt).
      const p = pickOne(spec.percents.filter((x) => x <= 50))
      const price = wholeFor(p, spec.maxWhole)
      const off = (p * price) / 100
      const thing = pickOne(THINGS)
      if (kind === 'discount') {
        const story =
          p === 50
            ? `Halva priset! ${thing} kostar ${price} kr. Hur många kronor billigare blir det?`
            : `${thing} kostar ${price} kr. Det är ${p} % rabatt. Hur många kronor billigare blir det?`
        const task: Task = { story, answerSuffix: 'kr', answer: { kind: 'int', value: off }, solution: `${p} % av ${price} kr = ${off} kr` }
        return withChoices(task, { label: String(off), correct: true }, intChoices(off, [price - off, p, price / p]), easy)
      }
      const now = price - off
      const task: Task = {
        story: `${thing} kostar ${price} kr. På rean är det ${p} % rabatt. Vad kostar det på rean?`,
        answerSuffix: 'kr',
        answer: { kind: 'int', value: now },
        solution: `${p} % av ${price} kr = ${off} kr, ${price} − ${off} = ${now} kr`,
      }
      return withChoices(task, { label: String(now), correct: true }, intChoices(now, [off, price - p, price + off]), easy)
    }
  }
}
