import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { JUMP_EVENT } from '../lib/scroll'
import { me } from '../data/site'
import { isOn, sweep } from '../lib/sound'
import { EASE } from '../lib/motion'

const COLS = 7

/**
 * Kurtyna między sekcjami.
 *
 * Siedem pionowych listw wjeżdża z góry jedna po drugiej, pod nimi widok
 * przeskakuje natychmiast w docelowe miejsce, a potem listwy schodzą
 * w dół — więc odsłania się już nowa sekcja. Zamiast kilkusekundowego
 * przewijania przez pół strony jest jedno cięcie, jak w montażu.
 *
 * Kurtynę wyzwala `scroll.js` zdarzeniem, a `window.__jump` mówi mu,
 * że komponent w ogóle jest na stronie.
 */
export default function Jump() {
  const [busy, setBusy] = useState(false)
  const job = useRef(null)
  const bezpiecznik = useRef(null)

  /**
   * Skok wisi na `onAnimationComplete` ostatniej listwy — a to znaczy,
   * że wystarczy, by ta animacja nie dobiegła, i **nic się nie dzieje**.
   * Gorzej: `job` zostaje zajęty, więc każde kolejne kliknięcie w menu
   * jest już ignorowane i nawigacja zatrzaskuje się na dobre.
   *
   * Zdarza się to realnie: karta w tle, wstrzymany `requestAnimationFrame`,
   * przycięcie przy wczytywaniu. Dlatego jest bezpiecznik — jeśli listwy
   * nie zamelduja się w pół sekundy, skok wykonuje się mimo wszystko.
   * Lepiej ciąć bez zasłony niż nie ruszyć się wcale.
   */
  const covered = useCallback(() => {
    clearTimeout(bezpiecznik.current)
    const run = job.current
    job.current = null
    run?.()
    setBusy(false)
  }, [])

  useEffect(() => {
    window.__jump = true
    const onJump = (e) => {
      if (job.current) return
      job.current = e.detail
      if (isOn()) sweep()
      setBusy(true)
      clearTimeout(bezpiecznik.current)
      bezpiecznik.current = setTimeout(covered, 520)
    }
    window.addEventListener(JUMP_EVENT, onJump)
    return () => {
      clearTimeout(bezpiecznik.current)
      delete window.__jump
      window.removeEventListener(JUMP_EVENT, onJump)
    }
  }, [covered])

  /* Sam skok siedzi w `covered` wyżej. Nie wolno tam wołać `lenis.stop()`
     przed przeskokiem — zatrzymany Lenis ignoruje `scrollTo` i widok
     zostaje tam, gdzie był; dlatego `scroll.js` skacze z `force`. */

  return (
    <AnimatePresence>
      {busy && (
        <motion.div className="jump" key="jump" aria-hidden="true">
          {Array.from({ length: COLS }, (_, i) => (
            <motion.span
              key={i}
              className="jump-slat"
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              exit={{ scaleY: 0, originY: 1 }}
              transition={{
                duration: 0.34,
                ease: EASE,
                delay: i * 0.035,
                ...(i === COLS - 1 ? {} : {}),
              }}
              style={{ originY: 0 }}
              onAnimationComplete={i === COLS - 1 ? covered : undefined}
            />
          ))}

          <motion.span
            className="jump-mark"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, delay: 0.16 }}
          >
            {me.brand}
            <i />
          </motion.span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
