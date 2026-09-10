import { useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import Card from './Card'

/**
 * Wnętrze tunelu: obręcze, mgła i przelot kamery.
 *
 * Kamera stoi w miejscu, a **świat sunie na nią** — tak jest taniej
 * i prościej zapętlić: wszystko liczy się modulo długości pętli,
 * więc nie ma żadnego „końca", do którego można dojechać.
 *
 * Rozpęd (`predkosc`) jest jedną liczbą 0–1 wyliczaną z tego, jak
 * szybko zmienia się cel przewijania. Wędruje do shaderów kart i to
 * ona decyduje o sile wygięcia, rozjazdu kanałów i szumu. Opada sama,
 * więc po zatrzymaniu obraz uspokaja się bez dodatkowej logiki.
 */

const PROMIEN = 7.6
const ODSTEP = 9.5

/** Obręcze wyznaczające przestrzeń — bez nich tunel jest samą pustką. */
function Obrecze({ kamera, dlugosc, ile = 22 }) {
  const grupa = useRef(null)
  const geo = useMemo(() => new THREE.TorusGeometry(PROMIEN, 0.012, 3, 64), [])
  const mat = useMemo(
    () => new THREE.MeshBasicMaterial({ color: '#8FA6D8', transparent: true, opacity: 0.16 }),
    [],
  )

  useFrame(() => {
    const g = grupa.current
    if (!g) return
    g.children.forEach((o, i) => {
      const z = ((i * (dlugosc / ile) - kamera.current) % dlugosc + dlugosc) % dlugosc
      o.position.z = -z
      o.scale.y = 0.62 // tunel jest szerszy niż wyższy, jak kadr
      // najdalsze obręcze gasną, żeby nie było widać, gdzie się pojawiają
      o.material.opacity = 0.16 * Math.min(1, Math.max(0, (34 - z) / 16))
    })
  })

  return (
    <group ref={grupa}>
      {Array.from({ length: ile }, (_, i) => (
        <mesh key={i} geometry={geo} material={mat.clone()} />
      ))}
    </group>
  )
}

export default function Tunnel({ prace, postep, wybrany, onPick }) {
  const kamera = useRef(0)
  const cel = useRef(0)
  const predkosc = useRef(0)
  const { scene } = useThree()

  const dlugosc = prace.length * ODSTEP

  /* Mgła robi głębię i — co ważniejsze — chowa miejsce, w którym
     karty wracają na początek pętli. */
  useMemo(() => {
    scene.fog = new THREE.Fog('#0B0D14', 12, 34)
    scene.background = null
  }, [scene])

  /** Kąt i miejsce w pętli. Złoty kąt, więc sąsiednie karty nigdy nie
      lądują po tej samej stronie tunelu. */
  const miejsca = useMemo(
    () =>
      prace.map((_, i) => ({
        kat: i * 2.399963,
        offset: i * ODSTEP,
      })),
    [prace],
  )

  useFrame((_, delta) => {
    const k = Math.min(1, delta * 60)

    // cel bierze się z pozycji przewijania sekcji; kamera do niego dobiega
    cel.current = postep.current * dlugosc * 3

    const przed = kamera.current
    // zamrożenie przy wybranej karcie: tunel ma stanąć, a nie jechać dalej
    if (!wybrany) kamera.current += (cel.current - kamera.current) * k * 0.075

    const ruch = Math.abs(kamera.current - przed)
    const chwilowa = Math.min(1, ruch / 6)
    // rośnie natychmiast, opada powoli — tak czuje się rozpęd
    predkosc.current =
      chwilowa > predkosc.current
        ? chwilowa
        : predkosc.current + (chwilowa - predkosc.current) * k * 0.06
  })

  return (
    <>
      <Obrecze kamera={kamera} dlugosc={dlugosc} />

      {prace.map((item, i) => (
        <Card
          key={item.id}
          item={item}
          kat={miejsca[i].kat}
          offset={miejsca[i].offset}
          promien={PROMIEN}
          dlugosc={dlugosc}
          kamera={kamera}
          predkosc={predkosc}
          wybrana={wybrany === item.id}
          przygaszona={Boolean(wybrany) && wybrany !== item.id}
          onPick={onPick}
        />
      ))}
    </>
  )
}
