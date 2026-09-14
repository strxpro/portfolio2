import { useState } from 'react'
import { motion } from 'framer-motion'
import Knot3D from './lab/Knot3D'
import Booking from './lab/Booking'
import Langs from './lab/Langs'
import Flow from './lab/Flow'
import Scope from './lab/Scope'
import Type from './Type'
import { labs } from '../data/site'
import { useT } from '../lib/lang-ctx'
import { useGuide } from '../lib/mascot'
import { EASE } from '../lib/motion'


const PANELS = {
  trojwymiar: Knot3D,
  rezerwacja: Booking,
  jezyki: Langs,
  automat: Flow,
  zakres: Scope,
}

export default function Lab() {
  const t = useT()
  const [tab, setTab] = useState('trojwymiar')
  const Panel = PANELS[tab]

  const ref = useGuide({
    id: 'nazywo',
    text: t.guide.lab,
    corner: 'br',
    mood: 'mowi',
    point: '.lab-tabs',
  })

  return (
    <section className="pad" id="na-zywo" ref={ref}>
      <div className="wrap">
        <div className="head">
          <div>
            <Type as="h2" className="title" text={t.labTitle} delay={0.08} />
          </div>
          <Type
            as="p"
            className="lead"
            text={t.lab.lead}
            delay={0.18}
            stagger={0.014}
            amount={0.35}
          />
        </div>

        <div className="lab">
          <div className="lab-tabs" role="tablist">
            {labs.map((id) => (
              <button
                key={id}
                role="tab"
                aria-selected={tab === id}
                className={tab === id ? 'on' : ''}
                onClick={() => setTab(id)}
              >
                {tab === id && (
                  <motion.span
                    className="lab-pill"
                    layoutId="lab-pill"
                    transition={{ type: 'spring', stiffness: 420, damping: 36 }}
                  />
                )}
                <span>{t.lab.tabs[id] ?? t.scope.tab}</span>
              </button>
            ))}
          </div>

          <div className="lab-stage">
            {/**
              * Podmiana zakładki **bez** `AnimatePresence mode="wait"`.
              *
              * Tryb „wait" każe czekać, aż stara zawartość zniknie —
              * i jeśli ta animacja nie dobiegnie (karta w tle, wstrzymany
              * `requestAnimationFrame`, przycięcie przy wczytywaniu),
              * zakładka zapala się na aktywną, a na scenie zostaje stara
              * treść. Zmierzone: zakładka „Automatyzacja" zaznaczona,
              * a w środku wciąż bryła z „Trójwymiaru".
              *
              * Zmiana `key` wymienia panel natychmiast, a wejście odgrywa
              * się samo. To ta sama zasada, co przy nawigacji i pracach:
              * animacja może być ozdobą kroku, nigdy jego warunkiem.
              */}
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: EASE }}
            >
              <Panel />
            </motion.div>
          </div>

          <div className="lab-hint">
            <span className="lab-live">
              <i />
              {t.lab.live}
            </span>
            <motion.p
              key={tab}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.25 }}
            >
              {t.lab.hints[tab] ?? t.scope.hint}
            </motion.p>
          </div>
        </div>
      </div>
    </section>
  )
}
