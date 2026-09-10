/**
 * Shader karty w tunelu.
 *
 * Trzy rzeczy dzieją się tu naraz i wszystkie zależą od **jednej
 * liczby: gdzie karta jest względem kamery**.
 *
 *  1. Ostrość. Karta daleko w tle albo mijająca obiektyw tuż przed
 *     nosem rozsypuje się na piksele; w punkcie na wprost jest czysta.
 *  2. Rozpęd. Im szybciej lecisz, tym mocniej płaszczyzna faluje,
 *     tym szerzej rozjeżdżają się kanały koloru i tym głośniejszy jest
 *     szum na krawędziach. Po zatrzymaniu wszystko wraca samo.
 *  3. Skupienie. Wybrana karta gasi cały ten hałas do zera — ma być
 *     czytelna, a nie efektowna.
 *
 * Zniekształcenia trzymamy **przy krawędziach**: środek karty to
 * treść, którą trzeba przeczytać, a nie miejsce na efekt.
 */

export const cardVertex = /* glsl */ `
  uniform float uTime;
  uniform float uVelocity;   // rozped kamery, 0-1
  uniform float uFocus;      // 1 = karta wybrana, cisza

  varying vec2 vUv;
  varying float vEdge;

  void main() {
    vUv = uv;

    // 0 w srodku karty, 1 przy krawedzi - stad wiadomo, gdzie wolno szalec
    vec2 zSrodka = abs(uv - 0.5) * 2.0;
    vEdge = clamp(max(zSrodka.x, zSrodka.y), 0.0, 1.0);

    vec3 pos = position;

    // Fala. Amplituda rosnie z rozpedem i przy krawedziach, wiec karta
    // wygina sie jak klatka filmu ciagnieta zbyt szybko.
    float sila = uVelocity * (1.0 - uFocus);
    float fala = sin(pos.x * 3.2 + uTime * 4.0) * 0.5
               + sin(pos.y * 2.4 - uTime * 2.6) * 0.5;
    pos.z += fala * sila * 0.34 * (0.25 + vEdge);

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`

export const cardFragment = /* glsl */ `
  uniform sampler2D uTexture;
  uniform float uTime;
  uniform float uVelocity;
  uniform float uDistance;   // odleglosc od kamery w jednostkach sceny
  uniform float uFocus;
  uniform float uDim;        // przygaszenie, gdy inna karta jest wybrana
  uniform vec3  uTint;

  varying vec2 vUv;
  varying float vEdge;

  // tani szum - do ziarna i drgania krawedzi
  float szum(vec2 p) {
    return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
  }

  void main() {
    /**
     * Ostrosc zalezy od dystansu.
     *
     * smoothstep w obie strony daje pas, w ktorym karta jest czysta:
     * dalej niz 26 jednostek rozsypuje sie w tle, blizej niz 5 - tuz
     * przed obiektywem. Karta wybrana jest ostra zawsze.
     */
    float dal = smoothstep(26.0, 12.0, uDistance);
    float blisko = smoothstep(2.0, 6.5, uDistance);
    float ostrosc = max(dal * blisko, uFocus);

    // Pikselizacja: im mniej ostrosci, tym grubsze piksele.
    float krata = mix(14.0, 900.0, ostrosc * ostrosc);
    vec2 uv = floor(vUv * krata) / krata;

    // Rozjazd kanalow: od rozpedu i od braku ostrosci, mocniej na brzegu.
    float rozjazd = (uVelocity * 0.6 + (1.0 - ostrosc) * 0.5)
                  * (0.3 + vEdge * 1.4) * (1.0 - uFocus);
    vec2 o = vec2(rozjazd * 0.02, 0.0);

    float r = texture2D(uTexture, uv + o).r;
    float g = texture2D(uTexture, uv).g;
    float b = texture2D(uTexture, uv - o).b;
    vec3 kolor = vec3(r, g, b);

    // Krawedz zyje: ziarno i poziome pasy, tylko przy obrysie.
    float pasy = sin(vUv.y * 320.0 + uTime * 12.0) * 0.5 + 0.5;
    float ziarno = szum(uv * 220.0 + uTime);
    float halas = (ziarno * 0.6 + pasy * 0.4) * vEdge * vEdge
                * (0.25 + uVelocity) * (1.0 - uFocus);
    kolor += (halas - 0.12) * 0.55;

    // W glebi karta wtapia sie w kolor tunelu - to mgla, tylko liczona tu,
    // zeby nie placic za osobny przebieg.
    kolor = mix(uTint, kolor, clamp(dal + uFocus, 0.0, 1.0));

    // Karta poza skupieniem przygasa, zeby wybrana miala pierwszenstwo.
    kolor *= 1.0 - uDim * 0.55;

    // Znikanie na samych koncach przelotu - nic nie wpada w obiektyw.
    float widac = smoothstep(0.6, 3.2, uDistance) * smoothstep(34.0, 27.0, uDistance);
    float alfa = max(widac, uFocus);

    gl_FragColor = vec4(kolor, alfa);
    #include <colorspace_fragment>
  }
`
