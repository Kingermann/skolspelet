/** Blanda en lista (Fisher–Yates). */
export function shuffle<T>(items: T[]): T[] {
  const a = [...items]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/** Ett slumpat element ur en lista. */
export function randomOf<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)]
}
