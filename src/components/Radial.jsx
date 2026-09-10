import { useRef, useState } from 'react'
import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion'
import Cover from './Cover'
import Focus from './Focus'
import Tour from './Tour'
import Morph from './Morph'
import { textOf, useProjects } from '../lib/projects'
import { useT } from '../lib/lang-ctx'
import { useGuide } from '../lib/mascot'
import { useLoopSpring } from '../lib/useLoopSpring'
import { isOn, pop, shut } from '../lib/sound'

/**
 * Prace na telefonie: koło zamiast tunelu.
 *
 * Tunel 3D jest zrobiony pod szeroki kadr — na pionowym ekranie karty
 * albo są mikroskopijne, albo wychodzą bokami. Tutaj leżą na obwodzie
 * **wielkiego koła, którego widać tylko górę**; przewijanie obraca to
 * koło, więc kolejne prace wjeżdżają od boku i schodzą w dół.
 *
 * Zysk jest praktyczny, nie tylko estetyczny: karta zawsze jest u góry,
 * duża i na wprost, a nie ustawiona bokiem gdzieś w głębi.
 */

/** Ile procent koła wystaje ponad dolną krawędź sceny. */
const WIDAC = 0.46
/** Promień koła w procentach szerokości ekranu — koło ma być większe niż kadr. */
const PROMIEN_VW = 0.78

export default function Radial() {
  const t = useT()
  const prace = useProjects()
  const [panel, setPanel] = useState(null)
  const [open, setOpen] = useState(null)
  const [dotyk, setDotyk] = useState(null)

  const ref = useGuide({
    id: 'prace',
    text: t.guide.work,
    corner: 'tl',
    mood: 'mowi',
    point: '.rad-kolo',
  })

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const p = useLoopSpring(scrollYProgress)

  /* Pełny obrót na całej długości sekcji. Koło kręci się w lewo, więc
     prace nadchodzą z prawej — tak, jak czyta się stronę. */
  const obrot = useTransform(p, [0, 1], [0, -360])

  const idx = panel ? prace.findIndex((x) => x.id === panel) : -1
  const item = idx >= 0 ? prace[idx] : null

  const zamknij = () => { if (isOn()) shut(); setPanel(null) }
  const idz = (krok) => setPanel(prace[(idx + krok + prace.length) % prace.length].id)

  return (
    <section className="space rad" id="prace" ref={ref}>
      <div className="space-stage rad-stage">
        <div className="space-ui">
          <p className="label">{t.space.label}</p>
          <h2 className="space-title">
            {t.space.title}
            <Morph words={t.space.morph} className="space-morph" />
          </h2>
        </div>

        {/* Maska u dołu chowa miejsce, w którym karty wjeżdżają pod kadr. */}
        <div className="rad-okno">
          <motion.ul
            className="rad-kolo"
            style={{
              rotate: obrot,
              width: `${PROMIEN_VW * 200}vw`,
              height: `${PROMIEN_VW * 200}vw`,
              bottom: `-${PROMIEN_VW * 200 * (1 - WIDAC)}vw`,
            }}
          >
            {prace.map((praca, i) => {
              const kat = (i / prace.length) * Math.PI * 2
              const x = Math.cos(kat) * PROMIEN_VW * 100
              const y = Math.sin(kat) * PROMIEN_VW * 100
              const stopnie = (kat * 180) / Math.PI + 90
              const zywa = dotyk === i

              return (
                <li
                  key={praca.id}
                  style={{
                    transform: `translate(-50%, -50%) translate3d(${x}vw, ${y}vw, 0) rotate(${stopnie}deg)`,
                    zIndex: zywa ? 20 : 10,
                  }}
                >
                  <button
                    type="button"
                    className={`rad-karta ${zywa ? 'on' : ''}`}
                    onPointerDown={() => setDotyk(i)}
                    onPointerUp={() => setDotyk(null)}
                    onPointerLeave={() => setDotyk(null)}
                    onClick={() => { if (isOn()) pop(); setPanel(praca.id) }}
                    aria-label={praca.name}
                  >
                    <Cover id={praca.id} tint={praca.tint} name={praca.name} host={praca.host} still />
                    <span className="rad-pasek">
                      <b>{praca.name}</b>
                      <i>{praca.year}</i>
                    </span>
                  </button>
                </li>
              )
            })}
          </motion.ul>
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
            item={prace.find((x) => x.id === open)}
            kind={textOf(t, prace.find((x) => x.id === open)).kind}
            from={null}
            onClose={() => setOpen(null)}
          />
        )}
      </AnimatePresence>
    </section>
  )
}
