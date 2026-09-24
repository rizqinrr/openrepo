import { useMemo, useState } from 'react'

const GAP_OPTIONS = [
  { px: 0, cls: 'gap-0' },
  { px: 4, cls: 'gap-1' },
  { px: 8, cls: 'gap-2' },
  { px: 12, cls: 'gap-3' },
  { px: 16, cls: 'gap-4' },
  { px: 20, cls: 'gap-5' },
  { px: 24, cls: 'gap-6' },
  { px: 32, cls: 'gap-8' },
  { px: 40, cls: 'gap-10' },
  { px: 48, cls: 'gap-12' },
]

const FLEX_JUSTIFY = ['flex-start', 'center', 'flex-end', 'space-between', 'space-around', 'space-evenly']
const FLEX_ALIGN = ['stretch', 'flex-start', 'center', 'flex-end', 'baseline']
const GRID_ITEMS = ['start', 'center', 'end', 'stretch']

function tailwindGap(px) {
  let best = GAP_OPTIONS[0]
  for (const option of GAP_OPTIONS) {
    if (Math.abs(option.px - px) < Math.abs(best.px - px)) best = option
  }
  return best.cls
}

function tailwindJustify(value) {
  const map = {
    'flex-start': 'justify-start',
    'flex-end': 'justify-end',
    center: 'justify-center',
    'space-between': 'justify-between',
    'space-around': 'justify-around',
    'space-evenly': 'justify-evenly',
  }
  return map[value] ?? `justify-${value}`
}

function tailwindAlign(value) {
  const map = {
    'flex-start': 'items-start',
    'flex-end': 'items-end',
    center: 'items-center',
    stretch: 'items-stretch',
    baseline: 'items-baseline',
  }
  return map[value] ?? `items-${value}`
}

function promptValue(value) {
  const map = {
    'flex-start': 'di awal',
    'flex-end': 'di akhir',
    start: 'di awal',
    center: 'di tengah',
    end: 'di akhir',
    stretch: 'direntangkan penuh',
    'space-between': 'dibagi rata dengan jarak antar elemen',
    'space-around': 'dibagi rata dengan ruang di sekitar setiap elemen',
    'space-evenly': 'dibagi rata dengan spasi sama rata',
    baseline: 'disejajarkan pada garis dasar teks',
  }
  return map[value] ?? value
}

function buildLayoutCss(mode, grid, flex) {
  if (mode === 'grid') {
    return [
      'display: grid;',
      `grid-template-columns: repeat(${grid.cols}, 1fr);`,
      `gap: ${grid.gap}px;`,
      `justify-items: ${grid.justifyItems};`,
      `align-items: ${grid.alignItems};`,
    ].join('\n')
  }
  const lines = [
    'display: flex;',
    `flex-direction: ${flex.direction};`,
  ]
  if (flex.wrap) lines.push('flex-wrap: wrap;')
  lines.push(`justify-content: ${flex.justify};`)
  lines.push(`align-items: ${flex.align};`)
  lines.push(`gap: ${flex.gap}px;`)
  return lines.join('\n')
}

function buildLayoutTailwind(mode, grid, flex) {
  if (mode === 'grid') {
    const parts = [
      'grid',
      `grid-cols-${grid.cols}`,
      tailwindGap(grid.gap),
      `justify-items-${grid.justifyItems}`,
      `items-${grid.alignItems}`,
    ]
    return parts.join(' ')
  }
  const parts = [
    'flex',
    flex.direction === 'row' ? 'flex-row' : 'flex-col',
  ]
  if (flex.wrap) parts.push('flex-wrap')
  parts.push(tailwindJustify(flex.justify))
  parts.push(tailwindAlign(flex.align))
  parts.push(tailwindGap(flex.gap))
  return parts.join(' ')
}

function buildLayoutPrompt(mode, grid, flex) {
  if (mode === 'grid') {
    return (
      `Buat container grid dengan ${grid.cols} kolom berukuran sama (` +
      `repeat(${grid.cols}, 1fr)), jarak antar item ${grid.gap}px, ` +
      `item disejajarkan ${promptValue(grid.justifyItems)} secara horizontal, ` +
      `dan ${promptValue(grid.alignItems)} secara vertikal.`
    )
  }
  const direction = flex.direction === 'row'
    ? 'arah horizontal (row)'
    : 'arah vertikal (column)'
  const wrap = flex.wrap
    ? ' yang membungkus item ke baris berikutnya bila penuh'
    : ' tanpa membungkus'
  return (
    `Buat container flexbox dengan ${direction}${wrap}, ` +
    `konten diatur ${promptValue(flex.justify)} ` +
    `dan item disejajarkan ${promptValue(flex.align)} secara silang, ` +
    `dengan jarak ${flex.gap}px antar item.`
  )
}

const DEFAULT_GRID = {
  cols: 3,
  gap: 12,
  justifyItems: 'stretch',
  alignItems: 'stretch',
}

const DEFAULT_FLEX = {
  direction: 'row',
  wrap: true,
  justify: 'flex-start',
  align: 'stretch',
  gap: 12,
}

const GRID_ITEMS_SAMPLE = [1, 2, 3, 4, 5, 6, 7, 8]
const FLEX_ITEMS_SAMPLE = [64, 88, 72, 104, 80, 96]

export default function LayoutTool() {
  const [mode, setMode] = useState('grid')
  const [grid, setGrid] = useState(DEFAULT_GRID)
  const [flex, setFlex] = useState(DEFAULT_FLEX)

  const css = useMemo(
    () => buildLayoutCss(mode, grid, flex),
    [mode, grid, flex],
  )
  const tailwind = useMemo(
    () => buildLayoutTailwind(mode, grid, flex),
    [mode, grid, flex],
  )
  const prompt = useMemo(
    () => buildLayoutPrompt(mode, grid, flex),
    [mode, grid, flex],
  )

  function setGridValue(key, value) {
    setGrid((current) => ({ ...current, [key]: value }))
  }

  function setFlexValue(key, value) {
    setFlex((current) => ({ ...current, [key]: value }))
  }

  function gridStyle() {
    return {
      display: 'grid',
      gridTemplateColumns: `repeat(${grid.cols}, 1fr)`,
      gap: `${grid.gap}px`,
      justifyItems: grid.justifyItems,
      alignItems: grid.alignItems,
    }
  }

  function flexStyle() {
    return {
      display: 'flex',
      flexDirection: flex.direction,
      flexWrap: flex.wrap ? 'wrap' : 'nowrap',
      justifyContent: flex.justify,
      alignItems: flex.align,
      gap: `${flex.gap}px`,
    }
  }

  return (
    <div className="dt-tool">
      <div className="dt-kv">
        <div className="dt-kv-row">
          <span className="dt-kv-label">Mode</span>
          <div className="dt-segmented" role="group" aria-label="Mode layout">
            <button
              type="button"
              className={`dt-seg-btn${mode === 'grid' ? ' is-active' : ''}`}
              onClick={() => setMode('grid')}
            >
              Grid
            </button>
            <button
              type="button"
              className={`dt-seg-btn${mode === 'flex' ? ' is-active' : ''}`}
              onClick={() => setMode('flex')}
            >
              Flexbox
            </button>
          </div>
        </div>

        {mode === 'grid' ? (
          <>
            <div className="dt-kv-row">
              <span className="dt-kv-label">Kolom</span>
              <div className="dt-range-wrap">
                <input
                  className="dt-range"
                  type="range"
                  min="1"
                  max="6"
                  value={grid.cols}
                  onChange={(e) => setGridValue('cols', Number(e.target.value))}
                />
                <span className="dt-kv-value">{grid.cols}</span>
              </div>
            </div>
            <div className="dt-kv-row">
              <span className="dt-kv-label">Gap</span>
              <div className="dt-range-wrap">
                <input
                  className="dt-range"
                  type="range"
                  min="0"
                  max="48"
                  step="4"
                  value={grid.gap}
                  onChange={(e) => setGridValue('gap', Number(e.target.value))}
                />
                <span className="dt-kv-value">{grid.gap}px</span>
              </div>
            </div>
            <div className="dt-kv-row">
              <span className="dt-kv-label">Justify items</span>
              <div className="dt-chips">
                {GRID_ITEMS.map((value) => (
                  <button
                    key={value}
                    type="button"
                    className={`dt-chip${grid.justifyItems === value ? ' is-active' : ''}`}
                    onClick={() => setGridValue('justifyItems', value)}
                  >
                    {value}
                  </button>
                ))}
              </div>
            </div>
            <div className="dt-kv-row">
              <span className="dt-kv-label">Align items</span>
              <div className="dt-chips">
                {GRID_ITEMS.map((value) => (
                  <button
                    key={value}
                    type="button"
                    className={`dt-chip${grid.alignItems === value ? ' is-active' : ''}`}
                    onClick={() => setGridValue('alignItems', value)}
                  >
                    {value}
                  </button>
                ))}
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="dt-kv-row">
              <span className="dt-kv-label">Arah</span>
              <div className="dt-segmented" role="group" aria-label="Arah flexbox">
                <button
                  type="button"
                  className={`dt-seg-btn${flex.direction === 'row' ? ' is-active' : ''}`}
                  onClick={() => setFlexValue('direction', 'row')}
                >
                  Row
                </button>
                <button
                  type="button"
                  className={`dt-seg-btn${flex.direction === 'column' ? ' is-active' : ''}`}
                  onClick={() => setFlexValue('direction', 'column')}
                >
                  Column
                </button>
                <button
                  type="button"
                  className={`dt-seg-btn${flex.wrap ? ' is-active' : ''}`}
                  onClick={() => setFlexValue('wrap', !flex.wrap)}
                >
                  Wrap
                </button>
              </div>
            </div>
            <div className="dt-kv-row">
              <span className="dt-kv-label">Gap</span>
              <div className="dt-range-wrap">
                <input
                  className="dt-range"
                  type="range"
                  min="0"
                  max="48"
                  step="4"
                  value={flex.gap}
                  onChange={(e) => setFlexValue('gap', Number(e.target.value))}
                />
                <span className="dt-kv-value">{flex.gap}px</span>
              </div>
            </div>
            <div className="dt-kv-row">
              <span className="dt-kv-label">Justify</span>
              <div className="dt-chips">
                {FLEX_JUSTIFY.map((value) => (
                  <button
                    key={value}
                    type="button"
                    className={`dt-chip${flex.justify === value ? ' is-active' : ''}`}
                    onClick={() => setFlexValue('justify', value)}
                  >
                    {value}
                  </button>
                ))}
              </div>
            </div>
            <div className="dt-kv-row">
              <span className="dt-kv-label">Align</span>
              <div className="dt-chips">
                {FLEX_ALIGN.map((value) => (
                  <button
                    key={value}
                    type="button"
                    className={`dt-chip${flex.align === value ? ' is-active' : ''}`}
                    onClick={() => setFlexValue('align', value)}
                  >
                    {value}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      <div className="dt-layout-preview" style={mode === 'grid' ? gridStyle() : flexStyle()}>
        {mode === 'grid'
          ? GRID_ITEMS_SAMPLE.map((item) => (
              <div className="dt-layout-item" key={item}>
                <span>Item</span>
                <b>{item}</b>
              </div>
            ))
          : FLEX_ITEMS_SAMPLE.map((width, index) => (
              <div className="dt-layout-item dt-layout-flex-item" key={index} style={{ width }}>
                <span>Item</span>
                <b>{index + 1}</b>
              </div>
            ))}
      </div>

      <div className="dt-copy-grid">
        {[
          { label: 'CSS', value: css },
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