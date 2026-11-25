/// <reference types="node" />
/**
 * Ordlistor för testerna (följer inte med i appen).
 * - Svenska: dictionary-sv (LGPL-3.0) utan sammansättningsregler – med dem godkänns
 *   nästan vad som helst ("kat", "järta" …) som hopsatta ordbitar.
 * - Engelska: dictionary-en-gb (MIT/BSD), brittisk stavning.
 */
import dictionarySv from 'dictionary-sv'
import dictionaryEnGb from 'dictionary-en-gb'
import nspell from 'nspell'

let sv: ReturnType<typeof nspell> | null = null
let en: ReturnType<typeof nspell> | null = null

export function isSwedishWord(word: string): boolean {
  if (!sv) {
    const aff = new TextDecoder()
      .decode(dictionarySv.aff)
      .split('\n')
      .filter((line) => !/^(COMPOUND|ONLYINCOMPOUND|CHECKCOMPOUND)/.test(line))
      .join('\n')
    sv = nspell({ aff: Buffer.from(aff), dic: Buffer.from(dictionarySv.dic) })
  }
  return sv.correct(word)
}

export function isEnglishWord(word: string): boolean {
  en ??= nspell({ aff: Buffer.from(dictionaryEnGb.aff), dic: Buffer.from(dictionaryEnGb.dic) })
  return en.correct(word)
}
