import { useState } from 'react'
import { useReveal } from './useReveal.js'
import './restaurant.css'

const MENU = [
  {
    cat: 'Sarapan',
    name: 'Bubur Ayam Suwur',
    desc: 'Bubur lembut dengan suwiran ayam kampung dan taburan bawang goreng.',
    price: 22000,
  },
  {
    cat: 'Sarapan',
    name: 'Nasi Uduk Komplit',
    desc: 'Nasi uduk harum dengan lauk lengkap: telur balado, tempe, dan sambal.',
    price: 18000,
  },
  {
    cat: 'Sarapan',
    name: 'Roti Bakar Keju',
    desc: 'Roti bakar renyah dengan lelehan keju dan gula aren.',
    price: 15000,
  },
  {
    cat: 'Makanan',
    name: 'Nasi Ayam Tektek',
    desc: 'Ayam tumis saus kecap-gurih, disajikan dengan lalapan segar.',
    price: 25000,
  },
  {
    cat: 'Makanan',
    name: 'Sate Ayam Madura',
    desc: 'Sate ayam bumbu kacang khas Madura, potongan empuk dan manis.',
    price: 28000,
  },
  {
    cat: 'Makanan',
    name: 'Nasi Goreng Kampung',
    desc: 'Nasi goreng berbumbu rempah dengan telur mata sapi.',
    price: 20000,
  },
  {
    cat: 'Minuman',
    name: 'Es Teh Manis',
    desc: 'Teh melati diseduh, manisnya pas, disajikan dingin.',
    price: 6000,
  },
  {
    cat: 'Minuman',
    name: 'Kopi Susu Aren',
    desc: 'Kopi lokal dengan susu dan gula aren, creamy di atas.',
    price: 16000,
  },
  {
    cat: 'Minuman',
    name: 'Jus Alpukat',
    desc: 'Alpukat matang dengan susu kental, tanpa gula tambahan.',
    price: 18000,
  },
  {
    cat: 'Cemilan',
    name: 'Pisang Goreng Madu',
    desc: 'Pisang goreng renyah disiram madu dan wijen sangrai.',
    price: 12000,
  },
  {
    cat: 'Cemilan',
    name: 'Tahu Crispy',
    desc: 'Tahu goreng renyah dengan saus sambal pedas manis.',
    price: 10000,
  },
  {
    cat: 'Cemilan',
    name: 'Singkong Balado',
    desc: 'Singkong goreng dengan sambal balado rumahan.',
    price: 9000,
  },
]

const CATEGORIES = ['Semua', 'Sarapan', 'Makanan', 'Minuman', 'Cemilan']

const TESTIMONIALS = [
  {
    name: 'Andi',
    role: 'Pengunjung rutin',
    quote: 'Nasi ayam tektek-nya juara. Rasa rumahan beneran, harganya bersahabat.',
  },
  {
    name: 'Sari',
    role: 'Kerja dari warung',
    quote: 'Tempatnya nyaman buat nongkrong sambil kerja. Kopi susu aren-nya wajib.',
  },
  {
    name: 'Dimas',
    role: 'Datang keluarga',
    quote: 'Pesannya gampang lewat reservasi, datang tinggal duduk. Ramah banget.',
  },
]

const HOURS = [
  { day: 'Senin', open: '07.00', close: '21.00' },
  { day: 'Selasa', open: '07.00', close: '21.00' },
  { day: 'Rabu', open: '07.00', close: '21.00' },
  { day: 'Kamis', open: '07.00', close: '21.00' },
  { day: 'Jumat', open: '07.00', close: '22.00' },
  { day: 'Sabtu', open: '07.00', close: '22.00' },
  { day: 'Minggu', open: '08.00', close: '20.00' },
]

const STEPS = [
  { icon: 'event_available', title: 'Ambil kursi', desc: 'Nama, jumlah orang, dan tanggal reservasi kamu.' },
  { icon: 'restaurant', title: 'Pilih menu', desc: 'Nikmati andalan kami sambil memilih menu favorit.' },
  { icon: 'favorite', title: 'Nikmati', desc: 'Rasa pulang, pelayanan ramah, tagihan transparan.' },
]

export default function RestaurantLanding() {
  const revealRefs = useReveal()
  const [activeCat, setActiveCat] = useState('Semua')
  const [form, setForm] = useState({ name: '', people: '2', date: '' })
  const [sent, setSent] = useState(false)
  const today = new Date().getDay()
  const todayName = HOURS[today]
  const items = activeCat === 'Semua' ? MENU : MENU.filter((m) => m.cat === activeCat)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (form.name && form.date) setSent(true)
  }

  return (
    <div className="rs">
      <nav className="rs-nav" aria-label="Navigasi">
        <div className="rs-nav-in">
          <span className="rs-logo">RasaKita</span>
          <div className="rs-links">
            <a href="#rs-menu">Menu</a>
            <a href="#rs-about">Tentang</a>
            <a href="#rs-hours">Jam & Lokasi</a>
          </div>
          <button type="button" className="rs-btn rs-btn-accent">
            Reservasi
          </button>
        </div>
      </nav>

      <section className="rs-hero">
        <div className="rs-hero-copy">
          <span className="rs-eyebrow">SEDAP SETIAP HARI</span>
          <h1>Masakan rumahan yang rasanya sampe pulang.</h1>
          <p className="rs-sub">
            Sarapan sampai makan malam, semua dimasak dengan bahan segar dan resep turun-temurun.
            Jadi alasan buat kumpul.
          </p>
          <div className="rs-actions">
            <button type="button" className="rs-btn rs-btn-accent">
              Pesan sekarang
            </button>
            <button type="button" className="rs-btn rs-btn-outline">
              Lihat menu
            </button>
          </div>
        </div>
        <div className="rs-hero-visual" role="img" aria-label="Ilustrasi hidangan RasaKita">
          <div className="rs-visual-card">
            <div className="rs-visual-plate" />
            <div className="rs-visual-badge">
              <b>4.9</b>
              <span>rata-rata rating</span>
            </div>
            <div className="rs-visual-pill">
              <span className="material-symbols-outlined">schedule</span>
              Buka tiap hari · 07.00
            </div>
          </div>
        </div>
      </section>

      <section className="rs-stats" aria-label="Angka kunci RasaKita">
        <div>
          <b>7</b>
          <span>hari buka seminggu</span>
        </div>
        <div>
          <b>40+</b>
          <span>menu rumahan</span>
        </div>
        <div>
          <b>12</b>
          <span>tahun ngider masak</span>
        </div>
        <div>
          <b>4.9</b>
          <span>rating pelanggan</span>
        </div>
      </section>

      <section className="rs-menu" id="rs-menu" ref={revealRefs[0]}>
        <span className="rs-eyebrow">MENU ANDALAN</span>
        <h2>Pilih selera, kami siap </h2>
        <div className="rs-tabs" role="tablist" aria-label="Kategori menu">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              type="button"
              role="tab"
              aria-selected={activeCat === c}
              className={`rs-tab${activeCat === c ? ' is-active' : ''}`}
              onClick={() => setActiveCat(c)}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="rs-grid">
          {items.map((m) => (
            <article key={m.name} className="rs-card">
              <div className="rs-card-head">
                <h3>{m.name}</h3>
                <span className="rs-card-tag">{m.cat}</span>
              </div>
              <p>{m.desc}</p>
              <div className="rs-card-bottom">
                <b>Rp{m.price.toLocaleString('id-ID')}</b>
                <button type="button" className="rs-btn rs-btn-accent rs-btn-sm">
                  Pesan
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="rs-promo">
        <div className="rs-promo-in">
          <div className="rs-promo-copy">
            <span className="rs-eyebrow rs-eyebrow-light">PAKET KELUARGA</span>
            <h2>Makan ramai, hemat jutaan.</h2>
            <p>
              Paket untuk 4–6 orang: menu andalan + minuman, dengan harga spesial setiap akhir pekan.
            </p>
          </div>
          <ul className="rs-promo-list">
            {STEPS.map((s) => (
              <li key={s.title}>
                <span className="material-symbols-outlined">{s.icon}</span>
                <div>
                  <b>{s.title}</b>
                  <p>{s.desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="rs-about" id="rs-about" ref={revealRefs[1]}>
        <span className="rs-eyebrow">TENTANG</span>
        <h2>Dapur rumahan, bahan pilihan.</h2>
        <p>
          RasaKita lahir dari dapur kecil keluarga, sekarang jadi tempat kumpul yang hangat di
          jalan utama. Setiap pagi kami belanja bahan segar langsung dari pasar, lalu memasak
          dengan cara sederhana — tanpa penyedap berlebihan.
        </p>
      </section>

      <section className="rs-testimonials" ref={revealRefs[2]}>
        <span className="rs-eyebrow">KATA MEREKA</span>
        <h2>Dicoba, lalu balik lagi.</h2>
        <div className="rs-testi-grid">
          {TESTIMONIALS.map((t) => (
            <blockquote key={t.name} className="rs-testi">
              <p>“{t.quote}”</p>
              <footer>
                <b>{t.name}</b>
                <span>{t.role}</span>
              </footer>
            </blockquote>
          ))}
        </div>
      </section>

      <section className="rs-hours" id="rs-hours" ref={revealRefs[3]}>
        <span className="rs-eyebrow">JAM & LOKASI</span>
        <h2>Mampir, kami siapkan meja.</h2>
        <div className="rs-hours-grid">
          <div className="rs-hours-card">
            <h3>Jam buka</h3>
            <ul>
              {HOURS.map((h) => (
                <li
                  key={h.day}
                  className={h.day === todayName.day ? 'is-today' : undefined}
                >
                  <span>{h.day}</span>
                  <span>{h.open} – {h.close}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rs-hours-card">
            <h3>Lokasi</h3>
            <p>Jalan Melati No. 12, Kota Cilacap, Jawa Tengah</p>
            <ul className="rs-hours-meta">
              <li>
                <span className="material-symbols-outlined">call</span>
                0282-555-1234
              </li>
              <li>
                <span className="material-symbols-outlined">mail</span>
                halo@rasakita.id
              </li>
              <li>
                <span className="material-symbols-outlined">place</span>
                Parkir luas, dekat alun-alun
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="rs-reserve" ref={revealRefs[4]}>
        <h2>Reservasi meja sekarang.</h2>
        <p>Bayar di tempat, tanpa uang muka.</p>
        {sent ? (
          <div className="rs-sent">
            <span className="material-symbols-outlined">check_circle</span>
            <p>
              Terima kasih, {form.name.split(' ')[0]}! Meja untuk {form.people} orang pada{' '}
              {form.date} sudah kami catat.
            </p>
          </div>
        ) : (
          <form className="rs-form" onSubmit={handleSubmit}>
            <label>
              Nama
              <input
                type="text"
                placeholder="Nama kamu"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </label>
            <label>
              Jumlah orang
              <select
                value={form.people}
                onChange={(e) => setForm({ ...form, people: e.target.value })}
              >
                <option value="1">1 orang</option>
                <option value="2">2 orang</option>
                <option value="4">4 orang</option>
                <option value="6">6 orang</option>
                <option value="8">8+ orang</option>
              </select>
            </label>
            <label>
              Tanggal
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
              />
            </label>
            <button type="submit" className="rs-btn rs-btn-accent">
              Kirim reservasi
            </button>
          </form>
        )}
      </section>

      <footer className="rs-footer">
        <div className="rs-footer-in">
          <span className="rs-logo rs-logo-light">RasaKita</span>
          <p>Masakan rumahan, rasa yang pulang.</p>
          <ul>
            <li>Menu</li>
            <li>Tentang</li>
            <li>Jam & Lokasi</li>
            <li>Kontak</li>
          </ul>
          <div className="rs-footer-bottom">
            RasaKita © 2029 · Semua hak dilindungi.
          </div>
        </div>
      </footer>
    </div>
  )
}