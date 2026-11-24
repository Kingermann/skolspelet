/// <reference types="node" />
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { describe, expect, it } from 'vitest'
import { ROUND_LENGTH } from '../../game/constants'
import { COUNTRIES, CONTINENTS, IGNORED, MERGED_INTO, TERRITORIES, type Continent } from './countries'
import { buildContinentMap } from './map'
import { pickRoundCountries } from './round'
import { LEVELS } from '../../game/levels'

const require = createRequire(import.meta.url)
const topology = JSON.parse(readFileSync(require.resolve('world-atlas/countries-50m.json'), 'utf8'))
const atlasNames: string[] = topology.objects.countries.geometries.map((g: { properties: { name: string } }) => g.properties.name)
const ALL_CONTINENTS = Object.keys(CONTINENTS) as Continent[]

describe('landtabellen', () => {
  it('varje område i kartdatan är antingen ett land, en del av ett land, grått område eller ignorerat', () => {
    for (const name of atlasNames) {
      const kinds = [name in COUNTRIES, name in MERGED_INTO, name in TERRITORIES, IGNORED.includes(name)].filter(Boolean)
      expect(kinds.length, name).toBe(1)
    }
  })

  it('varje land i tabellen finns i kartdatan', () => {
    for (const name of [...Object.keys(COUNTRIES), ...Object.keys(MERGED_INTO), ...Object.keys(TERRITORIES)]) {
      expect(atlasNames, name).toContain(name)
    }
  })

  it('sammanslagna områden pekar på ett riktigt land', () => {
    for (const target of Object.values(MERGED_INTO)) expect(COUNTRIES[target], target).toBeDefined()
  })

  it('alla svenska namn är unika och ifyllda', () => {
    const names = Object.values(COUNTRIES).map((c) => c.sv)
    expect(new Set(names).size).toBe(names.length)
    for (const n of names) expect(n.trim().length).toBeGreaterThan(1)
  })

  it('varje land hör till minst en världsdel', () => {
    for (const [name, c] of Object.entries(COUNTRIES)) expect(c.continents.length, name).toBeGreaterThan(0)
  })

  it('stämmer med beslutade specialfall', () => {
    expect(COUNTRIES.Russia.continents).toEqual(['europa', 'asien'])
    expect(COUNTRIES.Turkey.continents).toEqual(['europa', 'asien'])
    expect(COUNTRIES.Cyprus.continents).toEqual(['europa'])
    expect(COUNTRIES.Egypt.continents).toEqual(['afrika'])
    for (const n of ['Georgia', 'Armenia', 'Azerbaijan', 'Kazakhstan', 'Indonesia']) expect(COUNTRIES[n].continents).toEqual(['asien'])
    expect(COUNTRIES['Papua New Guinea'].continents).toEqual(['oceanien'])
    expect(COUNTRIES.Mexico.continents).toEqual(['nordamerika'])
    expect(MERGED_INTO['N. Cyprus']).toBe('Cyprus')
    expect(MERGED_INTO.Somaliland).toBe('Somalia')
    expect(TERRITORIES.Greenland).toEqual(['nordamerika'])
  })
})

describe.each(ALL_CONTINENTS)('kartan för %s', (continent) => {
  const map = buildContinentMap(topology, continent)
  const countries = map.shapes.filter((s) => s.kind === 'country')

  it(`har minst ${ROUND_LENGTH} länder att fråga om`, () => {
    expect(countries.length).toBeGreaterThanOrEqual(ROUND_LENGTH)
  })

  it('alla världsdelens länder syns på kartan', () => {
    const expected = Object.entries(COUNTRIES)
      .filter(([, c]) => c.continents.includes(continent))
      .map(([name]) => name)
    expect(countries.map((c) => c.id).sort()).toEqual(expected.sort())
  })

  it('inga länder från andra världsdelar är med', () => {
    for (const s of countries) expect(COUNTRIES[s.id].continents, s.id).toContain(continent)
  })

  it('varje land har en riktig form och rimlig storlek på kartan', () => {
    expect(map.view.width).toBeGreaterThan(100)
    expect(map.view.height).toBeGreaterThan(100)
    for (const s of map.shapes) {
      expect(s.d.length, s.id).toBeGreaterThan(10)
      expect(s.d, s.id).not.toMatch(/NaN/)
    }
  })

  it('pyttesmå länder har en ring som syns i kartans utsnitt', () => {
    const { x, y, width, height } = map.view
    for (const s of countries) {
      if (!s.tiny) continue
      const [cx, cy] = s.tiny
      expect(cx, s.id).toBeGreaterThanOrEqual(x)
      expect(cx, s.id).toBeLessThanOrEqual(x + width)
      expect(cy, s.id).toBeGreaterThanOrEqual(y)
      expect(cy, s.id).toBeLessThanOrEqual(y + height)
    }
  })

  it('varje land har en mittpunkt (för ringen som visar rätt svar)', () => {
    for (const s of countries) expect(s.center.every(Number.isFinite), s.id).toBe(true)
  })
})

describe('några kontroller av kartorna', () => {
  it('Europas mikrostater har ringar', () => {
    const europe = buildContinentMap(topology, 'europa')
    for (const id of ['Vatican', 'Monaco', 'San Marino', 'Malta', 'Liechtenstein']) {
      expect(europe.shapes.find((s) => s.id === id)?.tiny, id).not.toBeNull()
    }
    for (const id of ['Sweden', 'Germany', 'France']) {
      expect(europe.shapes.find((s) => s.id === id)?.tiny, id).toBeNull()
    }
  })

  it('Franska Guyana syns grått i Sydamerika, Grönland grått i Nordamerika', () => {
    expect(buildContinentMap(topology, 'sydamerika').shapes.find((s) => s.id === 'France')?.kind).toBe('territory')
    expect(buildContinentMap(topology, 'nordamerika').shapes.find((s) => s.id === 'Greenland')?.kind).toBe('territory')
  })
})

describe('nivåer', () => {
  it('varje land har nivå 1, 2 eller 3', () => {
    for (const [name, c] of Object.entries(COUNTRIES)) expect([1, 2, 3], name).toContain(c.level)
  })

  it('kända länder ligger på Lätt', () => {
    for (const n of ['Sweden', 'Norway', 'Germany', 'France', 'Russia', 'China', 'United States of America', 'Brazil', 'Australia', 'Egypt']) {
      expect(COUNTRIES[n].level, n).toBe(1)
    }
    for (const n of ['Vatican', 'Monaco', 'Liechtenstein', 'Nauru']) expect(COUNTRIES[n].level, n).toBe(3)
  })

  it.each(ALL_CONTINENTS)('%s: varje nivå ger 10 olika länder', (continent) => {
    const countries = buildContinentMap(topology, continent).shapes.filter((s) => s.kind === 'country')
    for (const level of LEVELS) {
      for (let i = 0; i < 50; i++) {
        const round = pickRoundCountries(countries, level)
        expect(round).toHaveLength(ROUND_LENGTH)
        expect(new Set(round.map((c) => c.id)).size).toBe(ROUND_LENGTH)
      }
    }
  })

  it('Europa: varje nivå frågar bara om sin nivås länder (det finns tillräckligt många)', () => {
    const countries = buildContinentMap(topology, 'europa').shapes.filter((s) => s.kind === 'country')
    const tiers = { latt: 1, medel: 2, svar: 3 } as const
    for (const level of LEVELS) {
      for (let i = 0; i < 50; i++) {
        for (const c of pickRoundCountries(countries, level)) expect(COUNTRIES[c.id].level, `${level}: ${c.id}`).toBe(tiers[level])
      }
    }
  })

  it('Sydamerika: för få länder på en nivå ⇒ alla nivåns länder är med och resten fylls på', () => {
    const countries = buildContinentMap(topology, 'sydamerika').shapes.filter((s) => s.kind === 'country')
    const levelOf = (ids: { id: string }[]) => ids.map((c) => COUNTRIES[c.id].level)
    const count = (arr: number[], t: number) => arr.filter((x) => x === t).length
    const hard = levelOf(pickRoundCountries(countries, 'svar'))
    expect(count(hard, 3)).toBe(2) // Guyana och Surinam
    expect(count(hard, 2)).toBe(4) // sedan nivån under
    const medium = levelOf(pickRoundCountries(countries, 'medel'))
    expect(count(medium, 2)).toBe(4)
    expect(count(medium, 1)).toBe(6)
  })
})
