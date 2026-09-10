import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { me, nav } from '../data/site'
import { useLang } from '../lib/lang-ctx'
import { goTo, goToEnd, goToTop } from '../lib/scroll'
import Sound from './Sound'

export default function Topbar() {
  const [stuck, setStuck] = useState(false)
  const [away, setAway] = useState(false)
  const [here, setHere] = useState('')
  const { t, code, setCode, langs } = useLang()

  /**
   * Nagłówek chowa się TYLKO przy zjeździe w dół i wraca, gdy tylko
   * ruszysz w górę. Próg 6 px odsiewa drgania gładkiego scrolla, a
   * pierwsze 120 px strony trzyma pasek zawsze na wierzchu.
   */
  useEffect(() => {
    let last = window.scrollY
    const onScroll = () => {
      const y = window.scrollY
      const d = y - last
      setStuck(y > 40)
      if (Math.abs(d) > 6) {
        setAway(d > 0 && y > 120)
        last = y
      }
      if (y <= 120) setAway(false)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setHere(e.target.id)),
      { rootMargin: '-45% 0px -50% 0px' }
    )
    nav.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) io.observe(el)
    })
    return () => io.disconnect()
  }, [])

  return (
    <motion.header
      className={`topbar ${stuck ? 'stuck' : ''}`}
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: away ? '-118%' : 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 560, damping: 40, mass: 0.5, opacity: { duration: 0.4, delay: 0.15 } }}
    >
      <a className="brand" href="#top" onClick={(e) => { e.preventDefault(); goToTop() }}>
        <span className="dot" />
        {me.brand}
      </a>

      <nav className="topnav">
        {nav.map((n) => (
          <a
            key={n.id}
            href={`#${n.id}`}
            className={here === n.id ? 'on' : ''}
            onClick={(e) => { e.preventDefault(); goTo(n.id) }}
          >
            {t.nav[n.key]}
          </a>
        ))}
      </nav>

      <div className="topright">
        <Sound />
        <div className="langs" role="group" aria-label="Language">
          {langs.map((l) => (
            <button
              key={l.code}
              type="button"
              className={code === l.code ? 'on' : ''}
              onClick={() => setCode(l.code)}
              title={l.name}
              aria-pressed={code === l.code}
            >
              {code === l.code && (
                <motion.span
                  className="lang-pill"
                  layoutId="lang-pill"
                  transition={{ type: 'spring', stiffness: 420, damping: 36 }}
                />
              )}
              <span>{l.label}</span>
            </button>
          ))}
        </div>

        <motion.a
          className="btn"
          href="#kontakt"
          onClick={(e) => { e.preventDefault(); goToEnd() }}
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.97 }}
        >
          {t.nav.kontakt}
        </motion.a>
      </div>
    </motion.header>
  )
}
