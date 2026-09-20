export const BEST_RECORD_KEY = 'typing_game_best_v1'

function isFiniteNonNegative(value) {
  return Number.isFinite(value) && value >= 0
}

export function normalizeBestRecord(value) {
  if (
    !value ||
    typeof value !== 'object' ||
    !isFiniteNonNegative(value.score) ||
    !Number.isInteger(value.wave) ||
    value.wave < 1 ||
    !isFiniteNonNegative(value.accuracy) ||
    !isFiniteNonNegative(value.wpm) ||
    !isFiniteNonNegative(value.savedAt)
  ) {
    return null
  }

  return {
    score: value.score,
    wave: value.wave,
    accuracy: value.accuracy,
    wpm: value.wpm,
    savedAt: value.savedAt,
  }
}

export function loadBestRecord() {
  if (typeof window === 'undefined') return null
  try {
    const stored = window.localStorage.getItem(BEST_RECORD_KEY)
    return stored ? normalizeBestRecord(JSON.parse(stored)) : null
  } catch {
    return null
  }
}

export function saveBestRecord(record) {
  if (typeof window === 'undefined') return false
  const normalized = normalizeBestRecord(record)
  if (!normalized) return false
  try {
    window.localStorage.setItem(BEST_RECORD_KEY, JSON.stringify(normalized))
    return true
  } catch {
    return false
  }
}
