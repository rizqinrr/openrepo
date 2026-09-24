import { useEffect, useState } from 'react'

const LEVELS = [
  { id: 'L', label: 'L (7%)' },
  { id: 'M', label: 'M (15%)' },
  { id: 'Q', label: 'Q (25%)' },
  { id: 'H', label: 'H (30%)' },
]

export default function QrTool() {
  const [input, setInput] = useState('')
  const [size, setSize] = useState(220)
  const [level, setLevel] = useState('M')
  const [dark, setDark] = useState('#111827')
  const [light, setLight] = useState('#FFFFFF')
  const [lib, setLib] = useState(null)
  const [libError, setLibError] = useState('')
  const [result, setResult] = useState({ key: '', url: '', error: '' })

  useEffect(() => {
    let cancelled = false
    import('qrcode').then((module) => {
      if (!cancelled) setLib(module.default ?? module)
    }).catch(() => {
      if (!cancelled) setLibError('Gagal memuat library QR.')
    })
    return () => {
      cancelled = true
    }
  }, [])

  const resultKey = [input, size, level, dark, light].join('|')

  useEffect(() => {
    if (!lib || !input.trim()) return
    let cancelled = false
    lib.toDataURL(input, {
      width: size,
      margin: 2,
      errorCorrectionLevel: level,
      color: { dark, light },
    }).then((url) => {
      if (cancelled) return
      setResult({ key: resultKey, url, error: '' })
    }).catch(() => {
      if (cancelled) return
      setResult({ key: resultKey, url: '', error: 'Teks terlalu panjang untuk tingkat koreksi ini.' })
    })
    return () => {
      cancelled = true
    }
  }, [lib, resultKey, input, size, level, dark, light])

  const isFresh = result.key === resultKey
  const dataUrl = isFresh ? result.url : ''
  const renderError = isFresh ? result.error : ''

  function download() {
    if (!dataUrl) return
    const link = document.createElement('a')
    link.href = dataUrl
    link.download = 'qr-code.png'
    link.click()
  }

  return (
    <div className="dt-tool">
      {!lib && !libError && (
        <div className="dt-status is-ok">
          <span className="material-symbols-outlined">hourglass_empty</span>
          <span>Memuat library QR...</span>
        </div>
      )}
      {libError && (
        <div className="dt-status is-error" role="alert">
          <span className="material-symbols-outlined">error</span>
          <span>{libError}</span>
        </div>
      )}

      <div className="dt-textarea-wrap">
        <label className="dt-label" htmlFor="qr-input">Teks atau URL</label>
        <textarea
          id="qr-input"
          className="dt-textarea"
          rows="3"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="https://github.com"
          spellCheck="false"
        />
      </div>

      <div className="dt-kv">
        <div className="dt-kv-row">
          <span className="dt-kv-label">Ukuran</span>
          <div className="dt-range-wrap">
            <input
              className="dt-range"
              type="range"
              min="120"
              max="480"
              step="20"
              value={size}
              onChange={(e) => setSize(Number(e.target.value))}
            />
            <span className="dt-kv-value">{size}px</span>
          </div>
        </div>
        <div className="dt-kv-row">
          <span className="dt-kv-label">Koreksi error</span>
          <div className="dt-segmented dt-segmented-wrap" role="group" aria-label="Tingkat koreksi error">
            {LEVELS.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`dt-seg-btn${level === item.id ? ' is-active' : ''}`}
                onClick={() => setLevel(item.id)}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
        <div className="dt-kv-row">
          <span className="dt-kv-label">Warna</span>
          <div className="dt-color-pair">
            <label className="dt-color-picker-label" title="Warna QR">
              <input
                className="dt-color-picker"
                type="color"
                value={dark}
                onChange={(e) => setDark(e.target.value)}
              />
              <span>
                <em className="dt-color-dot" style={{ background: dark }} />
                QR
              </span>
            </label>
            <label className="dt-color-picker-label" title="Warna latar">
              <input
                className="dt-color-picker"
                type="color"
                value={light}
                onChange={(e) => setLight(e.target.value)}
              />
              <span>
                <em className="dt-color-dot" style={{ background: light }} />
                Latar
              </span>
            </label>
          </div>
        </div>
      </div>

      {dataUrl ? (
        <div className="dt-qr-result">
          <div
            className="dt-qr-frame"
            style={{
              width: Math.min(size, 320),
              height: Math.min(size, 320),
              padding: Math.round(Math.min(size, 320) * 0.06),
              background: light,
            }}
          >
            <img
              src={dataUrl}
              alt="Kode QR untuk input yang diberikan"
              width={Math.min(size, 320)}
              height={Math.min(size, 320)}
            />
          </div>
          <div className="dt-actions">
            <button type="button" className="dt-btn" onClick={download}>
              <span className="material-symbols-outlined">download</span>
              Simpan PNG
            </button>
          </div>
        </div>
      ) : (
        input.trim() !== '' &&
        (renderError ? (
          <div className="dt-status is-error" role="alert">
            <span className="material-symbols-outlined">error</span>
            <span>{renderError}</span>
          </div>
        ) : (
          <div className="dt-status is-ok">
            <span className="material-symbols-outlined">hourglass_empty</span>
            <span>Membuat kode QR...</span>
          </div>
        ))
      )}
    </div>
  )
}