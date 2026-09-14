import { motion, useIsPresent } from 'framer-motion'
import Cover from './Cover'
import { EASE_CUT, SPRING } from '../lib/motion'

/**
 * Teczka z pracami — brama do sekcji.
 *
 * Zanim prace rozjadą się po przestrzeni, leżą tam, gdzie leżałyby
 * naprawdę: w jednej teczce, wysunięte tak, że widać wystające rogi.
 * Kliknięcie **opuszcza przednią kieszeń**, a karty wachlarzem wychodzą
 * w górę i rozlatują się w tunel albo na koło.
 *
 * Ruch jest ułożony tak, jak w systemach Apple'a: nic nie startuje
 * naraz. Najpierw rusza kieszeń, karty wychodzą z opóźnieniem rosnącym
 * od środka wachlarza, a każda ma własną sprężynę — dzięki temu całość
 * czyta się jako jeden gest, a nie jako pięć animacji odpalonych razem.
 *
 * Teczka nie jest pułapką: sekcja otwiera ją też sama, kiedy ktoś po
 * prostu przewija dalej. Zamknięta brama, której trzeba się domyślić,
 * kosztowałaby więcej niż daje.
 */

/** Ile kart wystaje z teczki i pod jakim kątem. */
const WACHLARZ = [-16, -8, 0, 8, 16]

export default function Folder({ prace, etykieta, cta, onOpen }) {
  const karty = prace.slice(0, WACHLARZ.length)

  /**
   * Znikająca teczka nie przyjmuje kliknięć.
   *
   * Animacja wyjścia trwa pół sekundy i przez ten czas teczka leży nad
   * kartami. Gdyby dalej łapała kursor, pierwsze kliknięcie w kartę po
   * otwarciu trafiałoby w nią — a przy wstrzymanych klatkach nie
   * zniknęłaby wcale i blokowała sekcję na stałe. Animacja ma być ozdobą
   * kroku, nie jego warunkiem.
   */
  const obecna = useIsPresent()

  return (
    <motion.div
      className="fold"
      style={{ pointerEvents: obecna ? undefined : 'none' }}
      initial={{ opacity: 0, y: 26, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.94, transition: { duration: 0.28, ease: EASE_CUT } }}
      transition={{ ...SPRING.enter, delay: 0.1 }}
    >
      <button type="button" className="fold-btn" onClick={onOpen} aria-label={cta}>
        {/* Karty wystające z teczki — wachlarz, nie stos. */}
        <span className="fold-karty">
          {karty.map((p, i) => {
            const kat = WACHLARZ[i]
            const srodek = Math.abs(i - (karty.length - 1) / 2)
            return (
              <motion.span
                className="fold-karta"
                key={p.id}
                style={{ zIndex: 10 - Math.round(srodek) }}
                initial={{ rotate: 0, y: 22, opacity: 0 }}
                animate={{ rotate: kat, y: -srodek * 6, opacity: 1 }}
                exit={{
                  // przy otwieraniu karty wystrzeliwują w górę i gasną
                  rotate: kat * 2.4,
                  y: -190 - srodek * 40,
                  opacity: 0,
                  transition: { duration: 0.44, delay: srodek * 0.05, ease: EASE_CUT },
                }}
                transition={{ ...SPRING.enter, delay: 0.16 + srodek * 0.06 }}
              >
                <Cover id={p.id} tint={p.tint} name={p.name} host={p.host} still />
              </motion.span>
            )
          })}
        </span>

        {/* Przednia kieszeń: to ona opada przy otwarciu. */}
        <motion.span
          className="fold-kieszen"
          exit={{ y: 190, opacity: 0, transition: { duration: 0.46, ease: EASE_CUT } }}
        >
          <span className="fold-etykieta">{etykieta}</span>
          <span className="fold-cta">
            {cta}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14M6 13l6 6 6-6" />
            </svg>
          </span>
        </motion.span>
      </button>
    </motion.div>
  )
}
