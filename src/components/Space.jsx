import { useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion, useMotionValue, useMotionValueEvent, useScroll, useSpring, useTransform } from 'framer-motion'
import { useLoopSpring } from '../lib/useLoopSpring'
import Cover from './Cover'
import Folder from './Folder'
import Morph from './Morph'
import Focus from './Focus'
import Tour from './Tour'
import { textOf, useProjects } from '../lib/projects'
import { useT } from '../lib/lang-ctx'
import { useTilt } from '../lib/useTilt'
import { goToEnd } from '../lib/scroll'
import { ambience, isOn, pop } from '../lib/sound'
import { EASE } from '../lib/motion'


/**
 * Miejsca kart w głębi: [x %, y %, z px].
 *
 * Liczone, a nie wpisane — bo listę prac edytujesz w panelu i może ich
 * być pięć albo dwadzieścia. Kolejne karty idą po spirali, żeby żadne
 * dwie nie wylądowały na sobie, a odstęp na osi Z jest stały.
 */
/**
 * Rozstaw kart w tunelu.
 *
 * `STEP` to odstęp w głąb. Był 330 i przy dziewięciu pracach robiło się
 * ciasno — w jednej chwili w kadrze siedziało osiem kart, wszystkie
 * z pełnym kryciem, więc bliskie i dalekie zlewały się w kupę zamiast
 * układać w przestrzeń (zmierzone: osiem sztuk w pasie 213–699 px
 * w poziomie i 350–536 px w pionie, przy kadrze 961 × 922).
 *
 * Kąty idą złotym kątem (2.399963 rad), więc kolejne karty nigdy nie
 * lądują w tej samej okolicy. Promień skacze co kartę, żeby sąsiednie
 * nie siadały na tym samym okręgu.
 */
const STEP = 300
const seatFor = (i) => {
  // pierwsza karta stoi dokładnie na wprost — wejście w tunel ma być
  // wyśrodkowane, a nie od razu przekrzywione
  if (i === 0) return [0, 0, -320]
  const a = (i - 1) * 2.399963 + 0.9
  const r = 19 + ((i - 1) % 4) * 6
  // w pionie rozstaw jest teraz szerszy: kadr jest wyższy niż szerszy,
  // a karty i tak trzymały się jednego pasa w połowie wysokości
  return [Math.cos(a) * r * 1.5, Math.sin(a) * r * 1.25, -320 - i * STEP]
}

/**
 * Karta gaśnie, ZANIM zdąży wyjechać poza kadr.
 *
 * Perspektywa rozpycha wszystko na boki tym mocniej, im bliżej
 * obiektywu — przy poprzednim progu karty odlatywały poza ekran, wciąż
 * mając pełne krycie, i po prostu nie dało się w nie kliknąć. Teraz
 * znikają jeszcze przed krawędzią.
 */
const NEAR = 60

function Card({ item, seat, cam, rush, far, hot, cardRef }) {
  const FAR = far
  const [x, y, z] = seat
  const here = useTransform(cam, (v) => v + z)
  const near = useTransform(here, [FAR, NEAR], [0, 1])

  const depth = useTransform(here, (v) => `${v}px`)

  /**
   * Krycie zależy od tego, jak daleko karta **jest teraz**, a nie tylko
   * od tego, czy mieści się w tunelu.
   *
   * Wcześniej płaskowyż pełnego krycia ciągnął się przez 2700 px
   * głębokości, więc osiem kart naraz świeciło tak samo mocno i oko nie
   * miało z czego odczytać dystansu. Teraz mocna jest tylko ta, która
   * jest na wprost; dalsze zostają jako przygaszone plany.
   */
  /* Gęściej: mocny pas jest szerszy, a dalekie karty nie gasną tak
     ostro, więc w kadrze widać ich więcej naraz. */
  const fade = useTransform(
    here,
    [FAR, -2600, -1800, -1150, NEAR - 260, NEAR],
    [0, 0.3, 0.62, 1, 1, 0],
  )

  /**
   * Bez głębi ostrości.
   *
   * Karty były rozmywane filtrem liczonym od nowa w każdej klatce, osobno
   * dla każdej z dziewięciu. Dawny pomiar „na granicy szumu" był zrobiony
   * przy wstrzymanych klatkach panelu, więc niczego nie dowodził, a filtr
   * zmieniany co klatkę wymusza ponowne malowanie warstwy. Dystans czyta
   * się i tak z krycia, skali i obrotu.
   */
  // cień zostaje stały: liczony co klatkę dla dziewięciu kart kosztował
  // ~7 ms na najgorszych klatkach (p95 57 → 50 ms po zamrożeniu)

  /**
   * Rybie oko: karta nie leży płasko, tylko na wycinku kuli. Im dalej
   * od środka kadru, tym mocniej odwraca się ku czytelnikowi i tym
   * bardziej zaokrągla rogi — tak zachowuje się obraz na krawędzi
   * szerokiego obiektywu.
   */
  // rozjazd kanałów rośnie razem z rozpędem kamery
  const rgbShift = useTransform(rush, (v) => v * 9)
  const rgbBack = useTransform(rush, (v) => v * -9)

  const off = Math.hypot(x, y)
  // im bliżej obiektywu, tym mocniejsze zakrzywienie i tym bardziej
  // pękate rogi — tak samo jak w prawdziwym szerokim kadrze
  const rotY = useTransform(near, (v) => -x * (0.3 + v * 0.95))
  const rotX = useTransform(near, (v) => y * (0.24 + v * 0.85))
  // rogi stałe: zaokrąglenie zmieniane co klatkę przemalowywało kartę razem z maską
  const round = `${Math.round(14 + Math.min(off, 60) * 0.55)}px`

  return (
    <motion.div
      className={`space-card ${hot ? 'hot' : ''}`}
      ref={cardRef}
      style={{
        // --sx / --sy zwężają rozstaw na wąskich ekranach, żeby żadna
        // karta nie wychodziła poza kadr (wartości w deep.css)
        left: `calc(50% + ${x} * var(--sx, 1) * 1%)`,
        top: `calc(50% + ${y} * var(--sy, 1) * 1%)`,
        translateZ: depth,
        opacity: fade,
        borderRadius: round,
        rotateY: rotY,
        rotateX: rotX,
        scale: hot ? 1.06 : 1,
      }}
      transition={{ duration: 0.26, ease: EASE }}
    >
      <Cover id={item.id} tint={item.tint} name={item.name} host={item.host} still />
      <span className="space-card-bar">
        <b>{item.name}</b>
        <i>{item.year}</i>
      </span>
      {/* pikseloza wygryza brzeg karty tym mocniej, im szybciej jedzie kamera */}
      <motion.span className="space-px" style={{ opacity: rush }} aria-hidden="true" />
      <motion.span className="space-rgb r" style={{ opacity: rush, x: rgbShift }} aria-hidden="true" />
      <motion.span className="space-rgb c" style={{ opacity: rush, x: rgbBack }} aria-hidden="true" />
    </motion.div>
  )
}

/**
 * Ostatnia karta przelotu: miejsce dla kolejnego klienta.
 *
 * W odróżnieniu od pozostałych **nie mija kamery i nie znika**. Dojeżdża
 * na wprost, zatrzymuje się na `TRZYMAJ` i tam zostaje, rosnąc — a że
 * scena jest przyklejona do ekranu, reszta przewijania tunelu trzyma
 * kadr właśnie na niej. To ona ma być ostatnim, co widzisz z tej sekcji,
 * bo to jedyna karta, która mówi coś do czytelnika.
 */
const TRZYMAJ = -70

function Invite({ seat, cam, t, far, cardRef }) {
  const FAR = far
  const [x, y, z] = seat
  const here = useTransform(cam, (v) => v + z)
  // zatrzymanie przed kamerą zamiast przelotu obok niej
  const stoi = useTransform(here, (v) => Math.min(v, TRZYMAJ))
  const depth = useTransform(stoi, (v) => `${v}px`)
  const fade = useTransform(stoi, [FAR - 200, FAR + 300, TRZYMAJ], [0, 1, 1])
  const rosnie = useTransform(stoi, [FAR + 300, TRZYMAJ], [1, 1.34])

  return (
    <motion.div
      className="space-card invite"
      ref={cardRef}
      style={{
        left: `calc(50% + ${x} * var(--sx, 1) * 1%)`,
        top: `calc(50% + ${y} * var(--sy, 1) * 1%)`,
        translateZ: depth,
        scale: rosnie,
        opacity: fade,
      }}
      transition={{ duration: 0.26, ease: EASE }}
    >
      <span className="invite-badge">{t.grid.badge}</span>
      <strong>{t.grid.nextTitle.replace('|', ' ')}</strong>
      <span className="invite-go">
        {t.grid.nextCta}
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      </span>
    </motion.div>
  )
}

/**
 * Przelot przez głębię.
 *
 * Sekcja jest wysoka, a scena w środku przyklejona — scroll przesuwa
 * „kamerę" po osi Z, więc karty nadlatują z głębi i mijają czytelnika.
 * Przechył sceny bierze się z myszy, a na telefonie z żyroskopu; karty
 * leżą na różnych głębokościach, więc każda odjeżdża w innym tempie
 * i widać prawdziwą przestrzeń, nie przesuwane obrazki.
 *
 * Wszystko na transformach CSS 3D — bez WebGL-a, bez wczytywania paczek
 * i bez ryzyka, że komuś nie wstanie kontekst graficzny.
 */
export default function Space() {
  const t = useT()
  const ref = useRef(null)
  const [open, setOpen] = useState(null)   // pełny podgląd strony
  const [focus, setFocus] = useState(null) // karta wyciągnięta na środek
  const [from, setFrom] = useState(null)
  const [lead, setLead] = useState(0)
  const work = useProjects()
  const item = work.find((w) => w.id === open)
  const focusIdx = focus ? work.findIndex((w) => w.id === focus.id) : -1
  const focusItem = focusIdx >= 0 ? work[focusIdx] : null

  const { x, y, needsAsk, ask } = useTilt()
  const rotY = useTransform(x, [-1, 1], [9, -9])
  const rotX = useTransform(y, [-1, 1], [-7, 7])
  const slideX = useTransform(x, [-1, 1], [46, -46])
  const slideY = useTransform(y, [-1, 1], [30, -30])

  // przelot musi objąć wszystkie karty plus kafel zaproszenia
  const seats = useMemo(() => work.map((_, i) => seatFor(i)), [work])
  /* `y = 9`, nie `-2`: tytuł zajmuje górę sceny, więc karta zaproszenia
     ma stanąć pod nim, a nie na nim. */
  const invite = useMemo(() => [0, 9, -260 - work.length * STEP], [work.length])
  const deepest = Math.abs(invite[2])
  const far = -deepest - 140

  /**
   * Trafianie w karty liczymy sami, na żądanie.
   *
   * Przeglądarka testuje klik na NIEprzekształconym pudełku elementu, a
   * karty siedzą głęboko w osi Z — więc klikalna była tylko ta najbliżej
   * obiektywu, a wszystkie za nią „nie istniały". Zamiast tego jeden
   * uchwyt na całej scenie mierzy przy kliknięciu rzeczywiste prostokąty
   * kart i wybiera tę, która jest pod kursorem i najbliżej. Pomiar leci
   * tylko przy zdarzeniu, więc nic nie kosztuje przy scrollu.
   */
  /**
   * Teczka: brama do sekcji.
   *
   * Otwiera się **wyłącznie kliknięciem**. Wcześniej rozsuwała się też
   * sama po kawałku przewinięcia, ale wtedy wachlarz kart rozlatywał
   * się, zanim ktokolwiek zdążył go zobaczyć — gest gubił swój moment.
   */
  const [otwarte, setOtwarte] = useState(false)

  const cardRefs = useRef([])
  const [hot, setHot] = useState(-1)

  const pickAt = (cx, cy) => {
    let best = -1
    let bestZ = -Infinity
    cardRefs.current.forEach((el, i) => {
      if (!el) return
      if (parseFloat(getComputedStyle(el).opacity) < 0.35) return
      const r = el.getBoundingClientRect()
      if (cx < r.left || cx > r.right || cy < r.top || cy > r.bottom) return
      const z = parseFloat((el.style.transform.match(/translateZ\(([-\d.]+)px\)/) || [])[1] ?? -9999)
      if (z > bestZ) {
        bestZ = z
        best = i
      }
    })
    return best
  }

  /**
   * Kliknięcie w scenę działa tylko przy otwartej teczce.
   *
   * Przy zamkniętej karty są schowane przez krycie całej warstwy, ale
   * `pickAt` sprawdza krycie pojedynczej karty — więc trafiał w niewidoczny
   * kafel zaproszenia leżący dokładnie pod teczką i kliknięcie „Otwórz
   * teczkę” przerzucało do kontaktu. Do tego klik w samą teczkę wpadał
   * tu przez bąbelkowanie, stąd drugi warunek.
   */
  const onStageClick = (e) => {
    if (!otwarte || e.target.closest('.fold')) return
    const i = pickAt(e.clientX, e.clientY)
    if (i < 0) return
    const el = cardRefs.current[i]
    const r = el.getBoundingClientRect()
    const mid = r.left + r.width / 2
    if (i >= work.length) { goToEnd(); return } // kafel zaproszenia
    setFrom({ cx: mid, cy: r.top + r.height / 2, w: r.width })
    setFocus({ id: work[i].id })
    if (isOn()) pop()
  }

  // podświetlenie tej karty, nad którą stoi kursor — badane rzadko
  const lastLook = useRef(0)
  const onStageMove = (e) => {
    // przy zamkniętej teczce nie ma czego podświetlać ani celować w niewidoczne karty
    if (!otwarte) return
    const now = performance.now()
    if (now - lastLook.current < 90) return
    lastLook.current = now
    setHot(pickAt(e.clientX, e.clientY))
  }

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  /* Źródło kamery wyciągnięte do zmiennej, bo `useLoopSpring` musi je
     obserwować — to ono mówi, kiedy szew pętli już się przeliczył. */

  const camRaw = useTransform(scrollYProgress, [0, 1], [0, deepest + 120])
  const cam = useLoopSpring(camRaw, { stiffness: 120, damping: 30, restDelta: 0.5 })

  /**
   * Rozpęd kamery — stąd bierze się rozpad krawędzi.
   *
   * Wartość rośnie z prędkością przewijania i **sama opada**, kiedy
   * przestajesz kręcić. Bez tego opadania efekt zostawał zamrożony na
   * ostatniej wartości: szybki scroll i stop zostawiał karty na stałe
   * rozsypane. Teraz wolne przewijanie daje ledwie muśnięcie, szybkie —
   * pełny rozpad, a zatrzymanie wygasza wszystko w pół sekundy.
   */
  const rush = useMotionValue(0)
  const rushSoft = useSpring(rush, { stiffness: 210, damping: 24 })
  const seen = useRef(0)

  // która karta jest teraz najbliżej — do licznika u dołu
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    // tło rośnie przy wejściu w tunel i cichnie przy wyjściu
    ambience(v > 0.02 && v < 0.98 ? 1 : 0)
  })

  const calm = useRef(0)
  useMotionValueEvent(cam, 'change', (v) => {
    // Dzielnik dobrany pomiarem: przy 14 px na klatkę (spokojne
    // przewijanie) wychodzi ~0,1, przy 190 px (szarpnięcie) — pełny
    // rozpad. Przy 11 wszystko powyżej wolnego ruchu dawało jedynkę
    // i wolno/szybko wyglądało identycznie.
    const speed = Math.min(1, Math.abs(v - seen.current) / 150)
    rush.set(Math.max(speed, rush.get() * 0.82))
    seen.current = v

    clearTimeout(calm.current)
    calm.current = setTimeout(() => rush.set(0), 140)

    let best = 0
    let bestD = Infinity
    seats.forEach(([, , z], i) => {
      const d = Math.abs(v + z - 40)
      if (d < bestD) {
        bestD = d
        best = i
      }
    })
    setLead((prev) => (prev === best ? prev : best))
  })

  return (
    <section className={`space ${otwarte ? '' : 'zamkniete'}`} id="prace" ref={ref}>
      <div
        className={`space-stage ${hot >= 0 ? 'aim' : ''}`}
        onClick={onStageClick}
        onPointerMove={onStageMove}
        onPointerLeave={() => setHot(-1)}
      >
        <span className="space-vign" aria-hidden="true" />

        <motion.div
          className="space-field"
          style={{ rotateX: rotX, rotateY: rotY, x: slideX, y: slideY }}
        >
          {work.map((w, i) => (
            <Card
              key={w.id}
              item={w}
              seat={seats[i]}
              cam={cam}
              rush={rushSoft}
              far={far}
              hot={hot === i}
              cardRef={(el) => { cardRefs.current[i] = el }}
            />
          ))}
          <Invite seat={invite} cam={cam} t={t} far={far} cardRef={(el) => { cardRefs.current[work.length] = el }} />
        </motion.div>

        <AnimatePresence>
          {!otwarte && (
            <Folder
              key="teczka"
              prace={work}
              etykieta={t.tour.teczka}
              cta={t.tour.otworz}
              onOpen={() => { if (isOn()) pop(); setOtwarte(true) }}
            />
          )}
        </AnimatePresence>

        <div className="space-ui">
          <h2 className="space-title">
            {t.space.title}
            <Morph words={t.space.morph} className="space-morph" />
          </h2>
        </div>

        <div className="space-meter">
          <span className="space-count">
            <AnimatePresence mode="popLayout">
              <motion.b
                key={lead}
                initial={{ y: 14, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -14, opacity: 0 }}
                transition={{ duration: 0.28, ease: EASE }}
              >
                {String(lead + 1).padStart(2, '0')}
              </motion.b>
            </AnimatePresence>
            <i>/ {String(work.length).padStart(2, '0')}</i>
          </span>

          <AnimatePresence mode="wait">
            <motion.span
              className="space-name"
              key={work[lead].id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.28, ease: EASE }}
            >
              {work[lead].host}
            </motion.span>
          </AnimatePresence>

          {needsAsk ? (
            <button className="space-gyro" onClick={ask}>{t.space.gyro}</button>
          ) : (
            <span className="space-hint">{t.space.hint}</span>
          )}
        </div>
      </div>

      {/* kliknięta karta wychodzi z tunelu na środek i tam się otwiera */}
      {/* `key` bez identyfikatora pracy: przy przejściu strzałką panel ma
          zostać na miejscu i wymienić tylko środek. Z kluczem na `id`
          każde przejście zaczynałoby się od dolotu z pozycji pierwszej
          klikniętej karty. */}
      <AnimatePresence>
        {focusItem && (
          <Focus
            key="focus"
            item={focusItem}
            from={from}
            index={focusIdx}
            total={work.length}
            onPrev={() => setFocus({ id: work[(focusIdx - 1 + work.length) % work.length].id })}
            onNext={() => setFocus({ id: work[(focusIdx + 1) % work.length].id })}
            onClose={() => setFocus(null)}
            onOpenSite={() => { setOpen(focusItem.id); setFocus(null) }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {item && (
          <Tour
            key={item.id}
            item={item}
            kind={textOf(t, item).kind}
            from={from}
            onClose={() => setOpen(null)}
          />
        )}
      </AnimatePresence>
    </section>
  )
}
