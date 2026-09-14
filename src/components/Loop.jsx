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
        const bylo = l.animatedScroll
        const zostalo = l.targetScroll - l.animatedScroll
        l.animatedScroll = to
        l.targetScroll = to + zostalo
        /**
         * Lenis prowadzi płynny dojazd osobnym obiektem animacji, który ma
         * własny punkt startu, cel i bieżącą wartość. Bez przesunięcia
         * również ich w następnej klatce Lenis wracał do starych
         * współrzędnych — pozycja skakała tam i z powrotem przez szew,
         * a wszystko liczone z przewijania dostawało fałszywy skok.
         */
        const a = l.animate
        if (a && a.isRunning) {
          const d = to - bylo
          a.from += d
          a.to += d
          a.value += d
        }
      }
      window.scrollTo(0, to)
      /* W zdarzeniu leci **o ile** cofnęliśmy widok: pasek postępu i sprężyny
         sekcji przeskakują razem z nim zamiast dojeżdżać. Tło gwiazd go nie
         potrzebuje — liczy się z pozycji okresowo, z okresem równym pętli. */
      window.dispatchEvent(new CustomEvent('strx:loop', { detail: { o } }))
    }

    const check = () => {
      if (!szew) measure()
      if (dlug > 0) splacDlug()
      if (!szew || pos() < szew) return
      /**
       * Za szwem, ale w drodze **w górę**, nie domykamy. Tak jest tuż po
       * przeskoku z góry strony w echo (`naKolko`): stoimy kilka pikseli
       * za szwem i jedziemy w stronę finału. Domknięcie odbiłoby nas
       * z powrotem na górę i przeskoki szłyby w kółko.
       */
      const l = window.__lenis
      if (l && l.targetScroll < l.animatedScroll - 0.5) return
      cofnij(szew)
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

    /**
     * Kółko w górę przy samym początku strony.
     *
     * Lenis obcina cel przewijania na zerze, więc zanim pozycja dojechała
     * do góry, kolejne obroty kółka po prostu ginęły (zmierzone: 2044 px
     * z 4080). Przeskakujemy więc w echo, gdzie kadr jest ten sam, a nad
     * nim jest miejsce na dalszy ruch.
     *
     * Przeskoczyć wolno tylko wtedy, gdy echo pokrywa cały kadr, czyli
     * w pierwszych `zapasEcha()` pikselach — głębiej pod echem jest już
     * pusty zapas na rozpęd. Cel przewijania wyprzedza jednak pozycję
     * o kilkaset pikseli i dochodzi do zera wcześniej. To, co Lenis w tym
     * czasie obetnie, zapisujemy jako **dług** i oddajemy zaraz po
     * przeskoku — dzięki temu żaden obrót kółka nie przepada.
     *
     * Nasłuch idzie w fazie przechwytywania, żeby policzyć stan celu
     * przed Lenisem.
     */
    let dlug = 0
    const zapasEcha = () => {
      const e = document.querySelector('.echo')
      if (!e || !szew) return 0
      return Math.max(0, e.getBoundingClientRect().bottom + window.scrollY - szew - window.innerHeight - 4)
    }
    const splacDlug = () => {
      const l = window.__lenis
      if (!l || dlug <= 0 || !szew || pos() > zapasEcha()) return
      const ile = dlug
      dlug = 0
      cofnij(-szew)
      // te same parametry, co Lenis dla kółka — bez nich przy `programmatic: false`
      // nie ma czasu ani krzywej i dług spłacał się skokiem w jednej klatce
      const { lerp, duration, easing } = l.options
      l.scrollTo(l.targetScroll - ile, { programmatic: false, lerp, duration, easing })
    }
    const naKolko = (e) => {
      const l = window.__lenis
      if (!szew) measure()
      if (!szew) return
      if (!l) { if (e.deltaY < 0) doTylu(); return }
      if (e.deltaY >= 0) { dlug = 0; return }
      const cel = l.targetScroll + e.deltaY * (l.options?.wheelMultiplier ?? 1)
      if (cel >= 0) return
      if (pos() <= zapasEcha()) { dlug = 0; cofnij(-szew); return }
      // Lenis zaraz obetnie ten obrót do zera — zapamiętaj, ile zabierze
      dlug += -cel - Math.max(0, -l.targetScroll)
    }

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
    window.addEventListener('wheel', naKolko, { passive: true, capture: true })
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchmove', onTouchMove, { passive: true })
    window.addEventListener('touchend', onTouchEnd, { passive: true })

    return () => {
      clearInterval(late)
      off?.()
      watch.disconnect()
      window.removeEventListener('scroll', check)
      window.removeEventListener('wheel', naKolko, { capture: true })
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('touchend', onTouchEnd)
    }
  }, [])

  return null
}
