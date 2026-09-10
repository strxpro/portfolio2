import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { makeCardTexture } from './cardTexture'
import { cardFragment, cardVertex } from './cardShader'

/**
 * Jedna praca na ścianie tunelu.
 *
 * Karta nie ma stałego miejsca w scenie — siedzi na **pierścieniu
 * liczonym modulo**, więc kiedy zostanie z tyłu, wraca na sam przód
 * i przelot nie ma końca. Dlatego pozycję ustawiamy w każdej klatce,
 * a nie w JSX.
 *
 * Po wybraniu karta odczepia się od ściany: leci na wprost obiektywu
 * i tam się prostuje. Robimy to zwykłym dobieganiem do celu (lerp),
 * bo cel rusza się razem z kamerą — sztywna animacja na czas musiałaby
 * gonić ruchomy punkt.
 */

const SZER = 5.2
const WYS = 3.25

export default function Card({ item, kat, offset, promien, dlugosc, kamera, predkosc, wybrana, przygaszona, onPick }) {
  const mesh = useRef(null)
  const post = useRef(0)   // 0 = na ścianie, 1 = na wprost kamery

  const tex = useMemo(() => makeCardTexture(item), [item])

  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: cardVertex,
        fragmentShader: cardFragment,
        transparent: true,
        side: THREE.DoubleSide,
        uniforms: {
          uTexture: { value: tex },
          uTime: { value: 0 },
          uVelocity: { value: 0 },
          uDistance: { value: 20 },
          uFocus: { value: 0 },
          uDim: { value: 0 },
          uTint: { value: new THREE.Color('#0B0D14') },
        },
      }),
    [tex],
  )

  useFrame((state, delta) => {
    const m = mesh.current
    if (!m) return
    const k = Math.min(1, delta * 60)

    // ── miejsce na ścianie, zawinięte modulo ──────────────
    const z = ((offset - kamera.current) % dlugosc + dlugosc) % dlugosc
    const naSciane = new THREE.Vector3(
      Math.cos(kat) * promien,
      Math.sin(kat) * promien * 0.62,
      -z,
    )

    // ── miejsce na wprost obiektywu ───────────────────────
    const naWprost = new THREE.Vector3(0, 0, -7.4)

    post.current += ((wybrana ? 1 : 0) - post.current) * k * 0.09
    const t = post.current

    m.position.lerpVectors(naSciane, naWprost, t)

    /* Na ścianie karta patrzy w oś tunelu, na wprost — prosto w widza.
       Mieszamy oba obroty tym samym parametrem, więc obrót i lot dzieją
       się jednocześnie zamiast jeden po drugim. */
    const doOsi = Math.atan2(m.position.x, -m.position.z)
    m.rotation.y = doOsi * (1 - t) * -1
    m.rotation.x = Math.sin(kat) * 0.18 * (1 - t)
    m.rotation.z = 0

    const skala = 1 + t * 0.5
    m.scale.setScalar(skala)

    // ── uniformy ──────────────────────────────────────────
    const u = mat.uniforms
    u.uTime.value = state.clock.elapsedTime
    u.uVelocity.value += (predkosc.current - u.uVelocity.value) * k * 0.2
    u.uDistance.value = m.position.distanceTo(state.camera.position)
    u.uFocus.value = t
    u.uDim.value += ((przygaszona ? 1 : 0) - u.uDim.value) * k * 0.09
  })

  return (
    <mesh
      ref={mesh}
      onClick={(e) => { e.stopPropagation(); onPick?.(item.id) }}
      onPointerOver={() => { document.body.style.cursor = 'pointer' }}
      onPointerOut={() => { document.body.style.cursor = '' }}
    >
      {/* siatka, nie pojedynczy kwadrat — fala w shaderze potrzebuje
          wierzchołków, po których może przebiec */}
      <planeGeometry args={[SZER, WYS, 24, 16]} />
      <primitive object={mat} attach="material" />
    </mesh>
  )
}
