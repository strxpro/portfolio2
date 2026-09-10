import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { demoLangs, demoMenu } from '../../data/site'
import { EASE } from '../../lib/motion'


/** Jedna karta dań, sześć wersji językowych — przełączane na żywo. */
export default function Langs() {
  const [code, setCode] = useState('pl')
  const menu = demoMenu[code]

  return (
    <div className="lg">
      <div className="lg-switch" role="tablist">
        {demoLangs.map((l) => (
          <button
            key={l.code}
            role="tab"
            aria-selected={code === l.code}
            className={code === l.code ? 'on' : ''}
            onClick={() => setCode(l.code)}
          >
            {code === l.code && (
              <motion.span
                className="lg-pill"
                layoutId="lg-pill"
                transition={{ type: 'spring', stiffness: 420, damping: 34 }}
              />
            )}
            <span className="lg-code">{l.code.toUpperCase()}</span>
            <span className="lg-name">{l.name}</span>
          </button>
        ))}
      </div>

      <div className="lg-card">
        <AnimatePresence mode="wait">
          <motion.div
            key={code}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.32, ease: EASE }}
          >
            <div className="lg-head">
              <h4>{menu.head}</h4>
              <span>{menu.note}</span>
            </div>

            {menu.items.map((it, i) => (
              <motion.div
                className="lg-row"
                key={it.n}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.06 + i * 0.06, duration: 0.35, ease: EASE }}
              >
                <div>
                  <strong>{it.n}</strong>
                  <p>{it.d}</p>
                </div>
                <span className="lg-price">{it.p}</span>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
