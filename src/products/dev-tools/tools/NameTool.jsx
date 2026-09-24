import { useState } from 'react'
import { generateNames, toBilang } from '../lib/brand.js'
import { checkNames, statusLabel } from '../lib/freeness.js'

const MAX_CHECK = 10

function statusClass(status) {
  if (status === 'free') return 'is-free'
  if (status === 'taken') return 'is-taken'
  return 'is-error'
}

function StatusCell({ check }) {
  if (!check) return <span className="dt-status-chip is-dim">—</span>
  const label = statusLabel(check.status, check.code)
  return (
    <span className={`dt-status-chip ${statusClass(check.status)}`}>
      <span className="material-symbols-outlined">
        {check.status === 'free' ? 'check_circle' : check.status === 'taken' ? 'cancel' : 'help'}
      </span>
      {label}
    </span>
  )
}

export default function NameTool() {
  const [mode, setMode] = useState('generate')

  return (
    <div className="dt-tool">
      <div className="dt-segmented" role="group" aria-label="Mode alat">
        <button
          type="button"
          className={`dt-seg-btn${mode === 'generate' ? ' is-active' : ''}`}
          onClick={() => setMode('generate')}
        >
          Generate
        </button>
        <button
          type="button"
          className={`dt-seg-btn${mode === 'check' ? ' is-active' : ''}`}
          onClick={() => setMode('check')}
        >
          Check
        </button>
      </div>

      {mode === 'generate' ? <GeneratePanel /> : <CheckPanel />}
    </div>
  )
}

function GeneratePanel() {
  const [count, setCount] = useState(5)
  const [length, setLength] = useState(4)
  const [start, setStart] = useState('')
  const [include, setInclude] = useState('')
  const [chars, setChars] = useState('')
  const [pattern, setPattern] = useState('')
  const [seed, setSeed] = useState('')
  const [doCheck, setDoCheck] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [rows, setRows] = useState([])
  const [warning, setWarning] = useState('')

  const freeNames = rows
    .filter((r) => r.github?.status === 'free' && r.npm?.status === 'free')
    .map((r) => r.name)

  async function handleGenerate() {
    setError('')
    setWarning('')
    setRows([])
    setLoading(true)
    try {
      const names = generateNames({
        count,
        length: length ? Number(length) : null,
        start,
        include,
        chars: chars || null,
        pattern,
        seed: seed === '' ? null : Number(seed),
      })
      if (doCheck) {
        const checked = await checkNames(names)
        setRows(
          checked.map((r) => ({
            ...r,
            bilang: toBilang(r.name),
            freeScore: r.freeScore,
            note: r.note,
          })),
        )
      } else {
        setRows(names.map((name) => ({ name, bilang: toBilang(name), github: null, npm: null, note: 'no check', freeScore: 0 })))
        setWarning('Cek ketersediaan nonaktif — hanya menampilkan kandidat.')
      }
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="dt-kv">
        <div className="dt-kv-row">
          <span className="dt-kv-label">Jumlah</span>
          <select
            className="dt-select"
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
          >
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>
                {n} nama
              </option>
            ))}
          </select>
        </div>
        <div className="dt-kv-row">
          <span className="dt-kv-label">Panjang</span>
          <select
            className="dt-select"
            value={length}
            onChange={(e) => setLength(Number(e.target.value))}
          >
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>
                {n} huruf
              </option>
            ))}
          </select>
        </div>
        <div className="dt-kv-row">
          <span className="dt-kv-label">Mulai</span>
          <input
            className="dt-input"
            type="text"
            maxLength={5}
            placeholder="opsional (mis. nv)"
            value={start}
            onChange={(e) => setStart(e.target.value.toLowerCase())}
          />
        </div>
        <div className="dt-kv-row">
          <span className="dt-kv-label">Harus ada</span>
          <input
            className="dt-input"
            type="text"
            maxLength={5}
            placeholder="opsional (mis. rx)"
            value={include}
            onChange={(e) => setInclude(e.target.value.toLowerCase())}
          />
        </div>
        <div className="dt-kv-row">
          <span className="dt-kv-label">Pola</span>
          <input
            className="dt-input"
            type="text"
            maxLength={5}
            placeholder="CVCVC · C=huruf mati V=vokal"
            value={pattern}
            onChange={(e) => setPattern(e.target.value.toUpperCase())}
          />
        </div>
        <div className="dt-kv-row">
          <span className="dt-kv-label">Chars</span>
          <input
            className="dt-input"
            type="text"
            maxLength={26}
            placeholder="kosong = default"
            value={chars}
            onChange={(e) => setChars(e.target.value.toLowerCase())}
          />
        </div>
        <div className="dt-kv-row">
          <span className="dt-kv-label">Seed</span>
          <input
            className="dt-input"
            type="number"
            placeholder="opsional (reproduksibel)"
            value={seed}
            onChange={(e) => setSeed(e.target.value)}
          />
        </div>
        <div className="dt-kv-row">
          <span className="dt-kv-label">Cek ketersediaan</span>
          <label className="dt-check-pill">
            <input
              type="checkbox"
              checked={doCheck}
              onChange={(e) => setDoCheck(e.target.checked)}
            />
            GitHub + npm
          </label>
        </div>
      </div>

      <div className="dt-actions">
        <button
          type="button"
          className="dt-btn"
          disabled={loading}
          onClick={handleGenerate}
        >
          <span className="material-symbols-outlined">
            {loading ? 'progress_activity' : 'auto_awesome'}
          </span>
          {loading ? 'Memeriksa…' : 'Generate'}
        </button>
      </div>

      {error ? (
        <div className="dt-error-box" role="alert">
          {error}
        </div>
      ) : null}
      {warning ? <div className="dt-warning-box">{warning}</div> : null}

      {rows.length > 0 && !doCheck && (
        <p className="dt-note">Max 5 nama · max 5 huruf. Aktifkan cek agar hasil diurutkan paling bebas dulu.</p>
      )}

      {rows.length > 0 ? (
        <>
          <div className="dt-table-wrap">
            <table className="dt-table">
              <thead>
                <tr>
                  <th>Nama</th>
                  <th>Bilang</th>
                  <th>GitHub</th>
                  <th>npm</th>
                  <th>Keterangan</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.name}>
                    <td className="dt-cell-name">{r.name}</td>
                    <td className="dt-cell-bilang">{r.bilang}</td>
                    <td>
                      <StatusCell check={r.github} />
                    </td>
                    <td>
                      <StatusCell check={r.npm} />
                    </td>
                    <td className="dt-cell-note">{r.github || r.npm ? r.note : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {freeNames.length > 0 ? (
            <CopyCard label="Nama bebas GH + npm" value={freeNames.join('\n')} />
          ) : null}
          {doCheck && (
            <p className="dt-note">
              GitHub API anon dibatasi 60 permintaan/jam per IP — cek ulang bisa terbatas.
            </p>
          )}
        </>
      ) : null}
    </>
  )
}

function CheckPanel() {
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [warning, setWarning] = useState('')
  const [rows, setRows] = useState([])

  async function handleCheck() {
    setError('')
    setWarning('')
    setRows([])
    const names = input
      .split('\n')
      .map((line) => line.trim().toLowerCase())
      .filter(Boolean)
    if (!names.length) {
      setError('Masukkan minimal satu nama, satu per baris.')
      return
    }
    const limited = names.slice(0, MAX_CHECK)
    if (names.length > MAX_CHECK) {
      setWarning(`Lewati ${names.length - limited.length} nama — maksimal ${MAX_CHECK} per cek.`)
    }
    setLoading(true)
    try {
      setRows(await checkNames(limited))
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const freeNames = rows
    .filter((r) => r.github?.status === 'free' && r.npm?.status === 'free')
    .map((r) => r.name)

  return (
    <>
      <div className="dt-kv">
        <div className="dt-kv-row dt-kv-col">
          <span className="dt-kv-label">Username</span>
          <textarea
            className="dt-textarea"
            rows={6}
            placeholder={'satu nama per baris\ncontoh:\nhyfo\nnvrx'}
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </div>
      </div>

      <div className="dt-actions">
        <button
          type="button"
          className="dt-btn"
          disabled={loading}
          onClick={handleCheck}
        >
          <span className="material-symbols-outlined">
            {loading ? 'progress_activity' : 'travel_explore'}
          </span>
          {loading ? 'Memeriksa…' : 'Cek'}
        </button>
      </div>

      {error ? (
        <div className="dt-error-box" role="alert">
          {error}
        </div>
      ) : null}
      {warning ? <div className="dt-warning-box">{warning}</div> : null}

      {rows.length > 0 ? (
        <>
          <div className="dt-table-wrap">
            <table className="dt-table">
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Bilang</th>
                  <th>GitHub</th>
                  <th>npm</th>
                  <th>Keterangan</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.name}>
                    <td className="dt-cell-name">{r.name}</td>
                    <td className="dt-cell-bilang">{toBilang(r.name)}</td>
                    <td>
                      <StatusCell check={r.github} />
                    </td>
                    <td>
                      <StatusCell check={r.npm} />
                    </td>
                    <td className="dt-cell-note">{r.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {freeNames.length > 0 ? (
            <CopyCard label="Nama bebas GH + npm" value={freeNames.join('\n')} />
          ) : null}
          <p className="dt-note">
            GitHub API anon dibatasi 60 permintaan/jam per IP — cek ulang bisa terbatas.
          </p>
        </>
      ) : null}
    </>
  )
}

function CopyCard({ label, value }) {
  const [copied, setCopied] = useState(false)

  async function copyValue() {
    try {
      await navigator.clipboard.writeText(value)
    } catch {
      // clipboard tidak tersedia
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 1200)
  }

  return (
    <div className="dt-card dt-copy-card">
      <div className="dt-copy-card-head">
        <span className="dt-card-label">{label}</span>
        <button type="button" className="dt-btn-mini" onClick={copyValue}>
          <span className="material-symbols-outlined">
            {copied ? 'check' : 'content_copy'}
          </span>
          {copied ? 'Tersalin' : 'Salin'}
        </button>
      </div>
      <pre className="dt-copy-value">{value}</pre>
    </div>
  )
}