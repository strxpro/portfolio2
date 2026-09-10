import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useScroll, useSpring, useTime, useTransform } from 'framer-motion'
import { usePointer } from '../lib/usePointer'
import { SPRING } from '../lib/motion'

/**
 * Przestrzeń, w której leży cała strona.
 *
 * Sekcje są nieprzezroczystymi płachtami, więc dopóki tło było kolorem,
 * nie dało się zobaczyć, że cokolwiek dzieje się w głębi. Tutaj pod
 * wszystkim leży pole gwiazd na trzech planach: dalekim, środkowym
 * i bliskim. Scroll przesuwa je z różną prędkością, kursor (a na
 * telefonie przechył) przesuwa je w bok — i dopiero to daje wrażenie,
 * że panele unoszą się w czymś, a nie leżą na kolorze.
 *
 * **Gwiazdy rysują się raz.** Każdy plan to jedno płótno wypalone przy
 * montażu; potem rusza się już tylko `transform`, czyli praca karty
 * graficznej. Rysowanie ich co klatkę byłoby przemalowaniem całego
 * ekranu w kółko — dokładnie ten koszt, przez który wyleciała stąd
 * głębia ostrości.
 */

/** [ile gwiazd, maks. promień, krycie, ile razy szybciej niż strona] */
const PLANY = [
  [190, 0.9, 0.55, 0.06],
  [110, 1.4, 0.75, 0.14],
  [46, 2.2, 1, 0.26],
]

/**
 * Wysokość kafla. Płótno powtarza go tyle razy, ile trzeba, żeby zakryć
 * kadr — a przesunięcie liczone modulo `KAFEL` wraca zawsze na obraz
 * identyczny co do piksela.
 */
const KAFEL = 480

function Plan({ spec, i, scroll, px, py }) {
  const [ile, r, alfa, tempo] = spec
  const ref = useRef(null)

  useEffect(() => {
    const c = ref.current
    if (!c) return
    /**
     * Gęstość 1, nie gęstość ekranu.
     *
     * To trzy płótna na całą szerokość i ~2.5 ekranu wysokości, składane
     * w każdej klatce. Przy 1.5 kosztowały **6.3 ms na klatkę** nawet
     * przy nieruchomej stronie (zmierzone: 24 ms z gwiazdami, 17.7 ms
     * bez). Kropki mają 1–2 px, więc gęstsza siatka i tak nic nie wnosi,
     * a tekstura rośnie z kwadratem.
     */
    const dpr = 1

    /**
     * Pole gwiazd jest **kaflowane**, nie po prostu wysokie.
     *
     * Pierwsza wersja miała płótno wysokości 1.6 ekranu i to się nie
     * broniło: najszybsza warstwa przesuwa się o 1030 px na 4000 px
     * przewijania, więc po chwili wyjeżdżała poza swój obraz i dolna
     * część kadru zostawała bez gwiazd (zmierzone: pusto poniżej 154 px).
     *
     * Dlatego gwiazdy losujemy w pasie wysokości `KAFEL` i kopiujemy ten
     * pas raz pod spód. Przesunięcie liczone modulo `KAFEL` wraca wtedy
     * na obraz identyczny co do piksela — pole jest nieskończone, a
     * przeskok niewidoczny, bo nie ma czego przeskoczyć.
     */
    const bake = () => {
      const w = window.innerWidth
      /**
       * Ile kafli musi mieć płótno.
       *
       * Leży ono jeden kafel nad kadrem i zsuwa się w dół o maksymalnie
       * jeden kafel, więc musi zakryć ekran plus dwa kafle zapasu.
       * Przy dwóch kaflach na stałe (960 px) poniżej połowy ekranu
       * gwiazd już nie było.
       */
      const kafli = Math.ceil((window.innerHeight + KAFEL * 2) / KAFEL)
      const h = KAFEL * kafli
      c.width = Math.round(w * dpr)
      c.height = Math.round(h * dpr)
      c.style.width = `${w}px`
      c.style.height = `${h}px`
      const g = c.getContext('2d')
      g.scale(dpr, dpr)
      g.clearRect(0, 0, w, h)
      for (let n = 0; n < ile; n++) {
        const x = Math.random() * w
        const y = Math.random() * KAFEL
        const rr = 0.35 + Math.random() * r
        // ciepły biały, żeby kosmos nie kłócił się z papierem paneli
        g.fillStyle = `rgba(255, 251, 242, ${(0.25 + Math.random() * 0.75) * alfa})`
        for (let k = 0; k < kafli; k++) {
          g.beginPath()
          g.arc(x, y + k * KAFEL, rr, 0, Math.PI * 2)
          g.fill()
        }
      }
    }
    bake()
    let t
    const later = () => { clearTimeout(t); t = setTimeout(bake, 220) }
    window.addEventListener('resize', later)
    return () => { clearTimeout(t); window.removeEventListener('resize', later) }
  }, [ile, r, alfa])

  /**
   * Trzy rzeczy naraz w jednej wartości.
   *
   * `y` i `translateY` to w Framerze **ta sama** składowa transformacji,
   * więc podanie obu kasowało jedną z nich — reakcja gwiazd na kursor
   * była martwa, choć wyglądała na podpiętą. Dlatego wszystko sumujemy
   * ręcznie i oddajemy jako jedno `x` i jedno `y`.
   *
   * Składniki: zawijanie przy przewijaniu (modulo kafla), odchylenie od
   * kursora albo przechyłu telefonu, i **własny, powolny dryf** — pole
   * gwiazd ma leciutko żyć także wtedy, gdy nikt niczego nie dotyka.
   */
  const czas = useTime()
  const okres = 26000 + i * 9000
  const amp = 5 + i * 5

  const y = useTransform([scroll, py, czas], ([sv, pv, tv]) => {
    const zawin = -(((sv * tempo) % KAFEL) + KAFEL) % KAFEL
    return zawin + pv * (6 + i * 14) + Math.sin((tv / okres) * Math.PI * 2) * amp
  })
  const x = useTransform([px, czas], ([pv, tv]) =>
    pv * (10 + i * 22) + Math.cos((tv / (okres * 1.4)) * Math.PI * 2) * amp * 1.3,
  )

  return (
    <motion.canvas
      ref={ref}
      className="cos-plan"
      style={{ x, y, opacity: 0.9 }}
      aria-hidden="true"
    />
  )
}

/**
 * Spadające gwiazdy.
 *
 * Każda ma **własną głębokość** — jedną liczbę 0–1, z której wynika
 * wszystko inne: bliska jest duża, jasna, gruba i przelatuje szybko,
 * daleka to cienka, przygaszona kreska sunąca powoli. Bez tego wszystkie
 * wyglądały identycznie i po drugim przelocie robiły się tapetą.
 *
 * Losowy jest też kierunek (czasem z prawej w lewo), miejsce startu,
 * kąt i długość smugi, a przerwa między przelotami waha się na tyle
 * mocno, że nie da się złapać rytmu.
 */
function losujLot() {
  const glebia = Math.random()          // 0 = daleko, 1 = tuż przed nosem
  const wLewo = Math.random() < 0.32
  return {
    klucz: Date.now() + Math.random(),
    glebia,
    wLewo,
    x: wLewo ? 45 + Math.random() * 50 : 5 + Math.random() * 50,
    y: 3 + Math.random() * 42,
    obrot: (wLewo ? 180 - 1 : 1) * (18 + Math.random() * 26),
    dystans: 180 + glebia * 420 + Math.random() * 160,
    dlugosc: 60 + glebia * 150,
    grubosc: 0.9 + glebia * 1.8,
    krycie: 0.35 + glebia * 0.65,
    czas: 2.1 - glebia * 1.1,
  }
}

function Smuga({ lot }) {
  const kier = lot.wLewo ? -1 : 1
  return (
    <motion.span
      className="cos-shot"
      style={{
        left: `${lot.x}%`,
        top: `${lot.y}%`,
        width: lot.dlugosc,
        height: lot.grubosc,
        rotate: lot.obrot,
      }}
      initial={{ opacity: 0, scaleX: 0.2, x: 0, y: 0 }}
      animate={{
        opacity: [0, lot.krycie, lot.krycie, 0],
        scaleX: [0.2, 1, 1, 0.5],
        x: lot.dystans * kier,
        y: lot.dystans * 0.42,
      }}
      transition={{ duration: lot.czas, ease: [0.2, 0.7, 0.4, 1], times: [0, 0.14, 0.66, 1] }}
    />
  )
}

function Spadajace() {
  const [loty, setLoty] = useState([])

  useEffect(() => {
    let id
    const strzel = () => {
      // co jakiś czas dwie naraz, na różnych głębokościach
      const ile = Math.random() < 0.22 ? 2 : 1
      const nowe = Array.from({ length: ile }, losujLot)
      setLoty(nowe)
      id = setTimeout(strzel, 5200 + Math.random() * 11000)
    }
    id = setTimeout(strzel, 1800 + Math.random() * 3500)
    return () => clearTimeout(id)
  }, [])

  return loty.map((lot) => <Smuga key={lot.klucz} lot={lot} />)
}

export default function Cosmos() {
  const { scrollY } = useScroll()

  /**
   * Gwiazdy jadą po **własnym, ciągłym liczniku**, a nie po pozycji strony.
   *
   * Strona ma nieskończoną pętlę: po przekroczeniu szwu pozycja cofa się
   * o kilkanaście tysięcy pikseli naraz. Dla widza nic się nie zmienia,
   * bo kadr jest w tym momencie identyczny — ale pole gwiazd liczone
   * wprost z `scrollY` dostawało wtedy skok przez całą stronę i sprężyna
   * przejeżdżała go na oczach, jakby wszystko wjeżdżało od dołu.
   *
   * Dlatego sumujemy same przyrosty, a o tym jednym sztucznym **pętla
   * nas uprzedza**: w zdarzeniu `strx:loop` podaje, o ile cofnęła widok,
   * więc przesuwamy o tyle punkt odniesienia i przyrost wychodzi zerowy.
   *
   * Odsiewanie po samej wielkości skoku byłoby prostsze, ale odcięłoby
   * też zwykłe skoki z menu — a te mają ruszyć tłem jak każde inne
   * przewinięcie.
   */
  const ciagly = useMotionValue(0)
  useEffect(() => {
    let ostatni = scrollY.get()

    const szew = (e) => { ostatni -= e.detail?.o ?? 0 }
    window.addEventListener('strx:loop', szew)

    const stop = scrollY.on('change', (v) => {
      ciagly.set(ciagly.get() + (v - ostatni))
      ostatni = v
    })
    return () => { window.removeEventListener('strx:loop', szew); stop() }
  }, [scrollY, ciagly])

  const scroll = useSpring(ciagly, SPRING.scroll)
  const { x, y } = usePointer(90, 30)
  const px = useSpring(x, SPRING.enter)
  const py = useSpring(y, SPRING.enter)

  return (
    <div className="cosmos" aria-hidden="true">
      <span className="cos-glow a" />
      <span className="cos-glow b" />
      {PLANY.map((spec, i) => (
        <Plan key={i} spec={spec} i={i} scroll={scroll} px={px} py={py} />
      ))}
      <Spadajace />
      <span className="cos-vign" />
    </div>
  )
}
