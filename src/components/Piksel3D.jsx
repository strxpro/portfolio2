import { useEffect, useRef } from 'react'

/**
 * PIKSEL 3D — maskotka liczona w przestrzeni i rysowana na canvasie.
 * Bez bibliotek 3D: własna projekcja perspektywiczna, sortowanie kul
 * po głębi i jeden sprite kuli rysowany wielokrotnie.
 *
 * Oczy i usta siedzą na powierzchni kuli, więc przy obrocie naprawdę
 * po niej wędrują. Ręka celuje w podany element na ekranie — stąd
 * „pokazywanie palcem".
 */

const CAM_Z = 6.2
const FOV = 3.6

/* ── sprite kuli: jedna tekstura, rysowana wielokrotnie ── */
function sphereSprite(px, light, base, edge, rim) {
  const c = document.createElement('canvas')
  c.width = px
  c.height = px
  const g = c.getContext('2d')
  const r = px / 2
  const grad = g.createRadialGradient(r * 0.66, r * 0.58, r * 0.05, r, r, r)
  grad.addColorStop(0, light)
  grad.addColorStop(0.55, base)
  grad.addColorStop(1, edge)
  g.beginPath()
  g.arc(r, r, r * 0.96, 0, Math.PI * 2)
  g.fillStyle = grad
  g.fill()
  if (rim) {
    g.lineWidth = px * 0.025
    g.strokeStyle = rim
    g.stroke()
  }
  return c
}

const rotY = (p, s, c) => [p[0] * c + p[2] * s, p[1], -p[0] * s + p[2] * c]
const rotX = (p, s, c) => [p[0], p[1] * c - p[2] * s, p[1] * s + p[2] * c]
const norm = (v) => {
  const l = Math.hypot(v[0], v[1], v[2]) || 1
  return [v[0] / l, v[1] / l, v[2] / l]
}
const clamp = (v, a, b) => (v < a ? a : v > b ? b : v)

/* punkt na powierzchni kuli */
function onSphere(yaw, pitch, r) {
  const cp = Math.cos(pitch)
  return [Math.sin(yaw) * cp * r, Math.sin(pitch) * r, Math.cos(yaw) * cp * r]
}

/* usta jako łańcuszek małych kulek na powierzchni: [yaw, pitch, skala] */
function mouthOf(mood, t) {
  const A = [-0.27, -0.135, 0, 0.135, 0.27]
  switch (mood) {
    case 'mowi': {
      const k = 1 + Math.sin(t / 85) * 0.45
      return [-0.13, 0, 0.13].map((a) => [a, -0.42, 1.6 * k])
    }
    case 'zdziwiony': {
      const out = []
      for (let i = 0; i < 7; i++) {
        const ang = (i / 7) * Math.PI * 2
        out.push([Math.cos(ang) * 0.12, -0.42 + Math.sin(ang) * 0.12, 0.85])
      }
      return out
    }
    case 'ciagnie':
      return A.map((a) => [a, -0.41, 1.2])
    case 'drzemka':
      return A.map((a) => [a, -0.40 - Math.abs(a) * 0.24, 0.9])
    default: // spokoj — kąciki wyżej niż środek
      return A.map((a) => [a, -0.47 + Math.abs(a) * 0.30, 1])
  }
}

export default function Piksel3D({
  mood = 'spokoj',
  pointSel = null,
  asleep = false,
  pose = 'auto',
  size = 96,
  idleSpin = true,
}) {
  const wrap = useRef(null)
  const cvs = useRef(null)
  const state = useRef({ mood, pointSel, pose, asleep })
  state.current.mood = mood
  state.current.pointSel = pointSel
  state.current.asleep = asleep
  state.current.pose = pose

  useEffect(() => {
    const canvas = cvs.current
    const box = wrap.current
    if (!canvas || !box) return
    const ctx = canvas.getContext('2d')

    const css = getComputedStyle(document.documentElement)
    const ink = css.getPropertyValue('--ink').trim() || '#1C1B19'
    const accent = css.getPropertyValue('--accent').trim() || '#C2643A'

    // Piksel jest teraz dużo większy, więc sprite 160 px robił się miękki.
    // 320 px kosztuje jednorazowo przy montażu, a rysunek zostaje ostry.
    const SPR = 320
    const BODY = sphereSprite(SPR, '#FFFFFF', '#FCF9F5', '#DCD5C7', 'rgba(28,27,25,0.32)')
    const LIMB = sphereSprite(SPR, '#FBF7F1', '#F0EADF', '#CBC3B4', 'rgba(28,27,25,0.30)')
    const DARK = sphereSprite(SPR, '#514C45', ink, '#0D0C0B', null)
    const HOT = sphereSprite(SPR, '#E7AB8C', accent, '#8C4325', null)

    let w = 0
    let h = 0
    let dpr = 1
    const resize = () => {
      const r = box.getBoundingClientRect()
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = Math.max(r.width, 1)
      h = Math.max(r.height, 1)
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.imageSmoothingEnabled = true
      ctx.imageSmoothingQuality = 'high'
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(box)

    const mouse = { x: 0, y: 0 }
    const onMove = (e) => { mouse.x = e.clientX; mouse.y = e.clientY }
    window.addEventListener('pointermove', onMove, { passive: true })

    let yaw = 0
    let pitch = 0
    let arm = 0
    let targetEl = null
    let lastSel = null

    // ── drobne odruchy: podskok, przechylenie, obrót, machnięcie
    const ACTS = ['hop', 'lean', 'spin', 'wave']
    let act = null
    let actEnd = 0
    let nextAct = 1800

    const beads = []
    const put = (p, r, sprite, a = 1) => beads.push({ p, r, sprite, a })

    // rysujemy tylko wtedy, kiedy maskotka jest w kadrze
    let visible = true
    const io = new IntersectionObserver(([e]) => {
      const now = e.isIntersecting
      if (now === visible) return
      visible = now
      if (visible && raf == null) raf = requestAnimationFrame(frame)
      if (!visible && raf != null) { cancelAnimationFrame(raf); raf = null }
    }, { rootMargin: '120px' })
    io.observe(box)

    /**
     * Pomiary układu są throttlowane i to jest tu kluczowe.
     *
     * Wcześniej każda klatka wołała `getBoundingClientRect()` dwa razy —
     * raz na maskotce, raz na wskazywanym elemencie. Każde takie
     * odczytanie wymusza na przeglądarce przeliczenie układu CAŁEJ
     * strony, a że reszta serwisu wisi na transformach sterowanych
     * scrollem, robiło się z tego zacinanie dokładnie wtedy, gdy Piksel
     * wchodził na ekran. Ręka nie potrzebuje dokładności co klatkę,
     * więc mierzymy dziesięć razy na sekundę i tyle.
     */
    let myX = 0
    let myY = 0
    let aimAtX = 0
    let aimAtY = 0
    let hasAim = false
    let measuredAt = -1e9

    let raf = null
    const frame = (t) => {
      raf = requestAnimationFrame(frame)
      const { mood: md, pointSel: sel, pose: ps, asleep: off } = state.current
      if (off) return

      if (sel !== lastSel) {
        lastSel = sel
        targetEl = sel ? document.querySelector(sel) : null
        measuredAt = -1e9
      }

      if (t - measuredAt > 100) {
        measuredAt = t
        const rect = box.getBoundingClientRect()
        myX = rect.left + rect.width / 2
        myY = rect.top + rect.height / 2
        hasAim = false
        if (targetEl) {
          const tr = targetEl.getBoundingClientRect()
          if (tr.bottom > 0 && tr.top < window.innerHeight) {
            aimAtX = tr.left + tr.width / 2
            aimAtY = tr.top + tr.height / 2
            hasAim = true
          }
        }
      }

      let aimX = mouse.x - myX
      let aimY = mouse.y - myY
      let wantArm = 0

      if (hasAim) {
        aimX = aimAtX - myX
        aimY = aimAtY - myY
        wantArm = 1
      }

      const len = Math.hypot(aimX, aimY) || 1
      const dirX = aimX / len
      const dirY = aimY / len

      // wybór kolejnego odruchu
      if (!act && t > nextAct) {
        act = ACTS[(Math.random() * ACTS.length) | 0]
        actEnd = t + (act === 'spin' ? 1500 : act === 'wave' ? 1800 : 950)
      }
      if (act && t > actEnd) {
        act = null
        nextAct = t + 3000 + Math.random() * 3600
      }
      const au = act ? 1 - (actEnd - t) / (act === 'spin' ? 1500 : act === 'wave' ? 1800 : 950) : 0

      // gesty jadą po wygładzonej krzywej zamiast po surowym sinusie —
      // start i koniec są miękkie, więc nie ma szarpnięcia na brzegach
      const soft = au <= 0 ? 0 : au >= 1 ? 0 : Math.sin(Math.PI * au) ** 1.6
      const hop = act === 'hop' ? soft * 0.42 : 0
      const squash = act === 'hop' ? 1 - Math.sin(Math.PI * au * 2) * 0.07 : 1
      const roll = act === 'lean' ? soft * 0.24 : 0
      const spin = act === 'spin' ? (au * au * (3 - 2 * au)) * Math.PI * 2 : 0
      const wave = act === 'wave' ? soft : 0

      const reachF = Math.min(len / 280, 1)
      const wantYaw = clamp(dirX * reachF * 1.15, -0.9, 0.9)
      const wantPitch = clamp(dirY * reachF * 0.6, -0.45, 0.5)

      yaw += (wantYaw - yaw) * 0.07
      pitch += (wantPitch - pitch) * 0.07
      arm += (wantArm - arm) * 0.085
      const bob = Math.sin(t / 900) * 0.05 + hop

      if (idleSpin && !targetEl) yaw += Math.sin(t / 2600) * 0.0015

      const sy = Math.sin(yaw + spin)
      const cyy = Math.cos(yaw + spin)
      const sp = Math.sin(pitch)
      const cp = Math.cos(pitch)
      const R = (p) => rotX(rotY(p, sy, cyy), sp, cp)
      const face = (v) => clamp((v + 0.22) / 0.45, 0, 1)

      beads.length = 0
      put([0, bob, 0], 1, BODY)

      // oczy
      const blink = t % 4600 < 120 ? 0.2 : 1
      for (const s of [-1, 1]) {
        const e = R(onSphere(s * 0.44, 0.15, 1))
        put([e[0], e[1] + bob, e[2] + 0.03], 0.163 * blink, DARK, face(e[2]))
      }

      // usta
      for (const [a, b, k] of mouthOf(md, t)) {
        const m = R(onSphere(a, b, 1))
        put([m[0], m[1] + bob, m[2] + 0.03], 0.068 * k, DARK, face(m[2]))
      }

      // antenka
      const s1 = R([0.12, 1.08, 0])
      const s2 = R([0.20, 1.27, 0])
      const s3 = R([0.29, 1.48, 0])
      put([s1[0], s1[1] + bob, s1[2]], 0.055, DARK)
      put([s2[0], s2[1] + bob, s2[2]], 0.05, DARK)
      put([s3[0], s3[1] + bob, s3[2]], 0.15 + Math.sin(t / 620) * 0.022, HOT)

      // nogi
      for (const s of [-1, 1]) {
        const f = R([s * 0.44, -1.0, 0.2])
        put([f[0], f[1] + bob - 0.14, f[2]], 0.2, LIMB)
      }

      // ręce
      const held = ps === 'gora'
      const armDir = norm([dirX, -dirY * 0.7, 0.5])
      const side = dirX >= 0 ? 1 : -1
      const waveDir = norm([0.55, 0.85, 0.35])

      for (const s of [-1, 1]) {
        const sh = R([s * 0.9, 0.05, 0.06])
        const waving = s === 1 ? wave : 0
        const pointing = held ? 0 : Math.max(s === side ? arm : 0, waving)
        const rest = held ? norm([s * 0.3, 1, 0.12]) : norm([s * 0.62, -0.8, 0.22])
        const goal = waving > 0.02
          ? [waveDir[0], waveDir[1] + Math.sin(t / 90) * 0.35, waveDir[2]]
          : armDir
        const d = [
          rest[0] + (goal[0] - rest[0]) * pointing,
          rest[1] + (goal[1] - rest[1]) * pointing,
          rest[2] + (goal[2] - rest[2]) * pointing,
        ]
        const reach = (held ? 1.05 : 0.62) + pointing * 0.72

        for (let k = 1; k <= 3; k++) {
          const q = k / 3
          put(
            [sh[0] + d[0] * reach * q, sh[1] + bob + d[1] * reach * q, sh[2] + d[2] * reach * q],
            0.135 - q * 0.028,
            LIMB
          )
        }
        const hx = sh[0] + d[0] * (reach + 0.24)
        const hy = sh[1] + bob + d[1] * (reach + 0.24)
        const hz = sh[2] + d[2] * (reach + 0.24)
        put([hx, hy, hz], 0.185, LIMB)

        if (pointing > 0.12) {
          for (let k = 1; k <= 2; k++) {
            put(
              [hx + d[0] * 0.16 * k, hy + d[1] * 0.16 * k, hz + d[2] * 0.16 * k],
              0.085 - k * 0.016,
              LIMB,
              pointing
            )
          }
        }
      }

      // rysowanie
      // 0.34 zamiast 0.275: Piksel wypełnia kadr, zamiast pływać w nim
      // jako mała kulka — przy większym ramach zaczyna obcinać ręce
      const scale = Math.min(w, h) * 0.34
      const cx = w / 2
      const cy = h * 0.47
      ctx.clearRect(0, 0, w, h)

      ctx.save()
      ctx.globalAlpha = 0.12
      ctx.fillStyle = ink
      ctx.beginPath()
      ctx.ellipse(cx, cy + 1.3 * (FOV / CAM_Z) * scale, scale * 0.6, scale * 0.12, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()

      const sz = Math.sin(roll)
      const cz = Math.cos(roll)

      beads.sort((a, b) => a.p[2] - b.p[2])
      for (const bd of beads) {
        if (bd.a <= 0.02) continue
        const bx = bd.p[0] * cz - bd.p[1] * squash * sz
        const by = bd.p[0] * sz + bd.p[1] * squash * cz
        const f = FOV / (bd.p[2] + CAM_Z)
        const px = cx + bx * f * scale
        const py = cy - by * f * scale
        const rr = bd.r * f * scale
        if (rr < 0.4) continue
        ctx.globalAlpha = bd.a * (0.74 + 0.26 * clamp((bd.p[2] + 1.4) / 2.6, 0, 1))
        ctx.drawImage(bd.sprite, px - rr, py - rr, rr * 2, rr * 2)
      }
      ctx.globalAlpha = 1
    }
    raf = requestAnimationFrame(frame)

    return () => {
      if (raf != null) cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
      window.removeEventListener('pointermove', onMove)
    }
  }, [idleSpin])

  const boxStyle = size ? { width: size, height: size * 1.2 } : { width: '100%', height: '100%' }

  return (
    <div className="pk3" ref={wrap} style={boxStyle}>
      <canvas ref={cvs} />
    </div>
  )
}
