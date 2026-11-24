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
  /** Landskod (ISO 3166-1 alfa-2), används för att hitta flaggan. */
  iso: string
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
  Albania: { sv: 'Albanien', level: 3, iso: 'al', continents: EU },
  Andorra: { sv: 'Andorra', level: 3, iso: 'ad', continents: EU },
  Austria: { sv: 'Österrike', level: 2, iso: 'at', continents: EU },
  Belarus: { sv: 'Belarus', level: 2, iso: 'by', continents: EU },
  Belgium: { sv: 'Belgien', level: 2, iso: 'be', continents: EU },
  'Bosnia and Herz.': { sv: 'Bosnien och Hercegovina', level: 3, iso: 'ba', continents: EU },
  Bulgaria: { sv: 'Bulgarien', level: 2, iso: 'bg', continents: EU },
  Croatia: { sv: 'Kroatien', level: 2, iso: 'hr', continents: EU },
  Cyprus: { sv: 'Cypern', level: 2, iso: 'cy', continents: EU },
  Czechia: { sv: 'Tjeckien', level: 2, iso: 'cz', continents: EU },
  Denmark: { sv: 'Danmark', level: 1, iso: 'dk', continents: EU },
  Estonia: { sv: 'Estland', level: 2, iso: 'ee', continents: EU },
  Finland: { sv: 'Finland', level: 1, iso: 'fi', continents: EU },
  France: { sv: 'Frankrike', level: 1, iso: 'fr', continents: EU, greyIn: SA },
  Germany: { sv: 'Tyskland', level: 1, iso: 'de', continents: EU },
  Greece: { sv: 'Grekland', level: 1, iso: 'gr', continents: EU },
  Hungary: { sv: 'Ungern', level: 2, iso: 'hu', continents: EU },
  Iceland: { sv: 'Island', level: 1, iso: 'is', continents: EU },
  Ireland: { sv: 'Irland', level: 2, iso: 'ie', continents: EU },
  Italy: { sv: 'Italien', level: 1, iso: 'it', continents: EU },
  Kosovo: { sv: 'Kosovo', level: 3, iso: 'xk', continents: EU },
  Latvia: { sv: 'Lettland', level: 2, iso: 'lv', continents: EU },
  Liechtenstein: { sv: 'Liechtenstein', level: 3, iso: 'li', continents: EU },
  Lithuania: { sv: 'Litauen', level: 2, iso: 'lt', continents: EU },
  Luxembourg: { sv: 'Luxemburg', level: 3, iso: 'lu', continents: EU },
  Macedonia: { sv: 'Nordmakedonien', level: 3, iso: 'mk', continents: EU },
  Malta: { sv: 'Malta', level: 3, iso: 'mt', continents: EU },
  Moldova: { sv: 'Moldavien', level: 3, iso: 'md', continents: EU },
  Monaco: { sv: 'Monaco', level: 3, iso: 'mc', continents: EU },
  Montenegro: { sv: 'Montenegro', level: 3, iso: 'me', continents: EU },
  Netherlands: { sv: 'Nederländerna', level: 2, iso: 'nl', continents: EU },
  Norway: { sv: 'Norge', level: 1, iso: 'no', continents: EU },
  Poland: { sv: 'Polen', level: 1, iso: 'pl', continents: EU },
  Portugal: { sv: 'Portugal', level: 2, iso: 'pt', continents: EU },
  Romania: { sv: 'Rumänien', level: 2, iso: 'ro', continents: EU },
  Russia: { sv: 'Ryssland', level: 1, iso: 'ru', continents: ['europa', 'asien'] },
  'San Marino': { sv: 'San Marino', level: 3, iso: 'sm', continents: EU },
  Serbia: { sv: 'Serbien', level: 2, iso: 'rs', continents: EU },
  Slovakia: { sv: 'Slovakien', level: 2, iso: 'sk', continents: EU },
  Slovenia: { sv: 'Slovenien', level: 3, iso: 'si', continents: EU },
  Spain: { sv: 'Spanien', level: 1, iso: 'es', continents: EU },
  Sweden: { sv: 'Sverige', level: 1, iso: 'se', continents: EU },
  Switzerland: { sv: 'Schweiz', level: 2, iso: 'ch', continents: EU },
  Turkey: { sv: 'Turkiet', level: 1, iso: 'tr', continents: ['europa', 'asien'] },
  Ukraine: { sv: 'Ukraina', level: 1, iso: 'ua', continents: EU },
  'United Kingdom': { sv: 'Storbritannien', level: 1, iso: 'gb', continents: EU },
  Vatican: { sv: 'Vatikanstaten', level: 3, iso: 'va', continents: EU },

  // ---------- Asien ----------
  Afghanistan: { sv: 'Afghanistan', level: 2, iso: 'af', continents: AS },
  Armenia: { sv: 'Armenien', level: 3, iso: 'am', continents: AS },
  Azerbaijan: { sv: 'Azerbajdzjan', level: 3, iso: 'az', continents: AS },
  Bahrain: { sv: 'Bahrain', level: 3, iso: 'bh', continents: AS },
  Bangladesh: { sv: 'Bangladesh', level: 2, iso: 'bd', continents: AS },
  Bhutan: { sv: 'Bhutan', level: 3, iso: 'bt', continents: AS },
  Brunei: { sv: 'Brunei', level: 3, iso: 'bn', continents: AS },
  Cambodia: { sv: 'Kambodja', level: 2, iso: 'kh', continents: AS },
  China: { sv: 'Kina', level: 1, iso: 'cn', continents: AS },
  Georgia: { sv: 'Georgien', level: 2, iso: 'ge', continents: AS },
  India: { sv: 'Indien', level: 1, iso: 'in', continents: AS },
  Indonesia: { sv: 'Indonesien', level: 1, iso: 'id', continents: AS },
  Iran: { sv: 'Iran', level: 1, iso: 'ir', continents: AS },
  Iraq: { sv: 'Irak', level: 1, iso: 'iq', continents: AS },
  Israel: { sv: 'Israel', level: 2, iso: 'il', continents: AS },
  Japan: { sv: 'Japan', level: 1, iso: 'jp', continents: AS },
  Jordan: { sv: 'Jordanien', level: 2, iso: 'jo', continents: AS },
  Kazakhstan: { sv: 'Kazakstan', level: 1, iso: 'kz', continents: AS },
  Kuwait: { sv: 'Kuwait', level: 3, iso: 'kw', continents: AS },
  Kyrgyzstan: { sv: 'Kirgizistan', level: 3, iso: 'kg', continents: AS },
  Laos: { sv: 'Laos', level: 2, iso: 'la', continents: AS },
  Lebanon: { sv: 'Libanon', level: 3, iso: 'lb', continents: AS },
  Malaysia: { sv: 'Malaysia', level: 2, iso: 'my', continents: AS },
  Maldives: { sv: 'Maldiverna', level: 3, iso: 'mv', continents: AS },
  Mongolia: { sv: 'Mongoliet', level: 1, iso: 'mn', continents: AS },
  Myanmar: { sv: 'Myanmar', level: 2, iso: 'mm', continents: AS },
  Nepal: { sv: 'Nepal', level: 2, iso: 'np', continents: AS },
  'North Korea': { sv: 'Nordkorea', level: 2, iso: 'kp', continents: AS },
  Oman: { sv: 'Oman', level: 2, iso: 'om', continents: AS },
  Pakistan: { sv: 'Pakistan', level: 1, iso: 'pk', continents: AS },
  Palestine: { sv: 'Palestina', level: 3, iso: 'ps', continents: AS },
  Philippines: { sv: 'Filippinerna', level: 1, iso: 'ph', continents: AS },
  Qatar: { sv: 'Qatar', level: 3, iso: 'qa', continents: AS },
  'Saudi Arabia': { sv: 'Saudiarabien', level: 1, iso: 'sa', continents: AS },
  Singapore: { sv: 'Singapore', level: 3, iso: 'sg', continents: AS },
  'South Korea': { sv: 'Sydkorea', level: 1, iso: 'kr', continents: AS },
  'Sri Lanka': { sv: 'Sri Lanka', level: 2, iso: 'lk', continents: AS },
  Syria: { sv: 'Syrien', level: 2, iso: 'sy', continents: AS },
  Taiwan: { sv: 'Taiwan', level: 2, iso: 'tw', continents: AS },
  Tajikistan: { sv: 'Tadzjikistan', level: 3, iso: 'tj', continents: AS },
  Thailand: { sv: 'Thailand', level: 1, iso: 'th', continents: AS },
  'Timor-Leste': { sv: 'Östtimor', level: 3, iso: 'tl', continents: AS },
  Turkmenistan: { sv: 'Turkmenistan', level: 2, iso: 'tm', continents: AS },
  'United Arab Emirates': { sv: 'Förenade Arabemiraten', level: 2, iso: 'ae', continents: AS },
  Uzbekistan: { sv: 'Uzbekistan', level: 2, iso: 'uz', continents: AS },
  Vietnam: { sv: 'Vietnam', level: 1, iso: 'vn', continents: AS },
  Yemen: { sv: 'Jemen', level: 2, iso: 'ye', continents: AS },

  // ---------- Afrika ----------
  Algeria: { sv: 'Algeriet', level: 1, iso: 'dz', continents: AF },
  Angola: { sv: 'Angola', level: 2, iso: 'ao', continents: AF },
  Benin: { sv: 'Benin', level: 3, iso: 'bj', continents: AF },
  Botswana: { sv: 'Botswana', level: 2, iso: 'bw', continents: AF },
  'Burkina Faso': { sv: 'Burkina Faso', level: 3, iso: 'bf', continents: AF },
  Burundi: { sv: 'Burundi', level: 3, iso: 'bi', continents: AF },
  'Cabo Verde': { sv: 'Kap Verde', level: 3, iso: 'cv', continents: AF },
  Cameroon: { sv: 'Kamerun', level: 2, iso: 'cm', continents: AF },
  'Central African Rep.': { sv: 'Centralafrikanska republiken', level: 2, iso: 'cf', continents: AF },
  Chad: { sv: 'Tchad', level: 2, iso: 'td', continents: AF },
  Comoros: { sv: 'Komorerna', level: 3, iso: 'km', continents: AF },
  Congo: { sv: 'Kongo-Brazzaville', level: 2, iso: 'cg', continents: AF },
  "Côte d'Ivoire": { sv: 'Elfenbenskusten', level: 2, iso: 'ci', continents: AF },
  'Dem. Rep. Congo': { sv: 'Kongo-Kinshasa', level: 1, iso: 'cd', continents: AF },
  Djibouti: { sv: 'Djibouti', level: 3, iso: 'dj', continents: AF },
  Egypt: { sv: 'Egypten', level: 1, iso: 'eg', continents: AF },
  'Eq. Guinea': { sv: 'Ekvatorialguinea', level: 3, iso: 'gq', continents: AF },
  Eritrea: { sv: 'Eritrea', level: 2, iso: 'er', continents: AF },
  eSwatini: { sv: 'Eswatini', level: 3, iso: 'sz', continents: AF },
  Ethiopia: { sv: 'Etiopien', level: 1, iso: 'et', continents: AF },
  Gabon: { sv: 'Gabon', level: 2, iso: 'ga', continents: AF },
  Gambia: { sv: 'Gambia', level: 3, iso: 'gm', continents: AF },
  Ghana: { sv: 'Ghana', level: 2, iso: 'gh', continents: AF },
  Guinea: { sv: 'Guinea', level: 3, iso: 'gn', continents: AF },
  'Guinea-Bissau': { sv: 'Guinea-Bissau', level: 3, iso: 'gw', continents: AF },
  Kenya: { sv: 'Kenya', level: 1, iso: 'ke', continents: AF },
  Lesotho: { sv: 'Lesotho', level: 3, iso: 'ls', continents: AF },
  Liberia: { sv: 'Liberia', level: 3, iso: 'lr', continents: AF },
  Libya: { sv: 'Libyen', level: 1, iso: 'ly', continents: AF },
  Madagascar: { sv: 'Madagaskar', level: 1, iso: 'mg', continents: AF },
  Malawi: { sv: 'Malawi', level: 2, iso: 'mw', continents: AF },
  Mali: { sv: 'Mali', level: 2, iso: 'ml', continents: AF },
  Mauritania: { sv: 'Mauretanien', level: 2, iso: 'mr', continents: AF },
  Mauritius: { sv: 'Mauritius', level: 3, iso: 'mu', continents: AF },
  Morocco: { sv: 'Marocko', level: 1, iso: 'ma', continents: AF },
  Mozambique: { sv: 'Moçambique', level: 2, iso: 'mz', continents: AF },
  Namibia: { sv: 'Namibia', level: 2, iso: 'na', continents: AF },
  Niger: { sv: 'Niger', level: 2, iso: 'ne', continents: AF },
  Nigeria: { sv: 'Nigeria', level: 1, iso: 'ng', continents: AF },
  Rwanda: { sv: 'Rwanda', level: 3, iso: 'rw', continents: AF },
  'São Tomé and Principe': { sv: 'São Tomé och Príncipe', level: 3, iso: 'st', continents: AF },
  Senegal: { sv: 'Senegal', level: 2, iso: 'sn', continents: AF },
  Seychelles: { sv: 'Seychellerna', level: 3, iso: 'sc', continents: AF },
  'Sierra Leone': { sv: 'Sierra Leone', level: 3, iso: 'sl', continents: AF },
  Somalia: { sv: 'Somalia', level: 1, iso: 'so', continents: AF },
  'South Africa': { sv: 'Sydafrika', level: 1, iso: 'za', continents: AF },
  'S. Sudan': { sv: 'Sydsudan', level: 2, iso: 'ss', continents: AF },
  Sudan: { sv: 'Sudan', level: 1, iso: 'sd', continents: AF },
  Tanzania: { sv: 'Tanzania', level: 1, iso: 'tz', continents: AF },
  Togo: { sv: 'Togo', level: 3, iso: 'tg', continents: AF },
  Tunisia: { sv: 'Tunisien', level: 2, iso: 'tn', continents: AF },
  Uganda: { sv: 'Uganda', level: 2, iso: 'ug', continents: AF },
  Zambia: { sv: 'Zambia', level: 2, iso: 'zm', continents: AF },
  Zimbabwe: { sv: 'Zimbabwe', level: 2, iso: 'zw', continents: AF },

  // ---------- Nordamerika (med Centralamerika och Karibien) ----------
  'Antigua and Barb.': { sv: 'Antigua och Barbuda', level: 3, iso: 'ag', continents: NA },
  Bahamas: { sv: 'Bahamas', level: 2, iso: 'bs', continents: NA },
  Barbados: { sv: 'Barbados', level: 3, iso: 'bb', continents: NA },
  Belize: { sv: 'Belize', level: 2, iso: 'bz', continents: NA },
  Canada: { sv: 'Kanada', level: 1, iso: 'ca', continents: NA },
  'Costa Rica': { sv: 'Costa Rica', level: 1, iso: 'cr', continents: NA },
  Cuba: { sv: 'Kuba', level: 1, iso: 'cu', continents: NA },
  Dominica: { sv: 'Dominica', level: 3, iso: 'dm', continents: NA },
  'Dominican Rep.': { sv: 'Dominikanska republiken', level: 2, iso: 'do', continents: NA },
  'El Salvador': { sv: 'El Salvador', level: 2, iso: 'sv', continents: NA },
  Grenada: { sv: 'Grenada', level: 3, iso: 'gd', continents: NA },
  Guatemala: { sv: 'Guatemala', level: 2, iso: 'gt', continents: NA },
  Haiti: { sv: 'Haiti', level: 2, iso: 'ht', continents: NA },
  Honduras: { sv: 'Honduras', level: 2, iso: 'hn', continents: NA },
  Jamaica: { sv: 'Jamaica', level: 1, iso: 'jm', continents: NA },
  Mexico: { sv: 'Mexiko', level: 1, iso: 'mx', continents: NA },
  Nicaragua: { sv: 'Nicaragua', level: 2, iso: 'ni', continents: NA },
  Panama: { sv: 'Panama', level: 1, iso: 'pa', continents: NA },
  'St. Kitts and Nevis': { sv: 'Saint Kitts och Nevis', level: 3, iso: 'kn', continents: NA },
  'Saint Lucia': { sv: 'Saint Lucia', level: 3, iso: 'lc', continents: NA },
  'St. Vin. and Gren.': { sv: 'Saint Vincent och Grenadinerna', level: 3, iso: 'vc', continents: NA },
  'Trinidad and Tobago': { sv: 'Trinidad och Tobago', level: 3, iso: 'tt', continents: NA },
  'United States of America': { sv: 'USA', level: 1, iso: 'us', continents: NA },

  // ---------- Sydamerika ----------
  Argentina: { sv: 'Argentina', level: 1, iso: 'ar', continents: SA },
  Bolivia: { sv: 'Bolivia', level: 2, iso: 'bo', continents: SA },
  Brazil: { sv: 'Brasilien', level: 1, iso: 'br', continents: SA },
  Chile: { sv: 'Chile', level: 1, iso: 'cl', continents: SA },
  Colombia: { sv: 'Colombia', level: 1, iso: 'co', continents: SA },
  Ecuador: { sv: 'Ecuador', level: 2, iso: 'ec', continents: SA },
  Guyana: { sv: 'Guyana', level: 3, iso: 'gy', continents: SA },
  Paraguay: { sv: 'Paraguay', level: 2, iso: 'py', continents: SA },
  Peru: { sv: 'Peru', level: 1, iso: 'pe', continents: SA },
  Suriname: { sv: 'Surinam', level: 3, iso: 'sr', continents: SA },
  Uruguay: { sv: 'Uruguay', level: 2, iso: 'uy', continents: SA },
  Venezuela: { sv: 'Venezuela', level: 1, iso: 've', continents: SA },

  // ---------- Oceanien ----------
  Australia: { sv: 'Australien', level: 1, iso: 'au', continents: OC },
  Fiji: { sv: 'Fiji', level: 2, iso: 'fj', continents: OC },
  Kiribati: { sv: 'Kiribati', level: 3, iso: 'ki', continents: OC },
  'Marshall Is.': { sv: 'Marshallöarna', level: 3, iso: 'mh', continents: OC },
  Micronesia: { sv: 'Mikronesien', level: 3, iso: 'fm', continents: OC },
  Nauru: { sv: 'Nauru', level: 3, iso: 'nr', continents: OC },
  'New Zealand': { sv: 'Nya Zeeland', level: 1, iso: 'nz', continents: OC },
  Palau: { sv: 'Palau', level: 3, iso: 'pw', continents: OC },
  'Papua New Guinea': { sv: 'Papua Nya Guinea', level: 1, iso: 'pg', continents: OC },
  Samoa: { sv: 'Samoa', level: 2, iso: 'ws', continents: OC },
  'Solomon Is.': { sv: 'Salomonöarna', level: 2, iso: 'sb', continents: OC },
  Tonga: { sv: 'Tonga', level: 2, iso: 'to', continents: OC },
  Vanuatu: { sv: 'Vanuatu', level: 2, iso: 'vu', continents: OC },
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
