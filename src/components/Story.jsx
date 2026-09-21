import { useEffect, useRef, useState } from 'react'
import { motion, useInView, useMotionValueEvent, useScroll } from 'framer-motion'
import { useT } from '../lib/lang-ctx'
import { useLoopSpring } from '../lib/useLoopSpring'
import { useNarrow } from '../lib/useNarrow'
import { useGuide } from '../lib/mascot'
import { EASE } from '../lib/motion'

const ROZDZIALY = 5

function maWebGL() {
  try {
    const c = document.createElement('canvas')
    return !!(c.getContext('webgl2') || c.getContext('webgl'))
  } catch {
    return false
  }
}

/**
 * Opowieść: budowa jednej strony, od rozmowy do startu.
 *
 * Zastępuje listę usług, płyty „przekazania” i osobny nagłówek procesu —
 * to wszystko były te same informacje podane trzy razy. Tutaj każda
 * usługa ma swoje miejsce w historii: projekt jest w szkicu, animacje
 * i 3D w kodzie, panel i automatyzacje w podpięciach.
 *
 * Scena 3D (`three/budowa.js`) ładuje się dopiero, gdy sekcja jest blisko
 * ekranu, więc Three.js nie obciąża pierwszego wejścia na stronę. Bez
 * WebGL-a zostaje sam tekst rozdziałów — nic nie znika.
 */
export default function Story() {
  const t = useT()
  const ref = useRef(null)
  const stage = useRef(null)
  const plotno = useRef(null)
  const scena = useRef(null)
  const waski = useNarrow(900)
  const [gl, setGl] = useState(null)
  const [idx, setIdx] = useState(0)

  const blisko = useInView(ref, { margin: '120% 0px 120% 0px' })
  const widac = useInView(ref, { margin: '10% 0px 10% 0px' })

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const p = useLoopSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.0005 })

  const guideRef = useGuide({ id: 'opowiesc', text: t.guide.story, corner: 'br', mood: 'mowi', amount: 0.1 })

  useMotionValueEvent(p, 'change', (v) => {
    const c = v * ROZDZIALY
    scena.current?.ustaw(c)
    const i = Math.min(ROZDZIALY - 1, Math.max(0, Math.floor(c)))
    setIdx((was) => (was === i ? was : i))
  })

  // scena: leniwie, raz — potem tylko start/stop
  useEffect(() => {
    if (!blisko || scena.current || gl === false) return undefined
    if (!maWebGL()) {
      setGl(false)
      return undefined
    }
    let zywy = true
    import('../three/budowa')
      .then(({ zbuduj }) => {
        if (!zywy || !plotno.current) return
        const lekko = window.matchMedia('(max-width: 900px), (pointer: coarse)').matches
        const s = zbuduj(plotno.current, { lekko })
        scena.current = s
        const r = stage.current.getBoundingClientRect()
        s.rozmiar(r.width, r.height, window.matchMedia('(max-width: 900px)').matches)
        s.ustaw(p.get() * ROZDZIALY)
        setGl(true)
      })
      .catch(() => setGl(false))
    return () => { zywy = false }
  }, [blisko, gl, p])

  useEffect(() => () => { scena.current?.zniszcz(); scena.current = null }, [])

  useEffect(() => {
    scena.current?.teksty(t.story.bubbles, t.story.plytki)
  }, [t, gl])

  useEffect(() => {
    if (!gl) return undefined
    if (widac) scena.current?.start()
    else scena.current?.stop()
    return undefined
  }, [widac, gl])

  // rozmiar płótna = rozmiar sceny
  useEffect(() => {
    if (!gl) return undefined
    const el = stage.current
    const zmierz = () => {
      const r = el.getBoundingClientRect()
      scena.current?.rozmiar(r.width, r.height, waski)
    }
    zmierz()
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(zmierz) : null
    ro?.observe(el)
    window.addEventListener('resize', zmierz)
    return () => {
      ro?.disconnect()
      window.removeEventListener('resize', zmierz)
    }
  }, [gl, waski])

  // przechył za kursorem (na telefonie strona stoi — palec przewija)
  useEffect(() => {
    if (!gl || waski) return undefined
    const ruch = (e) => {
      scena.current?.tilt((e.clientX / window.innerWidth) * 2 - 1, (e.clientY / window.innerHeight) * 2 - 1)
    }
    window.addEventListener('pointermove', ruch, { passive: true })
    return () => window.removeEventListener('pointermove', ruch)
  }, [gl, waski])

  const rozdzialy = t.story.chapters
  const [nazwa, kiedy, tytul, tekst, punkty] = rozdzialy[idx]

  return (
    <section
      className={`story ${gl === false ? 'bez-3d' : ''}`}
      id="opowiesc"
      ref={(el) => { ref.current = el; guideRef.current = el }}
      aria-label={t.story.kicker}
    >
      <div className="story-stick" ref={stage}>
        <canvas className="story-canvas" ref={plotno} aria-hidden="true" />

        <div className="story-copy">
          <p className="story-kicker">{t.story.kicker}</p>

          {/* zwykła zmiana klucza — tekst nie czeka na wyjście poprzedniego */}
          <motion.div
            key={idx}
            className="story-ch"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
            aria-live="polite"
          >
            <p className="story-num">
              <b>{String(idx + 1).padStart(2, '0')}</b>
              <span>{nazwa}</span>
              <em>{kiedy}</em>
            </p>
            <h2 className="story-title">{tytul}</h2>
            <p className="story-lead">{tekst}</p>
            <ul className="story-points">
              {punkty.map((x) => <li key={x}>{x}</li>)}
            </ul>
          </motion.div>
        </div>

        {/* linijka rozdziałów, jak podziałka z boku kadru */}
        <ol className="story-ruler" aria-hidden="true">
          {rozdzialy.map(([n], i) => (
            <li key={n} className={i === idx ? 'on' : i < idx ? 'za' : ''}>
              <i>{String(i + 1).padStart(2, '0')}</i>
              <span>{n}</span>
            </li>
          ))}
          <motion.b className="story-fill" style={waski ? { scaleX: p } : { scaleY: p }} />
        </ol>
      </div>
    </section>
  )
}
