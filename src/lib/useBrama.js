import { useEffect, useState } from 'react'

/**
 * Brama sekcji: otwarta kliknięciem albo samym przewijaniem.
 *
 * Postęp liczymy **zwykłym nasłuchem przewijania**, a nie wartością
 * ruchu z Framera. To celowe: wartości ruchu odświeżają się w rytmie
 * klatek, więc gdy klatki stoją (karta w tle, wstrzymany
 * `requestAnimationFrame`), brama nigdy by się nie otworzyła i sekcja
 * zostałaby zamknięta na głucho.
 *
 * To ta sama zasada, która wcześniej uratowała nawigację i przełączanie
 * prac: **animacja może być ozdobą kroku, nigdy jego warunkiem.**
 *
 * @param {object} ref   sekcja, której postęp mierzymy
 * @param {number} prog  ułamek przewinięcia sekcji, po którym otwiera się sama
 */
export function useBrama(ref, prog = 0.1) {
  const [otwarte, setOtwarte] = useState(false)

  useEffect(() => {
    if (otwarte) return undefined
    const el = ref.current
    if (!el) return undefined

    const sprawdz = () => {
      const b = el.getBoundingClientRect()
      const dlugosc = b.height - window.innerHeight
      if (dlugosc <= 0) return
      // ile sekcji już przejechało pod górną krawędzią
      const ile = -b.top / dlugosc
      if (ile > prog) setOtwarte(true)
    }

    sprawdz()
    window.addEventListener('scroll', sprawdz, { passive: true })

    /**
     * Drugie źródło: zdarzenie samego Lenisa.
     *
     * Natywne `scroll` lecą pod nim wybiórczo — zmierzone wcześniej
     * w tym projekcie: jedno zdarzenie na dwa przewinięcia. Dla bramy,
     * która ma się otworzyć **na pewno**, to za mało.
     */
    let odepnij = null
    const podepnij = () => {
      const l = window.__lenis
      if (!l || odepnij) return
      l.on('scroll', sprawdz)
      odepnij = () => l.off('scroll', sprawdz)
    }
    podepnij()
    const czekaj = setInterval(() => { podepnij(); if (odepnij) clearInterval(czekaj) }, 200)

    return () => {
      clearInterval(czekaj)
      odepnij?.()
      window.removeEventListener('scroll', sprawdz)
    }
  }, [ref, prog, otwarte])

  return [otwarte, setOtwarte]
}
