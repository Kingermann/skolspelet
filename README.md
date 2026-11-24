# 🎒 Skolspelet

Ett spel för att öva på skolämnen. Välj kategori, spela en runda, samla stjärnor,
fotbollskort och klistermärken!

- **🧮 Matte** – välj årskurs (1–6), räknesätt och nivå. Ungefär 30 % av uppgifterna är textuppgifter.
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
- **På iPhonen:** se till att telefonen är på samma wifi som datorn och öppna adressen
  som står vid `Network:` i terminalen, t.ex. `http://192.168.x.x:5173`

Stäng av med `Ctrl + C` i terminalen.

> Inget sparas – laddar man om sidan börjar allt om (även inställningen för antal frågor). Ljudet hörs inte om iPhonen står på ljudlöst.

## Var ändrar man saker?

| Vill ni ändra… | Fil |
|---|---|
| **Matte:** hur svårt det är (talområden per årskurs och nivå) | `src/categories/matte/config.ts` |
| **Matte:** största tal (nu 1000) och andel textuppgifter | `MAX_NUMBER` / `STORY_SHARE` i samma fil |
| **Matte:** textuppgifterna (berättelser, namn) | `src/categories/matte/stories.ts` |
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

## Tester

```bash
npm test
```

- **Matte:** tusentals genererade uppgifter kontrolleras – facit stämmer, svaren är heltal ≥ 0,
  inget tal är större än 1000 och alla tal i uträkningen står i textuppgiften.
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
