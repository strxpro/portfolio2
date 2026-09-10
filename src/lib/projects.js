import { useEffect, useState } from 'react'
import { work as BUILT_IN } from '../data/site'

const KEY = 'strx-projects'
const FILE = '/data/projects.json'

/**
 * Skąd biorą się projekty.
 *
 * Trzy źródła, w tej kolejności:
 *  1. `localStorage` — to, co właśnie zmieniłeś w panelu. Widzisz efekt
 *     od razu, bez przebudowy i bez wgrywania czegokolwiek.
 *  2. `public/data/projects.json` — plik wgrany na serwer. To jest
 *     wersja, którą widzą wszyscy odwiedzający.
 *  3. Lista wbudowana w kod — awaryjna, gdyby pliku nie było.
 *
 * Strona jest statyczna, więc panel niczego nie zapisuje na serwerze:
 * zapisuje w przeglądarce i daje gotowy plik do pobrania. Wrzucasz go
 * do `public/data/` i zmiana jest publiczna.
 */

export function readLocal() {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return null
    const list = JSON.parse(raw)
    return Array.isArray(list) && list.length ? list : null
  } catch {
    return null
  }
}

export function writeLocal(list) {
  try {
    localStorage.setItem(KEY, JSON.stringify(list))
    window.dispatchEvent(new Event('strx:projects'))
    return true
  } catch {
    return false
  }
}

export function clearLocal() {
  try {
    localStorage.removeItem(KEY)
    window.dispatchEvent(new Event('strx:projects'))
  } catch {
    /* prywatne okno — trudno */
  }
}

/** Puste miejsce na nowy projekt — z sensownymi wartościami startowymi. */
export const blank = () => ({
  id: `p${Date.now().toString(36)}`,
  name: 'Nowy projekt',
  year: String(new Date().getFullYear()),
  url: 'https://',
  host: '',
  tint: '#E4DACB',
  embed: true,
  stack: [],
  kind: '',
  lead: '',
  points: [],
})

export function useProjects() {
  const [list, setList] = useState(() => readLocal() ?? BUILT_IN)

  useEffect(() => {
    let alive = true

    const pull = () => {
      const local = readLocal()
      if (local) {
        setList(local)
        return true
      }
      return false
    }

    if (!pull()) {
      fetch(FILE, { cache: 'no-cache' })
        .then((r) => (r.ok ? r.json() : null))
        .then((json) => {
          if (alive && Array.isArray(json) && json.length) setList(json)
        })
        .catch(() => {
          /* pliku nie ma — zostaje lista z kodu */
        })
    }

    window.addEventListener('strx:projects', pull)
    return () => {
      alive = false
      window.removeEventListener('strx:projects', pull)
    }
  }, [])

  return list
}

/**
 * Opis projektu.
 *
 * Dziewięć pierwszych wdrożeń ma tłumaczenia w słowniku (`t.items`).
 * Wszystko, co dodasz w panelu, nosi opis przy sobie — dlatego najpierw
 * pytamy słownik, a jak go tam nie ma, bierzemy pola z samego projektu.
 * Bez tego dodanie nowej pozycji wywracało sekcję prac.
 */
export function textOf(t, item) {
  const dict = t?.items?.[item.id]
  if (dict) return dict
  return {
    kind: item.kind || item.host || '',
    lead: item.lead || '',
    points: Array.isArray(item.points) ? item.points : [],
  }
}
