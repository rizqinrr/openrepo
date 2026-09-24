/* Name generator — port dari `nosint brand` (D:\01_Coding\mybot\nosint). */

export const VOWELS = 'aeiou'
export const CONSONANTS = 'nrlvxksmtdbp'
export const DEFAULT_CHARS = VOWELS + CONSONANTS

const BAD_BIGRAMS = new Set([
  'xq', 'qx', 'wx', 'xw', 'zx', 'xz', 'qq', 'ww', 'yy',
  'bp', 'pb', 'td', 'dt', 'kg', 'gk',
])

const MAX_ATTEMPTS_FACTOR = 200
const MAX_COUNT = 5
const MAX_LEN = 5

export function createNameError(message) {
  const error = new Error(message)
  error.name = 'NameError'
  return error
}

function createRng(seed) {
  let state = seed == null ? Math.floor(Math.random() * 2 ** 31) : seed >>> 0
  return function next() {
    state = (state + 0x6d2b79f5) >>> 0
    let t = state
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function pick(rng, pool) {
  return pool[Math.floor(rng() * pool.length)]
}

function validateConfig(cfg) {
  if (!Number.isInteger(cfg.count) || cfg.count < 1 || cfg.count > MAX_COUNT) {
    throw createNameError(`count harus 1–${MAX_COUNT}`)
  }
  if (cfg.length != null && (!Number.isInteger(cfg.length) || cfg.length < 1 || cfg.length > MAX_LEN)) {
    throw createNameError(`length harus 1–${MAX_LEN}`)
  }
  if (!Number.isInteger(cfg.minLen) || !Number.isInteger(cfg.maxLen) || !(1 <= cfg.minLen && cfg.minLen <= cfg.maxLen && cfg.maxLen <= MAX_LEN)) {
    throw createNameError('minLen/maxLen harus memenuhi 1 ≤ min ≤ max ≤ 5')
  }
  if (cfg.start) {
    if (!/^[a-z]+$/i.test(cfg.start) || cfg.start.length < 1 || cfg.start.length > MAX_LEN) {
      throw createNameError('start harus 1–5 huruf a–z (mis. n, nv, nvr)')
    }
    if (cfg.length != null && cfg.start.length > cfg.length) {
      throw createNameError(`start '${cfg.start}' (${cfg.start.length} huruf) lebih panjang dari length ${cfg.length}`)
    }
    if (cfg.start.length > cfg.maxLen) {
      throw createNameError('panjang start harus ≤ 5')
    }
  }
  if (cfg.include && !/^[a-z]+$/i.test(cfg.include)) {
    throw createNameError('include hanya boleh huruf a–z')
  }
  if (cfg.pattern) {
    const cleaned = cfg.pattern.replace(/[CV]/g, '')
    if (cleaned && !/^[a-z]+$/i.test(cleaned)) {
      throw createNameError('pattern hanya boleh memakai C, V, dan literal a–z')
    }
    if (cfg.pattern.length > MAX_LEN) {
      throw createNameError('panjang pattern harus ≤ 5')
    }
  }
}

/**
 * Generate hingga ``count`` nama lowercase unik yang memenuhi constraint.
 * Raises NameError pada config invalid atau saat constraint tidak terpenuhi
 * dalam ``count * 200`` percobaan.
 */
export function generateNames(input) {
  const cfg = {
    count: 5,
    length: 4,
    minLen: 1,
    maxLen: 5,
    start: '',
    include: '',
    chars: null,
    pattern: '',
    seed: null,
    ...input,
  }
  validateConfig(cfg)
  const rng = createRng(cfg.seed)

  const alphabet = (cfg.chars || DEFAULT_CHARS).toLowerCase()
  let vowels = Array.from(alphabet).filter((c) => VOWELS.includes(c)).join('') || VOWELS
  let consonants = Array.from(alphabet).filter((c) => !VOWELS.includes(c)).join('') || CONSONANTS
  const start = (cfg.start || '').toLowerCase()
  const include = (cfg.include || '').toLowerCase()
  const pattern = cfg.pattern

  if (start && !alphabet.includes(start) && cfg.chars != null) {
    vowels = vowels + Array.from(start).filter((c) => VOWELS.includes(c)).join('')
    consonants = consonants + Array.from(start).filter((c) => !VOWELS.includes(c)).join('')
  }

  if (include && cfg.chars != null) {
    const impossible = Array.from(include).filter((c) => !alphabet.includes(c) && !start.includes(c))
    if (impossible.length) {
      throw createNameError(`include memuat huruf ${[...new Set(impossible)].sort().join('')} yang tidak ada di chars`)
    }
  }

  const targetLen = cfg.length
  const names = []
  const seen = new Set()
  const maxAttempts = cfg.count * MAX_ATTEMPTS_FACTOR

  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    if (names.length >= cfg.count) break
    const name = oneName(rng, targetLen, cfg.minLen, cfg.maxLen, start, pattern, vowels, consonants, alphabet)
    if (!name) continue
    if (!isValid(name, start, include, cfg)) continue
    if (seen.has(name)) continue
    seen.add(name)
    names.push(name)
  }

  if (names.length < cfg.count) {
    throw createNameError(
      `hanya berhasil membuat ${names.length}/${cfg.count} nama dengan constraint saat ini ` +
        '(coba longgarkan include/pattern atau pakai chars lain)',
    )
  }
  return names
}

function oneName(rng, exactLen, minLen, maxLen, start, pattern, vowels, consonants, alphabet) {
  if (pattern) {
    return fromPattern(rng, pattern, start, vowels, consonants)
  }

  const length = exactLen != null ? exactLen : minLen + Math.floor(rng() * (maxLen - minLen + 1))
  if (start && length < start.length) return ''
  const chars = start ? start.split('') : []
  if (chars.length > length) return ''
  while (chars.length < length) {
    let pool
    if (!chars.length) {
      pool = [...(consonants || alphabet)]
    } else if (vowels.includes(chars[chars.length - 1])) {
      pool = [...(consonants || alphabet)]
    } else {
      pool = [...(vowels || alphabet)]
    }
    if (rng() < 0.08 && chars.some((c) => vowels.includes(c))) {
      pool = [...alphabet]
    }
    let ch = pick(rng, pool)
    if (chars.length && ch === chars[chars.length - 1] && pool.length > 1) {
      const alt = pool.filter((x) => x !== ch)
      ch = pick(rng, alt.length ? alt : pool)
    }
    chars.push(ch)
  }
  return chars.join('').toLowerCase()
}

function fromPattern(rng, pattern, start, vowels, consonants) {
  const out = start ? start.split('') : []
  for (const tok of pattern) {
    if (out.length >= MAX_LEN) break
    out.push(patternToken(rng, tok, vowels, consonants))
  }
  return out.join('').toLowerCase().slice(0, MAX_LEN)
}

function patternToken(rng, tok, vowels, consonants) {
  if (tok === 'C') return pick(rng, consonants)
  if (tok === 'V') return pick(rng, vowels)
  if (/^[a-z]$/i.test(tok)) return tok.toLowerCase()
  return pick(rng, vowels)
}

function isValid(name, start, include, cfg) {
  if (!name || !/^[a-z]+$/.test(name)) return false
  if (name.length > MAX_LEN || name.length < 1) return false
  if (cfg.length != null && name.length !== cfg.length) {
    if (!cfg.pattern) return false
    if (!(name.length >= 1 && name.length <= MAX_LEN)) return false
  }
  if (start && !name.startsWith(start)) return false
  if (include) {
    if (!Array.from(include).every((c) => name.includes(c))) return false
  }
  if (hasBadCluster(name)) return false
  if (!cfg.pattern && name.length >= 3) {
    const allVowel = Array.from(name).every((c) => VOWELS.includes(c))
    const allConsonant = Array.from(name).every((c) => !VOWELS.includes(c))
    if (allVowel || allConsonant) return false
  }
  return true
}

function hasBadCluster(name) {
  if (/(.)\1\1/.test(name)) return true
  if (/(.)\1/.test(name)) return true
  for (let i = 0; i < name.length - 1; i += 1) {
    if (BAD_BIGRAMS.has(name.slice(i, i + 2))) return true
  }
  return false
}

/* "Bilang" — heuristik suku kata gaya CV (bukan IPA sungguhan). */

function renderChunk(chunk) {
  return chunk.replaceAll('x', 'ks')
}

export function toBilang(name) {
  if (!name) return ''
  const lowered = name.toLowerCase().trim()
  if (lowered.length <= 2) return renderChunk(lowered)

  const vowels = new Set('aeiou')
  const chunks = []
  let i = 0
  const n = lowered.length
  while (i < n) {
    const start = i
    while (i < n && !vowels.has(lowered[i])) i += 1
    while (i < n && vowels.has(lowered[i])) i += 1
    if (i < n && !vowels.has(lowered[i])) {
      const nxt = i + 1
      if (nxt >= n || !vowels.has(lowered[nxt])) i += 1
    }
    const chunk = lowered.slice(start, i)
    if (!chunk) {
      chunks.push(lowered[i])
      i += 1
      continue
    }
    if (chunks.length && Array.from(chunk).every((c) => !vowels.has(c)) && i >= n) {
      chunks[chunks.length - 1] += chunk
    } else {
      chunks.push(chunk)
    }
  }

  const merged = []
  for (const chunk of chunks) {
    if (merged.length && Array.from(merged[merged.length - 1]).every((c) => !vowels.has(c))) {
      merged[merged.length - 1] += chunk
    } else {
      merged.push(chunk)
    }
  }

  if (!merged.length) return renderChunk(lowered)
  return merged.filter(Boolean).map(renderChunk).join('-')
}