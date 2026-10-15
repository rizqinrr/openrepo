const THEME_KEYS = [
  'accent',
  'accentDeep',
  'accentSoft',
  'accentContrast',
  'fontHead',
  'radius',
]

function requireText(value, field, subject) {
  if (typeof value !== 'string' || !value.trim()) {
    throw new Error(`${subject} requires a non-empty ${field}`)
  }
}

function assertUniqueSlug(landings) {
  const seen = new Set()
  for (const landing of landings) {
    if (seen.has(landing.slug)) {
      throw new Error(`Duplicate landing slug: ${landing.slug}`)
    }
    seen.add(landing.slug)
  }
}

export function validateLandings(landings) {
  for (const landing of landings) {
    const subject = `Landing ${landing.slug ?? '(missing slug)'}`
    requireText(landing.slug, 'slug', 'Landing')
    requireText(landing.title, 'title', subject)
    requireText(landing.tagline, 'tagline', subject)
    requireText(landing.description, 'description', subject)
    requireText(landing.icon, 'icon', subject)
    if (!Array.isArray(landing.tags) || landing.tags.length === 0) {
      throw new Error(`${subject} requires a non-empty tags array`)
    }
    if (typeof landing.theme !== 'object' || landing.theme === null) {
      throw new Error(`${subject} requires a theme object`)
    }
    for (const key of THEME_KEYS) {
      requireText(landing.theme[key], `theme.${key}`, subject)
    }
    if (typeof landing.Page !== 'object' && typeof landing.Page !== 'function') {
      throw new Error(`${subject} requires a lazy or component Page`)
    }
  }
  assertUniqueSlug(landings)
  return true
}
