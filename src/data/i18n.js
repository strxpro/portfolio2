// ═══════════════════════════════════════════════════════════
//  Wszystkie teksty strony w trzech językach.
//  Struktura projektów (adresy, kolory, stack) siedzi w site.js —
//  tutaj są tylko rzeczy do przetłumaczenia.
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
    nav: { prace: 'Prace', nazywo: 'Na żywo', uslugi: 'Zakres', proces: 'Proces', kontakt: 'Kontakt' },

    hero: {
      badge: 'Jeden człowiek, nie agencja',
      head: 'Robię strony,|które ktoś naprawdę|otwiera.',
      role: 'Robię strony i aplikacje',
      intro:
        'Projektuję i koduję sam. Najbardziej lubię projekty, w których trzeba coś wymyślić od zera — dziewięć takich działa teraz, niżej.',
      cta1: 'Zobacz prace',
      cta2: 'Napisz do mnie',
    },

    me: {
      label: 'Kto to robi',
      title: 'Cześć.|Tu Claudio.',
      stamp: 'bez podwykonawców',
      p1: 'W połowie Włoch, w połowie Polak. Mam {age} {years}, skończyłem szkołę informatyczną i od tamtej pory robię strony. To u mnie bardziej pasja niż robota — lubię rzeczy, których się na co dzień nie widuje, i lubię rozkminiać cudze problemy.',
      chain: ['Rozmowa', 'Szkic', 'Budowa', 'Start', 'Opieka'],
      one: 'Wszystko robię sam.',
      oneNote: ' Od pierwszego szkicu po dzień, w którym strona rusza.',
      creds: [
        ['Kto', 'Claudio Taras'],
        ['Skąd', 'pół Włoch, pół Polak'],
        ['Wykształcenie', 'szkoła informatyczna'],
        ['Języki', 'polski, włoski, angielski'],
        ['Gdzie', 'Sardynia i Polska, zdalnie'],
      ],
      cta: 'Napisz do mnie',
    },

    work: { label: 'Wybrane wdrożenia', visit: 'otwórz' },

    items: {
      oltre: {
        kind: 'Doradztwo edukacyjne i relokacja · platforma',
        lead: 'Doradztwo w sprawie studiów, wiz i przeprowadzki, w sześciu językach. Największa robota na zapleczu: katalog usług zależny od obywatelstwa, panel do prowadzenia spraw i poczta pod automatyzacją.',
        points: [
          'Sześć wersji językowych z jednego źródła treści',
          'Glob 3D z obrotem i przybliżaniem, obsługiwany też palcem',
          'Wybór obywatelstwa filtruje usługi i wymagane dokumenty',
          'Panel: zapytania, terminy, eksport do CSV, kolejka powiadomień',
        ],
      },
      pizzeria: {
        kind: 'Pizzeria z zamówieniami · projekt lokalny',
        lead: 'Zamówienia od koszyka po widok dla kuchni. Do tego mapa dojazdu, naklejki z prawdziwą fizyką i panel, w którym właściciel sam zmienia kartę.',
        points: [
          'Koszyk, potwierdzenie e-mailem i ekran „moje zamówienia”',
          'Osobny widok dla kuchni z kolejką zamówień',
          'Mapa dojazdu i szacowany czas dostawy',
          'Naklejki na pudełku liczone silnikiem fizycznym',
        ],
      },
      spabi: {
        kind: 'Pizzeria · Santa Teresa Gallura',
        lead: 'Pizza z pieca opalanego drewnem, podana jak plakat: grube retro liternictwo, „MAMMA MIA!” przez pół ekranu i maskotka, która prowadzi przez menu.',
        points: [
          'Ekran „wracamy niebawem” z furtką do gotowej strony',
          'Menu, ulubione pozycje, lokale i kontakt na jednej stronie',
          'Sceny sterowane scrollem — ciągnąca się mozzarella, warstwy ciasta',
          'Rezerwacja stolika podpięta pod automatyzację',
        ],
      },
      shistoria: {
        kind: 'Restauracja i cocktail bar · Rena Majore',
        lead: 'Lokal rodzinny od 1996 roku. Najcięższa technicznie robota: własny kreator koktajli, oś czasu na jedenaście odsłon i scena 3D obracana scrollem.',
        points: [
          'Cocktail Maker — gość składa własny drink i zapisuje go na stronie',
          'Galeria koktajli stworzonych przez klientów',
          'Historia lokalu jako interaktywna oś czasu 1996–2026',
          'Ekran ładowania z licznikiem i przelewającym się drinkiem',
        ],
      },
      carruleddhi: {
        kind: 'Wyścig i wydarzenie · edycja 2026',
        lead: 'Zjazd ręcznie budowanych pojazdów bez silnika. Strona żyje razem z wydarzeniem: odlicza czas, przyjmuje zgłoszenia i zbiera głosy publiczności.',
        points: [
          'Odliczanie do startu co do sekundy',
          'Zapisy zawodników i licznik zgłoszeń na żywo',
          'Głosowanie publiczności na uczestnika',
          'Podium, archiwum edycji, trasa i program',
        ],
      },
      villadea: {
        kind: 'Apartament wakacyjny · Aglientu',
        lead: 'Apartament dla czterech osób, 1,8 km od plaż Capo Testa. Ocena 9.8 na Booking.com — i strona, która tę ocenę sprzedaje, zamiast ją tylko wyświetlać.',
        points: [
          'Rezerwacja pobytu prosto ze strony',
          'Galeria wnętrz, tarasu z widokiem na morze i ogrodu',
          'Opinie gości i ocena 9.8 wciągnięte z Booking.com',
          'Treść po polsku i włosku, opis okolicy i dojazdu',
        ],
      },
      gioielleria: {
        kind: 'Jubiler · sklep internetowy',
        lead: 'Sklep z biżuterią marek Morellato, Trussardi, Luca Barra i Lamborghini. Katalog zaciągany automatycznie, koszyk i wersje językowe pod jednym adresem.',
        points: [
          'Pełny koszyk i ścieżka zakupowa',
          'Kolekcje, bestsellery i strony marek',
          'Katalog produktów pobierany i tłumaczony automatycznie',
          'Wersje językowe w adresie (/it, /en)',
        ],
      },
      cagliariclub: {
        kind: 'Oficjalny fanklub · Santa Teresa Gallura',
        lead: 'Fanklub Cagliari Calcio i hołd dla Gigi Rivy. Sześć wersji językowych z jednego źródła treści.',
        points: [
          'Sześć języków przełączanych jednym kliknięciem',
          'Sylwetki postaci klubu i historia od podstaw',
          'Galeria i strefa kibica „Area Cagliari”',
          'Sekcja pamięci Gigi Rivy (1944–2024)',
        ],
      },
      ilgirasole: {
        kind: 'Restauracja i pizzeria · Santa Teresa Gallura',
        lead: 'Kuchnia sardyńska i pizza z tarasem przy głównym placu. Ciepła, bardzo szybka strona z kartą dań, opiniami gości i rezerwacją stolika.',
        points: [
          'Karta dań restauracji i bar koktajlowy w jednym miejscu',
          'Opinie gości wciągnięte na stronę',
          'Rezerwacja stolika i mapa dojazdu',
          'Treść po włosku, przygotowana pod lokalne SEO',
        ],
      },
      renabianca: {
        kind: 'Bar przy plaży · Santa Teresa Gallura',
        lead: 'Śniadania, obiady i aperitivo z widokiem na plażę Rena Bianca. Wideo w tle, panorama zatoki i pełne menu sezonu.',
        points: [
          'Wideo w tle i sekcja panoramy',
          'Menu 2025 w sześciu kategoriach, od kawy po pizzellę',
          'Galeria „nasze chwile” i opinie gości',
          'Rezerwacja stolika prosto ze strony',
        ],
      },
      antiqua: {
        kind: 'Fotoceramika nagrobkowa · sklep',
        lead: 'Pracownia zdjęć na nagrobki: ceramika i szkło. Sklep na Shopify z autorskim motywem i kreatorem, w którym klient sam składa zamówienie.',
        points: [
          'Kreator zamówienia — kształt, materiał i retusz',
          'Łączenie dwóch zdjęć w jedno przed produkcją',
          'Cennik, FAQ i tryb ciemny',
          'Sklep na Shopify z motywem pisanym od zera',
        ],
      },
    },

    lab: {
      label: 'Na żywo',
      title: 'Poklikaj.|To działa naprawdę.',
      lead: 'Pięć rzeczy wyjętych z moich projektów. Działają w Twojej przeglądarce — to nie są nagrania.',
      live: 'działa na żywo',
      tabs: { trojwymiar: 'Trójwymiar', rezerwacja: 'Rezerwacja', jezyki: 'Języki', automat: 'Automatyzacja' },
      hints: {
        trojwymiar: 'Złap i obróć — to liczy się w czasie rzeczywistym, nie jest filmem.',
        rezerwacja: 'Wybierz dzień i godzinę. Dokładnie tak działa panel u klienta.',
        jezyki: 'Jedno źródło treści, sześć wersji. Przełącz i zobacz.',
        automat: 'Kliknij i zobacz, co dzieje się po wysłaniu formularza.',
      },
    },

    knot: { hint: 'złap i obróć' },

    booking: {
      pick: 'Wybierz termin',
      empty: 'Kliknij wolny dzień w kalendarzu po lewej. Szare pola są już zajęte.',
      book: 'Zarezerwuj stolik',
      done: 'Rezerwacja przyjęta',
      doneNote: 'W prawdziwym wdrożeniu w tym momencie leci mail do gościa i SMS do właściciela.',
      again: 'Spróbuj jeszcze raz',
      at: 'godz.',
      months: ['styczeń', 'luty', 'marzec', 'kwiecień', 'maj', 'czerwiec', 'lipiec', 'sierpień', 'wrzesień', 'październik', 'listopad', 'grudzień'],
      monthsOf: ['stycznia', 'lutego', 'marca', 'kwietnia', 'maja', 'czerwca', 'lipca', 'sierpnia', 'września', 'października', 'listopada', 'grudnia'],
      dow: ['pn', 'wt', 'śr', 'cz', 'pt', 'so', 'nd'],
    },

    flow: {
      send: 'Wyślij zgłoszenie',
      running: 'Trwa…',
      again: 'Uruchom jeszcze raz',
      caption: 'Przewody — co gdzie płynie bez klikania',
      nodes: [
        ['Formularz', 'gość wypełnia'],
        ['Baza', 'zapis rezerwacji'],
        ['Mail', 'potwierdzenie'],
        ['SMS', 'do właściciela'],
        ['Kalendarz', 'wpis w grafiku'],
      ],
      log: [
        'formularz wysłany',
        'rekord zapisany w bazie',
        'mail potwierdzający wysłany',
        'SMS dostarczony do właściciela',
        'wpis dodany do kalendarza',
      ],
    },

    services: {
      label: 'Zakres prac',
      title: 'Co mogę|dla Ciebie zrobić.',
      lead: 'Projekt, ruch, 3D, panel, automatyzacje i języki. Najedź na pozycję, żeby przeczytać więcej.',
      items: [
        ['Projekt graficzny', 'Własna typografia, paleta i układ pod konkretną firmę. Nie przestawiam bloków w gotowym motywie.'],
        ['Ruch i interakcja', 'Scroll steruje sceną, elementy reagują na kursor. Płynnie także na starszym telefonie.'],
        ['Trójwymiar w przeglądarce', 'Model produktu, który klient obraca palcem. Pliki dociążane etapami, żeby nic nie mulilo.'],
        ['Panel dla właściciela', 'Menu, ceny, zdjęcia i terminy zmieniane z telefonu, bez dzwonienia do wykonawcy.'],
        ['Automatyzacje', 'Formularz trafia w mail, SMS, kalendarz i arkusz jednocześnie. Scenariusz pracuje też w nocy.'],
        ['Języki i widoczność', 'Sześć wersji językowych z jednego źródła tekstu, dane firmy opisane tak, żeby Google je rozumiał.'],
      ],
    },

    process: {
      label: 'Przebieg współpracy',
      title: 'Pięć etapów.',
      lead: 'Dwa do pięciu tygodni, zależnie od tego, ile trzeba podłączyć.',
      scroll: 'przewijaj',
      steps: [
        ['Rozmowa', 'Pytam o Twoich klientów i o to, co strona ma naprawdę robić.'],
        ['Kierunek', 'Jeden gotowy ekran, który ustawia resztę. Akceptujesz przed kodem.'],
        ['Budowa', 'Sekcja po sekcji, z podglądem na żywo. Postęp widzisz codziennie.'],
        ['Podłączenia', 'Baza, panel, maile, rezerwacje. Testy na prawdziwych telefonach.'],
        ['Start', 'Wdrożenie, domena, analityka, szkolenie. Potem zostaję pod ręką.'],
      ],
    },

    finale: {
      label: 'Ostatnia sekcja',
      title: 'Piksel ma jeszcze|jedną rzecz do zrobienia.',
      lead: 'Scrolluj dalej. On wie, gdzie schowałem kontakt.',
      cLabel: 'Napisz',
      cTitle1: 'Porozmawiajmy',
      cTitle2: 'o Twojej stronie.',
      cLead: 'Pięć pytań. Na końcu masz gotowy brief do wysłania.',
      back: 'Wróć na górę',
      where: 'Sardynia i Polska · zdalnie',
      panel: 'Panel',
    },

    brief: {
      q: [
        'Zacznijmy od podstaw — jak masz na imię?',
        'Czego potrzebujesz?',
        'Na kiedy się umawiamy?',
        'Gdzie mam odpisać?',
        'Co by Cię interesowało?',
      ],
      ph: ['Anna', '', '', '', 'Np. strona z rezerwacjami dla mojej restauracji…'],
      opts: [
        [],
        ['Strona firmowa', 'Sklep', 'Rezerwacje online', 'Coś innego'],
        [],
        [],
        [],
      ],
      inne: 'Napisz, czego szukasz',
      dogadac: 'Na razie chcę się dogadać',
      dogadacSub: 'Odezwę się i razem ustalimy szczegóły.',
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
      jednoLubOba: 'Podaj jedno albo oba — jak Ci wygodniej.',
      zlyEmail: 'Ten adres e-mail wygląda na niepełny.',
      zlyTel: 'Numer z {kod} ma {ile} cyfr.',
      zlyTelOgolny: 'Sprawdź numer — podaj go bez kierunkowego.',
      pomin: 'Pomiń — dogadamy się',
      next: 'Dalej',
      seal: 'Wyślij',
      back: 'wstecz',
      lecisz: 'Pocztówka leci do Claudia',
      okTitle: 'Doleciało. Dzięki, {imie}!',
      okText: 'Odezwę się {gdzie} — zwykle w ciągu doby.',
      okTermin: 'Do usłyszenia {kiedy}.',
      naMail: 'mailem',
      naTel: 'na telefon',
      naOba: 'mailem albo telefonicznie',
      errTitle: 'Pocztówka zawróciła.',
      errText: 'To nie Twoja wina. Wyślij to samo mailem — treść jest już gotowa.',
      tooMany: 'Za dużo prób naraz. Odczekaj minutę albo wyślij mailem.',
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

    guide: {
      hero: 'Cześć. Jestem Piksel i oprowadzę Cię po tej stronie — scrolluj spokojnie.',
      about: 'Krótko o mnie i o tym, jak pracuję.',
      work: 'Dziewięć stron, które chodzą na produkcji. To w ramce to żywa strona, nie zrzut ekranu.',
      lab: 'To nie są zrzuty ekranu — wszystko tu działa naprawdę. Poklikaj.',
      services: 'Sześć rzeczy, które robię sam. Najedź na listę — po lewej podmieni się opis.',
      process: 'Przewijaj dalej — kroki jadą w bok.',
    },

    loader: ['układam siatkę', 'liczę maskotkę', 'rozgrzewam animacje', 'gotowe'],
    who: 'Piksel',
  },

  /* ─────────────────────────── ENGLISH ─────────────────────────── */
  en: {
    nav: { prace: 'Work', nazywo: 'Live', uslugi: 'Scope', proces: 'Process', kontakt: 'Contact' },

    hero: {
      badge: 'One person, not an agency',
      head: 'I build websites|people actually|open.',
      role: 'I build sites and apps',
      intro:
        'I design and code everything myself. What I like most are projects where something has to be invented from scratch — nine of them are live right now, below.',
      cta1: 'See the work',
      cta2: 'Write to me',
    },

    me: {
      label: 'Who does this',
      title: 'Hi.|I am Claudio.',
      stamp: 'no subcontractors',
      p1: 'Half Italian, half Polish. I am {age}, I finished an IT school and I have been building sites ever since. It is more of a passion than a job — I like making things you do not see every day, and I like untangling other people’s problems.',
      chain: ['Call', 'Sketch', 'Build', 'Launch', 'Care'],
      one: 'I do all of it myself.',
      oneNote: ' From the first sketch to the day the site goes live.',
      creds: [
        ['Who', 'Claudio Taras'],
        ['Roots', 'half Italian, half Polish'],
        ['Background', 'IT school'],
        ['Languages', 'Polish, Italian, English'],
        ['Where', 'Sardinia and Poland, remote'],
      ],
      cta: 'Write to me',
    },

    work: { label: 'Selected projects', visit: 'open' },

    items: {
      oltre: {
        kind: 'Education advice and relocation · platform',
        lead: 'Advice on studies, visas and moving abroad, in six languages. Most of the work sits in the back: a service catalogue that depends on citizenship, a panel for running cases and mail driven by automation.',
        points: [
          'Six languages from a single source of content',
          'A 3D globe you can spin and zoom, on a phone too',
          'Choosing a citizenship filters services and required documents',
          'Panel: enquiries, dates, CSV export, notification queue',
        ],
      },
      pizzeria: {
        kind: 'Pizzeria with online orders · local project',
        lead: 'Orders from the basket to the kitchen screen. Plus a delivery map, stickers with real physics and a panel where the owner edits the menu.',
        points: [
          'Basket, email confirmation and a „my orders” screen',
          'A separate kitchen view with the order queue',
          'Delivery map with an estimated time',
          'Box stickers driven by a physics engine',
        ],
      },
      spabi: {
        kind: 'Pizzeria · Santa Teresa Gallura',
        lead: 'Wood-fired pizza served like a poster: heavy retro lettering, „MAMMA MIA!” across half the screen and a mascot walking you through the menu.',
        points: [
          'A „back soon” screen with a door into the finished site',
          'Menu, favourites, locations and contact on one page',
          'Scroll-driven scenes — stretching mozzarella, layers of dough',
          'Table booking wired into an automation',
        ],
      },
      shistoria: {
        kind: 'Restaurant and cocktail bar · Rena Majore',
        lead: 'A family place since 1996. The heaviest build here: a cocktail builder, an eleven-step timeline and a 3D scene turned by scroll.',
        points: [
          'Cocktail Maker — guests mix their own drink and save it on the site',
          'A gallery of cocktails made by customers',
          'The story of the place as an interactive 1996–2026 timeline',
          'A loading screen with a counter and a pouring drink',
        ],
      },
      carruleddhi: {
        kind: 'Race and event · 2026 edition',
        lead: 'A downhill run of hand-built vehicles with no engine. The site lives with the event: it counts down, takes entries and collects the crowd vote.',
        points: [
          'Countdown to the start, down to the second',
          'Competitor sign-up and a live entry counter',
          'Public voting for a favourite competitor',
          'Podium, past editions, route and programme',
        ],
      },
      villadea: {
        kind: 'Holiday apartment · Aglientu',
        lead: 'A four-guest apartment 1.8 km from the Capo Testa beaches. Rated 9.8 on Booking.com — and a site that sells that rating instead of just printing it.',
        points: [
          'Booking straight from the site',
          'Gallery of the rooms, the sea-view terrace and the garden',
          'Guest reviews and the 9.8 rating pulled from Booking.com',
          'Content in Polish and Italian, with the area and directions',
        ],
      },
      gioielleria: {
        kind: 'Jeweller · online shop',
        lead: 'A jewellery shop carrying Morellato, Trussardi, Luca Barra and Lamborghini. Catalogue pulled in automatically, a cart and language versions on one domain.',
        points: [
          'A full cart and checkout path',
          'Collections, best-sellers and brand pages',
          'Product catalogue fetched and translated automatically',
          'Language versions in the URL (/it, /en)',
        ],
      },
      cagliariclub: {
        kind: 'Official fan club · Santa Teresa Gallura',
        lead: 'A Cagliari Calcio fan club and a tribute to Gigi Riva. Six language versions from one source of content.',
        points: [
          'Six languages switched with one click',
          'Profiles of club figures and the history from the start',
          'Gallery and the „Area Cagliari” supporters zone',
          'A memorial section for Gigi Riva (1944–2024)',
        ],
      },
      ilgirasole: {
        kind: 'Restaurant and pizzeria · Santa Teresa Gallura',
        lead: 'Sardinian cooking and pizza with a terrace on the main square. A warm, very fast site with the menu, guest reviews and table booking.',
        points: [
          'Restaurant menu and cocktail bar in one place',
          'Guest reviews pulled onto the site',
          'Table booking and a map',
          'Italian copy prepared for local search',
        ],
      },
      renabianca: {
        kind: 'Beach bar · Santa Teresa Gallura',
        lead: 'Breakfast, lunch and aperitivo facing Rena Bianca beach. Background video, a panorama of the bay and the full seasonal menu.',
        points: [
          'Background video and a panorama section',
          'The 2025 menu in six categories, from coffee to pizzella',
          'An „our moments” gallery and guest reviews',
          'Table booking straight from the site',
        ],
      },
      antiqua: {
        kind: 'Memorial photo ceramics · shop',
        lead: 'A workshop making gravestone photographs on ceramic and glass. A Shopify shop on a hand-written theme with a builder the customer uses themselves.',
        points: [
          'Order builder — shape, material and retouching',
          'Merging two photographs into one before production',
          'Price list, FAQ and a dark mode',
          'Shopify shop on a theme written from scratch',
        ],
      },
    },

    lab: {
      label: 'Live',
      title: 'Click around.|It really works.',
      lead: 'Five things taken from my projects. They run in your browser — these are not recordings.',
      live: 'running live',
      tabs: { trojwymiar: '3D', rezerwacja: 'Booking', jezyki: 'Languages', automat: 'Automation' },
      hints: {
        trojwymiar: 'Grab it and turn it — this is computed in real time, not a video.',
        rezerwacja: 'Pick a day and a time. This is exactly how the client panel works.',
        jezyki: 'One source of content, six versions. Switch and see.',
        automat: 'Click and watch what happens after a form is sent.',
      },
    },

    knot: { hint: 'grab and turn' },

    booking: {
      pick: 'Pick a slot',
      empty: 'Click a free day in the calendar on the left. Grey ones are taken.',
      book: 'Book a table',
      done: 'Booking received',
      doneNote: 'In a real deployment an email goes to the guest and a text to the owner at this moment.',
      again: 'Try again',
      at: 'at',
      months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
      monthsOf: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
      dow: ['mo', 'tu', 'we', 'th', 'fr', 'sa', 'su'],
    },

    flow: {
      send: 'Send the enquiry',
      running: 'Running…',
      again: 'Run it again',
      caption: 'Wiring — what goes where without a single click',
      nodes: [
        ['Form', 'guest fills it in'],
        ['Database', 'booking saved'],
        ['Email', 'confirmation'],
        ['Text', 'to the owner'],
        ['Calendar', 'entry in the diary'],
      ],
      log: [
        'form submitted',
        'record written to the database',
        'confirmation email sent',
        'text delivered to the owner',
        'entry added to the calendar',
      ],
    },

    services: {
      label: 'Scope',
      title: 'What I can|do for you.',
      lead: 'Design, motion, 3D, an owner panel, automations and languages. Hover an item to read more.',
      items: [
        ['Visual design', 'Typography, palette and layout made for one specific business. I do not rearrange blocks in a ready-made theme.'],
        ['Motion and interaction', 'Scroll drives the scene, elements answer the cursor. Smooth on an older phone too.'],
        ['3D in the browser', 'A product model the customer turns with a finger. Files loaded in stages so nothing drags.'],
        ['A panel for the owner', 'Menu, prices, photos and dates changed from a phone, without ringing the developer.'],
        ['Automations', 'A form lands in email, text, calendar and a spreadsheet at once. The scenario works at night too.'],
        ['Languages and visibility', 'Six language versions from one source of text, business data described so Google understands it.'],
      ],
    },

    process: {
      label: 'How it runs',
      title: 'Five steps.',
      lead: 'A typical project takes two to five weeks, depending on how much has to be wired underneath.',
      scroll: 'keep scrolling',
      steps: [
        ['Conversation', 'I ask about your customers and what the site actually has to do.'],
        ['Direction', 'One finished screen that sets the rest. You approve it before any production code.'],
        ['Build', 'Section by section, with a live preview. You see progress every day.'],
        ['Wiring', 'Database, panel, email, bookings. Tested on real phones.'],
        ['Launch', 'Deployment, domain, analytics, training. Then I stay within reach.'],
      ],
    },

    finale: {
      label: 'Last section',
      title: 'Piksel has one|more thing to do.',
      lead: 'Keep scrolling. He knows where I hid the contact details.',
      cLabel: 'Write',
      cTitle1: 'Let us talk',
      cTitle2: 'about your site.',
      cLead: 'Piksel will walk you through five questions. At the end he folds the answers into a brief, seals it and hands it to you to send.',
      back: 'Back to the top',
      where: 'Sardinia and Poland · remote',
      panel: 'Panel',
    },

    brief: {
      q: [
        'Let us start simple — what is your name?',
        'What do you need?',
        'When shall we talk?',
        'Where should I reply?',
        'What are you interested in?',
      ],
      ph: ['Anna', '', '', '', 'E.g. a booking site for my restaurant…'],
      opts: [
        [],
        ['Company site', 'Shop', 'Online booking', 'Something else'],
        [],
        [],
        [],
      ],
      inne: 'Tell me what you are looking for',
      dogadac: 'Let us just get in touch first',
      dogadacSub: 'I will reach out and we will sort out the details together.',
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
      jednoLubOba: 'Give one or both — whatever suits you.',
      zlyEmail: 'This email address looks incomplete.',
      zlyTel: 'A number with {kod} has {ile} digits.',
      zlyTelOgolny: 'Check the number — enter it without the country code.',
      pomin: 'Skip — we will talk',
      next: 'Next',
      seal: 'Send',
      back: 'back',
      lecisz: 'The postcard is flying to Claudio',
      okTitle: 'Delivered. Thanks, {imie}!',
      okText: 'I will get back to you {gdzie} — usually within a day.',
      okTermin: 'Talk to you {kiedy}.',
      naMail: 'by email',
      naTel: 'by phone',
      naOba: 'by email or phone',
      errTitle: 'The postcard came back.',
      errText: 'Not your fault. Send the same by email — the text is ready.',
      tooMany: 'Too many attempts at once. Wait a minute or send it by email.',
      send: 'Send by email',
      retry: 'try again',
      restart: 'back to the form',
      mailSubject: 'Enquiry from the site',
      mailHi: 'Hello, this is',
      mailNeed: 'What I need',
      mailWhen: 'When',
      mailContact: 'Reach me at',
      mailAbout: 'What I am interested in',
    },

    guide: {
      hero: 'Hello. I am Piksel and I will show you around — scroll at your own pace.',
      about: 'A little about me and how I work.',
      work: 'Nine sites running in production. What you see in the frame is the live site, not a screenshot.',
      lab: 'These are not screenshots — everything here actually runs. Have a click.',
      services: 'Six things I do myself. Hover the list and the description swaps on the left.',
      process: 'Keep scrolling — the steps move sideways.',
    },

    loader: ['laying out the grid', 'computing the mascot', 'warming up motion', 'ready'],
    who: 'Piksel',
  },

  /* ─────────────────────────── ITALIANO ─────────────────────────── */
  it: {
    nav: { prace: 'Lavori', nazywo: 'Dal vivo', uslugi: 'Servizi', proces: 'Processo', kontakt: 'Contatti' },

    hero: {
      badge: 'Una persona, non un’agenzia',
      head: 'Faccio siti|che la gente|apre davvero.',
      role: 'Faccio siti e applicazioni',
      intro:
        'Progetto e programmo tutto da solo. Mi piacciono di più i progetti dove bisogna inventare qualcosa da zero — nove sono online adesso, qui sotto.',
      cta1: 'Guarda i lavori',
      cta2: 'Scrivimi',
    },

    me: {
      label: 'Chi lo fa',
      title: 'Ciao.|Sono Claudio.',
      stamp: 'nessun subappalto',
      p1: 'Metà italiano, metà polacco. Ho {age} anni, ho finito una scuola di informatica e da allora faccio siti. Più che un lavoro è una passione — mi piace fare cose che non si vedono tutti i giorni e mi piace sbrogliare i problemi degli altri.',
      chain: ['Chiamata', 'Bozza', 'Costruzione', 'Lancio', 'Assistenza'],
      one: 'Faccio tutto da solo.',
      oneNote: ' Dalla prima bozza al giorno in cui il sito va online.',
      creds: [
        ['Chi', 'Claudio Taras'],
        ['Origini', 'metà italiano, metà polacco'],
        ['Formazione', 'scuola di informatica'],
        ['Lingue', 'italiano, polacco, inglese'],
        ['Dove', 'Sardegna e Polonia, da remoto'],
      ],
      cta: 'Scrivimi',
    },

    work: { label: 'Lavori selezionati', visit: 'apri' },

    items: {
      oltre: {
        kind: 'Consulenza per studio e trasferimento · piattaforma',
        lead: 'Consulenza su studi, visti e trasferimento all’estero, in sei lingue. Il lavoro più grosso sta dietro: un catalogo di servizi che dipende dalla cittadinanza, un pannello per seguire le pratiche e la posta gestita da un’automazione.',
        points: [
          'Sei lingue da una sola fonte di contenuti',
          'Globo 3D che si gira e si ingrandisce, anche col dito',
          'La cittadinanza filtra servizi e documenti richiesti',
          'Pannello: richieste, date, esportazione CSV, coda notifiche',
        ],
      },
      pizzeria: {
        kind: 'Pizzeria con ordini online · progetto locale',
        lead: 'Ordini dal carrello fino allo schermo della cucina. Più la mappa delle consegne, adesivi con fisica vera e un pannello dove il titolare cambia il menù da solo.',
        points: [
          'Carrello, conferma per email e schermata „i miei ordini”',
          'Vista separata per la cucina con la coda degli ordini',
          'Mappa delle consegne con il tempo stimato',
          'Adesivi sulla scatola calcolati da un motore fisico',
        ],
      },
      spabi: {
        kind: 'Pizzeria · Santa Teresa Gallura',
        lead: 'Pizza dal forno a legna servita come un manifesto: lettering retro pesante, „MAMMA MIA!” su mezzo schermo e una mascotte che accompagna nel menu.',
        points: [
          'Schermata „torniamo presto” con una porta verso il sito finito',
          'Menu, preferiti, locali e contatti in una pagina',
          'Scene guidate dallo scroll — mozzarella che fila, strati di impasto',
          'Prenotazione del tavolo collegata a un’automazione',
        ],
      },
      shistoria: {
        kind: 'Ristorante e cocktail bar · Rena Majore',
        lead: 'Locale di famiglia dal 1996. Il lavoro più impegnativo: un creatore di cocktail, una linea del tempo in undici tappe e una scena 3D girata dallo scroll.',
        points: [
          'Cocktail Maker — l’ospite compone il suo drink e lo salva sul sito',
          'Galleria dei cocktail creati dai clienti',
          'La storia del locale come linea del tempo 1996–2026',
          'Schermata di caricamento con contatore e drink che si versa',
        ],
      },
      carruleddhi: {
        kind: 'Gara ed evento · edizione 2026',
        lead: 'Discesa di carretti costruiti a mano, senza motore. Il sito vive con l’evento: conta alla rovescia, raccoglie le iscrizioni e i voti del pubblico.',
        points: [
          'Conto alla rovescia fino alla partenza, al secondo',
          'Iscrizione dei partecipanti e contatore dal vivo',
          'Votazione del pubblico per un concorrente',
          'Podio, archivio delle edizioni, percorso e programma',
        ],
      },
      villadea: {
        kind: 'Appartamento vacanze · Aglientu',
        lead: 'Appartamento per quattro persone a 1,8 km dalle spiagge di Capo Testa. Valutazione 9.8 su Booking.com — e un sito che quella valutazione la vende.',
        points: [
          'Prenotazione direttamente dal sito',
          'Galleria degli interni, della terrazza vista mare e del giardino',
          'Recensioni e voto 9.8 presi da Booking.com',
          'Contenuti in polacco e italiano, zona e indicazioni',
        ],
      },
      gioielleria: {
        kind: 'Gioielleria · negozio online',
        lead: 'Gioielleria con Morellato, Trussardi, Luca Barra e Lamborghini. Catalogo importato in automatico, carrello e versioni linguistiche su un solo dominio.',
        points: [
          'Carrello completo e percorso di acquisto',
          'Collezioni, best-seller e pagine dei marchi',
          'Catalogo prodotti scaricato e tradotto in automatico',
          'Versioni linguistiche nell’indirizzo (/it, /en)',
        ],
      },
      cagliariclub: {
        kind: 'Fan club ufficiale · Santa Teresa Gallura',
        lead: 'Club dei tifosi del Cagliari Calcio e omaggio a Gigi Riva. Sei versioni linguistiche da una sola fonte di contenuti.',
        points: [
          'Sei lingue cambiate con un clic',
          'Le figure del club e la storia dalle origini',
          'Galleria e zona tifosi „Area Cagliari”',
          'Sezione in memoria di Gigi Riva (1944–2024)',
        ],
      },
      ilgirasole: {
        kind: 'Ristorante e pizzeria · Santa Teresa Gallura',
        lead: 'Cucina sarda e pizza con terrazza sulla piazza principale. Sito caldo e molto veloce, con menu, recensioni e prenotazione del tavolo.',
        points: [
          'Menu del ristorante e cocktail bar in un unico posto',
          'Recensioni degli ospiti portate sul sito',
          'Prenotazione del tavolo e mappa',
          'Testi in italiano, pensati per la ricerca locale',
        ],
      },
      renabianca: {
        kind: 'Bar sulla spiaggia · Santa Teresa Gallura',
        lead: 'Colazioni, pranzi e aperitivi davanti alla spiaggia di Rena Bianca. Video di sfondo, panorama della baia e menu completo della stagione.',
        points: [
          'Video di sfondo e sezione panorama',
          'Menu 2025 in sei categorie, dal caffè alla pizzella',
          'Galleria „i nostri momenti” e recensioni',
          'Prenotazione del tavolo dal sito',
        ],
      },
      antiqua: {
        kind: 'Fotoceramica funeraria · negozio',
        lead: 'Laboratorio di fotografie per lapidi su ceramica e vetro. Negozio Shopify con tema scritto a mano e un configuratore che usa il cliente.',
        points: [
          'Configuratore dell’ordine — forma, materiale e ritocco',
          'Unione di due fotografie in una prima della produzione',
          'Listino, FAQ e modalità scura',
          'Negozio Shopify con tema scritto da zero',
        ],
      },
    },

    lab: {
      label: 'Dal vivo',
      title: 'Prova.|Funziona davvero.',
      lead: 'Cinque cose prese dai miei progetti. Girano nel tuo browser — non sono registrazioni.',
      live: 'in funzione',
      tabs: { trojwymiar: '3D', rezerwacja: 'Prenotazione', jezyki: 'Lingue', automat: 'Automazione' },
      hints: {
        trojwymiar: 'Prendilo e giralo — è calcolato in tempo reale, non è un video.',
        rezerwacja: 'Scegli giorno e ora. Il pannello del cliente funziona esattamente così.',
        jezyki: 'Una sola fonte di contenuti, sei versioni. Cambia e guarda.',
        automat: 'Clicca e guarda cosa succede dopo l’invio del modulo.',
      },
    },

    knot: { hint: 'prendi e gira' },

    booking: {
      pick: 'Scegli la data',
      empty: 'Clicca un giorno libero nel calendario a sinistra. I grigi sono occupati.',
      book: 'Prenota un tavolo',
      done: 'Prenotazione ricevuta',
      doneNote: 'In un sito vero, in questo momento parte una mail all’ospite e un SMS al titolare.',
      again: 'Prova ancora',
      at: 'ore',
      months: ['gennaio', 'febbraio', 'marzo', 'aprile', 'maggio', 'giugno', 'luglio', 'agosto', 'settembre', 'ottobre', 'novembre', 'dicembre'],
      monthsOf: ['gennaio', 'febbraio', 'marzo', 'aprile', 'maggio', 'giugno', 'luglio', 'agosto', 'settembre', 'ottobre', 'novembre', 'dicembre'],
      dow: ['lu', 'ma', 'me', 'gi', 've', 'sa', 'do'],
    },

    flow: {
      send: 'Invia la richiesta',
      running: 'In corso…',
      again: 'Esegui di nuovo',
      caption: 'Collegamenti — dove va cosa senza un clic',
      nodes: [
        ['Modulo', 'compilato dall’ospite'],
        ['Database', 'prenotazione salvata'],
        ['Mail', 'conferma'],
        ['SMS', 'al titolare'],
        ['Calendario', 'voce in agenda'],
      ],
      log: [
        'modulo inviato',
        'record scritto nel database',
        'mail di conferma inviata',
        'SMS consegnato al titolare',
        'voce aggiunta al calendario',
      ],
    },

    services: {
      label: 'Ambito dei lavori',
      title: 'Cosa posso|fare per te.',
      lead: 'Progetto, movimento, 3D, pannello, automazioni e lingue. Passa sopra una voce per leggere di più.',
      items: [
        ['Progetto grafico', 'Tipografia, palette e impaginazione per una sola azienda. Non sposto blocchi in un tema già fatto.'],
        ['Movimento e interazione', 'Lo scroll guida la scena, gli elementi rispondono al cursore. Fluido anche su un telefono vecchio.'],
        ['3D nel browser', 'Un modello che il cliente gira col dito. File caricati a tappe, così niente rallenta.'],
        ['Pannello per il titolare', 'Menu, prezzi, foto e date cambiati dal telefono, senza chiamare chi ha fatto il sito.'],
        ['Automazioni', 'Un modulo arriva insieme in mail, SMS, calendario e foglio di calcolo. Lo scenario lavora anche di notte.'],
        ['Lingue e visibilità', 'Sei versioni linguistiche da un solo testo, dati aziendali scritti perché Google li capisca.'],
      ],
    },

    process: {
      label: 'Come procede',
      title: 'Cinque fasi.',
      lead: 'Un progetto tipico richiede da due a cinque settimane, a seconda di quanto c’è da collegare sotto.',
      scroll: 'continua a scorrere',
      steps: [
        ['Colloquio', 'Chiedo dei tuoi clienti e di cosa deve fare davvero il sito.'],
        ['Direzione', 'Una schermata finita che imposta tutto il resto. La approvi prima del codice.'],
        ['Costruzione', 'Sezione dopo sezione, con anteprima dal vivo. Vedi i progressi ogni giorno.'],
        ['Collegamenti', 'Database, pannello, mail, prenotazioni. Test su telefoni veri.'],
        ['Lancio', 'Pubblicazione, dominio, statistiche, formazione. Poi resto a portata di mano.'],
      ],
    },

    finale: {
      label: 'Ultima sezione',
      title: 'Piksel ha ancora|una cosa da fare.',
      lead: 'Continua a scorrere. Lui sa dove ho nascosto i contatti.',
      cLabel: 'Scrivi',
      cTitle1: 'Parliamo',
      cTitle2: 'del tuo sito.',
      cLead: 'Piksel ti guida attraverso cinque domande. Alla fine piega le risposte in un brief, lo sigilla e te lo passa da inviare.',
      back: 'Torna su',
      where: 'Sardegna e Polonia · da remoto',
      panel: 'Panel',
      where: 'Sardegna e Polonia · da remoto',
      panel: 'Panel',
    },

    brief: {
      q: [
        'Partiamo dalle basi — come ti chiami?',
        'Di cosa hai bisogno?',
        'Quando ci sentiamo?',
        'Dove ti rispondo?',
        'Cosa ti interesserebbe?',
      ],
      ph: ['Anna', '', '', '', 'Es. un sito con prenotazioni per il mio ristorante…'],
      opts: [
        [],
        ['Sito aziendale', 'Negozio', 'Prenotazioni online', 'Altro'],
        [],
        [],
        [],
      ],
      inne: 'Scrivi cosa stai cercando',
      dogadac: 'Per ora voglio solo parlarne',
      dogadacSub: 'Ti contatto io e definiamo i dettagli insieme.',
      termin: 'Fissiamo una chiamata',
      terminSub: 'Scegli giorno e ora.',
      najblizsze: 'Prossimi liberi',
      wybierzDzien: 'Scegli un giorno nel calendario.',
      godzina: 'Ora',
      strefa: 'ora italiana',
      dzis: 'oggi',
      jutro: 'domani',
      email: 'Email',
      telefon: 'Telefono',
      jednoLubOba: 'Indicane uno o entrambi — come preferisci.',
      zlyEmail: 'Questo indirizzo email sembra incompleto.',
      zlyTel: 'Un numero con {kod} ha {ile} cifre.',
      zlyTelOgolny: 'Controlla il numero — senza prefisso internazionale.',
      pomin: 'Salta — ne parliamo',
      next: 'Avanti',
      seal: 'Invia',
      back: 'indietro',
      lecisz: 'La cartolina vola da Claudio',
      okTitle: 'Arrivata. Grazie, {imie}!',
      okText: 'Ti ricontatto {gdzie} — di solito entro un giorno.',
      okTermin: 'A presto, {kiedy}.',
      naMail: 'per email',
      naTel: 'al telefono',
      naOba: 'per email o al telefono',
      errTitle: 'La cartolina è tornata indietro.',
      errText: 'Non è colpa tua. Mandalo per email — il testo è già pronto.',
      tooMany: 'Troppi tentativi. Aspetta un minuto o invialo per email.',
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

    guide: {
      hero: 'Ciao. Sono Piksel e ti accompagno — scorri con calma.',
      about: 'Due parole su di me e su come lavoro.',
      work: 'Nove siti in produzione. Quello nella cornice è il sito vero, non uno screenshot.',
      lab: 'Non sono screenshot — qui funziona tutto davvero. Prova a cliccare.',
      services: 'Sei cose che faccio da solo. Passa sulla lista e a sinistra cambia la descrizione.',
      process: 'Continua a scorrere — i passi vanno di lato.',
    },

    loader: ['imposto la griglia', 'calcolo la mascotte', 'scaldo le animazioni', 'pronto'],
    who: 'Piksel',
  },
}

for (const code of Object.keys(dict)) Object.assign(dict[code], extra[code])
