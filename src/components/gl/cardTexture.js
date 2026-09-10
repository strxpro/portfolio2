import * as THREE from 'three'

/**
 * Tekstura karty rysowana na płótnie 2D.
 *
 * Shader potrzebuje obrazka, a okładki prac są komponentami SVG —
 * nie da się ich podać wprost. Zamiast dokładać do projektu dziewięć
 * plików PNG, rysujemy kadr w kodzie: kolor pracy, jej adres, nazwa,
 * rok i kilka bloków układu. Nic się nie pobiera, a każda praca ma
 * własny obraz, na którym pikselizacja i rozjazd kanałów mają co
 * niszczyć.
 *
 * Układ jest **wyliczany z identyfikatora**, nie losowany — inaczej
 * karta wyglądałaby inaczej po każdym odświeżeniu.
 */

/** Powtarzalny generator: z tekstu robi ciąg liczb 0–1. */
function ziarno(txt) {
  let h = 2166136261
  for (let i = 0; i < txt.length; i++) {
    h ^= txt.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return () => {
    h += 0x6d2b79f5
    let t = h
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Ciemniejszy wariant koloru — na kreski i bloki. */
function ciemniej(hex, ile) {
  const c = new THREE.Color(hex || '#E4DACB')
  c.multiplyScalar(1 - ile)
  return `#${c.getHexString()}`
}

const W = 768
const H = 480

export function makeCardTexture({ id, tint, name, host, year }) {
  const c = document.createElement('canvas')
  c.width = W
  c.height = H
  const g = c.getContext('2d')
  const los = ziarno(id || name || 'x')

  // tło w kolorze pracy
  g.fillStyle = tint || '#E4DACB'
  g.fillRect(0, 0, W, H)

  // delikatna siatka — daje pikselizacji na czym pracować
  g.strokeStyle = ciemniej(tint, 0.08)
  g.lineWidth = 1
  for (let x = 48; x < W; x += 48) {
    g.beginPath(); g.moveTo(x, 0); g.lineTo(x, H); g.stroke()
  }
  for (let y = 48; y < H; y += 48) {
    g.beginPath(); g.moveTo(0, y); g.lineTo(W, y); g.stroke()
  }

  // bloki układu: pasy tekstu i kafle, jak na prawdziwej stronie
  const ink = ciemniej(tint, 0.62)
  let y = 118
  for (let i = 0; i < 5 && y < H - 120; i++) {
    const r = los()
    if (r < 0.55) {
      const n = 2 + Math.floor(los() * 3)
      for (let k = 0; k < n; k++) {
        g.fillStyle = ink
        g.globalAlpha = 0.14
        g.fillRect(56, y, (W - 200) * (0.9 - k * 0.16), 9)
        y += 20
      }
      y += 16
    } else {
      const ile = 2 + Math.floor(los() * 2)
      const szer = (W - 112 - (ile - 1) * 16) / ile
      g.globalAlpha = 0.1
      for (let k = 0; k < ile; k++) {
        g.fillStyle = ink
        g.fillRect(56 + k * (szer + 16), y, szer, 74)
      }
      y += 96
    }
  }
  g.globalAlpha = 1

  // nagłówek: adres u góry
  g.fillStyle = ciemniej(tint, 0.55)
  g.font = '500 18px "JetBrains Mono", ui-monospace, monospace'
  g.fillText((host || '').toUpperCase(), 56, 62)

  // stopka: nazwa i rok
  g.fillStyle = ciemniej(tint, 0.82)
  g.font = '800 46px Archivo, Helvetica, Arial, sans-serif'
  g.fillText(name || '', 56, H - 54)

  g.fillStyle = ciemniej(tint, 0.5)
  g.font = '500 18px "JetBrains Mono", ui-monospace, monospace'
  const rok = String(year || '')
  g.fillText(rok, W - 56 - g.measureText(rok).width, H - 56)

  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  // karta bywa oglądana pod kątem — bez tego brzegi się strzępią
  tex.anisotropy = 4
  tex.needsUpdate = true
  return tex
}
