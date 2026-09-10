import { createContext, useContext } from 'react'

/**
 * Kontekst języka i hooki siedzą w osobnym pliku bez komponentów.
 *
 * Fast Refresh Vite'a przeładowuje moduł na gorąco tylko wtedy, gdy plik
 * eksportuje same komponenty. Kiedy `LangProvider` mieszkał w jednym pliku
 * z `useT`/`useLang`, każda zmiana w słowniku wywalała moduł w całości
 * i sypała w konsolę „useT poza LangProvider" — mimo że kod był poprawny.
 */
export const LangCtx = createContext(null)
export const LANG_KEY = 'strx-lang'

/** Zwraca słownik aktualnego języka. */
export function useT() {
  const ctx = useContext(LangCtx)
  if (!ctx) throw new Error('useT poza LangProvider')
  return ctx.t
}

/** Pełny kontekst: kod języka, przełącznik i lista języków. */
export function useLang() {
  const ctx = useContext(LangCtx)
  if (!ctx) throw new Error('useLang poza LangProvider')
  return ctx
}
