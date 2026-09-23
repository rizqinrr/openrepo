import { useMemo, useState } from 'react'

const FLAG_OPTIONS = [
  { id: 'g', label: 'g', desc: 'global' },
  { id: 'i', label: 'i', desc: 'ignore case' },
  { id: 'm', label: 'm', desc: 'multiline' },
  { id: 's', label: 's', desc: 'dotall' },
  { id: 'u', label: 'u', desc: 'unicode' },
]

function parseRegex(pattern, flagsText) {
  const source = pattern.trim()
  if (!source) return { error: null, matches: null }
  try {
    const regex = new RegExp(source, flagsText)
    return { error: null, regex }
  } catch (error) {
    return { error, regex: null }
  }
}

function collectMatches(regex, text) {
  if (!regex.global) {
    const re = new RegExp(regex.source, `${regex.flags}g`)
    return Array.from(text.matchAll(re))
  }
  return Array.from(text.matchAll(regex))
}

function explainGroups(regex) {
  const source = regex.source
  const groups = []
  let depth = 0
  let charClass = false
  for (let i = 0; i < source.length; i += 1) {
    const char = source[i]
    if (char === '\\') {
      i += 1
      continue
    }
    if (char === '[') charClass = true
    if (char === ']') charClass = false
    if (charClass) continue
    if (char === '(') {
      depth += 1
      const following = source.slice(i + 1)
      if (following.startsWith('?')) {
        if (following.startsWith('?:')) {
          groups.push({ index: depth, nonCapturing: true })
          continue
        }
        if (following.startsWith('?<')) {
          const nameMatch = following.match(/^\?<([a-zA-Z_$][\w$]*)>/)
          groups.push({ index: depth, name: nameMatch ? nameMatch[1] : null })
          continue
        }
        if (following.startsWith('?=')) {
          groups.push({ index: depth, lookahead: true })
          continue
        }
        if (following.startsWith('?!')) {
          groups.push({ index: depth, negativeLookahead: true })
          continue
        }
        if (following.startsWith('?<=')) {
          groups.push({ index: depth, lookbehind: true })
          continue
        }
        if (following.startsWith('?<!')) {
          groups.push({ index: depth, negativeLookbehind: true })
          continue
        }
      }
      groups.push({ index: depth })
    }
  }
  return groups
}

export default function RegexTool() {
  const [pattern, setPattern] = useState('')
  const [flags, setFlags] = useState(['g'])
  const [text, setText] = useState('')

  const { error, regex } = useMemo(
    () => parseRegex(pattern, flags.join('')),
    [pattern, flags],
  )

  const matches = useMemo(() => {
    if (!regex || !text) return []
    return collectMatches(regex, text)
  }, [regex, text])

  const groupInfo = useMemo(() => (regex ? explainGroups(regex) : []), [regex])

  function toggleFlag(flag) {
    setFlags((current) =>
      current.includes(flag)
        ? current.filter((item) => item !== flag)
        : [...current, flag],
    )
  }

  return (
    <div className="dt-tool">
      <div className="dt-textarea-wrap">
        <label className="dt-label" htmlFor="regex-pattern">Pola regex</label>
        <input
          id="regex-pattern"
          className="dt-input"
          type="text"
          value={pattern}
          onChange={(e) => setPattern(e.target.value)}
          placeholder="([a-z]+)@([a-z.]+)"
          spellCheck="false"
        />
      </div>

      <div className="dt-flags" role="group" aria-label="Flag regex">
        {FLAG_OPTIONS.map((flag) => (
          <label key={flag.id} className="dt-check dt-check-pill">
            <input
              type="checkbox"
              checked={flags.includes(flag.id)}
              onChange={() => toggleFlag(flag.id)}
            />
            <span>{flag.label}</span>
          </label>
        ))}
      </div>

      <div className="dt-textarea-wrap">
        <label className="dt-label" htmlFor="regex-text">Teks uji</label>
        <textarea
          id="regex-text"
          className="dt-textarea"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Tulis teks yang ingin diuji di sini..."
          spellCheck="false"
        />
      </div>

      {error && (
        <div className="dt-status is-error" role="alert">
          <span className="material-symbols-outlined">error</span>
          <span>{error.message}</span>
        </div>
      )}

      {!error && regex && (
        <div className="dt-regex-result">
          <div className="dt-regex-summary">
            <span className="material-symbols-outlined">rule</span>
            <span>
              {matches.length} match{matches.length === 1 ? '' : 'es'}
            </span>
          </div>

          {groupInfo.length > 0 && (
            <div className="dt-regex-groups">
              <div className="dt-label">Group capture</div>
              <div className="dt-chips">
                {groupInfo.map((group, index) => (
                  <span className="dt-chip" key={index}>
                    {group.name ? `?<${group.name}>` : group.index}
                    {group.nonCapturing ? ' (non-capturing)' : ''}
                    {group.lookahead ? ' (lookahead)' : ''}
                    {group.negativeLookahead ? ' (neg. lookahead)' : ''}
                    {group.lookbehind ? ' (lookbehind)' : ''}
                    {group.negativeLookbehind ? ' (neg. lookbehind)' : ''}
                  </span>
                ))}
              </div>
            </div>
          )}

          {matches.length > 0 && (
            <div className="dt-match-list">
              {matches.map((match, index) => (
                <div className="dt-match" key={index}>
                  <div className="dt-match-head">
                    <span className="dt-chip">#{index + 1}</span>
                    <code className="dt-match-value">{match[0]}</code>
                    <span className="dt-match-index">{match.index}</span>
                  </div>
                  {match.length > 1 && (
                    <div className="dt-match-groups">
                      {Array.from({ length: match.length - 1 }, (_, groupIndex) => (
                        <code className="dt-match-group" key={groupIndex}>
                          [{groupIndex + 1}] {match[groupIndex + 1] ?? '—'}
                        </code>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {matches.length === 0 && (
            <div className="dt-status is-ok">
              <span className="material-symbols-outlined">check</span>
              <span>Tidak ada match untuk pola ini.</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}