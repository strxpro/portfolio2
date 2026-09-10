import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion } from 'framer-motion'
import Warp from './Warp'
import { useT } from '../lib/lang-ctx'
import { textOf } from '../lib/projects'
import { EASE } from '../lib/motion'

/**
 * Zwiedzanie strony.
 *
 * Ramka wyrywa się z klikniętej karty — startuje dokładnie w jej
 * miejscu, w jej skali i pod jej kątem, a potem prostuje się na środek
 * ekranu. Dzięki temu widać, że to ta sama rzecz, tylko z bliska.
 *
 * Żywa strona najpierw stoi nieruchomo: automatyczny przejazd rusza
 * dopiero pięć sekund po tym, jak witryna się wczyta — inaczej zaczyna
 * uciekać, zanim zdążysz na nią spojrzeć.
 */

const W = 1440
const H = 3600
const RUN = 22 // sekundy jednego przejazdu
const HOLD = 5000 // ile stoi nieruchomo po wczytaniu

export default function Tour({ item, kind, from, onClose }) {
  const t = useT()
  const box = useRef(null)
  const [k, setK] = useState(0.5)
  const [live, setLive] = useState(false)
  const [rolling, setRolling] = useState(false)
  const [note, setNote] = useState(true)

  useEffect(() => {
    const el = box.current
    if (!el) return undefined
    const measure = () => setK(Math.max(el.clientWidth, 1) / W)
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    const esc = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', esc)
    window.__lenis?.stop()
    document.body.classList.add('locked')
    return () => {
      window.removeEventListener('keydown', esc)
      window.__lenis?.start()
      document.body.classList.remove('locked')
    }
  }, [onClose])

  // pięć sekund na spokojne spojrzenie, dopiero potem przejazd
  useEffect(() => {
    if (!live) return undefined
    const id = setTimeout(() => setRolling(true), HOLD)
    return () => clearTimeout(id)
  }, [live])

  const onFrameLoad = (e) => {
    const f = e.currentTarget
    try {
      const d = f.contentDocument
      if (d && (d.location.href === 'about:blank' || !d.body || d.body.childElementCount === 0)) return
    } catch {
      /* inna domena = wczytana poprawnie */
    }
    setLive(true)
  }

  const travel = Math.max(H * k - (box.current?.clientHeight ?? 0), 0)
  const info = textOf(t, item)

  // start dokładnie tam, gdzie stała karta — z jej skalą i przechyłem
  const seed = from
    ? {
        x: from.cx - window.innerWidth / 2,
        y: from.cy - window.innerHeight / 2,
        scale: Math.max(0.12, from.w / (window.innerWidth * 0.9)),
        rotateY: from.rotateY ?? 0,
        rotateX: from.rotateX ?? 0,
        opacity: 0,
      }
    : { scale: 0.72, rotateX: 12, y: 60, opacity: 0 }

  // portal do <body>: arkusze mają własny transform, więc z-index
  // liczyłby się tylko w ich obrębie i podgląd chowałby się pod CTA
  return createPortal(
    <motion.div
      className="tour"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="tour-scrim" onClick={onClose} />

      <motion.div
        className="tour-box"
        initial={seed}
        animate={{ x: 0, y: 0, scale: 1, rotateY: 0, rotateX: 0, opacity: 1 }}
        exit={{ ...seed, opacity: 0 }}
        style={{ transformPerspective: 1500 }}
        transition={{ type: 'spring', stiffness: 190, damping: 25, mass: 0.9, opacity: { duration: 0.24 } }}
      >
        <Warp />

        <div className="tour-bar">
          <span className="tour-name">{item.name}</span>
          <span className="tour-host">{item.host}</span>
          <span className="tour-state">
            {rolling && <i />}
            {live ? (rolling ? t.tour.running : t.tour.hold) : '…'}
          </span>
          <button className="tour-x" onClick={onClose} aria-label={t.tour.close}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        <div className="tour-body">
          <div className="tour-view" ref={box}>
            {item.embed === false ? (
              <div className="tour-block">
                <p>{item.host}</p>
                <span>{t.tour.open}</span>
              </div>
            ) : (
              <motion.div
                className="tour-scrollbox"
                animate={rolling ? { y: [0, -travel, 0] } : { y: 0 }}
                transition={
                  rolling
                    ? { duration: RUN, ease: [0.4, 0, 0.5, 1], repeat: Infinity, repeatDelay: 0.6 }
                    : { duration: 0.2 }
                }
              >
                <iframe
                  src={item.url}
                  title={item.host}
                  tabIndex={-1}
                  referrerPolicy="no-referrer"
                  sandbox="allow-scripts allow-same-origin"
                  onLoad={onFrameLoad}
                  style={{ width: W, height: H, transform: `scale(${k})`, transformOrigin: '0 0' }}
                />
              </motion.div>
            )}

            <motion.div
              className="tour-cta"
              initial={{ y: 90, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.75, duration: 0.48, ease: EASE }}
            >
              <motion.a
                className="btn big"
                href={item.url}
                target="_blank"
                rel="noreferrer"
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.97 }}
              >
                {t.tour.open}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M7 17L17 7M9 7h8v8" />
                </svg>
              </motion.a>
              <span className="tour-hint">{t.tour.hint}</span>
            </motion.div>
          </div>

          {/* boks z opisem po wolnej stronie — zamykany jednym kliknięciem */}
          <motion.aside
            className={`tour-note ${note ? '' : 'shut'}`}
            initial={{ x: 40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.35, duration: 0.6, ease: EASE }}
          >
            <button className="tour-note-x" onClick={() => setNote((v) => !v)} aria-expanded={note}>
              {note ? t.tour.less : t.tour.more}
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                <path d={note ? 'M6 6l12 12M18 6L6 18' : 'M12 5v14M5 12h14'} />
              </svg>
            </button>

            {note && (
              <div className="tour-note-in">
                <p className="tour-kind">{kind}</p>
                <p className="tour-lead">{info.lead}</p>
                <ul className="tour-points">
                  {info.points.map((p) => (
                    <li key={p}><i />{p}</li>
                  ))}
                </ul>
                <div className="chips">
                  {(item.stack ?? []).map((s) => <span className="chip" key={s}>{s}</span>)}
                </div>
              </div>
            )}
          </motion.aside>
        </div>
      </motion.div>
    </motion.div>,
    document.body
  )
}
