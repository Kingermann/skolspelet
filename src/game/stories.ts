import { CONFIG, opsForGrade } from './config'
import {
  expr,
  fmt,
  makeProblem,
  pickAddPair,
  pickDivTriple,
  pickMulPair,
  pickSubPair,
  plainAdd,
  plainDiv,
  plainMul,
  plainSub,
  randInt,
  shuffle,
} from './generator'
import type { Grade, Level, Op, OpChoice, PrioSpec, Problem } from './types'

/**
 * Textuppgifter ("Per har 2 äpplen och får 5 till…").
 *
 * Talen kommer från samma talområden som de vanliga uppgifterna (config.ts),
 * så svårigheten följer årskurs och nivå. Svaret är alltid ett tal.
 *
 * Lägg gärna till egna berättelser! Varje mall får talen och två namn.
 * `max` = största tal som passar berättelsen (t.ex. är 5 000 äpplen konstigt).
 */

const NAMES = ['Per', 'Lisa', 'Ali', 'Emma', 'Noah', 'Maja', 'Oskar', 'Sara', 'Elsa', 'Leo', 'Alva', 'Hugo', 'Ella', 'Omar', 'Wilma', 'Liam']
const PLAYERS = ['Ronaldo', 'Messi', 'Zlatan', 'Haaland', 'Mbappé', 'Asllani']

/** "1 äpple" / "3 äpplen" */
const n = (x: number, one: string, many: string) => `${fmt(x)} ${x === 1 ? one : many}`

interface Who {
  A: string
  B: string
  P: string
  P2: string
}

interface Story {
  text: string
  label: string
}

interface Template<T extends number[]> {
  /** Största tal (inklusive svaret) som passar berättelsen. */
  max?: number
  /** Extra villkor för att berättelsen ska passa talen. */
  fits?: (nums: T) => boolean
  make: (nums: T, who: Who) => Story
}

// ---------- Plus ----------

const ADD: Template<[number, number]>[] = [
  {
    max: 50,
    make: ([a, b], { A }) => ({
      text: `${A} har ${n(a, 'äpple', 'äpplen')} och får ${n(b, 'äpple', 'äpplen')} till. Hur många äpplen har ${A} nu?`,
      label: 'äpplen',
    }),
  },
  {
    max: 100,
    make: ([a, b]) => ({
      text: `I en buss sitter ${n(a, 'person', 'personer')}. Vid nästa hållplats kliver ${n(b, 'person', 'personer')} på. Hur många personer sitter i bussen nu?`,
      label: 'personer',
    }),
  },
  {
    max: 1000,
    make: ([a, b], { A, B }) => ({
      text: `${A} har ${n(a, 'klistermärke', 'klistermärken')} och ${B} har ${n(b, 'klistermärke', 'klistermärken')}. Hur många klistermärken har de tillsammans?`,
      label: 'klistermärken',
    }),
  },
  {
    max: 100,
    make: ([a, b], { P }) => ({
      text: `${P} gjorde ${fmt(a)} mål förra säsongen och ${fmt(b)} mål den här säsongen. Hur många mål är det sammanlagt?`,
      label: 'mål',
    }),
  },
  {
    make: ([a, b], { A }) => ({
      text: `${A} har ${n(a, 'poäng', 'poäng')} i ett spel och vinner ${n(b, 'poäng', 'poäng')} till. Hur många poäng har ${A} nu?`,
      label: 'poäng',
    }),
  },
  {
    fits: ([a, b]) => Math.min(a, b) >= 20,
    make: ([a, b]) => ({
      text: `En cykel kostar ${fmt(a)} kr och en hjälm kostar ${fmt(b)} kr. Hur mycket kostar de tillsammans?`,
      label: 'kr',
    }),
  },
  {
    fits: ([a, b]) => Math.min(a, b) >= 50,
    make: ([a, b]) => ({
      text: `På lördagens match var det ${fmt(a)} åskådare och på söndagens match ${fmt(b)}. Hur många åskådare var det sammanlagt?`,
      label: 'åskådare',
    }),
  },
]

// ---------- Minus ----------

const SUB: Template<[number, number]>[] = [
  {
    max: 50,
    make: ([a, b], { A }) => ({
      text: `${A} hade ${n(a, 'ballong', 'ballonger')}. ${n(b, 'ballong', 'ballonger')} flög iväg. Hur många ballonger har ${A} kvar?`,
      label: 'ballonger',
    }),
  },
  {
    max: 100,
    make: ([a, b]) => ({
      text: `Det låg ${n(a, 'bulle', 'bullar')} på ett fat. Barnen åt upp ${fmt(b)}. Hur många bullar finns kvar?`,
      label: 'bullar',
    }),
  },
  {
    max: 1000,
    make: ([a, b], { A, B }) => ({
      text: `${A} har ${n(a, 'kula', 'kulor')} och ${B} har ${n(b, 'kula', 'kulor')}. Hur många fler kulor har ${A}?`,
      label: 'kulor',
    }),
  },
  {
    max: 100,
    make: ([a, b], { P, P2 }) => ({
      text: `${P} har gjort ${fmt(a)} mål och ${P2} har gjort ${fmt(b)} mål. Hur många fler mål har ${P} gjort?`,
      label: 'mål',
    }),
  },
  {
    fits: ([a]) => a >= 5,
    make: ([a, b], { A }) => ({
      text: `En bok har ${n(a, 'sida', 'sidor')}. ${A} har läst ${n(b, 'sida', 'sidor')}. Hur många sidor är kvar att läsa?`,
      label: 'sidor',
    }),
  },
  {
    max: 1000,
    make: ([a, b], { A }) => ({
      text: `${A} har ${fmt(a)} kr och köper en present för ${fmt(b)} kr. Hur många kronor har ${A} kvar?`,
      label: 'kr',
    }),
  },
  {
    fits: ([a]) => a >= 100,
    make: ([a, b]) => ({
      text: `En fotbollsklubb har ${fmt(a)} kr och köper nya matchtröjor för ${fmt(b)} kr. Hur många kronor har klubben kvar?`,
      label: 'kr',
    }),
  },
]

// ---------- Gånger ([antal grupper, antal i varje]) ----------

const MUL: Template<[number, number]>[] = [
  {
    fits: ([a, b]) => a <= 20 && b <= 20,
    make: ([a, b], { A }) => ({
      text: `${A} köper ${n(a, 'påse', 'påsar')} med ${n(b, 'karamell', 'karameller')} i varje. Hur många karameller blir det?`,
      label: 'karameller',
    }),
  },
  {
    fits: ([a, b]) => a <= 20 && b <= 10,
    make: ([a, b], { P }) => ({
      text: `${P} gör ${fmt(b)} mål i varje match. Hur många mål blir det på ${n(a, 'match', 'matcher')}?`,
      label: 'mål',
    }),
  },
  {
    fits: ([a, b]) => a <= 30 && b <= 30,
    make: ([a, b]) => ({
      text: `I matsalen finns ${fmt(a)} bord med ${n(b, 'stol', 'stolar')} vid varje bord. Hur många stolar finns det?`,
      label: 'stolar',
    }),
  },
  {
    make: ([a, b]) => ({
      text: `En biljett till en fotbollsmatch kostar ${fmt(b)} kr. Hur mycket kostar ${n(a, 'biljett', 'biljetter')}?`,
      label: 'kr',
    }),
  },
  {
    make: ([a, b], { A }) => ({
      text: `${A} sparar ${fmt(b)} kr varje vecka. Hur många kronor har ${A} sparat efter ${n(a, 'vecka', 'veckor')}?`,
      label: 'kr',
    }),
  },
]

// ---------- Delat ([tal, delat med, svar]) ----------

const DIV: Template<[number, number, number]>[] = [
  {
    fits: ([t, d]) => t <= 100 && d >= 2,
    make: ([t, d]) => ({
      text: `${n(t, 'kaka', 'kakor')} ska delas lika mellan ${fmt(d)} barn. Hur många kakor får varje barn?`,
      label: 'kakor',
    }),
  },
  {
    fits: ([t, d]) => t <= 200 && d >= 2 && d <= 10,
    make: ([t, d]) => ({
      text: `${fmt(t)} elever ska åka till en match. Det får plats ${fmt(d)} elever i varje minibuss. Hur många minibussar behövs?`,
      label: 'minibussar',
    }),
  },
  {
    fits: ([t, d]) => t <= 200 && d >= 2 && d <= 11,
    make: ([t, d]) => ({
      text: `${fmt(t)} fotbollsspelare ska delas in i lag med ${fmt(d)} spelare i varje lag. Hur många lag blir det?`,
      label: 'lag',
    }),
  },
  {
    fits: ([, d]) => d >= 2,
    make: ([t, d], { A }) => ({
      text: `${A} och kompisarna vinner ${fmt(t)} kr som delas lika mellan ${fmt(d)} personer. Hur många kronor får var och en?`,
      label: 'kr',
    }),
  },
  {
    fits: ([, d]) => d <= 100,
    make: ([t, d], { A }) => ({
      text: `En glass kostar ${fmt(d)} kr. Hur många glassar kan ${A} köpa för ${fmt(t)} kr?`,
      label: 'glassar',
    }),
  },
]

// ---------- Tvåstegsfrågor för prioriteringsregler (åk 6) ----------

function prioStory(spec: PrioSpec, op: Op, { A, B }: Who): Problem {
  const story = (p: Problem, text: string, label: string): Problem => ({ ...p, story: text, answerLabel: label })

  if (!spec.paren) {
    switch (op) {
      case '+': {
        const a = randInt(1, 50)
        const b = randInt(2, 10)
        const c = randInt(2, 10)
        const ans = a + b * c
        return story(
          makeProblem(expr(a, '+', b, '×', c, '=', '?'), ans, [(a + b) * c, a + b + c, ans + 1, ans - 1]),
          `${A} har ${fmt(a)} kr. Varje vecka får ${A} ${fmt(b)} kr i veckopeng. Hur många kronor har ${A} efter ${fmt(c)} veckor?`,
          'kr',
        )
      }
      case '-': {
        const b = randInt(2, 10)
        const c = randInt(2, 10)
        const a = randInt(b * c, b * c + 40)
        const ans = a - b * c
        return story(
          makeProblem(expr(a, '-', b, '×', c, '=', '?'), ans, [(a - b) * c, a - b - c, ans + 1, ans + 10]),
          `${A} har ${fmt(a)} kr och köper ${fmt(b)} glassar som kostar ${fmt(c)} kr styck. Hur många kronor har ${A} kvar?`,
          'kr',
        )
      }
      case '×': {
        const a = randInt(2, 10)
        const b = randInt(2, 10)
        const c = randInt(1, a * b - 1)
        const ans = a * b - c
        return story(
          makeProblem(expr(a, '×', b, '-', c, '=', '?'), ans, [a * (b - c), ans + 1, ans - 1, a * b + c]),
          `I aulan finns ${fmt(a)} rader med ${fmt(b)} stolar i varje rad. ${n(c, 'stol är upptagen', 'stolar är upptagna')}. Hur många stolar är lediga?`,
          'stolar',
        )
      }
      case '÷': {
        const b = randInt(2, 10)
        const q = randInt(2, 10)
        const a = b * q
        const c = randInt(1, 30)
        const ans = q + c
        return story(
          makeProblem(expr(a, '÷', b, '+', c, '=', '?'), ans, [(a + c) / b, a / (b + c), ans + 1, ans - 1, a + c]),
          `${fmt(a)} kulor delas lika mellan ${fmt(b)} barn. ${A} är ett av barnen och hade redan ${n(c, 'kula', 'kulor')} innan. Hur många kulor har ${A} nu?`,
          'kulor',
        )
      }
    }
  }

  switch (op) {
    case '+': {
      const a = randInt(2, 20)
      const b = randInt(2, 20)
      const c = randInt(2, 9)
      const ans = (a + b) * c
      return story(
        makeProblem(expr(`(${a}`, '+', `${b})`, '×', c, '=', '?'), ans, [a + b * c, ans + c, ans - c, ans + 1]),
        `I en klass finns ${fmt(a)} tjejer och ${fmt(b)} killar. Alla får ${fmt(c)} pennor var. Hur många pennor delas ut?`,
        'pennor',
      )
    }
    case '-': {
      const a = randInt(5, 30)
      const b = randInt(1, a - 1)
      const c = randInt(2, 9)
      const ans = (a - b) * c
      return story(
        makeProblem(expr(`(${a}`, '-', `${b})`, '×', c, '=', '?'), ans, [a - b * c, ans + c, ans - c, ans + 1]),
        `Det finns ${fmt(a)} biljetter till en match och ${fmt(b)} är redan sålda. Resten säljs för ${fmt(c)} kr styck. Hur många kronor blir det?`,
        'kr',
      )
    }
    case '×': {
      const a = randInt(2, 9)
      const b = randInt(1, 15)
      const c = randInt(1, 15)
      const ans = a * (b + c)
      return story(
        makeProblem(expr(a, '×', `(${b}`, '+', `${c})`, '=', '?'), ans, [a * b + c, ans + a, ans - a, ans + 1]),
        `${A} läser ${n(b, 'sida', 'sidor')} på morgonen och ${n(c, 'sida', 'sidor')} på kvällen. Hur många sidor läser ${A} på ${fmt(a)} dagar?`,
        'sidor',
      )
    }
    case '÷': {
      const c = randInt(2, 9)
      const q = randInt(2, 12)
      const total = c * q
      const a = randInt(1, total - 1)
      const b = total - a
      return story(
        makeProblem(expr(`(${a}`, '+', `${b})`, '÷', c, '=', '?'), q, [a + b / c, q + 1, q - 1, total - c]),
        `${A} har ${n(a, 'godisbit', 'godisbitar')} och ${B} har ${n(b, 'godisbit', 'godisbitar')}. De lägger ihop allt och delar lika mellan ${fmt(c)} kompisar. Hur många godisbitar får var och en?`,
        'godisbitar',
      )
    }
  }
}

// ---------- Välj berättelse ----------

function choose<T extends number[]>(templates: Template<T>[], nums: T, answer: number, who: Who): Story | null {
  const biggest = Math.max(...nums, answer)
  const ok = templates.filter((t) => (t.max === undefined || biggest <= t.max) && (t.fits?.(nums) ?? true))
  if (ok.length === 0) return null
  return shuffle(ok)[0].make(nums, who)
}

function randomWho(): Who {
  const [A, B] = shuffle(NAMES)
  const [P, P2] = shuffle(PLAYERS)
  return { A, B, P, P2 }
}

/** En textuppgift för vald årskurs, nivå och räknesätt. */
export function generateStory(grade: Grade, level: Level, choice: OpChoice): Problem {
  const op: Op = choice === 'mix' ? shuffle(opsForGrade(grade))[0] : choice
  const spec = CONFIG[grade][level][op]
  if (!spec) throw new Error(`Räknesätt ${op} finns inte för åk ${grade}`)
  const who = randomWho()

  let base: Problem
  let story: Story | null
  switch (spec.kind) {
    case 'add': {
      const [a, b] = pickAddPair(spec)
      base = plainAdd(a, b, spec.step)
      story = choose(ADD, [a, b], base.answer, who)
      break
    }
    case 'sub': {
      const [a, b] = pickSubPair(spec)
      base = plainSub(a, b, spec.step)
      story = choose(SUB, [a, b], base.answer, who)
      break
    }
    case 'mul': {
      const [a, b] = pickMulPair(spec)
      base = plainMul(a, b)
      story = choose(MUL, [a, b], base.answer, who)
      break
    }
    case 'div': {
      // Att dela med 1 blir en tråkig berättelse – välj om talen om det går.
      let [t, d, q] = pickDivTriple(spec)
      for (let i = 0; i < 20 && d === 1; i++) [t, d, q] = pickDivTriple(spec)
      base = plainDiv(t, d)
      story = choose(DIV, [t, d, q], base.answer, who)
      break
    }
    case 'prio':
      return prioStory(spec, op, who)
  }
  // Om ingen berättelse passar talen blir det en vanlig uppgift istället.
  return story ? { ...base, story: story.text, answerLabel: story.label } : base
}
