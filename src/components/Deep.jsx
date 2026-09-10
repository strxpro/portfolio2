import { motion } from 'framer-motion'
import { EASE, SPRING } from '../lib/motion'

/**
 * Wejście elementu z głębi kadru.
 *
 * Do tej pory każdy kafelek na stronie wjeżdżał od dołu (`y: 24 → 0`) —
 * osiem plików, osiem lekko innych wersji tego samego. To jest ruch
 * płaski: rzecz przesuwa się PO ekranie.
 *
 * Tutaj rzecz leży **dalej w przestrzeni**, odchylona od widza, i
 * dojeżdża na wprost kamery. Ekran zostaje nieruchomy, rusza się
 * głębia — czyli dokładnie to, na czym stoi igloo.
 *
 * `transformPerspective` jest na samym elemencie celowo. Wspólna
 * perspektywa z rodzica ustawia znikanie w środku sekcji, więc kafelki
 * z lewej i z prawej wjeżdżałyby skosem w przeciwne strony; własna
 * perspektywa daje każdemu ruch prosto na widza.
 *
 * @param {number} i     miejsce w kolejce — opóźnia start (0 = od razu)
 * @param {number} from  jak głęboko zaczyna, w pikselach
 * @param {number} tilt  odchylenie w stopniach na starcie
 */
export default function Deep({
  i = 0,
  from = 260,
  tilt = 9,
  amount = 0.3,
  className,
  style,
  children,
  ...rest
}) {
  return (
    <motion.div
      className={className}
      style={{ transformPerspective: 900, ...style }}
      initial={{ opacity: 0, z: -from, rotateX: tilt, y: 14 }}
      whileInView={{ opacity: 1, z: 0, rotateX: 0, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{
        ...SPRING.enter,
        delay: i * 0.07,
        opacity: { duration: 0.5, delay: i * 0.07, ease: EASE },
      }}
      {...rest}
    >
      {children}
    </motion.div>
  )
}
