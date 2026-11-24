# 🧮 Mattespelet

Ett mattespel för åk 1–6. Välj årskurs, räknesätt och nivå, räkna tio uppgifter,
samla stjärnor och klistermärken!

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
| Hur svårt det är (talområden per årskurs och nivå) | `src/game/config.ts` |
| Vilka klistermärken som finns | `src/game/stickers.ts` |
| Färger och utseende | `src/index.css` (överst finns alla färger) |
| Beröm-texterna ("Snyggt! ⭐") | `src/components/Round.tsx` |
| Ljuden | `src/game/sound.ts` |

## Kontrollera att facit stämmer

```bash
npm test
```

Testerna genererar tusentals uppgifter för varje årskurs, nivå och räknesätt och kollar
att svaret alltid är rätt, att det är ett heltal ≥ 0 och att talen håller sig inom talområdet.

## Idéer för nästa steg

- Karta och "bygg din värld"
- Klockan, former, bråk och andra moment
- Negativa tal och decimaltal
- Strategitips när man svarar fel
- Uppläsning av uppgifter
- Spara framsteg (localStorage)
- Publicera på GitHub Pages så att spelet fungerar utan datorn
