import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform, useVelocity } from 'framer-motion'
import Piksel3D from './Piksel3D'
import { useMascot } from '../lib/mascot'
import { useT } from '../lib/lang-ctx'

/** Rogi jako ułamek okna — pozycję liczymy w pikselach, żeby dało się nią lecieć. */
const CORNERS = {
  bl: { fx: 0.13, fy: 0.74, side: 'right' },
  br: { fx: 0.87, fy: 0.74, side: 'left' },
  tl: { fx: 0.15, fy: 0.30, side: 'right' },
  tr: { fx: 0.85, fy: 0.30, side: 'left' },
}

const SHOW_MS = 7600

/**
 * Piksel nie wyskakuje i nie znika — on LATA.
 *
 * Zamiast montować go od nowa w każdym rogu, trzymam jeden egzemplarz
 * przyklejony do okna i przesuwam sprężyną między punktami. Z prędkości
 * lotu liczę przechył i spłaszczenie, więc widać rozpęd i wyhamowanie,
 * a nie samo przeniesienie. Kiedy nie ma nic do powiedzenia, odlatuje
 * poza kadr — nadal lecąc, nie gasnąc.
 */
export default function Guide() {
  const t = useT()
  const { active, takeover } = useMascot()
  const [open, setOpen] = useState(false)
  const [poke, setPoke] = useState(0)
  const key = active ? `${active.id}::${active.text}` : null
  const timer = useRef(null)

  const corner = active?.corner ?? 'br'
  const c = CORNERS[corner] ?? CORNERS.br
  const visible = open && !takeover

  // punkt docelowy w pikselach okna
  const tx = useMotionValue(0)
  const ty = useMotionValue(0)
  // szybciej i konkretniej niż wcześniej — poprzedni lot był ospały
  const x = useSpring(tx, { stiffness: 150, damping: 21, mass: 0.85 })
  const y = useSpring(ty, { stiffness: 150, damping: 21, mass: 0.85 })

  // z prędkości lotu robi się przechył, obrót i spłaszczenie
  const vx = useVelocity(x)
  const vy = useVelocity(y)
  const lean = useTransform(vx, [-2200, 0, 2200], [26, 0, -26])
  const spin = useTransform(vx, [-2200, 0, 2200], [-16, 0, 16])
  const pitch = useTransform(vy, [-1800, 0, 1800], [-14, 0, 14])
  const tiltY = useSpring(lean, { stiffness: 120, damping: 20 })
  const roll = useSpring(spin, { stiffness: 120, damping: 20 })
  const tiltX = useSpring(pitch, { stiffness: 120, damping: 20 })

  /**
   * Gdzie ma stanąć: lewy dolny róg. Zawsze.
   *
   * Próbowałem sadzać go „obok elementu, po stronie z większym
   * marginesem", ale w układzie dwukolumnowym ta wolna strona to
   * najczęściej po prostu druga kolumna — czyli tekst. Piksel i tak
   * celuje ręką, więc nie musi stać blisko; wystarczy, że nie zasłania.
   *
   * Lewy dolny róg jest najbezpieczniejszy: prawy zajmuje pływający
   * przycisk kontaktu, a góra to nagłówki.
   */
  const spot = useRef(null)
  const [phone, setPhone] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 900px)')
    const put = () => setPhone(mq.matches)
    put()
    mq.addEventListener('change', put)
    return () => mq.removeEventListener('change', put)
  }, [])
  useEffect(() => {
    const put = () => {
      const w = window.innerWidth
      const h = window.innerHeight
      const own = spot.current?.offsetWidth || 160

      if (!visible) {
        tx.set(-w * 0.34 - w / 2)
        ty.set(h - own * 0.5 - h / 2)
        return
      }
      tx.set(own * 0.62 - w / 2)
      ty.set(h - own * 0.5 - h / 2)
    }
    put()
    const id = setTimeout(put, 220)
    window.addEventListener('resize', put)
    return () => {
      clearTimeout(id)
      window.removeEventListener('resize', put)
    }
  }, [visible, tx, ty])

  // każda nowa kwestia = nowy przylot i nowe odliczanie
  useEffect(() => {
    clearTimeout(timer.current)
    if (!key) {
      setOpen(false)
      return undefined
    }
    setOpen(true)
    timer.current = setTimeout(() => setOpen(false), SHOW_MS)
    return () => clearTimeout(timer.current)
  }, [key])

  // szturchnięcie przedłuża pobyt
  useEffect(() => {
    if (!poke) return
    setOpen(true)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setOpen(false), SHOW_MS)
  }, [poke])

  /**
   * Na telefonie Piksel nie komentuje.
   *
   * Przy 375 px nie ma wolnego pola: gdziekolwiek go postawić, dymek
   * ląduje na tekście. Zamiast walczyć o piksele, na wąskim ekranie
   * chowamy go całkiem — maskotka i tak wraca w finale, gdzie ma
   * własną scenę i nic nie zasłania.
   */
  if (takeover || phone) return null

  return (
    <motion.div
      className="piksel"
      ref={spot}
      style={{ x, y, rotate: roll, rotateY: tiltY, rotateX: tiltX, transformPerspective: 900 }}
    >
      <AnimatePresence mode="wait">
        {visible && active?.text && (
          <motion.div
            key={active.text}
            className="bubble right"
            initial={{ opacity: 0, y: 10, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
          >
            <span className="who">{t.who}</span>
            {active.text}
          </motion.div>
        )}
      </AnimatePresence>

      {/* przylot: lekkie wyhamowanie skalą, żeby dolot miał puentę */}
      <motion.div
        className="piksel-hit"
        onClick={() => setPoke((n) => n + 1)}
        animate={
          poke
            ? { y: [0, -22, 0], scaleY: [1, 0.9, 1] }
            : visible
              ? { scale: [0.82, 1.07, 1], opacity: 1 }
              : { scale: 0.9, opacity: 0.9 }
        }
        transition={{ duration: poke ? 0.5 : 0.62, ease: [0.16, 1, 0.3, 1], times: poke ? undefined : [0, 0.6, 1] }}
        key={`p${poke}`}
      >
        <Piksel3D
          mood={active?.mood ?? 'spokoj'}
          pointSel={visible ? active?.point ?? null : null}
          asleep={!visible}
          size={null}
        />
      </motion.div>
    </motion.div>
  )
}
