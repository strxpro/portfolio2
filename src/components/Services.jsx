import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import SvcArt from './SvcArt'
import Type from './Type'
import { useT } from '../lib/lang-ctx'
import { useGuide } from '../lib/mascot'
import { EASE, SPRING } from '../lib/motion'


export default function Services() {
  const t = useT()
  const services = t.services.items
  const [pick, setPick] = useState(0)
  const [name, text] = services[pick]

  /**
   * Na telefonie zwykła lista: nazwa i opis, wszystko widać od razu.
   *
   * Wcześniej był tu akordeon. Pozycje odchylały się w 3D, rozwijały
   * wysokością, a cała lista (klasa `fold` pożyczona od teczki z pracami)
   * stała absolutnie i wchodziła na nagłówek i na następną sekcję.
   * Sześć krótkich opisów czyta się szybciej niż sześć kliknięć.
   */
  const [narrow, setNarrow] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 900px)')
    const put = () => setNarrow(mq.matches)
    put()
    mq.addEventListener('change', put)
    return () => mq.removeEventListener('change', put)
  }, [])

  const ref = useGuide({
    id: 'uslugi',
    text: t.guide.services,
    corner: 'br',
    mood: 'mowi',
    point: '.svc-list, .svc-stack',
  })

  return (
    <section className="pad" id="uslugi" ref={ref}>
      <div className="wrap">
        <div className="head">
          <div>
            <Type as="h2" className="title" text={t.services.title} delay={0.08} />
          </div>
          <Type
            as="p"
            className="lead"
            text={t.services.lead}
            delay={0.18}
            stagger={0.016}
            amount={0.4}
          />
        </div>

        {narrow ? (
          <ol className="svc-stack">
            {services.map(([label, opis]) => (
              <motion.li
                key={label}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.45, ease: EASE }}
              >
                <h3 className="svc-stack-t">{label}</h3>
                <p className="svc-text">{opis}</p>
              </motion.li>
            ))}
          </ol>
        ) : (
        <div className="svc">
          <div className="svc-view">
            <SvcArt pick={pick} />

            {/* Zwykła zmiana klucza zamiast AnimatePresence mode="wait":
                „wait” każe czekać na wyjście starej treści, więc przy
                przesuwaniu kursora po liście każdy opis przychodził
                z opóźnieniem — a przy zatrzymanych klatkach nie przychodził
                wcale (ten sam błąd był już w Focus i w Lab). */}
            <motion.div
              key={pick}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.32, ease: EASE }}
            >
              <h3 className="svc-title">{name}</h3>
              <p className="svc-text">{text}</p>
            </motion.div>
          </div>

          <ul className="svc-list">
            {services.map(([label], i) => (
              <motion.li
                key={label}
                className={pick === i ? 'on' : ''}
                onMouseEnter={() => setPick(i)}
                onFocus={() => setPick(i)}
                onClick={() => setPick(i)}
                initial={{ opacity: 0, z: -220, rotateX: 8 }}
                whileInView={{ opacity: 1, z: 0, rotateX: 0 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ ...SPRING.enter, delay: i * 0.06 }}
                style={{ transformPerspective: 900 }}
              >
                <button type="button">
                  <span className="svc-n">{label}</span>
                  <motion.span
                    className="svc-fill"
                    animate={{ scaleX: pick === i ? 1 : 0 }}
                    transition={{ duration: 0.55, ease: EASE }}
                  />
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </button>

              </motion.li>
            ))}
          </ul>
        </div>
        )}
      </div>
    </section>
  )
}
