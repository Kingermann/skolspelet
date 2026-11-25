/**
 * Uppläsning med webbläsarens inbyggda talsyntes (ingen nedladdning, inget skickas
 * till någon server). Används för att höra hur engelska ord uttalas.
 */

export function canSpeak(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window
}

/** Läser upp texten med en röst för språket (t.ex. 'en-GB' = brittisk engelska). */
export function speak(text: string, lang = 'en-GB') {
  if (!canSpeak()) return
  const synth = window.speechSynthesis
  synth.cancel()
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = lang
  utterance.rate = 0.85
  const voices = synth.getVoices()
  const voice = voices.find((v) => v.lang === lang) ?? voices.find((v) => v.lang.startsWith(lang.split('-')[0]))
  if (voice) utterance.voice = voice
  synth.speak(utterance)
}
