import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion } from 'framer-motion'
import SitePreview from './SitePreview'
import { useT } from '../lib/lang-ctx'
import { textOf } from '../lib/projects'
import { EASE, SPRING } from '../lib/motion'
import { isOn, shut, tick } from '../lib/sound'

/**
 * Karta wychodzi z tunelu na środek.
 *
 * Nie jest to nowe okno, tylko ta sama karta widziana z bliska: warstwa
 * startuje dokładnie w prostokącie klikniętej karty, w jej skali,
 * i dolatuje na środek ekranu — dopiero tam rozwija się treść.
 *
 * Panel jest **przeglądarką prac, nie ślepym zaułkiem**. Skoro jedna
 * praca jest już otwarta, następna powinna być o jeden ruch dalej,
 * a nie o zamknięcie, wycelowanie w tunelu i kolejne kliknięcie.
 * Stąd strzałki po bokach, licznik i obsługa klawiszy ← →.
 *
 * Przy zmianie pracy **panel zostaje**, wymienia się tylko jego środek.
 * Gdyby przeładowywał się cały, każde przejście zaczynałoby się od
 * dolotu z miejsca, w którym stała pierwsza kliknięta karta.
 */
export default function Focus({ item, from, index, total, onPrev, onNext, onClose, onOpenSite }) {
  const t = useT()
  const info = textOf(t, item)

  useEffect(() => {
    const klawisz = (e) => {
      if (e.key === 'Escape') { if (isOn()) shut(); onClose(); return }
      if (e.key === 'ArrowLeft') { if (isOn()) tick(); onPrev?.() }
      if (e.key === 'ArrowRight') { if (isOn()) tick(); onNext?.() }
    }
    window.addEventListener('keydown', klawisz)
    window.__lenis?.stop()
    return () => {
      window.removeEventListener('keydown', klawisz)
      window.__lenis?.start()
    }
  }, [onClose, onPrev, onNext])

  // punkt startu: środek klikniętej karty względem środka ekranu
  const seed = from
    ? {
        x: from.cx - window.innerWidth / 2,
        y: from.cy - window.innerHeight / 2,
        scale: Math.max(0.18, from.w / Math.min(window.innerWidth * 0.86, 880)),
        opacity: 0,
      }
    : { scale: 0.8, opacity: 0 }

  const LEWO = 'M19 12H5M11 6l-6 6 6 6'
  const PRAWO = 'M5 12h14M13 6l6 6-6 6'

  const strzalka = (d) => (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  )

  return createPortal(
    <motion.div
      className="focus"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.24 }}
    >
      <div className="focus-scrim" onClick={() => { if (isOn()) shut(); onClose() }} />

      {/* Strzałki stoją POZA kolumną, w wolnej przestrzeni po bokach —
          tam, gdzie i tak wędruje kursor, gdy chce się „dalej". */}
      <motion.button
        className="focus-nav lewo"
        onClick={() => { if (isOn()) tick(); onPrev?.() }}
        aria-label={t.tour.prev}
        initial={{ opacity: 0, x: 14 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.34, delay: 0.5, ease: EASE }}
        whileHover={{ scale: 1.08, x: -3 }}
        whileTap={{ scale: 0.92 }}
      >
        {strzalka(LEWO)}
      </motion.button>

      <motion.button
        className="focus-nav prawo"
        onClick={() => { if (isOn()) tick(); onNext?.() }}
        aria-label={t.tour.next}
        initial={{ opacity: 0, x: -14 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.34, delay: 0.5, ease: EASE }}
        whileHover={{ scale: 1.08, x: 3 }}
        whileTap={{ scale: 0.92 }}
      >
        {strzalka(PRAWO)}
      </motion.button>

      <motion.article
        className="focus-card"
        initial={seed}
        animate={{ x: 0, y: 0, scale: [null, 1.035, 1], opacity: 1 }}
        exit={{ ...seed, opacity: 0 }}
        transition={{
          // wyskok: karta przestrzeliwuje o 3,5% i wraca — bez tego
          // dolot na środek wygląda jak zwykłe przesunięcie
          default: { duration: 0.62, ease: [0.16, 1, 0.3, 1], times: [0, 0.72, 1] },
          opacity: { duration: 0.2 },
        }}
      >
        <motion.button
          className="focus-x"
          onClick={onClose}
          aria-label={t.tour.close}
          whileHover={{ rotate: 90, scale: 1.08 }}
          whileTap={{ scale: 0.9 }}
          transition={SPRING.press}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </motion.button>

        {/**
          * Środek wymienia się przy przejściu na inną pracę; rama zostaje.
          *
          * Bez `AnimatePresence` i bez animacji wyjścia. `mode="wait"`
          * kazałby czekać, aż stara treść zniknie — a to przy przeglądaniu
          * strzałkami dokłada ćwierć sekundy do każdego ruchu i potrafi
          * zablokować przejście na amen, jeżeli animacja wyjścia utknie
          * (sprawdzone: przy wstrzymanym `requestAnimationFrame` panel
          * przestawał reagować na strzałki). Zmiana `key` wymienia treść
          * natychmiast, a wejście odgrywa się samo.
          */}
        <motion.div
          className="focus-body"
          key={item.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.26, ease: EASE }}
        >
            <div className="focus-head">
              <p className="focus-host">
                {item.host}
                <span className="focus-licz">
                  {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
                </span>
              </p>
              <h3 className="focus-name">{item.name}</h3>
              <p className="focus-kind">{info.kind}</p>
            </div>

            <div className="focus-art">
              <SitePreview id={item.id} tint={item.tint} name={item.name} host={item.host} hint={t.tour.stop} />
            </div>

            <div className="focus-used">
              <p className="label">{t.tour.used}</p>
              <div className="chips">
                {(item.stack ?? []).map((x, i) => (
                  <motion.span
                    className="chip"
                    key={x}
                    initial={{ opacity: 0, y: 8, scale: 0.94 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ ...SPRING.press, delay: 0.24 + i * 0.04 }}
                    whileHover={{ y: -2, scale: 1.05 }}
                  >
                    {x}
                  </motion.span>
                ))}
              </div>
            </div>
        </motion.div>

        {/**
          * Odwiedź stronę — **przyklejone do dołu kolumny**.
          *
          * Panel przewija się, kiedy nie mieści się na ekranie, a to
          * jedyna rzecz, po którą naprawdę się tu przychodzi. Guzik na
          * końcu treści znikałby razem z nią; przyklejony jest pod ręką
          * niezależnie od tego, gdzie akurat jesteś.
          */}
        <motion.button
          className="btn big focus-go"
          onClick={onOpenSite}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ y: -3 }}
          whileTap={{ scale: 0.975 }}
          transition={{ duration: 0.36, delay: 0.44, ease: EASE }}
        >
          {t.tour.open}
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </motion.button>

        <motion.p
          className="focus-klawisze"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.7 }}
        >
          {t.tour.keys} · {t.tour.hint}
        </motion.p>
      </motion.article>
    </motion.div>,
    document.body
  )
}
