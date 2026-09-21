import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { slots } from '../../data/site'
import { useT } from '../../lib/lang-ctx'
import { EASE } from '../../lib/motion'


/** Działający mini-panel rezerwacji: miesiąc, wolne godziny, potwierdzenie. */
export default function Booking() {
  const t = useT()
  const { months: MONTHS, monthsOf: OF, dow: DOW } = t.booking
  const today = useMemo(() => {
    const d = new Date()
    d.setHours(0, 0, 0, 0)
    return d
  }, [])

  const [cursor, setCursor] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1))
  const [day, setDay] = useState(null)
  const [time, setTime] = useState(null)
  const [done, setDone] = useState(false)

  const grid = useMemo(() => {
    const first = new Date(cursor.getFullYear(), cursor.getMonth(), 1)
    const last = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0)
    const lead = (first.getDay() + 6) % 7 // poniedziałek pierwszy
    const cells = []
    for (let i = 0; i < lead; i++) cells.push(null)
    for (let d = 1; d <= last.getDate(); d++) {
      cells.push(new Date(cursor.getFullYear(), cursor.getMonth(), d))
    }
    return cells
  }, [cursor])

  // co trzeci dzień „zajęty" — żeby demo wyglądało jak żywy grafik
  const busy = (d) => d.getDate() % 7 === 3
  const past = (d) => d < today

  const shift = (n) => {
    setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + n, 1))
    setDay(null); setTime(null); setDone(false)
  }

  const label = day
    ? `${day.getDate()} ${OF[day.getMonth()]}${time ? `, ${t.booking.at} ${time}` : ''}`
    : t.booking.pick

  return (
    <div className="bk">
      <div className="bk-cal">
        <div className="bk-head">
          <button onClick={() => shift(-1)} aria-label={t.booking.prev} data-cursor="mniej">‹</button>
          <strong>{MONTHS[cursor.getMonth()]} {cursor.getFullYear()}</strong>
          <button onClick={() => shift(1)} aria-label={t.booking.next} data-cursor="wiecej">›</button>
        </div>

        <div className="bk-dow">
          {DOW.map((d) => <span key={d}>{d}</span>)}
        </div>

        <div className="bk-grid">
          {grid.map((d, i) => {
            if (!d) return <span key={`e${i}`} />
            const off = past(d) || busy(d)
            const on = day && d.getTime() === day.getTime()
            return (
              <motion.button
                key={d.getTime()}
                className={`bk-day ${off ? 'off' : ''} ${on ? 'on' : ''}`}
                disabled={off}
                onClick={() => { setDay(d); setTime(null); setDone(false) }}
                whileHover={off ? {} : { scale: 1.12 }}
                whileTap={off ? {} : { scale: 0.94 }}
                transition={{ type: 'spring', stiffness: 420, damping: 24 }}
              >
                {d.getDate()}
              </motion.button>
            )
          })}
        </div>
      </div>

      <div className="bk-side">
        <p className="label">{label}</p>

        <AnimatePresence mode="wait">
          {!day && (
            <motion.p
              key="empty"
              className="bk-empty"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            >
              {t.booking.empty}
            </motion.p>
          )}

          {day && !done && (
            <motion.div
              key="slots"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35, ease: EASE }}
            >
              <div className="bk-slots">
                {slots.map((s, i) => (
                  <motion.button
                    key={s}
                    className={`bk-slot ${time === s ? 'on' : ''}`}
                    onClick={() => setTime(s)}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03, duration: 0.3, ease: EASE }}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    {s}
                  </motion.button>
                ))}
              </div>

              <motion.button
                className="btn bk-go"
                disabled={!time}
                onClick={() => setDone(true)}
                animate={{ opacity: time ? 1 : 0.35 }}
                whileHover={time ? { y: -2 } : {}}
                whileTap={time ? { scale: 0.97 } : {}}
              >
                {t.booking.book}
              </motion.button>
            </motion.div>
          )}

          {done && (
            <motion.div
              key="done"
              className="bk-done"
              initial={{ opacity: 0, y: 14, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.45, ease: EASE }}
            >
              <motion.svg viewBox="0 0 48 48" className="bk-tick">
                <motion.circle
                  cx="24" cy="24" r="20" fill="none" stroke="var(--accent)" strokeWidth="2"
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                  transition={{ duration: 0.6, ease: EASE }}
                />
                <motion.path
                  d="M15 24.5l6.5 6.5L33 19" fill="none" stroke="var(--accent)"
                  strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                  transition={{ duration: 0.4, delay: 0.35, ease: EASE }}
                />
              </motion.svg>
              <strong>{t.booking.done}</strong>
              <p>
                {day.getDate()} {OF[day.getMonth()]}, {t.booking.at} {time}. {t.booking.doneNote}
              </p>
              <button className="bk-again" onClick={() => { setDone(false); setDay(null); setTime(null) }}>
                {t.booking.again}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
