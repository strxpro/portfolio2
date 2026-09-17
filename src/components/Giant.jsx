import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useInView, useScroll, useTransform } from 'framer-motion'
import Pixels from './Pixels'
import { work } from '../data/site'
import { useT } from '../lib/lang-ctx'
import { EASE } from '../lib/motion'

let seq = 0

/** Litera, która chodzi w miejscu — każda o pół kroku za sąsiadką. */
function Walker({ ch, i, live }) {
  if (ch === ' ') return <span className="giant-gap">&nbsp;</span>
  return (
    <motion.span
      className="giant-ch"
      animate={live ? { y: [0, -16, 0, 6, 0], rotate: [0, -1.6, 0, 1.2, 0] } : { y: 0, rotate: 0 }}
      transition={
        live
          ? { duration: 3.2, repeat: Infinity, ease: 'easeInOut', delay: i * 0.075 }
          : { duration: 0.4, ease: EASE }
      }
    >
      {ch}
    </motion.span>
  )
}

/**
 * Pas z gigantycznym napisem.
 *
 * Litery chodzą w miejscu, cały wiersz dryfuje w bok razem ze scrollem,
 * a spod kursora sypią się kafelki wdrożeń i spadają poza kadr.
 * Animacja liter chodzi tylko wtedy, gdy pas jest na ekranie — inaczej
 * kilkanaście nieskończonych pętli mieliłoby w tle przez całą stronę.
 */
export default function Giant() {
  const t = useT()
  const ref = useRef(null)
  const band = useRef(null)
  const last = useRef({ x: -999, y: -999 })
  const [drops, setDrops] = useState([])
  const live = useInView(ref, { amount: 0.3 })

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })

  // na wąskim ekranie napis ledwo się mieści, więc dryf w bok znika —
  // inaczej pierwsza litera wyjeżdżałaby poza kadr
  const [narrow, setNarrow] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 760px)')
    const put = () => setNarrow(mq.matches)
    put()
    mq.addEventListener('change', put)
    return () => mq.removeEventListener('change', put)
  }, [])

  const span = narrow ? 0 : 1
  const driftA = useTransform(scrollYProgress, [0, 1], [`${4 * span}%`, `${-6 * span}%`])
  const driftB = useTransform(scrollYProgress, [0, 1], [`${-5 * span}%`, `${5 * span}%`])

  const spawn = useCallback((e) => {
    const box = band.current
    if (!box) return
    const r = box.getBoundingClientRect()
    const x = e.clientX - r.left
    const y = e.clientY - r.top

    const dx = x - last.current.x
    const dy = y - last.current.y
    if (dx * dx + dy * dy < 4900) return // co ~70 px ruchu, nie co klatkę
    last.current = { x, y }

    const w = work[seq % work.length]
    const id = ++seq
    setDrops((s) => [
      ...s.slice(-13),
      { id, x, y, tint: w.tint, host: w.host, spin: (Math.random() - 0.5) * 70, sway: (Math.random() - 0.5) * 90 },
    ])
  }, [])

  // sprzątanie: kafelek żyje 1,7 s, potem znika z listy
  useEffect(() => {
    if (!drops.length) return undefined
    const id = setTimeout(() => setDrops((s) => s.slice(1)), 1700)
    return () => clearTimeout(id)
  }, [drops])

  const lines = String(t.giant.text).split('|')

  return (
    <section className="giant" ref={ref} aria-label={t.giant.text.replace(/\|/g, ' ')}>
      <div className="giant-band" ref={band} onPointerMove={spawn}>
        <Pixels className="giant-bg" gap={40} tone="light" />
        <motion.div className="giant-row" style={{ x: driftA }} aria-hidden="true">
          {[...lines[0]].map((ch, i) => (
            <Walker key={`a${i}`} ch={ch} i={i} live={live} />
          ))}
        </motion.div>

        {lines[1] && (
          <motion.div className="giant-row thin" style={{ x: driftB }} aria-hidden="true">
            {[...lines[1]].map((ch, i) => (
              <Walker key={`b${i}`} ch={ch} i={i + 3} live={live} />
            ))}
          </motion.div>
        )}

        <AnimatePresence>
          {drops.map((d) => (
            <motion.span
              key={d.id}
              className="giant-drop"
              style={{ left: d.x, top: d.y, background: d.tint }}
              initial={{ opacity: 0, scale: 0.4, y: -10, rotate: 0 }}
              animate={{ opacity: [0, 1, 1, 0], scale: 1, y: 460, x: d.sway, rotate: d.spin }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.7, ease: [0.3, 0, 0.7, 1], opacity: { times: [0, 0.1, 0.7, 1], duration: 1.7 } }}
            >
              {d.host || t.tour.wip}
            </motion.span>
          ))}
        </AnimatePresence>

      </div>
    </section>
  )
}
