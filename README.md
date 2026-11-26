# 🎒 Skolspelet

Ett spel för att öva på skolämnen. Välj kategori, spela en runda, samla stjärnor,
fotbollskort och klistermärken!

- **🧮 Matte** – välj årskurs (1–6), räknesätt och nivå. Ungefär 30 % av uppgifterna är textuppgifter.
  Under "Mer att öva på" finns moment ur läroplanen (Lgr22), i de årskurser där de hör hemma:

  | Moment | Åk 1 | Åk 2 | Åk 3 | Åk 4 | Åk 5 | Åk 6 |
  |---|---|---|---|---|---|---|
  | 🧩 Mönster | +1, +2, +10 | +5, −2 | ×2, större steg | större steg, minus | växande/varannan | ×2 + 1 m.m. |
  | 🕐 Klockan | hel, halv | kvart i/över | fem-minuter (Svår: alla) | hur lång tid? | – | – |
  | 🍕 Bråk | – | hur stor del är färgad? | del av antal (½ av 8) | jämföra | bråk ↔ decimaltal | bråk, decimal, procent |
  | ❓ Ekvationer | ? + 3 = 7 | ? − 4 = 6 | ? × 3 = 12 | x + 7 = 15 | 4x = 28 | 2x + 3 = 11 |
  | 💯 Procent | – | – | – | hundraruta, 50 % = hälften, 25 % och 10 % av | hundraruta, procent ↔ bråk, 5/20/75 % av | procent av, procent ↔ decimaltal, andel (15 av 60) |

  Procent har också vardagsuppgifter (rabatt och pris) ungefär var tredje gång på Medel och Svår.

  Läroplanen anger bara stadier (åk 1–3, 4–6), så fördelningen inom stadiet är ett förslag som går
  att ändra. Nivåerna fungerar som för räknesätten: Lätt = välj bland fyra, Medel = skriv svaret,
  Svår = skriv svaret, kluriga varianter. Bråk skrivs med täljare ↓ nämnare (2/4 godtas för 1/2),
  klocktider som 3:45 (15:45 godtas också) och decimaltal med kommaknappen.
- **📝 Svenska** – välj årskurs och nivå. "Vilket av följande ord är rättstavat?" med fyra alternativ.
  Årskursen styr orden, nivån hur luriga felstavningarna är (Lätt = tydliga fel, Medel = vanliga
  stavningsfel, Svår = svåra ord och luriga fel). Efter två fel visas ett stavningstips.
- **🇬🇧 Engelska** – glosor, på två sätt:
  - **📚 Spelets glosor** – välj årskurs, riktning (engelska→svenska, svenska→engelska eller blandat)
    och nivå. Fyra alternativ; Lätt = alternativ från andra områden, Medel = från samma område,
    Svår = svåra glosor och förväxlingsord (quiet/quite).
  - **📝 Mina läxglosor** – skriv in veckans glosor (engelska + svenska) och bli förhörd åt valfritt
    håll. Man **skriver** svaret, som på ett riktigt förhör. Varje glosa kommer en gång per runda, och
    efteråt visas de man missade under "Öva mer på". Glosorna sparas i profilen; "Töm listan" när
    nya glosor kommer. Se [Läxglosor](#läxglosor) för hur svaren rättas.

  🔊 läser upp det engelska ordet (brittiskt uttal, webbläsarens inbyggda talsyntes).
- **🌍 Geografi** – välj spelläge, världsdel och nivå:
  - **🗺️ Var ligger landet?** – du får ett land och ska trycka där det ligger på kartan.
  - **🚩 Flaggor** – du ser en flagga och väljer rätt land bland fyra.

  Lätt = stora och kända länder, Medel = lite mindre länder, Svår = små och kluriga länder.
  I flaggquizet blir felalternativen på Medel och Svår flaggor som liknar den rätta.

## Starta spelet

```bash
npm install     # bara första gången
npm run dev
```

- **På datorn:** öppna http://localhost:5173
- **På telefonen hemma:** starta med `npm run dev:lan` istället, se till att telefonen är på samma
  wifi och öppna adressen vid `Network:` i terminalen, t.ex. `http://192.168.x.x:5173`.
  Använd **bara** `dev:lan` på hemnätverket – aldrig på offentliga eller okända nätverk
  (utvecklingsservern är inte gjord för att vara nåbar av andra). Datorns brandvägg måste
  också släppa in anslutningar till `node`.

Stäng av med `Ctrl + C` i terminalen.

> Ljudet hörs inte om iPhonen står på ljudlöst.

## Spela på iPhone och iPad

Öppna spelets adress på GitHub Pages i Safari, tryck på Dela → **Lägg till på hemskärmen**.
Då får spelet en egen ikon (🎒) och öppnas i helskärm som en app.

- **Öppna alltid spelet från ikonen.** På iPhone och iPad har appen på hemskärmen sin egen
  lagring, skild från Safari – spelar man ibland i Safari syns inte det i appen och tvärtom.
- Byts ikonen ut måste man ta bort genvägen och lägga till den igen för att se den nya.
  **Obs!** Tar man bort genvägen försvinner också allt sparat (profiler och album).

## Profiler och sparande

Första gången man öppnar spelet skapar man en profil: ett namn och en bild. Flera barn kan ha
var sin profil på samma iPad – finns det fler än en frågar spelet **Vem spelar?** när det startar.
Tryck på namnet uppe på startskärmen för att byta profil. ✏️ på "Vem spelar?" ändrar namn och bild
eller tar bort profilen (man måste skriva namnet för att ta bort, så att det inte händer av misstag).

Varje profil sparar sitt **album**, sina **inställningar** (antal frågor, ljud på/av) och sitt
**bästa resultat** (stjärnor) för varje val – stjärnorna syns på nivåknapparna.

Allt sparas bara på enheten, i webbläsaren. Det synkas inte mellan enheter och försvinner om man
rensar webbplatsdata i Safari eller tar bort genvägen på hemskärmen.

## Läxglosor

Så rättas svaren:

- Stora/små bokstäver, extra mellanslag och skiljetecken spelar ingen roll – "Dog." är rätt för "dog".
- Å, ä och ö måste vara rätt, och småord som "a", "to" och "en" måste vara med om de står i listan.
- Flera rätta svar: skriv `/` emellan när glosan läggs in, t.ex. `you are / you're` eller `a dog / dog`.
- En bokstav fel ger "Nästan! Kolla stavningen" – det räknas som fel men man får försöka igen.

Högst 50 glosor och 40 tecken per ord. Regler och gränser finns i
`src/categories/engelska/homework.ts` och `src/game/profiles.ts`.

## Var ändrar man saker?

| Vill ni ändra… | Fil |
|---|---|
| **Matte:** hur svårt det är (talområden per årskurs och nivå) | `src/categories/matte/config.ts` |
| **Matte:** största tal (nu 1000) och andel textuppgifter | `MAX_NUMBER` / `STORY_SHARE` i samma fil |
| **Matte:** textuppgifterna (berättelser, namn) | `src/categories/matte/stories.ts` |
| **Matte:** vilka moment som finns i vilken årskurs | `TOPICS_FOR_GRADE` i `src/categories/matte/topics/index.ts` |
| **Matte:** talföljder, klockslag, bråk, ekvationer och procent per årskurs och nivå | `PATTERNS`, `CLOCK_MINUTES`, `PARTS`/`DECIMAL_DENS`…, `EQUATIONS`, `PERCENT` i `src/categories/matte/topics/` |
| **Svenska:** stavningsord per årskurs (lägg gärna till veckoord!) | `src/categories/svenska/words.ts` |
| **Svenska:** regler för felstavningar och stavningstipsen | `src/categories/svenska/misspell.ts` |
| **Engelska:** glosor per årskurs och område, och förväxlingsord | `src/categories/engelska/words.ts` |
| **Geografi:** svenska landsnamn, världsdel och nivå (1 = Lätt, 2 = Medel, 3 = Svår) | `src/categories/geografi/countries.ts` |
| **Geografi:** grupper av flaggor som liknar varandra | `src/categories/geografi/flags.ts` |
| Antal frågor per runda | ⚙️ på startskärmen (3, 5, 10, 15 eller 20, sparas per profil). Valen och standardvärdet finns i `src/game/constants.ts` |
| Bilderna man kan välja till sin profil | `src/game/avatars.ts` |
| Klistermärken och fotbollsspelare | `src/game/stickers.ts` |
| Hur mycket konfetti det blir | `src/game/celebrate.ts` |
| Ljuden (pling, applåder, fanfar) | `src/game/sound.ts` |
| Färger och utseende | `src/index.css` (överst finns alla färger) |

### Egen bild på en fotbollsspelare

Fotbollskorten visar landslagströjan med nummer. Vill ni ha en egen bild istället
(t.ex. en teckning ni har fotat):

1. Lägg bilden i mappen `public/stickers/`, t.ex. `public/stickers/ronaldo.png`
2. Lägg till `image: 'ronaldo.png'` på spelaren i `src/game/stickers.ts`

## Flaggor

Flaggorna kommer från paketet [flag-icons](https://flagicons.lipis.dev) (MIT-licens) och har den
officiella, aktuella designen (t.ex. Syriens nya flagga). Alla visas i formatet 4:3, så proportionerna
kan skilja lite från verkligheten (Schweiz blir t.ex. rektangulär). Afghanistan visas med den flagga
som FN och Sverige använder.

## Ikonen

Ryggsäcken 🎒 kommer från [Noto Emoji](https://github.com/googlefonts/noto-emoji) (Apache License 2.0)
och ligger på lila bakgrund i `public/icon.svg`. PNG-filerna bredvid (`icon-180.png` för iPhone/iPad,
`icon-192.png` och `icon-512.png` för manifestet) är samma bild i olika storlekar.

## Ordlistor i testerna

Testerna använder ordlistorna [dictionary-sv](https://github.com/wooorm/dictionaries) (LGPL-3.0,
underhållen av Göran Andersson) och dictionary-en-gb (MIT/BSD) via `nspell`. De används bara i
testerna och följer inte med i appen.

## Lägga till en ny kategori

Varje kategori är en egen mapp under `src/categories/` som bestämmer vad man väljer
innan man spelar (`Setup`) och hur en runda ser ut (`Play`). Stjärnor, konfetti,
applåder och albumet är gemensamma – använd `useRoundFlow` i `src/game/` för rundan.
Lägg sedan till kategorin i `src/categories/index.ts`.

## Kartdata

Länders gränser kommer från [Natural Earth](https://www.naturalearthdata.com/) (public domain)
via paketet `world-atlas`. Kartan visar bara vald världsdel. Områden som inte är egna länder
(t.ex. Grönland och Västsahara) visas gråa och går inte att trycka på. Pyttesmå länder har en
ring runt sig så att de går att hitta. Tuvalu saknas i kartdatan.

## Säkerhet och integritet

- Appen skickar inga uppgifter någonstans – inga konton, ingen analys. Profiler (namn och en emoji),
  album och resultat sparas bara i webbläsaren på enheten (localStorage).
- **Radera allt sparat:** ta bort genvägen på hemskärmen (eller Inställningar → Safari → Avancerat →
  Webbplatsdata). En borttagen profil raderas direkt från enheten.
- 🔊 använder bara röster som finns på enheten. Vissa webbläsare (t.ex. Chromes "Google"-röster)
  läser upp via en server – de används aldrig, eftersom läxglosorna är text barnen skrivit själva.
  Finns ingen engelsk röst på enheten blir det tyst i stället.
- **Andra sidor på samma GitHub-konto:** alla GitHub Pages-projekt under samma konto delar adress
  (`<användare>.github.io`) och därmed lagring. Publicera därför inga andra sidor där med kod från
  andra (t.ex. analys eller annonser) – den skulle kunna läsa barnens namn och glosor.
- Typsnittet (Fredoka) ligger i appen själv, så inga anrop går till Google när man spelar.
- Den färdiga versionen (`npm run build`) har en Content Security Policy: sidan får bara ladda
  kod, stil, bilder, typsnitt och data från sin egen adress.
- Utvecklingsservern lyssnar bara på den egna datorn (`npm run dev`), om man inte uttryckligen
  startar `npm run dev:lan`.
- Kontrollera beroenden innan publicering: `npm audit` och `npm audit signatures`.
  Installationsskript körs bara för godkända paket (se `allowScripts` i `package.json`).

## Tester

```bash
npm test
```

- **Matte:** tusentals genererade uppgifter kontrolleras – facit stämmer, svaren är heltal ≥ 0,
  inget tal är större än 1000 och alla tal i uträkningen står i textuppgiften.
- **Matte, nya moment:** hundratals uppgifter per årskurs, moment och nivå – rätt svar godtas, exakt
  ett alternativ är rätt och inget fel alternativ råkar vara rätt (2/4 när svaret är 1/2), alla tal
  mellan 0 och 1000, ekvationerna går ihop med svaret, talföljderna följer en regel, klockan visar
  svaret, bråkbilderna stämmer och en runda har olika uppgifter. Procent: hundrarutan, "p % av",
  andelar och rabatter räknas om och kontrolleras; inga rabatter över 50 % och inga halva elever.
- **Svenska:** varje stavningsord finns i den svenska ordlistan (dictionary-sv), och inget felstavat
  alternativ är ett riktigt ord (t.ex. "koma" eller "hopa"). Skapar reglerna ett riktigt ord säger
  testet exakt vilket som ska läggas till i `realWords.ts`, där sådana ord spärras.
- **Engelska:** alla engelska ord är rättstavade med brittisk stavning (dictionary-en-gb) och alla svenska
  ord finns i den svenska ordlistan. Varje engelskt och svenskt ord finns bara en gång i hela listan,
  så att en fråga aldrig kan få två rätta svar.
- **Läxglosor:** reglerna för rättning ovan (stora bokstäver, skiljetecken, ’, `/`, "nästan"), att
  varje glosa förhörs exakt en gång och att samma engelska ord inte kan läggas in två gånger.
- **Profiler:** det sparade går att läsa tillbaka likadant, trasig eller okänd data kraschar inte spelet
  (och sparas undan i stället för att skrivas över), bästa resultat höjs bara när man blivit bättre och
  spelet fungerar även när webbläsaren inte låter det spara.
- **Geografi:** varje område i kartdatan är klassat, alla länder har svenskt namn och världsdel,
  varje världsdels karta innehåller exakt sina länder och varje nivå ger 10 olika länder
  (har en nivå för få länder fylls rundan på från närmaste nivå). Varje land har en landskod med en
  flaggbild, svarsalternativen är fyra olika länder från samma världsdel, och på Svår är felalternativen
  liknande flaggor när sådana finns.

## Idéer för nästa steg

- Geografi: huvudstäder i Europa, Sveriges landskap, "välj rätt flagga" (omvänt flaggquiz)
- Geografi: "Fyll hela kartan" som utmaning
- Matte: decimaltal och negativa tal som egna moment, former, omkrets och area, enheter,
  medelvärde – och textuppgifter för bråk och ekvationer
- Uppläsning av frågor
