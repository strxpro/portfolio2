import { useEffect, useRef } from 'react'
import { useInView } from 'framer-motion'

const POOL = 'ABCDEFGHIJKLMNOPQRSTUVWXYZĄĆĘŁŃÓŚŻŹ0123456789/#*+-'
const pick = () => POOL[Math.floor(Math.random() * POOL.length)]

/**
 * Napis, który przechodzi w kolejny litera po literze.
 *
 * Każdy znak dostaje własne okno czasu: najpierw miga losowymi glifami,
 * potem zastyga na docelowej literze. Tekst zmieniam bezpośrednio na
 * węźle DOM, a nie przez stan Reacta — inaczej byłoby kilkadziesiąt
 * przerenderowań na sekundę tylko po to, żeby podmienić jeden znak.
 *
 * Pętla stoi, dopóki napis nie wjedzie w kadr.
 */
export default function Morph({ words, hold = 2600, morph = 900, className = '' }) {
  const node = useRef(null)
  const box = useRef(null)
  const live = useInView(box, { amount: 0.4 })

  useEffect(() => {
    if (!live || !words?.length) return undefined
    const el = node.current
    if (!el) return undefined

    let raf
    let step = 0
    let from = words[0]
    let to = words[0]
    let t0 = performance.now()
    let phase = 'hold'
    el.textContent = from

    const frame = (now) => {
      const dt = now - t0

      if (phase === 'hold') {
        if (dt >= hold) {
          step += 1
          from = to
          to = words[step % words.length]
          phase = 'morph'
          t0 = now
        }
      } else {
        const k = Math.min(1, dt / morph)
        const len = Math.max(from.length, to.length)
        let out = ''
        for (let i = 0; i < len; i++) {
          // każda litera zastyga trochę później od poprzedniej
          const done = (k * 1.45) - (i / len) * 0.45
          if (done >= 1) out += to[i] ?? ''
          else if (done <= 0) out += from[i] ?? ''
          else out += Math.random() < 0.55 ? pick() : (to[i] ?? from[i] ?? '')
        }
        el.textContent = out
        if (k >= 1) {
          el.textContent = to
          phase = 'hold'
          t0 = now
        }
      }
      raf = requestAnimationFrame(frame)
    }

    raf = requestAnimationFrame(frame)
    return () => cancelAnimationFrame(raf)
  }, [live, words, hold, morph])

  return (
    <span className={`morph ${className}`} ref={box}>
      <span className="morph-ghost" aria-hidden="true">
        {words?.reduce((a, b) => (b.length > a.length ? b : a), '')}
      </span>
      <span className="morph-live" ref={node} />
    </span>
  )
}
