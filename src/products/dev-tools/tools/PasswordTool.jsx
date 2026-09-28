import { useMemo, useState } from 'react'
import {
  generatePasswords,
  buildPool,
  passwordEntropy,
  strengthFor,
  DEFAULT_LENGTH,
  MIN_LENGTH,
  MAX_LENGTH,
} from '../lib/password.js'

const COUNTS = ['1', '2', '4', '6', '8', '10']

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    return false
  }
}

export default function PasswordTool() {
  const [options, setOptions] = useState({
    length: DEFAULT_LENGTH,
    count: 4,
    useLower: true,
    useUpper: true,
    useDigits: true,
    useSymbols: false,
    excludeAmbiguous: true,
    exclude: '',
  })
  const [results, setResults] = useState([])
  const [error, setError] = useState(null)
  const [copiedIdx, setCopiedIdx] = useState(null)
  const [copiedAll, setCopiedAll] = useState(false)

  const poolInfo = useMemo(() => {
    try {
      return buildPool(options)
    } catch {
      return null
    }
  }, [options])

  const bits = poolInfo ? passwordEntropy(options.length, poolInfo.size) : null
  const strength = bits != null ? strengthFor(bits) : null

  function setOption(key, value) {
    setOptions((prev) => ({ ...prev, [key]: value }))
  }

  function handleGenerate() {
    setError(null)
    try {
      setResults(generatePasswords(options))
    } catch (e) {
      setError(e.message)
      setResults([])
    }
  }

  async function handleCopy(text, idx) {
    if (await copyText(text)) {
      setCopiedIdx(idx)
      setTimeout(() => setCopiedIdx(null), 1500)
    }
  }

  async function handleCopyAll() {
    if (await copyText(results.join('\n'))) {
      setCopiedAll(true)
      setTimeout(() => setCopiedAll(false), 1500)
    }
  }

  return (
    <div className="dt-tool">
      <div className="dt-kv">
        <div className="dt-kv-row dt-kv-col">
          <span className="dt-label">Panjang</span>
          <div className="dt-row">
            <input
              className="dt-range"
              style={{ flex: 1 }}
              type="range"
              min={MIN_LENGTH}
              max={MAX_LENGTH}
              value={options.length}
              onChange={(e) => setOption('length', Number(e.target.value))}
            />
            <input
              style={{ width: 72 }}
              className="dt-input"
              type="number"
              min={MIN_LENGTH}
              max={MAX_LENGTH}
              value={options.length}
              onChange={(e) => {
                const n = Number(e.target.value)
                if (Number.isInteger(n) && n >= MIN_LENGTH && n <= MAX_LENGTH) {
                  setOption('length', n)
                }
              }}
            />
          </div>
        </div>

        <div className="dt-kv-row">
          <span className="dt-kv-label">Jumlah</span>
          <select
            className="dt-select"
            value={String(options.count)}
            onChange={(e) => setOption('count', Number(e.target.value))}
          >
            {COUNTS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div className="dt-kv-row dt-kv-col">
          <span className="dt-kv-label">Tipe karakter</span>
          <div className="dt-flags">
            <label className="dt-check-pill">
              <input
                type="checkbox"
                checked={options.useLower}
                onChange={(e) => setOption('useLower', e.target.checked)}
              />
              huruf kecil a–z
            </label>
            <label className="dt-check-pill">
              <input
                type="checkbox"
                checked={options.useUpper}
                onChange={(e) => setOption('useUpper', e.target.checked)}
              />
              huruf besar A–Z
            </label>
            <label className="dt-check-pill">
              <input
                type="checkbox"
                checked={options.useDigits}
                onChange={(e) => setOption('useDigits', e.target.checked)}
              />
              angka 0–9
            </label>
            <label className="dt-check-pill">
              <input
                type="checkbox"
                checked={options.useSymbols}
                onChange={(e) => setOption('useSymbols', e.target.checked)}
              />
              simbol
            </label>
          </div>
        </div>

        <div className="dt-kv-row">
          <span className="dt-kv-label">Hindari ambigu</span>
          <label className="dt-check-pill">
            <input
              type="checkbox"
              checked={options.excludeAmbiguous}
              onChange={(e) => setOption('excludeAmbiguous', e.target.checked)}
            />
            0O1Il|
          </label>
        </div>

        <div className="dt-kv-row">
          <span className="dt-kv-label">Kecualikan</span>
          <input
            style={{ width: 160 }}
            className="dt-input"
            type="text"
            maxLength={20}
            placeholder="opsional (mis. @#$)"
            value={options.exclude}
            onChange={(e) => setOption('exclude', e.target.value)}
          />
        </div>
      </div>

      <div className="dt-actions">
        <button type="button" className="dt-btn" onClick={handleGenerate}>
          <span className="material-symbols-outlined">refresh</span>
          Generate
        </button>
        {results.length > 0 && (
          <button type="button" className="dt-btn dt-btn-ghost" onClick={handleCopyAll}>
            <span className="material-symbols-outlined">content_copy</span>
            {copiedAll ? 'Tersalin!' : `Salin semua (${results.length})`}
          </button>
        )}
      </div>

      {error && <div className="dt-error-box">{error}</div>}

      {bits != null && strength && (
        <p className="dt-note">
          Pool {poolInfo.size} karakter &times; {options.length} posisi &rarr; entropi{' '}
          <b>{bits.toFixed(1)} bit</b>
          <span className={`dt-status-chip is-${strength.level}`} style={{ marginLeft: 8 }}>
            {strength.label}
          </span>
        </p>
      )}

      {results.length > 0 && (
        <div className="dt-pass-list">
          {results.map((pwd, i) => (
            <div className="dt-copy-card" key={`${options.length}-${pwd}-${i}`}>
              <div className="dt-copy-card-head">
                <span className="dt-cell-note">#{i + 1}</span>
                <button
                  type="button"
                  className="dt-btn-mini"
                  onClick={() => handleCopy(pwd, i)}
                >
                  <span className="material-symbols-outlined">
                    {copiedIdx === i ? 'check' : 'content_copy'}
                  </span>
                  {copiedIdx === i ? 'Tersalin' : 'Salin'}
                </button>
              </div>
              <p className="dt-copy-value">{pwd}</p>
            </div>
          ))}
        </div>
      )}

      <p className="dt-note">
        Acak dengan kriptografi Web Crypto (crypto.getRandomValues), hasil tidak dikirim ke
        mana pun. Gunakan password unik per akun.
      </p>
    </div>
  )
}