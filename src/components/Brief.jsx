import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Piksel3D from './Piksel3D'
import { contact } from '../data/site'
import { useT } from '../lib/lang-ctx'
import { EASE } from '../lib/motion'


const KINDS = ['text', 'chips', 'chips', 'text', 'area']
const IDS = ['imie', 'czego', 'kiedy', 'kontakt', 'opis']


export default function Brief() {
  const t = useT()
  const STEPS = IDS.map((id, i) => ({
    id,
    q: t.brief.q[i],
    kind: KINDS[i],
    ph: t.brief.ph[i],
    opts: t.brief.opts[i],
    optional: i === IDS.length - 1,
  }))
  const [step, setStep] = useState(0)
  const [a, setA] = useState({})
  const [phase, setPhase] = useState('form') // form | pieczec | gotowe
  const [copied, setCopied] = useState(false)
  const inputRef = useRef(null)

  const cur = STEPS[step]
  const val = a[cur?.id] ?? ''
  const ok = cur?.optional || String(val).trim().length > 0
  const last = step === STEPS.length - 1

  useEffect(() => {
    if (phase === 'form' && cur?.kind !== 'chips') {
      // `preventScroll` jest tu obowiązkowe: formularz stoi na samym dole,
      // więc zwykły focus() kazał przeglądarce przewinąć do niego całą
      // stronę i czytelnik lądował w kontakcie chwilę po wejściu.
      const id = setTimeout(() => inputRef.current?.focus({ preventScroll: true }), 380)
      return () => clearTimeout(id)
    }
  }, [step, phase, cur])

  const set = (v) => setA((s) => ({ ...s, [cur.id]: v }))

  const next = () => {
    if (!ok) return
    if (last) seal()
    else setStep((s) => s + 1)
  }

  const seal = () => {
    setPhase('pieczec')
    setTimeout(() => setPhase('gotowe'), 1700)
  }

  const body = [
    `${t.brief.mailHi} ${a.imie || '—'}.`,
    '',
    `${t.brief.mailNeed}: ${a.czego || '—'}`,
    `${t.brief.mailWhen}: ${a.kiedy || '—'}`,
    `${t.brief.mailContact}: ${a.kontakt || '—'}`,
    a.opis ? `\nO firmie: ${a.opis}` : '',
  ].join('\n')

  const mailto = `mailto:${contact.email}?subject=${encodeURIComponent(
    `${t.brief.mailSubject} — ${a.czego || ''}`.trim()
  )}&body=${encodeURIComponent(body)}`

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(`${contact.email}\n\n${body}`)
      setCopied(true)
      setTimeout(() => setCopied(false), 2200)
    } catch {
      setCopied(false)
    }
  }

  const restart = () => {
    setA({})
    setStep(0)
    setPhase('form')
  }

  return (
    <div className="brief">
      <div className="brief-card">
        {/* górna klapka koperty — zamyka się przy pieczętowaniu */}
        <motion.div
          className="flap"
          initial={false}
          animate={{ rotateX: phase === 'form' ? -178 : 0 }}
          transition={{ duration: 0.54, ease: EASE }}
        />

        <div className="brief-top">
          <div className="brief-face">
            <Piksel3D
              mood={phase === 'gotowe' ? 'spokoj' : 'mowi'}
              size={62}
              idleSpin={false}
            />
          </div>
          <div className="brief-dots">
            {STEPS.map((s, i) => (
              <motion.span
                key={s.id}
                className={`dot ${i <= step || phase !== 'form' ? 'on' : ''}`}
                animate={{ scale: i === step && phase === 'form' ? 1.5 : 1 }}
                transition={{ type: 'spring', stiffness: 380, damping: 22 }}
              />
            ))}
          </div>
        </div>

        <div className="brief-stage">
          <AnimatePresence mode="wait">
            {phase === 'form' && (
              <motion.div
                key={cur.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                transition={{ duration: 0.38, ease: EASE }}
              >
                <p className="brief-q">{cur.q}</p>

                {cur.kind === 'chips' && (
                  <div className="brief-chips">
                    {cur.opts.map((o, i) => (
                      <motion.button
                        key={o}
                        className={`brief-chip ${val === o ? 'on' : ''}`}
                        onClick={() => { set(o); setTimeout(() => (last ? seal() : setStep((s) => s + 1)), 260) }}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.06 + i * 0.05, duration: 0.3, ease: EASE }}
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        {o}
                      </motion.button>
                    ))}
                  </div>
                )}

                {cur.kind === 'text' && (
                  <input
                    ref={inputRef}
                    className="brief-input"
                    value={val}
                    placeholder={cur.ph}
                    onChange={(e) => set(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && next()}
                  />
                )}

                {cur.kind === 'area' && (
                  <textarea
                    ref={inputRef}
                    className="brief-input area"
                    value={val}
                    placeholder={cur.ph}
                    rows={3}
                    onChange={(e) => set(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.metaKey || e.ctrlKey) && next()}
                  />
                )}

                <div className="brief-nav">
                  {step > 0 && (
                    <button className="brief-back" onClick={() => setStep((s) => s - 1)}>
                      ← {t.brief.back}
                    </button>
                  )}
                  {cur.kind !== 'chips' && (
                    <motion.button
                      className="btn brief-next"
                      onClick={next}
                      animate={{ opacity: ok ? 1 : 0.35 }}
                      whileHover={ok ? { y: -2 } : {}}
                      whileTap={ok ? { scale: 0.97 } : {}}
                    >
                      {last ? t.brief.seal : t.brief.next}
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14M13 6l6 6-6 6" />
                      </svg>
                    </motion.button>
                  )}
                </div>
              </motion.div>
            )}

            {phase !== 'form' && (
              <motion.div
                key="zamkniete"
                className="brief-sealed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.5 }}
              >
                <AnimatePresence>
                  {phase === 'gotowe' && (
                    <motion.div
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, ease: EASE }}
                    >
                      <p className="brief-q" style={{ marginBottom: 6 }}>
                        {t.brief.sealed}
                      </p>
                      <p className="brief-sum">
                        {a.imie} · {a.czego} · {a.kiedy}
                        <br />
                        {a.kontakt}
                      </p>
                      <div className="brief-nav">
                        <motion.a
                          className="btn"
                          href={mailto}
                          whileHover={{ y: -2 }}
                          whileTap={{ scale: 0.97 }}
                        >
                          {t.brief.send}
                        </motion.a>
                        <button className="brief-back" onClick={copy}>
                          {copied ? t.brief.copied : t.brief.copy}
                        </button>
                        <button className="brief-back" onClick={restart}>
                          {t.brief.restart}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* lakowa pieczęć */}
        <AnimatePresence>
          {phase !== 'form' && (
            <motion.div
              className="wax"
              initial={{ scale: 0, rotate: -40, opacity: 0 }}
              animate={{ scale: [0, 1.35, 1], rotate: [-40, 6, -4], opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.75, ease: EASE, times: [0, 0.6, 1] }}
            >
              <svg viewBox="0 0 48 48" aria-hidden="true">
                <circle cx="24" cy="24" r="21" fill="var(--accent)" />
                <circle cx="24" cy="24" r="16.5" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1" />
                <text
                  x="24" y="29" textAnchor="middle"
                  fill="#fff" fontFamily="var(--f-sans)" fontSize="12" fontWeight="700" letterSpacing="1"
                >
                  STRX
                </text>
              </svg>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
