import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import Cover from './Cover'
import Folder from './Folder'
import Focus from './Focus'
import Tour from './Tour'
import Morph from './Morph'
import { textOf, useProjects } from '../lib/projects'
import { useT } from '../lib/lang-ctx'
import { useGuide } from '../lib/mascot'
import { isOn, pop, shut } from '../lib/sound'

/**
 * Prace na telefonie: szyna przewijana palcem.
 *
 * Wcześniej stało tu koło obracane pionowym przewijaniem. Wyglądało
 * dobrze, ale **więziło**: sekcja była wysoka i przyklejona do ekranu,
 * więc żeby ją opuścić, trzeba było przejechać przez wszystkie prace.
 * Na telefonie to wada, nie efekt.
 *
 * Teraz sekcja ma normalną wysokość, a prace leżą na **poziomej szynie
 * z natywnym przewijaniem**. To nie jest wybór z lenistwa — natywne
 * przewijanie daje za darmo wszystko, o co tu chodzi:
 *
 *  · gest palcem w lewo i w prawo z prawdziwym rozpędem systemowym,
 *  · zatrzymanie w dowolnym miejscu, bez doskakiwania,
 *  · gest pionowy przechodzi **do strony**, więc sekcję można opuścić
 *    w każdej chwili, w górę albo w dół,
 *  · zero nasłuchów gestów w JS, więc nie ma czego czyścić ani czym
 *    zamulać klatek.
 *
 * `data-lenis-prevent` jest konieczne: bez niego Lenis przechwytuje
 * ruch nad szyną i zamiast przewijać prace, przewija stronę.
 */
export default function Rail() {
  const t = useT()
  const prace = useProjects()
  const [otwarte, setOtwarte] = useState(false)
  const [panel, setPanel] = useState(null)
  const [open, setOpen] = useState(null)

  const ref = useGuide({
    id: 'prace',
    text: t.guide.work,
    corner: 'tl',
    mood: 'mowi',
    point: '.rail-tor',
  })

  const idx = panel ? prace.findIndex((x) => x.id === panel) : -1
  const item = idx >= 0 ? prace[idx] : null

  const zamknij = () => { if (isOn()) shut(); setPanel(null) }
  const idz = (krok) => setPanel(prace[(idx + krok + prace.length) % prace.length].id)

  return (
    <section className={`space rail ${otwarte ? '' : 'zamkniete'}`} id="prace" ref={ref}>
      <div className="rail-in">
        <div className="space-ui rail-ui">
          <p className="label">{t.space.label}</p>
          <h2 className="space-title">
            {t.space.title}
            <Morph words={t.space.morph} className="space-morph" />
          </h2>
        </div>

        <AnimatePresence>
          {!otwarte && (
            <Folder
              key="teczka"
              prace={prace}
              etykieta={t.tour.teczka}
              cta={t.tour.otworz}
              onOpen={() => { if (isOn()) pop(); setOtwarte(true) }}
            />
          )}
        </AnimatePresence>

        {otwarte && (
          <>
            <ul className="rail-tor" data-lenis-prevent>
              {prace.map((praca, i) => (
                <li key={praca.id}>
                  <button
                    type="button"
                    className="rail-karta"
                    onClick={() => { if (isOn()) pop(); setPanel(praca.id) }}
                    aria-label={praca.name}
                  >
                    <Cover id={praca.id} tint={praca.tint} name={praca.name} host={praca.host} still />
                    <span className="rail-pasek">
                      <b>{praca.name}</b>
                      <i>{String(i + 1).padStart(2, '0')} / {String(prace.length).padStart(2, '0')}</i>
                    </span>
                  </button>
                </li>
              ))}
            </ul>

            <p className="rail-hint">{t.space.swipe}</p>
          </>
        )}
      </div>

      <AnimatePresence>
        {item && (
          <Focus
            key="focus"
            item={item}
            from={null}
            index={idx}
            total={prace.length}
            onPrev={() => idz(-1)}
            onNext={() => idz(1)}
            onClose={zamknij}
            onOpenSite={() => { setOpen(item.id); zamknij() }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <Tour
            key={open}
            item={prace.find((x) => x.id === open)}
            kind={textOf(t, prace.find((x) => x.id === open)).kind}
            from={null}
            onClose={() => setOpen(null)}
          />
        )}
      </AnimatePresence>
    </section>
  )
}
