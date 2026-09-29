import { useState } from 'react'
import { useReveal } from './useReveal.js'
import './lms.css'

const TRACKS = [
  {
    id: 'frontend',
    label: 'Web Frontend',
    icon: 'frontend',
    level: 'Pemula → Menengah',
    goal: 'Bangun UI interaktif yang responsif dan siap dipakai.',
    modules: [
      { name: 'Dasar-dasar HTML', len: '6 modul · 4 jam' },
      { name: 'CSS: layout & komponen', len: '8 modul · 6 jam' },
      { name: 'JavaScript untuk pemula', len: '10 modul · 8 jam' },
      { name: 'React + API', len: '8 modul · 7 jam' },
    ],
    cert: 'Sertifikat "Frontend Web Developer"',
  },
  {
    id: 'backend',
    label: 'Web Backend',
    icon: 'dns',
    level: 'Pemula → Menengah',
    goal: 'Rancang API dan kelola data dengan benar.',
    modules: [
      { name: 'Node.js & npm', len: '6 modul · 4 jam' },
      { name: 'HTTP, REST & JSON', len: '7 modul · 5 jam' },
      { name: 'Database & SQL', len: '8 modul · 6 jam' },
      { name: 'Autentikasi & keamanan', len: '8 modul · 6 jam' },
    ],
    cert: 'Sertifikat "Backend Web Developer"',
  },
  {
    id: 'algo',
    label: 'Dasar Algoritma',
    icon: 'account_tree',
    level: 'Pemula',
    goal: 'Berpikir terstruktur: pola, kompleksitas, dan logika.',
    modules: [
      { name: 'Variabel, loop, dan array', len: '6 modul · 4 jam' },
      { name: 'String & rekursi', len: '6 modul · 4 jam' },
      { name: 'Pencarian & pengurutan', len: '7 modul · 5 jam' },
      { name: 'Latihan soal bertingkat', len: '10 soal · 3 jam' },
    ],
    cert: 'Sertifikat "Algorithms Foundations"',
  },
]

const FEATURES = [
  {
    icon: 'format_list_numbered',
    title: 'Materi bertingkat',
    desc: 'Setiap jalur dipecah jadi modul kecil dengan urutan yang masuk akal, dari nol sampai siap rilis.',
  },
  {
    icon: 'terminal',
    title: 'Editor & terminal inline',
    desc: 'Kode langsung di halaman materi. Tulis, jalankan, dan lihat hasilnya tanpa pindah tab.',
  },
  {
    icon: 'quiz',
    title: 'Kuis & auto-grade',
    desc: 'Soal diperiksa otomatis dengan umpan balik langsung. Salah bukan akhir — pelajari & ulangi.',
  },
  {
    icon: 'local_fire_department',
    title: 'Pelacak progres',
    desc: 'Streak, XP, dan badge memantau konsistensi. Rampungkan jalur dan unduh sertifikat PDF.',
  },
]

const AUDIENCE = [
  {
    icon: 'rocket_launch',
    title: 'Pemula total',
    desc: 'Belum pernah koding? Mulai dari HTML dan logika dasar, pelan tapi pasti.',
  },
  {
    icon: 'trending_up',
    title: 'Switch karier & upskill',
    desc: 'Sudah kerja tapi mau pindah jadi developer? Ikuti salah satu jalur sampai sertifikat.',
  },
  {
    icon: 'group_add',
    title: 'Kontributor kursus',
    desc: 'Punya materi bagus? Ajukan modul, jadi mentor, atau bantu kurasi jalur belajar.',
  },
]

const COURSES = [
  { title: 'HTML & CSS Dasar', level: 'Pemula', len: '10 jam', rating: 4.9 },
  { title: 'JavaScript untuk Pemula', level: 'Pemula', len: '20 jam', rating: 4.8 },
  { title: 'React + API', level: 'Menengah', len: '18 jam', rating: 4.7 },
  { title: 'Struktur Data Esensial', level: 'Menengah', len: '14 jam', rating: 4.9 },
]

const TESTIMONIALS = [
  {
    quote: 'Dulu mati gaya di tengah tutorial. Di sini tantangannya justru yang bikin ketagihan.',
    name: 'Laras',
    role: 'QA → Frontend Dev',
  },
  {
    quote: 'Autograder-nya jujur. Salahnya langsung keliatan, jadi aku cepat paham konsepnya.',
    name: 'Bima',
    role: 'Mahasiswa Informatika',
  },
  {
    quote: 'Tuntas jalur Frontend dalam 5 bulan sambil kerja. Sertifikatnya masuk portofolio.',
    name: 'Nadia',
    role: 'Content Writer → Developer',
  },
]

const FAQS = [
  {
    q: 'Apakah LearnCode gratis?',
    a: 'Semua materi dasar dan tantangan bisa diakses gratis. Peran premium tersedia untuk sertifikat tambahan dan jalur eksklusif.',
  },
  {
    q: 'Harus punya pengalaman coding dulu?',
    a: 'Tidak. Tiap jalur dimulai dari nol dan kamu bisa masuk sesuai level lewat tes penempatan singkat.',
  },
  {
    q: 'Sertifikatnya diakui?',
    a: 'Sertifikat menandakan kamu menuntaskan proyek akhir dan lulus penilaian. Banyak belajar dari portofolio yang kamu hasilkan.',
  },
  {
    q: 'Bisa belajar offline?',
    a: 'Bisa. Materi diunduh untuk dibaca offline, sementara editor dan autograder tetap butuh koneksi.',
  },
  {
    q: 'Bedanya dengan menonton tutorial?',
    a: 'Tutorial umumnya satu arah. Di sini kamu harus mengerjakan tantangan dan proyek nyata yang diverifikasi otomatis.',
  },
]

const STATS = [
  { value: '120+', label: 'modul' },
  { value: '350+', label: 'tantangan' },
  { value: '18k', label: 'pembelajar' },
  { value: '9.4k', label: 'sertifikat terbit' },
]

export default function LmsLanding() {
  const [trackId, setTrackId] = useState('frontend')
  const [openFaq, setOpenFaq] = useState(0)
  const reveal = useReveal()
  const track = TRACKS.find((t) => t.id === trackId)

  return (
    <main className="lm">
      <section className="lm-hero">
        <div className="lm-hero-copy">
          <span className="lm-eyebrow">LEARNCODE · LMS KURSUS CODING</span>
          <h1>
            Berhenti nonton tutorial.
            <br />
            <span className="lm-accent">Mulai kode.</span>
          </h1>
          <p>
            Jalur belajar bertingkat, tantangan yang dinilai otomatis, dan sertifikat untuk
            tiap capaian. Semuanya langsung dari browser.
          </p>
          <div className="lm-actions">
            <a className="lm-cta lm-cta-primary" href="#lm-tracks">
              Lihat jalur belajar
            </a>
            <a className="lm-cta lm-cta-ghost" href="#lm-courses">
              Cek kursus
            </a>
          </div>
        </div>

        <div className="lm-mock" aria-hidden="true">
          <div className="lm-mock-head">
            <div className="lm-mock-dots">
              <span /><span /><span />
            </div>
            <strong>dashboard belajar</strong>
          </div>
          <div className="lm-mock-body">
            <div className="lm-mock-track">
              <span>Jalur Frontend</span>
              <b>62%</b>
            </div>
            <div className="lm-mock-modules">
              {[
                { name: 'HTML Dasar', done: true },
                { name: 'CSS: layout', done: true },
                { name: 'JavaScript #1', done: true },
                { name: 'JavaScript #2', done: false },
                { name: 'React + API', done: false },
              ].map((mod) => (
                <div className={`lm-mock-mod${mod.done ? ' is-done' : ''}`} key={mod.name}>
                  <span className="lm-mock-check">
                    {mod.done ? 'check' : 'radio_button_unchecked'}
                  </span>
                  <span>{mod.name}</span>
                  {mod.done ? <i>selesai</i> : <i>berikutnya</i>}
                </div>
              ))}
            </div>
            <div className="lm-mock-bar">
              <span style={{ width: '62%' }} />
            </div>
          </div>
        </div>
      </section>

      <section className="lm-stats is-reveal" ref={reveal(0)} aria-label="Statistik LearnCode">
        {STATS.map((stat) => (
          <div className="lm-stat" key={stat.label}>
            <b>{stat.value}</b>
            <span>{stat.label}</span>
          </div>
        ))}
      </section>

      <section id="lm-tracks" className="lm-section is-reveal" ref={reveal(1)}>
        <span className="lm-eyebrow">JALUR BELAJAR</span>
        <h2>Pilih jalur, kami yang susun urutannya.</h2>
        <div className="lm-tabs">
          {TRACKS.map((t) => (
            <button
              key={t.id}
              type="button"
              className={`lm-tab${t.id === trackId ? ' is-active' : ''}`}
              onClick={() => setTrackId(t.id)}
            >
              <span className="material-symbols-outlined">{t.icon}</span>
              {t.label}
            </button>
          ))}
        </div>
        {track && (
          <div className="lm-track-panel">
            <div className="lm-track-head">
              <span className="lm-track-level">{track.level}</span>
              <p>{track.goal}</p>
            </div>
            <ul className="lm-track-modules">
              {track.modules.map((mod) => (
                <li key={mod.name}>
                  <span className="material-symbols-outlined">play_lesson</span>
                  <b>{mod.name}</b>
                  <span>{mod.len}</span>
                </li>
              ))}
            </ul>
            <span className="lm-track-cert">
              <span className="material-symbols-outlined">workspace_premium</span>
              {track.cert}
            </span>
          </div>
        )}
      </section>

      <section className="lm-section is-reveal" ref={reveal(2)}>
        <span className="lm-eyebrow">FITUR</span>
        <h2>Dirancang supaya kamu benar-benar bisa.</h2>
        <div className="lm-features">
          {FEATURES.map((feature) => (
            <div className="lm-feature" key={feature.title}>
              <span className="material-symbols-outlined">{feature.icon}</span>
              <h3>{feature.title}</h3>
              <p>{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="lm-section lm-how">
        <span className="lm-eyebrow">CARA KERJA</span>
        <h2>Tiga langkah, dari nol ke sertifikat.</h2>
        <div className="lm-steps">
          {[
            { n: '01', title: 'Kami susun jalur', desc: 'Tes penempatan singkat menemukan level dan jalur yang pas untukmu.' },
            { n: '02', title: 'Kamu kode & submit', desc: 'Kerjakan modul dan tantangan; autograder memberi umpan balik langsung.' },
            { n: '03', title: 'Dapatkan sertifikat', desc: 'Tuntaskan proyek akhir, terbitkan sertifikat, dan lanjut ke jalur berikutnya.' },
          ].map((step) => (
            <div className="lm-step" key={step.n}>
              <span className="lm-step-n">{step.n}</span>
              <b>{step.title}</b>
              <p>{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="lm-section is-reveal" ref={reveal(3)}>
        <span className="lm-eyebrow">UNTUK SIAPA</span>
        <h2>Dari yang baru mulai sampai yang beralih karier.</h2>
        <div className="lm-audience">
          {AUDIENCE.map((item) => (
            <div className="lm-audience-card" key={item.title}>
              <span className="material-symbols-outlined">{item.icon}</span>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="lm-courses" className="lm-section is-reveal" ref={reveal(4)}>
        <span className="lm-eyebrow">KURSUS UNGGULAN</span>
        <h2>Mulai dari mana? Ini favorit pembelajar.</h2>
        <div className="lm-courses">
          {COURSES.map((course) => (
            <div className="lm-course" key={course.title}>
              <div className="lm-course-top">
                <span className="lm-chip">{course.level}</span>
                <span className="lm-rating">★ {course.rating.toFixed(1)}</span>
              </div>
              <h3>{course.title}</h3>
              <p className="lm-course-len">{course.len}</p>
              <p className="lm-course-link">
                Lihat detail
                <span className="material-symbols-outlined">arrow_forward</span>
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="lm-section is-reveal" ref={reveal(5)}>
        <span className="lm-eyebrow">KATA MEREKA</span>
        <h2>Mereka yang sudah jalan duluan.</h2>
        <div className="lm-testimonials">
          {TESTIMONIALS.map((testi) => (
            <figure className="lm-testi" key={testi.name}>
              <span className="lm-testi-mark">“</span>
              <blockquote>{testi.quote}</blockquote>
              <figcaption>
                <b>{testi.name}</b>
                <span>{testi.role}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="lm-section lm-faq is-reveal" ref={reveal(6)}>
        <span className="lm-eyebrow">TANYA JAWAB</span>
        <h2>Masih ragu? Ini jawabannya.</h2>
        <div className="lm-faq-list">
          {FAQS.map((faq, i) => (
            <div className={`lm-faq-item${openFaq === i ? ' is-open' : ''}`} key={faq.q}>
              <button
                type="button"
                id={`lm-faq-q-${i}`}
                className="lm-faq-q"
                aria-expanded={openFaq === i}
                aria-controls={`lm-faq-a-${i}`}
                onClick={() => setOpenFaq(openFaq === i ? -1 : i)}
              >
                <span>{faq.q}</span>
                <span className="material-symbols-outlined">expand_more</span>
              </button>
              {openFaq === i && (
                <p className="lm-faq-a" id={`lm-faq-a-${i}`}>
                  {faq.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="lm-cta-final">
        <h2>Siap naik level?</h2>
        <p>Buat akun gratis dan mulai modul pertamamu hari ini.</p>
        <a className="lm-cta lm-cta-primary" href="#lm-tracks">
          Mulai belajar sekarang
        </a>
      </section>

      <footer className="lm-footer">
        <p>© 2026 LearnCode — demo landing page dalam OpenRepo.</p>
      </footer>
    </main>
  )
}