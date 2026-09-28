import { landingBySlug } from './landings.js'
import LandingPagesIndex from './LandingPagesIndex.jsx'
import './landing-pages.css'

function currentSlug() {
  const parts = window.location.hash.split('/').filter(Boolean)
  return parts[2] ?? null
}

export default function LandingPagesPage() {
  const slug = currentSlug()
  const landing = landingBySlug(slug)

  if (landing) {
    const Landing = landing.Page
    return (
      <div className="lp-shell">
        <div className="lp-topbar">
          <a className="lp-topbar-brand" href="#/" aria-label="OpenRepo beranda">
            <span className="lp-topbar-mark">O</span>
            <span>OpenRepo</span>
          </a>
          <a className="lp-back" href="#/landing-pages">
            <span className="material-symbols-outlined">arrow_back</span>
            Kembali ke daftar landing
          </a>
        </div>
        <Landing />
      </div>
    )
  }

  return <LandingPagesIndex />
}