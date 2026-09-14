import { dostepnosc as D } from '../data/site'

/**
 * Wolne terminy rozmowy, liczone w czasie Europe/Rome (= czas polski).
 *
 * Wszystko operuje na „czasie ściennym” strefy, a nie na obiektach Date
 * w strefie przeglądarki: gość z Londynu ma widzieć 14:30 jako 14:30 u
 * Claudia, a nie przeliczone na swój zegar. Dzień to napis „RRRR-MM-DD”,
 * godzina to „GG:MM” — dokładnie to leci potem do Workera.
 */

const pad = (n) => String(n).padStart(2, '0')

/** Teraz, rozłożone na części w strefie Europe/Rome. */
export function terazWStrefie(now = new Date()) {
  const cz = Object.fromEntries(
    new Intl.DateTimeFormat('en-GB', {
      timeZone: D.strefa, year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
    }).formatToParts(now).map((p) => [p.type, p.value]),
  )
  return { r: +cz.year, m: +cz.month, d: +cz.day, g: +cz.hour, min: +cz.minute }
}

/** Liczba minut „ściennych” od epoki — tylko do porównań w obrębie strefy. */
const minuty = (r, m, d, g, min) => Date.UTC(r, m - 1, d, g, min) / 60000

export const kluczDnia = (r, m, d) => `${r}-${pad(m)}-${pad(d)}`

/** Dzień tygodnia 1–7 (pon–nie) dla daty kalendarzowej, niezależnie od strefy. */
export const dzienTygodnia = (r, m, d) => ((new Date(Date.UTC(r, m - 1, d)).getUTCDay() + 6) % 7) + 1

/** Wszystkie połówki godzin w ramach dostępności. */
export const GODZINY = Array.from({ length: D.do - D.od }, (_, i) => D.od + i)
export const MINUTY = [0, 30]

/** Czy konkretny termin jest do wybrania (dzień roboczy, w ramach, nie za wcześnie). */
export function wolny(r, m, d, g, min, now = new Date()) {
  if (!D.dni.includes(dzienTygodnia(r, m, d))) return false
  if (g < D.od || g >= D.do || !MINUTY.includes(min)) return false
  const t = terazWStrefie(now)
  const teraz = minuty(t.r, t.m, t.d, t.g, t.min)
  const kiedy = minuty(r, m, d, g, min)
  if (kiedy < teraz + D.wyprzedzenie * 60) return false
  return kiedy <= teraz + D.naprzod * 24 * 60
}

/** Czy w danym dniu jest choć jeden wolny termin. */
export const dzienWolny = (r, m, d, now = new Date()) =>
  GODZINY.some((g) => MINUTY.some((min) => wolny(r, m, d, g, min, now)))

/** Siatka miesiąca od poniedziałku: null w pustych polach. */
export function siatkaMiesiaca(r, m) {
  const pierwszy = dzienTygodnia(r, m, 1)
  const dni = new Date(Date.UTC(r, m, 0)).getUTCDate()
  return [
    ...Array.from({ length: pierwszy - 1 }, () => null),
    ...Array.from({ length: dni }, (_, i) => ({ r, m, d: i + 1 })),
  ]
}

/** Najbliższe wolne terminy — do szybkiego wyboru jednym dotknięciem. */
export function najblizsze(ile = 3, now = new Date()) {
  const t = terazWStrefie(now)
  const wynik = []
  const start = Date.UTC(t.r, t.m - 1, t.d)
  for (let dzien = 0; dzien <= D.naprzod && wynik.length < ile; dzien++) {
    const dt = new Date(start + dzien * 86400000)
    const r = dt.getUTCFullYear(), m = dt.getUTCMonth() + 1, d = dt.getUTCDate()
    // z jednego dnia najwyżej dwa terminy, żeby propozycje nie były trzema godzinami jutra
    let zDnia = 0
    for (const g of GODZINY) {
      for (const min of MINUTY) {
        if (wynik.length >= ile || zDnia >= 2) break
        // przeskakujemy co półtorej godziny, żeby propozycje się różniły
        if (zDnia === 1 && g < wynik.at(-1).g + 3) continue
        if (wolny(r, m, d, g, min, now)) {
          wynik.push({ r, m, d, g, min, dzien: kluczDnia(r, m, d), godzina: `${pad(g)}:${pad(min)}` })
          zDnia++
        }
      }
    }
  }
  return wynik
}

export const formatGodziny = (g, min) => `${pad(g)}:${pad(min)}`
