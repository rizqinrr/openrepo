/* Password generator — acak kuat via Web Crypto, tanpa dependency. */

export const SETS = {
  lower: 'abcdefghijklmnopqrstuvwxyz',
  upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  digits: '0123456789',
  symbols: '!@#$%^&*()-_=+[]{};:<>,.?',
}

export const AMBIGUOUS = '0O1Il|'

export const DEFAULT_LENGTH = 16
export const MIN_LENGTH = 4
export const MAX_LENGTH = 64
export const MAX_COUNT = 10

export function createPasswordError(message) {
  const error = new Error(message)
  error.name = 'PasswordError'
  return error
}

export function buildPool({
  useLower = true,
  useUpper = true,
  useDigits = true,
  useSymbols = false,
  excludeAmbiguous = true,
  exclude = '',
} = {}) {
  const active = []
  if (useLower) active.push(SETS.lower)
  if (useUpper) active.push(SETS.upper)
  if (useDigits) active.push(SETS.digits)
  if (useSymbols) active.push(SETS.symbols)
  if (!active.length) {
    throw createPasswordError('pilih minimal satu tipe karakter')
  }

  const drop = new Set([...(excludeAmbiguous ? AMBIGUOUS : ''), ...exclude])
  const chars = [...active.join('')].filter((c) => !drop.has(c)).join('')
  if (!chars.length) {
    throw createPasswordError('karakter yang dikecualikan menghabiskan pool')
  }

  const protectedSets = active
    .map((set) => [...set].filter((c) => !drop.has(c)).join(''))
    .filter((set) => set.length)

  return { chars, size: chars.length, protectedSets }
}

function randInt(n) {
  const limit = Math.floor(0x100000000 / n) * n
  const buf = new Uint32Array(1)
  do {
    crypto.getRandomValues(buf)
  } while (buf[0] >= limit)
  return buf[0] % n
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = randInt(i + 1)
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

function onePassword(length, chars, protectedSets) {
  const arr = new Array(length)
  const need =
    protectedSets.length > length ? protectedSets.slice(0, length) : protectedSets
  let placed = 0
  for (const set of need) {
    arr[placed++] = set[randInt(set.length)]
  }
  while (placed < length) {
    arr[placed++] = chars[randInt(chars.length)]
  }
  return shuffle(arr).join('')
}

export function generatePasswords({
  count = 4,
  length = DEFAULT_LENGTH,
  ...poolOpts
} = {}) {
  if (!Number.isInteger(count) || count < 1 || count > MAX_COUNT) {
    throw createPasswordError(`count harus 1–${MAX_COUNT}`)
  }
  if (!Number.isInteger(length) || length < MIN_LENGTH || length > MAX_LENGTH) {
    throw createPasswordError(`length harus ${MIN_LENGTH}–${MAX_LENGTH}`)
  }
  const { chars, protectedSets } = buildPool(poolOpts)
  const out = []
  for (let i = 0; i < count; i++) {
    out.push(onePassword(length, chars, protectedSets))
  }
  return out
}

export function passwordEntropy(length, size) {
  return length * Math.log2(size)
}

export function strengthFor(bits) {
  if (bits < 40) return { label: 'Lemah', level: 'weak' }
  if (bits < 60) return { label: 'Cukup', level: 'fair' }
  if (bits < 80) return { label: 'Kuat', level: 'strong' }
  return { label: 'Sangat kuat', level: 'very-strong' }
}