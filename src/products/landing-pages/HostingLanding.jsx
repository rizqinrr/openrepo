import { useState } from 'react'
import { useReveal } from './useReveal.js'
import './hosting.css'

const SERVICES = [
  {
    icon: 'dns',
    title: 'Universal Type Servers',
    desc: 'Cloud server berbasis performa tinggi dengan pilihan jenis universal untuk semua beban kerja.',
    price: 119000,
  },
  {
    icon: 'lock',
    title: 'SSL Certificate',
    desc: 'Amankan situs dengan sertifikat SSL dari CA tepercaya, terpasang otomatis dalam hitungan menit.',
    price: 450000,
  },
  {
    icon: 'shield',
    title: 'Website Protection',
    desc: 'Perisai anti-DDoS dan proteksi proaktif agar situs selalu online menghadapi serangan apa pun.',
    price: 35000,
  },
  {
    icon: 'mail',
    title: 'Professional Email',
    desc: 'Email bisnis atas nama domainmu sendiri, dengan kotak masuk aman dan sinkron antar perangkat.',
    price: 37500,
  },
]

const TLDS = [
  { tld: '.com', price: 165000 },
  { tld: '.id', price: 220000 },
  { tld: '.net', price: 180000 },
]

const REGIONS = ['Global', 'Asia Tenggara', 'Indonesia']

const PLANS = [
  {
    name: 'Value',
    cpu: '1 vCPU',
    ram: '2 GB RAM',
    disk: '40 GB NVMe',
    bw: '1 TB transfer',
    price: [119000, 129000, 135000],
  },
  {
    name: 'Pro',
    cpu: '2 vCPU',
    ram: '4 GB RAM',
    disk: '80 GB NVMe',
    bw: '2 TB transfer',
    price: [239000, 259000, 275000],
  },
  {
    name: 'Max',
    cpu: '4 vCPU',
    ram: '8 GB RAM',
    disk: '160 GB NVMe',
    bw: '4 TB transfer',
    price: [479000, 519000, 559000],
  },
]

const REASONS = [
  { icon: 'bolt', title: 'Performa cepat', desc: 'LiteSpeed + NVMe untuk loading hingga 6x lebih ngebut.' },
  { icon: 'security', title: 'Keamanan berlapis', desc: 'Proteksi DDoS, SSL gratis, dan backup harian otomatis.' },
  { icon: 'support_agent', title: 'Support 24/7', desc: 'Tim teknis siap bantu kapan pun lewat live chat dan tiket.' },
  { icon: 'sync', title: 'Migrasi gratis', desc: 'Pindah hosting/domain ke Domais tanpa biaya dan tanpa downtime.' },
  { icon: 'receipt_long', title: 'Tagihan transparan', desc: 'Harga jelas per siklus, perpanjangan tetap sesuai tarif awal.' },
  { icon: 'verified', title: 'Uptime 99.99%', desc: 'Jaringan POP global menjaga situs tetap online sepanjang tahun.' },
]

const STEPS = [
  { icon: 'travel_explore', title: 'Pilih nama', desc: 'Cek ketersediaan domain impianmu seketika.' },
  { icon: 'shopping_cart', title: 'Pilih paket', desc: 'Sesuaikan sumber daya server dengan kebutuhan situs.' },
  { icon: 'rocket_launch', title: 'Live dalam menit', desc: 'Instal otomatis dan situsmu langsung online.' },
]

export default function HostingLanding() {
  const [name, setName] = useState('')
  const [tld, setTld] = useState('.com')
  const [result, setResult] = useState(null)
  const [region, setRegion] = useState(0)
  const reveal = useReveal()

  const checkDomain = (e) => {
    e.preventDefault()
    const clean = name.trim().toLowerCase().replace(/[^a-z0-9-]/g, '')
    setResult(clean ? { name: clean, tld } : null)
  }

  const selectedTld = TLDS.find((t) => t.tld === tld)

  return (
    <div className="hd">
      <header className="hd-nav">
        <div className="hd-nav-in">
          <strong className="hd-logo">Domais</strong>
          <nav className="hd-links" aria-label="Navigasi">
            <a href="#hd-services">Layanan</a>
            <a href="#hd-plans">Harga</a>
            <a href="#hd-why">Kenapa</a>
          </nav>
          <button type="button" className="hd-btn hd-btn-accent">
            Masuk
          </button>
        </div>
      </header>

      <section className="hd-hero">
        <div className="hd-copy is-reveal" ref={reveal(0)}>
          <span className="hd-eyebrow">CLOUD PRODUCTS</span>
          <h1>Simple, easy-to-use, secure, stable, and reliable cloud products</h1>
          <p className="hd-sub">
            Universal Type Servers · SSL Certificate · Website Protection · Professional Email
          </p>
          <div className="hd-actions">
            <button type="button" className="hd-btn hd-btn-accent">
              Mulai sekarang
            </button>
            <button type="button" className="hd-btn hd-btn-ghost">
              Lihat layanan
            </button>
          </div>
          <div className="hd-mini">
            <span><i className="material-symbols-outlined">check_circle</i> Uptime 99.99%</span>
            <span><i className="material-symbols-outlined">check_circle</i> Migrasi gratis</span>
          </div>
        </div>

        <div className="hd-aside is-reveal" ref={reveal(1)}>
          <form className="hd-checker" onSubmit={checkDomain}>
            <h2>Cek ketersediaan domain</h2>
            <div className="hd-checker-row">
              <input
                type="text"
                placeholder="nama-domainmu"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <select value={tld} onChange={(e) => setTld(e.target.value)} aria-label="Ekstensi domain">
                {TLDS.map((t) => (
                  <option key={t.tld} value={t.tld}>{t.tld}</option>
                ))}
              </select>
              <button type="submit" className="hd-btn hd-btn-accent">Cek</button>
            </div>
            {result ? (
              <div className="hd-result">
                <span className="hd-result-name">{result.name + result.tld}</span>
                <span className="hd-result-dot">Tersedia</span>
                <b>Rp{selectedTld.price.toLocaleString('id-ID')}</b>
              </div>
            ) : (
              <p className="hd-hint">
                Domain impianmu masih tersedia? Cek dan buat hari ini juga.
              </p>
            )}
          </form>
          <div className="hd-float-card">
            <b>99.99%</b>
            <span>SLA uptime terjamin</span>
          </div>
          <div className="hd-blob" aria-hidden="true" />
        </div>
      </section>

      <section className="hd-stats" aria-label="Angka kunci Domais">
        <div><b>99.99%</b><span>Uptime guarantee</span></div>
        <div><b>800+</b><span>POP jaringan global</span></div>
        <div><b>24/7</b><span>Dukungan teknis</span></div>
        <div><b>3jt+</b><span>Domain dikelola</span></div>
      </section>

      <section id="hd-services" className="hd-section is-reveal" ref={reveal(2)}>
        <span className="hd-eyebrow">LAYANAN</span>
        <h2>Semua kebutuhan online, satu tempat</h2>
        <div className="hd-services">
          {SERVICES.map((s) => (
            <article className="hd-service" key={s.title}>
              <span className="material-symbols-outlined">{s.icon}</span>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
              <a href="#hd-plans" className="hd-link">
                Mulai dari Rp{s.price.toLocaleString('id-ID')}
              </a>
            </article>
          ))}
        </div>
      </section>

      <section id="hd-plans" className="hd-section is-reveal" ref={reveal(3)}>
        <span className="hd-eyebrow">HARGA</span>
        <h2>Paket Cloud Server</h2>
        <div className="hd-regions" role="tablist" aria-label="Region paket">
          {REGIONS.map((r, i) => (
            <button
              type="button"
              role="tab"
              aria-selected={region === i}
              key={r}
              className={`hd-region${region === i ? ' is-active' : ''}`}
              onClick={() => setRegion(i)}
            >
              {r}
            </button>
          ))}
        </div>
        <div className="hd-plans">
          {PLANS.map((p, i) => (
            <article
              className={`hd-plan${i === 1 ? ' is-featured' : ''}`}
              key={p.name}
            >
              <h3>{p.name}</h3>
              <ul>
                <li>{p.cpu}</li>
                <li>{p.ram}</li>
                <li>{p.disk}</li>
                <li>{p.bw}</li>
              </ul>
              <div className="hd-plan-price">
                <b>Rp{p.price[region].toLocaleString('id-ID')}</b>
                <span>/bulan</span>
              </div>
              <button type="button" className="hd-btn hd-btn-accent">
                Pilih paket
              </button>
            </article>
          ))}
        </div>
      </section>

      <section id="hd-why" className="hd-section is-reveal" ref={reveal(4)}>
        <span className="hd-eyebrow">KENAPA DOMAIS</span>
        <h2>Aman, cepat, dan tanpa ribet</h2>
        <div className="hd-why">
          {REASONS.map((r) => (
            <div className="hd-why-item" key={r.title}>
              <span className="material-symbols-outlined">{r.icon}</span>
              <h3>{r.title}</h3>
              <p>{r.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="hd-section hd-steps is-reveal" ref={reveal(5)}>
        <span className="hd-eyebrow">CARA MULAI</span>
        <h2>Online cuma dalam 3 langkah</h2>
        <div className="hd-steps-grid">
          {STEPS.map((s, i) => (
            <div className="hd-step" key={s.title}>
              <span className="hd-step-num">{i + 1}</span>
              <span className="material-symbols-outlined">{s.icon}</span>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="hd-cta">
        <h2>Mulai bangun online-mu hari ini.</h2>
        <p>Domain, server, dan keamanan dalam hitungan menit.</p>
        <button type="button" className="hd-btn hd-btn-light">
          Daftar sekarang
        </button>
      </section>

      <footer className="hd-footer">
        <div className="hd-footer-cols">
          <div>
            <strong className="hd-logo hd-logo-light">Domais</strong>
            <p>Simple, easy-to-use, secure, stable, and reliable cloud products.</p>
          </div>
          <div>
            <b>Produk</b>
            <ul>
              <li>Cloud Server</li>
              <li>SSL Certificate</li>
              <li>Website Protection</li>
              <li>Professional Email</li>
            </ul>
          </div>
          <div>
            <b>Perusahaan</b>
            <ul>
              <li>Tentang kami</li>
              <li>Kontak</li>
              <li>Status layanan</li>
              <li>Bantuan</li>
            </ul>
          </div>
        </div>
        <div className="hd-footer-bottom">
          <span>Domais © 2029 · Semua hak dilindungi.</span>
        </div>
      </footer>
    </div>
  )
}