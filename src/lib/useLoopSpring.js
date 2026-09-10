import { useEffect } from 'react'
import { useSpring } from 'framer-motion'
import { SPRING } from './motion'

/**
 * Sprężyna przewijania, która nie zauważa szwu pętli.
 *
 * Strona jest zapętlona: po przekroczeniu szwu pozycja cofa się o
 * kilkanaście tysięcy pikseli naraz. Kadr w tej chwili wygląda tak samo,
 * więc dla oka nic się nie dzieje — ale **każda sprężyna podpięta pod
 * scroll dostaje wtedy nową wartość odległą o cały swój zakres**
 * i grzecznie do niej dojeżdża. Efekt: po przeskoku wszystko naraz
 * przelatuje przez swoje animacje, jakby strona wjeżdżała od dołu.
 *
 * Nie da się tego rozwiązać raz, w jednym miejscu, bo takich sprężyn
 * jest kilkanaście — płachty sekcji, kamera tunelu, rysunki hero,
 * zdjęcia, finał. Stąd wspólny hak.
 *
 * Sztuczka polega na tym, **kiedy** przestawić wartość. W chwili
 * zdarzenia źródło jeszcze nic nie wie: pozycja dokumentu już się
 * zmieniła, ale `useScroll` przeliczy się dopiero w następnej klatce.
 * Dlatego zdarzenie tylko uzbraja flagę, a skok wykonujemy przy
 * najbliższej zmianie źródła — wtedy jest już co przeskoczyć.
 */
export function useLoopSpring(source, config = SPRING.scroll) {
  const out = useSpring(source, config)

  useEffect(() => {
    let uzbrojone = false
    const szew = () => { uzbrojone = true }
    window.addEventListener('strx:loop', szew)

    const stop = source.on('change', (v) => {
      if (!uzbrojone) return
      uzbrojone = false
      // bez dojazdu: wartość ma być na miejscu w tej samej klatce
      out.jump(v)
    })

    return () => {
      window.removeEventListener('strx:loop', szew)
      stop()
    }
  }, [source, out])

  return out
}
