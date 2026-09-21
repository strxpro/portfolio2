import { useEffect, useRef, useState } from 'react'
import { animate, motion, useInView, useMotionValue, useMotionValueEvent, useScroll, useSpring, useTransform, useVelocity } from 'framer-motion'
import { useLoopSpring } from '../lib/useLoopSpring'
import Piksel3D from './Piksel3D'
import { me, contact } from '../data/site'
import { useMascot } from '../lib/mascot'
import { goToTop } from '../lib/scroll'
import Brief from './Brief'
import Type from './Type'
import { useT } from '../lib/lang-ctx'
import { grab, isOn } from '../lib/sound'

const LINKS = [
  { k: 'e-mail', href: `mailto:${contact.email}` },
  { k: 'telefon', href: `tel:${contact.phone.replace(/\s/g, '')}` },
  { k: 'whatsapp', href: contact.whatsapp, blank: true },
  { k: 'instagram', href: contact.instagram, blank: true },
  { k: 'github', href: contact.github, blank: true },
]

const clamp01 = (v) => Math.min(1, Math.max(0, v))
const ease = (k) => 1 - Math.pow(1 - k, 3)

/** Pozycja Piksela w vh na całej długości sceny — jedno źródło prawdy. */
function pikselY(v) {
  const stops = [
    [0, 62], [0.12, 62], [0.34, 14], [0.46, 14], [0.86, 76], [1, 76],
  ]
  for (let i = 1; i < stops.length; i++) {
    const [b, vb] = stops[i]
    const [a, va] = stops[i - 1]
    if (v <= b) {
      const k = b === a ? 1 : (v - a) / (b - a)
      return va + (vb - va) * k
    }
  }
  return 76
}

export default function Finale() {
  const t = useT()
  const sect = useRef(null)
  /**
   * Scena rusza dopiero, gdy sekcja stoi już na swoim miejscu.
   *
   * Warunkiem nie jest „widać kawałek", tylko przyklejenie: górna
   * krawędź finału musi dojść do góry okna, czyli scena wypełnia kadr
   * na całą wysokość. Wcześniej chwyt zaczynał się, gdy z sekcji
   * wystawał ledwie skrawek, i czytelnik go nie widział.
   *
   * `useInView` się tu nie nadaje — sekcja jest wyższa niż ekran, więc
   * nigdy nie będzie widoczna „w całości".
   */
  const { scrollYProgress: enter } = useScroll({ target: sect, offset: ['start start', 'end end'] })
  const [pinned, setPinned] = useState(false)
  useMotionValueEvent(enter, 'change', (v) => {
    setPinned((was) => (v > 0.015 ? true : v <= 0.001 ? false : was))
  })
  const inView = pinned
  const { setTakeover } = useMascot()
  const [phase, setPhase] = useState(0)

  useEffect(() => { setTakeover(inView) }, [inView, setTakeover])
  useEffect(() => () => setTakeover(false), [setTakeover])

  /**
   * Cała scena leci z JEDNEGO wejścia, nie z przewijania krok po kroku.
   *
   * `run` jedzie od zera do jedynki własnym tempem, kiedy sekcja wjedzie
   * w kadr — dzięki temu wystarczy raz doscrollować i chwyt, szarpnięcie
   * i zjazd panelu rozgrywają się same, w swoim rytmie. Wszystkie
   * przekształcenia niżej zostają bez zmian, bo dalej czytają `sp`.
   *
   * Wyjście z kadru cofa animację, więc wracając na górę widzisz ją
   * jeszcze raz od początku.
   */
  const run = useMotionValue(0)
  const sp = useLoopSpring(run, { stiffness: 150, damping: 24, mass: 0.6 })

  useEffect(() => {
    const controls = animate(run, inView ? 1 : 0, {
      duration: inView ? 2.5 : 0.45,
      ease: inView ? [0.33, 0, 0.2, 1] : 'easeOut',
    })
    return () => controls.stop()
  }, [inView, run])

  // Piksel: stoi → wzlatuje → łapie → ciągnie w dół → ląduje
  const yNum = useTransform(sp, pikselY)
  const y = useTransform(yNum, (v) => `${v}vh`)
  const scale = useTransform(sp, [0, 0.12, 0.34], [1, 1, 0.9])

  /**
   * Sznurek jest doklejony do rąk, nie animowany obok nich.
   *
   * Do momentu chwytu jego koniec zjeżdża z góry ku dłoniom, a po chwycie
   * długość liczy się wprost z pozycji Piksela — dzięki temu nigdy się od
   * niego nie odrywa i nie ma szansy na rozjazd między dwiema osobnymi
   * animacjami.
   */
  const cordNum = useTransform(sp, (v) => {
    const hand = pikselY(v) + 2.5
    return hand * ease(clamp01((v - 0.14) / 0.20))
  })
  const cordH = useTransform(cordNum, (v) => `${v}vh`)
  const cordOp = useTransform(sp, [0.14, 0.2], [0, 1])

  // napięcie liny: im szybciej Piksel zjeżdża, tym mocniej się naciąga
  const pullSpeed = useVelocity(yNum)
  const strain = useTransform(pullSpeed, [-40, 0, 60], [-2.4, 0, 3.2])
  const cordTilt = useSpring(strain, { stiffness: 150, damping: 14 })
  const cordThick = useTransform(pullSpeed, [0, 60], [1.5, 2.6])

  /**
   * Panel jedzie na własnej, wyraźnie miększej sprężynie niż Piksel.
   * To opóźnienie robi cały efekt ciężaru: lina napina się pierwsza,
   * a płachta rusza chwilę potem i dojeżdża z lekkim przeciągnięciem.
   */
  const panelRaw = useTransform(sp, [0.46, 0.9], [-100, 0])
  const panelSpring = useLoopSpring(panelRaw, { stiffness: 95, damping: 19, mass: 1.15 })
  const panelY = useTransform(panelSpring, (v) => `${Math.min(v, 0)}%`)

  const msgOp = useTransform(sp, [0, 0.08, 0.22], [1, 1, 0])
  const msgY = useTransform(sp, [0, 0.22], [0, -50])

  /**
   * Nagłówek w panelu jedzie ze scrolla, a nie z `whileInView`.
   * Panel wjeżdża pod własnym transformem wewnątrz przyciętej sceny —
   * obserwator widoczności nie łapał tam wjazdu i tytuł zostawał
   * schowany pod maską na zawsze.
   */
  const headA = useTransform(sp, [0.62, 0.82], ['108%', '0%'])
  const headB = useTransform(sp, [0.66, 0.86], ['108%', '0%'])

  useEffect(() => {
    return sp.on('change', (v) => {
      const next = v < 0.12 ? 0 : v < 0.34 ? 1 : v < 0.46 ? 2 : v < 0.86 ? 3 : 4
      setPhase((cur) => {
        if (cur === next) return cur
        if (next === 2 && isOn()) grab() // moment chwytu
        return next
      })
    })
  }, [sp])

  const MOOD = ['spokoj', 'zdziwiony', 'zdziwiony', 'ciagnie', 'spokoj']
  const held = phase >= 2

  return (
    <section className="finale" ref={sect} id="finale">
      {/* szarpnięcie w chwili chwytu — cała scena drga raz i wraca */}
      <motion.div
        className="stage"
        animate={phase === 2 ? { x: [0, -7, 6, -3, 0], y: [0, 4, -3, 1, 0] } : { x: 0, y: 0 }}
        transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
      >
        <motion.div className="stage-msg" style={{ opacity: msgOp, y: msgY }}>
          <Type as="h2" className="title" text={t.finale.title} delay={0.08} amount={0.2} />
          <p className="lead">{t.finale.lead}</p>
        </motion.div>

        <motion.div className="cord-wrap" style={{ opacity: cordOp }}>
          <motion.div
            className="cord-arm"
            style={{ rotate: cordTilt }}
            /* Kołysze się tylko w fazie 1 — jedynej, w której sznurek jest
               widoczny i jeszcze nie chwycony. W fazie 0 ma krycie 0, a pętla
               liczyła się co klatkę przez całą resztę strony. */
            animate={phase === 1 ? { rotate: [-1.4, 1.4, -1.4] } : { rotate: 0 }}
            transition={phase === 1 ? { duration: 4.4, repeat: Infinity, ease: 'easeInOut' } : { duration: 0.3 }}
          >
            <motion.div className="cord" style={{ height: cordH, width: cordThick }} />
            <motion.div
              className="knob"
              animate={held ? { scaleX: 1.16, scaleY: 0.84 } : { scaleX: 1, scaleY: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 18 }}
            />
          </motion.div>
        </motion.div>

        <motion.div className="piksel-stage" style={{ y, scale }}>
          <Piksel3D mood={MOOD[phase]} pose={held && phase < 4 ? 'gora' : 'auto'} size={null} idleSpin={false} />
        </motion.div>

        <motion.div className="panel" style={{ y: panelY }} id="kontakt">
          <div className="panel-in">
            <div className="contact">
              <div>
                <h2 className="display">
                  <span className="t-line"><span className="t-word">
                    <motion.span style={{ y: headA }}>{t.finale.cTitle1}</motion.span>
                  </span></span>
                  <span className="t-line"><span className="t-word">
                    <motion.span style={{ y: headB }}><em>{t.finale.cTitle2}</em></motion.span>
                  </span></span>
                </h2>
                <p className="lead" style={{ marginTop: 18 }}>
                  {t.finale.cLead}
                </p>

                <div className="quick">
                {LINKS.map((l) => (
                  <a
                    key={l.k}
                    href={l.href}
                    target={l.blank ? '_blank' : undefined}
                    rel={l.blank ? 'noreferrer' : undefined}
                  >
                    {l.k === 'telefon' ? t.brief.telefon.toLowerCase() : l.k}
                  </a>
                ))}
              </div>
            </div>

            <Brief />
            </div>

            <div className="footer">
              <span>© {new Date().getFullYear()} {me.name} · {me.brand}</span>
              {/* `hero.place` wyleciało razem z porządkami w hero i ta linia
                  renderowała pustkę — stopka ma teraz własny klucz. */}
              <span>{t.finale.where}</span>
              <div className="footer-end">
                {/* Wejście do panelu prac. Nie jest schowane, bo nie ma tu
                    czego chronić: panel zapisuje do pamięci przeglądarki
                    i pobiera plik, niczego nie publikuje. */}
                <a className="footer-panel" href="#admin">{t.finale.panel}</a>
                <button onClick={goToTop}>
                  {t.finale.back} ↑
                </button>
              </div>
            </div>
          </div>
          <div className="panel-grip" />
        </motion.div>
      </motion.div>
    </section>
  )
}
