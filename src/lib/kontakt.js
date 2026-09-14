/**
 * Wysyłka briefu do Workera formularza (worker/index.js).
 *
 * Adres Workera przychodzi z `VITE_KONTAKT_URL` (plik `.env.local`, patrz
 * README). Bez niego wysyłka od razu kończy się błędem `NOT_CONFIGURED`,
 * a formularz proponuje zwykły mail — strona działa także przed wdrożeniem
 * Workera, tylko bez automatu.
 *
 * Zwraca { ok: true } albo { ok: false, powod }. Nigdy nie rzuca: formularz
 * ma zawsze dostać odpowiedź, na podstawie której pokaże toast albo zapas.
 */
const ADRES = import.meta.env.VITE_KONTAKT_URL

export async function wyslijBrief(dane) {
  if (!ADRES) return { ok: false, powod: 'NOT_CONFIGURED' }
  try {
    const r = await fetch(`${ADRES.replace(/\/$/, '')}/kontakt`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dane),
      // CallMeBot potrafi odpowiadać kilka sekund; dłużej nie każemy czekać
      signal: AbortSignal.timeout(15000),
    })
    const json = await r.json().catch(() => ({}))
    if (r.ok && json.ok) return { ok: true }
    return { ok: false, powod: json.error || `HTTP_${r.status}` }
  } catch (e) {
    return { ok: false, powod: e?.name === 'TimeoutError' ? 'TIMEOUT' : 'NETWORK' }
  }
}
