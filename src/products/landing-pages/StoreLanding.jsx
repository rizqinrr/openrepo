import { useEffect, useState } from 'react'
import { useReveal } from './useReveal.js'
import './store.css'

const CATEGORIES = [
  { id: 'semua', label: 'Semua', icon: 'apps' },
  { id: 'elektronik', label: 'Elektronik', icon: 'devices' },
  { id: 'fashion', label: 'Fashion', icon: 'checkroom' },
  { id: 'rumah', label: 'Rumah Tangga', icon: 'chair' },
  { id: 'kesehatan', label: 'Kesehatan', icon: 'spa' },
  { id: 'olahraga', label: 'Olahraga', icon: 'sports_basketball' },
]

const PRODUCTS = [
  { name: 'TWS Earbuds ANC Pro', cat: 'elektronik', price: 149000, oldPrice: 199000, rating: 4.9, sold: '2,1rb', g1: '#ffd3c0', g2: '#fb5533', icon: 'headphones' },
  { name: 'Smartwatch AMOLED 1.43"', cat: 'elektronik', price: 279000, oldPrice: 359000, rating: 4.8, sold: '4,6rb', g1: '#bfe3ff', g2: '#0a84ff', icon: 'watch' },
  { name: 'Kemeja Flanel Oversize', cat: 'fashion', price: 89000, oldPrice: 129000, rating: 4.7, sold: '3,4rb', g1: '#ffe1c7', g2: '#f08a3c', icon: 'checkroom' },
  { name: 'Sneakers Running Cloud', cat: 'fashion', price: 249000, oldPrice: 320000, rating: 4.8, sold: '1,9rb', g1: '#d6ffe0', g2: '#2fb36b', icon: 'directions_run' },
  { name: 'Air Fryer 5L Low Goda', cat: 'rumah', price: 389000, oldPrice: 499000, rating: 4.8, sold: '5,2rb', g1: '#e8e2ff', g2: '#7362e8', icon: 'countertops' },
  { name: 'Rak Dinding Minimalis', cat: 'rumah', price: 119000, oldPrice: 159000, rating: 4.6, sold: '1,2rb', g1: '#ffe9cf', g2: '#d99a4e', icon: 'shelves' },
  { name: 'Skincare Set Glowing', cat: 'kesehatan', price: 159000, oldPrice: 219000, rating: 4.9, sold: '8,1rb', g1: '#ffd9e8', g2: '#ec5b9b', icon: 'spa' },
  { name: 'Vitamin C + Zinc 60 Kaplet', cat: 'kesehatan', price: 49000, oldPrice: 79000, rating: 4.9, sold: '12rb', g1: '#fff4c2', g2: '#eda500', icon: 'vaccines' },
  { name: 'Matras Yoga Anti Slip', cat: 'olahraga', price: 89000, oldPrice: 129000, rating: 4.7, sold: '2,7rb', g1: '#c2f5ea', g2: '#26aa99', icon: 'self_improvement' },
  { name: 'Botol Minum 1L Insulated', cat: 'olahraga', price: 99000, oldPrice: 149000, rating: 4.8, sold: '6,3rb', g1: '#d5e4ff', g2: '#4575d6', icon: 'water_bottle' },
]

const WHYS = [
  { icon: 'rocket_launch', title: 'Pengiriman Cepat', desc: 'Bisa sampai hari ini juga di area tertentu dengan jaringan logistik terluas.' },
  { icon: 'verified_user', title: 'Perlindungan Pembeli', desc: 'Dana aman sampai barang diterima. Barang tidak sesuai? Garansi uang kembali.' },
  { icon: 'sell', title: 'Promo Setiap Hari', desc: 'Flash sale, voucher gratis ongkir, dan cashback terus bergulir tiap minggu.' },
  { icon: 'payments', title: 'Metode Bayar Lengkap', desc: 'COD, transfer, e-wallet, hingga cicilan 0% untuk semua preferensi belanja kamu.' },
]

const TESTIMONIALS = [
  {
    quote: 'Barang sesuai foto dan cepat sampai. Minta refund pun ditangani dengan adil.',
    name: 'Rani',
    role: 'Pembeli setia sejak 2022',
  },
  {
    quote: 'Toko resmi di sini banyak promo. Belanja kebutuhan dapur jadi jauh lebih hemat.',
    name: 'Dimas',
    role: 'Beli +30 item/bulan',
  },
  {
    quote: 'Penjualnya responsif dan garansi uang kembali bikin aku tidak ragu beli mahal.',
    name: 'Ayu',
    role: 'Pengguna aktif marketplace',
  },
]

export default function StoreLanding() {
  const [cat, setCat] = useState('semua')
  const [q, setQ] = useState('')
  const [cart, setCart] = useState(0)
  const [secs, setSecs] = useState(2 * 3600 + 7 * 60 + 42)
  const reveal = useReveal()

  useEffect(() => {
    const id = setInterval(() => setSecs((s) => (s > 0 ? s - 1 : s)), 1000)
    return () => clearInterval(id)
  }, [])

  const keyword = q.trim().toLowerCase()
  const products = PRODUCTS.filter((p) => {
    const hasCat = cat === 'semua' || p.cat === cat
    return hasCat && p.name.toLowerCase().includes(keyword)
  })

  const hh = String(Math.floor(secs / 3600)).padStart(2, '0')
  const mm = String(Math.floor((secs % 3600) / 60)).padStart(2, '0')
  const ss = String(secs % 60).padStart(2, '0')

  return (
    <div className="tk">
      <header className="tk-nav">
        <div className="tk-nav-in">
          <strong className="tk-logo">TokoKita</strong>
          <label className="tk-search">
            <span className="material-symbols-outlined">search</span>
            <input
              type="search"
              placeholder="Cari produk, merk, dan lainnya…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </label>
          <button type="button" className="tk-cart">
            <span className="material-symbols-outlined">shopping_cart</span>
            Keranjang
            {cart > 0 && <b>{cart}</b>}
          </button>
        </div>
      </header>

      <section className="tk-hero">
        <div className="tk-hero-copy is-reveal" ref={reveal(0)}>
          <span className="tk-eyebrow">JUAL BELI ONLINE</span>
          <h1>Belanja Online Terpercaya di TokoKita</h1>
          <p className="tk-sub">
            Ratusan ribu toko, jutaan produk, dan promo yang gak ada habisnya.
            Semua di satu aplikasi.
          </p>
          <label className="tk-searchbox">
            <span className="material-symbols-outlined">search</span>
            <input
              type="search"
              placeholder="Cari produk impianmu…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
            <button type="button" onClick={() => setCat('semua')}>
              Cari
            </button>
          </label>
          <div className="tk-stats">
            <div><b>100jt+</b><span>Produk terjual</span></div>
            <div><b>40jt+</b><span>Pembeli aktif</span></div>
            <div><b>500+</b><span>Kota terjangkau</span></div>
          </div>
        </div>
        <div className="tk-hero-art is-reveal" ref={reveal(1)}>
          <div className="tk-deal">
            <span className="tk-deal-badge">-25%</span>
            <span className="material-symbols-outlined">headphones</span>
            <strong>Flash Sale<br />TWS Earbuds ANC</strong>
            <em>Rp149.000</em>
          </div>
          <div className="tk-blob-a" aria-hidden="true" />
          <div className="tk-blob-b" aria-hidden="true" />
        </div>
      </section>

      <section className="tk-section is-reveal" ref={reveal(2)}>
        <div className="tk-cats">
          {CATEGORIES.map((c) => (
            <button
              type="button"
              key={c.id}
              className={`tk-cat${cat === c.id ? ' is-active' : ''}`}
              onClick={() => setCat(c.id)}
            >
              <span className="material-symbols-outlined">{c.icon}</span>
              {c.label}
            </button>
          ))}
        </div>
      </section>

      <section className="tk-flash is-reveal" ref={reveal(3)}>
        <div className="tk-flash-head">
          <div className="tk-flash-title">
            <span className="tk-eyebrow">HARI INI</span>
            <h2>Flash Sale</h2>
          </div>
          <div className="tk-timer" aria-label="Sisa waktu flash sale">
            <b>{hh}</b>:<b>{mm}</b>:<b>{ss}</b>
          </div>
        </div>
        <div className="tk-prods">
          {products.length === 0 && (
            <p className="tk-empty">Tidak ada produk untuk pencarian ini.</p>
          )}
          {products.map((p) => (
            <article className="tk-prod" key={p.name}>
              <div
                className="tk-thumb"
                style={{ background: `linear-gradient(135deg, ${p.g1}, ${p.g2})` }}
              >
                <span className="material-symbols-outlined">{p.icon}</span>
              </div>
              <div className="tk-prod-body">
                <h3>{p.name}</h3>
                <div className="tk-prod-meta">
                  <span>★ {p.rating.toFixed(1)}</span>
                  <span>{p.sold} terjual</span>
                </div>
                <div className="tk-prod-price">
                  <b>Rp{p.price.toLocaleString('id-ID')}</b>
                  <s>Rp{p.oldPrice.toLocaleString('id-ID')}</s>
                </div>
                <button type="button" className="tk-add" onClick={() => setCart((c) => c + 1)}>
                  <span className="material-symbols-outlined">add</span>
                  Masuk Keranjang
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="tk-section is-reveal" ref={reveal(4)}>
        <h2>Kenapa belanja di TokoKita?</h2>
        <div className="tk-why">
          {WHYS.map((w) => (
            <div className="tk-why-item" key={w.title}>
              <span className="material-symbols-outlined">{w.icon}</span>
              <h3>{w.title}</h3>
              <p>{w.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="tk-section is-reveal" ref={reveal(5)}>
        <h2>Kata pembeli</h2>
        <div className="tk-testis">
          {TESTIMONIALS.map((t) => (
            <figure className="tk-testi" key={t.name}>
              <span className="material-symbols-outlined">verified</span>
              <blockquote>{t.quote}</blockquote>
              <figcaption>
                <b>{t.name}</b>
                <span>{t.role}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="tk-band is-reveal" ref={reveal(6)}>
        <div>
          <h2>Belanja lebih hemat di aplikasi</h2>
          <p>Unduh TokoKita dan dapatkan voucher pertama kamu sekarang.</p>
        </div>
        <div className="tk-band-actions">
          <button type="button" className="tk-btn-dark">
            <span className="material-symbols-outlined">android</span>
            Google Play
          </button>
          <button type="button" className="tk-btn-dark">
            <span className="material-symbols-outlined">apple</span>
            App Store
          </button>
        </div>
      </section>

      <footer className="tk-footer">
        <span>TokoKita © 2029 · Belanja Online Terpercaya</span>
      </footer>
    </div>
  )
}