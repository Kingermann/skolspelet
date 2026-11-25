import type { Grade } from '../../game/grades'

/**
 * Glosor per årskurs, skrivna som "engelska=svenska".
 *
 * - `ord`: glosor uppdelade i områden (används på Lätt och Medel). På Medel kommer
 *   felalternativen från samma område, så ett område behöver minst 4 glosor.
 * - `svåra`: årskursens svåraste glosor (används på Svår).
 *
 * Regler (testerna kontrollerar dem):
 * - Brittisk stavning (colour, favourite). Substantiv utan "a/an", verb utan "to".
 * - Ett ord per glosa, och varje engelskt och svenskt ord får bara finnas EN gång
 *   i hela listan – annars kan en fråga få två rätta svar (t.ex. big/large = stor).
 */
const WORD_LISTS: Record<Grade, { ord: Record<string, string>; svåra: string }> = {
  1: {
    ord: {
      färger: 'red=röd, blue=blå, green=grön, yellow=gul, black=svart, white=vit, pink=rosa, brown=brun, purple=lila, grey=grå',
      siffror: 'one=ett, two=två, three=tre, four=fyra, five=fem, six=sex, seven=sju, eight=åtta, nine=nio, ten=tio',
      djur: 'cat=katt, dog=hund, bird=fågel, fish=fisk, horse=häst, cow=ko, pig=gris, mouse=mus, rabbit=kanin, duck=anka',
      familj: 'mum=mamma, dad=pappa, sister=syster, brother=bror, baby=bebis, friend=vän, boy=pojke, girl=flicka, family=familj',
      kroppen: 'head=huvud, eye=öga, ear=öra, nose=näsa, mouth=mun, foot=fot, leg=ben, hair=hår, tooth=tand',
      hemma: 'ball=boll, car=bil, house=hus, book=bok, chair=stol, table=bord, bed=säng, door=dörr, window=fönster, toy=leksak',
    },
    svåra: 'butterfly=fjäril, elephant=elefant, birthday=födelsedag, kitchen=kök, apple=äpple, water=vatten, milk=mjölk, bread=bröd, cheese=ost, sun=sol, moon=måne, flag=flagga',
  },
  2: {
    ord: {
      mat: 'egg=ägg, butter=smör, cake=tårta, carrot=morot, potato=potatis, soup=soppa, meat=kött, sugar=socker, strawberry=jordgubbe, pear=päron, tea=te',
      kläder: 'shirt=skjorta, trousers=byxor, shoe=sko, sock=strumpa, hat=hatt, dress=klänning, jacket=jacka, skirt=kjol, glove=handske, scarf=halsduk',
      väder: 'rain=regn, snow=snö, wind=vind, cloud=moln, cold=kall, warm=varm, sunny=solig, ice=is, sky=himmel, weather=väder',
      skolan: 'pen=penna, ruler=linjal, rubber=sudd, teacher=lärare, school=skola, classroom=klassrum, lesson=lektion, homework=läxa, bag=väska, paper=papper',
      verb: 'run=springa, jump=hoppa, swim=simma, sing=sjunga, dance=dansa, read=läsa, write=skriva, eat=äta, drink=dricka, sleep=sova, walk=gå',
    },
    svåra: 'breakfast=frukost, umbrella=paraply, thunder=åska, library=bibliotek, scissors=sax, sandwich=smörgås, chicken=kyckling, vegetable=grönsak, knife=kniv, spoon=sked, fork=gaffel, queen=drottning',
  },
  3: {
    ord: {
      hemmet: 'room=rum, bedroom=sovrum, bathroom=badrum, garden=trädgård, stairs=trappa, floor=golv, wall=vägg, roof=tak, key=nyckel, lamp=lampa',
      staden: 'street=gata, shop=affär, church=kyrka, bridge=bro, hospital=sjukhus, bus=buss, train=tåg, bike=cykel, road=väg, city=stad',
      yrken: 'doctor=läkare, nurse=sjuksköterska, police=polis, farmer=bonde, cook=kock, driver=förare, dentist=tandläkare, singer=sångare, artist=konstnär',
      känslor: 'happy=glad, sad=ledsen, angry=arg, tired=trött, scared=rädd, hungry=hungrig, thirsty=törstig, proud=stolt, kind=snäll',
      veckan: 'Monday=måndag, Tuesday=tisdag, Wednesday=onsdag, Thursday=torsdag, Friday=fredag, Saturday=lördag, Sunday=söndag, week=vecka, today=idag, tomorrow=imorgon',
      adjektiv: 'big=stor, small=liten, long=lång, short=kort, old=gammal, new=ny, fast=snabb, slow=långsam, heavy=tung, easy=lätt',
    },
    svåra: 'beautiful=vacker, dangerous=farlig, delicious=läcker, difficult=svår, different=annorlunda, quiet=tyst, quite=ganska, hear=höra, here=här, weak=svag, sea=hav, see=se',
  },
  4: {
    ord: {
      naturen: 'forest=skog, tree=träd, mountain=berg, river=flod, lake=sjö, island=ö, beach=strand, field=åker, stone=sten, grass=gräs',
      fritid: 'football=fotboll, game=spel, team=lag, goal=mål, win=vinna, ride=rida, music=musik, movie=film, drum=trumma, guitar=gitarr',
      resor: 'plane=flygplan, boat=båt, ticket=biljett, suitcase=resväska, map=karta, holiday=semester, trip=utflykt, airport=flygplats, country=land',
      kroppen: 'heart=hjärta, stomach=mage, knee=knä, shoulder=axel, neck=hals, back=rygg, skin=hud, blood=blod',
      verb: 'buy=köpa, sell=sälja, find=hitta, forget=glömma, open=öppna, close=stänga, help=hjälpa, carry=bära, throw=kasta, catch=fånga',
      tid: 'morning=morgon, evening=kväll, hour=timme, minute=minut, clock=klocka, year=år, month=månad, yesterday=igår, early=tidig',
    },
    svåra: 'their=deras, there=där, whole=hel, hole=hål, meet=träffa, flower=blomma, flour=mjöl, night=natt, knight=riddare, piece=bit, peace=fred, painting=målning',
  },
  5: {
    ord: {
      hälsa: 'sick=sjuk, healthy=frisk, pain=smärta, medicine=medicin, fever=feber, cough=hosta, accident=olycka, ambulance=ambulans, injury=skada',
      skolan: 'maths=matematik, history=historia, language=språk, question=fråga, answer=svar, test=prov, mistake=misstag, word=ord, dictionary=ordbok',
      teknik: 'computer=dator, phone=telefon, screen=skärm, keyboard=tangentbord, message=meddelande, picture=bild, camera=kamera, battery=batteri',
      egenskaper: 'brave=modig, clever=klok, lazy=lat, rich=rik, poor=fattig, strong=stark, famous=känd, busy=upptagen, empty=tom, dirty=smutsig, clean=ren',
      verb: 'build=bygga, choose=välja, explain=förklara, understand=förstå, believe=tro, try=försöka, laugh=skratta, cry=gråta, borrow=låna, wait=vänta',
    },
    svåra: 'through=genom, though=fastän, thought=tanke, tough=tuff, lose=förlora, loose=lös, enough=tillräckligt, probably=förmodligen, suddenly=plötsligt, already=redan, almost=nästan, usually=vanligtvis',
  },
  6: {
    ord: {
      samhället: 'government=regering, vote=rösta, citizen=medborgare, freedom=frihet, election=val, power=makt, rule=regel, newspaper=tidning, society=samhälle, population=befolkning',
      miljön: 'environment=miljö, climate=klimat, pollution=förorening, energy=energi, rubbish=skräp, recycle=återvinna, plastic=plast, earth=jord, temperature=temperatur',
      tankar: 'idea=idé, reason=anledning, future=framtid, memory=minne, truth=sanning, knowledge=kunskap, opinion=åsikt, experience=erfarenhet, journey=resa, adventure=äventyr, dream=dröm',
      världen: 'world=värld, continent=kontinent, capital=huvudstad, border=gräns, culture=kultur, war=krig, century=århundrade, king=kung',
      småord: 'because=eftersom, therefore=därför, perhaps=kanske, never=aldrig, always=alltid, sometimes=ibland, often=ofta',
    },
    svåra: 'desert=öken, dessert=efterrätt, whether=huruvida, accept=acceptera, except=utom, advice=råd, advise=råda, necessary=nödvändig, immediately=omedelbart, especially=särskilt, knowledgeable=kunnig, neighbour=granne',
  },
}

/**
 * Ord som lätt blandas ihop (stavning eller uttal). På Svår blir felalternativen
 * helst ord ur samma grupp, t.ex. quiet/quite.
 */
export const CONFUSABLES: string[][] = [
  ['quiet', 'quite'],
  ['hear', 'here'],
  ['week', 'weak'],
  ['sea', 'see'],
  ['their', 'there'],
  ['whole', 'hole'],
  ['meet', 'meat'],
  ['flower', 'flour'],
  ['night', 'knight'],
  ['piece', 'peace'],
  ['through', 'though', 'thought', 'tough'],
  ['lose', 'loose'],
  ['desert', 'dessert'],
  ['weather', 'whether'],
  ['accept', 'except'],
  ['advice', 'advise'],
]

export interface Gloss {
  en: string
  sv: string
  grade: Grade
  /** Område (t.ex. "djur"), eller "svåra" för årskursens svåra ord. */
  topic: string
  hard: boolean
}

function parse(list: string, grade: Grade, topic: string, hard: boolean): Gloss[] {
  return list.split(',').map((pair) => {
    const [en, sv] = pair.split('=').map((s) => s.trim())
    return { en, sv, grade, topic, hard }
  })
}

/** Alla glosor i alla årskurser. */
export const GLOSSES: Gloss[] = (Object.keys(WORD_LISTS) as unknown as Grade[]).flatMap((key) => {
  const grade = Number(key) as Grade
  const { ord, svåra } = WORD_LISTS[grade]
  return [...Object.entries(ord).flatMap(([topic, list]) => parse(list, grade, topic, false)), ...parse(svåra, grade, 'svåra', true)]
})
