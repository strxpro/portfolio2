import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring, useTransform, animate } from 'framer-motion'
import { me } from '../data/site'
import { useT } from '../lib/lang-ctx'
import { EASE } from '../lib/motion'

/**
 * Rozruch jak przygotowanie arkusza do druku: rysuje się ramka formatu,
 * w środku wstaje sygnet, licznik dobija do stu, a na koniec arkusz
 * rozsuwa się na boki i odsłania stronę.
 */

const HOLD = 2050
const OUT = 900

export default function Loader({ onDone }) {
  const t = useT()
  const [line, setLine] = useState(0)
  const [out, setOut] = useState(false)
  const n = useMotionValue(0)
  const shown = useSpring(n, { stiffness: 80, damping: 22 })
  const pct = useTransform(shown, (v) => String(Math.round(v)).padStart(3, '0'))

  useEffect(() => {
    const run = animate(n, 100, { duration: HOLD / 1000, ease: [0.35, 0, 0.1, 1] })
    const iv = setInterval(() => setLine((i) => Math.min(i + 1, 3)), HOLD / 4)
    const leave = setTimeout(() => setOut(true), HOLD)
    const done = setTimeout(onDone, HOLD + OUT)
    return () => {
      run.stop()
      clearInterval(iv)
      clearTimeout(leave)
      clearTimeout(done)
    }
  }, [n, onDone])

  const half = { duration: OUT / 1000, ease: [0.76, 0, 0.24, 1] }

  return (
    <div className="boot" aria-hidden="true">
      <motion.span className="boot-half l" animate={out ? { x: '-100%' } : { x: 0 }} transition={half} />
      <motion.span className="boot-half r" animate={out ? { x: '100%' } : { x: 0 }} transition={half} />

      <motion.div
        className="boot-plate"
        animate={out ? { opacity: 0, scale: 1.03 } : { opacity: 1, scale: 1 }}
        transition={{ duration: 0.36, ease: EASE }}
      >
        <svg className="boot-frame" viewBox="0 0 400 240" preserveAspectRatio="none">
          <motion.rect
            x="1"
            y="1"
            width="398"
            height="238"
            fill="none"
            stroke="var(--ink-3)"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.7, ease: EASE }}
          />
        </svg>

        <span className="boot-tick tl" />
        <span className="boot-tick tr" />
        <span className="boot-tick bl" />
        <span className="boot-tick br" />

        <div className="boot-mark">
          {me.brand.split('').map((c, i) => (
            <span className="t-word" key={i}>
              <motion.span
                initial={{ y: '110%' }}
                animate={{ y: '0%' }}
                transition={{ delay: 0.35 + i * 0.07, duration: 0.54, ease: EASE }}
              >
                {c}
              </motion.span>
            </span>
          ))}
        </div>

        <motion.div
          className="boot-rule"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.5, duration: 0.66, ease: EASE }}
        />

        <div className="boot-meta">
          <motion.span className="boot-pct">{pct}</motion.span>
          <span className="boot-line">
            <span className="t-word">
              <motion.span
                key={line}
                initial={{ y: '110%' }}
                animate={{ y: '0%' }}
                transition={{ duration: 0.45, ease: EASE }}
              >
                {t.loader[line]}
              </motion.span>
            </span>
          </span>
        </div>
      </motion.div>
    </div>
  )
}
