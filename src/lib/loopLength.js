/**
 * Długość pętli strony i „rozwijanie” jej przeskoków.
 *
 * Pętla cofa pozycję dokładnie o odległość od góry dokumentu do echa
 * (`.echo`). Dla każdego, kto liczy coś z przyrostów przewijania, taki
 * przeskok jest fałszywy — w kadrze nic się nie zmieniło.
 *
 * Wcześniej tło dowiadywało się o nim ze zdarzenia `strx:loop`. To
 * zakładało, że zdarzenie i zmiana pozycji przyjdą w ustalonej kolejności,
 * a na telefonie tak nie jest: przewijanie z rozpędem potrafi zignorować
 * `scrollTo`, pętla próbuje ponownie i to samo cofnięcie było odejmowane
 * dwa razy — gwiazdy teleportowały się o kawał kafla.
 *
 * `rozwin` nie potrzebuje żadnego zdarzenia. Przyrost dłuższy niż pół
 * pętli sprowadza do najbliższego równoważnego, tak jak rozwija się kąt
 * przechodzący przez 360°. Przeskok pętli daje wtedy prawie zero, bez
 * względu na to, ile razy i w jakiej kolejności nastąpił.
 */
let pamiec = 0

export function dlugoscPetli() {
  if (pamiec) return pamiec
  const e = document.querySelector('.echo')
  pamiec = e ? Math.round(e.getBoundingClientRect().top + window.scrollY) : 0
  return pamiec
}

export function zapomnijDlugosc() { pamiec = 0 }

export function rozwin(przyrost, dlugosc) {
  if (!dlugosc || Math.abs(przyrost) <= dlugosc / 2) return przyrost
  return przyrost - Math.round(przyrost / dlugosc) * dlugosc
}
