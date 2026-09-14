import { motion } from 'framer-motion'
import Chain from './Chain'
import Deep from './Deep'
import Photo from './Photo'
import Type from './Type'
import { ageNow, photos } from '../data/site'
import { useT } from '../lib/lang-ctx'
import { useGuide } from '../lib/mascot'
import { goToEnd } from '../lib/scroll'
import { EASE, SPRING } from '../lib/motion'


/** 22 lata, ale 25 lat — polska odmiana liczebnika, żeby nie zgrzytało. */
function years(n) {
  const last = n % 10
  const tens = n % 100
  return last >= 2 && last <= 4 && (tens < 12 || tens > 14) ? 'lata' : 'lat'
}

/**
 * Kto to robi — z twarzą, nie z anonimowym „zespołem".
 * Zdjęcia jadą w dwóch różnych tempach, więc kolumna oddycha przy scrollu.
 */
export default function Me() {
  const t = useT()
  const age = ageNow()
  const ref = useGuide({ id: 'o-mnie', text: t.guide.about, corner: 'br', mood: 'spokoj', point: '.me-shots' })

  return (
    <section className="pad" id="o-mnie" ref={ref}>
      <div className="wrap">
        <motion.div
          className="rule"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.62, ease: EASE }}
          style={{ marginBottom: 'clamp(36px, 5vw, 64px)' }}
        />

        <div className="me">
          <div className="me-shots">
            {/* zdjęcia nadlatują z różnych głębokości — stąd między nimi dystans */}
            <Deep className="me-shot a" from={420} tilt={11} amount={0.25}>
              <Photo src={photos.side[0].src} ratio={photos.side[0].ratio} depth={12} />
            </Deep>

            <Deep className="me-shot b" i={1.6} from={300} tilt={7} amount={0.25}>
              <Photo src={photos.side[1].src} ratio={photos.side[1].ratio} depth={9} />
            </Deep>

            <motion.span
              className="me-stamp"
              initial={{ opacity: 0, z: -260, rotate: -12 }}
              whileInView={{ opacity: 1, z: 0, rotate: -7 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ ...SPRING.enter, delay: 0.34 }}
              style={{ transformPerspective: 700 }}
            >
              {t.me.stamp}
            </motion.span>
          </div>

          <div className="me-text">
            <Type as="h2" className="title" text={t.me.title} delay={0.08} />

            <Deep from={180} tilt={6} amount={0.4}>
              <p className="me-p lead">
                {t.me.p1.replace('{age}', age).replace('{years}', years(age))}
              </p>
            </Deep>

            <Chain />

            <dl className="me-creds">
              {t.me.creds.map(([k, v], i) => (
                <Deep key={k} i={i} from={150} tilt={7} amount={0.5}>
                  <dt>{k}</dt>
                  <dd>{v}</dd>
                </Deep>
              ))}
            </dl>

            <Deep from={150} tilt={6} amount={0.6}>
            <motion.button
              className="btn ghost me-cta"
              onClick={goToEnd}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.97 }}
            >
              {t.me.cta}
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </motion.button>
            </Deep>
          </div>
        </div>
      </div>
    </section>
  )
}
