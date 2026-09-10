import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useLoopSpring } from '../lib/useLoopSpring'

/**
 * Sekcja jako plan w jednej przestrzeni, a nie osobna scena.
 *
 * Wcześniej każda sekcja miała własne wejście — coś wjeżdżało z dołu,
 * coś się przygaszało. Teraz obowiązuje jedna zasada dla całej strony:
 * **scroll przesuwa kamerę wzdłuż osi Z**, a sekcje stoją nieruchomo
 * w głębi i po prostu przez nie przelatujesz.
 *
 * Z tego wynika reszta: daleko plan jest mniejszy i przygaszony, na
 * wprost pełny, a mijając kamerę rośnie i gaśnie.
 */
export default function Leaf({ tone = 'paper', z = 1, children }) {
  const ref = useRef(null)

  // pełny przelot planu przez kamerę: 0 = daleko, 1 = za plecami
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const p = useLoopSpring(scrollYProgress)

  /**
   * W głąb leci TREŚĆ, nie płachta.
   *
   * Przesuwanie całej sekcji po osi Z się nie broni: płachta jest na
   * całą szerokość, więc odsunięta przestaje zakrywać ekran i między
   * planami robi się dziura. Kompensacja skalą też nie pomaga —
   * przeglądarka wpisuje `scale` już po dzieleniu perspektywicznym
   * i skala wraca do punktu wyjścia (zmierzone: plan dalej miał 77%
   * szerokości).
   *
   * Dlatego tło zostaje płaskie i pełnoekranowe, a w przestrzeni
   * porusza się to, co w środku.
   */
  const zPos = useTransform(p, [0, 0.42, 0.62, 1], [-540, 0, 0, 300])
  const depth = useTransform(zPos, (v) => `${v}px`)
  const drift = useTransform(p, [0, 0.42, 0.62, 1], [26, 0, 0, -20])
  const seam = useTransform(p, [0.06, 0.3], [0, 1])
  const dim = useTransform(p, [0.68, 1], [0, 0.3])

  /**
   * Głębia ostrości była tu wcześniej i została wycięta.
   *
   * `blur()` na warstwie wielkości ekranu kosztował **16 ms na klatkę**
   * (zmierzone: 43 ms z rozmyciem, 27 ms bez). Promień nie miał z tym
   * nic wspólnego — połowa promienia dała ten sam wynik — bo płaci się
   * nie za rozmycie, tylko za to, że warstwa jedzie w perspektywie
   * i musi się rasteryzować od nowa w każdej klatce. Przeniesienie
   * filtra na dziecko też nie pomogło (43 ms).
   *
   * Dystans niosą więc rzeczy, które kompozytor robi za darmo:
   * przezroczystość i welon.
   *
   * Próg czytelności jest wcześnie i celowo. Przy ostrzejszym zbieganiu
   * sekcja zakrywała już 45% ekranu, mając 19% krycia — czyli pod spodem
   * była biała pustka zamiast czegoś dalekiego. Rozmycie wcześniej to
   * wypełniało; teraz musi to zrobić sam rozkład krycia.
   */
  const fade = useTransform(p, [0, 0.06, 0.22, 0.78, 0.92, 1], [0, 0.28, 1, 1, 0.45, 0.1])

  return (
    <motion.div ref={ref} className={`leaf ${tone}`} style={{ zIndex: z, y: drift }}>
      <motion.span className="leaf-seam" style={{ scaleX: seam }} />
      <motion.div
        className="leaf-inner"
        style={{ translateZ: depth, opacity: fade, transformPerspective: 1400 }}
      >
        {children}
      </motion.div>
      <motion.span className="leaf-dim" style={{ opacity: dim }} aria-hidden="true" />
    </motion.div>
  )
}
