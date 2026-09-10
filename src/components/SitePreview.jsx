import { useMemo } from 'react'
import Cover from './Cover'

/**
 * Pionowy podgląd strony, która sama się przewija.
 *
 * Zamiast płaskiego zrzutu w poziomie mamy okno przeglądarki postawione
 * na sztorc i długą stronę, która przez nie przejeżdża — tak, jak
 * wygląda scrollowanie świeżo wczytanej witryny. Okładka projektu jest
 * jej pierwszym ekranem, a niżej lecą bloki układu.
 *
 * Bloki są **wyliczane z identyfikatora projektu**, nie losowane przy
 * każdym renderze. Dzięki temu każda praca ma własny, ale zawsze ten sam
 * układ — inaczej podgląd przemeblowywałby się przy każdym otwarciu.
 */

/** Prosty, powtarzalny generator: z tekstu robi ciąg liczb 0–1. */
function ziarno(txt) {
  let h = 2166136261
  for (let i = 0; i < txt.length; i++) {
    h ^= txt.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return () => {
    h += 0x6d2b79f5
    let t = h
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Kilkanaście sekcji: pasy tekstu, siatki kafli i szerokie plamy. */
function uklad(id) {
  const los = ziarno(id)
  const bloki = []
  for (let i = 0; i < 9; i++) {
    const r = los()
    if (r < 0.34) bloki.push({ typ: 'tekst', linie: 2 + Math.floor(los() * 3) })
    else if (r < 0.72) bloki.push({ typ: 'kafle', ile: 2 + Math.floor(los() * 2) })
    else bloki.push({ typ: 'plama', wys: 60 + Math.floor(los() * 70) })
  }
  return bloki
}

export default function SitePreview({ id, tint, name, host, hint }) {
  const bloki = useMemo(() => uklad(id), [id])

  return (
    <div className="sp">
      {/* pasek okna: kropki i adres — bez tego to tylko obrazek */}
      <div className="sp-bar">
        <i /><i /><i />
        <span>{host}</span>
      </div>

      <div className="sp-glass">
        {/* Przejazd strony robi klatka CSS, nie Framer — dzięki temu
            wystarczy `animation-play-state`, żeby najechanie kursorem
            **zatrzymywało** podgląd. Człowiek, który widzi jadącą stronę,
            odruchowo chce ją przytrzymać i się przyjrzeć. */}
        <div className="sp-page">
          <div className="sp-hero">
            <Cover id={id} tint={tint} name={name} host={host} still />
          </div>

          {bloki.map((b, i) => (
            <div className={`sp-blok ${b.typ}`} key={i} style={{ background: i % 3 === 1 ? tint : undefined }}>
              {b.typ === 'tekst' && (
                <>
                  <span className="sp-h" />
                  {Array.from({ length: b.linie }, (_, n) => (
                    <span className="sp-l" key={n} style={{ width: `${92 - n * 13}%` }} />
                  ))}
                </>
              )}
              {b.typ === 'kafle' && (
                <div className="sp-siatka" style={{ gridTemplateColumns: `repeat(${b.ile}, 1fr)` }}>
                  {Array.from({ length: b.ile * 2 }, (_, n) => <span key={n} />)}
                </div>
              )}
              {b.typ === 'plama' && <span className="sp-plama" style={{ height: b.wys }} />}
            </div>
          ))}

          <div className="sp-stopka"><span /><span /></div>
        </div>

        {/* pasek przewijania po prawej — jedzie razem ze stroną */}
        <span className="sp-scroll" aria-hidden="true" />

        {/* podpowiedź gaśnie, gdy tylko najedziesz — zrobiła swoje */}
        <span className="sp-hint">{hint}</span>
      </div>
    </div>
  )
}
