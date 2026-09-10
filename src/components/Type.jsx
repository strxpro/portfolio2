import { Fragment } from 'react'
import { motion } from 'framer-motion'
import { EASE } from '../lib/motion'

/**
 * Napis wjeżdżający spod maski, słowo po słowie.
 *
 * Między słowami stoi PRAWDZIWA spacja jako osobny węzeł tekstowy —
 * dzięki temu wiersz ma gdzie się złamać, a skopiowany tekst i czytnik
 * ekranu dostają normalne odstępy zamiast sklejonych wyrazów.
 *
 * Pionową kreską `|` dzielisz tekst na wiersze.
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

  const parent = {
    hidden: {},
    show: { transition: { staggerChildren: stagger, delayChildren: delay } },
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
        <span className="t-line" key={li}>
          {line.split(' ').map((word, wi, all) => (
            <Fragment key={wi}>
              <span className="t-word">
                <motion.span variants={child}>{word}</motion.span>
              </span>
              {wi < all.length - 1 ? ' ' : null}
            </Fragment>
          ))}
        </span>
      ))}
    </Tag>
  )
}
