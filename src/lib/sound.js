/**
 * Dźwięk na stronie — generowany, nie wgrywany.
 *
 * Żadnych plików mp3: wszystko powstaje w Web Audio z oscylatorów i
 * szumu. Cała warstwa dźwiękowa waży zero bajtów transferu i nie ma
 * czego dociągać przy wejściu.
 *
 * WAŻNE: przeglądarki blokują dźwięk, dopóki użytkownik czegoś nie
 * kliknie — i słusznie, bo strona, która sama zaczyna grać, jest po
 * prostu chamska. Dlatego domyślnie jest cisza, a na stronie stoi
 * przełącznik. Po włączeniu wszystko gra samo, bez pytania o zgodę
 * przy każdym kliknięciu.
 */

const KEY = 'strx-sound'

let ctx = null
let master = null
let padGain = null
let padNodes = null
let on = false

export const isOn = () => on

/** Czy użytkownik włączył dźwięk w poprzedniej wizycie. */
export function wanted() {
  try {
    return localStorage.getItem(KEY) === '1'
  } catch {
    return false
  }
}

function boot() {
  if (ctx) return ctx
  const AC = window.AudioContext || window.webkitAudioContext
  if (!AC) return null
  ctx = new AC()
  master = ctx.createGain()
  master.gain.value = 0.0001
  master.connect(ctx.destination)
  return ctx
}

/** Krótki szum — materiał na wszystkie „miękkie" dźwięki. */
function noise(seconds = 0.4) {
  const len = Math.floor(ctx.sampleRate * seconds)
  const buf = ctx.createBuffer(1, len, ctx.sampleRate)
  const d = buf.getChannelData(0)
  for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len)
  return buf
}

/**
 * Poduszka w tle: dwa oscylatory rozstrojone o kilka centów plus
 * wolno pełzający filtr. Brzmi jak pomieszczenie, a nie jak melodia —
 * o to chodzi, ma być tłem, którego się nie zauważa.
 */
function startPad() {
  if (!ctx || padNodes) return
  padGain = ctx.createGain()
  padGain.gain.value = 0
  const filter = ctx.createBiquadFilter()
  filter.type = 'lowpass'
  filter.frequency.value = 520
  filter.Q.value = 0.6

  const a = ctx.createOscillator()
  const b = ctx.createOscillator()
  a.type = 'sine'
  b.type = 'sine'
  a.frequency.value = 55
  b.frequency.value = 55 * 1.005

  const lfo = ctx.createOscillator()
  const lfoGain = ctx.createGain()
  lfo.frequency.value = 0.06
  lfoGain.gain.value = 180
  lfo.connect(lfoGain).connect(filter.frequency)

  a.connect(filter)
  b.connect(filter)
  filter.connect(padGain).connect(master)

  a.start()
  b.start()
  lfo.start()
  padNodes = { a, b, lfo }
}

/* ── muzyka: cztery akordy, bez początku i bez końca ─── */

/**
 * Akordy w pętli. Górne głosy służą za pulę dźwięków, z których losujemy
 * kolejne uderzenia — dzięki temu melodia nigdy nie powtarza się
 * dosłownie, a mimo to zawsze wpada w harmonię.
 */
const AKORDY = [
  [110.0, 261.63, 329.63, 392.0],  // Am7
  [87.31, 220.0, 261.63, 329.63],  // Fmaj7
  [130.81, 329.63, 392.0, 493.88], // Cmaj7
  [98.0, 246.94, 293.66, 329.63],  // G6
]

let muzyka = null

/**
 * Spokojna warstwa muzyczna — też generowana, zero plików.
 *
 * Poduszka pod spodem brzmi jak pomieszczenie, ale sama w sobie jest
 * tylko szumem. Tutaj dochodzi to, co daje wrażenie muzyki: powolna
 * zmiana akordu co 12 sekund i pojedyncze, miękkie uderzenia
 * wybierane z jego górnych głosów.
 *
 * Wszystko idzie przez wspólne echo (`delay` z lekkim sprzężeniem),
 * bo to ono robi przestrzeń — bez niego dźwięki są suche i brzmią jak
 * powiadomienia, a nie jak tło.
 *
 * Harmonogram stoi na `setTimeout`, nie na klatkach: uderzenie jest raz
 * na kilka sekund, więc nie ma czego liczyć co klatkę.
 */
function startMusic() {
  if (!ctx || muzyka) return

  const gain = ctx.createGain()
  gain.gain.value = 0.0001

  const echo = ctx.createDelay(1)
  echo.delayTime.value = 0.38
  const echoGain = ctx.createGain()
  echoGain.gain.value = 0.3
  const echoFilter = ctx.createBiquadFilter()
  echoFilter.type = 'lowpass'
  echoFilter.frequency.value = 1600

  echo.connect(echoFilter).connect(echoGain).connect(echo)
  echo.connect(gain)
  gain.connect(master)

  let akord = 0
  let zegar = null

  const uderz = (freq) => {
    const t = ctx.currentTime
    const o = ctx.createOscillator()
    const o2 = ctx.createOscillator()
    const g = ctx.createGain()
    const f = ctx.createBiquadFilter()
    f.type = 'lowpass'
    f.frequency.value = 1900
    o.type = 'sine'
    o2.type = 'triangle'
    o.frequency.value = freq
    // druga oktawa ledwie słyszalna — dodaje dzwonkowi ciała
    o2.frequency.value = freq * 2.002
    const g2 = ctx.createGain()
    g2.gain.value = 0.18

    g.gain.setValueAtTime(0, t)
    g.gain.linearRampToValueAtTime(0.5, t + 0.03)
    g.gain.exponentialRampToValueAtTime(0.0001, t + 3.6)

    o.connect(f)
    o2.connect(g2).connect(f)
    f.connect(g)
    g.connect(gain)
    g.connect(echo)
    o.start(t)
    o2.start(t)
    o.stop(t + 3.8)
    o2.stop(t + 3.8)
  }

  const krok = () => {
    if (!on) return
    const glosy = AKORDY[akord]
    // basu nie uderzamy — trzyma go poduszka; gramy z górnych głosów
    const freq = glosy[1 + Math.floor(Math.random() * 3)]
    // co kilka uderzeń oktawa wyżej, żeby linia oddychała
    uderz(Math.random() < 0.24 ? freq * 2 : freq)
    zegar = setTimeout(krok, 2200 + Math.random() * 1600)
  }

  const zmiana = setInterval(() => { akord = (akord + 1) % AKORDY.length }, 12000)
  zegar = setTimeout(krok, 1200)

  muzyka = {
    gain,
    stop: () => { clearTimeout(zegar); clearInterval(zmiana) },
  }
}

/** Głośność muzyki. Cicho z założenia — to tło, nie odtwarzacz. */
export function music(level) {
  if (!muzyka || !ctx) return
  muzyka.gain.gain.setTargetAtTime(Math.max(0.0001, level * 0.055), ctx.currentTime, 1.2)
}

export function enable(state) {
  on = state
  try {
    localStorage.setItem(KEY, state ? '1' : '0')
  } catch {
    /* prywatne okno — trudno */
  }
  if (!state) {
    if (master) master.gain.setTargetAtTime(0.0001, ctx.currentTime, 0.15)
    return
  }
  if (!boot()) return
  if (ctx.state === 'suspended') ctx.resume()
  startPad()
  startMusic()
  music(1)
  master.gain.setTargetAtTime(0.5, ctx.currentTime, 0.25)
}

/** Głośność poduszki — podnoszona w scenie 3D, ściszana poza nią. */
export function ambience(level) {
  if (!on || !padGain || !ctx) return
  padGain.gain.setTargetAtTime(level * 0.055, ctx.currentTime, 0.6)
}

/* ── pojedyncze zdarzenia ─────────────────────────────── */

function blip({ freq = 620, dur = 0.06, type = 'sine', gain = 0.12, slide = 0 }) {
  if (!on || !ctx) return
  const t = ctx.currentTime
  const o = ctx.createOscillator()
  const g = ctx.createGain()
  o.type = type
  o.frequency.setValueAtTime(freq, t)
  if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(40, freq + slide), t + dur)
  g.gain.setValueAtTime(0, t)
  g.gain.linearRampToValueAtTime(gain, t + 0.008)
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur)
  o.connect(g).connect(master)
  o.start(t)
  o.stop(t + dur + 0.02)
}

function whoosh({ dur = 0.5, from = 1800, to = 260, gain = 0.16 }) {
  if (!on || !ctx) return
  const t = ctx.currentTime
  const src = ctx.createBufferSource()
  src.buffer = noise(dur)
  const f = ctx.createBiquadFilter()
  f.type = 'bandpass'
  f.Q.value = 0.9
  f.frequency.setValueAtTime(from, t)
  f.frequency.exponentialRampToValueAtTime(to, t + dur)
  const g = ctx.createGain()
  g.gain.setValueAtTime(0, t)
  g.gain.linearRampToValueAtTime(gain, t + dur * 0.18)
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur)
  src.connect(f).connect(g).connect(master)
  src.start(t)
}

/** Miękkie stuknięcie — guziki, zakładki, przełączniki. */
export const tick = () => blip({ freq: 880, dur: 0.045, gain: 0.07, slide: -220 })

/** Muśnięcie kursorem — bardzo cicho, żeby nie męczyło. */
export const brush = () => blip({ freq: 1450, dur: 0.03, gain: 0.022, slide: -300 })

/** Karta wyskakuje na środek. */
export const pop = () => {
  blip({ freq: 340, dur: 0.16, gain: 0.1, slide: 260 })
  whoosh({ dur: 0.34, from: 900, to: 2000, gain: 0.07 })
}

/** Zamknięcie — ten sam ruch w drugą stronę. */
export const shut = () => blip({ freq: 520, dur: 0.12, gain: 0.07, slide: -260 })

/** Przejście między sekcjami, kurtyna, zapętlenie strony. */
export const sweep = () => whoosh({ dur: 0.62, from: 2400, to: 180, gain: 0.15 })

/** Piksel złapał sznurek. */
export const grab = () => {
  blip({ freq: 180, dur: 0.22, gain: 0.14, slide: -80 })
  whoosh({ dur: 0.28, from: 1400, to: 300, gain: 0.1 })
}
