import { useMemo, useState } from 'react'

function splitWords(text) {
  const words = text
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/[^a-zA-Z0-9]+/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
  return words
}

function titleCase(word) {
  if (!word) return word
  return word[0].toUpperCase() + word.slice(1).toLowerCase()
}

const TRANSFORMS = [
  {
    id: 'camelCase',
    label: 'camelCase',
    icon: 'keyboard_tab',
    apply: (words, source) => {
      if (source.trim() === '') return ''
      return words
        .map((word, index) => (index === 0 ? word : titleCase(word)))
        .join('')
    },
  },
  {
    id: 'pascalCase',
    label: 'PascalCase',
    icon: 'title',
    apply: (words, source) => {
      if (source.trim() === '') return ''
      return words.map(titleCase).join('')
    },
  },
  {
    id: 'snake',
    label: 'snake_case',
    icon: 'candlestick_chart',
    apply: (words, source) => {
      if (source.trim() === '') return ''
      return words.map((word) => word.toLowerCase()).join('_')
    },
  },
  {
    id: 'constant',
    label: 'CONSTANT_CASE',
    icon: 'pulse',
    apply: (words, source) => {
      if (source.trim() === '') return ''
      return words.map((word) => word.toUpperCase()).join('_')
    },
  },
  {
    id: 'kebab',
    label: 'kebab-case',
    icon: 'horizontal_rule',
    apply: (words, source) => {
      if (source.trim() === '') return ''
      return words.map((word) => word.toLowerCase()).join('-')
    },
  },
  {
    id: 'dot',
    label: 'dot.case',
    icon: 'more_horiz',
    apply: (words, source) => {
      if (source.trim() === '') return ''
      return words.map((word) => word.toLowerCase()).join('.')
    },
  },
  {
    id: 'upper',
    label: 'UPPERCASE',
    icon: 'text_increase',
    apply: (words, source) => source.toUpperCase(),
  },
  {
    id: 'lower',
    label: 'lowercase',
    icon: 'text_decrease',
    apply: (words, source) => source.toLowerCase(),
  },
  {
    id: 'title',
    label: 'Title Case',
    icon: 'format_size',
    apply: (words) => words.map(titleCase).join(' '),
  },
]

export default function CaseTool() {
  const [input, setInput] = useState('')
  const [copied, setCopied] = useState(null)

  const results = useMemo(() => {
    const words = splitWords(input)
    return TRANSFORMS.map((transform) => ({
      ...transform,
      value: transform.apply(words, input),
    }))
  }, [input])

  async function copyValue(id, value) {
    if (!value) return
    try {
      await navigator.clipboard.writeText(value)
    } catch {
      // clipboard tidak tersedia
    }
    setCopied(id)
    setTimeout(() => setCopied(null), 1200)
  }

  return (
    <div className="dt-tool">
      <div className="dt-textarea-wrap">
        <label className="dt-label" htmlFor="case-input">Input teks</label>
        <textarea
          id="case-input"
          className="dt-textarea"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="contoh: hello world OpenRepo"
          spellCheck="false"
        />
      </div>

      {input.trim() === '' ? (
        <div className="dt-status is-ok">
          <span className="material-symbols-outlined">info</span>
          <span>Hasil konversi akan muncul di sini.</span>
        </div>
      ) : (
        <div className="dt-case-grid">
          {results.map((result) => (
            <div className="dt-card" key={result.id}>
              <span className="dt-card-label">{result.label}</span>
              <span className="dt-card-value">{result.value}</span>
              <div className="dt-card-actions">
                <button
                  type="button"
                  className="dt-btn-mini"
                  onClick={() => copyValue(result.id, result.value)}
                >
                  <span className="material-symbols-outlined">
                    {copied === result.id ? 'check' : 'content_copy'}
                  </span>
                  {copied === result.id ? 'Tersalin' : 'Salin'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}