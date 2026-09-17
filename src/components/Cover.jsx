import { motion } from 'framer-motion'
import { useT } from '../lib/lang-ctx'
import { EASE } from '../lib/motion'

/**
 * Okładka projektu — każda inna, budowana z figur pod konkretny lokal.
 * Żadnych zdjęć i żadnych ramek: czysty SVG w kolorze projektu, więc
 * dziewięć kafli nic nie kosztuje przy scrollu.
 *
 * Uwaga: docelowa przezroczystość idzie w `o`, a nie w atrybut opacity —
 * animacja i tak nadpisałaby atrybut i każda plama zrobiłaby się czarna.
 */


const draw = (i, dur = 0.9, o = 1) => ({
  initial: { pathLength: 0, opacity: 0 },
  whileInView: { pathLength: 1, opacity: o },
  viewport: { once: true, amount: 0.4 },
  transition: {
    pathLength: { duration: dur, delay: 0.1 + i * 0.09, ease: EASE },
    opacity: { duration: 0.15, delay: 0.1 + i * 0.09 },
  },
})
const pop = (i, d = 0, o = 1) => ({
  initial: { scale: 0, opacity: 0 },
  whileInView: { scale: 1, opacity: o },
  viewport: { once: true, amount: 0.4 },
  transition: { duration: 0.5, delay: 0.25 + d + i * 0.07, ease: EASE },
})

/* ── kompozycje: każda z innym kadrem i rytmem ────────── */
const ART = {
  // pizzeria: wielkie koło ucięte krawędzią, wykrój i pieprzyki
  spabi: (c) => (
    <>
      <rect width="320" height="200" fill={c.tint} />
      <motion.circle cx="238" cy="104" r="104" fill={c.ink} {...c.p(0, 0, 0.07)} />
      <motion.circle cx="238" cy="104" r="76" fill="none" stroke={c.ink} strokeWidth="2" {...c.d(0, 0.9, 0.8)} />
      <motion.path d="M238 104 L330 62 M238 104 L330 148" stroke={c.ink} strokeWidth="2" fill="none" {...c.d(1, 0.9, 0.8)} />
      <motion.circle cx="206" cy="72" r="7" fill={c.ink} {...c.p(1, 0.2, 0.75)} />
      <motion.circle cx="200" cy="132" r="7" fill={c.ink} {...c.p(2, 0.2, 0.75)} />
      <motion.circle cx="252" cy="150" r="7" fill={c.ink} {...c.p(3, 0.2, 0.75)} />
      <motion.path d="M0 168 h150" stroke={c.ink} strokeWidth="10" {...c.d(2, 0.7, 0.9)} />
    </>
  ),

  // wine bar: sylwetka kieliszka i poziom nalewanego trunku
  shistoria: (c) => (
    <>
      <rect width="320" height="200" fill={c.tint} />
      <motion.rect
        x="0" y="118" width="320" height="82" fill={c.ink} opacity="0.1"
        style={{ originY: 1 }}
        {...c.raw({ scaleY: 0 }, { scaleY: 1 }, { duration: 0.56, ease: EASE, delay: 0.15 })}
      />
      <motion.path d="M118 34 h84 l-11 46 a31 31 0 0 1 -62 0 z" fill="none" stroke={c.ink} strokeWidth="2.4" {...c.d(0, 0.9, 0.85)} />
      <motion.path d="M160 111 v44" stroke={c.ink} strokeWidth="2.4" {...c.d(1, 0.5, 0.85)} />
      <motion.path d="M126 156 h68" stroke={c.ink} strokeWidth="2.4" {...c.d(2, 0.5, 0.85)} />
      <motion.circle cx="52" cy="52" r="26" fill="none" stroke={c.ink} strokeWidth="1.5" {...c.d(3, 0.8, 0.4)} />
      <motion.circle cx="52" cy="52" r="13" fill="none" stroke={c.ink} strokeWidth="1.5" {...c.d(4, 0.8, 0.4)} />
    </>
  ),

  // wyścig: stok, koło w dole i kreski prędkości
  carruleddhi: (c) => (
    <>
      <rect width="320" height="200" fill={c.tint} />
      <motion.path d="M0 44 L320 178 L320 200 L0 200 Z" fill={c.ink}
        {...c.raw({ x: -40, opacity: 0 }, { x: 0, opacity: 0.09 }, { duration: 0.52, ease: EASE })} />
      <motion.path d="M0 44 L320 178" stroke={c.ink} strokeWidth="2.4" fill="none" {...c.d(0, 0.9, 0.8)} />
      <motion.circle cx="214" cy="118" r="24" fill="none" stroke={c.ink} strokeWidth="2.4"
        {...c.raw({ x: -160, rotate: -180, opacity: 0 }, { x: 0, rotate: 0, opacity: 0.85 }, { duration: 0.62, ease: EASE, delay: 0.2 })} />
      {[0, 1, 2].map((i) => (
        <motion.path key={i} d={`M${34 + i * 18} ${104 + i * 14} h${52 - i * 10}`} stroke={c.ink} strokeWidth="3" {...c.d(i + 1, 0.5, 0.35)} />
      ))}
    </>
  ),

  // apartament: łuk okna, horyzont i słońce
  villadea: (c) => (
    <>
      <rect width="320" height="200" fill={c.tint} />
      <motion.path d="M96 200 V96 a64 64 0 0 1 128 0 V200" fill="none" stroke={c.ink} strokeWidth="2.4" {...c.d(0, 1.1, 0.8)} />
      <motion.path d="M96 140 h128" stroke={c.ink} strokeWidth="1.6" {...c.d(1, 0.5, 0.45)} />
      <motion.path d="M160 96 v104" stroke={c.ink} strokeWidth="1.6" {...c.d(2, 0.5, 0.45)} />
      <motion.circle cx="160" cy="76" r="17" fill={c.ink} {...c.p(0, 0.3, 0.16)} />
      <motion.path d="M0 172 h72 M248 172 h72" stroke={c.ink} strokeWidth="2" {...c.d(3, 0.6, 0.3)} />
    </>
  ),

  // jubiler: brylant ze ścianek
  gioielleria: (c) => (
    <>
      <rect width="320" height="200" fill={c.tint} />
      <motion.circle cx="160" cy="112" r="80" fill={c.ink} {...c.p(0, 0, 0.06)} />
      <motion.path d="M118 66 h84 l32 34 -74 76 -74 -76 z" fill="none" stroke={c.ink} strokeWidth="2.4" {...c.d(0, 1.1, 0.85)} />
      <motion.path d="M86 100 h148 M118 66 l24 34 -24 76 M202 66 l-24 34 24 76 M142 100 h36" stroke={c.ink} strokeWidth="1.4" {...c.d(1, 0.9, 0.5)} />
    </>
  ),

  // klub: boisko i numer
  cagliariclub: (c) => (
    <>
      <rect width="320" height="200" fill={c.tint} />
      <motion.path d="M18 18 h284 v164 h-284 z" fill="none" stroke={c.ink} strokeWidth="2" {...c.d(0, 1.1, 0.6)} />
      <motion.path d="M160 18 v164" stroke={c.ink} strokeWidth="2" {...c.d(1, 0.6, 0.5)} />
      <motion.circle cx="160" cy="100" r="38" fill="none" stroke={c.ink} strokeWidth="2" {...c.d(2, 0.8, 0.5)} />
      <motion.path d="M18 60 h34 v80 h-34 M302 60 h-34 v80 h34" fill="none" stroke={c.ink} strokeWidth="2" {...c.d(3, 0.7, 0.4)} />
      <motion.text
        x="160" y="118" textAnchor="middle" fill={c.ink}
        fontFamily="var(--f-serif)" fontWeight="800" fontSize="46" letterSpacing="-2"
        {...c.p(0, 0.5, 0.85)}
      >
        11
      </motion.text>
    </>
  ),

  // restauracja: słońce z promieniami z narożnika
  ilgirasole: (c) => {
    const rays = []
    for (let i = 0; i < 14; i++) {
      const a = (i / 14) * Math.PI * 2
      rays.push(
        <motion.path
          key={i}
          d={`M${44 + Math.cos(a) * 34} ${58 + Math.sin(a) * 34} L${44 + Math.cos(a) * 92} ${58 + Math.sin(a) * 92}`}
          stroke={c.ink}
          strokeWidth="2"
          {...c.d(i * 0.35, 0.5, 0.4)}
        />
      )
    }
    return (
      <>
        <rect width="320" height="200" fill={c.tint} />
        {rays}
        <motion.circle cx="44" cy="58" r="30" fill={c.ink} {...c.p(0, 0, 0.14)} />
        <motion.circle cx="44" cy="58" r="30" fill="none" stroke={c.ink} strokeWidth="2.4" {...c.d(0, 0.9, 0.8)} />
        <motion.path d="M150 158 h150" stroke={c.ink} strokeWidth="8" {...c.d(3, 0.7, 0.85)} />
      </>
    )
  },

  // bar na plaży: pasy fal i tarcza słońca
  renabianca: (c) => (
    <>
      <rect width="320" height="200" fill={c.tint} />
      <motion.circle cx="248" cy="56" r="34" fill={c.ink} {...c.p(0, 0, 0.13)} />
      {[0, 1, 2, 3].map((i) => (
        <motion.path
          key={i}
          d={`M-10 ${104 + i * 26} q30 -16 60 0 t60 0 t60 0 t60 0 t60 0`}
          fill="none"
          stroke={c.ink}
          strokeWidth={2.6 - i * 0.4}
          {...c.d(i, 1, 0.7 - i * 0.14)}
        />
      ))}
    </>
  ),

  // fotoceramika: owalny portret w ramie
  // oltre: glob z południkami, pinezka i ślad trasy — doradztwo i relokacja
  oltre: (c) => (
    <>
      <rect width="320" height="200" fill={c.tint} />
      <motion.circle cx="126" cy="104" r="78" fill="none" stroke={c.ink} strokeWidth="2" {...c.d(0, 1, 0.85)} />
      <motion.path d="M126 26 C 86 64, 86 144, 126 182 M126 26 C 166 64, 166 144, 126 182" fill="none" stroke={c.ink} strokeWidth="1.6" {...c.d(1, 1, 0.6)} />
      <motion.path d="M50 82 h152 M48 126 h156" fill="none" stroke={c.ink} strokeWidth="1.6" {...c.d(2, 0.9, 0.6)} />
      <motion.path d="M214 58 c26 14, 34 44, 78 46" fill="none" stroke={c.ink} strokeWidth="2" strokeDasharray="6 7" {...c.d(3, 1.1, 0.75)} />
      <motion.path d="M292 96 a12 12 0 1 0 -0.1 0 z M292 108 l0 22" fill="none" stroke={c.ink} strokeWidth="2.4" {...c.d(4, 0.8, 0.9)} />
      <motion.circle cx="96" cy="78" r="5" fill={c.ink} {...c.p(0, 0.15, 0.8)} />
      <motion.circle cx="148" cy="130" r="5" fill={c.ink} {...c.p(1, 0.25, 0.8)} />
    </>
  ),

  // pizzeria: otwarte pudełko, kawałek w drodze i pinezka dojazdu
  pizzeria: (c) => (
    <>
      <rect width="320" height="200" fill={c.tint} />
      <motion.path d="M44 96 h140 v78 H44 z" fill="none" stroke={c.ink} strokeWidth="2.4" {...c.d(0, 1, 0.9)} />
      <motion.path d="M44 96 L74 44 h140 L184 96" fill="none" stroke={c.ink} strokeWidth="2" {...c.d(1, 1, 0.7)} />
      <motion.path d="M206 128 l64 -34 6 40 z" fill={c.ink} {...c.p(0, 0.2, 0.12)} />
      <motion.path d="M206 128 l64 -34 6 40 z" fill="none" stroke={c.ink} strokeWidth="2" {...c.d(2, 0.9, 0.85)} />
      <motion.circle cx="238" cy="112" r="4.5" fill={c.ink} {...c.p(1, 0.3, 0.8)} />
      <motion.circle cx="252" cy="124" r="4" fill={c.ink} {...c.p(2, 0.36, 0.8)} />
      <motion.path d="M184 170 c34 -6, 60 4, 96 -10" fill="none" stroke={c.ink} strokeWidth="1.8" strokeDasharray="5 7" {...c.d(3, 1, 0.6)} />
      <motion.path d="M286 148 a11 11 0 1 0 -0.1 0 z M286 159 l0 18" fill="none" stroke={c.ink} strokeWidth="2.2" {...c.d(4, 0.8, 0.85)} />
      <motion.path d="M0 62 h64" stroke={c.ink} strokeWidth="9" fill="none" {...c.d(5, 0.7, 0.9)} />
    </>
  ),

  antiqua: (c) => (
    <>
      <rect width="320" height="200" fill={c.tint} />
      <motion.path d="M92 24 h136 v152 h-136 z" fill="none" stroke={c.ink} strokeWidth="2" {...c.d(0, 1, 0.5)} />
      <motion.ellipse cx="160" cy="100" rx="50" ry="62" fill={c.ink} {...c.p(0, 0, 0.12)} />
      <motion.ellipse cx="160" cy="100" rx="50" ry="62" fill="none" stroke={c.ink} strokeWidth="2.4" {...c.d(1, 1, 0.75)} />
      <motion.path d="M160 76 a17 17 0 1 1 -0.1 0 M126 152 q34 -34 68 0" fill="none" stroke={c.ink} strokeWidth="2" {...c.d(2, 0.9, 0.55)} />
      <motion.path d="M20 24 v152 M300 24 v152" stroke={c.ink} strokeWidth="1.4" {...c.d(3, 0.7, 0.3)} />
    </>
  ),
}

/**
 * `still` = narysuj od razu, bez animacji. Tak renderują się okładki
 * w scenie 3D: dziewięć kart w głębi nie ma po co odpalać dziewięciu
 * obserwatorów widoczności ani przeliczać `pathLength` co klatkę.
 */
export default function Cover({ id, tint, name, host, still = false }) {
  const t = useT()
  const make = ART[id] ?? ART.spabi
  const c = {
    tint,
    ink: 'var(--ink)',
    d: still ? (i, dur, o = 1) => ({ style: { opacity: o } }) : draw,
    p: still ? (i, dl, o = 1) => ({ style: { opacity: o } }) : pop,
    raw: still
      ? (from, to) => ({ style: to })
      : (from, to, transition) => ({
          initial: from,
          whileInView: to,
          viewport: { once: true, amount: 0.4 },
          transition,
        }),
  }

  return (
    <div className="cover">
      <svg viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        {make(c)}
      </svg>
      {/* Praca bez adresu dostaje podpis z tłumaczeń — puste miejsce
          w narożniku okładki wyglądało na błąd renderowania. */}
      <span className="cover-tag">{host || t.tour.wip}</span>
      <span className="cover-name">{name}</span>
    </div>
  )
}
