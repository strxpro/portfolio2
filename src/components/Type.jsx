import { Fragment } from 'react'
import { motion } from 'framer-motion'
import { EASE } from '../lib/motion'

/**
 * Napis wjeżdżający spod maski — **wierszami, nie słowami**.
 *
 * Wcześniej każde słowo miało własną maskę i własną animację. Dwie
 * rzeczy przemawiały przeciw temu: każde słowo trzymało na stałe
 * `will-change: transform`, więc na stronie wisiały 92 warstwy GPU
 * składane w każdej klatce przewijania, a tekst sypiący się wyraz po
 * wyrazie to jeden z najbardziej rozpoznawalnych chwytów generowanych
 * stron. Wiersz wjeżdżający w całości czyta się spokojniej.
 *
 * Tekst wiersza jest zwykłym ciągiem, więc spacje, łamanie, kopiowanie
 * i czytnik ekranu działają normalnie. Pionową kreską `|` dzielisz
 * tekst na wiersze.
 */


const TAGS = {
  h1: motion.h1,
  h2: motion.h2,
  h3: motion.h3,
  h4: motion.h4,
  p: motion.p,
  span: motion.span,
  div: motion.div,
}

export default function Type({
  as = 'span',
  text,
  className = '',
  delay = 0,
  stagger = 0.026,
  duration = 0.78,
  amount = 0.5,
  once = true,
  onMount = false,
}) {
  const Tag = TAGS[as] ?? motion.span
  const lines = String(text).split(/[|\n]/)

  // odstęp liczony dla wierszy; stare wartości dla słów (0.014–0.026) byłyby niewidoczne
  const krok = Math.max(stagger, 0.09)
  const parent = {
    hidden: {},
    show: { transition: { staggerChildren: krok, delayChildren: delay } },
  }
  const child = {
    hidden: { y: '105%', opacity: 0 },
    show: {
      y: '0%',
      opacity: 1,
      transition: { duration, ease: EASE, opacity: { duration: duration * 0.5 } },
    },
  }

  const gate = onMount
    ? { initial: 'hidden', animate: 'show' }
    : { initial: 'hidden', whileInView: 'show', viewport: { once, amount } }

  return (
    <Tag className={className} variants={parent} {...gate}>
      {lines.map((line, li) => (
        <Fragment key={li}>
          <span className="t-line">
            <motion.span className="t-in" variants={child}>{line.trim()}</motion.span>
          </span>
          {/* spacja między wierszami: na ekranie jej nie widać (wiersze są
              blokami), ale kopiowany tekst i czytnik ekranu nie sklejają
              „aplikacjeod projektu" */}
          {li < lines.length - 1 ? ' ' : null}
        </Fragment>
      ))}
    </Tag>
  )
}
