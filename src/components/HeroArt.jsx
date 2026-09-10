import { useRef } from 'react'
import { motion, useScroll, useSpring, useTransform } from 'framer-motion'
import { useLoopSpring } from '../lib/useLoopSpring'
import { usePointer } from '../lib/usePointer'
import { EASE, SPRING } from '../lib/motion'

/**
 * Rysunki rozstawione wokół hero.
 *
 * Sześć znaków z tego, z czego składa się robota: okno przeglądarki,
 * kursor, nawias klamrowy, bryła, przepływ automatyzacji i siatka
 * układu. Każdy leży na innej głębokości, więc przy ruchu myszy i przy
 * scrollu przesuwają się w różnym tempie — to daje wrażenie wchodzenia
 * w kadr, a nie przesuwania naklejek.
 *
 * Rysują się linia po linii przy wejściu na stronę i odjeżdżają w górę,
 * kiedy scroll zabiera hero.
 */

const A = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round' }

const draw = (i, d = 1) => ({
  initial: { pathLength: 0, opacity: 0 },
  animate: { pathLength: 1, opacity: 1 },
  transition: {
    pathLength: { duration: d, delay: 0.5 + i * 0.11, ease: EASE },
    opacity: { duration: 0.2, delay: 0.5 + i * 0.11 },
  },
})

/** [lewa %, góra %, głębokość 0–1, rozmiar px, rysunek] */
const MARKS = [
  // okno przeglądarki
  [5, 30, 0.9, 84, (
    <>
      <motion.path d="M4 10h64v42H4z" {...A} {...draw(0)} />
      <motion.path d="M4 20h64" {...A} {...draw(1, 0.5)} />
      <motion.circle cx="11" cy="15" r="1.8" fill="currentColor" {...draw(2, 0.3)} />
      <motion.path d="M14 30h30M14 38h44M14 46h22" {...A} {...draw(3, 0.7)} />
    </>
  )],
  // kursor
  [9, 68, 0.55, 44, (
    <>
      <motion.path d="M12 8l24 22-11 2 6 13-5 2-6-13-8 7z" {...A} {...draw(4, 0.8)} />
    </>
  )],
  // nawias klamrowy
  [93, 22, 0.75, 52, (
    <>
      <motion.path d="M22 8c-7 0-7 8-7 14s-6 6-6 6 6 0 6 6 0 14 7 14" {...A} {...draw(1, 0.9)} />
      <motion.path d="M32 8c7 0 7 8 7 14s6 6 6 6-6 0-6 6 0 14-7 14" {...A} {...draw(2, 0.9)} />
    </>
  )],
  // bryła 3D
  [95, 62, 1, 58, (
    <>
      <motion.path d="M31 6l25 14v22L31 56 6 42V20z" {...A} {...draw(3, 1.1)} />
      <motion.path d="M31 6v20l25 14M31 26L6 40M31 26v30" {...A} opacity="0.55" {...draw(4, 0.9)} />
    </>
  )],
  // przepływ automatyzacji
  [66, 93, 0.4, 62, (
    <>
      <motion.circle cx="10" cy="20" r="5" {...A} {...draw(5, 0.5)} />
      <motion.circle cx="33" cy="20" r="5" {...A} {...draw(6, 0.5)} />
      <motion.circle cx="56" cy="20" r="5" {...A} {...draw(7, 0.5)} />
      <motion.path d="M15 20h13M38 20h13" {...A} strokeDasharray="2 4" {...draw(8, 0.6)} />
    </>
  )],
  // siatka układu
  [40, 7, 0.3, 44, (
    <>
      <motion.path d="M6 6h38v38H6z" {...A} {...draw(2, 0.8)} />
      <motion.path d="M25 6v38M6 25h38" {...A} opacity="0.5" {...draw(3, 0.6)} />
    </>
  )],
]

function Mark({ spec, scroll }) {
  const [left, top, depth, size, art] = spec
  const { x, y } = usePointer(60, 22)

  // im „bliżej", tym mocniej reaguje na kursor i tym szybciej odjeżdża
  const mx = useSpring(useTransform(x, [-1, 1], [24 * depth, -24 * depth]), SPRING.enter)
  const my = useSpring(useTransform(y, [-1, 1], [16 * depth, -16 * depth]), SPRING.enter)
  const away = useTransform(scroll, [0, 1], [0, -180 * depth])
  const fade = useTransform(scroll, [0, 0.75], [1, 0])
  const turn = useTransform(x, [-1, 1], [7 * depth, -7 * depth])

  return (
    <motion.span
      className="hmark"
      style={{
        left: `${left}%`,
        top: `${top}%`,
        width: size,
        x: mx,
        y: useTransform([my, away], ([a, b]) => a + b),
        rotate: turn,
        opacity: fade,
      }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 72 62">{art}</svg>
    </motion.span>
  )
}

export default function HeroArt() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const scroll = useLoopSpring(scrollYProgress)

  return (
    <div className="hart" ref={ref} aria-hidden="true">
      {MARKS.map((spec, i) => (
        <Mark key={i} spec={spec} scroll={scroll} />
      ))}
    </div>
  )
}
