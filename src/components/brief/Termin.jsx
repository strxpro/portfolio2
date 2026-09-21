import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { dostepnosc } from '../../data/site'
import { useT } from '../../lib/lang-ctx'
import { EASE } from '../../lib/motion'
import {
  GODZINY, MINUTY, dzienTygodnia, dzienWolny, formatGodziny, kluczDnia,
  najblizsze, siatkaMiesiaca, terazWStrefie, wolny,
} from '../../lib/terminy'

/**
 * Krok „Na kiedy się umawiamy?”.
 *
 * Dwie drogi: „na razie chcę się dogadać” (od razu dalej) albo umówienie
 * rozmowy — wtedy rozwija się kalendarz. Na górze trzy najbliższe wolne
 * terminy do wyboru jednym dotknięciem, pod spodem miesiąc, a po wybraniu
 * dnia godziny i minuty (tylko :00 i :30).
 *
 * Wartość: { typ: 'dogadac' } albo { typ: 'termin', dzien: 'RRRR-MM-DD', godzina: 'GG:MM' }.
 */
export default function Termin({ value, onChange, onDogadac }) {
  const t = useT()
  const { months: MIESIACE, dow: DNI } = t.booking
  const teraz = useMemo(() => terazWStrefie(), [])
  const [kalendarz, setKalendarz] = useState(value?.typ === 'termin')
  const [kursor, setKursor] = useState({ r: teraz.r, m: teraz.m })

  const wybrany = value?.typ === 'termin' ? value : null
  const [wr, wm, wd] = wybrany?.dzien ? wybrany.dzien.split('-').map(Number) : []
  const [wg, wmin] = wybrany?.godzina ? wybrany.godzina.split(':').map(Number) : []

  const propozycje = useMemo(() => najblizsze(3), [])
  const siatka = useMemo(() => siatkaMiesiaca(kursor.r, kursor.m), [kursor])

  // ile miesięcy wolno przewinąć: od bieżącego do tego, w którym kończy się okno
  const koniec = new Date(Date.UTC(teraz.r, teraz.m - 1, teraz.d + dostepnosc.naprzod))
  const indeks = (r, m) => r * 12 + m
  const mozeWstecz = indeks(kursor.r, kursor.m) > indeks(teraz.r, teraz.m)
  const mozeDalej = indeks(kursor.r, kursor.m) < indeks(koniec.getUTCFullYear(), koniec.getUTCMonth() + 1)
  const przesun = (n) => {
    const d = new Date(Date.UTC(kursor.r, kursor.m - 1 + n, 1))
    setKursor({ r: d.getUTCFullYear(), m: d.getUTCMonth() + 1 })
  }

  const ustaw = (r, m, d, g, min) =>
    onChange({ typ: 'termin', dzien: kluczDnia(r, m, d), godzina: g == null ? '' : formatGodziny(g, min) })

  const wybierzDzien = (r, m, d) => {
    // zostaw godzinę, jeśli w nowym dniu też jest wolna
    if (wg != null && wolny(r, m, d, wg, wmin)) return ustaw(r, m, d, wg, wmin)
    onChange({ typ: 'termin', dzien: kluczDnia(r, m, d), godzina: '' })
  }

  const wybierzGodzine = (g) => {
    const min = wmin != null && wolny(wr, wm, wd, g, wmin) ? wmin : MINUTY.find((x) => wolny(wr, wm, wd, g, x))
    ustaw(wr, wm, wd, g, min)
  }

  const nazwaDnia = (p) => {
    const jutro = new Date(Date.UTC(teraz.r, teraz.m - 1, teraz.d + 1))
    if (p.dzien === kluczDnia(teraz.r, teraz.m, teraz.d)) return t.brief.dzis
    if (p.dzien === kluczDnia(jutro.getUTCFullYear(), jutro.getUTCMonth() + 1, jutro.getUTCDate())) return t.brief.jutro
    return `${DNI[dzienTygodnia(p.r, p.m, p.d) - 1]} ${p.d}.${String(p.m).padStart(2, '0')}`
  }

  return (
    <div className={`tr ${kalendarz ? 'otwarty' : ''}`}>
      <div className="tr-opcje">
        <motion.button
          type="button"
          className={`tr-opcja ${value?.typ === 'dogadac' ? 'on' : ''}`}
          onClick={() => { setKalendarz(false); onChange({ typ: 'dogadac' }); onDogadac() }}
          whileTap={{ scale: 0.98 }}
        >
          <b>{t.brief.dogadac}</b>
          <span>{t.brief.dogadacSub}</span>
        </motion.button>
        <motion.button
          type="button"
          className={`tr-opcja ${kalendarz ? 'on' : ''}`}
          aria-expanded={kalendarz}
          onClick={() => {
            setKalendarz(true)
            if (value?.typ !== 'termin') onChange({ typ: 'termin', dzien: '', godzina: '' })
          }}
          whileTap={{ scale: 0.98 }}
        >
          <b>{t.brief.termin}</b>
          <span>{t.brief.terminSub}</span>
        </motion.button>
      </div>

      {kalendarz && (
        <motion.div
          className="tr-kal"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.32, ease: EASE }}
        >
          {propozycje.length > 0 && (
            <>
              {/* bez napisu nad terminami: w karcie 415 px napis i trzy terminy łamały się na dwie linie */}
              <div className="tr-szybkie" role="group" aria-label={t.brief.najblizsze} title={t.brief.najblizsze}>
                {propozycje.map((p) => (
                  <button
                    type="button"
                    key={`${p.dzien}-${p.godzina}`}
                    className={`bk-slot ${wybrany?.dzien === p.dzien && wybrany?.godzina === p.godzina ? 'on' : ''}`}
                    onClick={() => { setKursor({ r: p.r, m: p.m }); ustaw(p.r, p.m, p.d, p.g, p.min) }}
                  >
                    {nazwaDnia(p)} · {p.godzina}
                  </button>
                ))}
              </div>
            </>
          )}

          <div className="bk-head tr-head">
            <button type="button" onClick={() => przesun(-1)} disabled={!mozeWstecz} aria-label={t.booking.prev}>‹</button>
            <strong>{MIESIACE[kursor.m - 1]} {kursor.r}</strong>
            <button type="button" onClick={() => przesun(1)} disabled={!mozeDalej} aria-label={t.booking.next}>›</button>
          </div>
          <div className="bk-dow">{DNI.map((d) => <span key={d}>{d}</span>)}</div>
          <div className="bk-grid">
            {siatka.map((c, i) => {
              if (!c) return <span key={`e${i}`} />
              const off = !dzienWolny(c.r, c.m, c.d)
              const on = wybrany?.dzien === kluczDnia(c.r, c.m, c.d)
              return (
                <button
                  type="button"
                  key={c.d}
                  className={`bk-day ${off ? 'off' : ''} ${on ? 'on' : ''}`}
                  disabled={off}
                  onClick={() => wybierzDzien(c.r, c.m, c.d)}
                >
                  {c.d}
                </button>
              )
            })}
          </div>

          {wybrany?.dzien ? (
            <div className="tr-czas">
              {/* napis i minuty w jednym wierszu — osobny rząd na :00/:30 nie mieścił się na laptopie 768 px */}
              <div className="tr-czas-wiersz">
                <p className="tr-mini">{t.brief.godzina} · {t.brief.strefa}</p>
                <div className="tr-minuty" role="group">
                  {MINUTY.map((min) => {
                    const mozna = wg != null && wolny(wr, wm, wd, wg, min)
                    return (
                      <button
                        type="button"
                        key={min}
                        className={`tr-min ${wg != null && wmin === min ? 'on' : ''}`}
                        disabled={!mozna}
                        onClick={() => ustaw(wr, wm, wd, wg, min)}
                      >
                        :{String(min).padStart(2, '0')}
                      </button>
                    )
                  })}
                </div>
              </div>
              <div className="tr-godziny">
                {GODZINY.map((g) => {
                  const mozna = MINUTY.some((min) => wolny(wr, wm, wd, g, min))
                  return (
                    <button
                      type="button"
                      key={g}
                      className={`bk-slot ${wg === g ? 'on' : ''}`}
                      disabled={!mozna}
                      onClick={() => wybierzGodzine(g)}
                    >
                      {String(g).padStart(2, '0')}
                    </button>
                  )
                })}
              </div>
            </div>
          ) : (
            <p className="tr-mini tr-wskazowka">{t.brief.wybierzDzien}</p>
          )}
        </motion.div>
      )}
    </div>
  )
}

/** Czy krok terminu jest kompletny. */
export const terminGotowy = (v) => v?.typ === 'dogadac' || (v?.typ === 'termin' && !!v.dzien && !!v.godzina)
