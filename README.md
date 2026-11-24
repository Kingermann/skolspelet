# 🎒 Skolspelet

Ett spel för att öva på skolämnen. Välj kategori, spela en runda, samla stjärnor,
fotbollskort och klistermärken!

- **🧮 Matte** – välj årskurs (1–6), räknesätt och nivå. Tio uppgifter per runda, varav tre textuppgifter.
- **🌍 Geografi** – välj världsdel. Du får ett land och ska trycka där det ligger på kartan.

## Starta spelet

```bash
npm install     # bara första gången
npm run dev
```

- **På datorn:** öppna http://localhost:5173
- **På iPhonen:** se till att telefonen är på samma wifi som datorn och öppna adressen
  som står vid `Network:` i terminalen, t.ex. `http://192.168.x.x:5173`

Stäng av med `Ctrl + C` i terminalen.

> Inget sparas – laddar man om sidan börjar allt om. Ljudet hörs inte om iPhonen står på ljudlöst.

## Var ändrar man saker?

| Vill ni ändra… | Fil |
|---|---|
| **Matte:** hur svårt det är (talområden per årskurs och nivå) | `src/categories/matte/config.ts` |
| **Matte:** största tal (nu 1000) och antal textuppgifter | `MAX_NUMBER` / `STORIES_PER_ROUND` i samma fil |
| **Matte:** textuppgifterna (berättelser, namn) | `src/categories/matte/stories.ts` |
| **Geografi:** svenska landsnamn och vilken världsdel ett land hör till | `src/categories/geografi/countries.ts` |
| Antal frågor per runda | `ROUND_LENGTH` i `src/game/constants.ts` |
| Klistermärken och fotbollsspelare | `src/game/stickers.ts` |
| Hur mycket konfetti det blir | `src/game/celebrate.ts` |
| Ljuden (pling, applåder, fanfar) | `src/game/sound.ts` |
| Färger och utseende | `src/index.css` (överst finns alla färger) |

### Egen bild på en fotbollsspelare

Fotbollskorten visar landslagströjan med nummer. Vill ni ha en egen bild istället
(t.ex. en teckning ni har fotat):

1. Lägg bilden i mappen `public/stickers/`, t.ex. `public/stickers/ronaldo.png`
2. Lägg till `image: 'ronaldo.png'` på spelaren i `src/game/stickers.ts`

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
  varje världsdels karta innehåller exakt sina länder och minst 10 frågor.

## Idéer för nästa steg

- Geografi: huvudstäder i Europa, flaggor, Sveriges landskap
- Geografi: "Fyll hela kartan" som utmaning
- Matte: klockan, former, bråk, negativa tal och decimaltal
- Uppläsning av frågor
- Spara framsteg (localStorage)
- Publicera på GitHub Pages så att spelet fungerar utan datorn
