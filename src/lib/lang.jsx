import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { dict, langs } from '../data/i18n'
import { LANG_KEY, LangCtx } from './lang-ctx'

function detect() {
  try {
    const saved = localStorage.getItem(LANG_KEY)
    if (saved && dict[saved]) return saved
  } catch {
    /* prywatne okno — trudno */
  }
  const nav = (navigator.language || 'pl').slice(0, 2).toLowerCase()
  return dict[nav] ? nav : 'pl'
}

export function LangProvider({ children }) {
  const [code, setCode] = useState(detect)
  const anchor = useRef(null)

  /**
   * Przełączenie języka bez przeskoku strony.
   *
   * Polski, angielski i włoski mają różnej długości zdania, więc po zmianie
   * słownika sekcje puchną albo się kurczą i ta sama pozycja scrolla ląduje
   * w zupełnie innym miejscu treści. Dlatego przed zmianą zapamiętuję
   * sekcję, którą właśnie czytasz, i offset w jej wnętrzu — a po
   * przeliczeniu układu wracam dokładnie w to samo miejsce.
   */
  const change = useCallback((next) => {
    const here = window.scrollY
    let best = null
    for (const el of document.querySelectorAll('main section[id], #kontakt')) {
      const y = el.getBoundingClientRect().top + here
      if (y <= here + 4 && (!best || y > best.y)) best = { el, y }
    }
    anchor.current = best ? { el: best.el, delta: here - best.y } : null
    setCode(next)
  }, [])

  useLayoutEffect(() => {
    const a = anchor.current
    if (!a) return undefined
    anchor.current = null

    // dwie klatki: pierwsza domyka układ, druga łapie ustaloną już wysokość
    let second
    const first = requestAnimationFrame(() => {
      second = requestAnimationFrame(() => {
        if (!a.el.isConnected) return
        const y = Math.max(0, a.el.getBoundingClientRect().top + window.scrollY + a.delta)
        if (window.__lenis) window.__lenis.scrollTo(y, { immediate: true })
        else window.scrollTo(0, y)
      })
    })
    return () => {
      cancelAnimationFrame(first)
      cancelAnimationFrame(second)
    }
  }, [code])

  useEffect(() => {
    document.documentElement.lang = code
    try {
      localStorage.setItem(LANG_KEY, code)
    } catch {
      /* nie szkodzi */
    }
  }, [code])

  const value = useMemo(
    () => ({ code, setCode: change, t: dict[code] ?? dict.pl, langs }),
    [code, change]
  )
  return <LangCtx.Provider value={value}>{children}</LangCtx.Provider>
}
