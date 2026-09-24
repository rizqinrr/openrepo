import { useMemo, useState } from 'react'

const DIRECTION_MAP = [
  { deg: 0, cls: 'to-t' },
  { deg: 45, cls: 'to-tr' },
  { deg: 90, cls: 'to-r' },
  { deg: 135, cls: 'to-br' },
  { deg: 180, cls: 'to-b' },
  { deg: 225, cls: 'to-bl' },
  { deg: 270, cls: 'to-l' },
  { deg: 315, cls: 'to-tl' },
]

function nearestDirection(angle) {
  const normalized = ((angle % 360) + 360) % 360
  const lines = [...DIRECTION_MAP].sort((a, b) => a.deg - b.deg).concat({ ...DIRECTION_MAP[0], deg: 360 })
  let best = lines[0]
  for (const line of lines) {
    const current = Math.abs(line.deg - normalized)
    const prev = Math.abs(best.deg - normalized)
    if (current < prev) best = line
  }
  return best === lines[lines.length - 1] ? DIRECTION_MAP[0] : best
}

function buildGradient(type, angle, radialShape, stops) {
  const sorted = [...stops].sort((a, b) => a.pos - b.pos)
  const chunks = sorted
    .map((stop) => `${stop.color} ${stop.pos}%`)
    .join(', ')
  if (type === 'radial') {
    return `radial-gradient(${radialShape} at center, ${chunks})`
  }
  return `linear-gradient(${angle}deg, ${chunks})`
}

function formatPos(pos) {
  return pos % 1 === 0 ? String(pos) : pos.toFixed(1)
}

function tailwindFromGradient(type, angle, radialShape, stops) {
  const sorted = [...stops].sort((a, b) => a.pos - b.pos)
  const named = sorted.map((stop) => stop.color)
  if (type === 'linear' && named.length <= 3) {
    const via = named.length === 3 ? ` via-[${named[1]}]` : ''
    const cls = nearestDirection(angle).cls
    return `bg-gradient-${cls} from-[${named[0]}]${via} to-[${named[named.length - 1]}]`
  }
  const value = buildGradient(type, angle, radialShape, stops)
  return `bg-[${value}]`
}

function promptFromGradient(type, angle, radialShape, stops) {
  const sorted = [...stops].sort((a, b) => a.pos - b.pos)
  const parts = sorted
    .map((stop) => `warna ${stop.color} pada posisi ${formatPos(stop.pos)}%`)
    .join(', ')
  if (type === 'radial') {
    return `Buat elemen dengan latar gradient ${radialShape === 'circle' ? 'berbentuk lingkaran' : 'elips'} terpusat yang bertransisi dari ${parts}.`
  }
  return `Buat elemen dengan latar gradient linear bersudut ${angle} derajat yang bertransisi dari ${parts}.`
}

let stopIdSeed = 0

function makeStop(color, pos) {
  stopIdSeed += 1
  return { id: stopIdSeed, color, pos }
}

const DEFAULT_STOPS = [
  makeStop('#4F46E5', 0),
  makeStop('#06B6D4', 100),
]

export default function GradientTool() {
  const [type, setType] = useState('linear')
  const [angle, setAngle] = useState(135)
  const [radialShape, setRadialShape] = useState('ellipse')
  const [stops, setStops] = useState(DEFAULT_STOPS)

  const gradient = useMemo(
    () => buildGradient(type, angle, radialShape, stops),
    [type, angle, radialShape, stops],
  )
  const tailwind = useMemo(
    () => tailwindFromGradient(type, angle, radialShape, stops),
    [type, angle, radialShape, stops],
  )
  const prompt = useMemo(
    () => promptFromGradient(type, angle, radialShape, stops),
    [type, angle, radialShape, stops],
  )

  function updateStop(id, patch) {
    setStops((current) =>
      current.map((stop) => (stop.id === id ? { ...stop, ...patch } : stop)),
    )
  }

  function removeStop(id) {
    setStops((current) => (current.length <= 2 ? current : current.filter((stop) => stop.id !== id)))
  }

  function randomize() {
    const hue = Math.floor(Math.random() * 360)
    const count = 2 + Math.floor(Math.random() * 2)
    const nextStops = []
    for (let index = 0; index < count; index += 1) {
      const h = (hue + index * (40 + Math.floor(Math.random() * 50))) % 360
      nextStops.push(makeStop(`hsl(${h}, 82%, 55%)`, Math.round((index / (count - 1)) * 100)))
    }
    setStops(nextStops)
    setAngle(Math.floor(Math.random() * 360))
  }

  return (
    <div className="dt-tool">
      <div className="dt-kv">
        <div className="dt-kv-row">
          <span className="dt-kv-label">Tipe</span>
          <div className="dt-segmented" role="group" aria-label="Tipe gradient">
            <button
              type="button"
              className={`dt-seg-btn${type === 'linear' ? ' is-active' : ''}`}
              onClick={() => setType('linear')}
            >
              Linear
            </button>
            <button
              type="button"
              className={`dt-seg-btn${type === 'radial' ? ' is-active' : ''}`}
              onClick={() => setType('radial')}
            >
              Radial
            </button>
          </div>
        </div>

        {type === 'linear' ? (
          <div className="dt-kv-row">
            <span className="dt-kv-label">Sudut</span>
            <div className="dt-range-wrap">
              <input
                className="dt-range"
                type="range"
                min="0"
                max="360"
                value={angle}
                onChange={(e) => setAngle(Number(e.target.value))}
              />
              <span className="dt-kv-value">{angle}°</span>
            </div>
          </div>
        ) : (
          <div className="dt-kv-row">
            <span className="dt-kv-label">Bentuk</span>
            <div className="dt-segmented" role="group" aria-label="Bentuk radial">
              <button
                type="button"
                className={`dt-seg-btn${radialShape === 'ellipse' ? ' is-active' : ''}`}
                onClick={() => setRadialShape('ellipse')}
              >
                Ellipse
              </button>
              <button
                type="button"
                className={`dt-seg-btn${radialShape === 'circle' ? ' is-active' : ''}`}
                onClick={() => setRadialShape('circle')}
              >
                Circle
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="dt-stops" role="group" aria-label="Warna gradient">
        {stops.map((stop, index) => (
          <div className="dt-stop" key={stop.id}>
            <label className="dt-color-picker-label" title="Warna stop">
              <input
                className="dt-color-picker"
                type="color"
                value={stop.color}
                onChange={(e) => updateStop(stop.id, { color: e.target.value })}
              />
              <span className="material-symbols-outlined">colorize</span>
            </label>
            <span className="dt-stop-index">{index + 1}</span>
            <div className="dt-range-wrap">
              <input
                className="dt-range"
                type="range"
                min="0"
                max="100"
                value={stop.pos}
                onChange={(e) => updateStop(stop.id, { pos: Number(e.target.value) })}
              />
              <span className="dt-kv-value">{formatPos(stop.pos)}%</span>
            </div>
            <button
              type="button"
              className="dt-btn-mini"
              disabled={stops.length <= 2}
              onClick={() => removeStop(stop.id)}
              aria-label={`Hapus warna ${index + 1}`}
            >
              <span className="material-symbols-outlined">remove</span>
            </button>
          </div>
        ))}
      </div>

      <div className="dt-actions">
        <button
          type="button"
          className="dt-btn dt-btn-ghost"
          disabled={stops.length >= 4}
          onClick={() => setStops((current) => [...current, makeStop('#FFFFFF', 50)])}
        >
          <span className="material-symbols-outlined">add</span>
          Tambah warna ({(4 - stops.length)} tersisa)
        </button>
        <button type="button" className="dt-btn dt-btn-ghost" onClick={randomize}>
          <span className="material-symbols-outlined">casino</span>
          Acak
        </button>
      </div>

      <div className="dt-gradient-preview" style={{ background: gradient }} />

      <div className="dt-copy-grid">
        {[
          { label: 'CSS', value: `background: ${gradient};` },
          { label: 'Tailwind', value: tailwind },
          { label: 'Prompt', value: prompt },
        ].map((item) => (
          <CopyCard key={item.label} label={item.label} value={item.value} />
        ))}
      </div>
    </div>
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