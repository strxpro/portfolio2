import { useEffect } from 'react'

/**
 * Koniec strony, który stawia opór — i pętla bez skoku.
 *
 * Za finałem stoi **echo pierwszej sekcji**: ten sam hero, tylko bez
 * identyfikatora i bez maskotki (`<Hero ghost />` w `.echo`). Kiedy
 * przewijanie dojedzie do jego górnej krawędzi, kadr jest co do piksela
 * taki sam jak na samej górze strony — i w tej jednej chwili cofamy
 * pozycję dokładnie o długość pętli. Nic nie mruga, bo nic się nie
 * zmienia; zmienia się tylko liczba, której nikt nie widzi.
 *
 * Przed echem jest jednak próg. Strona nie wpada w kolejny obieg dlatego,
 * że ktoś za mocno machnął kółkiem:
 *
 *  · **opór** — za finałem ruch robi się ciężki, przechodzi go ułamek;
 *  · **puszczenie** — jeśli przestaniesz, widok wraca na finał;
 *  · **upór** — jeśli mimo wszystko przewijasz dalej, próg puszcza
 *    i strona leci od nowa.
 */

/**
 * Ile z ruchu widać w strefie oporu (reszta idzie „w gumę").
 *
 * Nisko, bo to ten ułamek decyduje, czy sekcja kontaktu zostaje
 * w kadrze. Przy 0.4 i pełnym progu odjeżdżała o 168 px; przy 0.2
 * to 84 px, czyli praktycznie stoi.
 */
const OPOR = 0.2
/**
 * Ile pikseli za finałem trzeba przejechać, żeby próg puścił.
 *
 * Musi być wyraźnie więcej niż jeden gest. Przy 200 px trzy obroty
 * kółka przebijały próg od razu i oporu nie dało się w ogóle poczuć
 * (zmierzone: 342 px na jedno pociągnięcie).
 */
const PROG = 300
/** po tylu ms bez ruchu uznajemy, że użytkownik puścił */
const CISZA = 220

export default function Loop() {
  useEffect(() => {
    /**
     * Dwa punkty na osi strony.
     *
     * `szew` to góra echa — miejsce, w którym kadr powtarza początek.
     * `stop` to pozycja, na której finał widać w całości; stąd zaczyna
     * się opór.
     *
     * Obie liczby leżą w pamięci i nie są mierzone co klatkę:
     * `getBoundingClientRect` przy każdym ruchu wymusza przeliczenie
     * układu całej strony. `ResizeObserver` tylko je unieważnia,
     * a przeliczenie dzieje się przy najbliższym ruchu — pomiar
     * wywołany prosto z obserwatora zapętlał się.
     */
    let szew = 0
    let stop = 0
    let echo = null
    const measure = () => {
      echo = document.querySelector('.echo')
      szew = echo ? Math.round(echo.getBoundingClientRect().top + window.scrollY) : 0
      stop = Math.max(0, szew - window.innerHeight)
    }
    const stale = () => { szew = 0 }

    /**
     * Gdzie naprawdę jesteśmy — **przycięte do zakresu dokumentu**.
     *
     * Lenis prowadzi własny licznik i przy rozpędzie potrafi wyjechać
     * daleko poza koniec strony (zmierzone: 995 px za maksimum).
     * Pętla cofa o stałą długość, więc z takiego licznika lądowała
     * w środku strony zamiast na górze — i to właśnie wyglądało jak
     * „nie działa nieskończone przewijanie".
     */
    const pos = () => {
      const p = window.__lenis ? window.__lenis.animatedScroll : window.scrollY
      const max = document.documentElement.scrollHeight - window.innerHeight
      return Math.max(0, Math.min(p, max))
    }

    /**
     * Cofnięcie pozycji bez zrywania rozpędu.
     *
     * Lenis trzyma `animatedScroll` (gdzie jest) i `targetScroll` (dokąd
     * leci). `scrollTo` ustawiłoby obie na nowo i płynny dojazd stanąłby
     * w miejscu — czuć to jako zacięcie. Zapamiętujemy więc sam dystans,
     * jaki został do dojechania, i odtwarzamy go w nowym miejscu.
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
      /* W zdarzeniu leci **o ile** cofnęliśmy widok. Pasek postępu ma
         dzięki temu przeskoczyć razem z nim zamiast dojechać, a tło
         gwiazd może odjąć tę wartość i w ogóle nie zauważyć szwu. */
      window.dispatchEvent(new CustomEvent('strx:loop', { detail: { o } }))
    }

    /**
     * Opór robimy **przesunięciem echa**, a nie walką o pozycję.
     *
     * Pierwsza wersja wymuszała `targetScroll` Lenisa, żeby ruch był
     * cięższy, i to się nie broni z dwóch powodów: cała paczka zdarzeń
     * z kółka trafia do Lenisa, zanim nasz kod ją zobaczy (zmierzone:
     * `targetScroll` skakał od razu o 800 px), a przewijanie i tak
     * przechodziło natywnie i pozycja rosła mimo przypięcia.
     *
     * Tutaj strona przewija się normalnie, ale echo jedzie razem z nią
     * w dół, więc **widać** tylko ułamek ruchu. To czysty `transform`,
     * bez dotykania przewijania — i dlatego działa niezależnie od tego,
     * kto akurat rządzi pozycją.
     */
    let ciagniecie = 0
    const ciagnij = (px) => {
      if (px === ciagniecie) return
      ciagniecie = px
      /* Na korzeniu, nie na samym echu: opór ma trzymać **także finał**.
         Inaczej sekcja kontaktu odjeżdża w trakcie napierania i opór
         stawia się już pustce pod nią. */
      document.documentElement.style.setProperty('--drag', `${px}px`)
    }

    /** próg puszczony: do końca obiegu nie stawiamy już oporu */
    let wolne = false
    let cisza

    /**
     * Kredyt za nieudane próby.
     *
     * Bez niego progu praktycznie nie dało się przebić: po każdym
     * puszczeniu widok wracał na finał, dystans liczył się od zera
     * i trzeba było przejechać całe `PROG` jednym ciągiem. Kółko sypie
     * porcjami z przerwami dłuższymi niż okno ciszy, więc strona po
     * prostu odbijała w kółko — i tak to wyglądało: „nieskończone
     * przewijanie nie działa".
     *
     * Teraz każda nieudana próba zostawia część przejechanego dystansu.
     * Druga i trzecia dokładają się do pierwszej, czyli upór popłaca —
     * dokładnie tak, jak człowiek to rozumie.
     */
    let kredyt = 0
    let osiagniete = 0

    /**
     * Puszczenie: widok wraca na finał.
     *
     * Dwie rzeczy, bez których to nie działa.
     *
     * Po pierwsze — pozycję czytamy **prosto z dokumentu**, nie z Lenisa.
     * Timer odpala się po ciszy, a w tym czasie widok mógł pojechać
     * zupełnie gdzie indziej: kliknięciem w menu, klawiszem, skokiem.
     * Licznik Lenisa bywa wtedy o krok w tyle i strona sama wracała na
     * finał chwilę po tym, jak użytkownik z niego wyszedł.
     *
     * Po drugie — napór **opada, a nie znika**. Zerowanie przy każdej
     * przerwie sprawiało, że progu nie dało się przebić w ogóle: kółko
     * sypie porcjami z przerwami dłuższymi niż okno ciszy, więc licznik
     * startował od nowa przy każdym ruchu i strona odbijała w kółko.
     * Zostawiamy 60%, dzięki czemu druga i trzecia próba dokładają się
     * do pierwszej — dokładnie tak, jak człowiek to rozumie.
     */
    const wroc = () => {
      const p = window.scrollY
      if (p < stop - 4 || p >= szew) { ciagnij(0); return }
      // nieudana próba zostawia ślad; kredyt nie może zjeść całego progu
      kredyt = Math.min(PROG * 0.6, kredyt + osiagniete * 0.6)
      osiagniete = 0
      window.__lenis?.scrollTo(stop, { duration: 0.5 })
    }

    const check = () => {
      if (!szew) measure()
      if (!szew) return

      const p = pos()

      // domknięcie pętli: kadr jest identyczny jak na górze strony
      if (p >= szew) { ciagnij(0); cofnij(szew); wolne = false; kredyt = 0; osiagniete = 0; return }

      if (p < stop) {
        // wróciliśmy nad finał — próg staje z powrotem, od zera
        if (ciagniecie || wolne) { ciagnij(0); wolne = false }
        kredyt = 0
        osiagniete = 0
        clearTimeout(cisza)
        return
      }

      const za = p - stop
      if (za > osiagniete) osiagniete = za

      if (!wolne && za + kredyt >= PROG) {
        /* Próg puścił. Echo wraca na swoje miejsce płynnie, bo szew ma
           być co do piksela zgodny — a do niego zostało jeszcze całe
           okno widoku, więc jest na to czas. */
        wolne = true
        clearTimeout(cisza)
        document.documentElement.classList.add('drag-wraca')
        ciagnij(0)
        setTimeout(() => document.documentElement.classList.remove('drag-wraca'), 380)
        return
      }

      if (wolne) return

      ciagnij(za * (1 - OPOR))
      clearTimeout(cisza)
      cisza = setTimeout(wroc, CISZA)
    }

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
     * W górę nie ma zapasu przewijania, więc początek łapiemy z kółka.
     *
     * Lądujemy **kilka pikseli przed szwem**, nie na nim. Postawieni
     * dokładnie na szwie wpadaliśmy od razu w warunek domknięcia pętli
     * (`p >= szew`) i odbijało nas z powrotem na górę — z zewnątrz
     * wyglądało to jak teleport, zamiast pokazać ostatnią sekcję.
     */
    const onWheel = (ev) => {
      if (ev.deltaY >= 0 || pos() > 2) return
      if (!szew) measure()
      if (szew) cofnij(-(szew - 4))
    }

    measure()
    const watch = new ResizeObserver(stale)
    watch.observe(document.body)
    window.addEventListener('scroll', check, { passive: true })
    window.addEventListener('wheel', onWheel, { passive: true })
    return () => {
      clearInterval(late)
      clearTimeout(cisza)
      off?.()
      watch.disconnect()
      window.removeEventListener('scroll', check)
      window.removeEventListener('wheel', onWheel)
    }
  }, [])

  return null
}
