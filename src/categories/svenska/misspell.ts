/**
 * Regler som gör felstavningar av ett ord.
 *
 * - `commonMisspellings`: typiska fel som barn gör (dubbelteckning, sj-ljud, j-ljud …).
 *   Används på Medel och Svår.
 * - `obviousMisspellings`: fel som syns tydligt (bokstäver i fel ordning, fel bokstav).
 *   Används på Lätt.
 *
 * Reglerna kan ibland råka skapa ett riktigt ord (t.ex. "komma" → "koma"). Sådana
 * ord tas bort via listan i `realWords.ts`, som testerna håller uppdaterad.
 */

export type ErrorType = 'dubbel' | 'enkel' | 'ck' | 'sj' | 'tj' | 'j' | 'ao' | 'ea' | 'ng' | 'tyst' | 'dete' | 'tydlig'

export interface Misspelling {
  word: string
  type: ErrorType
}

/** Kort förklaring som visas när man svarat fel två gånger. */
export const TIPS: Record<ErrorType, string> = {
  dubbel: 'Efter kort vokal blir det oftast två konsonanter: katt, hoppa, glass.',
  enkel: 'Efter lång vokal skrivs bara en konsonant: sol, hus, mat. Ord som slutar på m har oftast bara ett m: rum, hem.',
  ck: 'Kort vokal + k-ljud skrivs med ck: tack, flicka, docka.',
  sj: 'sj-ljudet kan stavas sj, sk, stj, skj eller sch: sju, skina, stjärna, skjorta, schampo.',
  tj: 'tj-ljudet kan stavas tj, k eller kj: tjugo, kyrka, kjol.',
  j: 'j-ljudet kan stavas j, g, hj, gj, dj eller lj: jul, göra, hjärta, gjorde, djur, ljus.',
  ao: 'Ljudet å skrivs ibland med o, och o-ljudet ibland med å: sova, kom, båt, sol.',
  ea: 'ä-ljudet skrivs ibland med e, t.ex. berg, ett, mest – och ibland med ä: läsa, äta.',
  ng: 'ng-ljudet skrivs ng (lång, sjunga). Före k blir det nk (tänka). gn uttalas ofta ngn: regn.',
  tyst: 'Ibland hörs inte alla bokstäver: roligt, aldrig, kniv, djur, hjärta.',
  dete: 'Efter tonande ljud blir det -de (spelade, trodde), efter tonlösa ljud -te (läste, tyckte).',
  tydlig: 'Titta noga på varje bokstav – läs ordet långsamt!',
}

const VOWELS = 'aeiouyåäö'
const SOFT_VOWELS = 'eiyäö'
const isVowel = (c: string | undefined) => c !== undefined && VOWELS.includes(c)

/** Alla sätt att byta ut `from` mot `to` en gång i ordet (på varje ställe det förekommer). */
function replaceEach(word: string, from: string, to: string, where?: (index: number) => boolean): string[] {
  const out: string[] = []
  for (let i = word.indexOf(from); i !== -1; i = word.indexOf(from, i + 1)) {
    if (where && !where(i)) continue
    out.push(word.slice(0, i) + to + word.slice(i + from.length))
  }
  return out
}

export function commonMisspellings(word: string): Misspelling[] {
  const out: Misspelling[] = []
  const add = (type: ErrorType, words: string[]) => words.forEach((w) => out.push({ word: w, type }))

  // Dubbelteckning som tappas: katt → kat, hoppa → hopa
  for (const c of 'bdfglmnprstv') add('dubbel', replaceEach(word, c + c, c))
  // ck → k / kk: flicka → flika, flikka
  add('ck', replaceEach(word, 'ck', 'k'))
  add('ck', replaceEach(word, 'ck', 'kk'))
  // Enkel konsonant som dubblas fel i slutet: sol → soll, rum → rumm
  {
    const last = word.at(-1)!
    const before = word.at(-2)
    if (word.length <= 5 && !isVowel(last) && isVowel(before) && 'lmnprst'.includes(last)) add('enkel', [word + last])
  }
  // Dubbelteckning före en annan konsonant: aldrig → alldrig, sylt → syllt
  for (const c of 'lmns') {
    add('enkel', replaceEach(word, c, c + c, (i) => isVowel(word[i - 1]) && word[i + 1] !== undefined && !isVowel(word[i + 1]) && word[i + 1] !== c))
  }
  // sj-ljud
  add('sj', replaceEach(word, 'ch', 'sch', (i) => i > 0 && word[i - 1] !== 's'))
  add('sj', replaceEach(word, 'ge', 'sch', (i) => i === word.length - 2 && isVowel(word[i - 1])))
  add('sj', replaceEach(word, 'sk', 'sj', (i) => SOFT_VOWELS.includes(word[i + 2] ?? '')))
  add('sj', replaceEach(word, 'stj', 'sj'))
  add('sj', replaceEach(word, 'skj', 'sj'))
  add('sj', replaceEach(word, 'sch', 'sj'))
  add('sj', replaceEach(word, 'sj', 'sch'))
  add('sj', replaceEach(word, 'sj', 'stj'))
  add('sj', replaceEach(word, 'tion', 'schon'))
  add('sj', replaceEach(word, 'tion', 'sjon'))
  add('sj', replaceEach(word, 'ch', 'sj', (i) => i === 0))
  // tj-ljud
  const notAfterS = (i: number) => word[i - 1] !== 's' // "stj" och "skj" är sj-ljud
  add('tj', replaceEach(word, 'tj', 'kj', notAfterS))
  add('tj', replaceEach(word, 'tj', 'ch', notAfterS))
  add('tj', replaceEach(word, 'kj', 'tj', notAfterS)) // "skj" är också ett sj-ljud
  add('tj', replaceEach(word, 'k', 'tj', (i) => i === 0 && SOFT_VOWELS.includes(word[1] ?? '')))
  // j-ljud
  for (const start of ['hj', 'gj', 'dj', 'lj']) add('j', replaceEach(word, start, 'j', (i) => i === 0))
  add('j', replaceEach(word, 'g', 'j', (i) => i === 0 && SOFT_VOWELS.includes(word[1] ?? '')))
  add('j', replaceEach(word, 'j', 'g', (i) => i === 0))
  // å/o och ä/e
  add('ao', replaceEach(word, 'å', 'o'))
  add('ao', replaceEach(word, 'o', 'å'))
  add('ea', replaceEach(word, 'ä', 'e'))
  add('ea', replaceEach(word, 'e', 'ä', (i) => i < word.length - 2))
  // ng-ljud
  add('ng', replaceEach(word, 'ng', 'ngg'))
  add('ng', replaceEach(word, 'nk', 'ngk'))
  add('ng', replaceEach(word, 'gn', 'ngn'))
  // Bokstäver som inte hörs: roligt → rolit, aldrig → aldri, kniv → niv, fantastiskt → fantastist
  add('tyst', replaceEach(word, 'igt', 'it'))
  add('tyst', replaceEach(word, 'ig', 'i', (i) => i === word.length - 2))
  add('tyst', replaceEach(word, 'kn', 'n', (i) => i === 0))
  add('tyst', replaceEach(word, 'skt', 'st', (i) => i === word.length - 3))
  add('tyst', replaceEach(word, 'dj', 'j'))
  // -de / -te i dåtid: läste → läsde, spelade → spelate
  if (word.endsWith('te') && !isVowel(word.at(-3))) add('dete', [word.slice(0, -2) + 'de'])
  if (word.endsWith('de') && !isVowel(word.at(-3))) add('dete', [word.slice(0, -2) + 'te'])
  if (word.endsWith('ade')) add('dete', [word.slice(0, -3) + 'ate'])

  return unique(out, word)
}

/** Konsonanter som byts mot en helt annan konsonant för tydliga fel. */
const FAR: Record<string, string> = {
  b: 'd', c: 's', d: 'b', f: 'v', g: 'k', h: 'm', j: 'v', k: 'p', l: 'd', m: 'n',
  n: 'm', p: 'q', r: 'v', s: 'z', t: 'f', v: 'w', x: 'z', z: 's',
}

export function obviousMisspellings(word: string): string[] {
  const out: string[] = []
  // Två bokstäver i fel ordning: katt → ktat
  for (let i = 1; i < word.length - 1; i++) {
    if (word[i] !== word[i + 1]) out.push(word.slice(0, i) + word[i + 1] + word[i] + word.slice(i + 2))
  }
  // En konsonant byts mot en helt annan: hund → humd
  for (let i = 0; i < word.length; i++) {
    const far = FAR[word[i]]
    if (far) out.push(word.slice(0, i) + far + word.slice(i + 1))
  }
  // Dubblad första bokstav: gul → ggul
  if (!isVowel(word[0]) && word[1] !== word[0]) out.push(word[0] + word)
  // Dubblad vokal: sol → sool
  for (let i = 0; i < word.length; i++) {
    if (isVowel(word[i]) && word[i + 1] !== word[i] && word[i - 1] !== word[i]) out.push(word.slice(0, i + 1) + word[i] + word.slice(i + 1))
  }
  return [...new Set(out)].filter((w) => w !== word)
}

function unique(list: Misspelling[], word: string): Misspelling[] {
  const seen = new Set<string>()
  return list.filter((m) => {
    if (m.word === word || seen.has(m.word)) return false
    seen.add(m.word)
    return true
  })
}
