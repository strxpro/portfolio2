import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

/**
 * Zniekształcenie obiektywu przy powiększaniu ramki.
 *
 * Trzy warstwy, wszystkie tylko na czas otwarcia:
 *  · `lens`  — wybrzuszenie: przezroczysty środek, ciemniejsze i coraz
 *              gęstsze brzegi, które kurczą się do zera. Oko czyta to
 *              jak szkło, przez które kadr się prostuje.
 *  · `rgb`   — rozjazd kanałów na krawędziach (czerwony w jedną stronę,
 *              cyjan w drugą), zbiegający się do idealnego pasowania.
 *  · `scan`  — jedno przemknięcie linii poziomych.
 *
 * Po animacji wszystko znika z drzewa, więc żywa strona pod spodem
 * nie płaci ani jednej klatki za efekt.
 */
export default function Warp({ run = 1050 }) {
  const [on, setOn] = useState(true)

  useEffect(() => {
    const id = setTimeout(() => setOn(false), run + 260)
    return () => clearTimeout(id)
  }, [run])

  if (!on) return null
  const s = run / 1000

  return (
    <div className="warp" aria-hidden="true">
      <motion.span
        className="warp-lens"
        initial={{ opacity: 1, scale: 1 }}
        animate={{ opacity: 0, scale: 1.7 }}
        transition={{ duration: s, ease: [0.2, 0.9, 0.25, 1] }}
      />
      <motion.span
        className="warp-rgb r"
        initial={{ x: -22, y: -8, opacity: 0.9 }}
        animate={{ x: 0, y: 0, opacity: 0 }}
        transition={{ duration: s * 0.92, ease: [0.16, 1, 0.3, 1] }}
      />
      <motion.span
        className="warp-rgb c"
        initial={{ x: 22, y: 8, opacity: 0.9 }}
        animate={{ x: 0, y: 0, opacity: 0 }}
        transition={{ duration: s * 0.92, ease: [0.16, 1, 0.3, 1] }}
      />
      <motion.span
        className="warp-scan"
        initial={{ opacity: 0.5, y: '-100%' }}
        animate={{ opacity: 0, y: '100%' }}
        transition={{ duration: s * 0.8, ease: 'easeOut' }}
      />
    </div>
  )
}
