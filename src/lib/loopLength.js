/**
 * Długość pętli strony: odległość od góry dokumentu do echa (`.echo`).
 *
 * Dokładnie o tyle `Loop` cofa pozycję na szwie. Każda warstwa, która
 * liczy się z przewijania okresowo — z okresem równym tej długości —
 * wygląda po przeskoku identycznie i nie potrzebuje żadnego zdarzenia.
 *
 * Wynik leży w pamięci, bo pomiar wymusza przeliczenie układu. Unieważnia
 * go `zapomnijDlugosc`, podpinane pod `ResizeObserver` na `body`.
 */
let pamiec = 0

export function dlugoscPetli() {
  if (pamiec) return pamiec
  const e = document.querySelector('.echo')
  pamiec = e ? Math.round(e.getBoundingClientRect().top + window.scrollY) : 0
  return pamiec
}

export function zapomnijDlugosc() { pamiec = 0 }
