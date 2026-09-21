import { repositoryCategories } from './repositories.js'

export const REPOSITORY_SUBMISSION_MIN_REASON = 40
export const OPENREPO_ISSUES_URL = 'https://github.com/rizqinrr/openrepo/issues/new'

const githubSegmentPattern = /^[A-Za-z0-9_.-]+$/

export function parseGitHubRepositoryUrl(value) {
  if (typeof value !== 'string' || !value.trim()) return null

  try {
    const url = new URL(value.trim())
    if (url.protocol !== 'https:' || url.hostname !== 'github.com' || url.search || url.hash) return null

    const segments = url.pathname.split('/').filter(Boolean)
    if (segments.length !== 2) return null

    const [owner, repositoryWithSuffix] = segments
    const repository = repositoryWithSuffix.replace(/\.git$/, '')
    if (!githubSegmentPattern.test(owner) || !githubSegmentPattern.test(repository)) return null

    return {
      owner,
      name: repository,
      url: `https://github.com/${owner}/${repository}`,
    }
  } catch {
    return null
  }
}

export function validateRepositorySubmission(input) {
  const errors = {}
  const repository = parseGitHubRepositoryUrl(input.githubUrl)
  const contributor = input.contributor?.trim() || ''
  const reason = input.reason?.trim() || ''

  if (!repository) errors.githubUrl = 'Masukkan URL repository GitHub publik, contohnya https://github.com/owner/repo.'
  if (!input.category || !repositoryCategories.some((item) => item.id === input.category)) {
    errors.category = 'Pilih kategori yang paling sesuai.'
  }
  if (contributor.length < 2) errors.contributor = 'Masukkan nama atau username GitHub kamu.'
  if (reason.length < REPOSITORY_SUBMISSION_MIN_REASON) {
    errors.reason = `Jelaskan manfaat repo ini setidaknya ${REPOSITORY_SUBMISSION_MIN_REASON} karakter.`
  }
  if (!input.confirmed) {
    errors.confirmed = 'Konfirmasi bahwa repository publik dan lisensinya jelas.'
  }

  return { errors, repository }
}

export function buildRepositoryIssueUrl(input, repository) {
  const categoryLabel = repositoryCategories.find((item) => item.id === input.category)?.label || input.category
  const body = [
    '## Repository yang diusulkan',
    '',
    `- **Repository:** ${repository.url}`,
    `- **Kategori:** ${categoryLabel}`,
    `- **Diusulkan oleh:** ${input.contributor.trim()}`,
    '',
    '## Mengapa repo ini berguna?',
    '',
    input.reason.trim(),
    '',
    '## Checklist pengusul',
    '',
    '- [x] Repository dapat diakses publik.',
    '- [x] Repository memiliki lisensi yang jelas dan kompatibel untuk dicantumkan.',
    '- [x] Deskripsi di atas menjelaskan manfaat nyata repository.',
    '',
    '> Pengusulan ini belum otomatis menambahkan repository ke OpenRepo. Maintainer akan memeriksa kualitas, keamanan, lisensi, dan kecocokan kategorinya.',
  ].join('\n')

  const params = new URLSearchParams({
    title: `[Repository] ${repository.owner}/${repository.name}`,
    body,
    labels: 'repository-proposal',
  })
  return `${OPENREPO_ISSUES_URL}?${params.toString()}`
}
