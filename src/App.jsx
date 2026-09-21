import { useEffect, useState } from 'react'
import { AnimatePresence, MotionConfig, motion, useScroll, useSpring } from 'framer-motion'
import Lenis from 'lenis'

import Loader from './components/Loader'
import Topbar from './components/Topbar'
import Hero from './components/Hero'
import Me from './components/Me'
import Space from './components/Space'
import Story from './components/Story'
import Lab from './components/Lab'
import Process from './components/Process'
import Trust from './components/Trust'
import StickyCta from './components/StickyCta'
import Finale from './components/Finale'
import Leaf from './components/Leaf'
import Guide from './components/Guide'
import Cursor from './components/Cursor'
import Jump from './components/Jump'
import Loop from './components/Loop'
import Admin from './components/Admin'
import Grain from './components/Grain'
import Cosmos from './components/Cosmos'
import { MascotProvider } from './lib/mascot'
import { LangProvider } from './lib/lang'
import { SPRING } from './lib/motion'

export default function App() {
  const [loading, setLoading] = useState(true)

  // panel prac otwiera się adresem z `#admin` na końcu
  const [admin, setAdmin] = useState(() => window.location.hash === '#admin')
  useEffect(() => {
    const onHash = () => setAdmin(window.location.hash === '#admin')
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])
  const { scrollYProgress } = useScroll()
  const bar = useSpring(scrollYProgress, SPRING.scroll)

  /**
   * Pasek postępu przy domknięciu pętli.
   *
   * Sprężyna wygładza każdą zmianę, więc po cofnięciu pozycji
   * przejechałaby przez cały pasek z powrotem — jedyna rzecz na ekranie,
   * która zdradzałaby, że coś się stało. `jump()` ustawia wartość bez
   * dojazdu, dokładnie w tej samej klatce co przesunięcie widoku.
   */
  useEffect(() => {
    const snap = () => bar.jump(scrollYProgress.get())
    window.addEventListener('strx:loop', snap)
    return () => window.removeEventListener('strx:loop', snap)
  }, [bar, scrollYProgress])

  // strona zawsze startuje od gory, nawet po odswiezeniu w polowie
  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    document.body.classList.toggle('locked', loading)
  }, [loading])

  useEffect(() => {
    if (loading) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    /* Dłuższy dobieg i łagodniejsza krzywa — koniec gestu ma wybrzmieć,
       a nie uciąć się w miejscu, w którym puściłeś kółko. */
    /**
     * Dociąganie (`lerp`) zamiast animacji o stałym czasie.
     *
     * Przy `duration` każdy ząbek kółka odpalał od nowa krzywą 1.25 s
     * zaczynającą się od największej prędkości — przewijanie szło
     * zrywami, szczególnie myszką. `lerp` co klatkę pokonuje stały
     * ułamek drogi do celu, więc kolejne ząbki tylko przesuwają cel,
     * a ruch zostaje jednym ciągłym wyhamowaniem.
     */
    const lenis = new Lenis({
      lerp: 0.085,
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.6,
    })
    window.__lenis = lenis
    let raf
    const loop = (time) => {
      lenis.raf(time)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => { cancelAnimationFrame(raf); lenis.destroy(); delete window.__lenis }
  }, [loading])

  return (
    <LangProvider>
    {/* `reducedMotion="user"` wycina ruch (przesunięcia, obroty, głębię),
        ale zostawia zmiany przezroczystości — więc przy wyłączonych
        animacjach w systemie treść wchodzi, zamiast zostać niewidoczna. */}
    <MotionConfig reducedMotion="user">
    <MascotProvider>
      <Cosmos />
      <motion.div className="progress" style={{ scaleX: bar }} />

      <AnimatePresence>
        {loading && <Loader key="loader" onDone={() => setLoading(false)} />}
      </AnimatePresence>

      <Topbar />

      <main>
        <Hero />
        <Leaf tone="white" z={1}><Me /></Leaf>
        {/**
          * Prace: tunel na szerokim ekranie, pozioma szyna na telefonie.
          *
          * To nie jest ta sama sekcja w innych stylach. Tunel 3D wymaga
          * szerokiego kadru i **pionowego** przewijania przez całą
          * sekcję — na telefonie oznaczało to, że nie da się jej
          * opuścić, dopóki nie przejedzie się wszystkich prac. Szyna
          * przewija się palcem w poziomie, a gest pionowy zostaje dla
          * strony.
          */}
        {/**
          * Opowieść: budowa jednej strony od rozmowy do startu. Na końcu
          * strona odlatuje w kosmos — prosto do przestrzeni z pracami,
          * która stoi zaraz pod nią. Usługi i przebieg współpracy są
          * rozdziałami tej budowy, a nie osobnymi listami.
          */}
        <Story />
        <Space />
        <Leaf tone="white" z={6}><Lab /></Leaf>
        <Leaf tone="paper" z={7}><Process /></Leaf>
        <Leaf tone="white" z={8}><Trust /></Leaf>
      </main>

      <Finale />

      {/* Szew pętli: to samo, co na górze strony. Kiedy tu dojedziesz,
          kadr jest identyczny jak na starcie — i wtedy `Loop` po cichu
          cofa pozycję przewijania. */}
      <div className="echo" aria-hidden="true">
        <Hero ghost />
        {/**
          * Górna krawędź następnej sekcji, doklejona do echa.
          *
          * Na pierwszym ekranie strony dolne kilkadziesiąt pikseli
          * zajmuje już zaokrąglony róg sekcji „o mnie" — wjeżdża pod
          * hero ujemnym marginesem. Echo bez tego rogu nie zgadzało się
          * z górą strony i w chwili domknięcia pętli było widać zmianę.
          * To nie jest ozdoba, tylko **brakujący kawałek kadru**.
          */}
        <div className="echo-lip" />
      </div>
      {/**
        * Zapas na rozpęd za szwem.
        *
        * Lenis obcina cel przewijania do końca dokumentu. Kiedy za szwem
        * było tylko ~150 px, każdy szybszy ruch kółka przy końcu strony
        * uderzał w dno: kolejne obroty nie przesuwały celu i ginęły
        * (zmierzone: 515 px z 4080 przejechanych), a strona sprawiała
        * wrażenie, że się kończy, zanim zacznie od nowa. Pętla cofa pozycję
        * już na szwie, więc tego pasa nigdy nie widać — jest tylko po to,
        * żeby było dokąd się rozpędzić.
        */}
      <div className="echo-zapas" aria-hidden="true" />
      <Guide />
      <Cursor />
      <Jump />
      <Loop />
      {admin && (
        <Admin
          onClose={() => {
            window.location.hash = ''
            setAdmin(false)
          }}
        />
      )}
      <StickyCta />
      <Grain />
    </MascotProvider>
    </MotionConfig>
    </LangProvider>
  )
}
