import { landings } from './landings.js'

export default function LandingPagesIndex() {
  return (
    <main className="lp-index">
      <div className="lp-index-head">
        <a className="lp-index-back" href="#/">
          <span className="material-symbols-outlined">arrow_back</span>
          OpenRepo
        </a>
        <span className="lp-eyebrow">DESIGN SHOWCASE</span>
        <h1>Landing Pages</h1>
        <p>
          Koleksi landing page statis yang berdiri sendiri. Klik kartu untuk melihat
          tampilan penuhnya.
        </p>
        <span className="lp-count">{landings.length} landing</span>
      </div>

      <div className="lp-grid">
        {landings.map((landing) => (
          <a
            key={landing.slug}
            className="lp-card"
            href={`#/landing-pages/${landing.slug}`}
            style={{
              '--lp-accent': landing.theme.accent,
              '--lp-accent-deep': landing.theme.accentDeep,
              '--lp-accent-contrast': landing.theme.accentContrast,
            }}
          >
            <div className="lp-card-accent" />
            <span className="lp-card-icon material-symbols-outlined" aria-hidden="true">
              {landing.icon}
            </span>
            <h2>{landing.title}</h2>
            <p className="lp-card-tagline">{landing.tagline}</p>
            <p className="lp-card-desc">{landing.description}</p>
            <div className="lp-card-tags">
              {landing.tags.map((tag) => (
                <span className="lp-chip" key={tag}>
                  {tag}
                </span>
              ))}
            </div>
            <span className="lp-card-open">
              Buka landing
              <span className="material-symbols-outlined">arrow_forward</span>
            </span>
          </a>
        ))}
      </div>
    </main>
  )
}