import { useMemo, useState } from 'react'

const MODES = [
  { id: 'base64', label: 'Base64' },
  { id: 'url', label: 'URL encode' },
]

export default function EncoderTool() {
  const [mode, setMode] = useState('base64')
  const [direction, setDirection] = useState('encode')
  const [input, setInput] = useState('')
  const [copied, setCopied] = useState(false)

  const result = useMemo(() => {
    if (!input) return { output: '', error: null }
    try {
      let output = ''
      if (mode === 'base64') {
        if (direction === 'encode') {
          const bytes = new TextEncoder().encode(input)
          let binary = ''
          for (const byte of bytes) binary += String.fromCharCode(byte)
          output = btoa(binary)
        } else {
          const binary = atob(input)
          const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0))
          output = new TextDecoder().decode(bytes)
        }
      } else if (direction === 'encode') {
        output = encodeURIComponent(input)
      } else {
        output = decodeURIComponent(input)
      }
      return { output, error: null }
    } catch (error) {
      return { output: '', error: error.message }
    }
  }, [mode, direction, input])

  async function copyOutput() {
    if (!result.output) return
    try {
      await navigator.clipboard.writeText(result.output)
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
          <span className="dt-kv-label">Mode</span>
          <div className="dt-segmented" role="group" aria-label="Mode encoding">
            {MODES.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`dt-seg-btn${mode === item.id ? ' is-active' : ''}`}
                onClick={() => setMode(item.id)}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
        <div className="dt-kv-row">
          <span className="dt-kv-label">Arah</span>
          <div className="dt-segmented" role="group" aria-label="Arah transformasi">
            <button
              type="button"
              className={`dt-seg-btn${direction === 'encode' ? ' is-active' : ''}`}
              onClick={() => setDirection('encode')}
            >
              Encode
            </button>
            <button
              type="button"
              className={`dt-seg-btn${direction === 'decode' ? ' is-active' : ''}`}
              onClick={() => setDirection('decode')}
            >
              Decode
            </button>
          </div>
        </div>
      </div>

      <div className="dt-textarea-wrap">
        <label className="dt-label" htmlFor="encoder-input">
          {direction === 'encode' ? 'Input teks' : 'Input encoded'}
        </label>
        <textarea
          id="encoder-input"
          className="dt-textarea"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={
            direction === 'encode'
              ? 'contoh: https://example.com/path?q=selamat datang'
              : 'contoh: aHR0cHM6Ly9leGFtcGxlLmNvbQ=='
          }
          spellCheck="false"
        />
      </div>

      {result.error && (
        <div className="dt-status is-error" role="alert">
          <span className="material-symbols-outlined">error</span>
          <span>Input tidak valid: {result.error}</span>
        </div>
      )}

      {!result.error && result.output !== '' && (
        <>
          <div className="dt-textarea-wrap">
            <label className="dt-label" htmlFor="encoder-output">Hasil</label>
            <textarea
              id="encoder-output"
              className="dt-textarea dt-textarea-code"
              value={result.output}
              readOnly
              spellCheck="false"
            />
          </div>
          <div className="dt-actions">
            <button type="button" className="dt-btn" onClick={copyOutput}>
              <span className="material-symbols-outlined">
                {copied ? 'check' : 'content_copy'}
              </span>
              {copied ? 'Tersalin' : 'Salin'}
            </button>
          </div>
        </>
      )}
    </div>
  )
}