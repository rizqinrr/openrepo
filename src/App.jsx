import { useEffect, useState } from 'react'
import { THEME_KEY, ACCENT } from './config/theme.js'
import { SITE, SOCIALS, TEMPLATES, HOME_CATEGORIES } from './config/links.js'
import CvPage from './CvPage.jsx'
import CreatorPage from './creator/CreatorPage.jsx'
import CommunityPage from './CommunityPage.jsx'
import PortfolioPage from './PortfolioPage.jsx'
import TypingGamePage from './game/TypingGamePage.jsx'
import GameLawasPage from './game/GameLawasPage.jsx'
import NeoProfilePage from './templates/neo/NeoProfilePage.jsx'
import CyberProfilePage from './templates/cyber/CyberProfilePage.jsx'
import { LuxuryProfilePage } from './templates/luxury/LuxuryProfilePage.jsx'
import FluidProfilePage from './templates/fluid/FluidProfilePage.jsx'
import ArcadeProfilePage from './templates/arcade/ArcadeProfilePage.jsx'
import TerminalProfilePage from './templates/terminal/TerminalProfilePage.jsx'
import SwissProfilePage from './templates/swiss/SwissProfilePage.jsx'
import AirbnbProfilePage from './templates/airbnb/AirbnbProfilePage.jsx'

function App() {
  const [theme, setTheme] = useState(
    () => localStorage.getItem(THEME_KEY) || 'light',
  )
  const [toast, setToast] = useState('')
  const [route, setRoute] = useState(() => window.location.hash)
  const [showTemplates, setShowTemplates] = useState(false)

  useEffect(() => {
    const onHashChange = () => {
      setRoute(window.location.hash)
      setShowTemplates(false)
      window.scrollTo(0, 0)
    }
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    document.documentElement.setAttribute('data-accent', ACCENT)
    localStorage.setItem(THEME_KEY, theme)
  }, [theme])



  useEffect(() => {
    if (!showTemplates) return
    const onKey = (e) => {
      if (e.key === 'Escape') setShowTemplates(false)
    }
    const onClickOutside = (e) => {
      if (!e.target.closest('.template-switcher-wrap')) {
        setShowTemplates(false)
      }
    }
    window.addEventListener('keydown', onKey)
    window.addEventListener('click', onClickOutside)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('click', onClickOutside)
    }
  }, [showTemplates])

  const playDarkSound = () => {
    const audio = new Audio('sounds/faaah.mp3')
    audio.volume = 0.7
    audio.play().catch(() => {})
  }

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    if (next === 'dark') playDarkSound()
    setToast(next === 'dark' ? 'Mode Gelap Diaktifkan' : 'Mode Terang Diaktifkan')
  }

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text)
      setToast('Link profil berhasil disalin!')
    } catch {
      setToast('Gagal menyalin link')
    }
  }

  const handleShare = async () => {
    const shareData = {
      title: `OpenRepo - ${SITE.shareTitle}`,
      text: 'Jelajahi tools open-source yang langsung berjalan di browser.',
      url: window.location.href,
    }
    if (navigator.share) {
      try {
        await navigator.share(shareData)
      } catch {
        // dibatalkan user, abaikan
      }
    } else {
      copyToClipboard(window.location.href)
    }
  }

  if (route === '#/cv') {
    return <CvPage />
  }

  if (route === '#/creator') {
    return <CreatorPage />
  }

  if (route === '#/portfolio') {
    return <PortfolioPage />
  }

  if (route === '#/komunitas') {
    return <CommunityPage />
  }

  if (route === '#/typing-game') {
    return <TypingGamePage />
  }

  if (route === '#/game-lawas') {
    return <GameLawasPage />
  }

  if (route === '#/neo') {
    return <NeoProfilePage />
  }

  if (route === '#/cyber') {
    return <CyberProfilePage />
  }

  if (route === '#/luxury') {
    return <LuxuryProfilePage />
  }

  if (route === '#/fluid') {
    return <FluidProfilePage />
  }

  if (route === '#/arcade') {
    return <ArcadeProfilePage />
  }

  if (route === '#/terminal') {
    return <TerminalProfilePage />
  }

  if (route === '#/swiss') {
    return <SwissProfilePage />
  }

  if (route === '#/airbnb') {
    return <AirbnbProfilePage />
  }

  return (
    <div className="container home-page">
      <header className="home-nav">
        <a className="home-brand" href="#/" aria-label="OpenRepo beranda">
          <span className="home-brand-mark">O</span>
          <span>OpenRepo</span>
        </a>

        <nav className="home-nav-links" aria-label="Navigasi utama">
          <a href="#home-tools">Tools</a>
          <a href="#contribute">Kontribusi</a>
          <a href="https://github.com/rizqinrr/openrepo" target="_blank" rel="noopener noreferrer">GitHub</a>
        </nav>

        <div className="home-nav-actions">
          <div className="template-switcher-wrap">
            <button
              className="home-nav-button"
              onClick={() => setShowTemplates((prev) => !prev)}
              aria-expanded={showTemplates}
              aria-label="Pilih eksperimen visual"
            >
              <span className="material-symbols-outlined">apps</span>
              <span className="home-nav-button-label">Eksperimen</span>
            </button>
            {showTemplates && (
              <div className="template-dropdown">
                <div className="template-dropdown-header">
                  <span>Eksperimen visual</span>
                  <span className="template-dropdown-count">{TEMPLATES.length}</span>
                </div>
                {TEMPLATES.map((tpl) => (
                  <a key={tpl.href} href={tpl.href} className="template-item" onClick={() => setShowTemplates(false)}>
                    <div className="template-item-icon"><span className="material-symbols-outlined">{tpl.icon}</span></div>
                    <div className="template-item-info">
                      <div className="template-item-label">{tpl.label}</div>
                      <div className="template-item-desc">{tpl.desc}</div>
                    </div>
                    <span className="material-symbols-outlined">chevron_right</span>
                  </a>
                ))}
              </div>
            )}
          </div>
          <button className="home-nav-icon" onClick={toggleTheme} aria-label="Ganti mode warna">
            <span className="material-symbols-outlined">{theme === 'dark' ? 'light_mode' : 'dark_mode'}</span>
          </button>
          <button className="home-nav-icon" onClick={handleShare} aria-label="Bagikan OpenRepo">
            <span className="material-symbols-outlined">share</span>
          </button>
        </div>
      </header>

      <section className="hero">
        <div className="home-hero-content">
          <span className="home-eyebrow">OPEN-SOURCE BROWSER TOOLS</span>
          <h1>Satu tempat untuk mencoba, membuat, dan bermain.</h1>
          <p>
            OpenRepo mengumpulkan tools praktis dan eksperimen interaktif yang langsung berjalan di browser—tanpa instalasi dan tanpa akun.
          </p>
          <div className="home-hero-actions">
            <a href="#home-tools" className="home-cta home-cta-primary">Mulai menjelajah</a>
            <a href="https://github.com/rizqinrr/openrepo" className="home-cta home-cta-secondary" target="_blank" rel="noopener noreferrer">
              <span>GitHub</span>
              <span className="material-symbols-outlined">north_east</span>
            </a>
          </div>
          <ul className="home-hero-proof" aria-label="Keunggulan OpenRepo">
            <li><span className="material-symbols-outlined">language</span> Browser-first</li>
            <li><span className="material-symbols-outlined">lock_open</span> Open source</li>
            <li><span className="material-symbols-outlined">person_off</span> Tanpa akun</li>
          </ul>
        </div>

        <div className="home-hero-showcase" aria-label="Pilihan populer">
          <div className="home-showcase-head">
            <div><span></span><span></span><span></span></div>
            <strong>openrepo / featured</strong>
          </div>
          <a href="#/game-lawas" className="home-showcase-item home-showcase-featured">
            <span className="material-symbols-outlined">directions_run</span>
            <div><strong>Refresh Man</strong><span>Endless arcade game</span></div>
            <span className="material-symbols-outlined">arrow_forward</span>
          </a>
          <a href="#/typing-game" className="home-showcase-item">
            <span className="material-symbols-outlined">keyboard</span>
            <div><strong>Typing Survival</strong><span>Latih kecepatan mengetik</span></div>
            <span className="material-symbols-outlined">arrow_forward</span>
          </a>
          <a href="#/creator" className="home-showcase-item">
            <span className="material-symbols-outlined">edit_document</span>
            <div><strong>CV Creator</strong><span>Buat CV langsung di browser</span></div>
            <span className="material-symbols-outlined">arrow_forward</span>
          </a>
        </div>
      </section>

      <section id="home-tools" className="home-tools" aria-labelledby="home-tools-title">
        <div className="home-tools-heading">
          <div>
            <span className="home-eyebrow">OPEN TOOLBOX</span>
            <h2 id="home-tools-title">Jelajahi tools & ruang kreatif</h2>
          </div>
          <span className="home-tools-count">{HOME_CATEGORIES.length} kategori</span>
        </div>
        <div className="home-category-grid">
          {HOME_CATEGORIES.map((category) => (
            <article className="home-category" key={category.title}>
              <div className="home-category-top">
                <span className="material-symbols-outlined">{category.icon}</span>
                <h3>{category.title}</h3>
              </div>
              <p>{category.desc}</p>
              <nav aria-label={category.title}>
                {category.items.map((item) => (
                  <a
                    className="home-category-item"
                    key={item.label}
                    href={item.href}
                    {...(item.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  >
                    {typeof item.icon === 'string' ? <span className="material-symbols-outlined">{item.icon}</span> : <item.icon />}
                    <span className="home-category-item-copy">
                      <span>{item.label}</span>
                      {item.author && <small>oleh @{item.author}</small>}
                    </span>
                    <span className="material-symbols-outlined">{item.external ? 'open_in_new' : 'arrow_forward'}</span>
                  </a>
                ))}
              </nav>
            </article>
          ))}
        </div>
      </section>

      <section id="contribute" className="home-contribute" aria-labelledby="contribute-title">
        <div className="home-contribute-copy">
          <span className="home-eyebrow">BUILT IN THE OPEN</span>
          <h2 id="contribute-title">Punya tool kecil yang berguna? Bawa ke OpenRepo.</h2>
          <p>
            Kontribusi tidak harus besar. Tambahkan tool browser, rapikan pengalaman pengguna,
            laporkan bug, atau usulkan ide yang bisa dipakai banyak orang.
          </p>
          <div className="home-contribute-actions">
            <a className="home-contribute-primary" href="https://github.com/rizqinrr/openrepo" target="_blank" rel="noopener noreferrer">
              Lihat repository
              <span className="material-symbols-outlined">open_in_new</span>
            </a>
            <a className="home-contribute-secondary" href="https://github.com/rizqinrr/openrepo/issues/new" target="_blank" rel="noopener noreferrer">
              Usulkan ide
              <span className="material-symbols-outlined">lightbulb</span>
            </a>
          </div>
        </div>
        <div className="home-contribute-paths" aria-label="Cara berkontribusi">
          <div className="home-contribute-path">
            <span className="material-symbols-outlined">extension</span>
            <div><strong>Kirim tool</strong><span>Tool browser yang ringan dan bermanfaat.</span></div>
          </div>
          <div className="home-contribute-path">
            <span className="material-symbols-outlined">bug_report</span>
            <div><strong>Laporkan bug</strong><span>Bantu membuat pengalaman yang lebih stabil.</span></div>
          </div>
          <div className="home-contribute-path">
            <span className="material-symbols-outlined">design_services</span>
            <div><strong>Perbaiki desain</strong><span>Aksesibilitas, copy, dan interaksi juga kontribusi.</span></div>
          </div>
        </div>
      </section>



      <div className="social-card">
        <div className="social-row">
          {SOCIALS.map((social) => (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.label}
            >
              <social.icon />
            </a>
          ))}
        </div>
      </div>

      <footer className="footer">
        <p className="footer-copy">&copy; 2026 OpenRepo. {SITE.footerRights}</p>
      </footer>

      <div className={`toast${toast ? ' show' : ''}`}>
        <span className="material-symbols-outlined">check_circle</span>
        {toast}
      </div>

    </div>
  )
}

export default App