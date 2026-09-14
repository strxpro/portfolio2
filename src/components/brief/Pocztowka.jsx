import { motion } from 'framer-motion'

/**
 * Wysyłka jako scena: pocztówka wsuwa się do koperty, klapka się zamyka,
 * lakowa pieczęć STRX się odciska, a potem koperta odlatuje w przestrzeń,
 * zostawiając smugę iskier.
 *
 * To jest WYŁĄCZNIE obraz. Zgłoszenie leci do Workera w tej samej chwili,
 * w której scena rusza, a o tym, co dzieje się dalej, decyduje zegar
 * i odpowiedź serwera w Brief.jsx — nie koniec tej animacji.
 *
 * faza: 'pakuje' (ok. 1,15 s) → 'odlot' (ok. 0,95 s).
 */
const ISKRY = Array.from({ length: 9 }, (_, i) => ({
  i,
  // rozrzut w poprzek toru lotu, żeby smuga nie była kreską
  bok: (i % 3 - 1) * (10 + i * 2),
  rozmiar: 3 + (i % 4),
}))

export default function Pocztowka({ faza, imie }) {
  const lot = faza === 'odlot'

  return (
    <div className="pc-scena" aria-hidden="true">
      <motion.div
        className="pc-koperta"
        initial={{ opacity: 0, y: 26, scale: 0.92 }}
        animate={
          lot
            ? { x: '42vw', y: '-78vh', scale: 0.16, rotate: -26, opacity: [1, 1, 0] }
            : { x: 0, y: 0, scale: 1, rotate: 0, opacity: 1 }
        }
        transition={
          lot
            ? { duration: 0.95, ease: [0.55, 0, 0.8, 0.25], opacity: { duration: 0.95, times: [0, 0.75, 1] } }
            : { duration: 0.4, ease: [0.16, 1, 0.3, 1] }
        }
      >
        <div className="pc-tyl" />

        {/* pocztówka opada z góry do wnętrza koperty */}
        <motion.div
          className="pc-karta"
          initial={{ y: '-118%', rotate: -7, opacity: 0 }}
          animate={{ y: '8%', rotate: 0, opacity: 1 }}
          transition={{
            y: { duration: 0.62, delay: 0.12, ease: [0.3, 1.25, 0.5, 1] },
            rotate: { duration: 0.62, delay: 0.12, ease: [0.16, 1, 0.3, 1] },
            opacity: { duration: 0.2, delay: 0.12 },
          }}
        >
          <span className="pc-znaczek">STRX</span>
          <span className="pc-linia pc-linia-1" />
          <span className="pc-linia pc-linia-2" />
          <span className="pc-podpis">{imie ? `— ${imie}` : ''}</span>
        </motion.div>

        {/* przednia kieszeń zasłania dół pocztówki — stąd wrażenie „do środka” */}
        <div className="pc-przod" />

        {/* klapka: najpierw otwarta za pocztówką, potem domyka się nad nią */}
        <motion.div
          className="pc-klapa"
          initial={{ rotateX: 178, zIndex: 0 }}
          animate={{ rotateX: 0, zIndex: 4 }}
          transition={{
            rotateX: { duration: 0.42, delay: 0.66, ease: [0.5, 0, 0.3, 1] },
            zIndex: { delay: 0.78, duration: 0 },
          }}
        />

        <motion.span
          className="pc-pieczec"
          initial={{ scale: 0, rotate: -40, opacity: 0 }}
          animate={{ scale: [0, 1.35, 1], rotate: [-40, 8, -4], opacity: 1 }}
          transition={{ duration: 0.36, delay: 1.0, ease: [0.16, 1, 0.3, 1], times: [0, 0.6, 1] }}
        >
          STRX
        </motion.span>
      </motion.div>

      {/* smuga iskier za odlatującą kopertą */}
      {lot && ISKRY.map(({ i, bok, rozmiar }) => (
        <motion.span
          key={i}
          className="pc-iskra"
          style={{ width: rozmiar, height: rozmiar }}
          initial={{ x: 0, y: 0, opacity: 0, scale: 1 }}
          animate={{
            x: [`${bok}px`, `calc(${4 + i * 3.6}vw + ${bok}px)`],
            y: [0, `${-(6 + i * 6.8)}vh`],
            opacity: [0, 1, 0],
            scale: [1, 0.4],
          }}
          transition={{ duration: 0.7, delay: 0.05 + i * 0.045, ease: 'easeOut' }}
        />
      ))}
    </div>
  )
}
