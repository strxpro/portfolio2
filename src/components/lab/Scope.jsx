import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useT } from '../../lib/lang-ctx'
import { goToEnd } from '../../lib/scroll'
import { SPRING, EASE } from '../../lib/motion'


/**
 * Kreator zakresu — bez cen.
 *
 * Wycena zależy od projektu i robi ją człowiek, więc ten panel nie udaje
 * cennika. Klikasz, co ma powstać, a on składa z tego gotową listę do
 * rozmowy i podaje ją dalej do formularza.
 */
export default function Scope() {
  const t = useT()
  const [type, setType] = useState(0)
  const [feats, setFeats] = useState([])

  const toggle = (i) =>
    setFeats((s) => (s.includes(i) ? s.filter((x) => x !== i) : [...s, i]))

  const picked = useMemo(
    () => feats.slice().sort((a, b) => a - b).map((i) => t.scope.feats[i]),
    [feats, t]
  )

  return (
    <div className="scope">
      <div className="scope-picks">
        <p className="label">{t.scope.what}</p>
        <div className="scope-chips">
          {t.scope.types.map((label, i) => (
            <motion.button
              key={label}
              className={`scope-chip ${type === i ? 'on' : ''}`}
              onClick={() => setType(i)}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
            >
              {label}
            </motion.button>
          ))}
        </div>

        <p className="label" style={{ marginTop: 22 }}>{t.scope.extras}</p>
        <div className="scope-chips">
          {t.scope.feats.map((label, i) => (
            <motion.button
              key={label}
              className={`scope-chip ${feats.includes(i) ? 'on' : ''}`}
              onClick={() => toggle(i)}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
            >
              <span className="scope-box">{feats.includes(i) ? '×' : '+'}</span>
              {label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* kartka, która składa się z klikniętych elementów */}
      <div className="scope-out ticked">
        <p className="label">{t.scope.sheet}</p>

        <p className="scope-kind">{t.scope.types[type]}</p>

        <ul className="scope-list">
          <AnimatePresence initial={false}>
            {picked.map((label) => (
              <motion.li
                key={label}
                layout
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 12 }}
                transition={{ duration: 0.28, ease: EASE }}
              >
                <i />
                {label}
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>

        {picked.length === 0 && <p className="scope-empty">{t.scope.empty}</p>}

        <motion.button
          className="btn big scope-go"
          onClick={goToEnd}
          whileHover={{ y: -3 }}
          whileTap={{ scale: 0.97 }}
        >
          {t.scope.send}
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </motion.button>

        <p className="scope-note">{t.scope.note}</p>
      </div>

      {/* czym to jest robione — pełna szerokość pod obiema kolumnami */}
      <div className="scope-tech">
        <p className="label">{t.scope.techLabel}</p>
        <p className="scope-tech-note">{t.scope.techNote}</p>
        <div className="scope-tech-grid">
          {t.scope.tech.map(([group, items], gi) => (
            <motion.div
              className="scope-tech-col"
              key={group}
              initial={{ opacity: 0, z: -230, rotateX: 9 }}
              whileInView={{ opacity: 1, z: 0, rotateX: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ ...SPRING.enter, delay: gi * 0.07 }}
              style={{ transformPerspective: 900 }}
            >
              <h4>{group}</h4>
              <ul>
                {items.map((it) => <li key={it}>{it}</li>)}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
