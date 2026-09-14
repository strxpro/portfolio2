/**
 * Sprawdzanie e-maila i telefonu w formularzu kontaktowym.
 *
 * Bez biblioteki numerów telefonów: pełna (libphonenumber) waży ponad
 * 100 kB, a tu wystarczy pilnować długości numeru dla najczęstszych
 * kierunkowych gości tej strony. Worker sprawdza to samo po swojej
 * stronie (worker/index.js) — przeglądarce nie można ufać.
 */

/**
 * Kierunkowe: [kod, flaga, najmniej cyfr, najwięcej cyfr].
 * Długości to numer BEZ kierunkowego i bez zera na początku tam,
 * gdzie przy połączeniu z zagranicy się go nie wybiera.
 */
export const KIERUNKOWE = [
  ['+48', '🇵🇱', 9, 9],
  ['+39', '🇮🇹', 6, 11],
  ['+44', '🇬🇧', 10, 10],
  ['+49', '🇩🇪', 7, 12],
  ['+33', '🇫🇷', 9, 9],
  ['+34', '🇪🇸', 9, 9],
  ['+41', '🇨🇭', 9, 9],
  ['+43', '🇦🇹', 7, 13],
  ['+31', '🇳🇱', 9, 9],
  ['+32', '🇧🇪', 8, 9],
  ['+420', '🇨🇿', 9, 9],
  ['+380', '🇺🇦', 9, 9],
  ['+1', '🇺🇸', 10, 10],
]

export const domyslneKierunkowe = (jezyk) => (jezyk === 'it' ? '+39' : jezyk === 'en' ? '+44' : '+48')

/** Poprawny adres: coś@coś.domena, bez spacji, domena najwyższego rzędu min. 2 znaki. */
export const emailPoprawny = (v) => /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)*\.[a-z]{2,}$/i.test(String(v).trim())

/** Same cyfry numeru, bez spacji, kresek i nawiasów. */
export const cyfry = (v) => String(v).replace(/[\s\-().]/g, '')

/**
 * Wynik: { ok: true } albo { ok: false, min, max } — długości do komunikatu.
 * Wiodące zero przy +39 zostaje (numery stacjonarne we Włoszech je mają).
 */
export function telefonPoprawny(kod, numer) {
  const c = cyfry(numer)
  const reg = KIERUNKOWE.find(([k]) => k === kod)
  if (!/^\d+$/.test(c)) return { ok: false, min: reg?.[2], max: reg?.[3] }
  const [, , min, max] = reg || [null, null, 6, 13]
  return c.length >= min && c.length <= max ? { ok: true } : { ok: false, min, max }
}

/** Numer do wyświetlenia i wysyłki: „+48 600 111 222”. */
export function telefonCzytelny(kod, numer) {
  const c = cyfry(numer)
  return `${kod} ${c.replace(/(\d{3})(?=\d)/g, '$1 ')}`.trim()
}
