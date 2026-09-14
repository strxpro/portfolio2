import { useEffect, useRef, useState } from 'react'
import { motion, useTime, useTransform } from 'framer-motion'
import { dlugoscPetli } from '../lib/loopLength'

/**
 * Najdalszy plan kosmosu: Droga Mleczna, mgławice, migoczące gwiazdy
 * i wirująca galaktyka.
 *
 * Wszystko rysuje się **raz** na płótnie, a potem porusza wyłącznie
 * `transform` — obrót galaktyki to animacja CSS, którą w całości
 * wykonuje karta graficzna. Żadnego `filter: blur` na ruchomej warstwie:
 * zmierzone wcześniej, kosztował 16 ms na klatkę bez względu na promień.
 * Miękkość jest wypalona w samym obrazie.
 *
 * Gęstość skaluje się z powierzchnią ekranu, więc telefon dostaje
 * proporcjonalnie mniej punktów i mniejszą teksturę.
 */

const gauss = () => {
  let u = 0
  let v = 0
  while (!u) u = Math.random()
  while (!v) v = Math.random()
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v)
}

const plama = (g, x, y, r, rgb, a) => {
  const gr = g.createRadialGradient(x, y, 0, x, y, r)
  gr.addColorStop(0, `rgba(${rgb},${a})`)
  gr.addColorStop(1, `rgba(${rgb},0)`)
  g.fillStyle = gr
  g.fillRect(x - r, y - r, r * 2, r * 2)
}

/** Ile razy gęściej niż na ekranie 1440×900 — z granicami dla skrajności. */
const gestosc = () =>
  Math.max(0.4, Math.min(1.25, (window.innerWidth * window.innerHeight) / (1440 * 900)))

/* ─────────────────────────── galaktyka ─────────────────────────── */

function rysujGalaktyke(c, bok) {
  const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
  c.width = Math.round(bok * dpr)
  c.height = Math.round(bok * dpr)
  const g = c.getContext('2d')
  g.setTransform(dpr, 0, 0, dpr, 0, 0)
  g.clearRect(0, 0, bok, bok)

  const s = bok / 2
  const R = bok * 0.47
  const skala = bok / 760
  const RAMIONA = 2
  // spirala logarytmiczna o nachyleniu ~22°: przy ciaśniejszej ramiona
  // zlewały się w koncentryczne pierścienie zamiast w spiralę
  const zwoj = 1 / Math.tan((22 * Math.PI) / 180)
  const katRamienia = (r, ramie) => (ramie * 2 * Math.PI) / RAMIONA + zwoj * Math.log(r / (R * 0.05))

  /**
   * Poświata i mgliste ramiona w ćwiartce rozdzielczości, potem powiększone.
   * Bardzo przezroczyste gradienty nakładane na siebie przeglądarka
   * wyrównuje regularnym ditheringiem — w obrocie ten wzór kropek byłby
   * widoczny jeszcze bardziej niż na stojącym niebie.
   */
  const mgla = document.createElement('canvas')
  mgla.width = mgla.height = Math.ceil((bok * dpr) / 4)
  const m = mgla.getContext('2d')
  m.scale(mgla.width / bok, mgla.width / bok)
  m.globalCompositeOperation = 'lighter'

  // poświata dysku
  plama(m, s, s, R, '130,150,215', 0.13)

  // mgliste ramiona: dużo miękkich plam wzdłuż spirali
  for (let n = 0; n < 340; n++) {
    const ramie = n % RAMIONA
    const r = R * (0.1 + 0.9 * Math.random() ** 0.9)
    const t = r / R
    const k = katRamienia(r, ramie) + gauss() * 0.16
    const rgb = Math.random() < 0.18 ? '215,140,200' : '120,155,255'
    plama(m, s + Math.cos(k) * r, s + Math.sin(k) * r, (10 + Math.random() * 22) * skala * (0.6 + t), rgb, 0.05 * (1.1 - t))
  }
  g.imageSmoothingEnabled = true
  g.imageSmoothingQuality = 'high'
  g.drawImage(mgla, 0, 0, bok, bok)

  g.globalCompositeOperation = 'lighter'

  // gwiazdy dysku: większość w ramionach, reszta rozsiana
  const ile = Math.round(5200 * Math.max(0.55, gestosc()))
  for (let n = 0; n < ile; n++) {
    const r = R * (0.02 + 0.98 * Math.random() ** 1.45)
    const t = r / R
    const wRamieniu = Math.random() < 0.72
    const k = wRamieniu
      ? katRamienia(r, n % RAMIONA) + gauss() * (0.12 + 0.2 * t)
      : Math.random() * Math.PI * 2
    const rr = r + gauss() * R * 0.018
    const x = s + Math.cos(k) * rr
    const y = s + Math.sin(k) * rr
    // środek ciepły i stary, ramiona młode i niebieskie
    const m = Math.min(1, Math.max(0, (t - 0.08) / 0.5))
    let rgb = `${Math.round(255 - 85 * m)},${Math.round(228 - 30 * m)},${Math.round(185 + 70 * m)}`
    let a = (0.25 + Math.random() * 0.75) * (1 - 0.55 * t) * 0.6
    let rozmiar = (0.35 + Math.random() ** 4 * 1.5) * skala
    // obszary gwiazdotwórcze: różowe grudki w ramionach
    if (wRamieniu && t > 0.25 && Math.random() < 0.025) {
      rgb = '255,150,200'
      a = 0.7
      rozmiar *= 1.8
    }
    g.fillStyle = `rgba(${rgb},${a})`
    g.beginPath()
    g.arc(x, y, rozmiar, 0, Math.PI * 2)
    g.fill()
  }

  // pasma pyłu po wewnętrznej stronie ramion — wycinają światło
  g.globalCompositeOperation = 'destination-out'
  for (let n = 0; n < 200; n++) {
    const r = R * (0.14 + 0.55 * Math.random())
    const k = katRamienia(r, n % RAMIONA) - 0.34 + gauss() * 0.05
    plama(g, s + Math.cos(k) * r, s + Math.sin(k) * r, (5 + Math.random() * 9) * skala, '0,0,0', 0.22)
  }

  // jądro
  g.globalCompositeOperation = 'lighter'
  const j = g.createRadialGradient(s, s, 0, s, s, R * 0.26)
  j.addColorStop(0, 'rgba(255,244,225,0.95)')
  j.addColorStop(0.18, 'rgba(255,218,170,0.5)')
  j.addColorStop(0.55, 'rgba(230,170,130,0.12)')
  j.addColorStop(1, 'rgba(230,170,130,0)')
  g.fillStyle = j
  g.fillRect(0, 0, bok, bok)

  /**
   * Okrągłe wygaszenie brzegu. Plamy przy krawędzi były ucinane przez
   * kwadrat płótna — na stojąco niewidoczne, ale w obrocie kwadrat
   * zaczynał się zdradzać.
   */
  g.globalCompositeOperation = 'destination-in'
  const brzeg = g.createRadialGradient(s, s, R * 0.7, s, s, s)
  brzeg.addColorStop(0, 'rgba(0,0,0,1)')
  brzeg.addColorStop(1, 'rgba(0,0,0,0)')
  g.fillStyle = brzeg
  g.fillRect(0, 0, bok, bok)
  g.globalCompositeOperation = 'source-over'
}

/**
 * Przerysowanie, gdy zmieni się **szerokość pudełka** elementu.
 * Sama wysokość zmienia się na telefonie przy chowaniu paska adresu —
 * wtedy nie przerysowujemy, żeby niebo nie mrugało przy przewijaniu.
 * Pudełko, a nie okno: w Windowsie okno liczy też pasek przewijania.
 */
function usePrzerysuj(ref, rysuj) {
  useEffect(() => {
    const el = ref.current
    if (!el) return undefined
    // pierwsze rysowanie od razu — obserwator raportuje dopiero w cyklu klatki
    let szer = Math.round(el.clientWidth)
    rysuj()
    let t
    const sprawdz = () => {
      const nowa = Math.round(el.clientWidth)
      if (nowa === szer) return
      szer = nowa
      clearTimeout(t)
      t = setTimeout(rysuj, 200)
    }
    const obs = new ResizeObserver(sprawdz)
    obs.observe(el)
    // zapas na wypadek spóźnionego obserwatora (np. pasek przewijania po ekranie ładowania)
    const zapas = setInterval(sprawdz, 1000)
    return () => { clearTimeout(t); clearInterval(zapas); obs.disconnect() }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}

function Galaktyka({ px, py, scrollY }) {
  const ramka = useRef(null)
  const dysk = useRef(null)

  usePrzerysuj(ramka, () => {
    const bok = ramka.current?.clientWidth
    if (bok && dysk.current) rysujGalaktyke(dysk.current, bok)
  })

  /**
   * Galaktyka jest daleko, więc prawie nie reaguje. Przez całą stronę
   * wykonuje jedno pełne kołysanie: sinus z okresem **równym długości
   * pętli**. Na szwie pętli pozycja cofa się dokładnie o ten okres, więc
   * galaktyka stoi tam, gdzie stała — bez skoku i bez nadrabiania.
   */
  const x = useTransform(px, (v) => v * 16)
  const y = useTransform([py, scrollY], ([v, sv]) => {
    const L = dlugoscPetli() || window.innerHeight * 12
    return v * 10 + Math.sin((sv / L) * Math.PI * 2) * 34
  })

  return (
    <motion.div className="gx" ref={ramka} style={{ x, y }}>
      <span className="gx-halo" />
      <div className="gx-nachyl">
        <canvas ref={dysk} className="gx-dysk" />
      </div>
    </motion.div>
  )
}

/* ─────────────────────── Droga Mleczna ─────────────────────── */

/** Płótno wystaje poza kadr, żeby ruch za kursorem nie odsłonił krawędzi. */
const ZAPAS = 24

function rysujNiebo(c) {
  // wymiar z pudełka, nie z innerWidth — patrz komentarz w PoleGwiazd (Cosmos.jsx)
  const w = Math.max(1, Math.round(c.clientWidth))
  const h = Math.max(1, Math.round(c.clientHeight))
  c.width = w
  c.height = h
  const g = c.getContext('2d')
  g.clearRect(0, 0, w, h)
  const f = gestosc()

  // pas po przekątnej, z lewego dołu w prawą górę
  const ax = -0.1 * w
  const ay = 0.92 * h
  const dx = 1.2 * w
  const dy = -0.84 * h
  const dl = Math.hypot(dx, dy)
  const nx = -dy / dl
  const ny = dx / dl
  const szer = Math.min(w, h) * 0.13
  const naPasie = (u, o) => [ax + dx * u + nx * o, ay + dy * u + ny * o]

  /**
   * Mgławice rysujemy w ćwiartce rozdzielczości i dopiero potem
   * powiększamy z wygładzaniem.
   *
   * Dziesiątki bardzo przezroczystych gradientów (krycie ~0.04) nałożonych
   * na siebie mają za mało odcieni w 8 bitach, więc przeglądarka wyrównuje
   * przejścia ditheringiem — regularnym wzorem kropek. Na ciemnym niebie
   * układał się on w **równą kratkę**, dokładnie to, co miało zniknąć.
   * Powiększenie małego obrazu rozmywa ten wzór w gładką mgłę.
   */
  const SKALA_MGLY = 4
  const mgla = document.createElement('canvas')
  mgla.width = Math.ceil(w / SKALA_MGLY)
  mgla.height = Math.ceil(h / SKALA_MGLY)
  const m = mgla.getContext('2d')
  m.scale(1 / SKALA_MGLY, 1 / SKALA_MGLY)
  m.globalCompositeOperation = 'lighter'
  const kolory = ['95,115,200', '150,95,170', '205,165,125', '80,150,175']
  for (let n = 0; n < 46; n++) {
    const [x, y] = naPasie(Math.random(), gauss() * szer * 0.8)
    plama(m, x, y, (90 + Math.random() * 230) * Math.sqrt(f), kolory[n % kolory.length], 0.035 + Math.random() * 0.03)
  }
  // ciemna szczelina pyłu przez środek pasa — też w mgle, z tego samego powodu
  m.globalCompositeOperation = 'destination-out'
  for (let n = 0; n < 70; n++) {
    const [x, y] = naPasie(Math.random(), gauss() * szer * 0.22)
    plama(m, x, y, (26 + Math.random() * 60) * Math.sqrt(f), '0,0,0', 0.2)
  }
  g.imageSmoothingEnabled = true
  g.imageSmoothingQuality = 'high'
  g.drawImage(mgla, 0, 0, w, h)

  g.globalCompositeOperation = 'lighter'
  for (let n = 0; n < 2600 * f; n++) {
    const o = gauss() * szer
    const [x, y] = naPasie(Math.random(), o)
    // w szczelinie pyłu gwiazdy gasną zamiast być wycinane
    const pyl = 1 - 0.75 * Math.exp(-((o / (szer * 0.25)) ** 2))
    const bok = Math.random() < 0.85 ? 1 : 1.6
    g.fillStyle = `rgba(235,238,255,${(0.06 + Math.random() * 0.32) * pyl})`
    g.fillRect(x, y, bok, bok)
  }

  // rzadki, drobny pył gwiazd poza pasem
  g.globalCompositeOperation = 'source-over'
  for (let n = 0; n < 700 * f; n++) {
    g.fillStyle = `rgba(230,235,255,${0.05 + Math.random() * 0.22})`
    g.fillRect(Math.random() * w, Math.random() * h, 1, 1)
  }
}

/** Kilka jaśniejszych gwiazd, które mrugają — każda we własnym rytmie. */
function losujMigotanie(ile) {
  const barwy = ['#FFFBF2', '#DDE6FF', '#FFE6C8', '#FFFFFF']
  return Array.from({ length: ile }, (_, n) => ({
    n,
    x: Math.random() * 100,
    y: Math.random() * 100,
    r: 1.4 + Math.random() * 1.8,
    kolor: barwy[n % barwy.length],
    czas: 2.6 + Math.random() * 4.5,
    opoznienie: -Math.random() * 7,
  }))
}

export default function DeepSky({ px, py, scrollY }) {
  const niebo = useRef(null)
  const [migotanie] = useState(() => losujMigotanie(window.innerWidth < 860 ? 9 : 18))

  usePrzerysuj(niebo, () => { if (niebo.current) rysujNiebo(niebo.current) })

  // najdalszy plan: kilka pikseli za kursorem i powolny oddech
  const czas = useTime()
  const x = useTransform([px, czas], ([v, tv]) => v * 7 + Math.sin(tv / 21000) * 4)
  const y = useTransform([py, czas], ([v, tv]) => v * 5 + Math.cos(tv / 27000) * 4)

  return (
    <>
      <motion.div className="cos-deep" style={{ x, y }}>
        <canvas ref={niebo} className="cos-deep-plotno" />
        {migotanie.map((m) => (
          <span
            key={m.n}
            className="cos-tw"
            style={{
              left: `${m.x}%`,
              top: `${m.y}%`,
              width: m.r,
              height: m.r,
              '--kolor': m.kolor,
              animationDuration: `${m.czas}s`,
              animationDelay: `${m.opoznienie}s`,
            }}
          />
        ))}
      </motion.div>
      <Galaktyka px={px} py={py} scrollY={scrollY} />
    </>
  )
}
