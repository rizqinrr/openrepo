import { formatStars, repositoryCategory } from './repositories.js'
import './repository-cards.css'

export default function RepositoryCard({ repository, onOpen, clone = false }) {
  const category = repositoryCategory(repository.category)

  return (
    <button
      type="button"
      className="repo-card repo-card-compact"
      onClick={() => onOpen(repository)}
      aria-label={`Lihat detail ${repository.name}`}
      aria-hidden={clone || undefined}
      tabIndex={clone ? -1 : undefined}
    >
      <span className="repo-card-body">
        <span className="repo-card-category">{category?.label}</span>
        <strong>{repository.name}</strong>
        <span className="repo-card-summary">{repository.summary}</span>
        <span className="repo-card-meta">
          <span>@{repository.owner}</span>
          <span aria-label={`${formatStars(repository.stars)} stars`}><span className="repo-card-star" aria-hidden="true">★</span>{formatStars(repository.stars)}</span>
        </span>
      </span>
    </button>
  )
}
