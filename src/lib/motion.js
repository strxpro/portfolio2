/**
 * Jeden rytm dla całej strony.
 *
 * Wcześniej każdy komponent miał własną krzywą i własne czasy — trzy
 * różne „ease" i animacje po 0,85–1,1 s. To właśnie od tego strona
 * wydawała się ociężała: nie od liczby efektów, tylko od tego, że każdy
 * z nich trwał dwa razy dłużej, niż trzeba.
 *
 * Zasady, które tu obowiązują:
 *  · ruch startuje natychmiast i spokojnie dochodzi — bez odbicia;
 *  · reakcja na dotyk jest krótsza niż jedna piąta sekundy;
 *  · elementy nigdy nie wjeżdżają od zera, tylko od 0,94 skali;
 *  · rzeczy ciężkie (panel, kurtyna) mają własną, wolniejszą sprężynę.
 */

/* ── krzywe ─────────────────────────────────────────── */
export const EASE = [0.22, 0.61, 0.36, 1] // wjazd treści
export const EASE_SOFT = [0.4, 0, 0.2, 1] // zamiana jednego na drugie
export const EASE_CUT = [0.83, 0, 0.17, 1] // cięcia i zasłony

/* ── czasy ──────────────────────────────────────────── */
export const DUR = {
  tap: 0.16,
  fast: 0.26,
  base: 0.42,
  slow: 0.62,
}

/* ── sprężyny ───────────────────────────────────────── */
export const SPRING = {
  /** reakcja na kursor i dotyk — ma być natychmiastowa */
  press: { type: 'spring', stiffness: 520, damping: 34, mass: 0.55 },
  /** wjazd elementu w kadr */
  enter: { type: 'spring', stiffness: 280, damping: 30, mass: 0.85 },
  /** wygładzanie wartości sterowanych scrollem */
  /* Kamera. Miękko, bo to ona niesie wrażenie „płynnie": przy 190/34
     ruch nadążał za kółkiem co do piksela i przez to był twardy —
     zatrzymywał się dokładnie wtedy, gdy przestawałeś kręcić. */
  scroll: { stiffness: 130, damping: 30, mass: 1.1, restDelta: 0.001 },
  /** rzeczy z masą: panel kontaktu, płyty, kurtyna */
  heavy: { type: 'spring', stiffness: 130, damping: 25, mass: 1.15 },
}

/** Odstęp między kolejnymi elementami serii. */
export const STEP = 0.045

/** Standardowe wejście: z dołu, lekko pomniejszone, bez skoku od zera. */
export const rise = (delay = 0) => ({
  initial: { opacity: 0, y: 14, scale: 0.985 },
  whileInView: { opacity: 1, y: 0, scale: 1 },
  viewport: { once: true, amount: 0.35 },
  transition: { duration: DUR.slow, delay, ease: EASE },
})

/** Podniesienie pod kursorem — krótkie, bez sprężynowania w bok. */
export const lift = {
  whileHover: { y: -3 },
  whileTap: { scale: 0.975 },
  transition: SPRING.press,
}
