import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useT } from '../lib/lang-ctx'
import { goToEnd } from '../lib/scroll'

/** Guzik, który wjeżdża po zejściu z hero i zostaje pod ręką aż do kontaktu. */
export default function StickyCta() {
  const t = useT()
  const [show, setShow] = useState(false)

  /**
   * Guzik pokazuje się dopiero, gdy przestaniesz przewijać.
   *
   * W trakcie scrolla chowa się, żeby nie zasłaniał treści akurat wtedy,
   * kiedy ją czytasz — na telefonie to była największa uciążliwość.
   * Znika też, gdy otwarty jest podgląd strony (`body.locked`).
   */
  useEffect(() => {
    let idle
    const decide = () => {
      const y = window.scrollY
      const max = document.documentElement.scrollHeight - window.innerHeight
      const inRange = y > window.innerHeight * 0.9 && y < max - window.innerHeight * 0.9
      setShow(inRange && !document.body.classList.contains('locked'))
    }
    const onScroll = () => {
      setShow(false)
      clearTimeout(idle)
      idle = setTimeout(decide, 420)
    }
    idle = setTimeout(decide, 500)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      clearTimeout(idle)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  return (
    <AnimatePresence>
      {show && (
        <motion.button
          className="sticky-cta"
          onClick={goToEnd}
          initial={{ y: 90, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 90, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 26 }}
          whileHover={{ y: -3 }}
          whileTap={{ scale: 0.96 }}
        >
          <span className="sticky-dot" />
          <span className="sticky-long">{t.sticky.long}</span>
          <span className="sticky-short">{t.sticky.short}</span>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </motion.button>
      )}
    </AnimatePresence>
  )
}
