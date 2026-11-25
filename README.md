# 🎒 Skolspelet

Ett spel för att öva på skolämnen. Välj kategori, spela en runda, samla stjärnor,
fotbollskort och klistermärken!

- **🧮 Matte** – välj årskurs (1–6), räknesätt och nivå. Ungefär 30 % av uppgifterna är textuppgifter.
- **📝 Svenska** – välj årskurs och nivå. "Vilket av följande ord är rättstavat?" med fyra alternativ.
  Årskursen styr orden, nivån hur luriga felstavningarna är (Lätt = tydliga fel, Medel = vanliga
  stavningsfel, Svår = svåra ord och luriga fel). Efter två fel visas ett stavningstips.
- **🇬🇧 Engelska** – glosor. Välj årskurs, riktning (engelska→svenska, svenska→engelska eller blandat)
  och nivå. Fyra alternativ; Lätt = alternativ från andra områden, Medel = från samma område,
  Svår = svåra glosor och förväxlingsord (quiet/quite). 🔊 läser upp det engelska ordet
  (brittiskt uttal, webbläsarens inbyggda talsyntes).
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

> Inget sparas – laddar man om sidan börjar allt om (även inställningen för antal frågor). Ljudet hörs inte om iPhonen står på ljudlöst.

## Var ändrar man saker?

| Vill ni ändra… | Fil |
|---|---|
| **Matte:** hur svårt det är (talområden per årskurs och nivå) | `src/categories/matte/config.ts` |
| **Matte:** största tal (nu 1000) och andel textuppgifter | `MAX_NUMBER` / `STORY_SHARE` i samma fil |
| **Matte:** textuppgifterna (berättelser, namn) | `src/categories/matte/stories.ts` |
| **Svenska:** stavningsord per årskurs (lägg gärna till veckoord!) | `src/categories/svenska/words.ts` |
| **Svenska:** regler för felstavningar och stavningstipsen | `src/categories/svenska/misspell.ts` |
| **Engelska:** glosor per årskurs och område, och förväxlingsord | `src/categories/engelska/words.ts` |
| **Geografi:** svenska landsnamn, världsdel och nivå (1 = Lätt, 2 = Medel, 3 = Svår) | `src/categories/geografi/countries.ts` |
| **Geografi:** grupper av flaggor som liknar varandra | `src/categories/geografi/flags.ts` |
| Antal frågor per runda | ⚙️ på startskärmen (3, 5, 10, 15 eller 20). Valen och standardvärdet finns i `src/game/constants.ts` |
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

- Appen sparar ingenting och skickar inga uppgifter någonstans – inga konton, ingen analys.
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
- **Svenska:** varje stavningsord finns i den svenska ordlistan (dictionary-sv), och inget felstavat
  alternativ är ett riktigt ord (t.ex. "koma" eller "hopa"). Skapar reglerna ett riktigt ord säger
  testet exakt vilket som ska läggas till i `realWords.ts`, där sådana ord spärras.
- **Engelska:** alla engelska ord är rättstavade med brittisk stavning (dictionary-en-gb) och alla svenska
  ord finns i den svenska ordlistan. Varje engelskt och svenskt ord finns bara en gång i hela listan,
  så att en fråga aldrig kan få två rätta svar.
- **Geografi:** varje område i kartdatan är klassat, alla länder har svenskt namn och världsdel,
  varje världsdels karta innehåller exakt sina länder och varje nivå ger 10 olika länder
  (har en nivå för få länder fylls rundan på från närmaste nivå). Varje land har en landskod med en
  flaggbild, svarsalternativen är fyra olika länder från samma världsdel, och på Svår är felalternativen
  liknande flaggor när sådana finns.

## Idéer för nästa steg

- Geografi: huvudstäder i Europa, Sveriges landskap, "välj rätt flagga" (omvänt flaggquiz)
- Geografi: "Fyll hela kartan" som utmaning
- Matte: klockan, former, bråk, negativa tal och decimaltal
- Uppläsning av frågor
- Spara framsteg (localStorage)
- Publicera på GitHub Pages så att spelet fungerar utan datorn
