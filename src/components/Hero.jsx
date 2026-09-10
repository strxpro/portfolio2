import { useRef } from 'react'
import { motion, useTransform } from 'framer-motion'
import Photo from './Photo'
import HeroArt from './HeroArt'
import Pixels from './Pixels'
import Type from './Type'
import { me, photos } from '../data/site'
import { useT } from '../lib/lang-ctx'
import { usePointer } from '../lib/usePointer'
import { goTo, goToEnd } from '../lib/scroll'
import { EASE } from '../lib/motion'


/**
 * @param {boolean} ghost  echo na końcu pętli: ta sama sekcja, ale bez
 *   identyfikatora i bez maskotki — na stronie mogą stać dwie naraz.
 */
export default function Hero({ ghost = false }) {
  const t = useT()
  const { x, y } = usePointer(70, 20)

  // wizytówka lekko podąża za kursorem — bez przesady, w granicach paru stopni
  const tiltY = useTransform(x, [-1, 1], [7, -7])
  const tiltX = useTransform(y, [-1, 1], [-5, 5])

  /**
   * Maskotka **nie wchodzi na pierwszy ekran**.
   *
   * Dymek stawał po lewej, dokładnie na akapicie wstępu, i to była
   * większa część bałaganu, o którym mówił Claudio — hero ma być tym
   * jednym miejscem, gdzie nic nie zasłania tekstu. Piksel zaczyna
   * oprowadzać od sekcji „o mnie".
   */
  const ref = useRef(null)

  return (
    <section className="hero" id={ghost ? undefined : 'top'} ref={ref}>
      {/* pikselowa siatka pod treścią — ta sama, co w scenie 3D, tylko rzadsza */}
      <Pixels className="hero-bg" gap={46} tone="light" />
      <HeroArt />

      <div className="wrap hero-grid">
        <div className="hero-main">
          <motion.div
            className="hero-status"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12, duration: 0.6, ease: EASE }}
          >
            <span className="avail"><i />{t.hero.badge}</span>
          </motion.div>

          <Type as="h1" className="display" text={t.hero.head} onMount delay={0.2} duration={0.9} />

          <motion.p
            className="lead"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.62, duration: 0.48, ease: EASE }}
          >
            {t.hero.intro}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.72, duration: 0.48, ease: EASE }}
          >
            <div className="hero-actions">
              <motion.a
                className="btn big"
                href="#prace"
                onClick={(e) => { e.preventDefault(); goTo('prace') }}
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.97 }}
              >
                {t.hero.cta1}
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </motion.a>
              <motion.a
                className="btn ghost big"
                href="#kontakt"
                onClick={(e) => { e.preventDefault(); goToEnd() }}
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.97 }}
              >
                {t.hero.cta2}
              </motion.a>
            </div>
          </motion.div>
        </div>

        {/* wizytówka: twarz zamiast anonimowego „zespołu" */}
        <motion.aside
          className="hero-card"
          initial={{ opacity: 0, y: 34, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.34, duration: 0.6, ease: EASE }}
          style={{ rotateX: tiltX, rotateY: tiltY, transformPerspective: 1100 }}
        >
          <Photo src={photos.hero.src} ratio={photos.hero.ratio} depth={8} />
          {/* pikselowa roleta zjeżdżająca z kadru przy wejściu na stronę */}
          <motion.span
            className="hero-shutter"
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ delay: 0.9, duration: 0.56, ease: EASE }}
            aria-hidden="true"
          />
          <div className="hero-card-foot">
            <div>
              <strong>{me.name}</strong>
              <span>{t.hero.role}</span>
            </div>
            <span className="hero-since">{me.since}</span>
          </div>
        </motion.aside>
      </div>

      <div className="wrap">
        <motion.span
          className="hero-scroll"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.95, duration: 0.6 }}
        >
          {t.scroll}
          <motion.i
            animate={{ y: [0, 7, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.span>
      </div>
    </section>
  )
}
