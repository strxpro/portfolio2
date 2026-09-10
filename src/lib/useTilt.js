import { useEffect, useState } from 'react'
import { useMotionValue, useSpring } from 'framer-motion'

const clamp = (v, a = -1, b = 1) => Math.min(b, Math.max(a, v))

/**
 * Przechył sceny: myszą na komputerze, żyroskopem na telefonie.
 *
 * Zwraca dwie wygładzone wartości w zakresie -1..1 plus informację, czy
 * telefon faktycznie oddaje odczyty. Na iOS 13+ `deviceorientation`
 * wymaga zgody użytkownika — dlatego `ask()` odpalasz z prawdziwego
 * kliknięcia, a dopóki zgody nie ma, scena po prostu chodzi za palcem.
 */
export function useTilt({ stiffness = 60, damping = 18 } = {}) {
  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const x = useSpring(rawX, { stiffness, damping, mass: 0.5 })
  const y = useSpring(rawY, { stiffness, damping, mass: 0.5 })

  const [gyro, setGyro] = useState(false)
  const [needsAsk, setNeedsAsk] = useState(false)

  useEffect(() => {
    const onMove = (e) => {
      if (gyro) return
      rawX.set(clamp((e.clientX / window.innerWidth) * 2 - 1))
      rawY.set(clamp((e.clientY / window.innerHeight) * 2 - 1))
    }

    // punkt zerowy żyroskopu ustawiamy przy pierwszym odczycie,
    // żeby scena była wypoziomowana w tym, jak akurat trzymasz telefon
    let zeroB = null
    let zeroG = null
    const onTilt = (e) => {
      if (e.beta == null || e.gamma == null) return
      if (zeroB === null) {
        zeroB = e.beta
        zeroG = e.gamma
        setGyro(true)
      }
      rawX.set(clamp((e.gamma - zeroG) / 26))
      rawY.set(clamp((e.beta - zeroB) / 26))
    }

    window.addEventListener('pointermove', onMove, { passive: true })

    // o zgodę pytamy tylko tam, gdzie jest czego pytać: dotykowy ekran
    // z prawdziwym czujnikiem. Na biurku żaden przycisk się nie pokazuje.
    const handheld = window.matchMedia('(pointer: coarse)').matches
    if (handheld && typeof DeviceOrientationEvent !== 'undefined') {
      if (typeof DeviceOrientationEvent.requestPermission === 'function') setNeedsAsk(true)
      else window.addEventListener('deviceorientation', onTilt)
    }

    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('deviceorientation', onTilt)
    }
  }, [rawX, rawY, gyro])

  const ask = async () => {
    try {
      const ok = await DeviceOrientationEvent.requestPermission()
      if (ok !== 'granted') return
      setNeedsAsk(false)
      window.addEventListener('deviceorientation', function first(e) {
        window.removeEventListener('deviceorientation', first)
        window.addEventListener('deviceorientation', (ev) => {
          if (ev.beta == null || ev.gamma == null) return
          rawX.set(clamp((ev.gamma - e.gamma) / 26))
          rawY.set(clamp((ev.beta - e.beta) / 26))
        })
        setGyro(true)
      })
    } catch {
      /* użytkownik odmówił — zostaje sterowanie palcem */
    }
  }

  return { x, y, gyro, needsAsk, ask }
}
