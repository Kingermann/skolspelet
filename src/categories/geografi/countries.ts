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

export interface CountryInfo {
  /** Svenskt namn. */
  sv: string
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
  Albania: { sv: 'Albanien', continents: EU },
  Andorra: { sv: 'Andorra', continents: EU },
  Austria: { sv: 'Österrike', continents: EU },
  Belarus: { sv: 'Belarus', continents: EU },
  Belgium: { sv: 'Belgien', continents: EU },
  'Bosnia and Herz.': { sv: 'Bosnien och Hercegovina', continents: EU },
  Bulgaria: { sv: 'Bulgarien', continents: EU },
  Croatia: { sv: 'Kroatien', continents: EU },
  Cyprus: { sv: 'Cypern', continents: EU },
  Czechia: { sv: 'Tjeckien', continents: EU },
  Denmark: { sv: 'Danmark', continents: EU },
  Estonia: { sv: 'Estland', continents: EU },
  Finland: { sv: 'Finland', continents: EU },
  France: { sv: 'Frankrike', continents: EU, greyIn: SA },
  Germany: { sv: 'Tyskland', continents: EU },
  Greece: { sv: 'Grekland', continents: EU },
  Hungary: { sv: 'Ungern', continents: EU },
  Iceland: { sv: 'Island', continents: EU },
  Ireland: { sv: 'Irland', continents: EU },
  Italy: { sv: 'Italien', continents: EU },
  Kosovo: { sv: 'Kosovo', continents: EU },
  Latvia: { sv: 'Lettland', continents: EU },
  Liechtenstein: { sv: 'Liechtenstein', continents: EU },
  Lithuania: { sv: 'Litauen', continents: EU },
  Luxembourg: { sv: 'Luxemburg', continents: EU },
  Macedonia: { sv: 'Nordmakedonien', continents: EU },
  Malta: { sv: 'Malta', continents: EU },
  Moldova: { sv: 'Moldavien', continents: EU },
  Monaco: { sv: 'Monaco', continents: EU },
  Montenegro: { sv: 'Montenegro', continents: EU },
  Netherlands: { sv: 'Nederländerna', continents: EU },
  Norway: { sv: 'Norge', continents: EU },
  Poland: { sv: 'Polen', continents: EU },
  Portugal: { sv: 'Portugal', continents: EU },
  Romania: { sv: 'Rumänien', continents: EU },
  Russia: { sv: 'Ryssland', continents: ['europa', 'asien'] },
  'San Marino': { sv: 'San Marino', continents: EU },
  Serbia: { sv: 'Serbien', continents: EU },
  Slovakia: { sv: 'Slovakien', continents: EU },
  Slovenia: { sv: 'Slovenien', continents: EU },
  Spain: { sv: 'Spanien', continents: EU },
  Sweden: { sv: 'Sverige', continents: EU },
  Switzerland: { sv: 'Schweiz', continents: EU },
  Turkey: { sv: 'Turkiet', continents: ['europa', 'asien'] },
  Ukraine: { sv: 'Ukraina', continents: EU },
  'United Kingdom': { sv: 'Storbritannien', continents: EU },
  Vatican: { sv: 'Vatikanstaten', continents: EU },

  // ---------- Asien ----------
  Afghanistan: { sv: 'Afghanistan', continents: AS },
  Armenia: { sv: 'Armenien', continents: AS },
  Azerbaijan: { sv: 'Azerbajdzjan', continents: AS },
  Bahrain: { sv: 'Bahrain', continents: AS },
  Bangladesh: { sv: 'Bangladesh', continents: AS },
  Bhutan: { sv: 'Bhutan', continents: AS },
  Brunei: { sv: 'Brunei', continents: AS },
  Cambodia: { sv: 'Kambodja', continents: AS },
  China: { sv: 'Kina', continents: AS },
  Georgia: { sv: 'Georgien', continents: AS },
  India: { sv: 'Indien', continents: AS },
  Indonesia: { sv: 'Indonesien', continents: AS },
  Iran: { sv: 'Iran', continents: AS },
  Iraq: { sv: 'Irak', continents: AS },
  Israel: { sv: 'Israel', continents: AS },
  Japan: { sv: 'Japan', continents: AS },
  Jordan: { sv: 'Jordanien', continents: AS },
  Kazakhstan: { sv: 'Kazakstan', continents: AS },
  Kuwait: { sv: 'Kuwait', continents: AS },
  Kyrgyzstan: { sv: 'Kirgizistan', continents: AS },
  Laos: { sv: 'Laos', continents: AS },
  Lebanon: { sv: 'Libanon', continents: AS },
  Malaysia: { sv: 'Malaysia', continents: AS },
  Maldives: { sv: 'Maldiverna', continents: AS },
  Mongolia: { sv: 'Mongoliet', continents: AS },
  Myanmar: { sv: 'Myanmar', continents: AS },
  Nepal: { sv: 'Nepal', continents: AS },
  'North Korea': { sv: 'Nordkorea', continents: AS },
  Oman: { sv: 'Oman', continents: AS },
  Pakistan: { sv: 'Pakistan', continents: AS },
  Palestine: { sv: 'Palestina', continents: AS },
  Philippines: { sv: 'Filippinerna', continents: AS },
  Qatar: { sv: 'Qatar', continents: AS },
  'Saudi Arabia': { sv: 'Saudiarabien', continents: AS },
  Singapore: { sv: 'Singapore', continents: AS },
  'South Korea': { sv: 'Sydkorea', continents: AS },
  'Sri Lanka': { sv: 'Sri Lanka', continents: AS },
  Syria: { sv: 'Syrien', continents: AS },
  Taiwan: { sv: 'Taiwan', continents: AS },
  Tajikistan: { sv: 'Tadzjikistan', continents: AS },
  Thailand: { sv: 'Thailand', continents: AS },
  'Timor-Leste': { sv: 'Östtimor', continents: AS },
  Turkmenistan: { sv: 'Turkmenistan', continents: AS },
  'United Arab Emirates': { sv: 'Förenade Arabemiraten', continents: AS },
  Uzbekistan: { sv: 'Uzbekistan', continents: AS },
  Vietnam: { sv: 'Vietnam', continents: AS },
  Yemen: { sv: 'Jemen', continents: AS },

  // ---------- Afrika ----------
  Algeria: { sv: 'Algeriet', continents: AF },
  Angola: { sv: 'Angola', continents: AF },
  Benin: { sv: 'Benin', continents: AF },
  Botswana: { sv: 'Botswana', continents: AF },
  'Burkina Faso': { sv: 'Burkina Faso', continents: AF },
  Burundi: { sv: 'Burundi', continents: AF },
  'Cabo Verde': { sv: 'Kap Verde', continents: AF },
  Cameroon: { sv: 'Kamerun', continents: AF },
  'Central African Rep.': { sv: 'Centralafrikanska republiken', continents: AF },
  Chad: { sv: 'Tchad', continents: AF },
  Comoros: { sv: 'Komorerna', continents: AF },
  Congo: { sv: 'Kongo-Brazzaville', continents: AF },
  "Côte d'Ivoire": { sv: 'Elfenbenskusten', continents: AF },
  'Dem. Rep. Congo': { sv: 'Kongo-Kinshasa', continents: AF },
  Djibouti: { sv: 'Djibouti', continents: AF },
  Egypt: { sv: 'Egypten', continents: AF },
  'Eq. Guinea': { sv: 'Ekvatorialguinea', continents: AF },
  Eritrea: { sv: 'Eritrea', continents: AF },
  eSwatini: { sv: 'Eswatini', continents: AF },
  Ethiopia: { sv: 'Etiopien', continents: AF },
  Gabon: { sv: 'Gabon', continents: AF },
  Gambia: { sv: 'Gambia', continents: AF },
  Ghana: { sv: 'Ghana', continents: AF },
  Guinea: { sv: 'Guinea', continents: AF },
  'Guinea-Bissau': { sv: 'Guinea-Bissau', continents: AF },
  Kenya: { sv: 'Kenya', continents: AF },
  Lesotho: { sv: 'Lesotho', continents: AF },
  Liberia: { sv: 'Liberia', continents: AF },
  Libya: { sv: 'Libyen', continents: AF },
  Madagascar: { sv: 'Madagaskar', continents: AF },
  Malawi: { sv: 'Malawi', continents: AF },
  Mali: { sv: 'Mali', continents: AF },
  Mauritania: { sv: 'Mauretanien', continents: AF },
  Mauritius: { sv: 'Mauritius', continents: AF },
  Morocco: { sv: 'Marocko', continents: AF },
  Mozambique: { sv: 'Moçambique', continents: AF },
  Namibia: { sv: 'Namibia', continents: AF },
  Niger: { sv: 'Niger', continents: AF },
  Nigeria: { sv: 'Nigeria', continents: AF },
  Rwanda: { sv: 'Rwanda', continents: AF },
  'São Tomé and Principe': { sv: 'São Tomé och Príncipe', continents: AF },
  Senegal: { sv: 'Senegal', continents: AF },
  Seychelles: { sv: 'Seychellerna', continents: AF },
  'Sierra Leone': { sv: 'Sierra Leone', continents: AF },
  Somalia: { sv: 'Somalia', continents: AF },
  'South Africa': { sv: 'Sydafrika', continents: AF },
  'S. Sudan': { sv: 'Sydsudan', continents: AF },
  Sudan: { sv: 'Sudan', continents: AF },
  Tanzania: { sv: 'Tanzania', continents: AF },
  Togo: { sv: 'Togo', continents: AF },
  Tunisia: { sv: 'Tunisien', continents: AF },
  Uganda: { sv: 'Uganda', continents: AF },
  Zambia: { sv: 'Zambia', continents: AF },
  Zimbabwe: { sv: 'Zimbabwe', continents: AF },

  // ---------- Nordamerika (med Centralamerika och Karibien) ----------
  'Antigua and Barb.': { sv: 'Antigua och Barbuda', continents: NA },
  Bahamas: { sv: 'Bahamas', continents: NA },
  Barbados: { sv: 'Barbados', continents: NA },
  Belize: { sv: 'Belize', continents: NA },
  Canada: { sv: 'Kanada', continents: NA },
  'Costa Rica': { sv: 'Costa Rica', continents: NA },
  Cuba: { sv: 'Kuba', continents: NA },
  Dominica: { sv: 'Dominica', continents: NA },
  'Dominican Rep.': { sv: 'Dominikanska republiken', continents: NA },
  'El Salvador': { sv: 'El Salvador', continents: NA },
  Grenada: { sv: 'Grenada', continents: NA },
  Guatemala: { sv: 'Guatemala', continents: NA },
  Haiti: { sv: 'Haiti', continents: NA },
  Honduras: { sv: 'Honduras', continents: NA },
  Jamaica: { sv: 'Jamaica', continents: NA },
  Mexico: { sv: 'Mexiko', continents: NA },
  Nicaragua: { sv: 'Nicaragua', continents: NA },
  Panama: { sv: 'Panama', continents: NA },
  'St. Kitts and Nevis': { sv: 'Saint Kitts och Nevis', continents: NA },
  'Saint Lucia': { sv: 'Saint Lucia', continents: NA },
  'St. Vin. and Gren.': { sv: 'Saint Vincent och Grenadinerna', continents: NA },
  'Trinidad and Tobago': { sv: 'Trinidad och Tobago', continents: NA },
  'United States of America': { sv: 'USA', continents: NA },

  // ---------- Sydamerika ----------
  Argentina: { sv: 'Argentina', continents: SA },
  Bolivia: { sv: 'Bolivia', continents: SA },
  Brazil: { sv: 'Brasilien', continents: SA },
  Chile: { sv: 'Chile', continents: SA },
  Colombia: { sv: 'Colombia', continents: SA },
  Ecuador: { sv: 'Ecuador', continents: SA },
  Guyana: { sv: 'Guyana', continents: SA },
  Paraguay: { sv: 'Paraguay', continents: SA },
  Peru: { sv: 'Peru', continents: SA },
  Suriname: { sv: 'Surinam', continents: SA },
  Uruguay: { sv: 'Uruguay', continents: SA },
  Venezuela: { sv: 'Venezuela', continents: SA },

  // ---------- Oceanien ----------
  Australia: { sv: 'Australien', continents: OC },
  Fiji: { sv: 'Fiji', continents: OC },
  Kiribati: { sv: 'Kiribati', continents: OC },
  'Marshall Is.': { sv: 'Marshallöarna', continents: OC },
  Micronesia: { sv: 'Mikronesien', continents: OC },
  Nauru: { sv: 'Nauru', continents: OC },
  'New Zealand': { sv: 'Nya Zeeland', continents: OC },
  Palau: { sv: 'Palau', continents: OC },
  'Papua New Guinea': { sv: 'Papua Nya Guinea', continents: OC },
  Samoa: { sv: 'Samoa', continents: OC },
  'Solomon Is.': { sv: 'Salomonöarna', continents: OC },
  Tonga: { sv: 'Tonga', continents: OC },
  Vanuatu: { sv: 'Vanuatu', continents: OC },
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
