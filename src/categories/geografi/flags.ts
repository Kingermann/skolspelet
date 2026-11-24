import type { Level } from '../../game/levels'
import { shuffle } from '../../game/random'
import { COUNTRIES, type Continent, type CountryLevel } from './countries'

/**
 * Grupper av flaggor som liknar varandra. På Medel och Svår blir felalternativen
 * helst länder ur samma grupp (och samma världsdel) – då måste man titta noga!
 * Ett land kan finnas i flera grupper. Lägg gärna till fler grupper.
 */
export const LOOKALIKE_GROUPS: string[][] = [
  // Nordiska kors
  ['Sweden', 'Norway', 'Denmark', 'Finland', 'Iceland'],
  // Röd och vit
  ['Poland', 'Indonesia', 'Monaco', 'Singapore', 'Malta', 'Austria', 'Latvia', 'Lebanon', 'Canada', 'Peru', 'Switzerland', 'Denmark'],
  // Tre lodräta ränder
  ['France', 'Italy', 'Ireland', 'Belgium', 'Romania', 'Moldova', 'Andorra', 'Mexico'],
  ['Chad', 'Romania', 'Mali', 'Guinea', 'Senegal', 'Cameroon', "Côte d'Ivoire", 'Nigeria'],
  ['Peru', 'Canada', 'Nigeria'],
  // Tre vågräta ränder
  ['Germany', 'Belgium', 'Netherlands', 'Luxembourg', 'Russia', 'Hungary', 'Bulgaria', 'Lithuania', 'Estonia', 'Armenia', 'Austria', 'Latvia'],
  ['Russia', 'Slovakia', 'Slovenia', 'Serbia', 'Croatia', 'Netherlands', 'Luxembourg', 'Czechia'],
  ['Sierra Leone', 'Gabon', 'Ghana', 'Ethiopia', 'Bolivia', 'Lithuania'],
  ['Colombia', 'Ecuador', 'Venezuela'],
  ['Argentina', 'Uruguay', 'Honduras', 'Nicaragua', 'El Salvador', 'Guatemala'],
  ['Chile', 'Cuba', 'Czechia', 'Philippines'],
  // Röd, vit, svart (och grön) – arabiska färger
  ['Egypt', 'Iraq', 'Syria', 'Yemen', 'Sudan', 'Jordan', 'Palestine', 'Kuwait', 'United Arab Emirates', 'Libya'],
  // Grön, gul, röd – afrikanska färger
  ['Ghana', 'Senegal', 'Mali', 'Guinea', 'Cameroon', 'Ethiopia', 'Benin', 'Togo', 'Burkina Faso', 'Guinea-Bissau', 'Congo'],
  // Röd flagga med stjärna eller halvmåne
  ['China', 'Vietnam', 'Turkey', 'Tunisia', 'Morocco', 'Kyrgyzstan'],
  ['Turkey', 'Tunisia', 'Algeria', 'Pakistan', 'Malaysia', 'Azerbaijan', 'Turkmenistan', 'Mauritania', 'Uzbekistan', 'Maldives'],
  // Röd cirkel
  ['Japan', 'Bangladesh', 'Palau', 'Laos', 'South Korea'],
  // Stjärnor och ränder
  ['United States of America', 'Liberia', 'Malaysia', 'Uruguay'],
  // Union Jack och stjärnor
  ['Australia', 'New Zealand', 'Fiji'],
  // Blått med stjärnor
  ['Micronesia', 'Nauru', 'Solomon Is.', 'Marshall Is.', 'Palau'],
  // Karibien
  ['Jamaica', 'St. Kitts and Nevis', 'Trinidad and Tobago', 'Bahamas', 'Saint Lucia', 'Grenada', 'Dominica', 'Barbados', 'Antigua and Barb.', 'St. Vin. and Gren.'],
  ['Dominican Rep.', 'Haiti', 'Panama', 'Costa Rica'],
  // Södra Afrika
  ['South Africa', 'Zimbabwe', 'Zambia', 'Malawi', 'Mozambique', 'Botswana', 'Namibia', 'Lesotho', 'eSwatini'],
  ['Kenya', 'Uganda', 'S. Sudan', 'Tanzania', 'Rwanda', 'Burundi'],
  // Centralasien och Kaukasus
  ['Kazakhstan', 'Kyrgyzstan', 'Tajikistan', 'Uzbekistan', 'Turkmenistan'],
  ['Georgia', 'Armenia', 'Azerbaijan'],
  // Balkan
  ['Serbia', 'Montenegro', 'Albania', 'Bosnia and Herz.', 'Kosovo', 'Macedonia', 'Croatia', 'Slovenia'],
  // Gulfen
  ['Qatar', 'Bahrain', 'Oman', 'United Arab Emirates', 'Kuwait', 'Saudi Arabia'],
]

export interface FlagCountry {
  /** Namnet i kartdatan (samma id som i kartspelet). */
  id: string
  sv: string
  iso: string
  level: CountryLevel
}

/** Alla länder i en världsdel som har en flagga. */
export function countriesIn(continent: Continent): FlagCountry[] {
  return Object.entries(COUNTRIES)
    .filter(([, c]) => c.continents.includes(continent))
    .map(([id, c]) => ({ id, sv: c.sv, iso: c.iso, level: c.level }))
}

/** Länder vars flaggor liknar landets flagga. */
export function lookalikesOf(id: string): Set<string> {
  const result = new Set<string>()
  for (const group of LOOKALIKE_GROUPS) if (group.includes(id)) group.forEach((g) => g !== id && result.add(g))
  return result
}

/** Hur många av de tre felalternativen som helst ska vara liknande flaggor. */
const LOOKALIKES_WANTED: Record<Level, number> = { latt: 0, medel: 2, svar: 3 }

/**
 * Fyra svarsalternativ: rätt land + tre fel från samma världsdel.
 * Lätt: andra kända länder med olika flaggor. Medel/Svår: helst liknande flaggor.
 */
export function makeFlagOptions(answer: FlagCountry, sameContinent: FlagCountry[], level: Level): FlagCountry[] {
  const others = sameContinent.filter((c) => c.id !== answer.id)
  const similar = lookalikesOf(answer.id)
  const wrong: FlagCountry[] = []
  const add = (pool: FlagCountry[], max = 3) => {
    for (const c of shuffle(pool)) {
      if (wrong.length >= max) break
      if (!wrong.some((w) => w.id === c.id)) wrong.push(c)
    }
  }

  if (level === 'latt') {
    // Kända länder med flaggor som INTE liknar den rätta.
    const different = others.filter((c) => !similar.has(c.id))
    add(different.filter((c) => c.level === 1))
    add(different.filter((c) => c.level === 2))
    add(different)
  } else {
    add(
      others.filter((c) => similar.has(c.id)),
      LOOKALIKES_WANTED[level],
    )
    const tier = level === 'medel' ? 2 : 3
    add(others.filter((c) => c.level === tier))
    add(others.filter((c) => Math.abs(c.level - tier) === 1))
  }
  add(others)

  return shuffle([answer, ...wrong])
}
