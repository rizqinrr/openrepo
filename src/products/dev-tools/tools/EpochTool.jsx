import { useMemo, useState } from 'react'

function detectUnit(valueText) {
  const value = Number(valueText)
  if (!Number.isFinite(value)) return { value: null, unit: null, date: null }
  const abs = Math.abs(value)
  if (abs >= 1e12) return { value, unit: 'ms', date: new Date(value) }
  return { value, unit: 's', date: new Date(value * 1000) }
}

function formatDateTime(date, locale) {
  return date.toLocaleString(locale, {
    dateStyle: 'medium',
    timeStyle: 'medium',
  })
}

function formatFull(date) {
  try {
    return date.toLocaleString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZoneName: 'short',
    })
  } catch {
    return date.toString()
  }
}

export default function EpochTool() {
  const [timestampText, setTimestampText] = useState('')
  const [dateInput, setDateInput] = useState('')
  const [copied, setCopied] = useState(null)

  const result = useMemo(() => detectUnit(timestampText), [timestampText])

  const parsedDate = useMemo(() => {
    if (!dateInput) return null
    const date = new Date(dateInput)
    return Number.isNaN(date.getTime()) ? null : date
  }, [dateInput])

  async function copyValue(key, value) {
    try {
      await navigator.clipboard.writeText(value)
    } catch {
      // clipboard tidak tersedia
    }
    setCopied(key)
    setTimeout(() => setCopied(null), 1200)
  }

  const now = () => setTimestampText(String(Math.floor(Date.now() / 1000)))

  return (
    <div className="dt-tool">
      <div className="dt-textarea-wrap">
        <label className="dt-label" htmlFor="epoch-input">Unix timestamp</label>
        <input
          id="epoch-input"
          className="dt-input"
          type="text"
          value={timestampText}
          onChange={(e) => setTimestampText(e.target.value)}
          placeholder="masukkan detik atau milidetik, contoh: 1750000000"
          inputMode="numeric"
          spellCheck="false"
        />
        <div className="dt-actions">
          <button type="button" className="dt-btn dt-btn-ghost" onClick={now}>
            <span className="material-symbols-outlined">schedule</span>
            Sekarang
          </button>
        </div>
      </div>

      {result.value !== null && result.date && (
        <div className="dt-kv">
          <div className="dt-kv-row">
            <span className="dt-kv-label">Satuan terdeteksi</span>
            <span className="dt-kv-value">{result.unit === 'ms' ? 'Milidetik (ms)' : 'Detik (s)'}</span>
          </div>
          <div className="dt-kv-row">
            <span className="dt-kv-label">Waktu lokal</span>
            <span className="dt-kv-value">{formatDateTime(result.date, 'id-ID')}</span>
          </div>
          <div className="dt-kv-row">
            <span className="dt-kv-label">Waktu UTC</span>
            <span className="dt-kv-value">{formatDateTime(result.date, 'en-GB')} UTC</span>
          </div>
          <div className="dt-kv-row">
            <span className="dt-kv-label">ISO 8601</span>
            <span className="dt-kv-value">{result.date.toISOString()}</span>
          </div>
        </div>
      )}

      {timestampText.trim() !== '' && result.value === null && (
        <div className="dt-status is-error" role="alert">
          <span className="material-symbols-outlined">error</span>
          <span>Nomor timestamp tidak valid.</span>
        </div>
      )}

      <div className="dt-divider" />

      <div className="dt-textarea-wrap">
        <label className="dt-label" htmlFor="epoch-date">Dari tanggal</label>
        <input
          id="epoch-date"
          className="dt-input"
          type="datetime-local"
          value={dateInput}
          onChange={(e) => setDateInput(e.target.value)}
        />
      </div>

      {parsedDate && (
        <div className="dt-kv">
          <div className="dt-kv-row">
            <span className="dt-kv-label">Detik (Unix)</span>
            <span className="dt-kv-value">{Math.floor(parsedDate.getTime() / 1000)}</span>
            <button
              type="button"
              className="dt-btn-mini"
              onClick={() => copyValue('s', String(Math.floor(parsedDate.getTime() / 1000)))}
            >
              <span className="material-symbols-outlined">
                {copied === 's' ? 'check' : 'content_copy'}
              </span>
            </button>
          </div>
          <div className="dt-kv-row">
            <span className="dt-kv-label">Milidetik</span>
            <span className="dt-kv-value">{parsedDate.getTime()}</span>
            <button
              type="button"
              className="dt-btn-mini"
              onClick={() => copyValue('ms', String(parsedDate.getTime()))}
            >
              <span className="material-symbols-outlined">
                {copied === 'ms' ? 'check' : 'content_copy'}
              </span>
            </button>
          </div>
          <div className="dt-kv-row">
            <span className="dt-kv-label">Tanggal lengkap</span>
            <span className="dt-kv-value">{formatFull(parsedDate)}</span>
          </div>
        </div>
      )}

      {result.value !== null && result.date && (
        <div className="dt-actions">
          <button
            type="button"
            className="dt-btn"
            onClick={() => copyValue('iso', result.date.toISOString())}
          >
            <span className="material-symbols-outlined">
              {copied === 'iso' ? 'check' : 'content_copy'}
            </span>
            {copied === 'iso' ? 'Tersalin' : 'Salin ISO'}
          </button>
        </div>
      )}
    </div>
  )
}