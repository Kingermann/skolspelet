import { describe, expect, it } from 'vitest'
import { pickVoice } from './speech'

const voice = (name: string, lang: string, localService: boolean) => ({ name, lang, localService }) as SpeechSynthesisVoice

describe('uppläsning', () => {
  it('väljer aldrig en röst som läser via server', () => {
    const remote = voice('Google UK English Female', 'en-GB', false)
    expect(pickVoice([remote], 'en-GB')).toBeUndefined()
    expect(pickVoice([remote, voice('Daniel', 'en-GB', true)], 'en-GB')?.name).toBe('Daniel')
  })

  it('hellre exakt språk, annars samma språk från ett annat land', () => {
    const us = voice('Samantha', 'en-US', true)
    const gb = voice('Daniel', 'en-GB', true)
    expect(pickVoice([us, gb], 'en-GB')?.name).toBe('Daniel')
    expect(pickVoice([us, voice('Alva', 'sv-SE', true)], 'en-GB')?.name).toBe('Samantha')
    expect(pickVoice([voice('Alva', 'sv-SE', true)], 'en-GB')).toBeUndefined()
  })

  it('klarar Androids en_GB', () => {
    expect(pickVoice([voice('English', 'en_GB', true)], 'en-GB')?.name).toBe('English')
  })
})
