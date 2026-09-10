import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useMotionValue, useSpring } from 'framer-motion'
import { useT } from '../lib/lang-ctx'

/**
 * Pierścień w kolorze akcentu, który podąża za kursorem z lekkim
 * opóźnieniem. Systemowa strzałka ZOSTAJE widoczna — pierścień tylko
 * podpowiada, co da się kliknąć, i nie zabiera nic użytkownikowi.
 */
export default function Cursor() {
  const t = useT()
  const x = useMotionValue(-200)
  const y = useMotionValue(-200)
  const sx = useSpring(x, { stiffness: 520, damping: 38, mass: 0.35 })
  const sy = useSpring(y, { stiffness: 520, damping: 38, mass: 0.35 })
  const [mode, setMode] = useState('idle')
  const [label, setLabel] = useState(null)
  const [down, setDown] = useState(false)
  const [on, setOn] = useState(false)

  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return

    let frame = 0
    const move = (e) => {
      x.set(e.clientX)
      y.set(e.clientY)
      if (!on) setOn(true)

      // odpytujemy DOM co drugą klatkę — reszta to czysty transform
      frame = (frame + 1) % 2
      if (frame) return

      const el = e.target instanceof Element ? e.target : null
      if (el?.closest('.tile:not(.invite)')) {
        setMode('label')
        setLabel(t.work.visit)
        return
      }
      if (el?.closest('[data-cursor="obrot"]')) {
        setMode('label')
        setLabel(t.knot.hint)
        return
      }
      if (el?.closest('a, button, .piksel-hit, input, textarea')) {
        setMode('link')
        setLabel(null)
        return
      }
      setMode('idle')
      setLabel(null)
    }

    const d = () => setDown(true)
    const u = () => setDown(false)
    const leave = () => setOn(false)

    window.addEventListener('pointermove', move, { passive: true })
    window.addEventListener('pointerdown', d)
    window.addEventListener('pointerup', u)
    document.addEventListener('mouseleave', leave)
    return () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerdown', d)
      window.removeEventListener('pointerup', u)
      document.removeEventListener('mouseleave', leave)
    }
  }, [x, y, on, t])

  const size = mode === 'label' ? 74 : mode === 'link' ? 46 : 26

  return (
    <motion.div className="cur-wrap" style={{ x: sx, y: sy }} animate={{ opacity: on ? 1 : 0 }}>
      <motion.div
        className={`cur ${mode}`}
        animate={{ width: size, height: size, scale: down ? 0.86 : 1 }}
        transition={{ type: 'spring', stiffness: 380, damping: 28 }}
      >
        <AnimatePresence>
          {label && (
            <motion.span
              key={label}
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              transition={{ duration: 0.16 }}
            >
              {label}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  )
}
