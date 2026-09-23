import { useMemo, useState } from 'react'

const SHADES = [
  { name: '50', light: 0.97, sat: 0.25 },
  { name: '100', light: 0.93, sat: 0.45 },
  { name: '200', light: 0.86, sat: 0.6 },
  { name: '300', light: 0.75, sat: 0.65 },
  { name: '400', light: 0.63, sat: 0.7 },
  { name: '500', light: null, sat: 1 },
  { name: '600', light: null, sat: 1 },
  { name: '700', light: null, sat: 1 },
  { name: '800', light: null, sat: 1 },
  { name: '900', light: null, sat: 1 },
  { name: '950', light: null, sat: 1 },
]

function hexToHsl(hex) {
  const value = hex.replace('#', '')
  const full = value.length === 3
    ? value.split('').map((char) => char + char).join('')
    : value
  const num = parseInt(full, 16)
  const r = ((num >> 16) & 0xff) / 255
  const g = ((num >> 8) & 0xff) / 255
  const b = (num & 0xff) / 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const delta = max - min
  let h = 0
  if (delta !== 0) {
    if (max === r) h = ((g - b) / delta) % 6
    else if (max === g) h = (b - r) / delta + 2
    else h = (r - g) / delta + 4
    h = Math.round(h * 60)
    if (h < 0) h += 360
  }
  const l = (max + min) / 2
  const s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1))
  return { h, s: s * 100, l: l * 100 }
}

function hslToHex({ h, s, l }) {
  const hue = ((h % 360) + 360) % 360
  const sat = Math.min(100, Math.max(0, s)) / 100
  const light = Math.min(100, Math.max(0, l)) / 100
  const c = (1 - Math.abs(2 * light - 1)) * sat
  const x = c * (1 - Math.abs(((hue / 60) % 2) - 1))
  const m = light - c / 2
  let r = 0
  let g = 0
  let b = 0
  if (hue < 60) [r, g, b] = [c, x, 0]
  else if (hue < 120) [r, g, b] = [x, c, 0]
  else if (hue < 180) [r, g, b] = [0, c, x]
  else if (hue < 240) [r, g, b] = [0, x, c]
  else if (hue < 300) [r, g, b] = [x, 0, c]
  else [r, g, b] = [c, 0, x]
  const toHex = (value) =>
    Math.round((value + m) * 255).toString(16).padStart(2, '0')
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase()
}

function buildPalette(hex) {
  const source = hexToHsl(hex)
  const normalized = normalizedHex(hex)
  return SHADES.map((shade, index) => {
    if (index < 5) {
      return {
        name: shade.name,
        hex: hslToHex({
          h: source.h,
          s: source.s * shade.sat,
          l: shade.light * 100,
        }),
      }
    }
    if (index === 5) {
      return { name: shade.name, hex: normalized }
    }
    const position = (index - 5) / 5
    const light = 14 + (source.l - 14) * (1 - position)
    return {
      name: shade.name,
      hex: hslToHex({ h: source.h, s: source.s * shade.sat, l: light }),
    }
  })
}

function normalizedHex(value) {
  const cleaned = value.replace('#', '')
  const full = cleaned.length === 3
    ? cleaned.split('').map((char) => char + char).join('')
    : cleaned
  return `#${full.toUpperCase()}`
}

function readableText(hex) {
  const value = hex.replace('#', '')
  const full = value.length === 3
    ? value.split('').map((char) => char + char).join('')
    : value
  const num = parseInt(full, 16)
  const r = ((num >> 16) & 0xff) / 255
  const g = ((num >> 8) & 0xff) / 255
  const b = (num & 0xff) / 255
  const luminance = 0.299 * r + 0.587 * g + 0.114 * b
  return luminance > 0.6 ? '#0F172A' : '#FFFFFF'
}

function toCss(palette) {
  const lines = palette.map(
    (item) => `  --primary-${item.name}: ${item.hex};`,
  )
  return [
    ':root {',
    ...lines,
    `  --primary: ${palette[5].hex};`,
    '}',
    '',
    `/* ${palette[5].hex} — ${palette.length} shade` +
      (palette.length === 1 ? '' : 's') +
      ' */',
  ].join('\n')
}

function isValidHex(value) {
  return /^#?([0-9a-fA-F]{6}|[0-9a-fA-F]{3})$/.test(value)
}

export default function PaletteTool() {
  const [baseColor, setBaseColor] = useState('#4F46E5')
  const [copied, setCopied] = useState(false)

  const valid = isValidHex(baseColor)
  const palette = useMemo(
    () => (valid ? buildPalette(baseColor) : []),
    [baseColor, valid],
  )
  const css = useMemo(() => (palette.length ? toCss(palette) : ''), [palette])

  async function copyCss() {
    if (!css) return
    try {
      await navigator.clipboard.writeText(css)
    } catch {
      // clipboard tidak tersedia
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 1200)
  }

  function downloadCss() {
    if (!css) return
    const blob = new Blob([css], { type: 'text/css' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'palette.css'
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="dt-tool">
      <div className="dt-kv">
        <div className="dt-kv-row">
          <span className="dt-kv-label">Warna dasar</span>
          <div className="dt-color-input">
            <span
              className={`dt-swatch-preview${valid ? '' : ' is-invalid'}`}
              style={{ background: valid ? baseColor : undefined }}
            />
            <input
              className="dt-input dt-input-monospace"
              type="text"
              value={baseColor}
              onChange={(e) => setBaseColor(e.target.value)}
              placeholder="#4F46E5"
              spellCheck="false"
              aria-invalid={!valid}
            />
            <label className="dt-color-picker-label" title="Pilih warna">
              <input
                className="dt-color-picker"
                type="color"
                value={isValidHex(baseColor) ? baseColor : '#4F46E5'}
                onChange={(e) => setBaseColor(e.target.value)}
              />
              <span className="material-symbols-outlined">colorize</span>
            </label>
          </div>
        </div>
      </div>

      {!valid ? (
        <div className="dt-status is-error" role="alert">
          <span className="material-symbols-outlined">error</span>
          <span>Format hex tidak valid. Gunakan #RRGGBB atau #RGB.</span>
        </div>
      ) : (
        <>
          <div className="dt-palette" role="list" aria-label="Palet warna">
            {palette.map((item) => (
              <div
                key={item.name}
                className="dt-palette-row"
                style={{ background: item.hex, color: readableText(item.hex) }}
              >
                <span className="dt-palette-name">{item.name}</span>
                <span className="dt-palette-hex">{item.hex}</span>
              </div>
            ))}
          </div>

          <div className="dt-textarea-wrap">
            <label className="dt-label" htmlFor="palette-css">CSS variables</label>
            <textarea
              id="palette-css"
              className="dt-textarea dt-textarea-code"
              value={css}
              readOnly
              spellCheck="false"
            />
          </div>
          <div className="dt-actions">
            <button type="button" className="dt-btn" onClick={copyCss}>
              <span className="material-symbols-outlined">
                {copied ? 'check' : 'content_copy'}
              </span>
              {copied ? 'Tersalin' : 'Salin CSS'}
            </button>
            <button type="button" className="dt-btn dt-btn-ghost" onClick={downloadCss}>
              <span className="material-symbols-outlined">download</span>
              Unduh .css
            </button>
          </div>
        </>
      )}
    </div>
  )
}