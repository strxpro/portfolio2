# STRX — portfolio

Jednostronicowe portfolio zbudowane jak **arkusz techniczny**: jasny papier
kreślarski z widoczną siatką konstrukcyjną, znaczniki pasowania w rogach,
metryczki sekcji i niebieski akcent rysunkowy. Gruby, ciasny grotesk na
nagłówkach, mono na etykietach i wymiarach.

Strona jest **trójjęzyczna** — polski, angielski, włoski. Wybór zapamiętuje się
w przeglądarce, a przy pierwszej wizycie ustawia się z języka systemu.

Przez stronę oprowadza **Piksel** — maskotka narysowana kreską, która wyskakuje
z rogu i komentuje sekcję, w której właśnie jesteś. Na końcu łapie sznurek
z uchwytem, ściąga go w dół i odsłania panel z kontaktem.

## Uruchomienie

```bash
npm install
npm run dev      # http://localhost:5188
npm run build    # produkcja -> dist/
npm run preview  # podgląd builda
```

## Sekcje

| Sekcja | Co robi |
|--------|---------|
| Hero | zapowiedź, dostępność, dwa przyciski, pasek faktów |
| O mnie | dwie kolumny tekstu oddzielone rysującą się linią |
| Prace | siatka **9 miniatur z żywymi stronami** + kafel „następna może być Twoja”; klik otwiera zwiedzanie |
| Na żywo | cztery działające dema: 3D na canvasie, rezerwacja, języki, automatyzacja |
| Usługi | przeglądarka: wielki numer i opis po lewej, lista po prawej |
| Proces | **harmonogram**: paski na osi pięciu tygodni, klik pokazuje szczegół i co dostajesz |
| Zaufanie | cztery dowody zamiast obietnic + szybkie CTA |
| Finał | scena: Piksel, sznurek i zjeżdżający panel z briefem |

Sekcje są **arkuszami**: każda to osobna kartka z zaokrągloną górną krawędzią,
która wsuwa się pod poprzednią i „siada" na miejsce — rozprostowuje się
w poziomie, podnosi treść i domyka szew na górze. Sterowane scrollem
(`components/Leaf.jsx`), na przemian papier i biel.

## Struktura

```
src/
  data/site.js        ← 🔴 CAŁA TREŚĆ (teksty, prace, kontakt, fakty)
  styles/global.css   ← 🎨 CAŁA PALETA i style (zmienne na górze pliku)
  lib/
    mascot.jsx        kontekst maskotki + hook useGuide()
    usePointer.js     znormalizowana pozycja kursora
  components/
    Piksel3D.jsx      maskotka 3D na canvasie (własna projekcja, bez bibliotek)
    Guide.jsx         Piksel wychodzi z rogu, mówi i chowa się po chwili
    Leaf.jsx          arkusz — sekcje kładą się jedna na drugiej przy scrollu
    Photo.jsx         ramka na zdjęcie z paralaksą i zaślepką, gdy pliku brak
    Me.jsx            „kto prowadzi projekt" — tekst i Twoje zdjęcia
    Brief.jsx         rozmowa zamiast formularza + koperta z pieczęcią
    Cover.jsx         autorskie okładki prac — po jednej kompozycji SVG na projekt
                      (`still` = rysuj od razu, bez animacji — tak jadą karty w 3D)
    Space.jsx         przelot kamerą przez głębię: 9 kart na osi Z + kafel zaproszenia
    Warp.jsx          rybie oko i rozjazd kanałów przy powiększaniu ramki
    Pixels.jsx        pikselowe tło: siatka pieczona raz, magnes tylko przy kursorze
    Chain.jsx         pięć etapów rysowanych scrollem — zamiast akapitu o tym samym
    Jump.jsx          kurtyna: listwy zakrywają ekran, pod nimi skok do sekcji
    SvcArt.jsx        rysunek obok opisu usługi — po jednym na pozycję listy
    Giant.jsx         gigantyczny napis z chodzącymi literami + kafelki spod kursora
    Morph.jsx         napis przechodzący w kolejny litera po literze
    Handoff.jsx       tryptyk rozpychany do pełnego kadru, oddaje scenę dalej
    Cursor.jsx        kursor zmieniający kształt i podpis
    Grain.jsx         faktura papieru
    Loader.jsx        preloader: licznik, listwy odjeżdżające w górę
    Type.jsx          napisy wjeżdżające spod maski (| dzieli wiersze)
    SitePreview.jsx   okładka + żywa witryna w ramce, budzona pod kursorem
    Tour.jsx          podgląd na pełnym ekranie: strona przewija się sama
    Topbar.jsx        nagłówek
    Hero.jsx, Work.jsx, Services.jsx, Process.jsx, Trust.jsx
    Lab.jsx           sekcja „na żywo" + przełącznik zakładek
    lab/
      Knot3D.jsx      węzeł 3D liczony i rysowany na canvasie (bez bibliotek)
      Booking.jsx     działający kalendarz rezerwacji
      Langs.jsx       przełącznik sześciu języków
      Flow.jsx        animowany przepływ automatyzacji
      Scope.jsx       kreator zakresu — składa listę do rozmowy, bez cen
    Finale.jsx        🎬 scena ze sznurkiem i kontaktem
  lib/
    scroll.js         goTo / goToEnd / goToTop
```

## Sekcja „na żywo"

Cztery panele, wszystkie liczone w przeglądarce, bez zewnętrznych bibliotek 3D:

- **Trójwymiar** — węzeł trójlistny. Własna projekcja perspektywiczna, sortowanie
  odcinków po głębi, tusz blednący w tle, obrót myszą lub palcem z bezwładnością.
  Cała matematyka w `lab/Knot3D.jsx`.
- **Rezerwacja** — prawdziwy kalendarz: przeskakiwanie miesięcy, dni przeszłe
  i zajęte wyłączone, wybór godziny, potwierdzenie z rysującą się fajką.
- **Języki** — jedna karta dań w sześciu wersjach, treść w `demoMenu` w `site.js`.
- **Automatyzacja** — ścieżka formularz → baza → mail → SMS → kalendarz
  z wędrującą kropką i dopisującym się logiem.

## Paleta

```
--paper  #F4F2EC   papier
--card   #FCFBF7   arkusz uniesiony
--wash   #E9E6DC   wypełnienia
--ink    #17181A   atrament
--ink-2  #5E6166   tekst drugorzędny
--ink-3  #93969C   etykiety i wymiary
--rule   #DBD7CC   linie
--grid   siatka konstrukcyjna, moduł 32 px
--accent #1B4DF5   niebieski kreślarski
```

## Języki

Słownik siedzi w `src/data/i18n.js` (pl / en / it), a `src/lib/lang.jsx` daje
`useT()` na teksty i `useLang()` na przełącznik. `site.js` trzyma tylko rzeczy
niezależne od języka: adresy, kolory, technologie.

Dodanie języka: dopisz klucz do `dict` w `i18n.js` i wpis do `langs`. Nic więcej.

## Wydajność podglądów — świadomy kompromis

Zmierzone na tej stronie (rAF podczas scrolla przez sekcję prac):

| Żywych ramek w kadrze | fps | najgorsza klatka |
|---|---|---|
| 8 | 14,3 | 387 ms |
| 2 | 28,2 | — |
| 1 | 31,5 | 60 ms |
| 0 | 38,6 | — |

Dziewięć cudzych stron renderujących się jednocześnie nie da się pogodzić
z płynnym scrollem — każda ma własny JavaScript i własne animacje. Dlatego:

- **pierwszy kafel** jest żywy na stałe, żeby sekcja od razu pokazywała prawdę,
- **pozostałe budzą się pod kursorem** (po 170 ms) i gasną 900 ms po zejściu,
  więc montowanie ramki nigdy nie trafia w moment przewijania,
- **pełny podgląd** dostajesz po kliknięciu, w zwiedzaniu.

Odmontowywanie ramek w trakcie scrolla było próbowane i wypadło **gorzej**
(14 fps, klatki po 380 ms) — tworzenie procesu ramki kosztuje więcej niż jej
trzymanie. Stąd obecny układ.

## Zwiedzanie strony

Kliknięcie miniatury otwiera `Tour.jsx`: duża ramka z żywą stroną, która sama
przewija się od góry do dołu przez 20 sekund i wraca — tak, jak przeszedłby po
niej klient. Guzik „otwórz stronę” wyjeżdża od dołu po chwili. Zamyka Esc,
kliknięcie w tło albo krzyżyk.

Podgląd renderuje się przez `createPortal` do `<body>` — arkusze sekcji mają
własny `transform`, więc bez portalu `z-index` liczyłby się tylko w ich obrębie
i podgląd chowałby się pod pływającym CTA.

## Żywe podglądy stron

`SitePreview.jsx` najpierw rysuje lekki szkielet z bloków, a potem dociąga
**prawdziwą stronę w `<iframe>`** (tylko dla aktywnej realizacji i jej sąsiadów),
skalowaną z 1280 px do szerokości ramki. Kiedy strona jest widoczna, powoli
przesuwa się w dół i z powrotem, żeby pokazać więcej.

Nie każdy serwis daje się osadzić — `antiqua-shop.pl` stoi na Shopify z
`frame-ancestors 'none'`, więc ma w danych `embed: false` i zostaje przy
szkielecie. Dla pozostałych jest jeszcze zabezpieczenie w `onFrameLoad`:
jeżeli po zdarzeniu `load` da się odczytać zawartość ramki, znaczy że jest
pusta (zablokowana) i szkielet zostaje.

## Co podmienić przed publikacją

1. `src/data/site.js` → `contact` — mail, telefon, WhatsApp, Instagram, GitHub.
   Teraz są tam dane zastępcze oznaczone `TODO`.
2. `src/data/site.js` → `facts` — liczby są szacunkowe.
3. `src/data/site.js` → `me.available` — komunikat o wolnych terminach.

## Dodanie pracy

```js
{
  id: 'nazwa',
  name: 'Nazwa klienta',
  kind: 'Branża',
  year: '2026',
  tint: '#EBD8C8',     // tło kafla
  lead: 'Dwa zdania o projekcie.',
  points: ['Rzecz 1', 'Rzecz 2'],
  stack: ['Next.js', 'Supabase'],
}
```

Nową okładkę dopisujesz do `ART` w `src/components/Cover.jsx` pod kluczem
równym `id` pracy (viewBox 320×200). Docelową przezroczystość podajesz jako
ostatni argument `draw()` / `pop()`, nie w atrybucie `opacity` — animacja i tak
nadpisałaby atrybut i plama zrobiłaby się czarna.

Na stronie **nie ma cennika i nie ma widełek** — to decyzja, nie przeoczenie.
Zakładka „Zakres" w sekcji na żywo pozwala poklikać, co ma powstać, i składa
z tego listę do rozmowy; wycenę robisz sam, po rozmowie, na piśmie. Etykiety
zakresu siedzą w `scope` w `src/data/i18n-extra.js`.

## Twoje zdjęcia

Wrzuć trzy pliki do `public/me/`:

| plik | gdzie |
|---|---|
| `portret.jpg` | wizytówka w hero (pion, ok. 4:5) |
| `przy-pracy.jpg` | duże zdjęcie w sekcji „kto prowadzi projekt" |
| `biurko.jpg` | mniejsze zdjęcie nachodzące na tamto (poziom) |

JPG albo WEBP, dłuższy bok ok. 1600 px, do 400 kB. Nazwy i proporcje ramek
ustawisz w `photos` w `src/data/site.js`. Dopóki pliku nie ma, w ramce stoi
zaślepka ze ścieżką, której brakuje — strona nigdy nie wygląda na zepsutą.

## Przestrzeń 3D

`Space.jsx` to przelot kamerą przez głębię. Sekcja ma 340vh, scena w środku
jest przyklejona, a scroll przesuwa karty po osi Z — nadlatują z głębi
i mijają czytelnika. Rozstaw kart siedzi w `SEATS` (`[x %, y %, z px]`),
a `--sx` / `--sy` w `deep.css` zwężają go na wąskich ekranach, żeby żadna
karta nie wyszła poza kadr.

Przechył sceny daje `useTilt()`: mysz na komputerze, żyroskop na telefonie.
Na iOS 13+ czujnik wymaga zgody, więc przy dotykowym ekranie pojawia się
przycisk — na biurku nie pokazuje się nigdy.

Wszystko stoi na transformach CSS 3D. **Nie ma tu WebGL-a świadomie**:
kontekst graficzny bywa niedostępny (sandbox, stare sterowniki, oszczędzanie
baterii), a wtedy taka scena nie wstaje w ogóle. Cień kart jest stały —
liczenie go co klatkę dla dziewięciu kart kosztowało ~7 ms na najgorszych
klatkach.

## Tunel na WebGL-u

Sekcja z pracami ma dwie implementacje i wybiera sie sama.

`SpaceGL` to scena R3F: kamera stoi, a **swiat sunie na nia**, wiec
petla to zwykle modulo dlugosci — nie ma zadnego konca, do ktorego dalo
by sie dojechac. Karty siedza na scianie tunelu (kat idzie zlotym katem,
wiec sasiednie nigdy nie ladu ja po tej samej stronie), obrecze
wireframe wyznaczaja przestrzen, a `scene.fog` chowa miejsce, w ktorym
karty wracaja na poczatek.

### Shader kart

Trzy rzeczy zaleza od jednej liczby — gdzie karta jest wzgledem kamery:

| co | skad | efekt |
|---|---|---|
| ostrosc | `uDistance` | daleko i tuz przed obiektywem karta rozsypuje sie na piksele, w pasie 6–12 jednostek jest czysta |
| rozped | `uVelocity` | fala w vertexie, rozjazd kanalow RGB, szum i pasy na krawedziach |
| skupienie | `uFocus` | wybrana karta gasi caly ten halas do zera |

Znieksztalcenia trzymamy **przy krawedziach** (`vEdge` liczone
z odleglosci od srodka UV): srodek karty to tresc, ktora trzeba
przeczytac, a nie miejsce na efekt. `uVelocity` rosnie natychmiast
i opada powoli, wiec po zatrzymaniu obraz uspokaja sie sam, bez
zadnej dodatkowej logiki.

Tekstury rysujemy na plotnie 2D z danych projektu — shader potrzebuje
obrazka, a okladki sa komponentami SVG. Uklad jest **wyliczany
z identyfikatora**, nie losowany, wiec karta nie wyglada inaczej po
kazdym odswiezeniu.

Zrodlo shaderow jest **czystym ASCII**, takze w komentarzach: sterowniki
potrafia odrzucic GLSL ze znakami spoza ASCII, a tego nie da sie
zobaczyc inaczej niz awaria u kogos innego.

### Wybor karty

Klikniecie zatrzymuje przelot, karta odczepia sie od sciany i leci na
wprost obiektywu, prostujac sie po drodze — lot i obrot ida tym samym
parametrem, wiec dziejа sie jednoczesnie, a nie jeden po drugim. Cel
liczy sie **wzgledem kamery w kazdej klatce**, bo kamera nie stoi
w miejscu; sztywna animacja na czas musialaby gonic ruchomy punkt.
Pozostale karty przygasaja (`uDim`).

Opis wybranej pracy jest **zwyklym HTML-em na wierzchu**, nie tekstem
w teksturze. Tekstu w teksturze nie da sie zaznaczyc, przeczytac
czytnikiem ekranu ani zindeksowac, a przycisk narysowany w shaderze nie
jest przyciskiem. Scena robi wrazenie, DOM robi robote — i dzieki temu
panel z nawigacja strzalkami, kafelkami technologii i CTA dziala tak
samo w obu wersjach sekcji.

### Dwie wersje i cena wejscia

`hasWebGL()` sprawdza kontekst raz. Bez akceleracji wchodzi ta sama
sekcja na transformacjach CSS — kontekst graficzny potrafi nie wstac
przez sterownik na czarnej liscie, wylaczona akceleracje albo zdalny
pulpit, a wtedy najwazniejsza sekcja strony bylaby pusta dziura.

Scena jedzie **osobna paczka** (`lazy` + `Suspense`): `three` to okolo
megabajta, wiec pobiera ja tylko ten, u kogo faktycznie wejdzie.
Zmierzone: paczka glowna 168 kB gzip, scena 246 kB gzip dogrywana
osobno; przy fallbacku nie pobiera sie w ogole.

**Uwaga przy zaleznosciach:** `@react-three/fiber` 9 deklaruje
`react >=19 <19.3`. Projekt jest wiec przypiety do React 19.2 —
sprzegniecie R3F z `react-reconciler` to nie miejsce na `--legacy-peer-deps`.

## Telefon: sekcje robione pod szeroki kadr

Kilka rzeczy dzialalo na desktopie i rozsypywalo sie na pionowym
ekranie. Wszystkie zmierzone i poprawione osobno.

**Sekcje przestaly rosnac przy przewijaniu.** `Leaf` wypuszczal tresc na
dodatnie Z, wiec plan mijal kamere i powiekszal sie o okolo 16%. Na
szerokim ekranie to dziala; przy 424 px ten sam ruch rozpychal tekst
poza kadr i nasuwal go na sasiednia sekcje — wygladalo to po prostu jak
psujacy sie uklad. Na telefonie zostaje samo nadlatywanie z glebi.
Zmierzone po zmianie: szerokosc tresci stala, nigdy ponad kadr.

**Hero czyta sie w kolejnosci czytania.** Wizytowka miala `order: -1`,
wiec pierwsza rzecza na ekranie byl splaszczony pasek 300 x 116 z
zastepczym zdjeciem, a dopiero pod nim to, po co ktos tu przyszedl.
Calosc miala 815 px przy kadrze 754. Teraz: plakietka, zdanie, guziki,
a wizytowka na koncu jako podpis z miniatura — i wszystko miesci sie
na jednym ekranie.

**Lancuch etapow to pionowa lista.** W siatce 3+2 piec krokow ukladalo
sie w przypadkowy blok, a rysunek pojawial sie w pustym miejscu obok.

**Kolumny harmonogramu skrocone** do „tyg. 3" — „tydzien 3" nie miescil
sie w naglowku i ucinalo go w polowie.

## Przeplyw automatyzacji: kropka poza torem

Postep byl liczony na pelne 0–100% szerokosci toru, a srodki kolek
wypadaja w 10%, 30%, 50%, 70% i 90% (piec rownych kolumn). Kropka
konczyla wiec bieg **poza ostatnim kolkiem**. Teraz linia laczy pierwsze
kolko z ostatnim, a kropka staje dokladnie na srodkach — zmierzone:
linia 116–308 przy srodkach 115 i 309.

## Czwarty raz ten sam blad

`AnimatePresence mode="wait"` w zakladkach `Lab` robil dokladnie to,
co wczesniej w panelu prac: zakladka zapalala sie na aktywna,
a na scenie zostawala **stara tresc**. Zmierzone: „Automatyzacja"
zaznaczona, a w srodku wciaz brylla z „Trojwymiaru".

To juz czwarte miejsce w tym projekcie, gdzie oparcie logiki
o zakonczenie animacji okazalo sie pulapka — po nawigacji, petli
i przelaczaniu prac. **Animacja moze byc ozdoba kroku, nigdy jego
warunkiem.**

## Teczka: brama do prac

Zanim prace rozjada sie po przestrzeni, leza tam, gdzie lezalyby
naprawde: w jednej teczce, wysuniete tak, ze widac wystajace rogi.
Klikniecie opuszcza przednia kieszen, a karty wachlarzem wychodza w gore
i rozlatuja sie w tunel albo na kolo.

Ruch jest ulozony tak, jak w systemach Apple'a: **nic nie startuje
naraz**. Najpierw rusza kieszen, karty wychodza z opoznieniem rosnacym
od srodka wachlarza, a kazda ma wlasna sprezyne — dzieki temu calosc
czyta sie jako jeden gest, a nie jako piec animacji odpalonych razem.

Teczka otwiera sie **wylacznie klikiem**. Probowalem tez otwierac ja
samym przewinieciem, zeby nie byla pulapka, ale wtedy wachlarz kart
rozlatywal sie, zanim ktokolwiek zdazyl go zobaczyc — gest gubil swoj
moment.

## Nieskonczone przewijanie: trzy rzeczy naraz

Petla przestala dzialac i przyczyny byly trzy, wszystkie z tego samego
zrodla — **hero skurczyl sie po porzadkach dokladnie do jednej wysokosci
ekranu**.

1. **Szew wypadal na ostatnim pikselu dokumentu.** Echo mialo rowno
   jedna wysokosc ekranu, wiec za szwem nie bylo ani piksela zapasu.
2. **Lenis rozpedem wyjezdza poza koniec strony** (zmierzone: 995 px za
   maksimum). Petla cofa o stala dlugosc, wiec z takiego licznika
   ladowala w srodku strony zamiast na gorze. `pos()` jest teraz
   przyciete do zakresu dokumentu.
3. **Dolna krawedz pierwszego ekranu przestala sie zgadzac.** Na gorze
   strony wchodzi na nia zaokraglony rog sekcji „o mnie"; echo tego rogu
   nie mialo. Doklejony `.echo-lip` przywraca brakujacy kawalek kadru
   i przy okazji daje zapas za szwem.

Do tego prog nie puszczal: dystans liczyl sie od zera po kazdym
odbiciu, a kolko sypie porcjami z przerwami dluzszymi niz okno ciszy.
Kazda nieudana proba zostawia teraz **kredyt** (60% przejechanego
dystansu, najwyzej 60% progu), wiec upor poplaca.

Sprawdzone: kadr po obu stronach szwu jest identyczny co do elementu
przy offsetach 0, 60 i 150 px.

## Prace: tunel na duzym ekranie, kolo na telefonie

To nie jest ta sama sekcja w innych stylach, tylko **dwa osobne
komponenty**. Tunel 3D jest zrobiony pod szeroki kadr: na pionowym
ekranie karty albo robia sie mikroskopijne, albo wypycha je bokami.

`Radial.jsx` klada prace na obwodzie **wielkiego kola, ktorego widac
tylko gore** (46%). Przewijanie obraca kolo o pelne 360 stopni, wiec
kolejne prace nadchodza z prawej i schodza w dol. Karta jest zawsze
u gory, duza i na wprost — zamiast stac bokiem gdzies w glebi.
Maska u dolu chowa miejsce, w ktorym karty wjezdzaja pod kadr.

Sprawdzone na 375 px, na piaciu roznych katach obrotu: siedem kart
w kadrze, wszystkie w gornej czesci, zero wysypu w poziomie.

## Tunel wychodzi poza ramy

Sekcja siedziala w tym samym „pudelku" co papierowe panele, wiec karty
rozjezdzajace sie na boki obcinala krawedz marginesu. Tunel to jedyne
miejsce, ktore ma byc bez ram — wychodzi wiec poza `padding` `main`
i zajmuje **cala szerokosc**.

Przy okazji zageszczenie i proporcje: `STEP` 400 -> 300, szerszy pas
pelnego krycia, karty `16/9` zamiast `16/10` i szersze. Zmierzone po
zmianie: sekcja od 0 do krawedzi, **10 kart w kadrze (7 mocnych)**,
proporcja 1.48, zero kart uciętych brzegiem.

## Dlaczego nie Tailwind, TypeScript i shadcn

Karuzela radialna przyszla jako komponent na tych trzech rzeczach.
Zadna z nich nie jest w tym projekcie i **nie zostala dolozona**:
strona stoi na czystym CSS-ie i Framer Motion, a taka konwersja to
przepisanie calosci od zera i realne ryzyko zepsucia tego, co dziala.
Sam efekt — kolo obracane scrollem, czesciowo schowane pod kadrem,
z maska u dolu — jest odtworzony natywnie w `Radial.jsx`.

## Nawigacja nie ma prawa sie zaciac

Skok miedzy sekcjami idzie przez kurtyne: siedem listw zjezdza z gory,
pod nimi widok przeskakuje, listwy schodza. Wykonanie skoku wisialo
jednak w calosci na `onAnimationComplete` **ostatniej listwy** — i to
byl blad, ktory potrafil zabic nawigacje na stale.

Wystarczylo, ze ta jedna animacja nie dobiegla (karta w tle, wstrzymany
`requestAnimationFrame`, przyciecie przy wczytywaniu), a skok sie nie
wykonywal. Gorzej: `job` zostawal zajety, wiec **kazde kolejne
klikniecie w menu bylo juz ignorowane**. Zmierzone: cztery linki
z paska, wszystkie zostawaly na pozycji 0.

Jest wiec bezpiecznik — jesli listwy nie zamelduja sie w pol sekundy,
skok wykonuje sie mimo wszystko. Lepiej cieć bez zaslony niz nie ruszyc
sie wcale. Po poprawce, przy tym samym wstrzymanym rAF: 2512, 7327,
8251, 8970.

To trzeci raz w tym projekcie, kiedy oparcie logiki o zakonczenie
animacji okazalo sie pulapka (wczesniej: `AnimatePresence mode="wait"`
w panelu prac i timer powrotu w petli). Zasada na przyszlosc: **animacja
moze byc ozdoba kroku, nigdy jego warunkiem**.

## Kontrola slownika

`t.grupa.pole` jest rozsiane po kilkudziesieciu plikach i latwo zostawic
klucz, ktorego juz nie ma — tak powstala pusta linia w stopce po
porzadkach w hero. Sprawdzenie jest proste: zaimportowac slownik, przejsc
po wszystkich odwolaniach w `src/` i porownac z trzema jezykami.

Stan na teraz: **124 klucze, wszystkie obecne w pl/en/it, zaden pusty.**
Zero „undefined" i zero „NaN" w tresci w kazdym z jezykow.

## Tunel: wersja na CSS jest ta wlasciwa

Powstala tez wersja na WebGL-u (`SpaceGL.jsx` + `components/gl/`) —
scena R3F z wlasnym `ShaderMaterial`, pikselizacja zalezna od dystansu
i wygieciem od rozpedu. **Nie jest podpieta.** Zostala odrzucona po
obejrzeniu i strona uzywa wersji na transformacjach CSS.

Pliki zostaja na dysku, bo koncepcja moze wrocic, ale nic ich nie
importuje, wiec nie trafiaja do paczki: bundel wrocil z 415 kB do
**167 kB gzip**. W `package.json` zostaly `three`, `@react-three/fiber`
i `@react-three/drei` — nieuzywane. Razem z nimi zostal pin React 19.2
(R3F 9 wymaga `>=19 <19.3`); bez R3F ten pin nie ma juz uzasadnienia.

## Glebia ostrosci kart: plynna, nie skokowa

Rozmycie kart chodzilo w czterech klasach (`d0`–`d3`) i przeskoki miedzy
nimi bylo widac — karta co chwile „strzelala" ostroscia. Progi wzialy
sie z zalozenia, ze rozmycie jest drogie. To prawda, ale **na plachtach
wielkosci ekranu**: na kartach roznica wyszla na granicy szumu
(40.8 ms z rozmyciem kontra 41.8 bez), wiec nie ma czego oszczedzac.
Teraz `filter` idzie z jednej wartosci ruchu, plynnie od 0 do 6.5 px.

## Otwarta praca: minimum

W panelu zostaje to, po co sie tu przychodzi:

1. **sama strona**, na sztorc, przewijajaca sie jak swiezo wczytana;
2. **kafelki z czego jest zrobiona**;
3. **„Odwiedz strone" przyklejone do dolu** kolumny.

Opis i lista punktow zeszly — patrzy sie tu na witryne, nie czyta o niej.
Guzik jest `sticky`, bo panel sie przewija, a to jedyna rzecz, ktora ma
byc pod reka niezaleznie od tego, gdzie akurat jestes. Pod nim jest
podkladka w kolorze karty, inaczej kafelki przewijaja sie „spod" niego
i widac je przez zaokraglone rogi.

Na telefonie strzalki przechodza do naglowka, obok licznika — na dole
nie ma dla nich miejsca, odkad siedzi tam przyklejony guzik. Odsuniete
sa tak, zeby minac krzyzyk: przy pierwszym ustawieniu prawa strzalka
nachodzila na niego o 5 px (zmierzone na 375 px).

## Petla: jeden ciagly dokument

Za finalem stoi echo pierwszej sekcji plus doklejony gorny rog sekcji
„o mnie" (`.echo` + `.echo-lip`). Na gornej krawedzi echa kadr jest
**co do piksela taki sam jak na gorze strony** — i wtedy cofamy pozycje
o dlugosc petli. Sprawdzone: przejscie przy trzech offsetach daje kadr
identyczny z tym samym miejscem osiagnietym od gory.

Trzy rzeczy, bez ktorych to nie jest plynne:

1. **Rozped przezywa cofniecie.** Zapamietujemy dystans, jaki zostal do
   dojechania (`targetScroll - animatedScroll`), i odtwarzamy go w nowym
   miejscu. `scrollTo` ustawiloby obie liczby na nowo i dojazd stanalby
   w miejscu — predkosc za szwem jest teraz dokladnie taka jak przed nim.
2. **Pozycja przycieta do zakresu dokumentu.** Lenis przy rozpedzie
   wyjezdza poza koniec strony (zmierzone: 995 px), a petla cofa o stala
   dlugosc — z takiego licznika ladowala w srodku strony.
3. **Petla dziala w dwie strony i na dotyku.** W gore nie ma zapasu
   przewijania, wiec zdarzenie `scroll` nie przyjdzie; lapiemy intencje
   z kolka **oraz z `touchmove`** (palec w dol = strona w gore, prog 8 px
   odsiewa drgniecia). Wszystko w jednym efekcie z pelnym `cleanup`.

### Czego tu celowo nie ma

Byl prog z oporem: za finalem ruch robil sie ciezki, a widok wracal,
jesli nie napieralo sie dalej. **Usuniete** — realizowal go `transform`
na finale i echu, czyli dokladnie przesuniecie ukladu w chwili
przejscia, a do tego zmienial odczuwana predkosc przewijania. Pętla ma
wygladac jak swiadomy efekt, nie jak szarpniecie; jedno wykluczalo
drugie.

## Prace na telefonie: pozioma szyna

`Rail.jsx` zastapil kolo obracane pionowym przewijaniem. Kolo wygladalo
dobrze, ale **wiezilo**: sekcja byla wysoka i przyklejona, wiec zeby ja
opuscic, trzeba bylo przejechac przez wszystkie prace.

Teraz sekcja ma normalna wysokosc (zmierzone: 725 px przy kadrze 780),
a prace leza na szynie z **natywnym przewijaniem** i `scroll-snap`.
To nie wybor z lenistwa — natywne przewijanie daje za darmo wszystko,
o co tu chodzi: gest palcem z systemowym rozpedem, zatrzymanie w
dowolnym miejscu, a **gest pionowy przechodzi do strony**, wiec sekcje
mozna opuscic w kazdej chwili. Zero nasluchow gestow w JS, wiec nie ma
czego czyscic.

`data-lenis-prevent` na torze jest konieczne: bez niego Lenis
przechwytuje ruch nad szyna i przewija strone zamiast prac. Sprawdzone,
ze osie sa niezalezne: poziomo tor 0 -> 635 przy stronie bez ruchu,
pionowo strona +500 przy torze bez ruchu.

Granica to 900 px, wiec tablet w pionie tez dostaje szyne — tunel 3D
jest robiony pod mysz i szeroki kadr.

## Modal: prawdziwa strona projektu

`LivePreview.jsx` wstawia w modal zwykly `iframe` z adresem pracy,
przewijalny palcem i kolkiem jak mala przegladarka. Pod nim leca
**kafelki technologii z pola `stack`** w danych pracy — nie z sufitu.

Nie ma tu zadnej sztuczki wokol `X-Frame-Options` ani CSP i **nie ma
jej byc**. Zamiast tego wykrywamy odmowe i podmieniamy sie na rysowany
podglad (`SitePreview`) plus wejscie na strone. Wykrycie jest z
koniecznosci posrednie: przy innej domenie nie da sie zajrzec do ramki,
a przegladarki **nie zglaszaja bledu** przy zablokowanym osadzeniu —
`onError` nigdy nie przychodzi. Zostaje czas: jesli `onLoad` nie padnie
w 6 s, uznajemy, ze nie wejdzie. Tam, gdzie z gory wiadomo, dane maja
`embed: false`.

Strona za modalem stoi na `lenis.stop()` **oraz** klasie `locked` na
`body` — samo `stop()` wystarcza dla kolka, ale nie dla dotyku.

## Sekcja „Claudio Taras" na telefonie

Sekcje nie ruszaja sie w glab na waskim ekranie. Ruch po osi Z skaluje
caly plan, a skalowany plan to **skalowany tekst**: przy 390 px akapit
wjezdzal zmniejszony do 87% i mimo poprawnych marginesow wygladal na
wcisniety w przypadkowe miejsce. Wyjscie na dodatnie Z bylo jeszcze
gorsze — powiekszalo plan o 16% i wypychalo tresc na sasiednia sekcje.
Zostaje krycie plus krotki dojazd w pionie; litery maja przez caly czas
swoj docelowy rozmiar, wiec nie ma czego wyrownywac.

Do tego: zdjecia stoja obok siebie zamiast jedno na drugim, metryczka
w jednej kolumnie, plakietka wrocila do wnetrza kadru, a rozmiar tekstu
idzie z szerokosci kadru. Sprawdzone na **360, 390, 424 i 768 px**:
zero nachodzen, zero elementow poza kadrem, zero przewijania w poziomie.

## Panel prac

Wchodzi sie **linkiem „Panel" w stopce** albo adresem z `#admin` na
koncu. Nic tu nie jest schowane, bo nie ma czego chronic: panel zapisuje
do pamieci przegladarki i pobiera plik, niczego nie publikuje.

Trzy kolumny: lista prac, formularz i **podglad na zywo**. Kafel
w podgladzie to ten sam komponent, co w tunelu, wiec nazwa, adres
i kolor leca prosto z pol obok — efekt widac w trakcie pisania, a nie
dopiero po zamknieciu panelu i przewinieciu strony do prac. `key` na
kolorze wymusza przerysowanie okladki, bo rysunek liczy sie przy
montazu.

Na gorze zapala sie znacznik **„niezapisane zmiany"** — bez niego latwo
wyjsc i stracic robote, bo panel trzyma zmiany w pamieci Reacta, dopoki
nie klikniesz „Zapisz".

Sprawdzone: wpisanie nazwy zmienia ja natychmiast na kaflu i na liscie,
zmiana koloru przerysowuje okladke.

### Przy okazji: pusta linia w stopce

`hero.place` wylecialo razem z porzadkami w hero, ale stopka wciaz je
czytala i renderowala pustke. Ma teraz wlasny klucz `finale.where`.

## Petla nie porusza sprezynami

Po przekroczeniu szwu pozycja cofa sie o kilkanascie tysiecy pikseli
naraz. Kadr wyglada wtedy tak samo, wiec dla oka nic sie nie dzieje —
ale **kazda sprezyna podpieta pod scroll dostaje nowa wartosc odlegla
o caly swoj zakres** i grzecznie do niej dojezdza. Po przeskoku wszystko
naraz przelatywalo przez swoje animacje, jakby strona wjezdzala od dolu.

Takich sprezyn jest kilkanascie — plachty sekcji, kamera tunelu,
rysunki hero, zdjecia, final — wiec jest wspolny hak `useLoopSpring`.
Sztuczka polega na tym, **kiedy** przestawic wartosc: w chwili zdarzenia
zrodlo jeszcze nic nie wie, bo `useScroll` przeliczy sie dopiero
w nastepnej klatce. Zdarzenie tylko uzbraja flage, a skok wykonuje sie
przy najblizszej zmianie zrodla.

Pasek postepu i tlo gwiazd maja wlasne rozwiazania tego samego problemu
(`bar.jump()` i ciagly licznik), bo nie sa zwyklymi sprezynami scrolla.

## Pop-out jako przegladarka prac

Otwarta praca nie jest slepym zaulkiem. Skoro jedna juz jest na ekranie,
nastepna powinna byc **o jeden ruch dalej**, a nie o zamkniecie,
wycelowanie w tunelu i kolejne klikniecie. Sa wiec strzalki po bokach,
licznik `03 / 09` przy adresie i klawisze ← →, a na dole sciagawka: skrot,
o ktorym nikt nie wie, to skrot, ktorego nie ma.

Strzalki stoja **poza kolumna**, w wolnej przestrzeni po bokach — tam,
gdzie i tak wedruje kursor, kiedy chce sie „dalej". Na waskim ekranie
schodza na dol panelu, bo wolnych bokow tam nie ma.

Przy zmianie pracy **rama zostaje, wymienia sie tylko srodek** —
z kluczem na `id` calego panelu kazde przejscie zaczynaloby sie od
dolotu z miejsca, w ktorym stala pierwsza kliknieta karta.

I bez `AnimatePresence mode="wait"`. Kazalby czekac, az stara tresc
zniknie: cwierc sekundy dokladana do kazdego ruchu, a przy zatrzymanym
`requestAnimationFrame` panel przestawal reagowac na strzalki w ogole.
Zmiana `key` wymienia tresc natychmiast, a wejscie odgrywa sie samo.

### Podglad zatrzymuje sie pod kursorem

Przejazd strony robi klatka CSS, a nie Framer — dzieki temu wystarczy
`animation-play-state: paused` na `:hover`, zeby najechanie **zatrzymalo
podglad**. Kto widzi jadaca strone, odruchowo chce ja przytrzymac
i sie przyjrzec. Podpowiedz o tym gasnie w chwili, gdy zrobisz to, o czym
mowi. Przy okazji kropki w pasku okna zapalaja sie na czerwono, zolto
i zielono — drobiazg, ktory mowi „to jest okno, mozna z nim cos zrobic".

## Petla jest niewidoczna dla gwiazd

Po przekroczeniu szwu pozycja strony cofa sie o kilkanascie tysiecy
pikseli naraz. Dla widza nic sie nie zmienia, bo kadr jest w tej chwili
identyczny — ale pole gwiazd liczone wprost z `scrollY` dostawalo skok
przez cala strone i sprezyna przejezdzala go na oczach, jakby wszystko
wjezdzalo od dolu.

Gwiazdy jada wiec po **wlasnym, ciaglym liczniku**: sumuja same
przyrosty, a o tym jednym sztucznym petla je uprzedza — w zdarzeniu
`strx:loop` podaje, o ile cofnela widok, wiec przesuwamy o tyle punkt
odniesienia i przyrost wychodzi zerowy.

Odsiewanie po samej wielkosci skoku byloby prostsze, ale odcieloby tez
zwykle skoki z menu — a te maja ruszyc tlem jak kazde inne przewiniecie.

## Otwarta praca: strona na sztorc

Klikniecie karty w tunelu nie otwiera juz szerokiego pop-outu. Karta
leci na srodek i staje sie **waska kolumna** (520 px, z marginesami po
bokach), a kolejnosc czytania jest jedna, z gory na dol:

1. co to jest — adres, nazwa, rodzaj;
2. **sama strona**, w oknie postawionym na sztorc, przewijajaca sie tak,
   jak wyglada scrollowanie swiezo wczytanej witryny;
3. z czego jest zrobiona — kafelki `Vite`, `React` i reszta;
4. **odwiedz strone** — ostatnia rzecz w kolumnie.

Dwie kolumny zmuszaly oko do skakania na boki, a podglad musial byc
polozony, choc strony sa pionowe.

`SitePreview.jsx` sklada ten podglad z okladki projektu (pierwszy ekran)
i kilkunastu blokow ukladu: pasow tekstu, siatek kafli i szerokich plam.
Bloki sa **wyliczane z identyfikatora projektu**, nie losowane przy
kazdym renderze — kazda praca ma wiec wlasny, ale zawsze ten sam uklad;
inaczej podglad przemeblowywalby sie przy kazdym otwarciu. Po prawej
jedzie pasek przewijania: to on mowi, ze patrzysz na strone, a nie na
animowany obrazek.

## Spadajace gwiazdy maja glebokosc

Kazda ma **wlasna glebokosc** — jedna liczbe 0–1, z ktorej wynika cala
reszta: bliska jest duza, jasna, gruba i przelatuje szybko (ok. 1 s),
daleka to cienka, przygaszona kreska sunaca ponad dwie sekundy. Bez tego
wszystkie wygladaly identycznie i po drugim przelocie robily sie tapeta.

Losowy jest tez kierunek (co trzecia leci z prawej w lewo), miejsce
startu, kat i dlugosc smugi, a przerwa miedzy przelotami waha sie od 5
do 16 s, wiec nie da sie zlapac rytmu. Co jakis czas leca dwie naraz, na
roznych glebokosciach.

## Rozstaw kart w tunelu

Karty zlewaly sie w kupe i nie bylo z nich zadnej przestrzeni. Pomiar
przy kadrze 961 x 922 pokazal dlaczego: **osiem kart naraz z pelnym
kryciem**, wszystkie w pasie 213-699 px w poziomie i 350-536 px
w pionie. Bliskie i dalekie swiecily tak samo mocno, wiec oko nie mialo
z czego odczytac dystansu.

Zmienily to trzy rzeczy:

- `STEP` 330 -> **400**, czyli wiekszy odstep w glab;
- rozstaw w pionie x0.9 -> **x1.25** (kadr jest wyzszy niz szerszy,
  a karty trzymaly sie jednego pasa w polowie wysokosci);
- **krycie zalezy od tego, jak daleko karta jest teraz.** Wczesniej
  plaskowyz pelnego krycia ciagnal sie przez 2700 px glebokosci; teraz
  mocna jest tylko ta na wprost, dalsze zostaja jako przygaszone plany.

Po zmianie: **cztery karty mocne, szesc widocznych, zero par
nachodzacych na siebie**, rozrzut 375-639 px w poziomie i 323-791
w pionie.

## Bialy pasek pod plachta

Pod kazdym papierowym panelem sterczal jasny prostokat z ostrymi
narozami. To byla **wlasna podkladka `.leaf::before`**, wystajaca 52 px
pod plachte — dodana wtedy, gdy tlo strony tez bylo papierowe, zeby dryf
plachty nie odslonil szczeliny miedzy sekcjami. Odkad panele plywaja
w kosmosie, ta sama podkladka wychodzila spod zaokraglonego rogu.
Szczelina jest dzis zamierzona, wiec podkladki nie ma — sprawdzone, ze
na calej stronie nie powstala przez to ani jedna dziura.

Z tego samego powodu **nachodzi tylko to, co ma czym przykryc**. Tunel
i gigant sa przezroczyste: wsuniete pod papier nie zakrywaly niczego, za
to odslanialy dolny zapas plachty jako goly pas pustego papieru. Zapas
schodzi tam, gdzie nastepna sekcja jest prozne (`:has(+ .space)`).

## Gwiazdy zyja same

Pole gwiazd nie czeka na scroll — kazdy plan ma **wlasny powolny dryf**
(sinus o okresie 26-44 s), wiec tlo leciutko oddycha takze wtedy, gdy
nikt niczego nie dotyka.

Przy okazji wyszedl blad, ktory wygladal na dzialajacy: `y`
i `translateY` to w Framerze **ta sama** skladowa transformacji, wiec
podanie obu kasowalo jedna z nich i reakcja gwiazd na kursor byla
martwa, choc byla podpieta. Wszystkie skladniki — zawijanie przy
przewijaniu, kursor/przechyl i dryf — sumujemy teraz recznie w jedno
`x` i jedno `y`.

## Co kosztowalo klatki

Trzy pomiary, ktore zmienily kod bardziej niz jakiekolwiek zgadywanie.
Sufit panelu podgladu zmierzony przy ukrytej stronie to **10.7 ms**
(93 fps), wiec wszystko ponizej to koszt samej strony, nie podgladu.

| co | ms na klatke | wniosek |
|---|---|---|
| mgla w tunelu | **70** | wycieta |
| `blur()` na sekcji | 16 | wyciety wczesniej |
| gwiazdy przy dpr 1.5 | 6.3 | zeszly na dpr 1 |
| cienie 90 px | ~4 | przyciete do 22/44 |

**Mgla wolumetryczna byla cala roznica w tunelu**: 106 ms z nia, 42 ms
bez — 9 fps kontra 24. I nie chodzilo o ruch (zatrzymanie mgly nic nie
dalo) ani o warstwe kompozytora (`will-change` tez nie), tylko o samo
mieszanie trzech wielkich gradientow z tym, co jest pod spodem:
gwiazdami, poswiata i winieta. Nad papierem to bylo tanie, nad
przezroczysta sekcja przestalo byc.

Rzeczy, ktore **nie** byly winne, mimo ze wygladaja podejrzanie:
rozmycie kart w tunelu (40.8 vs 41.8 ms), pikseloza i aberracja na
krawedziach, niewidoczne karty (`visibility: hidden` na dziewieciu
z nich pogorszylo wynik), `content-visibility: auto`. Kazda z nich
zostala zmierzona osobno, zanim czegokolwiek dotknalem.

Po zmianach: tunel **28 fps**, sekcje papierowe 31, hero 29 — mierzone
metoda zlosliwa, czyli z wymuszonym `scrollTo` w kazdej klatce i sonda
rAF dzialajaca obok. Zwykle przewijanie jest lzejsze. Reszta kosztu
rozklada sie rowno na dziesiec kart 3D, Lenisa i Reacta; zejscie nizej
wymaga przebudowy tunelu, nie kolejnego drobiazgu.

## Prog na koncu strony

Petla nie odpala sie dlatego, ze ktos machnal kolkiem. Za finalem jest
prog o trzech stanach:

- **opor** — widac 20% ruchu, reszta idzie „w gume";
- **puszczenie** — po 220 ms bez ruchu widok wraca dokladnie na kontakt;
- **upor** — po 420 px prog puszcza i strona leci od nowa.

Opor jest `transform`em na `--drag`, ustawianym na **korzeniu
dokumentu**, wiec trzyma finał i echo razem. Trzymanie samego echa nie
wystarczylo: sekcja kontaktu jest w srodku finalu i odjezdzala przy
napieraniu, przez co opor stawialo sie juz pustce pod nia (zmierzone:
342 px za progiem i kontakt 197 px nad kadrem). Teraz przy 360 px
napieraniu kontakt przesuwa sie ze 156 na 41 px — czyli praktycznie
stoi — i wraca co do piksela.

Prog zaczyna sie na `szew - wysokosc ekranu`, czyli dokladnie tam, gdzie
panel kontaktu dojezdza na swoje miejsce (`useScroll` finalu osiaga 1).
Kazdy zapas w te czy w tamta strone wypycha kontakt z kadru — 120 px
wczesniej i panel jest jeszcze 23% w gorze.

## Trzy bledy petli, ktore warto pamietac

1. **„Kontakt" w menu nie dzialal.** `goToEnd()` skakal na
   `scrollHeight`, a koncem dokumentu jest teraz echo — wiec ladowalo
   sie za szwem, petla domykala sie natychmiast i zamiast kontaktu
   dostawalo sie poczatek strony. `endOfPage()` celuje w koniec
   **tresci**, nie dokumentu.
2. **Przewijanie w gore z hero teleportowalo na gore.** Petla wsteczna
   stawiala dokladnie na szwie, gdzie od razu lapal ja warunek domkniecia
   (`p >= szew`) i odbijalo z powrotem. Ladujemy 4 px przed szwem.
3. **Powrot na final odpalal sie po wyjsciu ze strefy.** Timer ciszy
   strzelal nawet wtedy, gdy widok byl juz dawno gdzie indziej, wiec
   strona sama wracala na kontakt. `wroc()` sprawdza teraz pozycje
   **prosto z dokumentu** — licznik Lenisa po skoku, ktory go ominal,
   jest jeszcze w starym miejscu.

## Kosmos: przestrzen, w ktorej lezy strona

Sekcje sa nieprzezroczystymi plachtami, wiec dopoki tlo bylo kolorem,
nie dalo sie zobaczyc, ze cokolwiek dzieje sie w glebi — 3D bylo
w kodzie, ale nie na ekranie. `Cosmos.jsx` kladzie pod wszystkim pole
gwiazd na **trzech planach**. Scroll przesuwa je z roznym tempem
(zmierzone: 238 / 555 / 1030 px na 4000 px przewijania), a kursor —
albo przechyl telefonu — przesuwa je w bok.

Co kilkanascie sekund przelatuje **spadajaca gwiazda** — jedna sztuka
na cala strone, z losowego miejsca. Rzecz, ktora leci bez przerwy,
przestaje byc zdarzeniem i zaczyna byc tapeta.

**Gwiazdy rysuja sie raz.** Kazdy plan to jedno plotno wypalone przy
montazu; potem rusza sie wylacznie `transform`, czyli praca karty
graficznej. Rysowanie ich co klatke byloby przemalowaniem calego ekranu
w kolko — dokladnie ten koszt, przez ktory wylecial stad blur.

Pole jest **kaflowane**. Pierwsza wersja miala plotno wysokosci 1.6
ekranu i najszybsza warstwa po chwili z niego wyjezdzala: ponizej 154 px
kadru nie bylo juz zadnej gwiazdy. Teraz gwiazdy losuja sie w pasie
`KAFEL = 480 px`, pas powtarza sie tyle razy, ile trzeba na zakrycie
ekranu z zapasem, a przesuniecie idzie modulo `KAFEL` — obraz wraca na
identyczny co do piksela, wiec pole jest nieskonczone i nic nie mruga.

### Papierowe panele w tej przestrzeni

`main` dostaje `padding: 0 var(--float)` i zaokraglone naroza, wiec
plachty przestaja stykac sie z krawedziami ekranu i widac, ze pod nimi
cos jest. Rytm jest celowy: **hero i tunel prac to sama przestrzen**
(przezroczyste tlo, odwrocone kolory), a wszystko miedzy nimi to
papierowe panele unoszace sie w niej.

To wymagalo dwoch rzeczy, ktore inaczej cichutko psuja kadr:

- `cosmos.css` wczytuje sie **na koncu** — nadpisuje tla sekcji, wiec
  wczytany po `global.css` przegrywal kaskade z `deep.css` i tunel
  zostawal bialy;
- jasny kolor sekcji **nie moze wsiakac w jasne karty**. Wizytowka
  w hero i karty w tunelu dziedziczyly go i ich podpisy stawaly sie
  biale na bialym; oba miejsca maja wiec wlasny reset do atramentu.

## Koniec strony, ktory stawia opor

Strona nie wpada w kolejny obieg dlatego, ze ktos za mocno machnal
kolkiem. Za finalem jest **prog**:

- **opor** — za finalem echo jedzie razem ze strona, wiec widac tylko
  40% ruchu (zmierzone: 170 px przewijania to 68 px w kadrze);
- **puszczenie** — po 220 ms bez ruchu widok wraca dokladnie na final;
- **upor** — po 300 px prog puszcza, echo wraca na miejsce w 340 ms
  i strona leci od nowa.

Opor jest **przesunieciem echa**, nie walka o pozycje przewijania.
Pierwsza wersja wymuszala `targetScroll` Lenisa i to sie nie bronilo
z dwoch powodow: cala paczka zdarzen z kolka trafia do Lenisa, zanim
nasz kod ja zobaczy (`targetScroll` skakal od razu o 800 px), a samo
przewijanie i tak przechodzilo natywnie i pozycja rosla mimo
przypiecia. Czysty `transform` dziala niezaleznie od tego, kto akurat
rzadzi pozycja.

## Ikony etapow rysuja sie na swoim punkcie

W `Chain.jsx` ikony wisialy wczesniej na ekranie od razu, przygaszone,
i tylko pulsowaly po kolei — rysunek byl gotowy, zanim cokolwiek do
niego dojechalo. Teraz ikona **rysuje sie dopiero wtedy**, gdy impuls
jest przy jej kropce, i chowa sie z powrotem, kiedy przejdzie dalej.

Zeby to bylo mozliwe, ikony sa trzymane jako **dane** — lista
`[sciezka, docelowe krycie]` — bo `pathLength` da sie animowac tylko na
`motion.path`, a z gotowego fragmentu JSX nie dalo sie tego wyciagnac.
Iskra przebiega szyne w czasie `LOOP`, wiec etap `i` wypada
w `((i + 0.5) / liczba) * LOOP`; zegar chodzi co 100 ms i zmienia stan
piec razy na obieg. Ikona ma **staly slot** 38 px — bez niego SVG
rozpychalo komorke siatki i wiersz podskakiwal przy kazdym rysunku.

## Pop out: strona i jej metryczka

Kliknieta praca wychodzi na srodek i pokazuje **podglad strony,
a bezposrednio pod nim z czego jest zrobiona**. Kafelki technologii
staly wczesniej na koncu opisu w prawej kolumnie, przez co pod
podgladem zostawala pusta polowa panelu. Reszta wchodzi po kolei:
opis, punkty, na samym koncu guzik — dopiero gdy jest juz co czytac.

## Przechyl telefonu

`usePointer` czyta teraz nie tylko kursor, ale i **przechyl
urzadzenia** (`deviceorientation`, `gamma` i `beta` zwezone do ±26°,
bo telefon trzyma sie w waskim wachlarzu). Dzieki temu wszystko, co
zylo tylko pod mysza — rysunki wokol hero, wizytowka, gwiazdy w tle —
zaczyna reagowac na to, jak trzymasz telefon. O zgode na czujnik prosi
guzik w sekcji z pracami; obowiazuje dla calej strony.

## Nakładające się sekcje

Cała strona ma **jedną zasadę ruchu**: scroll przesuwa kamerę wzdłuż osi Z,
a sekcje stoją nieruchomo w głębi i przelatujesz przez nie. Nie ma osobnych
wejść „coś wjeżdża od dołu" — jest jedna przestrzeń (`main { perspective }`)
i plany rozstawione w niej jeden za drugim.

Każdą sekcję opakowuje `Leaf`. Arkusz wjeżdża **spod** poprzedniego (ujemny
`margin-top` równy `--leaf-over`) i kładzie się na nim: rosnący `z-index`,
zaokrąglona górna krawędź i cień na górze.

**W głąb leci treść, nie płachta** — i to jest sedno. Przesuwanie całej sekcji
po osi Z się nie broni: płachta jest na całą szerokość, więc odsunięta
przestaje zakrywać ekran i między planami robi się dziura. Kompensacja skalą
też nie pomaga, bo przeglądarka wpisuje `scale` już po dzieleniu
perspektywicznym — plan dalej miał zmierzone 77% szerokości. Tło zostaje więc
płaskie i pełnoekranowe, a w przestrzeni porusza się `.leaf-inner`:
z −540 px przez zero aż do +300 px, kiedy mija kamerę.

Plan mijający kamerę rośnie (1400/(1400−300) ≈ 1.27×) i wychodzi poza ekran —
stąd `overflow-x: clip` na `main`. `clip`, a nie `hidden`, bo nie zakłada
kontenera przewijania i `position: sticky` w tunelu dalej działa.

Głębokość nachodzenia zmienisz jedną zmienną: `--leaf-over` w `stage.css`.

## Dlaczego nie ma głębi ostrości

Była i została wycięta. `blur()` na warstwie wielkości ekranu kosztował
**16 ms na klatkę** — zmierzone 43 ms z rozmyciem, 27 ms bez, czyli 24 fps
kontra 34 fps. Promień nie miał z tym nic wspólnego (połowa promienia dała
ten sam wynik), bo płaci się nie za samo rozmycie, tylko za to, że warstwa
jedzie w perspektywie i musi rasteryzować się od nowa w każdej klatce.
Przeniesienie filtra na dziecko też nie pomogło.

Dystans niosą więc rzeczy, które kompozytor robi za darmo: przezroczystość
i welon `.leaf-dim`. Rozkład krycia jest przez to celowo wcześniejszy —
przy ostrzejszym zbieganiu sekcja zakrywała 45% ekranu, mając 19% krycia,
czyli pod spodem była biała pustka zamiast czegoś dalekiego.

## Wejścia z głębi zamiast wjazdów od dołu

`Deep.jsx` to jedno wspólne wejście dla wszystkiego, co pojawia się w sekcji.
Wcześniej każdy kafelek wjeżdżał od dołu (`y: 24 → 0`) — osiem plików, osiem
lekko innych wersji tego samego, i wszystkie płaskie: rzecz przesuwała się
**po** ekranie. Teraz rzecz leży dalej w przestrzeni, odchylona od widza,
i dojeżdża na wprost kamery.

`transformPerspective` siedzi na samym elemencie celowo. Wspólna perspektywa
z rodzica ustawia punkt zbiegu w środku sekcji, więc kafelki z lewej i prawej
wjeżdżałyby skosem w przeciwne strony; własna perspektywa daje każdemu ruch
prosto na widza.

Na telefonie perspektywa jest większa (2200 px), czyli efekt łagodniejszy —
na 375 px co czwarty piksel szerokości poza kadrem to dużo. Przy wyłączonych
animacjach w systemie `MotionConfig reducedMotion="user"` wycina ruch, ale
zostawia przezroczystość, więc treść wchodzi zamiast zniknąć.

## Piksel lata, a nie wyskakuje

`Guide.jsx` trzyma **jeden** egzemplarz maskotki przyklejony do środka
okna i przesuwa go sprężyną między rogami. Z prędkości lotu liczy się
przechył, obrót i spłaszczenie, więc widać rozpęd i wyhamowanie zamiast
samego przeniesienia. Kiedy nie ma nic do powiedzenia, Piksel odlatuje
poza kadr — nadal lecąc, nie gasnąc.

Dlatego `.piksel` musi zostać `position: fixed` z punktem odniesienia
w środku ekranu (`left/top: 50%` + `translate: -50% -50%`). Wszelkie
zbiorcze reguły ustawiające mu `position: relative` odklejają go od okna.

## Finał: chwyt i ciągnięcie

Sznurek nie jest osobną animacją obok maskotki — jego długość liczy się
z tej samej funkcji `pikselY(v)`, co pozycja Piksela, więc po chwycie
nie ma jak się odkleić. Do chwytu koniec liny zjeżdża z góry ku dłoniom,
w momencie złapania scena raz szarpie, a potem:

- lina napina się proporcjonalnie do prędkości zjazdu (`useVelocity`),
- panel jedzie na **wyraźnie miększej sprężynie** niż Piksel.

To opóźnienie robi cały ciężar: lina napina się pierwsza, płachta rusza
chwilę potem i dojeżdża z lekkim przeciągnięciem.

Nagłówek w panelu jedzie ze scrolla, nie z `whileInView`. Panel wjeżdża
własnym transformem wewnątrz przyciętej sceny i obserwator widoczności
nie łapał tam wjazdu — tytuł zostawał schowany pod maską na zawsze.

## Finał: jedno wejście, cała scena

Sekcja **nie wisi na przewijaniu**. `run` jedzie od zera do jedynki
własnym tempem, kiedy finał wjedzie w kadr — wystarczy raz doscrollować
i chwyt, szarpnięcie oraz zjazd panelu rozgrywają się same, w ~4 s.
Wyjście z kadru cofa animację, więc wracając widzisz ją od początku.

Dlatego sekcja ma 175vh, a nie 300vh: nie trzeba już przewijać przez
pół ekranu na każdy krok.

## Klikanie kart w tunelu 3D

Karty **nie lapia klikniec same z siebie** (`pointer-events: none`).
Przegladarka testuje trafienie na NIEprzeksztalconym pudelku elementu,
a karty siedza gleboko w osi Z — klikalna byla tylko ta najblizej
obiektywu. Trafienia liczy wiec jeden uchwyt na scenie: przy kliknieciu
mierzy rzeczywiste prostokaty kart i wybiera te pod kursorem, najblizsza
kamery. Pomiar leci tylko przy zdarzeniu.

Druga polowa problemu byla geometryczna: perspektywa rozpycha karty na
boki tym mocniej, im blizej obiektywu, wiec **odlatywaly poza ekran z
pelnym kryciem** i nie bylo w co kliknac. Dlatego `NEAR` jest niskie
(60) — karta gasnie, zanim zdazy wyjechac z kadru.

Klikniecie nie otwiera panelu z boku, tylko `Focus.jsx`: warstwa
startuje dokladnie w prostokacie klikietej karty i **dolatuje na srodek
ekranu**, tam sie powieksza i rozwija opis. Robimy to osobna warstwa, bo
karta w scenie wisi na kilku wartosciach sterowanych scrollem naraz i
przejecie ich na chwile konczy sie szarpnieciem przy powrocie.

## Hero: rysunki na glebokosciach

`HeroArt.jsx` rozstawia szesc znakow z tego, z czego sklada sie robota:
okno przegladarki, kursor, nawias klamrowy, bryla, przeplyw automatyzacji
i siatka ukladu. Kazdy ma wlasna **glebokosc 0–1** i od niej zalezy, jak
mocno reaguje na kursor i jak szybko odjezdza przy scrollu — stad
wrazenie wchodzenia w kadr zamiast przesuwania naklejek.

Rysuja sie kreska przy wejsciu na strone. Na telefonie zostaja dwa,
z nadpisanymi pozycjami — przy tych z desktopu polowa ikony wisiala poza
kadrem.

## Rozpad krawedzi a tempo scrolla

`rush` rosnie z predkoscia kamery i **sam opada**, gdy przestajesz
krecic. Dzielnik jest dobrany pomiarem, nie na oko:

| tempo | px na klatke | rozpad |
|---|---|---|
| spokojne | 14 | 0.08 |
| zwykle | 60 | 0.63 |
| szarpniecie | 190 | 0.75 |
| postoj | 0 | 0 |

Przy poprzednim dzielniku (11) wszystko powyzej wolnego ruchu dawalo
jedynke i wolno/szybko wygladalo identycznie.

## Dzwiek

Cala warstwa dzwiekowa jest **generowana w kodzie** (`src/lib/sound.js`):
oscylatory i szum z Web Audio, zero plikow, zero transferu. Sa cztery
rodzaje zdarzen — stukniecie, musniecie, wyskok karty, przeciagniecie —
plus cicha poduszka w tle, ktora podnosi sie w tunelu 3D i cichnie poza
nim.

**Domyslnie jest cisza i to nie jest przeoczenie.** Przegladarki i tak
blokuja dzwiek przed pierwszym kliknieciem, a strona, ktora sama
zaczyna grac, wygania ludzi. Na gorze stoi przelacznik; po wlaczeniu
wszystko odzywa sie samo, a wybor zapamietuje sie miedzy wizytami.

Guziki nie wiedza nic o dzwieku: jeden nasluch w `Sound.jsx` sprawdza,
czy klikniecie trafilo w cos, co ma brzmiec. Nowy guzik gdziekolwiek na
stronie dostaje dzwiek za darmo.

## Strona bez konca

Nie ma skoku i nie ma zaslony (o progu, ktory trzeba przelamac, jest
osobny rozdzial wyzej). Za finalem stoi **echo pierwszej sekcji** —
ten sam hero, tylko bez identyfikatora i bez maskotki (`<Hero ghost />`
w `.echo`). Kiedy przewijanie dojedzie do jego gornej krawedzi, kadr jest
co do piksela taki sam jak na samej gorze strony. W tej jednej chwili
`Loop.jsx` cofa pozycje dokladnie o dlugosc petli. Nic nie mruga, bo nic
sie nie zmienia — zmienia sie tylko liczba, ktorej nikt nie widzi.

Dwie rzeczy, bez ktorych to nie dziala:

1. **Rozped musi przezyc cofniecie.** Lenis trzyma `animatedScroll`
   (gdzie jest) i `targetScroll` (dokad leci). `scrollTo` ustawiloby obie
   na nowo i plynny dojazd stanalby w miejscu. Zapamietujemy wiec sam
   dystans, ktory zostal do dojechania, i odtwarzamy go w nowym miejscu.
2. **Zrodlem zdarzen jest Lenis, nie okno.** Natywne `scroll` leca pod nim
   wybiorczo — zmierzone jedno zdarzenie na dwa przewiniecia. Natywny
   nasluch zostaje jako zapas dla przypadkow bez Lenisa.

Pozycja szwu lezy w pamieci i nie jest mierzona co klatke;
`ResizeObserver` tylko ja uniewaznia, a przeliczenie dzieje sie przy
najblizszym ruchu — pomiar wywolany prosto z obserwatora zapetlal sie.

Pasek postepu dostaje `bar.jump()`, bo sprezyna przejechalaby przez caly
pasek z powrotem: bylaby jedyna rzecza na ekranie, ktora zdradza, ze cos
sie stalo. W gore dziala to tak samo — krecenie na samej gorze przenosi
do echa, wiec strona nie ma tez poczatku (lapane z kolka, bo na zerze nie
ma juz zapasu przewijania).

## Glebia w tunelu 3D

Trzy warstwy skladaja sie na wrazenie przestrzeni:

1. **Glebia ostrosci.** Karty dostaja `blur()` w czterech stopniach
   (`.d0`–`.d3`), przelaczanych klasa, a nie plynna wartoscia. Plynne
   rozmycie znaczyloby przemalowanie dziesieciu kart na kazda klatke;
   tak karta przeskakuje miedzy stopniami pare razy na caly przelot,
   a oko czyta to jako ciagle — bo tak zachowuje sie obiektyw.
2. **Rybie oko.** Zakrzywienie rosnie razem ze zblizaniem: daleka karta
   jest prawie plaska, bliska mocno odwrocona i z pekatymi rogami.
3. **Mgla wolumetryczna.** Trzy plachty na roznych glebokosciach
   (`.space-fog`) plus winieta. To one buduja przestrzen — obiekt w
   pustce wyglada jak wycinanka, obiekt za warstwami powietrza ma
   dystans. Dwie plachty dryfuja wolniej niz karty.
4. **Pikseloza i rozjazd kanalow — TYLKO na obwodzie.** Maska to ramka
   o stalej grubosci (`mask-composite: exclude` na dwoch warstwach plus
   `padding`), a nie miekka poswiata z centrum. Rozsypuje sie sam brzeg,
   srodek karty zostaje czysty.

Ramka karty jest identyczna dla wszystkich — ten sam promien, ta sama
obwodka, ten sam pasek z nazwa i rokiem. Rozniac ma je tylko okladka.

## Jedyna kolorowa sekcja

Pas z gigantycznym napisem (`.giant`) to jedyne miejsce na stronie,
ktore nie jest papierem i atramentem: nasycony gradient blekit → indygo
→ fiolet, biala typografia, pikselowa siatka w wersji `tone="light"`.
Jest po to, zeby bylo widac, ze powsciagliwosc reszty jest wyborem, a
nie ograniczeniem. **Jedna taka sekcja wystarczy** — druga zabralaby
jej cala sile.

## Finał: kiedy rusza

Warunkiem nie jest „widac kawalek sekcji", tylko przyklejenie sceny:
`useScroll` na sekcji, start przy postepie > 0.015. `useInView` sie tu
nie nadaje — sekcja jest wyzsza niz ekran, wiec nigdy nie bedzie
widoczna „w calosci" i `amount: 0.98` nie odpalilby sie nigdy.

## Rytm ruchu

Wszystkie krzywe, czasy i sprezyny siedza w `src/lib/motion.js`. Nie
dopisuj wlasnych w komponentach — od tego strona zrobila sie ociezala:
byly trzy rozne krzywe i animacje po 0,85–1,1 s.

Zasady:

- ruch startuje natychmiast i spokojnie dochodzi, **bez odbicia**;
- reakcja na kursor i dotyk trwa `--tap` (0,16 s), nie dluzej;
- elementy wjezdzaja od skali 0,985, **nigdy od zera**;
- rzeczy z masa (panel kontaktu, plyty, kurtyna) maja `SPRING.heavy`;
- wszystko, co wisi na scrollu, wygladza `SPRING.scroll`.

Po stronie CSS to samo: jedna zmienna `--ease` i dwa czasy, `--tap`
oraz `--fast`. Zadnych lokalnych `cubic-bezier` w arkuszach.

Typografia idzie ciasniej wraz ze stopniem: `.display` ma `-0.045em`
i interlinie 0,95, `.title` `-0.038em` i 0,98. Duzy tekst nie
potrzebuje tyle swiatla, co maly.

## Panel prac

Otwierasz adresem z `#admin` na końcu, np. `twojadomena.pl/#admin`.
Dodajesz, kasujesz, przestawiasz kolejność i edytujesz nazwę, adres,
rok, kolor kafla, opis, listę „co zawiera" i technologie.

Strona jest statyczna — nie ma serwera, który by cokolwiek zapisał.
Dlatego panel działa tak:

- **Zapisz** — zmiany lądują w pamięci Twojej przeglądarki i widzisz je
  natychmiast, ale tylko u siebie.
- **Pobierz projects.json** — dostajesz gotowy plik. Wrzucasz go do
  `public/data/projects.json` i od tej chwili widzą go wszyscy.
- **Przywróć** — kasuje lokalne zmiany i wraca do pliku.

Kolejność źródeł czyta `src/lib/projects.js`: pamięć przeglądarki →
`public/data/projects.json` → lista wbudowana w kod.

Miejsca kart w przestrzeni 3D liczą się **same** (złoty kąt na spirali),
więc lista może mieć pięć pozycji albo dwadzieścia — wysokość sekcji
i zasięg przelotu dopasują się bez ruszania kodu.

Opisy dziewięciu pierwszych wdrożeń są w słowniku (bo są w trzech
językach). Wszystko dodane w panelu nosi opis przy sobie — `textOf()`
w `projects.js` bierze najpierw słownik, potem pola z projektu.

## Lekkość

Trzy rzeczy trzymają stronę przy życiu i łatwo je zepsuć:

0. **Nie odczytuj układu co klatkę.** `Piksel3D` wołał
   `getBoundingClientRect()` dwa razy na klatkę — raz na sobie, raz na
   wskazywanym elemencie. Każdy taki odczyt każe przeglądarce przeliczyć
   układ całej strony, a że reszta serwisu wisi na transformach ze
   scrolla, robiło się z tego zacinanie. Teraz pomiar idzie 10 razy na
   sekundę, a `asleep` zatrzymuje rysowanie zaparkowanej maskotki.

1. **`Pixels` piecze spokojną siatkę raz**, do bufora poza ekranem. Co
   klatkę idzie jedno `drawImage` plus kilkadziesiąt bloków w promieniu
   kursora — nie ~1700 `fillRect`, jak w pierwszej wersji. Gdy kursor
   jest poza sekcją i scroll nie przyspiesza, pętla nie rysuje wcale.
2. **Cienie na ruchomych warstwach muszą być wąskie.** Płyty w sekcji
   przekazania ciągle zmieniają skalę, a każde przeskalowanie każe
   przemalować całą poświatę — stąd `0 16px 36px`, nie `0 40px 90px`.

Pomiary w panelu podglądu mają rozrzut rzędu ±5 fps i panel bywa
zamrożony, więc traktuj je jako orientacyjne, a nie jako wynik.

## Gdzie staje Piksel

Nie w sztywnym rogu. `Guide.jsx` mierzy element wskazywany przez `point`
i sadza maskotkę po tej stronie, gdzie zostało więcej wolnego miejsca —
a jeżeli margines jest za wąski, schodzi pod element. Na ekranie do
900 px nie ma żadnego marginesu, więc Piksel siada nisko przy lewej
krawędzi, z dala od pływającego przycisku kontaktu.

## Skok do sekcji

Klik w nawigację nie przewija przez pół strony. `scroll.js` zgłasza skok
zdarzeniem, `Jump.jsx` zaciąga kurtynę z siedmiu listw, pod nią przenosi
widok natychmiast i odsłania już nową sekcję.

Jedna pułapka: **nie wolno wołać `lenis.stop()` przed skokiem** —
zatrzymany Lenis ignoruje `scrollTo` i widok zostaje na miejscu. Skok
idzie wprost, z `force: true`.

## Zmiana języka

Polski, angielski i włoski mają różnej długości zdania, więc po podmianie
słownika sekcje puchną albo się kurczą. `LangProvider` zapamiętuje przed
zmianą sekcję, którą właśnie czytasz, i offset w jej wnętrzu, a po
przeliczeniu układu wraca dokładnie w to samo miejsce — dzięki temu
przełącznik nie przerzuca strony gdzie indziej.

Hooki `useT()` / `useLang()` siedzą w `lib/lang-ctx.js`, a sam provider
w `lib/lang.jsx`. Ten podział jest konieczny: dopóki mieszkały w jednym
pliku, Fast Refresh wywalał moduł przy każdej zmianie słownika i konsola
sypała fałszywym „useT poza LangProvider".

## Piksel

Maskotka jest liczona w 3D i rysowana na canvasie: ciało to kula, oczy i usta
siedzą na jej powierzchni, więc przy obrocie po niej wędrują. Ręka celuje
w konkretny element na ekranie — stąd pokazywanie palcem.

Każda sekcja woła `useGuide({ id, text, corner, mood, point })`:

- `corner`: `tl` | `tr` | `bl` | `br` — z którego rogu wychodzi
- `mood`: `spokoj` | `mowi` | `zdziwiony` | `ciagnie` | `drzemka`
- `point`: selektor CSS elementu, który ma pokazać palcem

Piksel nie wisi na ekranie cały czas — wychodzi przy każdej nowej kwestii
i po kilku sekundach chowa się z powrotem. Kliknięcie przedłuża pobyt.

## Brief zamiast formularza

Kontakt to pięć pytań zadawanych po kolei (`components/Brief.jsx`): imię, czego
potrzebujesz, na kiedy, gdzie odpisać, dwa zdania o firmie. Na końcu klapka
koperty zamyka się nad odpowiedziami, przybija się lakowa pieczęć STRX,
a treść trafia do przycisku `mailto:` — działa bez żadnego serwera. Obok
przycisk kopiujący całość do schowka.

## Drobiazgi

- `window.__lenis` jest wystawiony — `window.__lenis.scrollTo(y)`.
- `prefers-reduced-motion` wyłącza płynny scroll.
- Build: ok. 120 kB gzip JS, 3,6 kB gzip CSS.
