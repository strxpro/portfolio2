import { useEffect, useRef, useState } from 'react'
import SitePreview from './SitePreview'

/**
 * Prawdziwa strona projektu w oknie modala.
 *
 * W środku jest zwykły `iframe` z adresem pracy, przewijalny palcem
 * i kółkiem — jak mała przeglądarka. Nie ma tu żadnej sztuczki wokół
 * `X-Frame-Options` ani CSP i **nie ma jej być**: jeśli strona nie
 * pozwala się osadzić, to jest jej decyzja.
 *
 * Dlatego zamiast obchodzić zabezpieczenia, wykrywamy odmowę i pokazujemy
 * rysowany podgląd (`SitePreview`) plus wejście na stronę. Wykrycie jest
 * z konieczności pośrednie: przy innej domenie nie da się zajrzeć do
 * ramki, a przeglądarki **nie zgłaszają błędu** przy zablokowanym
 * osadzeniu — `onError` nigdy nie przychodzi. Zostaje czas: jeśli
 * `onLoad` nie padnie w `CZEKAJ`, uznajemy, że nie wejdzie.
 *
 * Tam, gdzie z góry wiadomo, że się nie uda, dane pracy mają
 * `embed: false` i wtedy nawet nie próbujemy.
 */

/** Ile czekamy na `onLoad`, zanim uznamy osadzenie za zablokowane. */
const CZEKAJ = 6000

export default function LivePreview({ item, hint }) {
  const [stan, setStan] = useState(() =>
    item.url && item.embed !== false ? 'czeka' : 'zablokowane',
  )
  const zegar = useRef(null)

  useEffect(() => {
    setStan(item.url && item.embed !== false ? 'czeka' : 'zablokowane')
  }, [item.id, item.url, item.embed])

  useEffect(() => {
    if (stan !== 'czeka') return undefined
    zegar.current = setTimeout(() => setStan('zablokowane'), CZEKAJ)
    return () => clearTimeout(zegar.current)
  }, [stan, item.id])

  /**
   * `onLoad` leci także dla `about:blank`, którym przeglądarka zastępuje
   * odrzucone osadzenie. Przy tej samej domenie da się to sprawdzić;
   * przy innej rzut wyjątku **jest dobrą wiadomością** — znaczy, że
   * dokument istnieje i należy do kogoś innego.
   */
  const naZaladowanie = (e) => {
    clearTimeout(zegar.current)
    try {
      const d = e.currentTarget.contentDocument
      if (d && (d.location.href === 'about:blank' || !d.body || !d.body.childElementCount)) {
        setStan('zablokowane')
        return
      }
    } catch {
      /* inna domena — wczytało się poprawnie */
    }
    setStan('gotowe')
  }

  if (stan === 'zablokowane') {
    return (
      <div className="lp">
        <SitePreview id={item.id} tint={item.tint} name={item.name} host={item.host} hint={hint} />
      </div>
    )
  }

  return (
    <div className="lp">
      <div className="lp-bar">
        <i /><i /><i />
        <span>{item.host}</span>
      </div>

      {/* Ramka przewija się sama w środku — stąd `lp-okno` bez maski
          i bez transformacji: każda z nich odcięłaby gest przewijania. */}
      {/* `data-lenis-prevent`: bez tego Lenis przechwytuje kółko nad
          ramką i zamiast strony projektu przewija portfolio. */}
      <div className="lp-okno" data-lenis-prevent>
        <iframe
          key={item.id}
          className="lp-ramka"
          src={item.url}
          title={item.host}
          loading="lazy"
          referrerPolicy="no-referrer"
          sandbox="allow-scripts allow-same-origin allow-popups"
          onLoad={naZaladowanie}
        />
        {stan === 'czeka' && <span className="lp-czeka" />}
      </div>
    </div>
  )
}
