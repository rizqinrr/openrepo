import { useState } from 'react'

function formatJson(raw) {
  const parsed = JSON.parse(raw)
  return JSON.stringify(parsed, null, 2)
}

function minifyJson(raw) {
  const parsed = JSON.parse(raw)
  return JSON.stringify(parsed)
}

export default function JsonTool() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [status, setStatus] = useState(null)
  const [copied, setCopied] = useState(false)

  async function copyOutput() {
    if (!output) return
    try {
      await navigator.clipboard.writeText(output)
      setCopied(true)
      setTimeout(() => setCopied(false), 1400)
    } catch {
      // clipboard tidak tersedia
    }
  }

  function handleAction(action) {
    try {
      setStatus(null)
      const result = action === 'format' ? formatJson(input) : minifyJson(input)
      setOutput(result)
      setStatus({ ok: true, message: 'JSON valid.' })
    } catch (error) {
      setOutput('')
      setStatus({ ok: false, message: error.message })
    }
  }

  return (
    <div className="dt-tool">
      <div className="dt-textarea-wrap">
        <label className="dt-label" htmlFor="json-input">Input JSON</label>
        <textarea
          id="json-input"
          className="dt-textarea"
          placeholder='{"nama":"Contoh","angka":42,"aktif":true}'
          value={input}
          onChange={(e) => setInput(e.target.value)}
          spellCheck="false"
        />
      </div>

      <div className="dt-actions">
        <button
          type="button"
          className="dt-btn"
          onClick={() => handleAction('format')}
          disabled={!input}
        >
          <span className="material-symbols-outlined">format_align_left</span>
          Format
        </button>
        <button
          type="button"
          className="dt-btn dt-btn-ghost"
          onClick={() => handleAction('minify')}
          disabled={!input}
        >
          <span className="material-symbols-outlined">compress</span>
          Minify
        </button>
        <button
          type="button"
          className="dt-btn dt-btn-ghost"
          onClick={() => copyOutput()}
          disabled={!output}
        >
          <span className="material-symbols-outlined">
            {copied ? 'check' : 'content_copy'}
          </span>
          {copied ? 'Tersalin' : 'Salin'}
        </button>
      </div>

      {status && (
        <div className={`dt-status${status.ok ? ' is-ok' : ' is-error'}`} role="status">
          <span className="material-symbols-outlined">
            {status.ok ? 'check_circle' : 'error'}
          </span>
          <span>{status.message}</span>
        </div>
      )}

      {output && (
        <div className="dt-textarea-wrap">
          <label className="dt-label" htmlFor="json-output">Hasil</label>
          <textarea
            id="json-output"
            className="dt-textarea dt-textarea-code"
            value={output}
            readOnly
            spellCheck="false"
          />
        </div>
      )}
    </div>
  )
}