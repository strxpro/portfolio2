import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useLoopSpring } from '../lib/useLoopSpring'
import { useT } from '../lib/lang-ctx'
import { goTo } from '../lib/scroll'
import { EASE } from '../lib/motion'


/**
 * Warstwy strony, w które się wchodzi.
 *
 * Zamiast trzech rysunków, których nikt nie musi rozszyfrowywać, leżą tu
 * cztery podpisane płyty — dokładnie te warstwy, z których składa się
 * wdrożenie: projekt, kod, dane, automatyzacje. Scroll wprowadza
 * czytelnika między nie: płyty rozjeżdżają się na boki i przelatują za
 * kadr jedna po drugiej, coraz szybciej, aż zostaje samo zdanie.
 *
 * Każda płyta ma własną głębokość, więc odsuwa się w innym tempie —
 * to ta sama zasada, co w sekcji 3D, tylko na płaskich planach.
 */
const PLATES = [
  { z: 0, x: -1, dx: 0, dy: 0, tint: '#E7E2D6' },
  { z: -300, x: 1, dx: 16, dy: -11, tint: '#DCE3E8' },
  { z: -620, x: -1, dx: -22, dy: -24, tint: '#DFE5DA' },
  { z: -960, x: 1, dx: 30, dy: -40, tint: '#EDE3D2' },
]

function Plate({ i, plate, p, label, index }) {
  const step = 0.12 + i * 0.1

  // im głębiej leży płyta, tym później rusza i tym dalej odjeżdża
  const depth = useTransform(p, [0, step + 0.3], [plate.z, 620])
  const slide = useTransform(p, [step, step + 0.34], [0, plate.x * 78])
  const turn = useTransform(p, [step, step + 0.34], [0, plate.x * -14])
  const fade = useTransform(p, [step + 0.16, step + 0.34], [1, 0])

  // przesunięcie w stosie, żeby głębsze płyty wystawały zza wierzchniej
  const shiftX = useTransform(slide, (v) => `${plate.dx + v}%`)

  return (
    <motion.div
      className="plate"
      style={{
        translateZ: depth,
        x: shiftX,
        y: `${plate.dy}%`,
        rotateY: turn,
        opacity: fade,
        background: plate.tint,
      }}
    >
      <span className="plate-name">{label}</span>
      <span className="plate-grid" aria-hidden="true" />
    </motion.div>
  )
}

export default function Handoff() {
  const ref = useRef(null)
  const t = useT()

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const p = useLoopSpring(scrollYProgress)

  const say = useTransform(p, [0.52, 0.76], [0, 1])
  const rise = useTransform(p, [0.52, 0.76], [46, 0])
  const near = useTransform(p, [0.52, 0.9], [0.94, 1])

  return (
    <section className="handoff" ref={ref} id="przekazanie">
      <div className="handoff-stick">
        <div className="plates">
          {PLATES.map((pl, i) => (
            <Plate key={i} i={i} plate={pl} p={p} label={t.handoff.layers[i]} index={i + 1} />
          ))}
        </div>

        <motion.div className="handoff-say" style={{ opacity: say, y: rise, scale: near }}>
          <h2>{t.handoff.title}</h2>
          <p className="handoff-lead">{t.handoff.lead}</p>
          <motion.button
            className="btn big"
            onClick={() => goTo('na-zywo')}
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.3, ease: EASE }}
          >
            {t.handoff.cta}
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14M6 13l6 6 6-6" />
            </svg>
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}
