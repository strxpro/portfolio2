import { useEffect, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { AnimatePresence, useMotionValueEvent, useScroll } from 'framer-motion'
import Tunnel from './gl/Tunnel'
import Focus from './Focus'
import Tour from './Tour'
import Morph from './Morph'
import { textOf, useProjects } from '../lib/projects'
import { useT } from '../lib/lang-ctx'
import { useGuide } from '../lib/mascot'
import { isOn, pop, shut } from '../lib/sound'

/**
 * Tunel prac na WebGL-u.
 *
 * Sekcja jest wysoka, a kanwa w środku przyklejona do ekranu —
 * przewijanie nie przesuwa więc obrazu, tylko **prowadzi kamerę
 * w głąb**. Postęp sekcji trafia do sceny przez `ref`, a nie przez
 * stan: to wartość zmieniająca się w każdej klatce i przeliczanie
 * przez nią Reacta byłoby czystą stratą.
 *
 * Warstwy są dwie i to jest celowe. Sam przelot, wygięcia i rozpad
 * obrazu żyją w scenie 3D, ale **opis wybranej pracy jest zwykłym
 * HTML-em na wierzchu**. Tekst w teksturze nie da się zaznaczyć,
 * przeczytać czytnikiem ekranu ani zindeksować, a przycisk narysowany
 * w shaderze nie jest przyciskiem. Scena robi wrażenie, DOM robi
 * robotę.
 */
export default function SpaceGL() {
  const t = useT()
  const prace = useProjects()
  const [wybrany, setWybrany] = useState(null)   // karta lecąca na środek
  const [panel, setPanel] = useState(null)       // opis, po dolocie
  const [open, setOpen] = useState(null)         // pełny podgląd strony

  const ref = useGuide({
    id: 'prace',
    text: t.guide.work,
    corner: 'tl',
    mood: 'mowi',
    point: '.spg-canvas',
  })

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const postep = useRef(0)
  useMotionValueEvent(scrollYProgress, 'change', (v) => { postep.current = v })

  /**
   * Panel z opisem wchodzi **po dolocie karty**, nie razem z klikiem.
   * Gdyby pojawiał się od razu, przykryłby lot, o który tu chodzi.
   */
  useEffect(() => {
    if (!wybrany) { setPanel(null); return undefined }
    const id = setTimeout(() => setPanel(wybrany), 620)
    return () => clearTimeout(id)
  }, [wybrany])

  /** Przy wybranej karcie strona stoi — inaczej tunel uciekałby pod panelem. */
  useEffect(() => {
    if (!wybrany) return undefined
    window.__lenis?.stop()
    return () => window.__lenis?.start()
  }, [wybrany])

  const idx = panel ? prace.findIndex((p) => p.id === panel) : -1
  const item = idx >= 0 ? prace[idx] : null

  const zamknij = () => { if (isOn()) shut(); setWybrany(null); setPanel(null) }
  const wybierz = (id) => { if (isOn()) pop(); setWybrany(id) }
  const idz = (krok) => {
    const n = (idx + krok + prace.length) % prace.length
    setWybrany(prace[n].id)
    setPanel(prace[n].id)
  }

  return (
    <section className="space spg" id="prace" ref={ref}>
      <div className="space-stage">
        <div className="spg-canvas">
          <Canvas
            dpr={[1, 1.75]}
            gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
            camera={{ position: [0, 0, 0], fov: 62, near: 0.1, far: 60 }}
            /* kliknięcie w pustkę zamyka — tak samo jak w tło panelu */
            onPointerMissed={() => wybrany && zamknij()}
          >
            <Tunnel prace={prace} postep={postep} wybrany={wybrany} onPick={wybierz} />
          </Canvas>
        </div>

        <div className="space-ui">
          <p className="label">{t.space.label}</p>
          <h2 className="space-title">
            {t.space.title}
            <Morph words={t.space.morph} className="space-morph" />
          </h2>
        </div>

        <div className="space-meter">
          <span className="space-hint">{t.space.hint}</span>
        </div>
      </div>

      <AnimatePresence>
        {item && (
          <Focus
            key="focus"
            item={item}
            from={null}
            index={idx}
            total={prace.length}
            onPrev={() => idz(-1)}
            onNext={() => idz(1)}
            onClose={zamknij}
            onOpenSite={() => { setOpen(item.id); zamknij() }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <Tour
            key={open}
            item={prace.find((p) => p.id === open)}
            kind={textOf(t, prace.find((p) => p.id === open)).kind}
            from={null}
            onClose={() => setOpen(null)}
          />
        )}
      </AnimatePresence>
    </section>
  )
}
