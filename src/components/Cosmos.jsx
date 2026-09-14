import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'
import { usePointer } from '../lib/usePointer'
import { SPRING } from '../lib/motion'
import { dlugoscPetli, zapomnijDlugosc } from '../lib/loopLength'
import DeepSky from './DeepSky'

/**
 * Przestrzeń, w której leży cała strona.
 *
 * Pod panelami leży pole gwiazd na trzech planach: dalekim, środkowym
 * i bliskim. Przewijanie przesuwa je z różną prędkością, kursor (a na
 * telefonie przechył) w bok — dopiero to daje wrażenie, że panele
 * unoszą się w czymś, a nie leżą na kolorze.
 *
 * ── Dlaczego gwiazdy są funkcją pozycji, a nie licznikiem ──────────
 *
 * Strona jest nieskończoną pętlą: za finałem stoi echo pierwszego
 * ekranu i w chwili, gdy kadr jest identyczny, pozycja cofa się o
 * długość pętli L. Dwie wcześniejsze wersje liczyły ruch gwiazd
 * własnym licznikiem ze sprężyną i obie przegrywały z tym przeskokiem
 * — raz przez kolejność zdarzeń, raz przez to, że Lenis trzyma własną
 * animację i wracał do starych współrzędnych. Sprężyna dostawała skok
 * i go nadrabiała: gwiazdy teleportowały się i przelatywały.
 *
 * Teraz przesunięcie planu to **reszta z dzielenia** `scrollY × tempo`
 * przez wysokość pola V, a V jest dobrane tak, żeby L × tempo było
 * dokładnie V. Cofnięcie o L zmienia wynik o zero — gwiazdy na górze
 * strony są z definicji tym samym obrazem co w echu. Nie ma licznika,
 * zdarzenia ani sprężyny, więc nie ma czego zepsuć. Wygładzenie i tak
 * daje Lenis.
 *
 * ── Dlaczego bez kafli ──────────────────────────────────────────────
 *
 * Wcześniej każdy plan był płótnem z kaflem 480 px powtórzonym w pionie,
 * na wszystkich trzech planach z tym samym okresem. Na ekranie 900 px
 * ten sam układ wracał prawie dwa razy, i to na wszystkich planach naraz
 * — oko łapało to jako równą siatkę. Każdy plan ma teraz własną,
 * niepowiązaną wysokość pola, a gwiazdy rysują się co klatkę na jednym
 * płótnie wielkości ekranu (kilkaset kropek; trzy wysokie płótna do
 * składania w każdej klatce kosztowały więcej).
 */

/** [gwiazd na ekran 1440×900, maks. promień, krycie, tempo względem strony] */
const PLANY = [
  [150, 0.8, 0.55, 0.08],
  [95, 1.3, 0.78, 0.17],
  [42, 2.1, 1, 0.3],
]

/** Najmniejsze pole planu w ekranach — mniejsze powtarzałoby się w kadrze. */
const MIN_POLE = 1.35

/**
 * Barwy gwiazd z wagami. Większość lekko ciepła, część wyraźnie
 * niebieska, pojedyncze pomarańczowe — tak, żeby pole grało z papierem.
 */
const BARWY = [
  ['255,251,242', 46],
  ['255,255,255', 22],
  ['205,218,255', 18],
  ['255,234,200', 10],
  ['255,196,160', 4],
]
const SUMA_WAG = BARWY.reduce((a, [, w]) => a + w, 0)
const barwa = () => {
  let los = Math.random() * SUMA_WAG
  for (let i = 0; i < BARWY.length; i++) { if ((los -= BARWY[i][1]) < 0) return i }
  return 0
}

/** Miękka poświata jako gotowy obrazek — rysowana `drawImage`, nie gradientem co klatkę. */
function poswiaty() {
  return BARWY.map(([rgb]) => {
    const c = document.createElement('canvas')
    c.width = c.height = 32
    const g = c.getContext('2d')
    const gr = g.createRadialGradient(16, 16, 0, 16, 16, 16)
    gr.addColorStop(0, `rgba(${rgb},0.55)`)
    gr.addColorStop(0.35, `rgba(${rgb},0.16)`)
    gr.addColorStop(1, `rgba(${rgb},0)`)
    g.fillStyle = gr
    g.fillRect(0, 0, 32, 32)
    return c
  })
}

/**
 * Gwiazdy losujemy we współrzędnych 0–1 i z zapasem (×4), więc zmiana
 * wysokości pola czy szerokości ekranu ich nie przetasowuje — plan
 * bierze tylko tyle pierwszych, ile potrzebuje.
 */
function losujPlan([ile, r, alfa]) {
  return Array.from({ length: Math.round(ile * 4) }, () => {
    // rozkład potęgowy: mnóstwo ledwie widocznych, garstka jasnych
    const jasnosc = Math.random() ** 3
    const b = barwa()
    const a = (0.2 + jasnosc * 0.8) * alfa
    return {
      u: Math.random(),
      v: Math.random(),
      r: 0.3 + jasnosc * r * 1.5,
      b,
      styl: `rgba(${BARWY[b][0]},${a})`,
      blask: jasnosc > 0.72,
    }
  })
}

const mod = (a, n) => ((a % n) + n) % n

function PoleGwiazd({ px, py }) {
  const ref = useRef(null)

  useEffect(() => {
    const c = ref.current
    if (!c) return undefined
    const g = c.getContext('2d')
    const blaski = poswiaty()
    const plany = PLANY.map(losujPlan)
    const spokoj = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let w = 0
    let h = 0
    /**
     * Wymiar z **pudełka płótna**, nie z `innerWidth`.
     *
     * W Windowsie `innerWidth` obejmuje pasek przewijania (15 px), więc
     * płótno było o 1% szersze niż miejsce na ekranie i przeglądarka je
     * zmniejszała. Takie przeskalowanie drobnych kropek daje mory —
     * regularne prążki, które wyglądały jak siatka. Piksel płótna ma być
     * dokładnie pikselem ekranu.
     */
    const wymiary = () => {
      w = Math.max(1, Math.round(c.clientWidth))
      h = Math.max(1, Math.round(c.clientHeight))
      // gęstość 1: kropki mają 1–2 px, gęstsza siatka nic nie wnosi, a kosztuje
      if (c.width !== w) c.width = w
      if (c.height !== h) c.height = h
    }
    wymiary()
    const pudelko = new ResizeObserver(wymiary)
    pudelko.observe(c)
    const watch = new ResizeObserver(zapomnijDlugosc)
    watch.observe(document.body)

    let id
    let licznik = 0
    const klatka = (czas) => {
      id = requestAnimationFrame(klatka)
      // zapasowe sprawdzenie wymiaru co pół sekundy, gdyby obserwator się spóźnił
      if (++licznik % 30 === 0) wymiary()
      const L = dlugoscPetli()
      const s = window.scrollY
      const ox = px.get()
      const oy = py.get()
      const skalaX = Math.max(0.45, Math.min(1.3, w / 1440))
      g.clearRect(0, 0, w, h)

      for (let i = 0; i < PLANY.length; i++) {
        const [ile, , , tempo] = PLANY[i]
        /**
         * Wysokość pola: dokładnie L × tempo, żeby pętla była niewidoczna.
         * Gdyby wyszło za nisko (krótka strona, bardzo wysoki ekran),
         * podnosimy tempo planu zamiast skracać pole — warunek
         * L × tempo = V musi zostać spełniony.
         */
        const V = L ? Math.max(L * tempo, h * MIN_POLE) : h * 3
        const t = L ? V / L : tempo
        const dryf = spokoj ? 0 : Math.sin((czas / (26000 + i * 9000)) * Math.PI * 2) * (5 + i * 5)
        const dryfX = spokoj ? 0 : Math.cos((czas / (36000 + i * 12000)) * Math.PI * 2) * (6 + i * 6)
        const przes = mod(s * t - oy * (6 + i * 14) - dryf, V)
        const bokX = ox * (10 + i * 22) + dryfX
        const n = Math.min(plany[i].length, Math.round(ile * skalaX * (V / 900)))

        for (let k = 0; k < n; k++) {
          const st = plany[i][k]
          const y = mod(st.v * V - przes, V)
          if (y > h + 12) continue
          const x = mod(st.u * w + bokX, w)
          if (st.blask) {
            const d = st.r * 11
            g.drawImage(blaski[st.b], x - d / 2, y - d / 2, d, d)
          }
          g.fillStyle = st.styl
          if (st.r < 0.9) g.fillRect(x - st.r, y - st.r, st.r * 2, st.r * 2)
          else { g.beginPath(); g.arc(x, y, st.r, 0, 6.2832); g.fill() }
        }
      }
    }
    id = requestAnimationFrame(klatka)

    return () => {
      cancelAnimationFrame(id)
      pudelko.disconnect()
      watch.disconnect()
    }
  }, [px, py])

  return <canvas ref={ref} className="cos-pola" aria-hidden="true" />
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
  const { x, y } = usePointer(90, 30)
  const px = useSpring(x, SPRING.enter)
  const py = useSpring(y, SPRING.enter)

  return (
    <div className="cosmos" aria-hidden="true">
      <span className="cos-glow a" />
      <span className="cos-glow b" />
      <DeepSky px={px} py={py} scrollY={scrollY} />
      <PoleGwiazd px={px} py={py} />
      <Spadajace />
      <span className="cos-vign" />
    </div>
  )
}
