import { useMemo, useState } from 'react'

const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz'
const UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const DIGITS = '0123456789'
const SYMBOLS = '!@#$%^&*()-_=+[]{};:,./?'
const AMBIGUOUS = 'O0Il1'

function getRandomValues(bytes) {
  if (globalThis.crypto?.getRandomValues) {
    return globalThis.crypto.getRandomValues(bytes)
  }
  return Uint8Array.from(bytes, () => Math.floor(Math.random() * 256))
}

function randomInt(max) {
  const buffer = new Uint8Array(1)
  getRandomValues(buffer)
  const value = buffer[0]
  const threshold = 256 - (256 % max)
  if (value < threshold) return value % max
  return randomInt(max)
}

function generatePassword(length, options) {
  let pool = ''
  if (options.lowercase) pool += LOWERCASE
  if (options.uppercase) pool += UPPERCASE
  if (options.digits) pool += DIGITS
  if (options.symbols) pool += SYMBOLS
  if (options.excludeAmbiguous) {
    pool = [...pool].filter((char) => !AMBIGUOUS.includes(char)).join('')
  }
  if (!pool) return ''

  const chars = []
  const required = [
    options.lowercase ? LOWERCASE : '',
    options.uppercase ? UPPERCASE : '',
    options.digits ? DIGITS : '',
    options.symbols ? SYMBOLS : '',
  ].filter(Boolean)

  for (const group of required) {
    const cleanGroup = options.excludeAmbiguous
      ? [...group].filter((char) => !AMBIGUOUS.includes(char)).join('')
      : group
    if (cleanGroup) chars.push(cleanGroup[randomInt(cleanGroup.length)])
  }

  while (chars.length < length) chars.push(pool[randomInt(pool.length)])
  for (let i = chars.length - 1; i > 0; i -= 1) {
    const j = randomInt(i + 1)
    ;[chars[i], chars[j]] = [chars[j], chars[i]]
  }
  return chars.slice(0, length).join('')
}

function analyzeEntropy(password) {
  if (!password) return { score: 0, label: '', entropy: 0, checks: [] }
  let poolSize = 0
  if (/[a-z]/.test(password)) poolSize += 26
  if (/[A-Z]/.test(password)) poolSize += 26
  if (/[0-9]/.test(password)) poolSize += 10
  if (/[^a-zA-Z0-9]/.test(password)) poolSize += 32
  const entropy = Math.round(password.length * Math.log2(poolSize || 1))
  const hasLength = password.length >= 12
  const hasLower = /[a-z]/.test(password)
  const hasUpper = /[A-Z]/.test(password)
  const hasDigit = /[0-9]/.test(password)
  const hasSymbol = /[^a-zA-Z0-9]/.test(password)
  const variety = [hasLower, hasUpper, hasDigit, hasSymbol].filter(Boolean).length

  let score = 0
  if (hasLength) score += 2
  if (variety >= 3) score += 2
  if (variety >= 4) score += 1
  if (entropy >= 80) score += 2
  else if (entropy >= 60) score += 1

  let label = 'Sangat Lemah'
  if (score >= 6) label = 'Sangat Kuat'
  else if (score >= 4) label = 'Kuat'
  else if (score >= 2) label = 'Sedang'

  const checks = [
    { ok: hasLength, text: 'Minimal 12 karakter' },
    { ok: hasLower, text: 'Huruf kecil' },
    { ok: hasUpper, text: 'Huruf besar' },
    { ok: hasDigit, text: 'Angka' },
    { ok: hasSymbol, text: 'Simbol' },
  ]
  return { score, label, entropy, checks, maxScore: 7 }
}

const DEFAULT_OPTIONS = {
  length: 16,
  lowercase: true,
  uppercase: true,
  digits: true,
  symbols: true,
  excludeAmbiguous: false,
}

export default function PasswordTool() {
  const [options, setOptions] = useState(DEFAULT_OPTIONS)
  const [generated, setGenerated] = useState('')
  const [checkText, setCheckText] = useState('')
  const [copied, setCopied] = useState(false)

  const analysis = useMemo(() => analyzeEntropy(generated), [generated])
  const checkResult = useMemo(() => analyzeEntropy(checkText), [checkText])

  function setOption(key, value) {
    setOptions((current) => ({ ...current, [key]: value }))
  }

  function handleGenerate() {
    const value = generatePassword(options.length, options)
    setGenerated(value)
  }

  async function copyGenerated() {
    if (!generated) return
    try {
      await navigator.clipboard.writeText(generated)
    } catch {
      // clipboard tidak tersedia
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 1200)
  }

  return (
    <div className="dt-tool">
      <div className="dt-kv">
        <div className="dt-kv-row">
          <span className="dt-kv-label">Panjang</span>
          <div className="dt-range-wrap">
            <input
              className="dt-range"
              type="range"
              min="6"
              max="64"
              value={options.length}
              onChange={(e) => setOption('length', Number(e.target.value))}
            />
            <span className="dt-kv-value">{options.length}</span>
          </div>
        </div>
      </div>

      <div className="dt-flags dt-check-grid" role="group" aria-label="Aturan password">
        {[
          { id: 'lowercase', label: 'Huruf kecil (a–z)' },
          { id: 'uppercase', label: 'Huruf besar (A–Z)' },
          { id: 'digits', label: 'Angka (0–9)' },
          { id: 'symbols', label: 'Simbol (!@#…)' },
          { id: 'excludeAmbiguous', label: 'Hindari ambigu (O0Il1)' },
        ].map((item) => (
          <label key={item.id} className="dt-check dt-check-basic">
            <input
              type="checkbox"
              checked={options[item.id]}
              onChange={(e) => setOption(item.id, e.target.checked)}
            />
            <span>{item.label}</span>
          </label>
        ))}
      </div>

      <div className="dt-actions">
        <button type="button" className="dt-btn" onClick={handleGenerate}>
          <span className="material-symbols-outlined">refresh</span>
          Buat Password
        </button>
      </div>

      {generated && (
        <div className="dt-kv">
          <div className="dt-kv-row">
            <span className="dt-kv-label">Password</span>
            <code className="dt-password-value">{generated}</code>
          </div>
          <div className="dt-actions">
            <button type="button" className="dt-btn dt-btn-ghost" onClick={copyGenerated}>
              <span className="material-symbols-outlined">
                {copied ? 'check' : 'content_copy'}
              </span>
              {copied ? 'Tersalin' : 'Salin'}
            </button>
          </div>
        </div>
      )}

      {generated && (
        <div className="dt-strength">
          <div className="dt-strength-head">
            <span className="dt-kv-label">Kekuatan password</span>
            <span className={`dt-strength-label level-${analysis.score}`}>
              {analysis.label}
            </span>
          </div>
          <div className="dt-strength-bar">
            <span
              className="dt-strength-fill"
              style={{
                width: `${Math.round((analysis.score / analysis.maxScore) * 100)}%`,
              }}
            />
          </div>
          <span className="dt-kv-label">
            Entropi ≈ {analysis.entropy} bit
          </span>
        </div>
      )}

      <div className="dt-divider" />

      <div className="dt-textarea-wrap">
        <label className="dt-label" htmlFor="check-password">Periksa kekuatan password</label>
        <input
          id="check-password"
          className="dt-input"
          type="password"
          value={checkText}
          onChange={(e) => setCheckText(e.target.value)}
          placeholder="ketik password untuk dianalisis"
          autoComplete="off"
        />
      </div>

      {checkText && (
        <div className="dt-strength">
          <div className="dt-strength-head">
            <span className="dt-kv-label">Skor {checkResult.score}/{checkResult.maxScore}</span>
            <span className={`dt-strength-label level-${checkResult.score}`}>
              {checkResult.label}
            </span>
          </div>
          <div className="dt-strength-bar">
            <span
              className="dt-strength-fill"
              style={{
                width: `${Math.round((checkResult.score / checkResult.maxScore) * 100)}%`,
              }}
            />
          </div>
          <div className="dt-checks">
            {checkResult.checks.map((check, index) => (
              <span
                key={index}
                className={`dt-check-item${check.ok ? ' is-ok' : ''}`}
              >
                <span className="material-symbols-outlined">
                  {check.ok ? 'check' : 'close'}
                </span>
                {check.text}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}