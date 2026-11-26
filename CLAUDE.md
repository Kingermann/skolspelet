# Skolspelet – anteckningar för Claude

Ett webbspel för barn (åk 1–6) där man övar skolämnen: välj kategori → gör val (årskurs, nivå …) →
spela en runda → stjärnor, konfetti, applåder och ett fotbollskort/klistermärke till albumet.
README.md är skriven för familjen som använder spelet (hur man startar, var man ändrar saker).
Den här filen är för den som utvecklar vidare.

## Kommandon

```bash
npm run dev       # dev-server, bara localhost:5173
npm run dev:lan   # dev-server på hemnätverket (för att testa på telefon)
npm test          # Vitest – måste gå igenom, annars publiceras inget
npm run lint      # oxlint
npm run build     # tsc -b + vite build → dist/ (base /skolspelet/, med CSP)
```

Publicering: varje push till `main` kör `.github/workflows/deploy.yml` (test → build → GitHub Pages).
Repo: github.com/Kingermann/skolspelet.

## Teknik

React 19, TypeScript 7, Vite 8, Vitest 5, oxlint. Inga routrar eller state-bibliotek – `App.tsx`
håller allt state i `useState` och väljer skärm med en `Screen`-union
(`start | setup | play | result | album | settings | profiles | profile-new | profile-edit`).

## Profiler och sparande

- `src/game/profiles.ts` – allt sparande. En enda nyckel i localStorage (`skolspelet`) med
  `{ version: 1, profiles: Profile[] }`. En profil har namn, emoji-bild, album, `roundLength`,
  `soundOn` och `best` (bästa stjärnor per `resultKey(kategori, val)`, t.ex. `matte:grade=3,level=medel,op=+`).
- `App.tsx` håller `data` i state och sparar med en effekt vid varje ändring. Utan vald profil visas
  bara profilskärmarna (`components/ProfileScreens.tsx`).
- `parseSavedData` lagar enskilda trasiga fält; går datan inte att läsa alls flyttas den till
  `skolspelet-trasig` i stället för att skrivas över. Fungerar inte localStorage spelas allt som
  vanligt utan sparande.
- **Ändras formatet:** höj `version` och översätt från den gamla i `parseSavedData` – annars
  försvinner barnens album.
- `LevelScreen` får kategorins tidigare val (`choices`) och bygger själv `{ ...choices, level }`,
  så nyckeln för bästa resultat är alltid exakt samma som rundans inställningar.
- Nya kategorier måste ha inställningar = tidigare val + `level`, med enkla värden (strängar/tal).
  Undantag: läxglosor (`{ homework: true, direction }`) har ingen nivå och skickar
  `saveBest: false` i `onFinish`.
- `Play` får skicka en `RoundSummary` som tredje argument till `onFinish`: `practiceMore`
  (visas som "Öva mer på" på resultatskärmen) och `saveBest`. `useRoundFlow` skickar med
  `marks` och `items` så att rundan kan räkna ut det.
- Profilens `homework` kom till efter version 1 och läses som tom lista om den saknas – nya
  fält som har ett vettigt standardvärde behöver alltså ingen ny version.

## Arkitektur

- `src/categories/<id>/` – en mapp per kategori. `index.ts` exporterar
  `defineCategory<Settings>({ id, name, icon, color, Setup, Play })` (typen i `categories/types.ts`).
  - `Setup` anropar `onStart(settings)` när alla val är gjorda.
  - `Play` anropar `onFinish(firstTryCorrect, total)` när rundan är slut.
  - Registreras i `src/categories/index.ts` (ordningen där = ordningen på startskärmen).
- `src/game/useRoundFlow.ts` – gemensam rundlogik som alla `Play` använder: två försök per fråga,
  svaret visas efter två fel, stjärnmarkering, "rätt i rad" (stort firande var tredje), automatiskt
  vidare efter rätt svar. Kategorin anropar `correct()` / `wrong(retryMsg, revealMsg)` / `advance()`.
- `src/game/` – övrigt gemensamt: `constants.ts` (rundlängd, stjärngränser), `gameSettings.ts`
  (context för antal frågor), `grades.ts` / `levels.ts` (årskurs- och nivåval), `sound.ts`
  (Web Audio), `speech.ts` (talsyntes, används av Engelska), `celebrate.ts` (konfetti),
  `stickers.ts` (klistermärken + fotbollsspelare), `random.ts`.
- `src/components/` – gemensamma skärmar: `Menus.tsx` (start + album), `GradeScreen`, `LevelScreen`,
  `Result`, `SettingsScreen`, `Progress`, `Header`, `StickerView`.
- `src/index.css` – all styling, färgvariabler överst.
- `public/` – ikon (`icon.svg` = källan: Noto Emojis 🎒, Apache 2.0, på `#c9b8ff`; PNG 180/192/512
  renderade från den, t.ex. med `@resvg/resvg-js` – inget beroende i projektet) och
  `manifest.webmanifest` (relativa sökvägar, eftersom sidan ligger under `/skolspelet/`).
  Familjen spelar som hemskärmsapp på iPhone/iPad – där har appen egen lagring, skild från Safari,
  och en ny ikon syns först när genvägen läggs till igen.

## Kategorier

| Kategori | Kärnfiler | Notering |
|---|---|---|
| Matte | `generator.ts`, `config.ts`, `stories.ts` | Talområden per årskurs × nivå. ~30 % textuppgifter. Max 1000, bara heltal ≥ 0. |
| Matte – moment | `topics/` | Bråk, ekvationer, klockan, mönster (`TOPICS_FOR_GRADE`). `MatteRound` skickar dem till `TopicRound`; `op` i inställningarna är räknesätt eller moment. Svar kan vara heltal, decimaltal, bråk, klocktid eller val (`topics/task.ts`). Bilder ritas som SVG i `Pictures.tsx`; `{3/4}` i text blir ett riktigt bråk. Inga textuppgifter än. |
| Svenska | `words.ts`, `misspell.ts`, `realWords.ts` | Felstavningar skapas med regler. Felstavningar som råkar bli riktiga ord spärras i `realWords.ts`. |
| Engelska | `words.ts`, `quiz.ts`, `homework.ts` | Två lägen (`EngelskaPlay` väljer runda): spelets glosor (årskurs, riktning, nivå, fyra alternativ, förväxlingsord på Svår) och läxglosor (`HomeworkSetup`/`HomeworkRound`: egna glosor i profilen, man skriver svaret, inga nivåer, inget bästa resultat sparas). |
| Geografi | `countries.ts`, `map.ts`, `WorldMap.tsx`, `flags.ts` | Kartspel (d3-geo/zoom + world-atlas) och flaggquiz (flag-icons). Nivå 1–3 per land. |

## Konventioner

- **Allt på svenska**: UI-texter, kommentarer, testnamn och commit-meddelanden. Kod-identifierare på engelska.
- Commit-meddelanden: kort rubrik på svenska ("Ny kategori Svenska: rättstavning"), sedan en brödtext
  som förklarar vad och varför. Ett commit per funktion.
- Nämn aldrig "Claude" i commit- eller PR-meddelanden (organisationsregel), inte heller co-author-rader.
- Kommentera med JSDoc på svenska som förklarar *varför* och vad som går att ändra.
- När något ändras som familjen kan vilja justera: uppdatera tabellen "Var ändrar man saker?" i README.
- Nya kategorier ska ha tester, och testerna ska vara datadrivna och täcka hela innehållet:
  - ord kontrolleras mot riktiga ordlistor via `nspell` (`src/testing/dictionaries.ts`,
    dictionary-sv / dictionary-en-gb – bara devDependencies, följer inte med i appen)
  - ingen fråga får kunna ha två rätta svar (t.ex. varje glosa bara en gång)
  - genererade uppgifter testas i tusental (facit, talgränser)

## Säkerhet och integritet (medvetna val – behåll dem)

- Inga externa anrop: inga konton, ingen analys, typsnittet (Fredoka) ligger lokalt via `@fontsource`.
- CSP läggs in i byggd version av ett plugin i `vite.config.ts` – allt från `'self'`. Nya beroenden
  får inte kräva externa domäner, inline-skript eller `eval`.
- Dev-servern lyssnar bara på localhost; `dev:lan` är ett uttryckligt val.
- `allowScripts` i `package.json` styr vilka paket som får köra installationsskript.
- Allt som sparas (barnens namn, läxglosor) stannar på enheten. Användarinmatning visas bara som
  React-text – aldrig `dangerouslySetInnerHTML`. Läst data valideras i `parseSavedData` och har tak
  (namnlängd, antal profiler och glosor).
- Talsyntes: `pickVoice` väljer bara röster med `localService` – fjärr-röster skickar texten till en
  server. Ändra inte till webbläsarens standardröst.
- GitHub Pages delar origin (`<användare>.github.io`) mellan kontots alla projekt, och därmed
  localStorage. Ingen kod från tredje part får finnas på någon av kontots Pages-sidor.

## Status (senast uppdaterad 2026-11-26)

Byggt 24–25 nov 2026: Matte → MVP med album → fotbollskort/konfetti → textuppgifter → kategorisystem
+ Geografi (karta) → nivåer → flaggquiz → inställning för antal frågor → säkerhet/CSP → GitHub Pages
→ Svenska (rättstavning) → Engelska (glosor) → hemskärmsikon → profiler och sparande → läxglosor i Engelska → säkerhet (talsyntes) → nya mattemoment:
bråk, ekvationer, klockan, mönster (26 nov). Lgr22 anger bara stadier; fördelningen per årskurs är vårt förslag.
Layouten är mätt så att ✓ syns utan scroll på iPhone SE (667 px), iPhone 14 och iPad.

Idéer för nästa steg (se även README):
- Geografi: huvudstäder i Europa, Sveriges landskap, omvänt flaggquiz, "fyll hela kartan"
- Matte: decimaltal, procent och negativa tal som egna moment, former, omkrets/area, enheter, medelvärde; textuppgifter för bråk och ekvationer
- Uppläsning av frågor (talsyntesen finns redan i `src/game/speech.ts`)
