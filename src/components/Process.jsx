import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Type from './Type'
import { sched } from '../data/site'
import { useT } from '../lib/lang-ctx'
import { useGuide } from '../lib/mascot'
import { EASE, SPRING } from '../lib/motion'

const WEEKS = 5

/**
 * Proces jako harmonogram: paski na osi tygodni, tak jak w projekcie
 * budowlanym. Widać, co się nakłada, ile trwa i co masz na koniec etapu.
 */
export default function Process() {
  const t = useT()
  const steps = t.sched.steps
  const [pick, setPick] = useState(0)
  const [name, , text, gives] = steps[pick]

  const ref = useGuide({
    id: 'proces',
    text: t.guide.process,
    corner: 'bl',
    mood: 'spokoj',
    point: '.gantt-bar',
  })

  return (
    <section className="pad" id="proces" ref={ref}>
      <div className="wrap">
        <div className="head">
          <div>
            <Type as="p" className="label" text={t.sched.label} />
            <Type as="h2" className="title" text={t.sched.title} delay={0.08} />
          </div>
          <Type as="p" className="lead" text={t.sched.lead} delay={0.16} stagger={0.014} amount={0.3} />
        </div>

        <div className="gantt ticked">
          <div className="gantt-axis">
            {Array.from({ length: WEEKS }).map((_, w) => (
              <span key={w} className="gantt-week">
                <i>{t.sched.week} {w + 1}</i>
              </span>
            ))}
          </div>

          <div className="gantt-rows">
            {steps.map(([label, span], i) => {
              const [from, to] = sched[i]
              return (
                <motion.button
                  key={label}
                  className={`gantt-row ${pick === i ? 'on' : ''}`}
                  onMouseEnter={() => setPick(i)}
                  onFocus={() => setPick(i)}
                  onClick={() => setPick(i)}
                  initial={{ opacity: 0, z: -190, rotateX: 7 }}
                  whileInView={{ opacity: 1, z: 0, rotateX: 0 }}
                  viewport={{ once: true, amount: 0.6 }}
                  transition={{ ...SPRING.enter, delay: i * 0.07 }}
                  style={{ transformPerspective: 900 }}
                >
                  <span className="gantt-n">{String(i + 1).padStart(2, '0')}</span>
                  <span className="gantt-name">{label}</span>
                  <span className="gantt-track">
                    <motion.i
                      className="gantt-bar"
                      style={{ left: `${(from / WEEKS) * 100}%` }}
                      initial={{ width: 0 }}
                      whileInView={{ width: `${((to - from) / WEEKS) * 100}%` }}
                      viewport={{ once: true, amount: 0.6 }}
                      transition={{ duration: 0.54, delay: 0.15 + i * 0.09, ease: EASE }}
                    />
                  </span>
                  <span className="gantt-when">{span}</span>
                </motion.button>
              )
            })}
          </div>

          <div className="gantt-detail">
            <AnimatePresence mode="wait">
              <motion.div
                key={pick}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.32, ease: EASE }}
              >
                <h3>{name}</h3>
                <p>{text}</p>
                <p className="gantt-gives">
                  <span>{t.sched.gives}</span>
                  {gives}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}
