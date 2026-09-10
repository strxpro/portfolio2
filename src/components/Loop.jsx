import { useEffect } from 'react'

/**
 * Strona bez końca — jeden ciągły dokument.
 *
 * Za finałem stoi **echo pierwszej sekcji**: ten sam hero bez
 * identyfikatora i bez maskotki, a pod nim doklejony górny róg sekcji
 * „o mnie" (`.echo` + `.echo-lip` w `App.jsx`). Kiedy przewijanie
 * dojedzie do górnej krawędzi echa, kadr jest **co do piksela taki sam
 * jak na samej górze strony** — i w tej jednej chwili cofamy pozycję
 * dokładnie o długość pętli.
 *
 * Nic nie mruga, bo nic się nie zmienia: ani układ, ani to, co widać.
 * Zmienia się tylko liczba, której nikt nie widzi.
 *
 * ── Czego tu celowo NIE ma ──────────────────────────────────
 *
 * Był tu wcześniej próg z oporem: za finałem ruch robił się ciężki,
 * a widok wracał, jeśli nie napierało się dalej. Zostało to usunięte,
 * bo realizował go `transform` na finale i echu — czyli dokładnie
 * **przesunięcie układu w chwili przejścia** — a do tego zmieniał
 * odczuwaną prędkość przewijania. Pętla ma wyglądać jak świadomy efekt,
 * nie jak szarpnięcie; jedno wykluczało drugie.
 */
export default function Loop() {
  useEffect(() => {
    /**
     * Pozycja szwu leży w pamięci i **nie jest mierzona co klatkę**.
     * `getBoundingClientRect` przy każdym ruchu wymusza przeliczenie
     * układu całej strony. `ResizeObserver` tylko unieważnia liczbę,
     * a przeliczenie dzieje się przy najbliższym ruchu — pomiar
     * wywołany prosto z obserwatora zapętlał się.
     */
    let szew = 0
    const measure = () => {
      const e = document.querySelector('.echo')
      szew = e ? Math.round(e.getBoundingClientRect().top + window.scrollY) : 0
    }
    const stale = () => { szew = 0 }

    /**
     * Gdzie naprawdę jesteśmy — **przycięte do zakresu dokumentu**.
     *
     * Lenis prowadzi własny licznik i przy rozpędzie potrafi wyjechać
     * daleko poza koniec strony (zmierzone: 995 px za maksimum). Pętla
     * cofa o stałą długość, więc z takiego licznika lądowała w środku
     * strony zamiast na górze.
     */
    const pos = () => {
      const p = window.__lenis ? window.__lenis.animatedScroll : window.scrollY
      const max = document.documentElement.scrollHeight - window.innerHeight
      return Math.max(0, Math.min(p, max))
    }

    /**
     * Cofnięcie pozycji **bez zrywania rozpędu**.
     *
     * Lenis trzyma `animatedScroll` (gdzie jest) i `targetScroll` (dokąd
     * leci). `scrollTo` ustawiłoby obie na nowo i płynny dojazd stanąłby
     * w miejscu — czuć to jako zacięcie. Zapamiętujemy więc sam dystans,
     * jaki został do dojechania, i odtwarzamy go w nowym miejscu.
     * Dzięki temu prędkość przewijania za szwem jest dokładnie taka jak
     * przed nim.
     */
    const cofnij = (o) => {
      const to = pos() - o
      const l = window.__lenis
      if (l) {
        const zostalo = l.targetScroll - l.animatedScroll
        l.animatedScroll = to
        l.targetScroll = to + zostalo
      }
      window.scrollTo(0, to)
      /* W zdarzeniu leci **o ile** cofnęliśmy widok: pasek postępu ma
         przeskoczyć razem z nim zamiast dojechać, a tło gwiazd odejmuje
         tę wartość i w ogóle nie zauważa szwu. */
      window.dispatchEvent(new CustomEvent('strx:loop', { detail: { o } }))
    }

    const check = () => {
      if (!szew) measure()
      if (szew && pos() >= szew) cofnij(szew)
    }

    /**
     * Pod Lenisem natywne `scroll` lecą wybiórczo — zmierzone: jedno
     * zdarzenie na dwa przewinięcia. Pierwszym źródłem jest więc
     * zdarzenie samego Lenisa (raz na klatkę, tylko w ruchu), a natywne
     * zostaje dla przypadków bez Lenisa: dotyk, wyłączone animacje.
     */
    let off = null
    const bind = () => {
      const l = window.__lenis
      if (!l || off) return
      l.on('scroll', check)
      off = () => l.off('scroll', check)
    }
    bind()
    const late = setInterval(() => { bind(); if (off) clearInterval(late) }, 200)

    /**
     * Pętla w drugą stronę: z góry strony na jej koniec.
     *
     * Na zerze nie ma już zapasu przewijania, więc przeglądarka nie
     * wyśle kolejnego `scroll` i sam nasłuch pozycji nic nie da. Trzeba
     * złapać **intencję**: kółko, gest touchpada albo palec ciągnięty
     * w dół. Lądujemy kilka pikseli przed szwem — postawieni dokładnie
     * na nim wpadaliśmy od razu w warunek domknięcia i odbijało nas
     * z powrotem, co z zewnątrz wyglądało jak teleport.
     */
    const doTylu = () => {
      if (!szew) measure()
      if (szew && pos() <= 2) cofnij(-(szew - 4))
    }

    const onWheel = (e) => { if (e.deltaY < 0) doTylu() }

    /**
     * Dotyk. `touchmove` mówi tylko, gdzie jest palec, więc kierunek
     * liczymy sami: palec **w dół** to przewijanie strony w górę.
     * Próg 8 px odsiewa drgnięcia przy dotknięciu ekranu.
     */
    let palec = null
    const onTouchStart = (e) => { palec = e.touches[0]?.clientY ?? null }
    const onTouchMove = (e) => {
      if (palec === null) return
      const y = e.touches[0]?.clientY ?? palec
      if (y - palec > 8) { doTylu(); palec = y }
      else if (y < palec) palec = y
    }
    const onTouchEnd = () => { palec = null }

    measure()
    const watch = new ResizeObserver(stale)
    watch.observe(document.body)
    window.addEventListener('scroll', check, { passive: true })
    window.addEventListener('wheel', onWheel, { passive: true })
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchmove', onTouchMove, { passive: true })
    window.addEventListener('touchend', onTouchEnd, { passive: true })

    return () => {
      clearInterval(late)
      off?.()
      watch.disconnect()
      window.removeEventListener('scroll', check)
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('touchend', onTouchEnd)
    }
  }, [])

  return null
}
