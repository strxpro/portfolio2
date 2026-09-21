import {
  CanvasTexture,
  CatmullRomCurve3,
  DirectionalLight,
  EdgesGeometry,
  Group,
  HemisphereLight,
  LineBasicMaterial,
  LineSegments,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  Scene,
  SphereGeometry,
  SRGBColorSpace,
  TubeGeometry,
  Vector3,
  WebGLRenderer,
} from 'three'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'

/**
 * „Budowa jednej strony” — scena opowieści.
 *
 * Jedna oś czasu `c` od 0 do 5, po jednej jednostce na rozdział:
 *
 *   0–1  ROZMOWA    dymki czatu wpływają jeden po drugim
 *   1–2  SZKIC      dymki wsiąkają w kartkę, rysuje się jej siatka
 *   2–3  KOD        bloki wypełniają się kolorem i rozchodzą warstwami w głąb
 *   3–4  PODPIĘCIA  panel, mail, SMS i kalendarz łączą się ze stroną przewodami
 *   4–5  START      strona obraca się i odlatuje w kosmos
 *
 * Scena niczego nie liczy sama z siebie — pozycję dostaje z przewijania
 * (`ustaw`). Czas płynie tylko dla drobnych rzeczy, które mają żyć, kiedy
 * stoisz: kołysanie i impulsy na przewodach. Pętla rysuje wyłącznie wtedy,
 * gdy sekcja jest na ekranie (`start` / `stop`).
 */

const PAPIER = 0xf3efe6
const AKCENT = 0x1b4df5

// [x, y, szer., wys., kolor, warstwa] — układ zwykłej strony firmowej
const BLOKI = [
  [0, 0, 3.4, 2.2, PAPIER, 0], // kartka
  [0, 0.99, 3.4, 0.22, 0xe2dccf, 1], // pasek przeglądarki
  [-1.5, 0.99, 0.07, 0.07, 0xc9c3b7, 2],
  [-1.38, 0.99, 0.07, 0.07, 0xc9c3b7, 2],
  [-1.26, 0.99, 0.07, 0.07, 0xc9c3b7, 2],
  [-0.62, 0.36, 1.9, 0.86, AKCENT, 2], // hero
  [1.05, 0.36, 0.98, 0.86, 0xebd8c8, 2], // zdjęcie
  [-0.9, -0.28, 1.4, 0.07, 0x8f8b82, 3], // tekst
  [-1.15, -0.42, 0.9, 0.07, 0xb3aea4, 3],
  [-1.08, -0.78, 0.98, 0.42, 0xdce3e8, 3], // karty
  [0, -0.78, 0.98, 0.42, 0xdfe5da, 3],
  [1.08, -0.78, 0.98, 0.42, 0xede3d2, 3],
]

const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v))
/** 0 przed `a`, 1 za `b`, gładko pomiędzy. */
const krok = (a, b, v) => {
  const x = clamp((v - a) / (b - a))
  return x * x * (3 - 2 * x)
}
/** 0 → 1 → 0 na odcinku a–b (dzwon). */
const dzwon = (a, b, v) => Math.sin(Math.PI * clamp((v - a) / (b - a)))

/* ── napisy na teksturach ──────────────────────────────────────────── */

const FONT = '600 44px Manrope, system-ui, sans-serif'

function zawin(g, tekst, max) {
  const slowa = tekst.split(' ')
  const linie = []
  let linia = ''
  for (const s of slowa) {
    const proba = linia ? `${linia} ${s}` : s
    if (g.measureText(proba).width > max && linia) {
      linie.push(linia)
      linia = s
    } else linia = proba
  }
  if (linia) linie.push(linia)
  return linie
}

function zaokraglony(g, x, y, w, h, r) {
  g.beginPath()
  g.moveTo(x + r, y)
  g.arcTo(x + w, y, x + w, y + h, r)
  g.arcTo(x + w, y + h, x, y + h, r)
  g.arcTo(x, y + h, x, y, r)
  g.arcTo(x, y, x + w, y, r)
  g.closePath()
}

/** Dymek czatu jako tekstura; zwraca też proporcje, żeby płaszczyzna miała dobry kształt. */
function dymek(tekst, moj) {
  const c = document.createElement('canvas')
  const g = c.getContext('2d')
  g.font = FONT
  const linie = zawin(g, tekst, 700)
  const szer = Math.min(780, Math.max(...linie.map((l) => g.measureText(l).width)) + 88)
  const wys = linie.length * 58 + 70
  c.width = Math.ceil(szer) + 24
  c.height = wys + 34
  g.font = FONT
  g.fillStyle = moj ? '#1B4DF5' : '#F3EFE6'
  zaokraglony(g, 12, 12, szer, wys, 36)
  g.fill()
  // ogonek po stronie nadawcy
  g.beginPath()
  const ox = moj ? 12 + szer - 60 : 60
  g.moveTo(ox - 16, 12 + wys - 2)
  g.lineTo(ox + (moj ? 26 : -26), 12 + wys + 22)
  g.lineTo(ox + 16, 12 + wys - 2)
  g.fill()
  g.fillStyle = moj ? '#FFFFFF' : '#17181A'
  g.textBaseline = 'top'
  linie.forEach((l, i) => g.fillText(l, 12 + 44, 12 + 36 + i * 58))
  const tex = new CanvasTexture(c)
  tex.colorSpace = SRGBColorSpace
  tex.anisotropy = 4
  return { tex, w: c.width / 300, h: c.height / 300 }
}

/** Płytka urządzenia z podpisem (panel, mail…). */
function plytka(podpis, znak) {
  const c = document.createElement('canvas')
  c.width = 420
  c.height = 300
  const g = c.getContext('2d')
  g.fillStyle = '#F3EFE6'
  zaokraglony(g, 0, 0, 420, 300, 40)
  g.fill()
  g.fillStyle = '#1B4DF5'
  g.font = '700 96px Manrope, system-ui, sans-serif'
  g.textAlign = 'center'
  g.textBaseline = 'middle'
  g.fillText(znak, 210, 120)
  g.fillStyle = '#17181A'
  g.font = '600 40px Manrope, system-ui, sans-serif'
  g.fillText(podpis, 210, 232)
  const tex = new CanvasTexture(c)
  tex.colorSpace = SRGBColorSpace
  tex.anisotropy = 4
  return tex
}

/* ── scena ─────────────────────────────────────────────────────────── */

export function zbuduj(canvas, { lekko = false } = {}) {
  const renderer = new WebGLRenderer({
    canvas,
    antialias: !lekko,
    alpha: true,
    powerPreference: 'high-performance',
  })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, lekko ? 1.5 : 2))
  renderer.setClearColor(0x000000, 0)

  const scene = new Scene()
  const camera = new PerspectiveCamera(32, 1, 0.1, 80)
  camera.position.set(0, 0, 7)

  // jasno i miękko: papier ma wyglądać jak papier, nie jak szary karton
  scene.add(new HemisphereLight(0xffffff, 0x4a5570, 2.4))
  const slonce = new DirectionalLight(0xffffff, 2.2)
  slonce.position.set(3, 5, 6)
  scene.add(slonce)

  // `swiat` przesuwa i skaluje całość pod kadr; `strona` to budowana witryna
  const swiat = new Group()
  scene.add(swiat)
  const strona = new Group()
  swiat.add(strona)

  const doSprzatania = []
  const pilnuj = (...x) => { doSprzatania.push(...x); return x[0] }

  /* bloki strony: bryła + obrys (szkic) */
  const bloki = BLOKI.map(([x, y, w, h, kolor, warstwa], i) => {
    const gleb = warstwa === 0 ? 0.06 : 0.035
    const geo = pilnuj(new RoundedBoxGeometry(w, h, gleb, 2, Math.min(0.06, h / 2.2)))
    const mat = pilnuj(new MeshStandardMaterial({ color: kolor, roughness: 0.55, metalness: 0, transparent: true, opacity: 0 }))
    const bryla = new Mesh(geo, mat)
    const obrysGeo = pilnuj(new EdgesGeometry(pilnuj(new PlaneGeometry(w, h))))
    const obrysMat = pilnuj(new LineBasicMaterial({ color: 0xf3efe6, transparent: true, opacity: 0 }))
    const obrys = new LineSegments(obrysGeo, obrysMat)
    const g = new Group()
    g.add(bryla, obrys)
    g.position.set(x, y, 0)
    strona.add(g)
    return { g, mat, obrysMat, warstwa, i }
  })

  /* siatka kolumn — rusztowanie szkicu */
  const kolumny = []
  for (let k = 0; k <= 12; k++) {
    const x = -1.6 + (3.2 / 12) * k
    const geo = pilnuj(new EdgesGeometry(pilnuj(new PlaneGeometry(0.0001, 2.0))))
    const mat = pilnuj(new LineBasicMaterial({ color: 0x9fb4ff, transparent: true, opacity: 0 }))
    const l = new LineSegments(geo, mat)
    l.position.set(x, -0.1, 0.01)
    strona.add(l)
    kolumny.push(mat)
  }

  /* dymki rozmowy — tekstury ustawia `teksty()` */
  const MIEJSCA_DYMKOW = [
    [-0.95, 0.95],
    [-0.45, 0.05],
    [0.85, -0.85],
  ]
  const dymki = MIEJSCA_DYMKOW.map(([x, y]) => {
    const geo = pilnuj(new PlaneGeometry(1, 1))
    const mat = pilnuj(new MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false }))
    const m = new Mesh(geo, mat)
    m.position.set(x, y, 0.4)
    swiat.add(m)
    return { m, mat, x, y }
  })

  /* podpięcia: płytki i przewody z impulsami */
  const ZNAKI = ['▤', '✉', '✆', '◷']
  const plytki = ZNAKI.map(() => {
    const geo = pilnuj(new RoundedBoxGeometry(0.84, 0.6, 0.05, 2, 0.08))
    const bok = pilnuj(new MeshStandardMaterial({ color: 0xe2dccf, roughness: 0.6, transparent: true, opacity: 0 }))
    const m = new Mesh(geo, bok)
    const liceGeo = pilnuj(new PlaneGeometry(0.84, 0.6))
    const licMat = pilnuj(new MeshBasicMaterial({ transparent: true, opacity: 0 }))
    const lice = new Mesh(liceGeo, licMat)
    lice.position.z = 0.03
    const g = new Group()
    g.add(m, lice)
    swiat.add(g)
    return { g, bok, licMat, przewod: null, impulsy: [] }
  })
  const impulsGeo = pilnuj(new SphereGeometry(0.035, 10, 10))
  const impulsMat = pilnuj(new MeshBasicMaterial({ color: 0x9fb4ff, transparent: true, opacity: 0 }))
  const przewodMat = pilnuj(new MeshBasicMaterial({ color: AKCENT, transparent: true, opacity: 0 }))

  /** Miejsca płytek zależą od kształtu kadru — na pionowym ekranie idą nad i pod stronę. */
  function ulozPlytki(pion) {
    // nad i pod stroną — z boku stoi tekst rozdziału (komputer) albo nie ma miejsca (telefon)
    const dx = pion ? 1.05 : 1.15
    const M = [[-dx, 1.62], [dx, 1.62], [-dx, -1.62], [dx, -1.62]]
    plytki.forEach((p, i) => {
      const [x, y] = M[i]
      p.g.position.set(x, y, 0.25)
      p.g.scale.setScalar(pion ? 1.1 : 0.9)
      if (p.przewod) {
        swiat.remove(p.przewod)
        p.przewod.geometry.dispose()
        p.impulsy.forEach((m) => swiat.remove(m))
      }
      // przewód: od płytki łukiem do najbliższego brzegu strony
      const cel = new Vector3(Math.sign(x) * 0.8, Math.sign(y) * 1.1, 0.05)
      const srodek = new Vector3((x + cel.x) / 2 + Math.sign(x) * 0.35, (y + cel.y) / 2, 0.6)
      const krzywa = new CatmullRomCurve3([new Vector3(x, y, 0.25), srodek, cel])
      const rura = new Mesh(new TubeGeometry(krzywa, 40, 0.012, 6, false), przewodMat)
      swiat.add(rura)
      p.przewod = rura
      p.krzywa = krzywa
      p.impulsy = [0, 1, 2].map(() => {
        const m = new Mesh(impulsGeo, impulsMat)
        swiat.add(m)
        return m
      })
    })
  }

  /* ── układ kadru ── */
  let pion = false
  let w = 1
  let h = 1
  function rozmiar(szer, wys, naTelefonie) {
    w = Math.max(1, szer)
    h = Math.max(1, wys)
    renderer.setSize(w, h, false)
    camera.aspect = w / h
    camera.updateProjectionMatrix()
    const widzH = 2 * camera.position.z * Math.tan((camera.fov * Math.PI) / 360)
    const widzW = widzH * camera.aspect
    const bylPion = pion
    pion = naTelefonie ?? camera.aspect < 1.1
    if (pion) {
      // telefon: strona w górnej połowie, tekst rozdziału pod nią
      const s = Math.min(0.62, (widzW * 0.86) / 3.4)
      swiat.scale.setScalar(s)
      swiat.position.set(0, widzH * 0.16, 0)
    } else {
      // komputer: tekst po lewej, budowa po prawej
      // środek wolnego pasa między tekstem (lewa ~45%) a linijką (prawa krawędź)
      const s = Math.min(0.8, (widzW * 0.42) / 3.4, (widzH * 0.5) / 2.2)
      swiat.scale.setScalar(s)
      swiat.position.set(widzW * 0.19, 0, 0)
    }
    if (bylPion !== pion || !plytki[0].przewod) ulozPlytki(pion)
    brudne = true
  }

  /* ── stan z przewijania ── */
  let c = 0
  let tx = 0
  let ty = 0
  let brudne = true

  function ustaw(v) {
    if (Math.abs(v - c) < 1e-4) return
    c = v
    brudne = true
  }
  function tilt(x, y) {
    tx = x
    ty = y
  }

  let slow = { dymki: null, plytki: null }
  function teksty(dymkiTxt, plytkiTxt) {
    slow = { dymki: dymkiTxt, plytki: plytkiTxt }
    const rysuj = () => {
      dymki.forEach((d, i) => {
        const tekst = dymkiTxt?.[i]
        if (!tekst) return
        d.mat.map?.dispose()
        const { tex, w: dw, h: dh } = dymek(tekst, i === 2)
        d.mat.map = tex
        d.mat.needsUpdate = true
        d.sw = dw
        d.sh = dh
        // dymek klienta od lewej, mój od prawej — pozycję liczymy od krawędzi
        d.bazaX = i === 2 ? d.x + 1.1 - dw / 2 : d.x - 0.9 + dw / 2
      })
      plytki.forEach((p, i) => {
        p.licMat.map?.dispose()
        p.licMat.map = plytka(plytkiTxt?.[i] ?? '', ZNAKI[i])
        p.licMat.needsUpdate = true
      })
      brudne = true
    }
    rysuj()
    // kroje pisma mogą dojść później — wtedy tekstury rysujemy jeszcze raz
    document.fonts?.ready?.then(() => { if (slow.dymki === dymkiTxt) rysuj() })
  }

  /* ── klatka ── */
  let rx = 0
  let ry = 0
  function klatka(czas) {
    const t = czas / 1000

    // wygładzony przechył za kursorem / telefonem
    rx += (ty * 0.1 - rx) * 0.08
    ry += (tx * 0.16 - ry) * 0.08

    // 1) rozmowa: dymki wpływają kolejno, w szkicu wsiąkają w kartkę
    const wsiak = krok(1.0, 1.55, c)
    dymki.forEach((d, i) => {
      const wej = krok(0.08 + i * 0.26, 0.3 + i * 0.26, c)
      const bx = d.bazaX ?? d.x
      d.mat.opacity = wej * (1 - wsiak)
      d.m.visible = d.mat.opacity > 0.01
      const unos = Math.sin(t * 1.1 + i * 1.7) * 0.04
      d.m.position.set(bx * (1 - wsiak), (d.y - 0.3 * (1 - wej)) * (1 - wsiak) + unos, 0.4 + 0.3 * (1 - wej))
      const s = 1 - 0.8 * wsiak
      d.m.scale.set((d.sw ?? 1) * s, (d.sh ?? 1) * s, 1)
    })

    // 2) szkic: obrysy rysują się blok po bloku, siatka kolumn pod spodem
    const rozejscie = dzwon(2.0, 3.25, c) // 3) kod: warstwy rozchodzą się w głąb
    const odlot = krok(4.3, 5.0, c) // 5) start
    bloki.forEach((b) => {
      const szkic = krok(0.95 + b.i * 0.05, 1.35 + b.i * 0.05, c)
      const bryla = krok(2.0 + b.warstwa * 0.14, 2.45 + b.warstwa * 0.14, c)
      b.obrysMat.opacity = szkic * (1 - 0.82 * bryla) * (1 - odlot)
      // w szkicu kartka ma już lekki cień wypełnienia — żeby było widać kształt, nie same kreski
      const cien = b.warstwa === 0 ? 0.08 * szkic : 0
      b.mat.opacity = Math.max(bryla, cien) * (1 - krok(4.7, 5.0, c))
      b.g.visible = b.obrysMat.opacity > 0.01 || b.mat.opacity > 0.01
      // warstwy zawsze przed kartką (inaczej chowały się w jej grubości), w kodzie rozchodzą się w głąb
      b.g.position.z = (b.warstwa ? 0.035 + b.warstwa * 0.012 : 0) + b.warstwa * 0.45 * rozejscie
      b.g.scale.setScalar(0.92 + 0.08 * szkic)
    })
    const siatka = dzwon(1.0, 2.5, c) * 0.35
    kolumny.forEach((m) => { m.opacity = siatka })

    // 4) podpięcia: płytki podjeżdżają, przewody się ukazują, impulsy biegną do strony
    const podp = krok(3.0, 3.45, c) * (1 - krok(4.15, 4.5, c))
    plytki.forEach((p, i) => {
      const wej = krok(3.0 + i * 0.1, 3.4 + i * 0.1, c) * (1 - krok(4.15, 4.5, c))
      p.bok.opacity = wej
      p.licMat.opacity = wej
      p.g.visible = wej > 0.01
      p.g.position.z = 0.25 + (1 - wej) * 1.2
      p.g.rotation.y = Math.sin(t * 0.8 + i) * 0.08
      if (p.przewod) p.przewod.visible = wej > 0.01
      p.impulsy.forEach((m, k) => {
        m.visible = podp > 0.05
        if (!m.visible || !p.krzywa) return
        m.position.copy(p.krzywa.getPoint((t * 0.45 + k / 3 + i * 0.13) % 1))
      })
    })
    przewodMat.opacity = podp * 0.85
    impulsMat.opacity = podp

    // całość: ćwierćobrót przy rozejściu warstw, odlot w kosmos na końcu
    strona.rotation.set(
      0.2 * rozejscie + rx + odlot * 0.3,
      -0.55 * rozejscie + ry + odlot * 1.1,
      odlot * 0.35,
    )
    strona.position.set(0, Math.sin(t * 0.7) * 0.03 + odlot * 1.4, -odlot * 26)

    renderer.render(scene, camera)
    brudne = false
  }

  /* ── pętla tylko na ekranie ── */
  let raf = 0
  let chodzi = false
  const petla = (czas) => {
    if (!chodzi) return
    raf = requestAnimationFrame(petla)
    if (document.hidden) return
    klatka(czas)
  }
  function start() {
    if (chodzi) return
    chodzi = true
    raf = requestAnimationFrame(petla)
  }
  function stop() {
    chodzi = false
    cancelAnimationFrame(raf)
    // ostatnia klatka dla stanu, który zmienił się w międzyczasie
    if (brudne) klatka(performance.now())
  }

  function zniszcz() {
    stop()
    plytki.forEach((p) => p.przewod?.geometry.dispose())
    dymki.forEach((d) => d.mat.map?.dispose())
    plytki.forEach((p) => p.licMat.map?.dispose())
    doSprzatania.forEach((x) => x.dispose?.())
    renderer.dispose()
    renderer.forceContextLoss()
  }

  return { rozmiar, ustaw, tilt, teksty, start, stop, zniszcz, klatka }
}

/** Czy przeglądarka w ogóle da kontekst WebGL — bez tego zostaje wersja z samym tekstem. */
export function maWebGL() {
  try {
    const c = document.createElement('canvas')
    return !!(c.getContext('webgl2') || c.getContext('webgl'))
  } catch {
    return false
  }
}
