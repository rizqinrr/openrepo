import { useEffect, useState } from 'react'
import RepositoryCard from './RepositoryCard.jsx'
import { formatStars, repositories, repositoryCategories, repositoryCategory } from './repositories.js'
import './repositories.css'

export default function RepositoriesPage() {
  const [category, setCategory] = useState('all')
  const [selectedRepository, setSelectedRepository] = useState(null)
  const visibleRepositories = category === 'all'
    ? repositories
    : repositories.filter((repository) => repository.category === category)

  useEffect(() => {
    if (!selectedRepository) return undefined
    const onKey = (event) => {
      if (event.key === 'Escape') setSelectedRepository(null)
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [selectedRepository])

  return (
    <main className="repositories-page">
      <header className="repositories-nav">
        <a className="repositories-brand" href="#/" aria-label="Kembali ke OpenRepo"><span>O</span> OpenRepo</a>
        <a className="repositories-back" href="#/"><span className="material-symbols-outlined">arrow_back</span> Beranda</a>
      </header>

      <section className="repositories-hero">
        <span className="repositories-kicker">OPEN-SOURCE SHORTLIST</span>
        <h1>Repo bagus yang benar-benar kepake.</h1>
        <p>Pilihan subjektif untuk developer, designer, security engineer, dan orang yang bekerja bersama coding agent.</p>
      </section>

      <nav className="repository-filters" aria-label="Filter kategori repository">
        <button type="button" className={category === 'all' ? 'is-active' : ''} aria-pressed={category === 'all'} onClick={() => setCategory('all')}>Semua</button>
        {repositoryCategories.map((item) => (
          <button type="button" key={item.id} className={category === item.id ? 'is-active' : ''} aria-pressed={category === item.id} onClick={() => setCategory(item.id)}>{item.label}</button>
        ))}
      </nav>

      <section className="repository-directory" aria-label="Daftar repository">
        {visibleRepositories.map((repository) => <RepositoryCard key={repository.slug} repository={repository} onOpen={setSelectedRepository} />)}
      </section>

      {selectedRepository && (
        <div className="repo-modal-backdrop" onClick={() => setSelectedRepository(null)}>
          <div className="repo-modal" role="dialog" aria-modal="true" aria-labelledby="repository-dialog-title" onClick={(event) => event.stopPropagation()}>
            <button className="repo-modal-close" type="button" onClick={() => setSelectedRepository(null)} aria-label="Tutup detail repository"><span className="material-symbols-outlined">close</span></button>
            <span className="repo-modal-icon material-symbols-outlined" aria-hidden="true">{selectedRepository.icon}</span>
            <span className="repo-card-category">{repositoryCategory(selectedRepository.category)?.label}</span>
            <h2 id="repository-dialog-title">{selectedRepository.name}</h2>
            <p className="repo-modal-owner">oleh @{selectedRepository.owner} · {formatStars(selectedRepository.stars)} stars</p>
            <p>{selectedRepository.description}</p>
            <a className="repository-github-link" href={selectedRepository.github} target="_blank" rel="noopener noreferrer">Buka di GitHub <span className="material-symbols-outlined">open_in_new</span></a>
          </div>
        </div>
      )}
    </main>
  )
}
