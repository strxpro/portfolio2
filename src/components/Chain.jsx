import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { useT } from '../lib/lang-ctx'

const S = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round' }

/**
 * Ikony etapów — jako dane, nie jako gotowy rysunek.
 *
 * Każdy krok to lista kresek `[ścieżka, docelowe krycie]`. Trzymamy je
 * rozłożone na czynniki, bo kreski mają się **rysować**, a `pathLength`
 * da się animować tylko na `motion.path` — z gotowego fragmentu JSX nie
 * dałoby się tego wyciągnąć.
 *
 * Kółko w rakiecie jest zapisane jako ścieżka z dwóch łuków, żeby cała
 * ikona rysowała się tym samym mechanizmem.
 */
const ICONS = [
  // rozmowa
  [['M3 6h18v11H9l-5 4v-4H3z', 1], ['M8 11h8M8 14h5', 0.55]],
  // szkic
  [['M4 20h16', 1], ['M6 16l9-9 3 3-9 9H6z', 1], ['M13 6l3 3', 0.55]],
  // budowa
  [['M9 5L3 12l6 7M15 5l6 7-6 7', 1], ['M13 6l-2 12', 0.5]],
  // start
  [
    ['M12 3c3 2.5 4.5 6 4.5 9L12 16l-4.5-4c0-3 1.5-6.5 4.5-9z', 1],
    ['M9 17l-2 4 5-2 5 2-2-4', 0.6],
    ['M13.7 10a1.7 1.7 0 1 1-3.4 0 1.7 1.7 0 1 1 3.4 0', 1],
  ],
  // opieka
  [['M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z', 1], ['M9 12l2.2 2.2L15.5 10', 0.7]],
]
import { EASE, SPRING } from '../lib/motion'
import { useNarrow } from '../lib/useNarrow'


/**
 * Pięć etapów, jedna osoba — bez akapitu o tym samym.
 *
 * Etapy wjeżdżają kolejno, a potem po szynie w kółko przebiega impuls:
 * kropka zapala się na moment przy każdym etapie, tak jak w prawdziwym
 * projekcie przechodzi się od rozmowy do opieki. To zdanie „robię
 * wszystko sam" narysowane zamiast napisane.
 *
 * Pętla chodzi wyłącznie wtedy, gdy sekcja jest na ekranie.
 */
export default function Chain() {
  const waski = useNarrow(900)
  const ref = useRef(null)
  const t = useT()
  const steps = t.me.chain
  const live = useInView(ref, { amount: 0.5 })

  const LOOP = steps.length * 1.1 + 1.4

  /**
   * Który etap jest teraz „pod iskrą".
   *
   * Wcześniej wszystkie ikony wisiały na ekranie od razu, przygaszone,
   * i tylko pulsowały po kolei — czyli rysunek był gotowy, zanim
   * cokolwiek do niego dojechało. Teraz ikona **rysuje się dopiero
   * wtedy**, gdy impuls jest przy jej kropce, a potem chowa się z
   * powrotem.
   *
   * Iskra przebiega całą szynę w czasie `LOOP`, więc etap `i` wypada
   * w jej środkowej części: `((i + 0.5) / liczba) * LOOP`. Zegar chodzi
   * co 100 ms — wystarczy, żeby trafić w moment, a stan zmienia się
   * i tak tylko pięć razy na obieg.
   */
  const [act, setAct] = useState(-1)
  useEffect(() => {
    if (!live) { setAct(-1); return }
    const start = performance.now()
    const okno = LOOP / steps.length
    const id = setInterval(() => {
      const tau = ((performance.now() - start) / 1000) % LOOP
      const i = Math.floor(tau / okno)
      setAct((was) => (was === i ? was : i))
    }, 100)
    return () => clearInterval(id)
  }, [live, LOOP, steps.length])

  return (
    <div className="chain" ref={ref}>
      <div className="chain-row">
        {steps.map((s, i) => (
          <motion.div
            className="chain-node"
            key={s}
            // na telefonie bez obracania — patrz Deep.jsx
            initial={waski ? { opacity: 0, y: 10 } : { opacity: 0, z: -240, rotateX: 10 }}
            whileInView={waski ? { opacity: 1, y: 0 } : { opacity: 1, z: 0, rotateX: 0 }}
            viewport={{ once: true, amount: waski ? 0.3 : 0.6 }}
            transition={waski ? { duration: 0.4, delay: i * 0.05, ease: EASE } : { ...SPRING.enter, delay: i * 0.09 }}
            style={waski ? undefined : { transformPerspective: 800 }}
          >
            <span className="chain-dot">
              <motion.i
                animate={act === i ? { scale: [1, 2.6, 1], opacity: [0, 0.55, 0] } : { scale: 1, opacity: 0 }}
                transition={{ duration: 0.9, ease: 'easeOut' }}
              />
            </span>

            <motion.span
              className="chain-name"
              animate={{ color: act === i ? 'var(--ink)' : 'var(--ink-2)' }}
              transition={{ duration: 0.3, ease: EASE }}
            >
              {s}
            </motion.span>

            {/* rysunek etapu — kreska po kresce, dopiero gdy impuls tu dojedzie */}
            <motion.span
              className="chain-icon"
              animate={{ scale: act === i ? 1.08 : 1 }}
              transition={SPRING.press}
            >
              <svg viewBox="0 0 24 24">
                {ICONS[i % ICONS.length].map(([d, o], n) => (
                  <motion.path
                    key={n}
                    d={d}
                    {...S}
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={act === i ? { pathLength: 1, opacity: o } : { pathLength: 0, opacity: 0 }}
                    transition={{
                      pathLength: { duration: act === i ? 0.5 : 0.32, delay: act === i ? n * 0.12 : 0, ease: EASE },
                      opacity: { duration: 0.2, delay: act === i ? n * 0.12 : 0 },
                    }}
                  />
                ))}
              </svg>
            </motion.span>

            <span className="chain-drop" />
          </motion.div>
        ))}

        {/* impuls przebiegający po szynie od etapu do etapu */}
        <motion.span
          className="chain-spark"
          animate={live ? { left: ['2%', '98%'], opacity: [0, 1, 1, 0] } : { opacity: 0 }}
          transition={
            live
              ? { duration: LOOP, repeat: Infinity, ease: 'linear', opacity: { duration: LOOP, repeat: Infinity, times: [0, 0.06, 0.9, 1] } }
              : { duration: 0.2 }
          }
        />
      </div>

      <span className="chain-rail" />

      <motion.p
        className="chain-sum"
        initial={waski ? { opacity: 0 } : { opacity: 0, z: -150 }}
        whileInView={waski ? { opacity: 1 } : { opacity: 1, z: 0 }}
        viewport={{ once: true, amount: waski ? 0.3 : 0.8 }}
        transition={waski ? { duration: 0.4, ease: EASE } : { ...SPRING.enter, delay: 0.2 }}
        style={waski ? undefined : { transformPerspective: 800 }}
      >
        <b>{t.me.one}</b>
        {t.me.oneNote}
      </motion.p>
    </div>
  )
}
