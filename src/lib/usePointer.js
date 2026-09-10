import { useEffect } from 'react'
import { useMotionValue, useSpring } from 'framer-motion'

/**
 * Znormalizowana pozycja „spojrzenia" (-1..1) z wygładzeniem sprężyną.
 *
 * Na komputerze to kursor. Na telefonie kursora nie ma, więc to samo
 * czyta się z **przechyłu urządzenia** — dzięki temu każdy efekt, który
 * do tej pory żył tylko pod myszą (rysunki wokół hero, wizytówka,
 * gwiazdy w tle), zaczyna reagować na to, jak trzymasz telefon.
 *
 * iOS wymaga zgody na czujnik. Nie pytamy o nią tutaj — o to prosi
 * guzik w sekcji z pracami, a zgoda obowiązuje dla całej strony, więc
 * po jej udzieleniu ten hook po prostu zaczyna dostawać zdarzenia.
 */
export function usePointer(stiffness = 90, damping = 18) {
  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const x = useSpring(rawX, { stiffness, damping, mass: 0.4 })
  const y = useSpring(rawY, { stiffness, damping, mass: 0.4 })

  useEffect(() => {
    const onMove = (e) => {
      rawX.set((e.clientX / window.innerWidth) * 2 - 1)
      rawY.set((e.clientY / window.innerHeight) * 2 - 1)
    }

    /**
     * `gamma` to przechył w bok (-90..90), `beta` w przód i w tył.
     * Zakres jest zawężony do ±26°, bo telefon trzyma się w wąskim
     * wachlarzu — przy pełnej skali ruch byłby ledwie zauważalny.
     * `beta` liczymy od 45°, czyli od naturalnego kąta patrzenia.
     */
    const onTilt = (e) => {
      if (e.gamma === null || e.beta === null) return
      rawX.set(Math.max(-1, Math.min(1, e.gamma / 26)))
      rawY.set(Math.max(-1, Math.min(1, (e.beta - 45) / 26)))
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('deviceorientation', onTilt, { passive: true })
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('deviceorientation', onTilt)
    }
  }, [rawX, rawY])

  return { x, y }
}
