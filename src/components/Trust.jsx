import { useRef } from 'react'
import { motion, useMotionValue, useTransform } from 'framer-motion'
import Type from './Type'
import { useT } from '../lib/lang-ctx'
import { goToEnd } from '../lib/scroll'
import { EASE, SPRING } from '../lib/motion'
import { useNarrow } from '../lib/useNarrow'

/**
 * Liczba stoi, nie dolicza się od zera.
 *
 * Licznik nabijający wartość przy wejściu w kadr to chwyt z szablonów —
 * i ma wadę praktyczną: kto przewinie szybko albo zrobi zrzut ekranu,
 * widzi „0 stron” i „0.0 na Booking”. Konkretna liczba jest mocniejsza,
 * kiedy po prostu jest.
 */
function Figure({ value }) {
  return <span className="proof-num">{value}</span>
}

function Proof({ row, i }) {
  const [num, unit, title, desc] = row
  const box = useRef(null)

  // karta lekko podąża za kursorem — dotyk, nie karuzela
  const px = useMotionValue(0)
  const py = useMotionValue(0)
  const rx = useTransform(py, [-1, 1], [6, -6])
  const ry = useTransform(px, [-1, 1], [-8, 8])

  const track = (e) => {
    const r = box.current.getBoundingClientRect()
    px.set(((e.clientX - r.left) / r.width) * 2 - 1)
    py.set(((e.clientY - r.top) / r.height) * 2 - 1)
  }
  const reset = () => { px.set(0); py.set(0) }

  return (
    <motion.article
      className="proof"
      ref={box}
      onPointerMove={track}
      onPointerLeave={reset}
      initial={{ opacity: 0, z: -300 }}
      whileInView={{ opacity: 1, z: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ ...SPRING.enter, delay: i * 0.08 }}
      /* rotateX/rotateY zostaja przy kursorze — wejscie rusza sama glebia */
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 900 }}
    >
      <p className="proof-figure">
        <Figure value={num} />
        {unit && <em>{unit}</em>}
      </p>

      <h3 className="proof-title">{title}</h3>
      <p className="proof-desc">{desc}</p>

      <motion.span
        className="proof-rule"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.72, delay: 0.2 + i * 0.07, ease: EASE }}
      />
    </motion.article>
  )
}

/** Cztery dowody zamiast obietnic — każdy sprowadzony do jednej liczby. */
export default function Trust() {
  const t = useT()
  const grid = useRef(null)
  const waski = useNarrow(900)

  return (
    <section className="pad trust" id="zaufanie">
      <div className="wrap">
        <div className="head">
          <div>
            <Type as="h2" className="title" text={t.trust.title} delay={0.08} />
          </div>
          <motion.div
            className="trust-cta"
            initial={waski ? { opacity: 0, y: 10 } : { opacity: 0, z: -170, rotateX: 6 }}
            whileInView={waski ? { opacity: 1, y: 0 } : { opacity: 1, z: 0, rotateX: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={waski ? { duration: 0.4, ease: EASE } : SPRING.enter}
            style={waski ? undefined : { transformPerspective: 900 }}
          >
            <motion.button
              className="btn big"
              onClick={goToEnd}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.975 }}
              transition={SPRING.press}
            >
              {t.trust.cta}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </motion.button>
            <span className="trust-note">{t.trust.note}</span>
          </motion.div>
        </div>

        <div className="proofs" ref={grid}>
          {t.trust.items.map((row, i) => (
            <Proof key={row[2]} row={row} i={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
