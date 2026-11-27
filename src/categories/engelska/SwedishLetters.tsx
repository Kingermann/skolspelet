import type { RefObject } from 'react'
import { insertLetter, SWEDISH_LETTERS } from './homework'

interface Props {
  /** Rutan som bokstaven ska in i. */
  input: RefObject<HTMLInputElement | null>
  value: string
  onChange: (value: string) => void
  disabled?: boolean
}

/**
 * Knappar för å, ä och ö under en svensk skrivruta. På en iPhone med bara engelskt
 * tangentbord finns bokstäverna annars bara om man håller nere a eller o – det vet inte alla barn.
 * Bokstaven hamnar där markören står, och rutan behåller fokus så att tangentbordet inte fälls ner.
 */
export function SwedishLetters({ input, value, onChange, disabled }: Props) {
  function add(letter: string) {
    const el = input.current
    const start = el?.selectionStart ?? value.length
    const end = el?.selectionEnd ?? value.length
    const result = insertLetter(value, start, end, letter, el?.maxLength)
    el?.focus()
    if (!result) return
    onChange(result.value)
    // Efter att React har skrivit in det nya värdet: ställ markören efter bokstaven.
    requestAnimationFrame(() => el?.setSelectionRange(result.caret, result.caret))
  }

  return (
    <div className="letter-buttons">
      {SWEDISH_LETTERS.map((letter) => (
        <button
          key={letter}
          type="button"
          className="letter-btn"
          aria-label={`Skriv ${letter}`}
          disabled={disabled}
          // Hindra att knappen tar fokus från rutan – då skulle tangentbordet fällas ner.
          onPointerDown={(e) => e.preventDefault()}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => add(letter)}
        >
          {letter}
        </button>
      ))}
    </div>
  )
}
