import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { brush, enable, isOn, tick, wanted } from '../lib/sound'
import { useT } from '../lib/lang-ctx'
import { SPRING } from '../lib/motion'

/**
 * Przełącznik dźwięku — jak na stronach, które robią to porządnie.
 *
 * Domyślnie cisza. Nie dlatego, że tak wolę, tylko dlatego, że
 * przeglądarki i tak blokują dźwięk przed pierwszym kliknięciem, a
 * strona, która sama zaczyna grać, wygania ludzi. Po włączeniu
 * wszystko odzywa się samo: guziki, karty, przejścia, tło w scenie 3D.
 *
 * Wybór zapamiętuje się między wizytami.
 */
export default function Sound() {
  const t = useT()
  const [live, setLive] = useState(false)

  // przy powrocie wznawiamy przy pierwszym dotknięciu strony
  useEffect(() => {
    if (!wanted()) return undefined
    const wake = () => {
      enable(true)
      setLive(true)
      window.removeEventListener('pointerdown', wake)
      window.removeEventListener('keydown', wake)
    }
    window.addEventListener('pointerdown', wake, { once: true })
    window.addEventListener('keydown', wake, { once: true })
    return () => {
      window.removeEventListener('pointerdown', wake)
      window.removeEventListener('keydown', wake)
    }
  }, [])

  /**
   * Guziki i zakładki odzywają się same.
   *
   * Zamiast obwieszać każdy komponent obsługą dźwięku, jeden nasłuch
   * na całym dokumencie sprawdza, czy kliknięcie trafiło w coś, co ma
   * brzmieć. Dzięki temu nowy guzik gdziekolwiek na stronie dostaje
   * dźwięk za darmo, a komponenty nic o dźwięku nie wiedzą.
   */
  useEffect(() => {
    const SEL = 'button, a, .scope-chip, .lab-tabs button, .langs button, .svc-list li'
    const onClick = (e) => { if (isOn() && e.target.closest(SEL)) tick() }
    let last = 0
    const onOver = (e) => {
      if (!isOn()) return
      const now = performance.now()
      if (now - last < 70) return
      if (!e.target.closest(SEL)) return
      last = now
      brush()
    }
    document.addEventListener('click', onClick)
    document.addEventListener('pointerover', onOver)
    return () => {
      document.removeEventListener('click', onClick)
      document.removeEventListener('pointerover', onOver)
    }
  }, [])

  const flip = () => {
    const next = !live
    setLive(next)
    enable(next)
    if (next) tick()
  }

  return (
    <motion.button
      className={`snd ${live ? 'on' : ''}`}
      onClick={flip}
      aria-pressed={live}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.96 }}
      transition={SPRING.press}
    >
      <span className="snd-bars" aria-hidden="true">
        {[0, 1, 2, 3].map((i) => (
          <motion.i
            key={i}
            animate={live ? { scaleY: [0.3, 1, 0.5, 0.85, 0.3] } : { scaleY: 0.25 }}
            transition={
              live
                ? { duration: 1.4 + i * 0.25, repeat: Infinity, ease: 'easeInOut', delay: i * 0.1 }
                : { duration: 0.24 }
            }
          />
        ))}
      </span>
      {live ? t.sound.on : t.sound.off}
    </motion.button>
  )
}
