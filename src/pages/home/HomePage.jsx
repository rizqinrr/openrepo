import { useEffect, useRef, useState } from 'react'
import { catalogCategories } from '../../catalog/registry.js'
import RepositoryCard from '../../repositories/RepositoryCard.jsx'
import { formatStars, repositories } from '../../repositories/repositories.js'
import { SITE, SOCIALS } from '../../shared/config/links.js'
import { HOME_THEME_OPTIONS, themeForRoute } from './themes.js'
import './home.css'
export default function HomePage({ theme = 'light', setTheme = () => {}, themeRoute = '#/' }) {
  const [toast, setToast] = useState('')
  const [showTemplates, setShowTemplates] = useState(false)
  const [selectedRepository, setSelectedRepository] = useState(null)
  const marqueeRef = useRef(null)
  const marqueeHoverRef = useRef(false)
  const marqueeSyncRef = useRef(false)
  const pageTheme = themeForRoute(themeRoute)

  useEffect(() => {
    if (!showTemplates) return undefined
    const onKey = (event) => {
      if (event.key === 'Escape') setShowTemplates(false)
    }
    const onClickOutside = (event) => {
      if (!event.target.closest('.template-switcher-wrap')) setShowTemplates(false)
    }
    window.addEventListener('keydown', onKey)
    window.addEventListener('click', onClickOutside)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('click', onClickOutside)
    }
  }, [showTemplates])
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
  const normalizeMarquee = () => {
    const rail = marqueeRef.current
    if (!rail || marqueeSyncRef.current) return
    const midpoint = rail.scrollWidth / 2
    if (!midpoint) return
    marqueeSyncRef.current = true
    if (rail.scrollLeft >= midpoint) rail.scrollLeft -= midpoint
    else if (rail.scrollLeft <= 1) rail.scrollLeft += midpoint
    marqueeSyncRef.current = false
  }
  const onMarqueePointerDown = () => { marqueeHoverRef.current = true }
  const onMarqueePointerUp = () => { marqueeHoverRef.current = false }
  useEffect(() => {
    const rail = marqueeRef.current
    if (!rail || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined
    let frameId
    let lastTime = performance.now()
    const tick = (time) => {
      const elapsed = time - lastTime
      lastTime = time
      rail.scrollLeft += elapsed * (marqueeHoverRef.current ? 0.025 : 0.06)
      normalizeMarquee()
      frameId = window.requestAnimationFrame(tick)
    }
    frameId = window.requestAnimationFrame(tick)
    return () => window.cancelAnimationFrame(frameId)
  }, [])

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    if (next === 'dark') {
      const audio = new Audio('sounds/faaah.mp3')
      audio.volume = 0.7
      audio.play().catch(() => {})
    }
    setToast(next === 'dark' ? 'Mode Gelap Diaktifkan' : 'Mode Terang Diaktifkan')
  }

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setToast('Link OpenRepo berhasil disalin!')
    } catch {
      setToast('Gagal menyalin link')
    }
  }

  const share = async () => {
    const shareData = {
      title: `OpenRepo - ${SITE.shareTitle}`,
      text: 'Jelajahi tools open-source yang langsung berjalan di browser.',
      url: window.location.href,
    }
    if (!navigator.share) return copyLink()
    try {
      await navigator.share(shareData)
    } catch {
      // User cancelled the platform share dialog.
    }
  }
  const scrollToSection = (event, id) => {
    event.preventDefault()
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }
  const openRepository = (repository) => setSelectedRepository(repository)

  return (
    <main className={`container home-page home-theme-${pageTheme.id}`}>
      <div className="home-nav-shell">
      <header className="home-nav">
        <a className="home-brand" href="#/" aria-label="OpenRepo beranda"><span className="home-brand-mark">O</span><span>OpenRepo</span></a>
        <nav className="home-nav-links" aria-label="Navigasi utama">
          <a href="#home-tools" onClick={(event) => scrollToSection(event, 'home-tools')}>Tools</a><a href="#contribute" onClick={(event) => scrollToSection(event, 'contribute')}>Kontribusi</a><a href="https://github.com/rizqinrr/openrepo" target="_blank" rel="noopener noreferrer">GitHub</a>
        </nav>
        <div className="home-nav-actions">
          <div className="template-switcher-wrap">
            <button className="home-nav-button" onClick={() => setShowTemplates((open) => !open)} aria-expanded={showTemplates} aria-label="Pilih eksperimen visual">
              <span className="material-symbols-outlined">apps</span><span className="home-nav-button-label">Eksperimen</span>
            </button>
            {showTemplates && (
              <div className="template-dropdown">
                {HOME_THEME_OPTIONS.map((template) => (
                  <a key={template.href} href={template.href} className={`template-item${template.id === pageTheme.id ? ' is-active' : ''}`} aria-current={template.id === pageTheme.id ? 'page' : undefined} onClick={() => setShowTemplates(false)}>
                    <div className="template-item-icon"><span className="material-symbols-outlined">{template.icon}</span></div>
                    <div className="template-item-info"><div className="template-item-label">{template.label}</div><div className="template-item-desc">{template.desc}</div></div>
                    <span className="material-symbols-outlined">chevron_right</span>
                  </a>
                ))}
              </div>
            )}
          </div>
          <button className="home-nav-icon" onClick={toggleTheme} aria-label="Ganti mode warna"><span className="material-symbols-outlined">{theme === 'dark' ? 'light_mode' : 'dark_mode'}</span></button>
          <button className="home-nav-icon" onClick={share} aria-label="Bagikan OpenRepo"><span className="material-symbols-outlined">share</span></button>
        </div>
      </header>
      </div>

      <section className="hero">
        <div className="home-hero-content">
          <span className="home-eyebrow">OPEN-SOURCE BROWSER TOOLS</span>
          <h1>Satu tempat untuk mencoba, membuat, dan bermain.</h1>
          <p>OpenRepo mengumpulkan tools praktis dan eksperimen interaktif yang langsung berjalan di browser—tanpa instalasi dan tanpa akun.</p>
          <div className="home-hero-actions">
            <a href="#home-tools" className="home-cta home-cta-primary" onClick={(event) => scrollToSection(event, 'home-tools')}>Mulai menjelajah</a>
            <a href="https://github.com/rizqinrr/openrepo" className="home-cta home-cta-secondary" target="_blank" rel="noopener noreferrer"><span>GitHub</span><span className="material-symbols-outlined">north_east</span></a>
          </div>
          <ul className="home-hero-proof" aria-label="Keunggulan OpenRepo">
            <li><span className="material-symbols-outlined">language</span> Browser-first</li><li><span className="material-symbols-outlined">lock_open</span> Open source</li><li><span className="material-symbols-outlined">person_off</span> Tanpa akun</li>
          </ul>
        </div>
        <div className="home-hero-showcase" aria-label="Pilihan populer">
          <div className="home-showcase-head"><div><span /><span /><span /></div><strong>openrepo / featured</strong></div>
          <a href="#/game-lawas" className="home-showcase-item home-showcase-featured"><span className="material-symbols-outlined">directions_run</span><div><strong>Refresh Man</strong><span>Endless arcade game</span></div><span className="material-symbols-outlined">arrow_forward</span></a>
          <a href="#/typing-game" className="home-showcase-item"><span className="material-symbols-outlined">keyboard</span><div><strong>Typing Survival</strong><span>Latih kecepatan mengetik</span></div><span className="material-symbols-outlined">arrow_forward</span></a>
          <a href="#/creator" className="home-showcase-item"><span className="material-symbols-outlined">edit_document</span><div><strong>CV Creator</strong><span>Buat CV langsung di browser</span></div><span className="material-symbols-outlined">arrow_forward</span></a>
        </div>
      </section>

      <section id="home-tools" className="home-tools" aria-labelledby="home-tools-title">
        <div className="home-tools-heading"><div><span className="home-eyebrow">OPEN TOOLBOX</span><h2 id="home-tools-title">Jelajahi tools & ruang kreatif</h2></div><span className="home-tools-count">{catalogCategories.length} kategori</span></div>
        <div className="home-category-grid">
          {catalogCategories.map((category) => (
            <article className="home-category" key={category.id}>
              <div className="home-category-top"><span className="material-symbols-outlined">{category.icon}</span><h3>{category.title}</h3></div>
              <p>{category.description}</p>
              <nav aria-label={category.title}>
                {category.products.map((product) => (
                  <div className="home-category-item" key={product.slug}>
                    <span className="material-symbols-outlined">{product.icon}</span>
                    <span className="home-category-item-copy">
                      <a className="home-product-link" href={product.route}>{product.title}</a>
                      <small>oleh <a href={product.author.github} target="_blank" rel="noopener noreferrer">@{product.author.name}</a></small>
                    </span>
                    <a className="home-product-arrow" href={product.route} aria-label={`Buka ${product.title}`}><span className="material-symbols-outlined">arrow_forward</span></a>
                  </div>
                ))}
              </nav>
            </article>
          ))}
        </div>
      </section>
      <section id="home-repositories" className="home-repositories" aria-labelledby="home-repositories-title">
        <div className="home-tools-heading">
          <div><span className="home-eyebrow">CURATED OPEN SOURCE</span><h2 id="home-repositories-title">Repo yang layak disimpan.</h2></div>
          <a className="home-repositories-more" href="#/repos">Lihat selengkapnya <span className="material-symbols-outlined" aria-hidden="true">arrow_forward</span></a>
        </div>
        <div
          ref={marqueeRef}
          className="home-repository-marquee"
          aria-label="Repository pilihan"
          onMouseEnter={() => { marqueeHoverRef.current = true }}
          onMouseLeave={() => { marqueeHoverRef.current = false }}
          onPointerDown={onMarqueePointerDown}
          onPointerUp={onMarqueePointerUp}
          onPointerCancel={onMarqueePointerUp}
          onScroll={normalizeMarquee}
        >
          <div className="home-repository-track">
            {repositories.map((repository) => <RepositoryCard key={repository.slug} repository={repository} compact onOpen={openRepository} />)}
            {repositories.map((repository) => <RepositoryCard key={`${repository.slug}-clone`} repository={repository} compact clone onOpen={openRepository} />)}
          </div>
        </div>
      </section>

      <section id="contribute" className="home-contribute" aria-labelledby="contribute-title">
        <div className="home-contribute-copy">
          <span className="home-eyebrow">BUILT IN THE OPEN</span>
          <h2 id="contribute-title">Punya repo yang berguna? Bawa masuk ke OpenRepo.</h2>
          <p>Usulkan repository publik yang sudah siap dipakai. Kami cek manfaat, dokumentasi, keamanan, dan lisensinya sebelum ditampilkan bersama pilihan lain.</p>
          <div className="home-contribute-actions">
            <a className="home-contribute-primary" href="#/repos?contribute=1">Usulkan repository <span className="material-symbols-outlined" aria-hidden="true">arrow_forward</span></a>
            <a className="home-contribute-secondary" href="https://github.com/rizqinrr/openrepo" target="_blank" rel="noopener noreferrer">Lihat source <span className="material-symbols-outlined" aria-hidden="true">open_in_new</span></a>
          </div>
          <p className="home-contribute-note">Usulan membuka issue GitHub yang sudah terisi. Repository tidak masuk otomatis sebelum lolos kurasi.</p>
        </div>
        <div className="home-contribute-paths" aria-label="Langkah berkontribusi">
          <div className="home-contribute-path"><span className="home-contribute-step">01</span><span className="material-symbols-outlined">search</span><div><strong>Pilih yang layak</strong><span>Repository publik, berguna, terdokumentasi, dan punya lisensi jelas.</span></div></div>
          <div className="home-contribute-path"><span className="home-contribute-step">02</span><span className="material-symbols-outlined">edit_note</span><div><strong>Kirim usulan</strong><span>Isi URL, kategori, dan alasan nyata kenapa repo ini pantas disimpan.</span></div></div>
          <div className="home-contribute-path"><span className="home-contribute-step">03</span><span className="material-symbols-outlined">fact_check</span><div><strong>Lolos kurasi</strong><span>Maintainer memeriksa kualitas, keamanan, lisensi, lalu menambahkannya ke katalog.</span></div></div>
        </div>
      </section>

      <div className="social-card"><div className="social-row">{SOCIALS.map((social) => <a key={social.label} href={social.href} target="_blank" rel="noopener noreferrer" aria-label={social.label}><social.icon /></a>)}</div></div>
      <footer className="footer"><p className="footer-copy">&copy; 2026 OpenRepo. {SITE.footerRights}</p></footer>
      <div className={`toast${toast ? ' show' : ''}`}><span className="material-symbols-outlined">check_circle</span>{toast}</div>
      {selectedRepository && (
        <div className="repo-modal-backdrop" onClick={() => setSelectedRepository(null)}>
          <div className="repo-modal" role="dialog" aria-modal="true" aria-labelledby="repo-modal-title" onClick={(event) => event.stopPropagation()}>
            <button className="repo-modal-close" type="button" onClick={() => setSelectedRepository(null)} aria-label="Tutup detail repository"><span className="material-symbols-outlined">close</span></button>
            <span className="repo-modal-icon material-symbols-outlined" aria-hidden="true">{selectedRepository.icon}</span>
            <span className="repo-card-category">REPOSITORY PILIHAN</span>
            <h2 id="repo-modal-title">{selectedRepository.name}</h2>
            <p className="repo-modal-owner">oleh @{selectedRepository.owner} · {formatStars(selectedRepository.stars)} stars</p>
            <p>{selectedRepository.description}</p>
            <a className="home-cta home-cta-primary" href={selectedRepository.github} target="_blank" rel="noopener noreferrer">Buka repository <span className="material-symbols-outlined">open_in_new</span></a>
          </div>
        </div>
      )}
    </main>
  )
}
