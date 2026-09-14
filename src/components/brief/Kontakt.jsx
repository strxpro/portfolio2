import { useT } from '../../lib/lang-ctx'
import { KIERUNKOWE, emailPoprawny, telefonPoprawny } from '../../lib/walidacja'

/**
 * Krok „Gdzie mam odpisać?” — e-mail, telefon albo oba.
 *
 * Błąd pokazujemy dopiero po wyjściu z pola albo po próbie przejścia dalej
 * (`pokazBledy`). Czerwony komunikat w trakcie pisania pierwszej litery
 * adresu to karanie kogoś, kto jeszcze nie skończył.
 *
 * Wartość: { email, kod, tel }.
 */
export default function Kontakt({ value, onChange, pokazBledy, onDotkniete, onEnter, inputRef }) {
  const t = useT()
  const { email = '', kod = '+48', tel = '' } = value || {}
  const stan = sprawdzKontakt(value)
  const reg = KIERUNKOWE.find(([k]) => k === kod)
  const set = (zmiana) => onChange({ email, kod, tel, ...zmiana })
  const pusto = !email.trim() && !tel.trim() && pokazBledy.email && pokazBledy.tel

  const bladTel = !stan.telOk
    ? reg && reg[2] === reg[3]
      ? t.brief.zlyTel.replace('{kod}', kod).replace('{ile}', reg[2])
      : t.brief.zlyTelOgolny
    : ''

  return (
    <div className="kt">
      {/* po próbie przejścia z pustymi polami wskazówka staje się komunikatem —
          inaczej guzik „Dalej” po prostu nie reagował i nie było wiadomo czemu */}
      <p className={`tr-mini ${pusto ? 'kt-blad' : ''}`} role={pusto ? 'alert' : undefined}>{t.brief.jednoLubOba}</p>

      <label className="kt-pole">
        <span>{t.brief.email}</span>
        <input
          ref={inputRef}
          className={`brief-input ${pokazBledy.email && !stan.emailOk ? 'zle' : ''}`}
          type="email"
          inputMode="email"
          autoComplete="email"
          maxLength={120}
          value={email}
          placeholder="anna@firma.pl"
          aria-invalid={pokazBledy.email && !stan.emailOk}
          onChange={(e) => set({ email: e.target.value })}
          onBlur={() => onDotkniete('email')}
          onKeyDown={(e) => e.key === 'Enter' && onEnter()}
        />
      </label>
      {pokazBledy.email && !stan.emailOk && <p className="kt-blad" role="alert">{t.brief.zlyEmail}</p>}

      <label className="kt-pole">
        <span>{t.brief.telefon}</span>
        <span className="kt-tel">
          <select
            className="kt-kod"
            value={kod}
            aria-label={t.brief.telefon}
            onChange={(e) => set({ kod: e.target.value })}
          >
            {KIERUNKOWE.map(([k, flaga]) => (
              <option key={k} value={k}>{flaga} {k}</option>
            ))}
          </select>
          <input
            className={`brief-input ${pokazBledy.tel && !stan.telOk ? 'zle' : ''}`}
            type="tel"
            inputMode="tel"
            autoComplete="tel-national"
            maxLength={18}
            value={tel}
            placeholder={kod === '+39' ? '340 123 4567' : '600 123 456'}
            aria-invalid={pokazBledy.tel && !stan.telOk}
            onChange={(e) => set({ tel: e.target.value.replace(/[^\d\s\-()]/g, '') })}
            onBlur={() => onDotkniete('tel')}
            onKeyDown={(e) => e.key === 'Enter' && onEnter()}
          />
        </span>
      </label>
      {pokazBledy.tel && !stan.telOk && <p className="kt-blad" role="alert">{bladTel}</p>}
    </div>
  )
}

/**
 * Stan kroku: puste pole jest „w porządku” (nie musi być podane),
 * ale choć jedno musi być wypełnione i każde wypełnione — poprawne.
 */
export function sprawdzKontakt(v) {
  const email = (v?.email || '').trim()
  const tel = (v?.tel || '').trim()
  const emailOk = !email || emailPoprawny(email)
  const telOk = !tel || telefonPoprawny(v?.kod || '+48', tel).ok
  return { emailOk, telOk, gotowy: (!!email || !!tel) && emailOk && telOk }
}
