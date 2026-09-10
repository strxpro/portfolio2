import { useEffect, useRef } from 'react'

/**
 * Pikselowe tło: siatka kwadracików, która przyciąga się do kursora
 * i rozjeżdża pasami, kiedy strona szybko jedzie.
 *
 * Klucz do lekkości: **spokojna siatka rysuje się raz**, do bufora poza
 * ekranem, a co klatkę idzie tylko jedno `drawImage` plus garść bloków
 * w promieniu kursora. Wcześniej leciało ~1700 `fillRect` na klatkę,
 * teraz jest ich najwyżej kilkadziesiąt.
 *
 * Kiedy nic się nie dzieje — kursor stoi poza sekcją i scroll nie
 * przyspiesza — pętla nie rysuje w ogóle, tylko czeka. Sekcja poza
 * kadrem wstrzymuje ją całkowicie.
 */
export default function Pixels({ gap = 34, className = '', tone = 'ink' }) {
  const ref = useRef(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return undefined
    const ctx = canvas.getContext('2d', { alpha: true })

    // bufor ze spokojną siatką — przerysowywany tylko przy zmianie rozmiaru
    const still = document.createElement('canvas')
    const sctx = still.getContext('2d')

    let w = 0
    let h = 0
    let dpr = 1

    const bake = () => {
      const box = canvas.getBoundingClientRect()
      w = Math.max(1, Math.round(box.width))
      h = Math.max(1, Math.round(box.height))
      dpr = Math.min(window.devicePixelRatio || 1, 2)

      canvas.width = still.width = Math.round(w * dpr)
      canvas.height = still.height = Math.round(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      sctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      sctx.clearRect(0, 0, w, h)
      sctx.fillStyle = tone === 'light' ? 'rgba(255,255,255,0.22)' : 'rgba(23,24,26,0.14)'
      for (let r = 0; r * gap < h + gap; r++) {
        const y = r * gap
        const shift = r % 2 ? gap / 2 : 0
        for (let c = 0; c * gap < w + gap; c++) sctx.fillRect(c * gap + shift, y, 2, 2)
      }
    }
    bake()

    const ro = new ResizeObserver(bake)
    ro.observe(canvas)

    const R = 170 // zasięg magnesu
    let dirty = true
    const mouse = { x: -9999, y: -9999, on: false }
    const onMove = (e) => {
      const b = canvas.getBoundingClientRect()
      const x = e.clientX - b.left
      const y = e.clientY - b.top
      mouse.on = x > -R && y > -R && x < w + R && y < h + R
      mouse.x = x
      mouse.y = y
      dirty = true
    }

    let lastY = window.scrollY
    let speed = 0
    const onScroll = () => {
      const y = window.scrollY
      const d = Math.abs(y - lastY)
      lastY = y
      if (d > 2) {
        speed = Math.min(1, d / 90)
        dirty = true
      }
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('scroll', onScroll, { passive: true })

    let live = true
    const io = new IntersectionObserver(([e]) => { live = e.isIntersecting }, { rootMargin: '100px' })
    io.observe(canvas)

    let raf

    const frame = () => {
      raf = requestAnimationFrame(frame)
      if (!live) return
      if (speed > 0.01) { speed *= 0.88; dirty = true } else speed = 0
      if (!dirty) return
      dirty = mouse.on || speed > 0.01

      ctx.clearRect(0, 0, w, h)
      ctx.drawImage(still, 0, 0, w, h)

      // pasy rozjeżdżające się przy szybkim scrollu
      if (speed > 0.12) {
        ctx.fillStyle = tone === 'light'
          ? `rgba(255,255,255,${(0.4 + speed * 0.4).toFixed(3)})`
          : `rgba(27,77,245,${(0.18 + speed * 0.35).toFixed(3)})`
        for (let y = ((lastY * 0.4) % gap) - gap; y < h; y += gap * 5) {
          const slip = (Math.sin(y * 0.05) * speed * 26) | 0
          for (let x = slip; x < w; x += gap * 3) ctx.fillRect(x, y, 3, 2)
        }
      }

      // magnes: liczymy TYLKO bloki w kwadracie wokół kursora
      if (mouse.on) {
        const c0 = Math.max(0, Math.floor((mouse.x - R) / gap))
        const c1 = Math.ceil((mouse.x + R) / gap)
        const r0 = Math.max(0, Math.floor((mouse.y - R) / gap))
        const r1 = Math.ceil((mouse.y + R) / gap)

        for (let r = r0; r <= r1; r++) {
          const by = r * gap
          if (by > h + gap) break
          const shift = r % 2 ? gap / 2 : 0
          for (let c = c0; c <= c1; c++) {
            const bx = c * gap + shift
            if (bx > w + gap) break
            const dx = bx - mouse.x
            const dy = by - mouse.y
            const d = Math.hypot(dx, dy)
            if (d > R) continue

            const k = 1 - d / R
            const pull = k * k * 24
            const px = bx - (dx / (d || 1)) * pull
            const py = by - (dy / (d || 1)) * pull
            const s = 2 + k * 5
            ctx.fillStyle = tone === 'light'
              ? `rgba(255,255,255,${(0.22 + k * 0.6).toFixed(3)})`
              : `rgba(23,24,26,${(0.14 + k * 0.46).toFixed(3)})`
            ctx.fillRect(px, py, s, s)
          }
        }
      }
    }
    raf = requestAnimationFrame(frame)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('scroll', onScroll)
    }
  }, [gap, tone])

  return <canvas className={`pixels ${className}`} ref={ref} aria-hidden="true" />
}
