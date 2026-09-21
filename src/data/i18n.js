// ═══════════════════════════════════════════════════════════
//  Wszystkie teksty strony w trzech językach.
//  Struktura projektów (adresy, kolory, stack) siedzi w site.js —
//  tutaj są tylko rzeczy do przetłumaczenia.
//
//  Ton: pierwsza osoba, krótkie zdania, konkret zamiast przymiotników.
//  Piszę tak, jak mówię do klienta przy kawie — bez sloganów.
// ═══════════════════════════════════════════════════════════

import { extra } from './i18n-extra'

export const langs = [
  { code: 'pl', label: 'PL', name: 'Polski' },
  { code: 'en', label: 'EN', name: 'English' },
  { code: 'it', label: 'IT', name: 'Italiano' },
]

export const dict = {
  /* ─────────────────────────── POLSKI ─────────────────────────── */
  pl: {
    meta: {
      title: 'STRX · strony i aplikacje, które robię sam',
      description: 'Claudio Taras. Projektuję i koduję strony, sklepy i rezerwacje online, z panelem i automatyzacjami. Dziewięć stron online, Sardynia i Polska.',
    },

    nav: { prace: 'Prace', nazywo: 'Na żywo', uslugi: 'Co robię', proces: 'Jak pracuję', kontakt: 'Kontakt' },

    hero: {
      badge: 'Jedna osoba, nie agencja',
      head: 'Strony, które|robię od początku|do końca sam.',
      role: 'Strony i aplikacje',
      intro:
        'Projektuję, koduję i podpinam wszystko, co ma działać w tle. Dziewięć moich stron jest teraz online. Możesz je otworzyć niżej.',
      cta1: 'Zobacz prace',
      cta2: 'Napisz do mnie',
    },

    me: {
      label: 'Kto to robi',
      title: 'Cześć,|jestem Claudio.',
      stamp: 'bez podwykonawców',
      p1: 'Jestem pół Włochem, pół Polakiem. Mam {age} {years}, po szkole informatycznej zostałem przy stronach i tak już zostało. Najbardziej lubię projekty, w których trzeba coś wymyślić, a nie tylko wstawić tekst w szablon.',
      chain: ['Rozmowa', 'Szkic', 'Budowa', 'Start', 'Opieka'],
      one: 'Całość robię sam.',
      oneNote: ' Rozmawiasz z tą samą osobą od pierwszego szkicu do startu.',
      creds: [
        ['Imię', 'Claudio Taras'],
        ['Korzenie', 'włoskie i polskie'],
        ['Szkoła', 'technikum informatyczne'],
        ['Języki', 'polski, włoski, angielski'],
        ['Gdzie', 'Sardynia i Polska, zdalnie'],
      ],
      cta: 'Napisz do mnie',
    },

    work: { label: 'Prace', visit: 'otwórz' },

    items: {
      oltre: {
        kind: 'Studia i przeprowadzka za granicę · platforma',
        lead: 'Firma pomaga w studiach, wizach i przeprowadzce. Strona jest w sześciu językach, a najwięcej pracy siedzi w tle: usługi zmieniają się zależnie od obywatelstwa, a sprawy klientów prowadzi się w panelu.',
        points: [
          'Sześć języków z jednego źródła tekstów',
          'Globus 3D, który obracasz i przybliżasz, także palcem',
          'Po wyborze obywatelstwa widać tylko pasujące usługi i dokumenty',
          'Panel: zapytania, terminy, eksport do CSV, powiadomienia',
        ],
      },
      pizzeria: {
        kind: 'Pizzeria z zamówieniami · jeszcze nie online',
        lead: 'Cała droga zamówienia: od koszyka do ekranu w kuchni. Do tego mapa dostaw i panel, w którym właściciel sam zmienia kartę.',
        points: [
          'Koszyk, potwierdzenie mailem i lista „moje zamówienia”',
          'Osobny ekran dla kuchni z kolejką zamówień',
          'Mapa dostaw z szacowanym czasem',
          'Naklejki na pudełku, które spadają jak prawdziwe',
        ],
      },
      spabi: {
        kind: 'Pizzeria · Santa Teresa Gallura',
        lead: 'Pizza z pieca na drewno. Chciałem, żeby strona wyglądała jak plakat: duże retro litery, „MAMMA MIA!” na pół ekranu i maskotka, która prowadzi po menu.',
        points: [
          'Ekran „zaraz wracamy” z wejściem do gotowej strony',
          'Menu, ulubione dania, lokale i kontakt na jednej stronie',
          'Animacje przy przewijaniu: ciągnąca się mozzarella, warstwy ciasta',
          'Rezerwacja stolika, która sama rozsyła powiadomienia',
        ],
      },
      shistoria: {
        kind: 'Restauracja i koktajl bar · Rena Majore',
        lead: 'Rodzinny lokal od 1996 roku. Technicznie najtrudniejsza z moich stron: gość może złożyć własny koktajl, historia lokalu to oś czasu, a scena 3D obraca się przy przewijaniu.',
        points: [
          'Kreator koktajli: gość składa drink i zapisuje go na stronie',
          'Galeria koktajli wymyślonych przez gości',
          'Historia lokalu od 1996 do 2026 na interaktywnej osi',
          'Ekran ładowania z nalewającym się drinkiem',
        ],
      },
      carruleddhi: {
        kind: 'Wyścig i wydarzenie · edycja 2026',
        lead: 'Zjazd ręcznie budowanych wózków bez silnika. Strona odlicza czas do startu, przyjmuje zgłoszenia i zbiera głosy publiczności.',
        points: [
          'Odliczanie do startu co do sekundy',
          'Zapisy zawodników i licznik zgłoszeń na żywo',
          'Głosowanie publiczności',
          'Podium, poprzednie edycje, trasa i program',
        ],
      },
      villadea: {
        kind: 'Apartament wakacyjny · Aglientu',
        lead: 'Apartament dla czterech osób, 1,8 km od plaż Capo Testa. Na Booking.com ma 9.8, więc strona pokazuje to od razu i pozwala zarezerwować bez pośrednika.',
        points: [
          'Rezerwacja prosto ze strony',
          'Zdjęcia wnętrz, tarasu z widokiem na morze i ogrodu',
          'Opinie gości i ocena 9.8 z Booking.com',
          'Wersja polska i włoska, opis okolicy i dojazdu',
        ],
      },
      gioielleria: {
        kind: 'Jubiler · sklep internetowy',
        lead: 'Sklep z biżuterią Morellato, Trussardi, Luca Barra i Lamborghini. Produkty wczytują się same, a sklep działa w kilku językach pod jednym adresem.',
        points: [
          'Koszyk i cała ścieżka zakupu',
          'Kolekcje, bestsellery i strony marek',
          'Katalog pobierany i tłumaczony automatycznie',
          'Języki w adresie strony (/it, /en)',
        ],
      },
      cagliariclub: {
        kind: 'Oficjalny fanklub · Santa Teresa Gallura',
        lead: 'Fanklub Cagliari Calcio i pamięć o Gigim Rivie. Strona w sześciu językach, wszystkie z jednego źródła tekstów.',
        points: [
          'Sześć języków, zmiana jednym kliknięciem',
          'Ludzie klubu i jego historia',
          'Galeria i strefa kibica „Area Cagliari”',
          'Sekcja pamięci Gigiego Rivy (1944–2024)',
        ],
      },
      ilgirasole: {
        kind: 'Restauracja i pizzeria · Santa Teresa Gallura',
        lead: 'Kuchnia sardyńska i pizza, taras przy głównym placu. Szybka strona z kartą dań, opiniami gości i rezerwacją stolika.',
        points: [
          'Karta restauracji i bar koktajlowy w jednym miejscu',
          'Opinie gości na stronie',
          'Rezerwacja stolika i mapa dojazdu',
          'Teksty po włosku, pisane pod wyszukiwanie w okolicy',
        ],
      },
      renabianca: {
        kind: 'Bar przy plaży · Santa Teresa Gallura',
        lead: 'Śniadania, obiady i aperitivo z widokiem na plażę Rena Bianca. Na stronie jest wideo, panorama zatoki i całe menu na sezon.',
        points: [
          'Wideo w tle i panorama zatoki',
          'Menu 2025 w sześciu działach, od kawy po pizzellę',
          'Galeria „nasze chwile” i opinie gości',
          'Rezerwacja stolika prosto ze strony',
        ],
      },
      antiqua: {
        kind: 'Fotoceramika nagrobkowa · sklep',
        lead: 'Pracownia, która robi zdjęcia na nagrobki, na ceramice i szkle. Sklep stoi na Shopify, ale motyw napisałem od zera, razem z kreatorem, w którym klient sam składa zamówienie.',
        points: [
          'Kreator zamówienia: kształt, materiał, retusz',
          'Połączenie dwóch zdjęć w jedno przed produkcją',
          'Cennik, pytania i odpowiedzi, tryb ciemny',
          'Motyw Shopify napisany od zera',
        ],
      },
    },

    lab: {
      label: 'Na żywo',
      title: 'Poklikaj.|To naprawdę działa.',
      lead: 'Kilka kawałków wyjętych z moich stron. Działają tutaj, w Twojej przeglądarce. To nie są nagrania.',
      live: 'działa na żywo',
      tabs: { trojwymiar: '3D', rezerwacja: 'Rezerwacja', jezyki: 'Języki', automat: 'Automatyzacja' },
      hints: {
        trojwymiar: 'Złap i obróć. To się liczy na bieżąco, to nie film.',
        rezerwacja: 'Wybierz dzień i godzinę. Tak samo działa to u klienta.',
        jezyki: 'Jeden tekst, sześć wersji. Przełącz i zobacz.',
        automat: 'Kliknij i zobacz, co się dzieje po wysłaniu formularza.',
      },
    },

    knot: { hint: 'złap i obróć' },

    booking: {
      pick: 'Wybierz termin',
      empty: 'Kliknij wolny dzień w kalendarzu. Szare są zajęte.',
      book: 'Zarezerwuj stolik',
      done: 'Rezerwacja przyjęta',
      doneNote: 'Na prawdziwej stronie gość dostałby teraz maila, a właściciel SMS-a.',
      again: 'Jeszcze raz',
      at: 'godz.',
      months: ['styczeń', 'luty', 'marzec', 'kwiecień', 'maj', 'czerwiec', 'lipiec', 'sierpień', 'wrzesień', 'październik', 'listopad', 'grudzień'],
      monthsOf: ['stycznia', 'lutego', 'marca', 'kwietnia', 'maja', 'czerwca', 'lipca', 'sierpnia', 'września', 'października', 'listopada', 'grudnia'],
      prev: 'Poprzedni miesiąc',
      next: 'Następny miesiąc',
      dow: ['pn', 'wt', 'śr', 'cz', 'pt', 'so', 'nd'],
    },

    flow: {
      send: 'Wyślij zgłoszenie',
      running: 'Leci…',
      again: 'Jeszcze raz',
      caption: 'Co dzieje się samo po jednym kliknięciu',
      nodes: [
        ['Formularz', 'gość wysyła'],
        ['Baza', 'zapis rezerwacji'],
        ['Mail', 'potwierdzenie'],
        ['SMS', 'do właściciela'],
        ['Kalendarz', 'nowy wpis'],
      ],
      log: [
        'formularz wysłany',
        'rezerwacja zapisana w bazie',
        'mail z potwierdzeniem wysłany',
        'SMS doszedł do właściciela',
        'wpis dodany do kalendarza',
      ],
    },

    services: {
      label: 'Co robię',
      title: 'W czym|mogę pomóc.',
      lead: 'Wygląd, animacje, 3D, panel, automatyzacje i języki. Wszystko to robię sam.',
      items: [
        ['Projekt', 'Kroje pisma, kolory i układ dobieram pod konkretną firmę. Nie biorę gotowego motywu.'],
        ['Animacje', 'Rzeczy ruszają się przy przewijaniu i reagują na kursor. Płynnie, także na starszym telefonie.'],
        ['3D w przeglądarce', 'Produkt, który klient obraca palcem. Wczytuje się po kawałku, więc strona nie zwalnia.'],
        ['Panel dla właściciela', 'Menu, ceny, zdjęcia i terminy zmieniasz sam, z telefonu. Nie musisz do mnie dzwonić.'],
        ['Automatyzacje', 'Jedno zgłoszenie trafia naraz do maila, SMS-a, kalendarza i arkusza. Także w nocy.'],
        ['Języki i Google', 'Kilka wersji językowych z jednego tekstu. Dane firmy opisane tak, żeby Google je dobrze pokazywał.'],
      ],
    },

    process: {
      label: 'Jak pracuję',
      title: 'Pięć kroków.',
      lead: 'Zwykle dwa do pięciu tygodni. Zależy, ile trzeba podpiąć.',
      scroll: 'przewijaj',
      steps: [
        ['Rozmowa', 'Pytam o Twoich klientów i o to, co strona ma dla nich robić.'],
        ['Kierunek', 'Pokazuję jeden gotowy ekran. Kod piszę dopiero, gdy Ci się spodoba.'],
        ['Budowa', 'Robię sekcję po sekcji. Postęp widzisz na podglądzie codziennie.'],
        ['Podpięcie', 'Baza, panel, maile, rezerwacje. Testuję na prawdziwych telefonach.'],
        ['Start', 'Domena, statystyki, krótkie szkolenie. Potem dalej jestem pod telefonem.'],
      ],
    },

    finale: {
      label: 'Kontakt',
      title: 'Piksel ma jeszcze|jedno zadanie.',
      lead: 'Przewiń dalej. On wie, gdzie jest kontakt.',
      cLabel: 'Napisz',
      cTitle1: 'Pogadajmy',
      cTitle2: 'o Twojej stronie.',
      cLead: 'Pięć krótkich pytań. Zajmie Ci to minutę.',
      back: 'Na górę',
      where: 'Sardynia i Polska · zdalnie',
      panel: 'Panel',
    },

    brief: {
      q: [
        'Jak masz na imię?',
        'Czego potrzebujesz?',
        'Kiedy możemy pogadać?',
        'Gdzie mam odpisać?',
        'Co Cię najbardziej interesuje?',
      ],
      ph: ['Anna', '', '', '', 'Np. strona z rezerwacjami dla mojej restauracji…'],
      opts: [
        [],
        ['Strona firmowa', 'Sklep', 'Rezerwacje online', 'Coś innego'],
        [],
        [],
        [],
      ],
      inne: 'Napisz w kilku słowach, czego szukasz',
      dogadac: 'Po prostu się odezwij',
      dogadacSub: 'Napiszę do Ciebie i razem ustalimy resztę.',
      termin: 'Umówmy rozmowę',
      terminSub: 'Wybierz dzień i godzinę.',
      najblizsze: 'Najbliższe wolne',
      wybierzDzien: 'Wybierz dzień w kalendarzu.',
      godzina: 'Godzina',
      strefa: 'czas polski i włoski',
      dzis: 'dziś',
      jutro: 'jutro',
      email: 'E-mail',
      telefon: 'Telefon',
      jednoLubOba: 'Wystarczy jedno z dwóch.',
      zlyEmail: 'Temu adresowi czegoś brakuje.',
      zlyTel: 'Numer z {kod} ma {ile} cyfr.',
      zlyTelOgolny: 'Sprawdź numer i wpisz go bez kierunkowego.',
      pomin: 'Pomiń, pogadamy',
      next: 'Dalej',
      seal: 'Wyślij',
      back: 'wstecz',
      lecisz: 'Pocztówka leci do Claudia',
      okTitle: 'Doszło. Dzięki, {imie}!',
      okText: 'Odezwę się {gdzie}, zwykle tego samego albo następnego dnia.',
      okTermin: 'Słyszymy się {kiedy}.',
      naMail: 'mailem',
      naTel: 'telefonicznie',
      naOba: 'mailem albo telefonicznie',
      errTitle: 'Pocztówka nie doleciała.',
      errText: 'To nie Twoja wina. Wyślij to samo mailem, treść już jest gotowa.',
      tooMany: 'Za dużo prób naraz. Poczekaj minutę albo wyślij mailem.',
      send: 'Wyślij mailem',
      retry: 'spróbuj jeszcze raz',
      restart: 'wróć do formularza',
      mailSubject: 'Zapytanie ze strony',
      mailHi: 'Cześć, tu',
      mailNeed: 'Czego potrzebuję',
      mailWhen: 'Kiedy',
      mailContact: 'Kontakt do mnie',
      mailAbout: 'Co mnie interesuje',
    },

    story: {
      kicker: 'Jak powstaje strona',
      chapters: [
        ['Rozmowa', 'dzień 1–2', 'Najpierw pytam.', 'Zanim cokolwiek narysuję, chcę wiedzieć, kto wejdzie na Twoją stronę i po co. Z tej rozmowy wychodzi wycena i termin, na piśmie.', ['Wycena jedną kwotą', 'Termin na piśmie']],
        ['Szkic', 'tydzień 1', 'Potem szkicuję.', 'Układ, kroje pisma i kolory pod Twoją firmę, bez gotowego motywu. Pokazuję jeden gotowy ekran. Kod piszę, gdy Ci się spodoba.', ['Projekt od zera', 'Jeden ekran do akceptacji']],
        ['Kod', 'tydzień 2–3', 'Buduję warstwa po warstwie.', 'Sekcja po sekcji, z animacjami i 3D tam, gdzie coś dają. Postęp widzisz codziennie na podglądzie, także w telefonie.', ['Animacje przy przewijaniu', '3D w przeglądarce', 'Podgląd codziennie']],
        ['Podpięcia', 'tydzień 4', 'Podpinam to, co pracuje w tle.', 'Panel, w którym sam zmieniasz menu i ceny. Rezerwacje, maile, SMS-y i kalendarz, które działają same, także w nocy.', ['Panel dla właściciela', 'Automatyzacje', 'Kilka języków']],
        ['Start', 'tydzień 5', 'I puszczam ją w świat.', 'Domena, statystyki, Google i krótkie szkolenie z panelu. Potem dalej jestem pod telefonem. Tak powstało dziewięć stron, które zaraz zobaczysz.', ['Domena i Google', 'Szkolenie', 'Opieka po starcie']],
      ],
      bubbles: ['Cześć! Potrzebuję strony dla restauracji.', 'Z rezerwacjami, po polsku i po włosku.', 'Jasne. Kto najczęściej do Was przychodzi?'],
      plytki: ['Panel', 'E-mail', 'SMS', 'Kalendarz'],
    },

    guide: {
      hero: 'Cześć, jestem Piksel. Pokażę Ci, co tu jest. Przewijaj spokojnie.',
      about: 'Tu jest trochę o Claudiu.',
      work: 'W ramce jest prawdziwa strona, nie zrzut ekranu.',
      lab: 'Wszystko tutaj działa naprawdę. Poklikaj.',
      services: 'Najedź na listę, a opis obok się zmieni.',
      story: 'Przewijaj powoli. Zobaczysz, jak powstaje strona.',
      process: 'Kliknij etap, a zobaczysz, co wtedy dostajesz.',
    },

    loader: ['rozkładam gwiazdy', 'budzę Piksela', 'rozgrzewam animacje', 'gotowe'],
    who: 'Piksel',
  },

  /* ─────────────────────────── ENGLISH ─────────────────────────── */
  en: {
    meta: {
      title: 'STRX · websites and apps I build myself',
      description: 'Claudio Taras. I design and code websites, shops and online booking, with an owner panel and automations. Nine sites live, based in Sardinia and Poland.',
    },

    nav: { prace: 'Work', nazywo: 'Live', uslugi: 'What I do', proces: 'How I work', kontakt: 'Contact' },

    hero: {
      badge: 'One person, not an agency',
      head: 'Websites I build|from start to finish,|on my own.',
      role: 'Websites and apps',
      intro:
        'I design them, code them and wire up everything that runs behind the scenes. Nine of my sites are live right now. You can open them below.',
      cta1: 'See my work',
      cta2: 'Get in touch',
    },

    me: {
      label: 'Who does this',
      title: 'Hi,|I’m Claudio.',
      stamp: 'no subcontractors',
      p1: 'I’m half Italian, half Polish, and {age} years old. I got into websites at IT school and never really stopped. My favourite projects are the ones where you have to come up with something, not just drop text into a template.',
      chain: ['Chat', 'Sketch', 'Build', 'Launch', 'Care'],
      one: 'I do all of it myself.',
      oneNote: ' You talk to the same person from the first sketch to launch day.',
      creds: [
        ['Name', 'Claudio Taras'],
        ['Roots', 'Italian and Polish'],
        ['School', 'IT technical school'],
        ['Languages', 'Polish, Italian, English'],
        ['Based', 'Sardinia and Poland, remote'],
      ],
      cta: 'Get in touch',
    },

    work: { label: 'Work', visit: 'open' },

    items: {
      oltre: {
        kind: 'Studying and moving abroad · platform',
        lead: 'The company helps people with studies, visas and moving abroad. The site runs in six languages, and most of the work is under the hood: services change with your citizenship, and client cases are handled in a panel.',
        points: [
          'Six languages from one set of texts',
          'A 3D globe you can spin and zoom, with a finger too',
          'Pick a citizenship and you only see the services and documents that apply',
          'Panel: enquiries, dates, CSV export, notifications',
        ],
      },
      pizzeria: {
        kind: 'Pizzeria with online orders · not live yet',
        lead: 'The whole life of an order, from the basket to the kitchen screen. Plus a delivery map and a panel where the owner edits the menu.',
        points: [
          'Basket, email confirmation and a “my orders” page',
          'A separate kitchen screen with the order queue',
          'Delivery map with an estimated time',
          'Stickers on the box that fall like real ones',
        ],
      },
      spabi: {
        kind: 'Pizzeria · Santa Teresa Gallura',
        lead: 'Wood-fired pizza. I wanted the site to feel like a poster: big retro letters, “MAMMA MIA!” across half the screen and a mascot that shows you around the menu.',
        points: [
          'A “back soon” screen with a way into the finished site',
          'Menu, favourites, locations and contact on one page',
          'Scroll animations: stretchy mozzarella, layers of dough',
          'Table booking that sends out its own notifications',
        ],
      },
      shistoria: {
        kind: 'Restaurant and cocktail bar · Rena Majore',
        lead: 'A family place since 1996, and the most technical site I’ve built. Guests can make their own cocktail, the history is an interactive timeline, and a 3D scene turns as you scroll.',
        points: [
          'Cocktail builder: guests mix a drink and save it on the site',
          'A gallery of cocktails invented by guests',
          'The place’s history from 1996 to 2026 on a timeline',
          'A loading screen with a drink being poured',
        ],
      },
      carruleddhi: {
        kind: 'Race and event · 2026 edition',
        lead: 'A downhill race of hand-built carts with no engine. The site counts down to the start, takes sign-ups and collects the crowd’s votes.',
        points: [
          'Countdown to the start, to the second',
          'Racer sign-up and a live entry counter',
          'Crowd voting',
          'Podium, past editions, route and schedule',
        ],
      },
      villadea: {
        kind: 'Holiday apartment · Aglientu',
        lead: 'An apartment for four, 1.8 km from the Capo Testa beaches. It’s rated 9.8 on Booking.com, so the site shows that up front and lets guests book directly.',
        points: [
          'Book straight from the site',
          'Photos of the rooms, the sea-view terrace and the garden',
          'Guest reviews and the 9.8 score from Booking.com',
          'Polish and Italian versions, the area and how to get there',
        ],
      },
      gioielleria: {
        kind: 'Jeweller · online shop',
        lead: 'A jewellery shop selling Morellato, Trussardi, Luca Barra and Lamborghini. Products load in on their own, and the shop runs in several languages on one domain.',
        points: [
          'Cart and the full checkout',
          'Collections, best-sellers and brand pages',
          'Catalogue pulled in and translated automatically',
          'Language in the address (/it, /en)',
        ],
      },
      cagliariclub: {
        kind: 'Official fan club · Santa Teresa Gallura',
        lead: 'A Cagliari Calcio fan club, and a tribute to Gigi Riva. The site is in six languages, all from one set of texts.',
        points: [
          'Six languages, one click to switch',
          'The club’s people and its history',
          'Gallery and the “Area Cagliari” fan zone',
          'A memorial section for Gigi Riva (1944–2024)',
        ],
      },
      ilgirasole: {
        kind: 'Restaurant and pizzeria · Santa Teresa Gallura',
        lead: 'Sardinian food and pizza, with a terrace on the main square. A fast site with the menu, guest reviews and table booking.',
        points: [
          'Restaurant menu and cocktail bar in one place',
          'Guest reviews on the site',
          'Table booking and a map',
          'Italian copy written for local search',
        ],
      },
      renabianca: {
        kind: 'Beach bar · Santa Teresa Gallura',
        lead: 'Breakfast, lunch and aperitivo looking out on Rena Bianca beach. The site has video, a panorama of the bay and the full menu for the season.',
        points: [
          'Background video and a bay panorama',
          'The 2025 menu in six sections, from coffee to pizzella',
          'An “our moments” gallery and guest reviews',
          'Table booking right from the site',
        ],
      },
      antiqua: {
        kind: 'Memorial photo ceramics · shop',
        lead: 'A workshop that puts photos on ceramic and glass for gravestones. The shop runs on Shopify, but I wrote the theme from scratch, along with a builder customers use to put their order together.',
        points: [
          'Order builder: shape, material, retouching',
          'Two photos merged into one before production',
          'Prices, FAQ and a dark mode',
          'Shopify theme written from scratch',
        ],
      },
    },

    lab: {
      label: 'Live',
      title: 'Click around.|It actually works.',
      lead: 'A few pieces taken from my sites. They’re running right here in your browser. No recordings.',
      live: 'running live',
      tabs: { trojwymiar: '3D', rezerwacja: 'Booking', jezyki: 'Languages', automat: 'Automation' },
      hints: {
        trojwymiar: 'Grab it and spin it. It’s rendered live, not a video.',
        rezerwacja: 'Pick a day and a time. It works the same way on a client’s site.',
        jezyki: 'One text, six versions. Switch and see.',
        automat: 'Click and watch what happens after a form is sent.',
      },
    },

    knot: { hint: 'grab and spin' },

    booking: {
      pick: 'Pick a time',
      empty: 'Click a free day in the calendar. Grey ones are taken.',
      book: 'Book a table',
      done: 'Booked',
      doneNote: 'On a real site, the guest would get an email right now and the owner a text.',
      again: 'Try again',
      at: 'at',
      months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
      monthsOf: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
      prev: 'Previous month',
      next: 'Next month',
      dow: ['mo', 'tu', 'we', 'th', 'fr', 'sa', 'su'],
    },

    flow: {
      send: 'Send the form',
      running: 'Sending…',
      again: 'Run it again',
      caption: 'What happens on its own after one click',
      nodes: [
        ['Form', 'guest sends it'],
        ['Database', 'booking saved'],
        ['Email', 'confirmation'],
        ['Text', 'to the owner'],
        ['Calendar', 'new entry'],
      ],
      log: [
        'form sent',
        'booking saved to the database',
        'confirmation email sent',
        'text delivered to the owner',
        'entry added to the calendar',
      ],
    },

    services: {
      label: 'What I do',
      title: 'What I can|help you with.',
      lead: 'Design, animation, 3D, an owner panel, automations and languages. I do all of it myself.',
      items: [
        ['Design', 'Fonts, colours and layout chosen for your business. No off-the-shelf themes.'],
        ['Animation', 'Things move as you scroll and react to the cursor. Smoothly, even on an older phone.'],
        ['3D in the browser', 'A product your customer can turn with a finger. It loads bit by bit, so the page stays quick.'],
        ['An owner panel', 'Change the menu, prices, photos and dates yourself, from your phone. No need to call me.'],
        ['Automations', 'One enquiry goes to email, text, calendar and a spreadsheet at once. At night too.'],
        ['Languages and Google', 'Several language versions from one text. Business details set up so Google shows them properly.'],
      ],
    },

    process: {
      label: 'How I work',
      title: 'Five steps.',
      lead: 'Usually two to five weeks. It depends on how much needs hooking up.',
      scroll: 'keep scrolling',
      steps: [
        ['Chat', 'I ask about your customers and what the site needs to do for them.'],
        ['Direction', 'I show you one finished screen. I only start coding once you like it.'],
        ['Build', 'Section by section. You can see progress on a preview link every day.'],
        ['Hook-up', 'Database, panel, emails, bookings. Tested on real phones.'],
        ['Launch', 'Domain, analytics, a short walkthrough. After that I’m still a call away.'],
      ],
    },

    finale: {
      label: 'Contact',
      title: 'Piksel has one|more job to do.',
      lead: 'Keep scrolling. He knows where the contact form is.',
      cLabel: 'Write',
      cTitle1: 'Let’s talk',
      cTitle2: 'about your site.',
      cLead: 'Five short questions. It takes about a minute.',
      back: 'Back to top',
      where: 'Sardinia and Poland · remote',
      panel: 'Panel',
    },

    brief: {
      q: [
        'What’s your name?',
        'What do you need?',
        'When can we talk?',
        'Where should I reply?',
        'What are you most interested in?',
      ],
      ph: ['Anna', '', '', '', 'E.g. a booking site for my restaurant…'],
      opts: [
        [],
        ['Company website', 'Online shop', 'Online booking', 'Something else'],
        [],
        [],
        [],
      ],
      inne: 'Tell me in a few words what you’re after',
      dogadac: 'Just get in touch',
      dogadacSub: 'I’ll message you and we’ll sort out the rest together.',
      termin: 'Book a call',
      terminSub: 'Pick a day and a time.',
      najblizsze: 'Next free',
      wybierzDzien: 'Pick a day in the calendar.',
      godzina: 'Time',
      strefa: 'Central European Time',
      dzis: 'today',
      jutro: 'tomorrow',
      email: 'Email',
      telefon: 'Phone',
      jednoLubOba: 'Either one is enough.',
      zlyEmail: 'This address is missing something.',
      zlyTel: 'Numbers with {kod} have {ile} digits.',
      zlyTelOgolny: 'Check the number and leave out the country code.',
      pomin: 'Skip, we’ll talk',
      next: 'Next',
      seal: 'Send',
      back: 'back',
      lecisz: 'The postcard is on its way to Claudio',
      okTitle: 'Got it. Thanks, {imie}!',
      okText: 'I’ll get back to you {gdzie}, usually the same or the next day.',
      okTermin: 'Talk {kiedy}.',
      naMail: 'by email',
      naTel: 'by phone',
      naOba: 'by email or phone',
      errTitle: 'The postcard didn’t make it.',
      errText: 'Not your fault. Send the same thing by email, the text is already written.',
      tooMany: 'Too many tries at once. Wait a minute or send it by email.',
      send: 'Send by email',
      retry: 'try again',
      restart: 'back to the form',
      mailSubject: 'Enquiry from your site',
      mailHi: 'Hi, this is',
      mailNeed: 'What I need',
      mailWhen: 'When',
      mailContact: 'You can reach me at',
      mailAbout: 'What I’m interested in',
    },

    story: {
      kicker: 'How a site gets made',
      chapters: [
        ['Chat', 'day 1–2', 'First, I ask.', 'Before I draw anything, I want to know who’ll visit your site and why. That chat gives you a quote and a date, in writing.', ['One-number quote', 'Date in writing']],
        ['Sketch', 'week 1', 'Then I sketch.', 'Layout, fonts and colours made for your business, no ready-made theme. I show you one finished screen and only start coding once you like it.', ['Designed from scratch', 'One screen to approve']],
        ['Code', 'week 2–3', 'I build it layer by layer.', 'Section by section, with animation and 3D where they actually help. You see progress on a preview every day, on your phone too.', ['Scroll animations', '3D in the browser', 'Daily preview']],
        ['Hook-up', 'week 4', 'I wire up what runs behind it.', 'A panel where you change the menu and prices yourself. Bookings, emails, texts and a calendar that run on their own, at night too.', ['Owner panel', 'Automations', 'Several languages']],
        ['Launch', 'week 5', 'And send it out into the world.', 'Domain, analytics, Google and a short walkthrough of the panel. After that I’m still a call away. That’s how the nine sites you’re about to see were made.', ['Domain and Google', 'Walkthrough', 'Care after launch']],
      ],
      bubbles: ['Hi! I need a website for my restaurant.', 'With bookings, in English and Italian.', 'Sure. Who comes to you most often?'],
      plytki: ['Panel', 'Email', 'Text', 'Calendar'],
    },

    guide: {
      hero: 'Hi, I’m Piksel. I’ll show you around. Scroll at your own pace.',
      about: 'Here’s a bit about Claudio.',
      work: 'The frame shows the real site, not a screenshot.',
      lab: 'Everything here really works. Have a click.',
      services: 'Hover the list and the description next to it changes.',
      story: 'Scroll slowly and watch a site being built.',
      process: 'Tap a step to see what you get at that point.',
    },

    loader: ['scattering stars', 'waking Piksel up', 'warming up', 'ready'],
    who: 'Piksel',
  },

  /* ─────────────────────────── ITALIANO ─────────────────────────── */
  it: {
    meta: {
      title: 'STRX · siti e app che faccio da solo',
      description: 'Claudio Taras. Progetto e programmo siti, negozi e prenotazioni online, con pannello e automazioni. Nove siti online, tra Sardegna e Polonia.',
    },

    nav: { prace: 'Lavori', nazywo: 'Dal vivo', uslugi: 'Cosa faccio', proces: 'Come lavoro', kontakt: 'Contatti' },

    hero: {
      badge: 'Una persona, non un’agenzia',
      head: 'Siti che faccio|dall’inizio alla fine,|da solo.',
      role: 'Siti e applicazioni',
      intro:
        'Li disegno, li programmo e collego tutto quello che deve funzionare dietro. Nove miei siti sono online adesso. Li trovi qui sotto.',
      cta1: 'Guarda i lavori',
      cta2: 'Scrivimi',
    },

    me: {
      label: 'Chi lo fa',
      title: 'Ciao,|sono Claudio.',
      stamp: 'niente subappalti',
      p1: 'Sono metà italiano e metà polacco, ho {age} anni. Ho iniziato con i siti alla scuola di informatica e non ho più smesso. I progetti che preferisco sono quelli dove bisogna inventarsi qualcosa, non solo mettere testo in un modello.',
      chain: ['Chiacchierata', 'Bozza', 'Sviluppo', 'Lancio', 'Assistenza'],
      one: 'Faccio tutto io.',
      oneNote: ' Parli con la stessa persona dalla prima bozza fino al lancio.',
      creds: [
        ['Nome', 'Claudio Taras'],
        ['Origini', 'italiane e polacche'],
        ['Scuola', 'istituto tecnico informatico'],
        ['Lingue', 'italiano, polacco, inglese'],
        ['Dove', 'Sardegna e Polonia, da remoto'],
      ],
      cta: 'Scrivimi',
    },

    work: { label: 'Lavori', visit: 'apri' },

    items: {
      oltre: {
        kind: 'Studiare e trasferirsi all’estero · piattaforma',
        lead: 'L’azienda aiuta con studi, visti e trasferimenti all’estero. Il sito è in sei lingue e il grosso del lavoro sta dietro: i servizi cambiano in base alla cittadinanza e le pratiche dei clienti si gestiscono da un pannello.',
        points: [
          'Sei lingue da un solo insieme di testi',
          'Un globo 3D da girare e ingrandire, anche col dito',
          'Scegli la cittadinanza e vedi solo i servizi e i documenti giusti',
          'Pannello: richieste, date, esportazione CSV, notifiche',
        ],
      },
      pizzeria: {
        kind: 'Pizzeria con ordini online · non ancora online',
        lead: 'Tutto il percorso dell’ordine, dal carrello allo schermo in cucina. In più la mappa delle consegne e un pannello dove il titolare cambia il menù da solo.',
        points: [
          'Carrello, conferma via email e pagina “i miei ordini”',
          'Uno schermo per la cucina con la coda degli ordini',
          'Mappa delle consegne con il tempo stimato',
          'Adesivi sulla scatola che cadono come quelli veri',
        ],
      },
      spabi: {
        kind: 'Pizzeria · Santa Teresa Gallura',
        lead: 'Pizza al forno a legna. Volevo che il sito sembrasse un manifesto: lettere retrò enormi, “MAMMA MIA!” su mezzo schermo e una mascotte che ti porta in giro per il menù.',
        points: [
          'Una schermata “torniamo subito” con l’ingresso al sito finito',
          'Menù, piatti preferiti, locali e contatti in una pagina',
          'Animazioni allo scroll: mozzarella che fila, strati di impasto',
          'Prenotazione del tavolo che invia da sola le notifiche',
        ],
      },
      shistoria: {
        kind: 'Ristorante e cocktail bar · Rena Majore',
        lead: 'Un locale di famiglia dal 1996, e il sito più tecnico che ho fatto. Gli ospiti possono creare il loro cocktail, la storia è una linea del tempo interattiva e una scena 3D gira mentre scorri.',
        points: [
          'Crea il tuo cocktail: l’ospite lo compone e lo salva sul sito',
          'Una galleria di cocktail inventati dagli ospiti',
          'La storia del locale dal 1996 al 2026 su una linea del tempo',
          'Schermata di caricamento con un drink che si versa',
        ],
      },
      carruleddhi: {
        kind: 'Gara ed evento · edizione 2026',
        lead: 'Una discesa di carretti costruiti a mano, senza motore. Il sito fa il conto alla rovescia, raccoglie le iscrizioni e i voti del pubblico.',
        points: [
          'Conto alla rovescia al secondo',
          'Iscrizioni e contatore in tempo reale',
          'Voto del pubblico',
          'Podio, edizioni passate, percorso e programma',
        ],
      },
      villadea: {
        kind: 'Appartamento vacanze · Aglientu',
        lead: 'Un appartamento per quattro, a 1,8 km dalle spiagge di Capo Testa. Su Booking.com ha 9.8, quindi il sito lo mostra subito e fa prenotare senza intermediari.',
        points: [
          'Prenotazione direttamente dal sito',
          'Foto degli interni, della terrazza vista mare e del giardino',
          'Recensioni e voto 9.8 da Booking.com',
          'Versione italiana e polacca, la zona e come arrivare',
        ],
      },
      gioielleria: {
        kind: 'Gioielleria · negozio online',
        lead: 'Una gioielleria con Morellato, Trussardi, Luca Barra e Lamborghini. I prodotti si caricano da soli e il negozio è in più lingue sullo stesso dominio.',
        points: [
          'Carrello e acquisto completo',
          'Collezioni, più venduti e pagine dei marchi',
          'Catalogo importato e tradotto in automatico',
          'Lingua nell’indirizzo (/it, /en)',
        ],
      },
      cagliariclub: {
        kind: 'Fan club ufficiale · Santa Teresa Gallura',
        lead: 'Un fan club del Cagliari Calcio e un omaggio a Gigi Riva. Il sito è in sei lingue, tutte dagli stessi testi.',
        points: [
          'Sei lingue, basta un clic',
          'Le persone del club e la sua storia',
          'Galleria e zona tifosi “Area Cagliari”',
          'Una sezione in ricordo di Gigi Riva (1944–2024)',
        ],
      },
      ilgirasole: {
        kind: 'Ristorante e pizzeria · Santa Teresa Gallura',
        lead: 'Cucina sarda e pizza, con la terrazza sulla piazza principale. Un sito veloce con menù, recensioni e prenotazione del tavolo.',
        points: [
          'Menù del ristorante e cocktail bar in un posto solo',
          'Le recensioni degli ospiti sul sito',
          'Prenotazione del tavolo e mappa',
          'Testi in italiano scritti per le ricerche in zona',
        ],
      },
      renabianca: {
        kind: 'Bar sulla spiaggia · Santa Teresa Gallura',
        lead: 'Colazioni, pranzi e aperitivi davanti alla spiaggia di Rena Bianca. Nel sito ci sono un video, il panorama della baia e tutto il menù della stagione.',
        points: [
          'Video di sfondo e panorama della baia',
          'Menù 2025 in sei sezioni, dal caffè alla pizzella',
          'Galleria “i nostri momenti” e recensioni',
          'Prenotazione del tavolo dal sito',
        ],
      },
      antiqua: {
        kind: 'Fotoceramica per lapidi · negozio',
        lead: 'Un laboratorio che stampa foto su ceramica e vetro per le lapidi. Il negozio è su Shopify, ma il tema l’ho scritto da zero, insieme a un configuratore con cui il cliente compone l’ordine da solo.',
        points: [
          'Configuratore: forma, materiale, ritocco',
          'Due foto unite in una prima della stampa',
          'Prezzi, domande frequenti e tema scuro',
          'Tema Shopify scritto da zero',
        ],
      },
    },

    lab: {
      label: 'Dal vivo',
      title: 'Prova.|Funziona davvero.',
      lead: 'Alcuni pezzi presi dai miei siti. Girano qui, nel tuo browser. Niente registrazioni.',
      live: 'dal vivo',
      tabs: { trojwymiar: '3D', rezerwacja: 'Prenotazione', jezyki: 'Lingue', automat: 'Automazione' },
      hints: {
        trojwymiar: 'Prendilo e giralo. È calcolato in tempo reale, non è un video.',
        rezerwacja: 'Scegli giorno e ora. Sul sito di un cliente funziona allo stesso modo.',
        jezyki: 'Un testo, sei versioni. Cambia e guarda.',
        automat: 'Clicca e guarda cosa succede dopo l’invio di un modulo.',
      },
    },

    knot: { hint: 'prendi e gira' },

    booking: {
      pick: 'Scegli quando',
      empty: 'Clicca un giorno libero nel calendario. Quelli grigi sono occupati.',
      book: 'Prenota un tavolo',
      done: 'Prenotato',
      doneNote: 'Su un sito vero, adesso l’ospite riceverebbe una mail e il titolare un SMS.',
      again: 'Riprova',
      at: 'ore',
      months: ['gennaio', 'febbraio', 'marzo', 'aprile', 'maggio', 'giugno', 'luglio', 'agosto', 'settembre', 'ottobre', 'novembre', 'dicembre'],
      monthsOf: ['gennaio', 'febbraio', 'marzo', 'aprile', 'maggio', 'giugno', 'luglio', 'agosto', 'settembre', 'ottobre', 'novembre', 'dicembre'],
      prev: 'Mese precedente',
      next: 'Mese successivo',
      dow: ['lu', 'ma', 'me', 'gi', 've', 'sa', 'do'],
    },

    flow: {
      send: 'Invia il modulo',
      running: 'Invio…',
      again: 'Di nuovo',
      caption: 'Cosa succede da solo dopo un clic',
      nodes: [
        ['Modulo', 'l’ospite invia'],
        ['Database', 'prenotazione salvata'],
        ['Mail', 'conferma'],
        ['SMS', 'al titolare'],
        ['Calendario', 'nuovo impegno'],
      ],
      log: [
        'modulo inviato',
        'prenotazione salvata nel database',
        'mail di conferma inviata',
        'SMS arrivato al titolare',
        'impegno aggiunto al calendario',
      ],
    },

    services: {
      label: 'Cosa faccio',
      title: 'In cosa|posso aiutarti.',
      lead: 'Grafica, animazioni, 3D, pannello, automazioni e lingue. Faccio tutto io.',
      items: [
        ['Grafica', 'Caratteri, colori e impaginazione scelti per la tua attività. Niente temi già pronti.'],
        ['Animazioni', 'Le cose si muovono mentre scorri e rispondono al cursore. Fluide anche su un telefono vecchio.'],
        ['3D nel browser', 'Un prodotto che il cliente gira col dito. Si carica a pezzi, così la pagina resta veloce.'],
        ['Pannello per il titolare', 'Menù, prezzi, foto e date li cambi tu, dal telefono. Senza chiamarmi.'],
        ['Automazioni', 'Una richiesta arriva insieme a mail, SMS, calendario e foglio di calcolo. Anche di notte.'],
        ['Lingue e Google', 'Più lingue da un solo testo. I dati dell’attività scritti in modo che Google li mostri bene.'],
      ],
    },

    process: {
      label: 'Come lavoro',
      title: 'Cinque passi.',
      lead: 'Di solito da due a cinque settimane. Dipende da quanto c’è da collegare.',
      scroll: 'continua a scorrere',
      steps: [
        ['Chiacchierata', 'Ti chiedo dei tuoi clienti e di cosa deve fare il sito per loro.'],
        ['Direzione', 'Ti mostro una schermata finita. Inizio a programmare solo quando ti piace.'],
        ['Sviluppo', 'Una sezione alla volta. I progressi li vedi ogni giorno su un link di anteprima.'],
        ['Collegamenti', 'Database, pannello, mail, prenotazioni. Provato su telefoni veri.'],
        ['Lancio', 'Dominio, statistiche, una breve spiegazione. Dopo resto sempre raggiungibile.'],
      ],
    },

    finale: {
      label: 'Contatti',
      title: 'Piksel ha ancora|un lavoro da fare.',
      lead: 'Continua a scorrere. Lui sa dov’è il modulo.',
      cLabel: 'Scrivi',
      cTitle1: 'Parliamo',
      cTitle2: 'del tuo sito.',
      cLead: 'Cinque domande veloci. Ci metti un minuto.',
      back: 'Torna su',
      where: 'Sardegna e Polonia · da remoto',
      panel: 'Panel',
    },

    brief: {
      q: [
        'Come ti chiami?',
        'Di cosa hai bisogno?',
        'Quando possiamo sentirci?',
        'Dove ti rispondo?',
        'Cosa ti interessa di più?',
      ],
      ph: ['Anna', '', '', '', 'Es. un sito con prenotazioni per il mio ristorante…'],
      opts: [
        [],
        ['Sito aziendale', 'Negozio online', 'Prenotazioni online', 'Altro'],
        [],
        [],
        [],
      ],
      inne: 'Dimmi in due parole cosa cerchi',
      dogadac: 'Scrivimi e basta',
      dogadacSub: 'Ti contatto io e decidiamo il resto insieme.',
      termin: 'Fissiamo una chiamata',
      terminSub: 'Scegli giorno e ora.',
      najblizsze: 'Primi liberi',
      wybierzDzien: 'Scegli un giorno nel calendario.',
      godzina: 'Ora',
      strefa: 'ora italiana',
      dzis: 'oggi',
      jutro: 'domani',
      email: 'Email',
      telefon: 'Telefono',
      jednoLubOba: 'Ne basta uno dei due.',
      zlyEmail: 'A questo indirizzo manca qualcosa.',
      zlyTel: 'I numeri con {kod} hanno {ile} cifre.',
      zlyTelOgolny: 'Controlla il numero e scrivilo senza prefisso.',
      pomin: 'Salta, ne parliamo',
      next: 'Avanti',
      seal: 'Invia',
      back: 'indietro',
      lecisz: 'La cartolina vola da Claudio',
      okTitle: 'Arrivata. Grazie, {imie}!',
      okText: 'Ti rispondo {gdzie}, di solito in giornata o il giorno dopo.',
      okTermin: 'Ci sentiamo {kiedy}.',
      naMail: 'per email',
      naTel: 'al telefono',
      naOba: 'per email o al telefono',
      errTitle: 'La cartolina non è arrivata.',
      errText: 'Non è colpa tua. Manda lo stesso messaggio per email, il testo è già pronto.',
      tooMany: 'Troppi tentativi insieme. Aspetta un minuto o mandalo per email.',
      send: 'Invia per email',
      retry: 'riprova',
      restart: 'torna al modulo',
      mailSubject: 'Richiesta dal sito',
      mailHi: 'Ciao, sono',
      mailNeed: 'Cosa mi serve',
      mailWhen: 'Quando',
      mailContact: 'Mi trovi qui',
      mailAbout: 'Cosa mi interessa',
    },

    story: {
      kicker: 'Come nasce un sito',
      chapters: [
        ['Chiacchierata', 'giorno 1–2', 'Prima di tutto, chiedo.', 'Prima di disegnare qualsiasi cosa voglio sapere chi entrerà nel tuo sito e perché. Da questa chiacchierata escono preventivo e data, per iscritto.', ['Preventivo con una cifra', 'Data per iscritto']],
        ['Bozza', 'settimana 1', 'Poi faccio la bozza.', 'Impaginazione, caratteri e colori pensati per la tua attività, niente temi pronti. Ti mostro una schermata finita e programmo solo quando ti piace.', ['Progetto da zero', 'Una schermata da approvare']],
        ['Codice', 'settimana 2–3', 'Lo costruisco strato per strato.', 'Una sezione alla volta, con animazioni e 3D dove servono davvero. I progressi li vedi ogni giorno su un’anteprima, anche dal telefono.', ['Animazioni allo scroll', '3D nel browser', 'Anteprima ogni giorno']],
        ['Collegamenti', 'settimana 4', 'Collego quello che lavora dietro.', 'Un pannello dove cambi menù e prezzi da solo. Prenotazioni, mail, SMS e calendario che vanno da soli, anche di notte.', ['Pannello per il titolare', 'Automazioni', 'Più lingue']],
        ['Lancio', 'settimana 5', 'E lo lascio andare nel mondo.', 'Dominio, statistiche, Google e una breve spiegazione del pannello. Dopo resto sempre raggiungibile. Così sono nati i nove siti che vedrai tra poco.', ['Dominio e Google', 'Spiegazione del pannello', 'Assistenza dopo il lancio']],
      ],
      bubbles: ['Ciao! Mi serve un sito per il ristorante.', 'Con le prenotazioni, in italiano e in inglese.', 'Certo. Chi viene da voi più spesso?'],
      plytki: ['Pannello', 'Email', 'SMS', 'Calendario'],
    },

    guide: {
      hero: 'Ciao, sono Piksel. Ti faccio fare un giro. Scorri con calma.',
      about: 'Qui c’è qualcosa su Claudio.',
      work: 'Nella cornice c’è il sito vero, non uno screenshot.',
      lab: 'Qui funziona tutto davvero. Prova a cliccare.',
      services: 'Passa sulla lista e la descrizione accanto cambia.',
      story: 'Scorri piano e guarda come nasce un sito.',
      process: 'Tocca una fase per vedere cosa ricevi in quel momento.',
    },

    loader: ['sparpaglio le stelle', 'sveglio Piksel', 'scaldo le animazioni', 'pronto'],
    who: 'Piksel',
  },
}

for (const code of Object.keys(dict)) Object.assign(dict[code], extra[code])
