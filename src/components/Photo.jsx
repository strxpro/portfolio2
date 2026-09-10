import { useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useLoopSpring } from '../lib/useLoopSpring'

/**
 * Ramka na zdjęcie.
 *
 * Obraz jedzie wolniej niż strona (paralaksa wewnątrz kadru), więc kadr
 * żyje przy scrollu, a nie stoi jak wklejony prostokąt.
 *
 * Kiedy pliku jeszcze nie ma w `public/`, ramka pokazuje zaślepkę
 * z nazwą brakującego pliku — strona nigdy nie wygląda na zepsutą,
 * a Ty od razu wiesz, co dograć.
 */
export default function Photo({ src, ratio = 0.8, depth = 14, caption, className = '' }) {
  const box = useRef(null)
  const [failed, setFailed] = useState(false)

  const { scrollYProgress } = useScroll({ target: box, offset: ['start end', 'end start'] })
  const p = useLoopSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 })
  const y = useTransform(p, [0, 1], [`${depth}%`, `${-depth}%`])

  return (
    <figure className={`shot ${className}`} ref={box} style={{ aspectRatio: ratio }}>
      {failed ? (
        <div className="shot-gap">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="16" rx="2.5" />
            <circle cx="9" cy="10" r="2" />
            <path d="M3 17l5-4.5 4 3.5 3-2.5 6 5" />
          </svg>
          <code>public{src}</code>
        </div>
      ) : (
        <motion.img
          src={src}
          alt={caption || ''}
          loading="lazy"
          decoding="async"
          draggable="false"
          style={{ y }}
          onError={() => setFailed(true)}
        />
      )}
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  )
}
