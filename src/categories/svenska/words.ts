import type { Grade } from '../../game/grades'

/**
 * Stavningsord per årskurs.
 *
 * - `ord`: vanliga ord för årskursen (används på Lätt och Medel)
 * - `svåra`: de svåraste orden i årskursen (används på Svår)
 *
 * Åk 1–3 har grundformer, åk 4–6 även böjda former (hoppade, katterna …).
 * Lägg gärna till veckoord från skolan! Testerna kontrollerar att varje ord
 * finns i den svenska ordlistan och att felstavningarna inte är riktiga ord.
 */
export const WORDS: Record<Grade, { ord: string[]; svåra: string[] }> = {
  1: {
    ord: [
      'sol', 'hus', 'katt', 'hund', 'mamma', 'pappa', 'boll', 'glass', 'bil', 'båt',
      'mat', 'sko', 'bok', 'kaka', 'äpple', 'skola', 'lampa', 'fisk', 'häst', 'gris',
      'stol', 'bord', 'säng', 'dörr', 'träd', 'blomma', 'vatten', 'mjölk', 'sova', 'äta',
      'leka', 'hoppa', 'springa', 'titta', 'röd', 'blå', 'gul', 'grön', 'stor', 'liten',
      'snäll', 'glad', 'ledsen', 'jul', 'sommar', 'vinter', 'snö', 'regn',
    ],
    svåra: [
      'flicka', 'pojke', 'hjärta', 'sju', 'sjö', 'djur', 'ljus', 'göra', 'kyrka', 'tjugo',
      'stjärna', 'skjorta', 'hjälm', 'sked', 'kniv',
    ],
  },
  2: {
    ord: [
      'skog', 'hav', 'sand', 'sten', 'fågel', 'mus', 'björn', 'varg', 'räv', 'älg',
      'morgon', 'kväll', 'natt', 'vecka', 'klocka', 'penna', 'papper', 'väska', 'jacka', 'mössa',
      'familj', 'syster', 'bror', 'mormor', 'farfar', 'kompis', 'lärare', 'buss', 'tåg', 'cykel',
      'väg', 'stad', 'affär', 'pengar', 'skriva', 'läsa', 'räkna', 'rita', 'sjunga', 'dansa',
      'simma', 'cykla', 'tänka', 'sitta', 'ligga', 'komma', 'hjälpa', 'trappa',
    ],
    svåra: [
      'kjol', 'tjej', 'skina', 'skön', 'skjuta', 'gärna', 'hjul', 'djup', 'choklad', 'gymnastik',
      'kyckling', 'stjälk', 'dimma', 'sylt', 'jord',
    ],
  },
  3: {
    ord: [
      'vänner', 'skolgård', 'rast', 'frukost', 'middag', 'kök', 'badrum', 'sovrum', 'trädgård', 'sommarlov',
      'resa', 'flygplan', 'väder', 'moln', 'åska', 'blixt', 'vind', 'regnbåge', 'solsken', 'gata',
      'bro', 'berätta', 'fråga', 'svara', 'lyssna', 'förstå', 'glömma', 'vinna', 'förlora', 'bygga',
      'hämta', 'städa', 'vakna', 'somna', 'snabb', 'långsam', 'tung', 'lätt', 'varm', 'kall',
      'mörk', 'tidning', 'kudde', 'sallad', 'smör', 'ost', 'korv', 'potatis',
    ],
    svåra: [
      'kanske', 'alltid', 'aldrig', 'ingenting', 'någonting', 'tillsammans', 'roligt', 'tråkigt', 'viktigt', 'station',
      'lunch', 'genast', 'sjukhus', 'sjal', 'tjock',
    ],
  },
  4: {
    ord: [
      'hoppade', 'sprang', 'skrev', 'läste', 'spelade', 'cyklade', 'simmade', 'kommer', 'gjorde', 'tyckte',
      'katterna', 'hundarna', 'böckerna', 'flickorna', 'pojkarna', 'äpplen', 'länder', 'städer', 'berg', 'sjöar',
      'skogar', 'bonde', 'gård', 'ålder', 'början', 'slutet', 'mitten', 'lektion', 'klassrum', 'matsal',
      'idrott', 'svenska', 'engelska', 'historia', 'natur', 'djuren', 'växter', 'vänskap', 'semester', 'fotboll',
      'kusin', 'grannar', 'mobil', 'dator', 'spännande', 'läskig', 'modig', 'lycklig',
    ],
    svåra: [
      'ungefär', 'dessutom', 'äntligen', 'förstås', 'stjärnor', 'skjortan', 'hjärtat', 'ljuset', 'kycklingen', 'sjöng',
      'tjugofem', 'giraff', 'gemensam', 'känslor', 'kyrkan',
    ],
  },
  5: {
    ord: [
      'geografi', 'matematik', 'befolkning', 'huvudstad', 'kontinent', 'ocean', 'landskap', 'klimat', 'temperatur', 'experiment',
      'energi', 'miljö', 'återvinning', 'kompost', 'nyheter', 'berättelse', 'kapitel', 'författare', 'meningar', 'frågor',
      'eftersom', 'därför', 'medan', 'innan', 'mellan', 'igenom', 'bakom', 'utanför', 'försökte', 'bestämde',
      'upptäckte', 'började', 'slutade', 'trodde', 'visste', 'kände', 'grannarna', 'kommunen', 'skogen', 'havet',
      'vulkan', 'öken', 'regnskog', 'insekter', 'däggdjur', 'fåglarna', 'planet', 'universum',
    ],
    svåra: [
      'egentligen', 'förmodligen', 'tyvärr', 'naturligtvis', 'sjuksköterska', 'ambulans', 'intressant', 'elektricitet', 'information', 'journalist',
      'garage', 'restaurang', 'tjugonde', 'skjutsade', 'stjärnhimlen',
    ],
  },
  6: {
    ord: [
      'demokrati', 'samhälle', 'regering', 'riksdag', 'kommun', 'ekonomi', 'företag', 'arbete', 'framtid', 'utbildning',
      'gymnasiet', 'universitet', 'teknik', 'program', 'säkerhet', 'ansvar', 'rättighet', 'skyldighet', 'jämställdhet', 'koldioxid',
      'fotosyntes', 'organism', 'bakterier', 'kroppen', 'skelett', 'muskler', 'hjärnan', 'blodet', 'beslutade', 'diskuterade',
      'jämförde', 'förklarade', 'undersökte', 'resultat', 'slutsats', 'påstående', 'argument', 'åsikt', 'källa', 'tidskrift',
      'historisk', 'politisk', 'ekologisk', 'befolkningen', 'medeltiden', 'vikingarna', 'stormaktstiden', 'industrin',
    ],
    svåra: [
      'självklart', 'nödvändigt', 'fantastiskt', 'champinjon', 'schampo', 'situation', 'generation', 'professionell', 'kommunikation', 'rekommendera',
      'garderob', 'konsekvens', 'exempel', 'religion', 'personlighet',
    ],
  },
}
