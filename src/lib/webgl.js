/**
 * Czy ta przeglądarka w ogóle da radę narysować scenę 3D.
 *
 * Nie jest to nadgorliwość: kontekst graficzny potrafi nie wstać
 * z powodów, na które strona nie ma wpływu — sterownik na czarnej
 * liście, wyłączona akceleracja, oszczędzanie energii, zdalny pulpit,
 * panel podglądu w narzędziach. Bez tej odpowiedzi sekcja z pracami
 * byłaby w takich miejscach pustą dziurą, a to najważniejsza część
 * strony.
 *
 * Wynik liczymy raz i zapamiętujemy — każde `getContext` to realna
 * próba zajęcia zasobu karty graficznej.
 */
let znane = null

export function hasWebGL() {
  if (znane !== null) return znane
  try {
    const c = document.createElement('canvas')
    znane = Boolean(
      window.WebGLRenderingContext &&
        (c.getContext('webgl2') || c.getContext('webgl') || c.getContext('experimental-webgl')),
    )
  } catch {
    znane = false
  }
  return znane
}
