import { useEffect, useRef, useState } from 'react'
import { useT } from '../../lib/lang-ctx'

/**
 * Węzeł trójlistny liczony i rysowany klatka po klatce na canvasie.
 * Bez bibliotek 3D — własna projekcja perspektywiczna, sortowanie
 * odcinków po głębi i tusz, który blednie w tle.
 */

const N = 460
const CAM_Z = 7
const FOV = 4

function curve(t) {
  return [
    Math.sin(t) + 2 * Math.sin(2 * t),
    Math.cos(t) - 2 * Math.cos(2 * t),
    -Math.sin(3 * t),
  ]
}

const BASE = Array.from({ length: N + 1 }, (_, i) => curve((i / N) * Math.PI * 2))

export default function Knot3D() {
  const t = useT()
  const box = useRef(null)
  const cvs = useRef(null)
  const rot = useRef({ x: -0.5, y: 0.4 })
  const vel = useRef({ x: 0, y: 0.0038 })
  const drag = useRef(null)
  const [grabbing, setGrabbing] = useState(false)
  const [touched, setTouched] = useState(false)

  useEffect(() => {
    const canvas = cvs.current
    const wrap = box.current
    if (!canvas || !wrap) return
    const ctx = canvas.getContext('2d')

    const css = getComputedStyle(document.documentElement)
    const ink = css.getPropertyValue('--ink').trim() || '#1C1B19'
    const accent = css.getPropertyValue('--accent').trim() || '#C2643A'

    let w = 0
    let h = 0
    let dpr = 1

    const resize = () => {
      const r = wrap.getBoundingClientRect()
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = Math.max(r.width, 1)
      h = Math.max(r.height, 1)
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(wrap)

    const pts = BASE.map(() => [0, 0, 0])
    const segs = Array.from({ length: N }, () => ({ i: 0, z: 0 }))

    let visible = true
    const io = new IntersectionObserver(([e]) => {
      const now = e.isIntersecting
      if (now === visible) return
      visible = now
      if (visible && raf == null) raf = requestAnimationFrame(frame)
      if (!visible && raf != null) { cancelAnimationFrame(raf); raf = null }
    }, { rootMargin: '120px' })
    io.observe(wrap)

    let raf = null
    const frame = () => {
      raf = requestAnimationFrame(frame)

      if (!drag.current) {
        rot.current.x += vel.current.x
        rot.current.y += vel.current.y
        vel.current.x *= 0.94
        vel.current.y = vel.current.y * 0.94 + 0.0038 * 0.06
        rot.current.x = Math.max(-1.2, Math.min(1.2, rot.current.x))
      }

      const sx = Math.sin(rot.current.x)
      const cx0 = Math.cos(rot.current.x)
      const sy = Math.sin(rot.current.y)
      const cy0 = Math.cos(rot.current.y)

      const size = Math.min(w, h)
      const scale = size * 0.205
      const ox = w / 2
      const oy = h / 2

      for (let i = 0; i < BASE.length; i++) {
        const [x0, y0, z0] = BASE[i]
        // obrót wokół Y, potem wokół X
        const x1 = x0 * cy0 + z0 * sy
        const z1 = -x0 * sy + z0 * cy0
        const y2 = y0 * cx0 - z1 * sx
        const z2 = y0 * sx + z1 * cx0
        const f = FOV / (z2 + CAM_Z)
        const p = pts[i]
        p[0] = ox + x1 * f * scale
        p[1] = oy + y2 * f * scale
        p[2] = z2
      }

      for (let i = 0; i < N; i++) {
        segs[i].i = i
        segs[i].z = (pts[i][2] + pts[i + 1][2]) * 0.5
      }
      segs.sort((a, b) => a.z - b.z)

      ctx.clearRect(0, 0, w, h)
      ctx.lineCap = 'round'

      for (let k = 0; k < N; k++) {
        const i = segs[k].i
        const a = pts[i]
        const b = pts[i + 1]
        const d = (segs[k].z + 1.1) / 2.2 // 0 = tył, 1 = przód
        ctx.globalAlpha = 0.13 + d * 0.87
        ctx.lineWidth = 1 + d * 2.5
        ctx.strokeStyle = d > 0.86 ? accent : ink
        ctx.beginPath()
        ctx.moveTo(a[0], a[1])
        ctx.lineTo(b[0], b[1])
        ctx.stroke()
      }
      ctx.globalAlpha = 1
    }
    raf = requestAnimationFrame(frame)

    const down = (e) => {
      drag.current = { x: e.clientX, y: e.clientY }
      setGrabbing(true)
      setTouched(true)
      canvas.setPointerCapture?.(e.pointerId)
    }
    const move = (e) => {
      if (!drag.current) return
      const dx = e.clientX - drag.current.x
      const dy = e.clientY - drag.current.y
      drag.current = { x: e.clientX, y: e.clientY }
      rot.current.y += dx * 0.0075
      rot.current.x = Math.max(-1.2, Math.min(1.2, rot.current.x + dy * 0.0065))
      vel.current = { x: dy * 0.0016, y: dx * 0.0018 }
    }
    const up = (e) => {
      drag.current = null
      setGrabbing(false)
      canvas.releasePointerCapture?.(e.pointerId)
    }

    canvas.addEventListener('pointerdown', down)
    canvas.addEventListener('pointermove', move)
    canvas.addEventListener('pointerup', up)
    canvas.addEventListener('pointercancel', up)

    return () => {
      if (raf != null) cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
      canvas.removeEventListener('pointerdown', down)
      canvas.removeEventListener('pointermove', move)
      canvas.removeEventListener('pointerup', up)
      canvas.removeEventListener('pointercancel', up)
    }
  }, [])

  return (
    <div className="knot" ref={box} data-cursor="obrot">
      <canvas ref={cvs} className={grabbing ? 'grabbing' : ''} style={{ touchAction: 'none' }} />
      {!touched && <span className="knot-hint">{t.knot.hint}</span>}
    </div>
  )
}
