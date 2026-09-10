// ═══════════════════════════════════════════════════════════
//  Dane niezależne od języka: adresy, kolory, technologie.
//  Wszystkie teksty siedzą w i18n.js.
// ═══════════════════════════════════════════════════════════

export const me = {
  name: 'Claudio Taras',
  brand: 'STRX',
  since: 2019,
  // 8 grudnia — stąd liczy się wiek, żeby nie trzeba było go poprawiać
  born: [2003, 12, 8],
}

/**
 * Wiek liczony z daty urodzin, a nie wpisany na sztywno.
 *
 * Dzięki temu 8 grudnia liczba na stronie zmienia się sama i nikt nie
 * musi o tym pamiętać. Miesiąc podajemy po ludzku (12 = grudzień).
 */
export function ageNow(today = new Date()) {
  const [y, m, d] = me.born
  let age = today.getFullYear() - y
  const before =
    today.getMonth() + 1 < m || (today.getMonth() + 1 === m && today.getDate() < d)
  if (before) age -= 1
  return age
}

/**
 * Twoje zdjęcia.
 *
 * Wrzuć pliki do `public/me/` pod tymi nazwami — nic więcej nie trzeba
 * zmieniać. Dopóki pliku nie ma, w ramce stoi czytelna zaślepka z nazwą,
 * której brakuje, więc strona nigdy nie wygląda na zepsutą.
 *
 * Format: JPG albo WEBP, dłuższy bok ok. 1600 px, do 400 kB.
 * `ratio` to proporcja ramki (szerokość / wysokość).
 */
export const photos = {
  hero: { src: '/me/portret.jpg', ratio: 0.82 },
  side: [
    { src: '/me/przy-pracy.jpg', ratio: 0.78 },
    { src: '/me/biurko.jpg', ratio: 1.25 },
  ],
}

// TODO: podmień na swoje prawdziwe dane
export const contact = {
  email: 'kontakt@twojadomena.pl',
  phone: '+48 000 000 000',
  whatsapp: 'https://wa.me/48000000000',
  instagram: 'https://instagram.com/',
  github: 'https://github.com/strxpro',
}

/** Dziewięć żywych wdrożeń. Kolejność = kolejność w pokazie. */
export const work = [
  { id: 'spabi', name: 'SpabiNext', year: '2026', url: 'https://spabinext.com', host: 'spabinext.com', tint: '#EBD8C8', stack: ['Next.js', 'React', 'GSAP + ScrollTrigger', 'Lenis', 'Supabase', 'Make.com'] },
  { id: 'shistoria', name: "S'Historia", year: '2025', url: 'https://shistoria.it', host: 'shistoria.it', tint: '#D6DEE6', stack: ['Next.js', 'React Three Fiber', 'Three.js', 'GSAP', 'Lenis', 'Supabase'] },
  { id: 'carruleddhi', name: 'Carruleddhi Show', year: '2026', url: 'https://www.carruleddhishow.com', host: 'carruleddhishow.com', tint: '#E4DACB', stack: ['Vite', 'React', 'Supabase', 'Make.com', 'Cloudflare'] },
  { id: 'villadea', name: 'Villa Dea', year: '2025', url: 'https://villadeaaglientu.com', host: 'villadeaaglientu.com', tint: '#D9E1D6', stack: ['Next.js App Router', 'React', 'Framer Motion', 'AWS S3'] },
  { id: 'gioielleria', name: "L'Isola del Gioiello", year: '2025', url: 'https://lisoladelgioiello.com', host: 'lisoladelgioiello.com', tint: '#EEE6CF', stack: ['Next.js', 'React', 'Supabase', 'Cheerio', 'GSAP'] },
  { id: 'cagliariclub', name: 'Cagliari Club Gigi Riva', year: '2025', url: 'https://cagliariclubgigirivasantateresagallura.com', host: 'cagliariclubgigiriva…com', tint: '#DCE3D3', stack: ['Vite', 'React', 'i18n', 'Framer Motion'] },
  { id: 'ilgirasole', name: 'Il Girasole', year: '2026', url: 'https://ristoranteilgirasole.com', host: 'ristoranteilgirasole.com', tint: '#F0E3C8', stack: ['Next.js', 'React', 'Framer Motion', 'Leaflet'] },
  { id: 'renabianca', name: 'Rena Bianca Beach Bar', year: '2025', url: 'https://renabiancabeachbar.com', host: 'renabiancabeachbar.com', tint: '#D8E2E6', stack: ['Next.js', 'React', 'Framer Motion', 'Wideo'] },
  // Shopify blokuje osadzanie (frame-ancestors 'none') — zostaje szkielet
  { id: 'antiqua', name: 'ANTIQUA', year: '2026', url: 'https://antiqua-shop.pl', host: 'antiqua-shop.pl', embed: false, tint: '#E2DDD4', stack: ['Shopify', 'Autorski motyw', 'Liquid'] },
]

export const nav = [
  { id: 'prace', key: 'prace' },
  { id: 'na-zywo', key: 'nazywo' },
  { id: 'uslugi', key: 'uslugi' },
  { id: 'proces', key: 'proces' },
]

/** Harmonogram: od–do w tygodniach, oś 0–5. */
export const sched = [
  [0, 0.45],
  [0.3, 1.25],
  [1.05, 3.25],
  [3.0, 4.25],
  [4.05, 5.0],
]

export const labs = ['trojwymiar', 'rezerwacja', 'jezyki', 'automat', 'zakres']

export const slots = ['12:30', '13:00', '13:30', '19:00', '19:30', '20:00', '20:30', '21:00']

// ── demo: ta sama karta dań w sześciu językach ──────────────
export const demoLangs = [
  { code: 'pl', name: 'Polski' },
  { code: 'it', name: 'Italiano' },
  { code: 'en', name: 'English' },
  { code: 'de', name: 'Deutsch' },
  { code: 'fr', name: 'Français' },
  { code: 'es', name: 'Español' },
]

export const demoMenu = {
  pl: {
    head: 'Karta dnia',
    note: 'Ceny zawierają podatek',
    items: [
      { n: 'Makaron z małżami', d: 'Spaghetti, małże, białe wino, pietruszka', p: '18 €' },
      { n: 'Pieczony okoń morski', d: 'Ziemniaki, oliwki, cytryna', p: '24 €' },
      { n: 'Migdałowy deser', d: 'Migdały z Sardynii, miód, cytrusy', p: '9 €' },
    ],
  },
  it: {
    head: 'Menu del giorno',
    note: 'Prezzi tasse incluse',
    items: [
      { n: 'Spaghetti alle vongole', d: 'Spaghetti, vongole, vino bianco, prezzemolo', p: '18 €' },
      { n: 'Branzino al forno', d: 'Patate, olive, limone', p: '24 €' },
      { n: 'Dolce alle mandorle', d: 'Mandorle sarde, miele, agrumi', p: '9 €' },
    ],
  },
  en: {
    head: "Today's menu",
    note: 'Prices include tax',
    items: [
      { n: 'Spaghetti with clams', d: 'Spaghetti, clams, white wine, parsley', p: '18 €' },
      { n: 'Roasted sea bass', d: 'Potatoes, olives, lemon', p: '24 €' },
      { n: 'Almond dessert', d: 'Sardinian almonds, honey, citrus', p: '9 €' },
    ],
  },
  de: {
    head: 'Tageskarte',
    note: 'Preise inklusive Steuer',
    items: [
      { n: 'Spaghetti mit Venusmuscheln', d: 'Spaghetti, Muscheln, Weißwein, Petersilie', p: '18 €' },
      { n: 'Gebratener Wolfsbarsch', d: 'Kartoffeln, Oliven, Zitrone', p: '24 €' },
      { n: 'Mandeldessert', d: 'Sardische Mandeln, Honig, Zitrusfrüchte', p: '9 €' },
    ],
  },
  fr: {
    head: 'Menu du jour',
    note: 'Prix taxes comprises',
    items: [
      { n: 'Spaghettis aux palourdes', d: 'Spaghettis, palourdes, vin blanc, persil', p: '18 €' },
      { n: 'Bar rôti', d: 'Pommes de terre, olives, citron', p: '24 €' },
      { n: 'Dessert aux amandes', d: 'Amandes sardes, miel, agrumes', p: '9 €' },
    ],
  },
  es: {
    head: 'Menú del día',
    note: 'Precios con impuestos',
    items: [
      { n: 'Espaguetis con almejas', d: 'Espaguetis, almejas, vino blanco, perejil', p: '18 €' },
      { n: 'Lubina al horno', d: 'Patatas, aceitunas, limón', p: '24 €' },
      { n: 'Postre de almendra', d: 'Almendras sardas, miel, cítricos', p: '9 €' },
    ],
  },
}
