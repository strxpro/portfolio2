/**
 * Formularz kontaktowy portfolio → WhatsApp (CallMeBot).
 *
 * Jedna trasa: POST /kontakt z JSON-em briefu. Worker sprawdza dane, odsiewa
 * boty, składa czytelną wiadomość i wysyła ją na każdy numer z sekretu
 * WHATSAPP_ALERTS. Odpowiada dopiero, gdy wie, czy wiadomość wyszła — dzięki
 * temu toast „doleciało” na stronie mówi prawdę, a przy awarii formularz
 * proponuje zwykły mail zamiast udawać sukces.
 *
 * Dane z przeglądarki są sprawdzane tu drugi raz (e-mail, telefon, termin):
 * formularz na stronie da się obejść jednym poleceniem curl.
 */

const CALLMEBOT = 'https://api.callmebot.com/whatsapp.php'

/** Pola tekstowe briefu i ich maksymalne długości. Wszystko inne jest ignorowane. */
const POLA = { imie: 80, czego: 80, email: 120, telefon: 24, opis: 1200 }

/** Szybciej niż w 2,5 s człowiek pięciu pytań nie przejdzie — to bot. */
const MIN_CZAS_MS = 2500

/** Większego zgłoszenia formularz nie wyprodukuje; nie czytamy więcej. */
const MAX_BAJTOW = 8_000

const EMAIL = /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)*\.[a-z]{2,}$/i
/** Numer z kierunkowym: „+48 600 111 222” — plus i 7–15 cyfr. */
const TELEFON = /^\+\d{1,4}(?: ?\d){6,14}$/
const DZIEN = /^(\d{4})-(\d{2})-(\d{2})$/
const GODZINA = /^([01]\d|2[0-3]):(00|30)$/

export default {
  async fetch(request, env) {
    const url = new URL(request.url)
    const cors = naglowkiCors(request.headers.get('Origin'), env)

    if (request.method === 'OPTIONS') {
      return cors ? new Response(null, { status: 204, headers: cors }) : new Response(null, { status: 403 })
    }
    if (url.pathname !== '/kontakt') return odpowiedz({ error: 'NOT_FOUND' }, 404, cors)
    if (request.method !== 'POST') return odpowiedz({ error: 'METHOD_NOT_ALLOWED' }, 405, cors)
    if (!cors) return odpowiedz({ error: 'ORIGIN_NOT_ALLOWED' }, 403)

    // Limit na adres IP. Binding jest opcjonalny, żeby `wrangler dev` bez
    // konfiguracji limitera nie wywracał się na starcie.
    if (env.LIMIT) {
      const ip = request.headers.get('CF-Connecting-IP') || 'nieznany'
      const { success } = await env.LIMIT.limit({ key: ip })
      if (!success) return odpowiedz({ error: 'TOO_MANY' }, 429, cors)
    }

    const surowe = await czytajOgraniczone(request, MAX_BAJTOW)
    if (surowe === null) return odpowiedz({ error: 'TOO_LARGE' }, 413, cors)

    let dane
    try {
      dane = JSON.parse(surowe)
    } catch {
      return odpowiedz({ error: 'BAD_JSON' }, 400, cors)
    }
    if (!dane || typeof dane !== 'object') return odpowiedz({ error: 'BAD_JSON' }, 400, cors)

    /**
     * Pułapki na boty odpowiadają SUKCESEM.
     * Bot, który dostaje błąd, próbuje dalej i uczy się, co go zdradziło.
     * Bot, który dostaje „ok”, idzie gdzie indziej. Na WhatsApp nic nie leci.
     */
    if (String(dane.www || '').trim() !== '') return odpowiedz({ ok: true }, 200, cors)
    if (Number(dane.czas) > 0 && Number(dane.czas) < MIN_CZAS_MS) return odpowiedz({ ok: true }, 200, cors)

    const pola = {}
    for (const [klucz, max] of Object.entries(POLA)) pola[klucz] = oczysc(dane[klucz], max, klucz === 'opis')
    const termin = sprawdzTermin(dane.termin)

    const bledy = []
    if (!pola.imie) bledy.push('imie')
    if (!pola.czego) bledy.push('czego')
    if (!termin) bledy.push('termin')
    if (!pola.email && !pola.telefon) bledy.push('kontakt')
    if (pola.email && !EMAIL.test(pola.email)) bledy.push('email')
    if (pola.telefon && !TELEFON.test(pola.telefon)) bledy.push('telefon')
    if (bledy.length) return odpowiedz({ error: 'MISSING', fields: bledy }, 400, cors)

    const numery = celeWhatsapp(env)
    if (!numery.length) {
      console.error(JSON.stringify({ zdarzenie: 'kontakt', blad: 'BRAK_WHATSAPP_ALERTS' }))
      return odpowiedz({ error: 'NOT_CONFIGURED' }, 503, cors)
    }

    const jezykStrony = ['pl', 'en', 'it'].includes(dane.lang) ? dane.lang : 'pl'
    const wyniki = await Promise.all(
      numery.map((cel) => wyslijWhatsapp(env, cel, wiadomosc(pola, termin, jezykStrony, cel.jezyk))),
    )
    const doszlo = wyniki.filter((w) => w.ok).length

    console.log(JSON.stringify({
      zdarzenie: 'kontakt',
      numerow: numery.length,
      doszlo,
      bledy: wyniki.filter((w) => !w.ok).map((w) => w.powod),
    }))

    // Wystarczy, że wiadomość doszła na jeden numer.
    if (!doszlo) return odpowiedz({ error: 'NOT_DELIVERED' }, 502, cors)
    return odpowiedz({ ok: true }, 200, cors)
  },
}

/**
 * Termin: { typ: 'dogadac' } albo { typ: 'termin', dzien, godzina }.
 * Zwraca znormalizowany obiekt albo null, gdy dane nie mają sensu
 * (zły format, nieistniejąca data jak 31 lutego, minuty inne niż :00/:30).
 */
function sprawdzTermin(t) {
  if (!t || typeof t !== 'object') return null
  if (t.typ === 'dogadac') return { typ: 'dogadac' }
  if (t.typ !== 'termin') return null
  const d = DZIEN.exec(String(t.dzien || ''))
  if (!d || !GODZINA.test(String(t.godzina || ''))) return null
  const [r, m, dz] = [+d[1], +d[2], +d[3]]
  const data = new Date(Date.UTC(r, m - 1, dz))
  if (data.getUTCFullYear() !== r || data.getUTCMonth() !== m - 1 || data.getUTCDate() !== dz) return null
  return { typ: 'termin', r, m, d: dz, godzina: t.godzina }
}

/* ─────────────────────────── wiadomość ─────────────────────────── */

const RAMKI = {
  pl: {
    naglowek: '📩 *Nowe zapytanie ze strony STRX*',
    imie: '👤 *Imię*',
    czego: '🧩 *Czego potrzebuje*',
    rozmowa: '📅 *Rozmowa*',
    dogadac: '🤝 *Termin*: chce się najpierw dogadać',
    telefon: '📞 *Telefon*',
    email: '✉️ *E-mail*',
    opis: '💬 *Co go interesuje*',
    jezyk: '🌐 Język strony',
    strefa: 'czas PL/IT',
    stopka: 'Odpisz, póki temat jest ciepły.',
    locale: 'pl-PL',
  },
  it: {
    naglowek: '📩 *Nuova richiesta dal sito STRX*',
    imie: '👤 *Nome*',
    czego: '🧩 *Cosa serve*',
    rozmowa: '📅 *Chiamata*',
    dogadac: '🤝 *Quando*: vuole prima parlarne',
    telefon: '📞 *Telefono*',
    email: '✉️ *Email*',
    opis: '💬 *Cosa gli interessa*',
    jezyk: '🌐 Lingua del sito',
    strefa: 'ora italiana',
    stopka: 'Rispondi finché l’interesse è caldo.',
    locale: 'it-IT',
  },
}

/**
 * Dane klienta idą DOSŁOWNIE, tłumaczona jest tylko ramka.
 * Kontakt w osobnych liniach: WhatsApp sam robi z numeru i adresu
 * klikalne odnośniki, jeśli stoją na końcu linii.
 */
function wiadomosc(p, termin, jezykStrony, jezykRamki) {
  const r = RAMKI[jezykRamki] || RAMKI.pl
  const kreska = '━━━━━━━━━━━━━━'
  const godzina = new Intl.DateTimeFormat(r.locale, {
    timeZone: 'Europe/Rome',
    day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit',
  }).format(new Date())

  let kiedy = r.dogadac
  if (termin.typ === 'termin') {
    // południe UTC: dzień tygodnia nie przeskoczy przy żadnej strefie
    const data = new Date(Date.UTC(termin.r, termin.m - 1, termin.d, 12))
    const dzien = new Intl.DateTimeFormat(r.locale, { timeZone: 'UTC', weekday: 'short', day: '2-digit', month: '2-digit', year: 'numeric' }).format(data)
    kiedy = `${r.rozmowa}: ${dzien}, ${termin.godzina} (${r.strefa})`
  }

  return [
    r.naglowek,
    kreska,
    `${r.imie}: ${p.imie}`,
    `${r.czego}: ${p.czego}`,
    kiedy,
    ...(p.telefon ? [`${r.telefon}: ${p.telefon}`] : []),
    ...(p.email ? [`${r.email}: ${p.email}`] : []),
    ...(p.opis ? ['', `${r.opis}:`, p.opis] : []),
    kreska,
    `${r.jezyk}: ${jezykStrony.toUpperCase()} · 🕒 ${godzina}`,
    '',
    r.stopka,
  ].join('\n')
}

/* ─────────────────────────── CallMeBot ─────────────────────────── */

/** WHATSAPP_ALERTS = "numer:klucz[:pl|it],numer:klucz" — ten sam format co w Carruleddhi. */
function celeWhatsapp(env) {
  return String(env.WHATSAPP_ALERTS || '')
    .split(',')
    .map((para) => para.trim())
    .filter(Boolean)
    .map((para) => {
      const [numer, klucz, jezyk] = para.split(':').map((x) => (x || '').trim())
      return numer && klucz ? { numer: numer.replace(/^\+/, ''), klucz, jezyk: jezyk === 'it' ? 'it' : 'pl' } : null
    })
    .filter(Boolean)
}

/**
 * CallMeBot ODMAWIA ZE STATUSEM 200 — wyczerpany limit albo zły klucz to
 * „HTTP 200 … Message not sent”. Dlatego sukces liczymy z treści odpowiedzi,
 * nie z kodu (zmierzone przy Carruleddhi: zielone przebiegi, cichy telefon).
 *
 * Nigdy nie rzuca: zwraca { ok, powod }. Z numeru w logach zostają 4 cyfry.
 */
async function wyslijWhatsapp(env, { numer, klucz }, tekst) {
  const koncowka = numer.slice(-4)
  const url = new URL(env.CALLMEBOT_URL || CALLMEBOT)
  url.searchParams.set('phone', numer)
  url.searchParams.set('apikey', klucz)
  url.searchParams.set('text', tekst)
  try {
    const r = await fetch(url, { signal: AbortSignal.timeout(8000) })
    const tresc = (await czytajOgraniczone(r, 4000) ?? '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
    if (!r.ok) return { ok: false, powod: `...${koncowka}: HTTP ${r.status}` }
    if (/not sent|0 messages left|apikey is not valid|not registered/i.test(tresc)) {
      return { ok: false, powod: `...${koncowka}: ${tresc.slice(0, 140)}` }
    }
    return { ok: true }
  } catch (e) {
    return { ok: false, powod: `...${koncowka}: ${e?.name || 'Error'}` }
  }
}

/* ─────────────────────────── pomocnicze ─────────────────────────── */

/** Tekst bez znaków sterujących i ze zwiniętymi odstępami. Nowe linie zostają tylko w opisie. */
function oczysc(wartosc, max, wieleLinii = false) {
  let t = String(wartosc ?? '')
    .replace(/\r\n?/g, '\n')
    // znaki sterujące poza nową linią
    .replace(/[\u0000-\u0009\u000B-\u001F\u007F]/g, ' ')
  t = wieleLinii ? t.replace(/\n{3,}/g, '\n\n') : t.replace(/\n+/g, ' ')
  return t.replace(/[ \t]+/g, ' ').trim().slice(0, max)
}

/**
 * Czyta treść strumieniowo i przerywa po `max` bajtach.
 * Zwraca null, gdy treść jest większa — nie ładujemy do pamięci niczego,
 * czego formularz by nie wysłał.
 */
async function czytajOgraniczone(zrodlo, max) {
  if (!zrodlo.body) return ''
  const reader = zrodlo.body.getReader()
  const kawalki = []
  let razem = 0
  for (;;) {
    const { done, value } = await reader.read()
    if (done) break
    razem += value.byteLength
    if (razem > max) {
      await reader.cancel()
      return null
    }
    kawalki.push(value)
  }
  const calosc = new Uint8Array(razem)
  let o = 0
  for (const k of kawalki) { calosc.set(k, o); o += k.byteLength }
  return new TextDecoder().decode(calosc)
}

/**
 * Nagłówki CORS albo null, gdy strona nie ma prawa wysyłać.
 * Puste ALLOWED_ORIGINS = każda strona (do testów lokalnych).
 */
function naglowkiCors(origin, env) {
  const lista = String(env.ALLOWED_ORIGINS || '').split(',').map((x) => x.trim()).filter(Boolean)
  const wolno = !lista.length || (origin && lista.includes(origin))
  if (!wolno) return null
  return {
    'Access-Control-Allow-Origin': lista.length ? origin : '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin',
  }
}

function odpowiedz(obj, status, cors) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', ...(cors || {}) },
  })
}
