import { useEffect, useState } from 'react'

/**
 * Czy jesteśmy na wąskim ekranie.
 *
 * Potrzebne tam, gdzie telefon dostaje **inny komponent**, a nie inne
 * style — samym CSS-em nie da się podmienić całej mechaniki sekcji.
 * Pierwszy odczyt robimy synchronicznie, przy montażu, żeby nie mrugnąć
 * najpierw wersją dla dużego ekranu.
 */
export function useNarrow(px = 760) {
  const [waski, setWaski] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(`(max-width: ${px}px)`).matches,
  )

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${px}px)`)
    const zmiana = (e) => setWaski(e.matches)
    setWaski(mq.matches)
    mq.addEventListener('change', zmiana)
    return () => mq.removeEventListener('change', zmiana)
  }, [px])

  return waski
}
