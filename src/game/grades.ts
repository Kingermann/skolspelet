/** Årskurser (lågstadiet och mellanstadiet). */
export type Grade = 1 | 2 | 3 | 4 | 5 | 6

export const GRADES: Grade[] = [1, 2, 3, 4, 5, 6]

export const GRADE_COLORS: Record<Grade, string> = {
  1: '#ff6f91',
  2: '#ff9f1c',
  3: '#2ec27e',
  4: '#3da5ff',
  5: '#9b5cff',
  6: '#ff5ccf',
}
