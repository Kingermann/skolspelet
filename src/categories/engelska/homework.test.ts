import { describe, expect, it } from 'vitest'
import { MAX_HOMEWORK, type HomeworkGloss } from '../../game/profiles'
import { alternatives, checkAnswer, display, distance, glossProblem, makeHomeworkRound } from './homework'

const gloss = (en: string, sv: string, id = en): HomeworkGloss => ({ id, en, sv })

describe('läxglosor: rätta svaret', () => {
  it('stora/små bokstäver, mellanslag och skiljetecken spelar ingen roll', () => {
    expect(checkAnswer('Dog', 'dog')).toBe('right')
    expect(checkAnswer('  i   AM ', 'I am')).toBe('right')
    expect(checkAnswer('I am.', 'I am')).toBe('right')
    expect(checkAnswer('Hund!', 'hund')).toBe('right')
  })

  it("' och ’ räknas som samma tecken (iPad byter automatiskt)", () => {
    expect(checkAnswer('you’re', "you're")).toBe('right')
    expect(checkAnswer("you're", 'you’re')).toBe('right')
  })

  it('/ ger flera rätta svar', () => {
    expect(checkAnswer('you are', "you are / you're")).toBe('right')
    expect(checkAnswer("you're", "you are / you're")).toBe('right')
    expect(checkAnswer('lycklig', 'glad/lycklig')).toBe('right')
    expect(checkAnswer('glad lycklig', 'glad/lycklig')).toBe('wrong')
  })

  it('å, ä och ö måste vara rätt – men en bokstav fel är "nästan"', () => {
    expect(checkAnswer('hast', 'häst')).toBe('almost')
    expect(checkAnswer('häst', 'häst')).toBe('right')
  })

  it('småord måste vara med om de står i listan', () => {
    expect(checkAnswer('dog', 'a dog')).toBe('wrong')
    expect(checkAnswer('dog', 'a dog / dog')).toBe('right')
    expect(checkAnswer('run', 'to run')).toBe('wrong')
  })

  it('en bokstav fel är "nästan", två är fel', () => {
    expect(checkAnswer('hors', 'horse')).toBe('almost')
    expect(checkAnswer('hourse', 'horse')).toBe('almost')
    expect(checkAnswer('hoese', 'horse')).toBe('almost')
    expect(checkAnswer('hosre', 'horse')).toBe('wrong')
    expect(checkAnswer('cat', 'dog')).toBe('wrong')
  })

  it('korta ord (under tre bokstäver) får inget "nästan"', () => {
    expect(checkAnswer('a', 'I')).toBe('wrong')
    expect(checkAnswer('it', 'is')).toBe('wrong')
  })

  it('tomt svar är fel', () => {
    expect(checkAnswer('', 'dog')).toBe('wrong')
    expect(checkAnswer('  .  ', 'dog')).toBe('wrong')
  })

  it('räknar bokstavsskillnad', () => {
    expect(distance('horse', 'horse')).toBe(0)
    expect(distance('horse', 'house')).toBe(1)
    expect(distance('', 'abc')).toBe(3)
    expect(distance('kitten', 'sitting')).toBe(3)
  })

  it('visar alternativen snyggt', () => {
    expect(alternatives(" you are/you're / ")).toEqual(['you are', "you're"])
    expect(display("you are/you're")).toBe("you are / you're")
  })
})

describe('läxglosor: förhöret', () => {
  const list = Array.from({ length: 11 }, (_, i) => gloss(`word${i}`, `ord${i}`))

  it('varje glosa förhörs exakt en gång', () => {
    for (const choice of ['en-sv', 'sv-en', 'mix'] as const) {
      const round = makeHomeworkRound(list, choice)
      expect(round.map((q) => q.gloss.id).sort()).toEqual(list.map((g) => g.id).sort())
    }
  })

  it('riktningen följer valet, blandat blir åt båda hållen', () => {
    expect(makeHomeworkRound(list, 'en-sv').every((q) => q.direction === 'en-sv')).toBe(true)
    expect(makeHomeworkRound(list, 'sv-en').every((q) => q.direction === 'sv-en')).toBe(true)
    const mix = makeHomeworkRound(list, 'mix').map((q) => q.direction)
    expect(mix.filter((d) => d === 'en-sv').length).toBe(6)
    expect(mix.filter((d) => d === 'sv-en').length).toBe(5)
  })
})

describe('läxglosor: lägga till', () => {
  it('båda språken måste finnas', () => {
    expect(glossProblem('dog', '', [])).not.toBeNull()
    expect(glossProblem(' / ', 'hund', [])).not.toBeNull()
    expect(glossProblem('dog', 'hund', [])).toBeNull()
  })

  it('samma engelska ord kan inte läggas till två gånger', () => {
    const list = [gloss("you are / you're", 'du är')]
    expect(glossProblem('You are', 'ni är', list)).not.toBeNull()
    expect(glossProblem("you’re", 'ni är', list)).not.toBeNull()
    expect(glossProblem('we are', 'vi är', list)).toBeNull()
  })

  it('listan har ett tak', () => {
    const full = Array.from({ length: MAX_HOMEWORK }, (_, i) => gloss(`w${i}`, `o${i}`))
    expect(glossProblem('dog', 'hund', full)).not.toBeNull()
  })
})
