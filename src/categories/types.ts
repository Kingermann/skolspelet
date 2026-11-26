import type { ComponentType } from 'react'

/** Extra om en färdig runda, utöver antal rätt. */
export interface RoundSummary {
  /** Visas på resultatskärmen under "Öva mer på", t.ex. "horse = häst". */
  practiceMore?: string[]
  /** false = spara inget bästa resultat (t.ex. läxglosor, som byts varje vecka). */
  saveBest?: boolean
}

/**
 * En kategori i Skolspelet (Matte, Geografi, …).
 *
 * Varje kategori bestämmer själv vad man väljer innan man spelar (Setup)
 * och hur en runda ser ut (Play). Allt annat – startskärm, stjärnor,
 * konfetti, applåder och klistermärkesalbum – är gemensamt.
 *
 * Lägga till en ny kategori: skapa en mapp under src/categories/, exportera
 * en Category därifrån och lägg till den i src/categories/index.ts.
 */
export interface Category<Settings> {
  id: string
  name: string
  icon: string
  color: string
  /** Valen innan rundan (t.ex. årskurs och nivå). Anropar onStart när allt är valt. */
  Setup: ComponentType<{ onStart: (settings: Settings) => void; onBack: () => void }>
  /** Själva rundan. Anropar onFinish med antal rätt på första försöket, antal frågor och ev. sammanfattning. */
  Play: ComponentType<{
    settings: Settings
    onFinish: (firstTryCorrect: number, total: number, summary?: RoundSummary) => void
    onQuit: () => void
  }>
}

/** Gör en kategori med egna inställningar till en "vanlig" kategori som App kan hantera. */
export function defineCategory<Settings>(category: Category<Settings>): Category<unknown> {
  return category as unknown as Category<unknown>
}
