import { useState } from 'react'
import { useReveal } from './useReveal.js'
import './saas.css'

const FEATURES = [
  { icon: 'monitoring', title: 'Metrik realtime', desc: 'Event masuk ke dasbor kurang dari 2 detik. Money-metric produk selalu terkini.' },
  { icon: 'account_tree', title: 'Analisis funnel', desc: 'Lihat persis di tahap mana pengguna drop-off, lalu bandingkan antar segmen.' },
  { icon: 'notifications_active', title: 'Alert anomali', desc: 'Terbangun otomatis — diingatkan saat konversi, error, atau latensi meleset drastis.' },
  { icon: 'ios_share', title: 'Ekspor & API', desc: 'Tarik data mentah ke warehouse atau BI tool kesayanganmu kapan saja.' },
  { icon: 'extension', title: 'Integrasi', desc: 'Slack, webhook, dan 40+ konektor tanpa butuh tim eng untuk memasangnya.' },
  { icon: 'workspace_premium', title: 'Role & SSO', desc: 'Kontrol akses per tim dan langsung masuk pakai SSO perusahaan.' },
]

const PLANS = [
  {
    name: 'Starter',
    desc: 'Untuk mencoba dan proyek kecil.',
    monthly: 0,
    yearly: 0,
    cta: 'Mulai gratis',
    popular: false,
    features: ['Sampai 3 pengguna', '5 ribu event/hari', 'Dasbor dasar', 'Riwayat 7 hari'],
  },
  {
    name: 'Growth',
    desc: 'Untuk tim yang sedang tumbuh.',
    monthly: 25,
    yearly: 20,
    cta: 'Coba 14 hari gratis',
    popular: true,
    features: ['Pengguna tanpa batas', '500 ribu event/hari', 'Alert anomali', 'Ekspor CSV & API', 'Dukungan prioritas'],
  },
  {
    name: 'Scale',
    desc: 'Untuk kebutuhan enterprise.',
    monthly: null,
    yearly: null,
    cta: 'Hubungi sales',
    popular: false,
    features: ['SLA 99,9%', 'SSO & role-based', 'Data residency', 'Onboarding dibimbing'],
  },
]

const TESTIMONIALS = [
  {
    quote: 'Kami menemukan penyebab turunnya retention dalam 10 menit. Sebelumnya makan waktu dua hari.',
    name: 'Dewi',
    role: 'Product Lead · Kastil',
  },
  {
    quote: 'Alert anomali-nya menangkap bug deploy sebelum user komplain. Worth every penny.',
    name: 'Raka',
    role: 'SRE · Acme Inc',
  },
  {
    quote: 'Setup-nya 5 menit. Tim langsung paham dashboarnya tanpa perlu pelatihan.',
    name: 'Tito',
    role: 'Founder · Lumina',
  },
]

const BARS = [38, 55, 42, 70, 58, 82, 66, 90, 74, 96, 84, 100]
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']

const KPIS = [
  { label: 'Sesi aktif', value: '128,4k', delta: '+12%', up: true },
  { label: 'Konversi', value: '3,2%', delta: '+0,4pt', up: true },
  { label: 'Churn', value: '1,8%', delta: '-0,2pt', up: false },
  { label: 'LTV', value: '$84', delta: '+$6', up: true },
]

export default function SaasLanding() {
  const [yearly, setYearly] = useState(false)
  const reveal = useReveal()

  return (
    <main className="sa">
      <section className="sa-hero">
        <div className="sa-hero-copy">
          <span className="sa-eyebrow">PULSEMETRICS · ANALYTICS UNTUK PRODUKMU</span>
          <h1>Pantau produkmu dalam satu dasbor.</h1>
          <p>
            Tanpa menebak: metrik realtime, funnel, dan alert anomali yang dipasang dalam
            hitungan menit — bukan minggu.
          </p>
          <div className="sa-actions">
            <a className="sa-cta sa-cta-primary" href="#sa-plans">
              Mulai uji coba gratis
            </a>
            <a className="sa-cta sa-cta-ghost" href="#sa-features">
              Lihat fitur
            </a>
          </div>
        </div>

        <div className="sa-dash" aria-hidden="true">
          <div className="sa-dash-head">
            <span className="sa-live" />
            <strong>dashboard produk · live</strong>
          </div>
          <div className="sa-kpis">
            {KPIS.map((kpi) => (
              <div className="sa-kpi" key={kpi.label}>
                <span>{kpi.label}</span>
                <b>{kpi.value}</b>
                <i className={kpi.up ? 'is-up' : ''}>{kpi.delta}</i>
              </div>
            ))}
          </div>
          <div className="sa-chart">
            <div className="sa-chart-bars">
              {BARS.map((h, i) => (
                <span key={MONTHS[i]} style={{ height: `${h}%` }} />
              ))}
            </div>
            <div className="sa-chart-x">
              {MONTHS.map((m) => (
                <span key={m}>{m}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="sa-proof" ref={reveal(0)} aria-label="Dipercaya oleh">
        <span>Didukung tim produk dari</span>
        <div className="sa-logos">
          {['northwind', 'acme inc', 'lumina', 'kastil', 'oblong & sons'].map((logo) => (
            <b key={logo}>{logo}</b>
          ))}
        </div>
      </section>

      <section id="sa-features" className="sa-section" ref={reveal(1)}>
        <span className="sa-eyebrow">FITUR</span>
        <h2>Semua yang kamu butuhkan untuk baca sinyal.</h2>
        <div className="sa-features">
          {FEATURES.map((feature) => (
            <div className="sa-feature" key={feature.title}>
              <span className="material-symbols-outlined">{feature.icon}</span>
              <h3>{feature.title}</h3>
              <p>{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="sa-plans" className="sa-section" ref={reveal(2)}>
        <span className="sa-eyebrow">HARGA</span>
        <h2>Harga sederhana, sesuai ukuran tim.</h2>

        <div className="sa-billing">
          <span className={!yearly ? 'is-on' : ''}>Bulanan</span>
          <button
            type="button"
            className="sa-toggle"
            role="switch"
            aria-checked={yearly}
            aria-label="Tagihan tahunan"
            onClick={() => setYearly((v) => !v)}
          >
            <span className={yearly ? 'is-on' : ''} />
          </button>
          <span className={yearly ? 'is-on' : ''}>
            Tahunan <i>hemat 20%</i>
          </span>
        </div>

        <div className="sa-plans">
          {PLANS.map((plan) => (
            <div className={`sa-plan${plan.popular ? ' is-popular' : ''}`} key={plan.name}>
              {plan.popular && <span className="sa-badge">Paling populer</span>}
              <h3>{plan.name}</h3>
              <p>{plan.desc}</p>
              <div className="sa-price">
                {plan.monthly === null ? (
                  <b>Custom</b>
                ) : (
                  <>
                    <b>${yearly ? plan.yearly : plan.monthly}</b>
                    <span>/bulan</span>
                  </>
                )}
              </div>
              <ul>
                {plan.features.map((feature) => (
                  <li key={feature}>
                    <span className="material-symbols-outlined">check_circle</span>
                    {feature}
                  </li>
                ))}
              </ul>
              <a className={plan.popular ? 'sa-cta sa-cta-primary' : 'sa-cta sa-cta-ghost'} href="#sa-plans">
                {plan.cta}
              </a>
            </div>
          ))}
        </div>
      </section>

      <section className="sa-section" ref={reveal(3)}>
        <span className="sa-eyebrow">KATA MEREKA</span>
        <h2>Tim produk yang berhenti menebak.</h2>
        <div className="sa-testimonials">
          {TESTIMONIALS.map((testi) => (
            <figure className="sa-testi" key={testi.name}>
              <span className="sa-quote">“</span>
              <blockquote>{testi.quote}</blockquote>
              <figcaption>
                <b>{testi.name}</b>
                <span>{testi.role}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="sa-cta-final">
        <h2>Perbaiki metrik, bukan menebak.</h2>
        <p>Gratis 14 hari. Tanpa kartu kredit. Setup kurang dari 5 menit.</p>
        <a className="sa-cta sa-cta-primary" href="#sa-plans">
          Mulai gratis sekarang
        </a>
      </section>

      <footer className="sa-footer">
        <p>© 2026 PulseMetrics — demo landing page dalam OpenRepo.</p>
      </footer>
    </main>
  )
}