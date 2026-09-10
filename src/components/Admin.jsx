import { useEffect, useRef, useState } from 'react'
import { blank, clearLocal, readLocal, writeLocal } from '../lib/projects'
import { work as BUILT_IN } from '../data/site'
import Cover from './Cover'

/**
 * Prosty panel do prac.
 *
 * Strona jest statyczna — nie ma serwera, który mógłby cokolwiek
 * zapisać. Panel działa więc tak: zmiany lecą do pamięci przeglądarki
 * (widzisz je natychmiast, tylko u siebie), a przyciskiem pobierasz
 * gotowy `projects.json`. Wrzucasz ten plik do `public/data/` i od tego
 * momentu widzą go wszyscy.
 *
 * Wchodzi się pod adresem z `#admin` na końcu. Nic tu nie jest ukryte
 * przed nikim — to nie jest zabezpieczenie, tylko wygoda.
 */

const F = [
  ['name', 'Nazwa'],
  ['host', 'Adres na kaflu'],
  ['url', 'Pełny link'],
  ['year', 'Rok'],
  ['kind', 'Podtytuł (branża, miasto)'],
]

export default function Admin({ onClose }) {
  const [list, setList] = useState(() => readLocal() ?? BUILT_IN.map((w) => ({ ...w })))
  const [pick, setPick] = useState(0)
  const [said, setSaid] = useState('')

  /**
   * Czy jest coś niezapisanego.
   *
   * Panel trzyma zmiany w pamięci Reacta, dopóki nie klikniesz „Zapisz",
   * więc bez tego znacznika łatwo wyjść i stracić robotę. Pierwszy
   * przebieg pomijamy — wtedy stan dopiero się ustawia.
   */
  const [brudne, setBrudne] = useState(false)
  const pierwszy = useRef(true)
  useEffect(() => {
    if (pierwszy.current) { pierwszy.current = false; return }
    setBrudne(true)
  }, [list])

  /**
   * Bez zapisanych zmian panel startuje od pliku, nie od listy z kodu —
   * inaczej opisy i punkty byłyby puste i wyglądałoby to na zgubione.
   */
  useEffect(() => {
    if (readLocal()) return
    let alive = true
    fetch('/data/projects.json', { cache: 'no-cache' })
      .then((r) => (r.ok ? r.json() : null))
      .then((json) => {
        if (alive && Array.isArray(json) && json.length) setList(json)
      })
      .catch(() => {})
    return () => { alive = false }
  }, [])

  useEffect(() => {
    if (!said) return undefined
    const id = setTimeout(() => setSaid(''), 2400)
    return () => clearTimeout(id)
  }, [said])

  const item = list[pick]

  const edit = (key, value) =>
    setList((s) => s.map((p, i) => (i === pick ? { ...p, [key]: value } : p)))

  const move = (dir) =>
    setList((s) => {
      const to = pick + dir
      if (to < 0 || to >= s.length) return s
      const copy = s.slice()
      const [row] = copy.splice(pick, 1)
      copy.splice(to, 0, row)
      setPick(to)
      return copy
    })

  const add = () => {
    setList((s) => [...s, blank()])
    setPick(list.length)
  }

  const drop = () => {
    if (list.length <= 1) return
    setList((s) => s.filter((_, i) => i !== pick))
    setPick((p) => Math.max(0, p - 1))
  }

  const save = () => {
    const ok = writeLocal(list)
    if (ok) setBrudne(false)
    setSaid(ok ? 'Zapisane w tej przeglądarce' : 'Nie udało się zapisać')
  }

  const download = () => {
    const blob = new Blob([JSON.stringify(list, null, 2)], { type: 'application/json' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'projects.json'
    a.click()
    URL.revokeObjectURL(a.href)
    setSaid('Wrzuć ten plik do public/data/')
  }

  const reset = () => {
    clearLocal()
    setList(BUILT_IN.map((w) => ({ ...w })))
    setPick(0)
    setSaid('Wróciłem do wersji z pliku')
  }

  return (
    <div className="adm">
      <header className="adm-bar">
        <b>Prace</b>
        <span>{list.length} pozycji</span>
        {brudne && <span className="adm-brudne">niezapisane zmiany</span>}
        <div className="adm-acts">
          <button onClick={save}>Zapisz</button>
          <button onClick={download}>Pobierz projects.json</button>
          <button onClick={reset}>Przywróć</button>
          <button className="adm-x" onClick={onClose}>Zamknij</button>
        </div>
      </header>

      {said && <p className="adm-said">{said}</p>}

      <div className="adm-body">
        <ol className="adm-list">
          {list.map((p, i) => (
            <li key={p.id + i}>
              <button className={i === pick ? 'on' : ''} onClick={() => setPick(i)}>
                <i style={{ background: p.tint }} />
                <span>{p.name || '—'}</span>
                <em>{p.year}</em>
              </button>
            </li>
          ))}
          <li>
            <button className="adm-add" onClick={add}>+ Dodaj projekt</button>
          </li>
        </ol>

        {item && (
          <div className="adm-form">
            <div className="adm-row">
              <button onClick={() => move(-1)} disabled={pick === 0}>↑ wyżej</button>
              <button onClick={() => move(1)} disabled={pick === list.length - 1}>↓ niżej</button>
              <button className="adm-del" onClick={drop} disabled={list.length <= 1}>Usuń</button>
            </div>

            {F.map(([key, label]) => (
              <label key={key}>
                <span>{label}</span>
                <input value={item[key] ?? ''} onChange={(e) => edit(key, e.target.value)} />
              </label>
            ))}

            <label>
              <span>Kolor kafla</span>
              <span className="adm-tint">
                <input type="color" value={item.tint || '#E4DACB'} onChange={(e) => edit('tint', e.target.value)} />
                <input value={item.tint || ''} onChange={(e) => edit('tint', e.target.value)} />
              </span>
            </label>

            <label className="adm-check">
              <input
                type="checkbox"
                checked={item.embed !== false}
                onChange={(e) => edit('embed', e.target.checked)}
              />
              <span>Pokazuj żywą stronę w podglądzie (odznacz, jeśli blokuje osadzanie)</span>
            </label>

            <label>
              <span>Opis — dwa, trzy zdania</span>
              <textarea rows={4} value={item.lead ?? ''} onChange={(e) => edit('lead', e.target.value)} />
            </label>

            <label>
              <span>Co zawiera — jedna rzecz na wiersz</span>
              <textarea
                rows={5}
                value={(item.points ?? []).join('\n')}
                onChange={(e) => edit('points', e.target.value.split('\n').filter(Boolean))}
              />
            </label>

            <label>
              <span>Technologie — po przecinku</span>
              <input
                value={(item.stack ?? []).join(', ')}
                onChange={(e) => edit('stack', e.target.value.split(',').map((x) => x.trim()).filter(Boolean))}
              />
            </label>

            <p className="adm-note">
              Zmiany widać po „Zapisz" tylko w tej przeglądarce. Żeby zobaczyli je wszyscy,
              pobierz plik i wrzuć go do <code>public/data/projects.json</code>.
            </p>
          </div>
        )}

        {/**
          * Podgląd na żywo.
          *
          * Kafel jest tym samym komponentem, co w tunelu, więc nazwa,
          * adres i kolor lecą prosto z pól obok — widać efekt w trakcie
          * pisania, a nie dopiero po zamknięciu panelu i przewinięciu
          * strony do prac. `key` na kolorze wymusza przerysowanie okładki,
          * bo rysunek jest liczony przy montażu.
          */}
        {item && (
          <aside className="adm-podglad">
            <p className="label">Tak to wygląda</p>
            <div className="adm-kafel">
              <Cover
                key={`${item.id}-${item.tint}`}
                id={item.id}
                tint={item.tint}
                name={item.name}
                host={item.host}
                still
              />
            </div>
            <div className="adm-chipy">
              {(item.stack ?? []).map((x) => <span className="chip" key={x}>{x}</span>)}
            </div>
            <p className="adm-lead">{item.lead || '—'}</p>
            <ul className="adm-punkty">
              {(item.points ?? []).slice(0, 4).map((x) => <li key={x}>{x}</li>)}
            </ul>
          </aside>
        )}
      </div>
    </div>
  )
}
