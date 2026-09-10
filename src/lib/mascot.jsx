import { createContext, useContext, useCallback, useMemo, useRef, useState, useEffect } from 'react'
import { useInView } from 'framer-motion'

const Ctx = createContext(null)

export function MascotProvider({ children }) {
  // stos podpowiedzi — wygrywa ta o najwyższym priorytecie, przy remisie ostatnia
  const [stack, setStack] = useState([])
  const [takeover, setTakeover] = useState(false)
  const seq = useRef(0)

  const push = useCallback((entry) => {
    seq.current += 1
    const item = { ...entry, _seq: seq.current }
    setStack((s) => [...s.filter((e) => e.id !== entry.id), item])
  }, [])

  const pull = useCallback((id) => {
    setStack((s) => (s.some((e) => e.id === id) ? s.filter((e) => e.id !== id) : s))
  }, [])

  const active = useMemo(() => {
    if (!stack.length) return null
    return [...stack]
      .sort((a, b) => (a.priority ?? 0) - (b.priority ?? 0) || a._seq - b._seq)
      .at(-1)
  }, [stack])

  const value = useMemo(
    () => ({ active, push, pull, takeover, setTakeover }),
    [active, push, pull, takeover]
  )

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useMascot() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useMascot poza MascotProvider')
  return ctx
}

/**
 * Podpinasz zwrócony ref do sekcji. Kiedy sekcja wjeżdża w kadr,
 * Piksel przeskakuje w podany róg i mówi swoją kwestię.
 */
export function useGuide({ id, text, corner = 'br', mood = 'spokoj', point = null, priority = 0, amount = 0.3 }) {
  const ref = useRef(null)
  const inView = useInView(ref, { amount })
  const { push, pull } = useMascot()

  useEffect(() => {
    if (inView) push({ id, text, corner, mood, point, priority })
    else pull(id)
  }, [inView, id, text, corner, mood, point, priority, push, pull])

  useEffect(() => () => pull(id), [id, pull])

  return ref
}
