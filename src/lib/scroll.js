/** Przewijanie strony — jedno miejsce, żeby Lenis i fallback się nie rozjechały. */

const EVT = 'strx:jump'

/**
 * Skok przez zasłonę.
 *
 * Zamiast przewijać przez pół strony w kilka sekund, zaciągam kurtynę,
 * pod nią przenoszę widok natychmiast i odsłaniam w nowym miejscu.
 * Jeżeli `Jump` nie jest zamontowany (albo ktoś ma wyłączone animacje),
 * `run()` wykonuje się od razu i wszystko działa jak zwykły scroll.
 */
function curtain(run) {
  if (typeof window === 'undefined') return run()
  const wants = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (wants || !window.__jump) return run()
  return window.dispatchEvent(new CustomEvent(EVT, { detail: run }))
}

const hardTo = (y) => {
  if (window.__lenis) window.__lenis.scrollTo(y, { immediate: true, force: true })
  else window.scrollTo(0, y)
}

export const goTo = (id) => {
  const el = document.getElementById(id)
  if (!el) return
  const y = el.getBoundingClientRect().top + window.scrollY - 70
  curtain(() => hardTo(Math.max(0, y)))
}

/**
 * Koniec **treści**, a nie koniec dokumentu.
 *
 * Za finałem stoi echo pierwszej sekcji (szew pętli), więc skok na
 * `scrollHeight` lądował w środku echa — a tam od razu domykała się
 * pętla i zamiast kontaktu dostawało się początek strony. Stąd „Kontakt"
 * w menu nie działał. Celujemy więc w miejsce, w którym finał widać
 * w całości, czyli tuż przed szwem.
 */
export const endOfPage = () => {
  const echo = document.querySelector('.echo')
  const doc = document.documentElement.scrollHeight
  if (!echo) return doc
  const szew = echo.getBoundingClientRect().top + window.scrollY
  return Math.max(0, szew - window.innerHeight)
}

export const goToEnd = () => {
  curtain(() => hardTo(endOfPage()))
}

export const goToTop = () => {
  curtain(() => hardTo(0))
}

export const JUMP_EVENT = EVT
