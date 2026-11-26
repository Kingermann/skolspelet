/**
 * Uppläsning med webbläsarens inbyggda talsyntes. Används för att höra hur engelska ord uttalas.
 *
 * Integritet: vissa röster (t.ex. Chromes "Google …"-röster, `localService: false`) skickar
 * texten till en server för att läsa upp den. Med läxglosor är det text barnen skrivit själva,
 * så vi väljer bara röster som finns på enheten. På iPhone/iPad är alla röster lokala.
 */

export function canSpeak(): boolean {
  const ok = typeof window !== 'undefined' && 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window
  // Chrome laddar rösterna först när någon frågar efter dem – fråga redan när 🔊 visas,
  // så att de finns när man trycker.
  if (ok) window.speechSynthesis.getVoices()
  return ok
}

/**
 * En röst för språket som finns på enheten, t.ex. 'en-GB' = brittisk engelska.
 * Hellre exakt språk (en-GB) än bara samma språk (en-US). Aldrig en röst som läser via server.
 */
export function pickVoice(voices: SpeechSynthesisVoice[], lang: string): SpeechSynthesisVoice | undefined {
  const local = voices.filter((v) => v.localService)
  const norm = (l: string) => l.replace('_', '-').toLowerCase()
  const language = norm(lang).split('-')[0]
  return local.find((v) => norm(v.lang) === norm(lang)) ?? local.find((v) => norm(v.lang).split('-')[0] === language)
}

/** Läser upp texten med en lokal röst för språket. Finns ingen sådan läses inget upp. */
export function speak(text: string, lang = 'en-GB') {
  if (!canSpeak()) return
  const synth = window.speechSynthesis
  const voice = pickVoice(synth.getVoices(), lang)
  // Utan vald röst väljer webbläsaren själv – och kan då välja en som läser via server.
  if (!voice) return
  synth.cancel()
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = voice.lang
  utterance.voice = voice
  utterance.rate = 0.85
  synth.speak(utterance)
}
