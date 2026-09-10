import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useT } from '../../lib/lang-ctx'
import { EASE } from '../../lib/motion'


/** Ścieżka automatyzacji: jedno kliknięcie i widać, co dzieje się dalej. */
export default function Flow() {
  const t = useT()
  const flowNodes = t.flow.nodes
  const LOG = t.flow.log
  const [step, setStep] = useState(-1)
  const timer = useRef(null)

  useEffect(() => () => clearInterval(timer.current), [])

  const run = () => {
    clearInterval(timer.current)
    setStep(0)
    timer.current = setInterval(() => {
      setStep((s) => {
        if (s >= flowNodes.length - 1) {
          clearInterval(timer.current)
          return s
        }
        return s + 1
      })
    }, 800)
  }

  const pct = (i) => (i / (flowNodes.length - 1)) * 100
  const active = step >= 0
  const finished = step === flowNodes.length - 1

  return (
    <div className="fl">
      <div className="fl-track">
        <div className="fl-line" />
        <motion.div
          className="fl-line fill"
          animate={{ width: active ? `${pct(step)}%` : '0%' }}
          transition={{ duration: 0.55, ease: EASE }}
        />

        {active && (
          <motion.span
            className="fl-dot"
            animate={{ left: `${pct(step)}%` }}
            transition={{ duration: 0.55, ease: EASE }}
          />
        )}

        <div className="fl-nodes">
          {flowNodes.map((n, i) => {
            const lit = active && i <= step
            return (
              <div className="fl-node" key={n[0]}>
                <motion.span
                  className={`fl-ring ${lit ? 'on' : ''}`}
                  animate={lit ? { scale: [1, 1.28, 1] } : { scale: 1 }}
                  transition={{ duration: 0.45, ease: EASE }}
                >
                  <motion.svg viewBox="0 0 24 24" initial={false}>
                    <motion.path
                      d="M5 12.5l4.5 4.5L19 7.5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: lit ? 1 : 0 }}
                      transition={{ duration: 0.34, ease: EASE }}
                    />
                  </motion.svg>
                </motion.span>
                <strong>{n[0]}</strong>
                <span className="fl-sub">{n[1]}</span>
              </div>
            )
          })}
        </div>
      </div>

      <div className="fl-foot">
        <motion.button
          className="btn"
          onClick={run}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.97 }}
        >
          {step < 0 ? t.flow.send : finished ? t.flow.again : t.flow.running}
        </motion.button>

        <div className="fl-log">
          <AnimatePresence initial={false}>
            {active &&
              LOG.slice(0, step + 1).map((l, i) => (
                <motion.div
                  className="fl-log-row"
                  key={l}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3, ease: EASE }}
                >
                  <span className="fl-time">
                    {String(i).padStart(2, '0')}:0{i * 2}
                  </span>
                  {l}
                </motion.div>
              ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
