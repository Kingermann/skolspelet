/**
 * Felstavningar som reglerna kan skapa men som råkar vara riktiga ord
 * (t.ex. "komma" → "koma"). De används aldrig som felaktiga alternativ.
 *
 * Listan hålls uppdaterad av testerna (svenska.test.ts): om reglerna skapar ett
 * nytt riktigt ord säger testet exakt vilka ord som ska läggas till här.
 */
export const REAL_WORDS = new Set<string>([
  'bli', 'bor', 'borr', 'bot', 'bus', 'båk', 'bål', 'bård', 'chock', 'dampa',
  'danas', 'deka', 'digga', 'disputerade', 'dok', 'dör', 'fiks', 'fitta', 'flika',
  'förlova', 'försåt', 'försåts', 'försöket', 'girs', 'glas', 'granar', 'granarna', 'gud', 'gul',
  'gull', 'hest', 'historiks', 'hopa', 'hopade', 'huvudstab', 'jaka', 'jul', 'kal', 'kapa',
  'klass', 'kloka', 'koma', 'komna', 'kris', 'krön', 'kul', 'kärna', 'köp', 'köra',
  'ledsne', 'lett', 'liga', 'läka', 'lät', 'matt', 'moppa', 'moppade', 'mus', 'nedan',
  'pall', 'plocka', 'politiks', 'proppen', 'reas', 'rev', 'räkan', 'sadlad', 'schal', 'sjunka',
  'sjön', 'sjönk', 'skåla', 'smäll', 'snör', 'somnar', 'spola', 'spön', 'stab', 'stjälp',
  'stod', 'stål', 'står', 'sval', 'sänk', 'tog', 'trådde', 'tycket', 'tärd', 'vakan',
  'vanka', 'veka', 'vina', 'visset', 'vita', 'väcka', 'väv', 'watten', 'äppel',
])
