import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import Piksel3D from './Piksel3D'
import Termin, { terminGotowy } from './brief/Termin'
import Kontakt, { sprawdzKontakt } from './brief/Kontakt'
import Pocztowka from './brief/Pocztowka'
import { contact } from '../data/site'
import { useLang, useT } from '../lib/lang-ctx'
import { wyslijBrief } from '../lib/kontakt'
import { domyslneKierunkowe, telefonCzytelny } from '../lib/walidacja'
import { EASE } from '../lib/motion'
import { useNarrow } from '../lib/useNarrow'

const IDS = ['imie', 'czego', 'kiedy', 'kontakt', 'opis']

/** Tyle stoi toast po wysłaniu, zanim formularz wróci do początku. */
const TOAST_MS = 5000

/**
 * Oś czasu wysyłki. Zegar, nie koniec animacji: scena pocztówki jest tylko
 * obrazem, a stan formularza zmieniają te liczby i odpowiedź Workera.
 */
const PAKOWANIE_MS = 1150
const ODLOT_MS = 1000

const wstaw = (tekst, dane) => tekst.replace(/\{(\w+)\}/g, (_, k) => dane[k] ?? '')

/**
 * Brief: pięć pytań po kolei, wysyłka prosto na WhatsApp przez Workera.
 *
 * Stany: form → pakuje → odlot → toast (po 5 s z powrotem form) albo blad.
 *
 * Nie ma tu żadnego „wyślij na…” ani „wysyłam…”: po ostatnim kroku
 * pocztówka pakuje się do koperty i odlatuje w przestrzeń, a potem
 * wychodzi toast z potwierdzeniem. Przy błędzie niczego nie udajemy —
 * jest mail z gotową treścią.
 */
export default function Brief() {
  const t = useT()
  const { code } = useLang()
  const pytania = t.brief.q
  const OPCJE = t.brief.opts[1]
  const INNE = OPCJE[OPCJE.length - 1]

  const pusty = () => ({ imie: '', czego: '', czegoInne: '', termin: null, email: '', kod: domyslneKierunkowe(code), tel: '', opis: '' })
  const [a, setA] = useState(pusty)
  const [step, setStep] = useState(0)
  const [phase, setPhase] = useState('form') // form | pakuje | odlot | toast | blad
  const [powod, setPowod] = useState('')
  const [dotkniete, setDotkniete] = useState({ email: false, tel: false })
  // pułapka na boty: pole niewidoczne dla ludzi, boty wypełniają je same
  const [pulapka, setPulapka] = useState('')
  const start = useRef(Date.now())
  const zywy = useRef(true)
  const inputRef = useRef(null)
  const karta = useRef(null)
  const zegary = useRef([])
  const [wysokosc, setWysokosc] = useState(0)
  /**
   * Na telefonie wysokości nie trzymamy. Nagłówek kontaktu stoi tam NAD
   * formularzem, a panel ma wysokość ekranu — zapamiętane 715 px kalendarza
   * wypychało nagłówek poza panel także na kolejnych, niskich krokach.
   */
  const waski = useNarrow(860)

  const id = IDS[step]
  const last = step === IDS.length - 1
  const set = (zmiana) => setA((s) => ({ ...s, ...zmiana }))

  const czegoWartosc = a.czego === INNE ? a.czegoInne.trim() : a.czego
  const kontaktStan = sprawdzKontakt(a)
  const ok = {
    imie: a.imie.trim().length > 0,
    czego: czegoWartosc.length > 0,
    kiedy: terminGotowy(a.termin),
    kontakt: kontaktStan.gotowy,
    opis: true,
  }[id]

  useEffect(() => {
    zywy.current = true
    const lista = zegary.current
    return () => { zywy.current = false; lista.forEach(clearTimeout) }
  }, [])

  useEffect(() => {
    if (phase !== 'form' || id === 'kiedy' || (id === 'czego' && a.czego !== INNE)) return undefined
    // `preventScroll`: formularz stoi na samym dole, zwykły focus() przewijał do niego stronę
    const z = setTimeout(() => inputRef.current?.focus({ preventScroll: true }), 380)
    return () => clearTimeout(z)
  }, [step, phase, id, a.czego, INNE])

  /**
   * Wysokość pojemnika: największa z kroków, przeliczana przy każdej zmianie.
   * Kalendarz jest wyższy od pozostałych pytań, a toast dużo niższy — bez
   * tego nagłówek kontaktu obok podskakiwał, a na telefonie całość pod spodem.
   * Od nowa liczymy tylko przy zmianie szerokości okna.
   */
  useEffect(() => {
    const el = karta.current
    if (!el || phase === 'toast') return undefined
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
  }, [phase, step, a.termin, a.czego])

  const reset = () => {
    zegary.current.forEach(clearTimeout)
    zegary.current = []
    setA(pusty())
    setStep(0)
    setPowod('')
    setPulapka('')
    setDotkniete({ email: false, tel: false })
    // pusty formularz jest niższy niż kalendarz — zapamiętaną wysokość liczymy od nowa
    setWysokosc(0)
    start.current = Date.now()
    setPhase('form')
  }

  // toast znika sam po 5 s — zegar, nie animacja
  useEffect(() => {
    if (phase !== 'toast') return undefined
    const z = setTimeout(reset, TOAST_MS)
    return () => clearTimeout(z)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase])

  const wyslij = (dane = a) => {
    zegary.current.forEach(clearTimeout)
    setPhase('pakuje')
    const wynik = wyslijBrief({
      imie: dane.imie,
      czego: dane.czego === INNE ? dane.czegoInne.trim() : dane.czego,
      termin: dane.termin,
      email: dane.email.trim(),
      telefon: dane.tel.trim() ? telefonCzytelny(dane.kod, dane.tel) : '',
      opis: dane.opis,
      lang: code,
      czas: Date.now() - start.current,
      www: pulapka,
    })
    const scena = new Promise((r) => {
      zegary.current.push(setTimeout(() => zywy.current && setPhase('odlot'), PAKOWANIE_MS))
      zegary.current.push(setTimeout(r, PAKOWANIE_MS + ODLOT_MS))
    })
    Promise.all([wynik, scena]).then(([w]) => {
      if (!zywy.current) return
      if (w.ok) setPhase('toast')
      else { setPowod(w.powod); setPhase('blad') }
    })
  }

  const dalej = () => {
    if (id === 'kontakt' && !kontaktStan.gotowy) {
      setDotkniete({ email: true, tel: true })
      return
    }
    if (!ok) return
    if (last) wyslij()
    else setStep((s) => s + 1)
  }

  const wybierzCzego = (o) => {
    set({ czego: o })
    if (o !== INNE) zegary.current.push(setTimeout(() => setStep((s) => Math.max(s, 2)), 260))
  }

  // treść maila zapasowego
  const gdzie = [a.email.trim(), a.tel.trim() && telefonCzytelny(a.kod, a.tel)].filter(Boolean).join(', ')
  const kiedyTekst = a.termin?.typ === 'termin' && a.termin.godzina
    ? `${a.termin.dzien.split('-').reverse().join('.')} ${a.termin.godzina}`
    : t.brief.dogadac
  const body = [
    `${t.brief.mailHi} ${a.imie || '—'}.`,
    '',
    `${t.brief.mailNeed}: ${czegoWartosc || '—'}`,
    `${t.brief.mailWhen}: ${kiedyTekst}`,
    `${t.brief.mailContact}: ${gdzie || '—'}`,
    a.opis ? `\n${t.brief.mailAbout}: ${a.opis}` : '',
  ].join('\n')
  const mailto = `mailto:${contact.email}?subject=${encodeURIComponent(`${t.brief.mailSubject} — ${czegoWartosc}`.trim())}&body=${encodeURIComponent(body)}`

  const okTekst = () => {
    if (a.termin?.typ === 'termin' && a.termin.godzina) {
      return wstaw(t.brief.okTermin, { kiedy: `${a.termin.dzien.split('-').slice(1).reverse().join('.')}, ${a.termin.godzina}` })
    }
    const kanal = a.email.trim() && a.tel.trim() ? t.brief.naOba : a.tel.trim() ? t.brief.naTel : t.brief.naMail
    return wstaw(t.brief.okText, { gdzie: kanal })
  }

  const toast = phase === 'toast'
  const scena = phase === 'pakuje' || phase === 'odlot'

  return (
    <div className="brief" style={{ minHeight: !waski && wysokosc ? wysokosc : undefined }}>
      {/* komunikat dla czytnika ekranu — scena pocztówki jest aria-hidden */}
      <p className="sr-only" aria-live="polite">{scena ? t.brief.lecisz : ''}</p>

      {toast ? (
        <motion.div
          key="toast"
          className="brief-card as-toast"
          role="status"
          initial={{ opacity: 0, y: 18, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 26 }}
        >
          <div className="toast-in">
            <svg className="toast-ok" width="34" height="34" viewBox="0 0 34 34" aria-hidden="true">
              <circle cx="17" cy="17" r="16" fill="var(--accent)" />
              <motion.path
                d="M10 17.5l4.6 4.6L24 12.6"
                fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.42, delay: 0.2, ease: EASE }}
              />
            </svg>
            <div className="toast-txt">
              <p className="toast-title">{wstaw(t.brief.okTitle, { imie: a.imie.trim() })}</p>
              <p className="toast-sub">{okTekst()}</p>
            </div>
            <button type="button" className="toast-x" onClick={reset} aria-label={t.brief.restart}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>
          {/* odliczanie 5 s — tylko pokazuje czas, powrotem steruje zegar */}
          <span className="toast-bar" style={{ animationDuration: `${TOAST_MS}ms` }} aria-hidden="true" />
        </motion.div>
      ) : (
        <div ref={karta} className={`brief-card ${scena ? 'w-locie' : ''} ${id === 'kiedy' && a.termin?.typ === 'termin' ? 'z-kalendarzem' : ''}`}>
          {scena && <Pocztowka faza={phase} imie={a.imie.trim()} />}

          <motion.div
            className="brief-tresc"
            animate={{ opacity: scena ? 0 : 1 }}
            transition={{ duration: 0.22 }}
            aria-hidden={scena}
          >
            <div className="brief-top">
              <div className="brief-face">
                <Piksel3D mood={phase === 'blad' ? 'zdziwiony' : 'mowi'} size={62} idleSpin={false} />
              </div>
              <div className="brief-dots">
                {IDS.map((s, i) => (
                  <motion.span
                    key={s}
                    className={`dot ${i <= step ? 'on' : ''}`}
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
              {phase === 'blad' ? (
                <motion.div
                  key="blad"
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
              ) : (
                /* zwykła zmiana klucza zamiast AnimatePresence mode="wait" */
                <motion.div
                  key={id}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.34, ease: EASE }}
                >
                  <p className="brief-q">{pytania[step]}</p>

                  {id === 'imie' && (
                    <input
                      ref={inputRef}
                      className="brief-input"
                      value={a.imie}
                      placeholder={t.brief.ph[0]}
                      maxLength={80}
                      autoComplete="given-name"
                      onChange={(e) => set({ imie: e.target.value })}
                      onKeyDown={(e) => e.key === 'Enter' && dalej()}
                    />
                  )}

                  {id === 'czego' && (
                    <>
                      <div className="brief-chips">
                        {OPCJE.map((o, i) => (
                          <motion.button
                            key={o}
                            type="button"
                            className={`brief-chip ${a.czego === o ? 'on' : ''}`}
                            aria-pressed={a.czego === o}
                            onClick={() => wybierzCzego(o)}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.06 + i * 0.05, duration: 0.3, ease: EASE }}
                            whileTap={{ scale: 0.97 }}
                          >
                            {o}
                          </motion.button>
                        ))}
                      </div>
                      {a.czego === INNE && (
                        <motion.input
                          ref={inputRef}
                          className="brief-input brief-inne"
                          value={a.czegoInne}
                          placeholder={t.brief.inne}
                          maxLength={80}
                          onChange={(e) => set({ czegoInne: e.target.value })}
                          onKeyDown={(e) => e.key === 'Enter' && dalej()}
                          initial={{ opacity: 0, y: -6 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.28, ease: EASE }}
                        />
                      )}
                    </>
                  )}

                  {id === 'kiedy' && (
                    <Termin
                      value={a.termin}
                      onChange={(termin) => set({ termin })}
                      onDogadac={() => zegary.current.push(setTimeout(() => setStep((s) => Math.max(s, 3)), 260))}
                    />
                  )}

                  {id === 'kontakt' && (
                    <Kontakt
                      value={a}
                      inputRef={inputRef}
                      onChange={({ email, kod, tel }) => set({ email, kod, tel })}
                      pokazBledy={dotkniete}
                      onDotkniete={(pole) => setDotkniete((d) => ({ ...d, [pole]: true }))}
                      onEnter={dalej}
                    />
                  )}

                  {id === 'opis' && (
                    <textarea
                      ref={inputRef}
                      className="brief-input area"
                      value={a.opis}
                      placeholder={t.brief.ph[4]}
                      rows={3}
                      maxLength={1200}
                      onChange={(e) => set({ opis: e.target.value })}
                      onKeyDown={(e) => e.key === 'Enter' && (e.metaKey || e.ctrlKey) && dalej()}
                    />
                  )}

                  <div className="brief-nav">
                    {step > 0 && (
                      <button type="button" className="brief-back" onClick={() => setStep((s) => s - 1)}>
                        ← {t.brief.back}
                      </button>
                    )}
                    {id === 'opis' && !a.opis.trim() && (
                      <button type="button" className="brief-back brief-pomin" onClick={() => wyslij({ ...a, opis: '' })}>
                        {t.brief.pomin}
                      </button>
                    )}
                    {/* guzik „dalej” tam, gdzie wybór nie przechodzi dalej sam */}
                    {(id !== 'czego' || a.czego === INNE) && (id !== 'kiedy' || a.termin?.typ === 'termin') && (id !== 'opis' || a.opis.trim()) && (
                      <motion.button
                        type="button"
                        className="btn brief-next"
                        onClick={dalej}
                        animate={{ opacity: ok ? 1 : 0.35 }}
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
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
