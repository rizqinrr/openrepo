import { formatStars, repositoryCategory } from './repositories.js'

export default function RepositoryCard({ repository, onOpen, compact = false }) {
  const category = repositoryCategory(repository.category)

  return (
    <button
      type="button"
      className={`repo-card${compact ? ' repo-card-compact' : ''}`}
      onClick={() => onOpen(repository)}
      aria-label={`Lihat detail ${repository.name}`}
    >
      <span className="repo-card-icon material-symbols-outlined" aria-hidden="true">{repository.icon}</span>
      <span className="repo-card-body">
        <span className="repo-card-category">{category?.label}</span>
        <strong>{repository.name}</strong>
        <span className="repo-card-summary">{repository.summary}</span>
        <span className="repo-card-meta">
          <span>@{repository.owner}</span>
          <span><span className="material-symbols-outlined" aria-hidden="true">star</span>{formatStars(repository.stars)}</span>
        </span>
      </span>
      <span className="repo-card-arrow material-symbols-outlined" aria-hidden="true">arrow_forward</span>
    </button>
  )
}
