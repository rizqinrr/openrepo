/* Freeness probes client-side — GitHub users + npm registry (CORS-enabled). */

const USER_AGENT = 'openrepo-name-tool (+https://rizqinrr.github.io/openrepo)'

export async function checkGitHub(name) {
  try {
    const res = await fetch(`https://api.github.com/users/${encodeURIComponent(name)}`, {
      headers: { Accept: 'application/vnd.github+json', 'User-Agent': USER_AGENT },
    })
    if (res.status === 404) return { status: 'free', code: 404 }
    if (res.status === 200) return { status: 'taken', code: 200 }
    return { status: 'error', code: res.status }
  } catch {
    return { status: 'error', code: 0 }
  }
}

export async function checkNpm(name) {
  try {
    const res = await fetch(`https://registry.npmjs.org/${encodeURIComponent(name)}`, {
      headers: { 'User-Agent': USER_AGENT },
    })
    if (res.status === 404) return { status: 'free', code: 404 }
    if (res.status === 200) return { status: 'taken', code: 200 }
    return { status: 'error', code: res.status }
  } catch {
    return { status: 'error', code: 0 }
  }
}

function freeScore(statuses) {
  return statuses.filter((s) => s === 'free').length
}

export function buildNote(statuses) {
  const score = freeScore(statuses)
  if (score === 2) return 'best freeness'
  if (score === 1) {
    return statuses[0] === 'taken' ? 'gh taken — cek npm' : 'npm taken — cek gh'
  }
  if (statuses.some((s) => s === 'error')) return 'probe error — retry'
  return 'all taken — skip'
}

export async function checkName(name) {
  const [github, npm] = await Promise.all([checkGitHub(name), checkNpm(name)])
  return {
    name,
    github,
    npm,
    freeScore: freeScore([github.status, npm.status]),
    note: buildNote([github.status, npm.status]),
  }
}

export async function checkNames(names) {
  const rows = await Promise.all(names.map((name) => checkName(name)))
  return [...rows].sort(
    (a, b) => b.freeScore - a.freeScore || a.name.localeCompare(b.name),
  )
}

export function statusLabel(status, code) {
  if (status === 'free') return 'free'
  if (status === 'taken') return 'taken'
  return code === 403 ? 'rate limited' : 'error'
}