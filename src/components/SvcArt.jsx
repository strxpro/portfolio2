import { motion } from 'framer-motion'
import { EASE } from '../lib/motion'

const A = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round' }

const line = (i = 0, d = 1.1) => ({
  initial: { pathLength: 0, opacity: 0 },
  animate: { pathLength: 1, opacity: 1 },
  transition: { pathLength: { duration: d, delay: i * 0.12, ease: EASE }, opacity: { duration: 0.2, delay: i * 0.12 } },
})
const pop = (i = 0) => ({
  initial: { scale: 0, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  transition: { duration: 0.5, delay: 0.2 + i * 0.08, ease: EASE },
})
/**
 * Oddech rysunku — animacja CSS, nie pętla Framera.
 * `repeat: Infinity` we Framerze liczył się w JS co klatkę także wtedy,
 * gdy sekcja usług była kilka ekranów niżej. CSS nic nie liczy w skrypcie,
 * a poza ekranem przeglądarka tego w ogóle nie maluje.
 */
const beat = (d = 2.6) => ({
  className: 'art-beat',
  style: { animationDuration: `${d}s` },
})

/**
 * Rysunek obok opisu usługi — po jednym na każdą pozycję listy.
 *
 * Każdy motyw pokazuje dokładnie tę rzecz, o której jest mowa obok:
 * układ strony, tor scrolla, obracany model, panel z suwakami, przepływ
 * automatyzacji i przełącznik języków. Rysuje się linia po linii przy
 * każdej zmianie pozycji, a potem oddycha w miejscu.
 */
const ART = [
  // 01 projekt graficzny — układ strony powstający z bloków
  (
    <>
      <motion.rect x="14" y="14" width="132" height="92" rx="7" {...A} {...line(0)} />
      <motion.rect x="26" y="28" width="56" height="34" rx="3" fill="currentColor" opacity="0.14" {...pop(0)} />
      <motion.path d="M92 28h42M92 40h42M92 52h28" {...A} {...line(1, 0.7)} />
      <motion.path d="M26 74h108M26 86h72" {...A} {...line(2, 0.7)} />
    </>
  ),
  // 02 ruch i interakcja — tor scrolla z punktami
  (
    <>
      <motion.path d="M18 92c26 0 26-58 52-58s26 58 52 58 22-22 22-22" {...A} {...line(0, 1.4)} />
      <motion.circle cx="70" cy="34" r="6" fill="currentColor" {...pop(0)} />
      <motion.circle cx="122" cy="92" r="6" fill="currentColor" opacity="0.4" {...pop(1)} />
      <motion.path d="M18 106h124" {...A} strokeDasharray="3 6" {...line(2, 0.8)} />
    </>
  ),
  // 03 trójwymiar — bryła obracana w kadrze
  (
    <motion.g {...beat(3.4)}>
      <motion.path d="M80 20l52 30v40L80 120 28 90V50z" {...A} {...line(0, 1.3)} />
      <motion.path d="M80 20v40l52 30M80 60L28 90M80 60v60" {...A} opacity="0.5" {...line(1, 1)} />
      <motion.circle cx="80" cy="60" r="4" fill="currentColor" {...pop(0)} />
    </motion.g>
  ),
  // 04 panel właściciela — suwaki i przełączniki
  (
    <>
      <motion.rect x="16" y="18" width="128" height="84" rx="7" {...A} {...line(0)} />
      <motion.path d="M30 40h46M30 60h74M30 80h34" {...A} {...line(1, 0.8)} />
      <motion.circle cx="96" cy="40" r="7" fill="currentColor" {...pop(0)} />
      <motion.circle cx="122" cy="60" r="7" fill="currentColor" opacity="0.35" {...pop(1)} />
      <motion.circle cx="64" cy="80" r="7" fill="currentColor" opacity="0.6" {...pop(2)} />
    </>
  ),
  // 05 automatyzacje — przepływ z formularza do czterech kanałów
  (
    <>
      <motion.rect x="14" y="46" width="34" height="28" rx="4" {...A} {...line(0, 0.7)} />
      <motion.path d="M48 60h28M76 60V26h30M76 60v34h30M76 60h30" {...A} {...line(1, 1.2)} />
      <motion.circle cx="118" cy="26" r="9" {...A} {...pop(0)} />
      <motion.circle cx="118" cy="60" r="9" {...A} {...pop(1)} />
      <motion.circle cx="118" cy="94" r="9" {...A} {...pop(2)} />
      <motion.circle cx="118" cy="60" r="3.5" fill="currentColor" {...pop(3)} />
    </>
  ),
  // 06 języki i widoczność — jedno źródło, sześć wersji
  (
    <>
      <motion.circle cx="80" cy="60" r="40" {...A} {...line(0, 1.4)} />
      <motion.path d="M80 20v80M40 60h80M80 20c-18 16-18 64 0 80M80 20c18 16 18 64 0 80" {...A} opacity="0.55" {...line(1, 1.2)} />
      <motion.circle cx="80" cy="60" r="5" fill="currentColor" {...pop(0)} />
    </>
  ),
]

export default function SvcArt({ pick }) {
  return (
    <div className="svc-art" aria-hidden="true">
      {/* Zwykła zmiana klucza zamiast AnimatePresence mode="wait" — przy
          przesuwaniu kursora po liście „wait” opóźniał każdy rysunek,
          a przy wstrzymanych klatkach nowy nie przychodził wcale. */}
      <motion.svg
        key={pick}
        viewBox="0 0 160 120"
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.34, ease: EASE }}
      >
        {ART[pick % ART.length]}
      </motion.svg>
    </div>
  )
}
