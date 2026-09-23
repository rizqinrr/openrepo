import { useMemo, useState } from 'react'
import { diffLines } from 'diff'

export default function DiffTool() {
  const [oldText, setOldText] = useState('')
  const [newText, setNewText] = useState('')

  const parts = useMemo(() => diffLines(oldText, newText), [oldText, newText])

  const addedCount = parts.filter((part) => part.added).length
  const removedCount = parts.filter((part) => part.removed).length
  const changedCount = addedCount + removedCount

  return (
    <div className="dt-tool">
      <div className="dt-diff-inputs">
        <div className="dt-textarea-wrap">
          <label className="dt-label" htmlFor="diff-old">Teks lama</label>
          <textarea
            id="diff-old"
            className="dt-textarea"
            value={oldText}
            onChange={(e) => setOldText(e.target.value)}
            placeholder="versi sebelum perubahan"
            spellCheck="false"
          />
        </div>
        <div className="dt-textarea-wrap">
          <label className="dt-label" htmlFor="diff-new">Teks baru</label>
          <textarea
            id="diff-new"
            className="dt-textarea"
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            placeholder="versi setelah perubahan"
            spellCheck="false"
          />
        </div>
      </div>

      <div className="dt-status is-ok">
        <span className="material-symbols-outlined">info</span>
        <span>
          {changedCount === 0
            ? 'Teks identik.'
            : `${addedCount} baris ditambah, ${removedCount} baris dihapus.`}
        </span>
      </div>

      <div className="dt-diff-view" role="figure" aria-label="Hasil perbandingan teks">
        {parts.map((part, index) =>
          part.added || part.removed ? (
            <div
              key={index}
              className={`dt-diff-line is-${part.added ? 'added' : 'removed'}`}
            >
              <span className="dt-diff-sign">{part.added ? '+' : '−'}</span>
              <pre className="dt-diff-text">{part.value.replace(/\n$/, '') || ' '}</pre>
            </div>
          ) : null,
        )}
      </div>
    </div>
  )
}