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
      head: 'Strony i aplikacje|od projektu|po dzień startu.',
      role: 'Robię strony i aplikacje',
      intro:
        'Projektuję i koduję sam — od pierwszego szkicu po dzień, w którym strona rusza. Najbardziej lubię projekty, w których trzeba coś wymyślić od zera.',
      cta1: 'Zobacz wdrożenia',
      cta2: 'Umów rozmowę',
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
      title: 'Zamiast obiecywać —|pokazuję działające.',
      lead: 'Pięć kawałków kodu z wdrożonych projektów. Liczą się w Twojej przeglądarce, teraz.',
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
      title: 'Wszystko w jednym|zamówieniu.',
      lead: 'Bez podwykonawców i bez przerzucania odpowiedzialności między firmami.',
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
        'Na kiedy to ma stać?',
        'Gdzie mam odpisać?',
        'Dorzuć dwa zdania o firmie. Możesz pominąć.',
      ],
      ph: ['Anna', '', '', 'mail albo telefon', 'Prowadzimy pizzerię w Cagliari…'],
      opts: [
        [],
        ['Strona firmowa', 'Sklep', 'Rezerwacje online', 'Coś innego'],
        ['Jak najszybciej', 'W tym kwartale', 'Dopiero się rozglądam'],
        [],
        [],
      ],
      next: 'Dalej',
      seal: 'Zaklej i podpisz',
      back: 'wstecz',
      sealed: 'Zaklejone. Zostało wysłać.',
      send: 'Wyślij ze swojej poczty',
      copy: 'skopiuj treść',
      copied: 'skopiowane ✓',
      restart: 'napisz od nowa',
      mailSubject: 'Zapytanie ze strony',
      mailHi: 'Cześć, tu',
      mailNeed: 'Czego potrzebuję',
      mailWhen: 'Na kiedy',
      mailContact: 'Kontakt do mnie',
      mailAbout: 'O firmie',
    },

    guide: {
      hero: 'Cześć. Jestem Piksel i oprowadzę Cię po tej stronie — scrolluj spokojnie.',
      about: 'Krótko o tym, jak pracuję. Bez podwykonawców i bez znikania po fakturze.',
      work: 'Dziewięć stron, które chodzą na produkcji. To w ramce to żywa strona, nie zrzut ekranu.',
      lab: 'To nie są zrzuty ekranu — wszystko tu działa naprawdę. Poklikaj.',
      services: 'Sześć rzeczy, które robię sam. Najedź na listę — po lewej podmieni się opis.',
      process: 'Przewijaj dalej — kroki jadą w bok. Pięć etapów, żadnych niespodzianek na fakturze.',
    },

    loader: ['układam siatkę', 'liczę maskotkę', 'rozgrzewam animacje', 'gotowe'],
    who: 'Piksel',
  },

  /* ─────────────────────────── ENGLISH ─────────────────────────── */
  en: {
    nav: { prace: 'Work', nazywo: 'Live', uslugi: 'Scope', proces: 'Process', kontakt: 'Contact' },

    hero: {
      badge: 'One person, not an agency',
      head: 'Websites and apps,|from the design|to the launch day.',
      role: 'I build sites and apps',
      intro:
        'I design and build everything myself — from the first sketch to the day the site goes live. What I like most are projects where something has to be invented from scratch.',
      cta1: 'See the work',
      cta2: 'Book a call',
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
      title: 'Instead of promising —|here it is, running.',
      lead: 'Five pieces of code from shipped projects. They run in your browser, right now.',
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
      title: 'What you get|in one package.',
      lead: 'No subcontractors and no passing responsibility between firms.',
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
        'When does it have to be ready?',
        'Where should I reply?',
        'Add two sentences about the business. You can skip this.',
      ],
      ph: ['Anna', '', '', 'email or phone', 'We run a pizzeria in Cagliari…'],
      opts: [
        [],
        ['Company site', 'Shop', 'Online booking', 'Something else'],
        ['As soon as possible', 'This quarter', 'Just looking around'],
        [],
        [],
      ],
      next: 'Next',
      seal: 'Seal it',
      back: 'back',
      sealed: 'Sealed. Now send it.',
      send: 'Send from your email',
      copy: 'copy the text',
      copied: 'copied ✓',
      restart: 'start over',
      mailSubject: 'Enquiry from the site',
      mailHi: 'Hello, this is',
      mailNeed: 'What I need',
      mailWhen: 'Timing',
      mailContact: 'Reach me at',
      mailAbout: 'About the business',
    },

    guide: {
      hero: 'Hello. I am Piksel and I will show you around — scroll at your own pace.',
      about: 'Briefly, how I work. No subcontractors and no vanishing after the invoice.',
      work: 'Nine sites running in production. What you see in the frame is the live site, not a screenshot.',
      lab: 'These are not screenshots — everything here actually runs. Have a click.',
      services: 'Six things I do myself. Hover the list and the description swaps on the left.',
      process: 'Keep scrolling — the steps move sideways. Five stages, no surprises on the invoice.',
    },

    loader: ['laying out the grid', 'computing the mascot', 'warming up motion', 'ready'],
    who: 'Piksel',
  },

  /* ─────────────────────────── ITALIANO ─────────────────────────── */
  it: {
    nav: { prace: 'Lavori', nazywo: 'Dal vivo', uslugi: 'Servizi', proces: 'Processo', kontakt: 'Contatti' },

    hero: {
      badge: 'Una persona, non un’agenzia',
      head: 'Siti e applicazioni,|dal progetto|al giorno del lancio.',
      role: 'Faccio siti e applicazioni',
      intro:
        'Progetto e programmo tutto da solo — dal primo schizzo al giorno in cui il sito parte. Quello che mi piace di più sono i progetti dove bisogna inventare qualcosa da zero.',
      cta1: 'Guarda i lavori',
      cta2: 'Fissiamo una call',
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
      title: 'Invece di promettere —|te lo mostro in funzione.',
      lead: 'Cinque pezzi di codice da progetti consegnati. Girano nel tuo browser, adesso.',
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
      title: 'Tutto in un solo|incarico.',
      lead: 'Nessun subappalto e nessuno scaricabarile tra fornitori.',
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
        'Per quando deve essere pronto?',
        'Dove ti rispondo?',
        'Aggiungi due righe sull’attività. Puoi saltare.',
      ],
      ph: ['Anna', '', '', 'mail o telefono', 'Abbiamo una pizzeria a Cagliari…'],
      opts: [
        [],
        ['Sito aziendale', 'Negozio', 'Prenotazioni online', 'Altro'],
        ['Il prima possibile', 'Questo trimestre', 'Mi sto solo guardando intorno'],
        [],
        [],
      ],
      next: 'Avanti',
      seal: 'Sigilla',
      back: 'indietro',
      sealed: 'Sigillato. Resta da inviare.',
      send: 'Invia dalla tua posta',
      copy: 'copia il testo',
      copied: 'copiato ✓',
      restart: 'ricomincia',
      mailSubject: 'Richiesta dal sito',
      mailHi: 'Ciao, sono',
      mailNeed: 'Cosa mi serve',
      mailWhen: 'Tempistica',
      mailContact: 'Mi trovi qui',
      mailAbout: 'Sull’attività',
    },

    guide: {
      hero: 'Ciao. Sono Piksel e ti accompagno — scorri con calma.',
      about: 'In breve, come lavoro. Nessun subappalto e nessuna sparizione dopo la fattura.',
      work: 'Nove siti in produzione. Quello nella cornice è il sito vero, non uno screenshot.',
      lab: 'Non sono screenshot — qui funziona tutto davvero. Prova a cliccare.',
      services: 'Sei cose che faccio da solo. Passa sulla lista e a sinistra cambia la descrizione.',
      process: 'Continua a scorrere — i passi vanno di lato. Cinque tappe, nessuna sorpresa in fattura.',
    },

    loader: ['imposto la griglia', 'calcolo la mascotte', 'scaldo le animazioni', 'pronto'],
    who: 'Piksel',
  },
}

for (const code of Object.keys(dict)) Object.assign(dict[code], extra[code])
