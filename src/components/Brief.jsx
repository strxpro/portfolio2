import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Piksel3D from './Piksel3D'
import { contact } from '../data/site'
import { useLang, useT } from '../lib/lang-ctx'
import { wyslijBrief } from '../lib/kontakt'
import { EASE } from '../lib/motion'

const KINDS = ['text', 'chips', 'chips', 'text', 'area']
const IDS = ['imie', 'czego', 'kiedy', 'kontakt', 'opis']

/** Tyle stoi toast po wysłaniu, zanim formularz wróci do początku. */
const TOAST_MS = 5000

/**
 * Najkrótszy czas stanu „wysyłam”. Odpowiedź Workera potrafi wrócić
 * w 200 ms, a wtedy pieczęć mignęłaby i zniknęła, zanim ktoś ją zobaczy.
 * To zwykły zegar, nie koniec animacji — wysyłka nie czeka na żaden ruch.
 */
const MIN_WYSYLKA_MS = 900

const wstaw = (tekst, dane) => tekst.replace(/\{(\w+)\}/g, (_, k) => dane[k] || '')

/**
 * Brief: pięć pytań po kolei, wysyłka prosto na WhatsApp przez Workera.
 *
 * Stany: form → wysyla → toast (po 5 s z powrotem form) albo blad.
 *
 * Po sukcesie **cała karta zamienia się w toast** — ta sama ramka zwija się
 * animacją układu (`layout`) do małego paska z potwierdzeniem, a po pięciu
 * sekundach rozwija z powrotem w pusty formularz. Powrót liczy zegar, nie
 * koniec animacji, więc formularz wraca nawet przy wstrzymanych klatkach.
 *
 * Przy błędzie niczego nie udajemy: jest zwykły mail z gotową treścią.
 */
export default function Brief() {
  const t = useT()
  const { code } = useLang()
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
  const [phase, setPhase] = useState('form') // form | wysyla | toast | blad
  const [powod, setPowod] = useState('')
  // pułapka na boty: pole niewidoczne dla ludzi, boty wypełniają je same
  const [pulapka, setPulapka] = useState('')
  const start = useRef(Date.now())
  const zywy = useRef(true)
  const inputRef = useRef(null)
  const karta = useRef(null)
  /**
   * Wysokość karty w stanie formularza, trzymana na pojemniku.
   * Toast jest dużo niższy — bez tego nagłówek kontaktu obok podskakiwał
   * przy każdej zmianie, a na telefonie przesuwało się wszystko pod spodem.
   */
  const [wysokosc, setWysokosc] = useState(0)

  const cur = STEPS[step]
  const val = a[cur?.id] ?? ''
  const ok = cur?.optional || String(val).trim().length > 0
  const last = step === STEPS.length - 1

  useEffect(() => {
    zywy.current = true
    return () => { zywy.current = false }
  }, [])

  useEffect(() => {
    if (phase === 'form' && cur?.kind !== 'chips') {
      // `preventScroll` jest tu obowiązkowe: formularz stoi na samym dole,
      // więc zwykły focus() kazał przeglądarce przewinąć do niego całą
      // stronę i czytelnik lądował w kontakcie chwilę po wejściu.
      const id = setTimeout(() => inputRef.current?.focus({ preventScroll: true }), 380)
      return () => clearTimeout(id)
    }
    return undefined
  }, [step, phase, cur?.kind])

  const reset = () => {
    setA({})
    setStep(0)
    setPowod('')
    setPulapka('')
    start.current = Date.now()
    setPhase('form')
  }

  useEffect(() => {
    const el = karta.current
    if (!el || phase === 'toast') return undefined
    // Największa wysokość z wszystkich kroków, nie bieżąca: krok z opisem
    // jest wyższy od „Wysyłam…”, więc bieżąca skracała pojemnik o ~50 px
    // w chwili wysyłki. Od nowa liczymy dopiero przy zmianie szerokości OKNA —
    // szerokość samej karty zmienia się między krokami razem z kolumną
    // kontaktu i każda taka zmiana zerowała zapamiętane maksimum.
    let szer = window.innerWidth
    const zmierz = () => {
      const h = Math.round(el.offsetHeight)
      if (window.innerWidth !== szer) { szer = window.innerWidth; setWysokosc(h); return }
      setWysokosc((stara) => Math.max(stara, h))
    }
    zmierz()
    const obs = new ResizeObserver(zmierz)
    obs.observe(el)
    return () => obs.disconnect()
    // Krok w zależnościach: pomiar przy każdym pytaniu wprost, nie tylko
    // przez obserwator, który przy wstrzymanych klatkach potrafi milczeć
  }, [phase, step])

  // toast znika sam po 5 s — zegar, nie animacja
  useEffect(() => {
    if (phase !== 'toast') return undefined
    const id = setTimeout(reset, TOAST_MS)
    return () => clearTimeout(id)
  }, [phase])

  const set = (v) => setA((s) => ({ ...s, [cur.id]: v }))

  const wyslij = async (odpowiedzi = a) => {
    setPhase('wysyla')
    const [wynik] = await Promise.all([
      wyslijBrief({
        ...odpowiedzi,
        lang: code,
        czas: Date.now() - start.current,
        www: pulapka,
      }),
      new Promise((r) => setTimeout(r, MIN_WYSYLKA_MS)),
    ])
    if (!zywy.current) return
    if (wynik.ok) {
      setPhase('toast')
    } else {
      setPowod(wynik.powod)
      setPhase('blad')
    }
  }

  const next = () => {
    if (!ok) return
    if (last) wyslij()
    else setStep((s) => s + 1)
  }

  const wybierz = (o) => {
    const nowe = { ...a, [cur.id]: o }
    setA(nowe)
    setTimeout(() => (last ? wyslij(nowe) : setStep((s) => s + 1)), 260)
  }

  const body = [
    `${t.brief.mailHi} ${a.imie || '—'}.`,
    '',
    `${t.brief.mailNeed}: ${a.czego || '—'}`,
    `${t.brief.mailWhen}: ${a.kiedy || '—'}`,
    `${t.brief.mailContact}: ${a.kontakt || '—'}`,
    a.opis ? `\n${t.brief.mailAbout}: ${a.opis}` : '',
  ].join('\n')

  const mailto = `mailto:${contact.email}?subject=${encodeURIComponent(
    `${t.brief.mailSubject} — ${a.czego || ''}`.trim()
  )}&body=${encodeURIComponent(body)}`

  const toast = phase === 'toast'
  const zaklejona = phase === 'wysyla' || phase === 'blad'

  return (
    <div className="brief" style={{ minHeight: wysokosc || undefined }}>
      <motion.div
        ref={karta}
        layout
        className={`brief-card ${toast ? 'as-toast' : ''}`}
        transition={{ layout: { type: 'spring', stiffness: 260, damping: 30, mass: 0.9 } }}
        role={toast ? 'status' : undefined}
        aria-live="polite"
      >
        {toast ? (
          <motion.div
            key="toast"
            layout="position"
            className="toast-in"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.34, delay: 0.18, ease: EASE }}
          >
            <svg className="toast-ok" width="34" height="34" viewBox="0 0 34 34" aria-hidden="true">
              <circle cx="17" cy="17" r="16" fill="var(--accent)" />
              <motion.path
                d="M10 17.5l4.6 4.6L24 12.6"
                fill="none"
                stroke="#fff"
                strokeWidth="2.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.42, delay: 0.32, ease: EASE }}
              />
            </svg>
            <div className="toast-txt">
              <p className="toast-title">{wstaw(t.brief.okTitle, a)}</p>
              <p className="toast-sub">{wstaw(t.brief.okText, a)}</p>
            </div>
            <button type="button" className="toast-x" onClick={reset} aria-label={t.brief.restart}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </motion.div>
        ) : null}

        {/* pasek odliczania 5 s — bezpośrednio w karcie, przy jej dolnej krawędzi;
            tylko pokazuje czas, powrotem steruje zegar */}
        {toast && (
          <span className="toast-bar" style={{ animationDuration: `${TOAST_MS}ms` }} aria-hidden="true" />
        )}

        {!toast ? (
          <motion.div
            key="formularz"
            layout="position"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, ease: EASE }}
          >
            {/* górna klapka koperty — zamyka się przy wysyłce */}
            <motion.div
              className="flap"
              initial={false}
              animate={{ rotateX: zaklejona ? 0 : -178 }}
              transition={{ duration: 0.54, ease: EASE }}
            />

            <div className="brief-top">
              <div className="brief-face">
                <Piksel3D mood={phase === 'blad' ? 'zdziwiony' : 'mowi'} size={62} idleSpin={false} />
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

            <input
              className="brief-pulapka"
              name="www"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              value={pulapka}
              onChange={(e) => setPulapka(e.target.value)}
            />

            <div className="brief-stage">
              {phase === 'form' && (
                /* Zwykła zmiana klucza zamiast AnimatePresence mode="wait" —
                   „wait” czekał na wyjście poprzedniego pytania i przy
                   wstrzymanych klatkach następne nie przychodziło wcale. */
                <motion.div
                  key={cur.id}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.34, ease: EASE }}
                >
                  <p className="brief-q">{cur.q}</p>

                  {cur.kind === 'chips' && (
                    <div className="brief-chips">
                      {cur.opts.map((o, i) => (
                        <motion.button
                          key={o}
                          type="button"
                          className={`brief-chip ${val === o ? 'on' : ''}`}
                          onClick={() => wybierz(o)}
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
                      maxLength={cur.id === 'kontakt' ? 120 : 80}
                      autoComplete={cur.id === 'imie' ? 'given-name' : 'on'}
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
                      maxLength={1200}
                      onChange={(e) => set(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && (e.metaKey || e.ctrlKey) && next()}
                    />
                  )}

                  <div className="brief-nav">
                    {step > 0 && (
                      <button type="button" className="brief-back" onClick={() => setStep((s) => s - 1)}>
                        ← {t.brief.back}
                      </button>
                    )}
                    {cur.kind !== 'chips' && (
                      <motion.button
                        type="button"
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

              {phase === 'wysyla' && (
                <motion.p
                  key="wysyla"
                  className="brief-q brief-sealed"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.4 }}
                >
                  {t.brief.sending}
                </motion.p>
              )}

              {phase === 'blad' && (
                <motion.div
                  key="blad"
                  className="brief-sealed"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: EASE }}
                >
                  <p className="brief-q" style={{ marginBottom: 6 }}>{t.brief.errTitle}</p>
                  <p className="brief-sum">{powod === 'TOO_MANY' ? t.brief.tooMany : t.brief.errText}</p>
                  <div className="brief-nav">
                    <a className="btn" href={mailto}>{t.brief.send}</a>
                    <button type="button" className="brief-back" onClick={() => wyslij()}>{t.brief.retry}</button>
                    <button type="button" className="brief-back" onClick={reset}>{t.brief.restart}</button>
                  </div>
                </motion.div>
              )}
            </div>

            {/* lakowa pieczęć — ozdoba wysyłki, niczego nie blokuje */}
            <AnimatePresence>
              {zaklejona && (
                <motion.div
                  className="wax"
                  initial={{ scale: 0, rotate: -40, opacity: 0 }}
                  animate={{ scale: [0, 1.35, 1], rotate: [-40, 6, -4], opacity: 1 }}
                  exit={{ opacity: 0, scale: 0.6 }}
                  transition={{ duration: 0.5, delay: 0.45, ease: EASE, times: [0, 0.6, 1] }}
                >
                  <svg viewBox="0 0 48 48" aria-hidden="true">
                    <circle cx="24" cy="24" r="21" fill="var(--accent)" />
                    <circle cx="24" cy="24" r="16.5" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1" />
                    <text x="24" y="29" textAnchor="middle" fill="#fff" fontFamily="var(--f-sans)" fontSize="12" fontWeight="700" letterSpacing="1">
                      STRX
                    </text>
                  </svg>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ) : null}
      </motion.div>
    </div>
  )
}
