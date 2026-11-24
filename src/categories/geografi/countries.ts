/**
 * Länder och världsdelar för kartspelet.
 *
 * Nycklarna är namnen i kartdatan (Natural Earth via paketet world-atlas, på engelska).
 * Här kan ni ändra svenska namn eller vilken världsdel ett land hör till.
 */

export type Continent = 'europa' | 'asien' | 'afrika' | 'nordamerika' | 'sydamerika' | 'oceanien'

export interface ContinentInfo {
  name: string
  icon: string
  color: string
  /** Kartans utsnitt: [[västligaste longitud, sydligaste latitud], [östligaste, nordligaste]]. */
  bounds: [[number, number], [number, number]]
}

export const CONTINENTS: Record<Continent, ContinentInfo> = {
  europa: { name: 'Europa', icon: '🏰', color: '#3da5ff', bounds: [[-25, 34], [45, 71.5]] },
  asien: { name: 'Asien', icon: '🐼', color: '#ff6f91', bounds: [[25, -11], [150, 78]] },
  afrika: { name: 'Afrika', icon: '🦁', color: '#ff9f1c', bounds: [[-26, -36], [64, 38]] },
  nordamerika: { name: 'Nordamerika', icon: '🦅', color: '#2ec27e', bounds: [[-170, 6], [-10, 84]] },
  sydamerika: { name: 'Sydamerika', icon: '🦜', color: '#9b5cff', bounds: [[-92, -56], [-34, 13]] },
  oceanien: { name: 'Oceanien', icon: '🦘', color: '#ffb703', bounds: [[110, -48], [190, 15]] },
}

/** 1 = Lätt (stora och kända), 2 = Medel (lite mindre), 3 = Svår (små och kluriga). */
export type CountryLevel = 1 | 2 | 3

export interface CountryInfo {
  /** Svenskt namn. */
  sv: string
  /** Vilken nivå landet är en fråga på. Flytta gärna länder mellan nivåerna! */
  level: CountryLevel
  /** Världsdel(ar) där landet är en fråga. */
  continents: Continent[]
  /** Världsdelar där delar av landet syns som grått område (t.ex. Franska Guyana). */
  greyIn?: Continent[]
}

const EU: Continent[] = ['europa']
const AS: Continent[] = ['asien']
const AF: Continent[] = ['afrika']
const NA: Continent[] = ['nordamerika']
const SA: Continent[] = ['sydamerika']
const OC: Continent[] = ['oceanien']

export const COUNTRIES: Record<string, CountryInfo> = {
  // ---------- Europa ----------
  Albania: { sv: 'Albanien', level: 3, continents: EU },
  Andorra: { sv: 'Andorra', level: 3, continents: EU },
  Austria: { sv: 'Österrike', level: 2, continents: EU },
  Belarus: { sv: 'Belarus', level: 2, continents: EU },
  Belgium: { sv: 'Belgien', level: 2, continents: EU },
  'Bosnia and Herz.': { sv: 'Bosnien och Hercegovina', level: 3, continents: EU },
  Bulgaria: { sv: 'Bulgarien', level: 2, continents: EU },
  Croatia: { sv: 'Kroatien', level: 2, continents: EU },
  Cyprus: { sv: 'Cypern', level: 2, continents: EU },
  Czechia: { sv: 'Tjeckien', level: 2, continents: EU },
  Denmark: { sv: 'Danmark', level: 1, continents: EU },
  Estonia: { sv: 'Estland', level: 2, continents: EU },
  Finland: { sv: 'Finland', level: 1, continents: EU },
  France: { sv: 'Frankrike', level: 1, continents: EU, greyIn: SA },
  Germany: { sv: 'Tyskland', level: 1, continents: EU },
  Greece: { sv: 'Grekland', level: 1, continents: EU },
  Hungary: { sv: 'Ungern', level: 2, continents: EU },
  Iceland: { sv: 'Island', level: 1, continents: EU },
  Ireland: { sv: 'Irland', level: 2, continents: EU },
  Italy: { sv: 'Italien', level: 1, continents: EU },
  Kosovo: { sv: 'Kosovo', level: 3, continents: EU },
  Latvia: { sv: 'Lettland', level: 2, continents: EU },
  Liechtenstein: { sv: 'Liechtenstein', level: 3, continents: EU },
  Lithuania: { sv: 'Litauen', level: 2, continents: EU },
  Luxembourg: { sv: 'Luxemburg', level: 3, continents: EU },
  Macedonia: { sv: 'Nordmakedonien', level: 3, continents: EU },
  Malta: { sv: 'Malta', level: 3, continents: EU },
  Moldova: { sv: 'Moldavien', level: 3, continents: EU },
  Monaco: { sv: 'Monaco', level: 3, continents: EU },
  Montenegro: { sv: 'Montenegro', level: 3, continents: EU },
  Netherlands: { sv: 'Nederländerna', level: 2, continents: EU },
  Norway: { sv: 'Norge', level: 1, continents: EU },
  Poland: { sv: 'Polen', level: 1, continents: EU },
  Portugal: { sv: 'Portugal', level: 2, continents: EU },
  Romania: { sv: 'Rumänien', level: 2, continents: EU },
  Russia: { sv: 'Ryssland', level: 1, continents: ['europa', 'asien'] },
  'San Marino': { sv: 'San Marino', level: 3, continents: EU },
  Serbia: { sv: 'Serbien', level: 2, continents: EU },
  Slovakia: { sv: 'Slovakien', level: 2, continents: EU },
  Slovenia: { sv: 'Slovenien', level: 3, continents: EU },
  Spain: { sv: 'Spanien', level: 1, continents: EU },
  Sweden: { sv: 'Sverige', level: 1, continents: EU },
  Switzerland: { sv: 'Schweiz', level: 2, continents: EU },
  Turkey: { sv: 'Turkiet', level: 1, continents: ['europa', 'asien'] },
  Ukraine: { sv: 'Ukraina', level: 1, continents: EU },
  'United Kingdom': { sv: 'Storbritannien', level: 1, continents: EU },
  Vatican: { sv: 'Vatikanstaten', level: 3, continents: EU },

  // ---------- Asien ----------
  Afghanistan: { sv: 'Afghanistan', level: 2, continents: AS },
  Armenia: { sv: 'Armenien', level: 3, continents: AS },
  Azerbaijan: { sv: 'Azerbajdzjan', level: 3, continents: AS },
  Bahrain: { sv: 'Bahrain', level: 3, continents: AS },
  Bangladesh: { sv: 'Bangladesh', level: 2, continents: AS },
  Bhutan: { sv: 'Bhutan', level: 3, continents: AS },
  Brunei: { sv: 'Brunei', level: 3, continents: AS },
  Cambodia: { sv: 'Kambodja', level: 2, continents: AS },
  China: { sv: 'Kina', level: 1, continents: AS },
  Georgia: { sv: 'Georgien', level: 2, continents: AS },
  India: { sv: 'Indien', level: 1, continents: AS },
  Indonesia: { sv: 'Indonesien', level: 1, continents: AS },
  Iran: { sv: 'Iran', level: 1, continents: AS },
  Iraq: { sv: 'Irak', level: 1, continents: AS },
  Israel: { sv: 'Israel', level: 2, continents: AS },
  Japan: { sv: 'Japan', level: 1, continents: AS },
  Jordan: { sv: 'Jordanien', level: 2, continents: AS },
  Kazakhstan: { sv: 'Kazakstan', level: 1, continents: AS },
  Kuwait: { sv: 'Kuwait', level: 3, continents: AS },
  Kyrgyzstan: { sv: 'Kirgizistan', level: 3, continents: AS },
  Laos: { sv: 'Laos', level: 2, continents: AS },
  Lebanon: { sv: 'Libanon', level: 3, continents: AS },
  Malaysia: { sv: 'Malaysia', level: 2, continents: AS },
  Maldives: { sv: 'Maldiverna', level: 3, continents: AS },
  Mongolia: { sv: 'Mongoliet', level: 1, continents: AS },
  Myanmar: { sv: 'Myanmar', level: 2, continents: AS },
  Nepal: { sv: 'Nepal', level: 2, continents: AS },
  'North Korea': { sv: 'Nordkorea', level: 2, continents: AS },
  Oman: { sv: 'Oman', level: 2, continents: AS },
  Pakistan: { sv: 'Pakistan', level: 1, continents: AS },
  Palestine: { sv: 'Palestina', level: 3, continents: AS },
  Philippines: { sv: 'Filippinerna', level: 1, continents: AS },
  Qatar: { sv: 'Qatar', level: 3, continents: AS },
  'Saudi Arabia': { sv: 'Saudiarabien', level: 1, continents: AS },
  Singapore: { sv: 'Singapore', level: 3, continents: AS },
  'South Korea': { sv: 'Sydkorea', level: 1, continents: AS },
  'Sri Lanka': { sv: 'Sri Lanka', level: 2, continents: AS },
  Syria: { sv: 'Syrien', level: 2, continents: AS },
  Taiwan: { sv: 'Taiwan', level: 2, continents: AS },
  Tajikistan: { sv: 'Tadzjikistan', level: 3, continents: AS },
  Thailand: { sv: 'Thailand', level: 1, continents: AS },
  'Timor-Leste': { sv: 'Östtimor', level: 3, continents: AS },
  Turkmenistan: { sv: 'Turkmenistan', level: 2, continents: AS },
  'United Arab Emirates': { sv: 'Förenade Arabemiraten', level: 2, continents: AS },
  Uzbekistan: { sv: 'Uzbekistan', level: 2, continents: AS },
  Vietnam: { sv: 'Vietnam', level: 1, continents: AS },
  Yemen: { sv: 'Jemen', level: 2, continents: AS },

  // ---------- Afrika ----------
  Algeria: { sv: 'Algeriet', level: 1, continents: AF },
  Angola: { sv: 'Angola', level: 2, continents: AF },
  Benin: { sv: 'Benin', level: 3, continents: AF },
  Botswana: { sv: 'Botswana', level: 2, continents: AF },
  'Burkina Faso': { sv: 'Burkina Faso', level: 3, continents: AF },
  Burundi: { sv: 'Burundi', level: 3, continents: AF },
  'Cabo Verde': { sv: 'Kap Verde', level: 3, continents: AF },
  Cameroon: { sv: 'Kamerun', level: 2, continents: AF },
  'Central African Rep.': { sv: 'Centralafrikanska republiken', level: 2, continents: AF },
  Chad: { sv: 'Tchad', level: 2, continents: AF },
  Comoros: { sv: 'Komorerna', level: 3, continents: AF },
  Congo: { sv: 'Kongo-Brazzaville', level: 2, continents: AF },
  "Côte d'Ivoire": { sv: 'Elfenbenskusten', level: 2, continents: AF },
  'Dem. Rep. Congo': { sv: 'Kongo-Kinshasa', level: 1, continents: AF },
  Djibouti: { sv: 'Djibouti', level: 3, continents: AF },
  Egypt: { sv: 'Egypten', level: 1, continents: AF },
  'Eq. Guinea': { sv: 'Ekvatorialguinea', level: 3, continents: AF },
  Eritrea: { sv: 'Eritrea', level: 2, continents: AF },
  eSwatini: { sv: 'Eswatini', level: 3, continents: AF },
  Ethiopia: { sv: 'Etiopien', level: 1, continents: AF },
  Gabon: { sv: 'Gabon', level: 2, continents: AF },
  Gambia: { sv: 'Gambia', level: 3, continents: AF },
  Ghana: { sv: 'Ghana', level: 2, continents: AF },
  Guinea: { sv: 'Guinea', level: 3, continents: AF },
  'Guinea-Bissau': { sv: 'Guinea-Bissau', level: 3, continents: AF },
  Kenya: { sv: 'Kenya', level: 1, continents: AF },
  Lesotho: { sv: 'Lesotho', level: 3, continents: AF },
  Liberia: { sv: 'Liberia', level: 3, continents: AF },
  Libya: { sv: 'Libyen', level: 1, continents: AF },
  Madagascar: { sv: 'Madagaskar', level: 1, continents: AF },
  Malawi: { sv: 'Malawi', level: 2, continents: AF },
  Mali: { sv: 'Mali', level: 2, continents: AF },
  Mauritania: { sv: 'Mauretanien', level: 2, continents: AF },
  Mauritius: { sv: 'Mauritius', level: 3, continents: AF },
  Morocco: { sv: 'Marocko', level: 1, continents: AF },
  Mozambique: { sv: 'Moçambique', level: 2, continents: AF },
  Namibia: { sv: 'Namibia', level: 2, continents: AF },
  Niger: { sv: 'Niger', level: 2, continents: AF },
  Nigeria: { sv: 'Nigeria', level: 1, continents: AF },
  Rwanda: { sv: 'Rwanda', level: 3, continents: AF },
  'São Tomé and Principe': { sv: 'São Tomé och Príncipe', level: 3, continents: AF },
  Senegal: { sv: 'Senegal', level: 2, continents: AF },
  Seychelles: { sv: 'Seychellerna', level: 3, continents: AF },
  'Sierra Leone': { sv: 'Sierra Leone', level: 3, continents: AF },
  Somalia: { sv: 'Somalia', level: 1, continents: AF },
  'South Africa': { sv: 'Sydafrika', level: 1, continents: AF },
  'S. Sudan': { sv: 'Sydsudan', level: 2, continents: AF },
  Sudan: { sv: 'Sudan', level: 1, continents: AF },
  Tanzania: { sv: 'Tanzania', level: 1, continents: AF },
  Togo: { sv: 'Togo', level: 3, continents: AF },
  Tunisia: { sv: 'Tunisien', level: 2, continents: AF },
  Uganda: { sv: 'Uganda', level: 2, continents: AF },
  Zambia: { sv: 'Zambia', level: 2, continents: AF },
  Zimbabwe: { sv: 'Zimbabwe', level: 2, continents: AF },

  // ---------- Nordamerika (med Centralamerika och Karibien) ----------
  'Antigua and Barb.': { sv: 'Antigua och Barbuda', level: 3, continents: NA },
  Bahamas: { sv: 'Bahamas', level: 2, continents: NA },
  Barbados: { sv: 'Barbados', level: 3, continents: NA },
  Belize: { sv: 'Belize', level: 2, continents: NA },
  Canada: { sv: 'Kanada', level: 1, continents: NA },
  'Costa Rica': { sv: 'Costa Rica', level: 1, continents: NA },
  Cuba: { sv: 'Kuba', level: 1, continents: NA },
  Dominica: { sv: 'Dominica', level: 3, continents: NA },
  'Dominican Rep.': { sv: 'Dominikanska republiken', level: 2, continents: NA },
  'El Salvador': { sv: 'El Salvador', level: 2, continents: NA },
  Grenada: { sv: 'Grenada', level: 3, continents: NA },
  Guatemala: { sv: 'Guatemala', level: 2, continents: NA },
  Haiti: { sv: 'Haiti', level: 2, continents: NA },
  Honduras: { sv: 'Honduras', level: 2, continents: NA },
  Jamaica: { sv: 'Jamaica', level: 1, continents: NA },
  Mexico: { sv: 'Mexiko', level: 1, continents: NA },
  Nicaragua: { sv: 'Nicaragua', level: 2, continents: NA },
  Panama: { sv: 'Panama', level: 1, continents: NA },
  'St. Kitts and Nevis': { sv: 'Saint Kitts och Nevis', level: 3, continents: NA },
  'Saint Lucia': { sv: 'Saint Lucia', level: 3, continents: NA },
  'St. Vin. and Gren.': { sv: 'Saint Vincent och Grenadinerna', level: 3, continents: NA },
  'Trinidad and Tobago': { sv: 'Trinidad och Tobago', level: 3, continents: NA },
  'United States of America': { sv: 'USA', level: 1, continents: NA },

  // ---------- Sydamerika ----------
  Argentina: { sv: 'Argentina', level: 1, continents: SA },
  Bolivia: { sv: 'Bolivia', level: 2, continents: SA },
  Brazil: { sv: 'Brasilien', level: 1, continents: SA },
  Chile: { sv: 'Chile', level: 1, continents: SA },
  Colombia: { sv: 'Colombia', level: 1, continents: SA },
  Ecuador: { sv: 'Ecuador', level: 2, continents: SA },
  Guyana: { sv: 'Guyana', level: 3, continents: SA },
  Paraguay: { sv: 'Paraguay', level: 2, continents: SA },
  Peru: { sv: 'Peru', level: 1, continents: SA },
  Suriname: { sv: 'Surinam', level: 3, continents: SA },
  Uruguay: { sv: 'Uruguay', level: 2, continents: SA },
  Venezuela: { sv: 'Venezuela', level: 1, continents: SA },

  // ---------- Oceanien ----------
  Australia: { sv: 'Australien', level: 1, continents: OC },
  Fiji: { sv: 'Fiji', level: 2, continents: OC },
  Kiribati: { sv: 'Kiribati', level: 3, continents: OC },
  'Marshall Is.': { sv: 'Marshallöarna', level: 3, continents: OC },
  Micronesia: { sv: 'Mikronesien', level: 3, continents: OC },
  Nauru: { sv: 'Nauru', level: 3, continents: OC },
  'New Zealand': { sv: 'Nya Zeeland', level: 1, continents: OC },
  Palau: { sv: 'Palau', level: 3, continents: OC },
  'Papua New Guinea': { sv: 'Papua Nya Guinea', level: 1, continents: OC },
  Samoa: { sv: 'Samoa', level: 2, continents: OC },
  'Solomon Is.': { sv: 'Salomonöarna', level: 2, continents: OC },
  Tonga: { sv: 'Tonga', level: 2, continents: OC },
  Vanuatu: { sv: 'Vanuatu', level: 2, continents: OC },
}

/** Områden som räknas som en del av ett annat land (att trycka där räknas som det landet). */
export const MERGED_INTO: Record<string, string> = {
  'N. Cyprus': 'Cyprus',
  Somaliland: 'Somalia',
  Åland: 'Finland',
  'Hong Kong': 'China',
  Macao: 'China',
}

/** Områden som inte är egna länder: visas grått och går inte att klicka på. */
export const TERRITORIES: Record<string, Continent[]> = {
  // Europa
  'Faeroe Is.': EU,
  Guernsey: EU,
  Jersey: EU,
  'Isle of Man': EU,
  // Asien
  'Siachen Glacier': AS,
  'Br. Indian Ocean Ter.': AS,
  'Indian Ocean Ter.': AS,
  // Afrika
  'W. Sahara': AF,
  'Saint Helena': AF,
  // Nordamerika
  Greenland: NA,
  'Puerto Rico': NA,
  Anguilla: NA,
  Aruba: NA,
  Bermuda: NA,
  'British Virgin Is.': NA,
  'Cayman Is.': NA,
  Curaçao: NA,
  Montserrat: NA,
  'Sint Maarten': NA,
  'St-Barthélemy': NA,
  'St-Martin': NA,
  'St. Pierre and Miquelon': NA,
  'Turks and Caicos Is.': NA,
  'U.S. Virgin Is.': NA,
  // Sydamerika
  'Falkland Is.': SA,
  'S. Geo. and the Is.': SA,
  // Oceanien
  'New Caledonia': OC,
  'Fr. Polynesia': OC,
  'American Samoa': OC,
  'Cook Is.': OC,
  Guam: OC,
  'N. Mariana Is.': OC,
  Niue: OC,
  'Norfolk Island': OC,
  'Pitcairn Is.': OC,
  'Wallis and Futuna Is.': OC,
  'Ashmore and Cartier Is.': OC,
}

/** Områden som aldrig visas (Antarktis med öar). */
export const IGNORED = ['Antarctica', 'Fr. S. Antarctic Lands', 'Heard I. and McDonald Is.']
