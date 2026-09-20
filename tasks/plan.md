# Implementation Plan: Struktur Kontribusi OpenRepo

## Overview

Restrukturisasi ini memindahkan OpenRepo dari struktur berbasis halaman lama menjadi struktur berbasis produk. Target utamanya: kontributor dapat menambahkan satu produk dengan membuat satu folder, mengisi satu metadata produk, lalu mendaftarkannya di satu registry tanpa mengubah homepage, menu, dan rangkaian `if` route secara terpisah.

Perubahan harus mempertahankan seluruh route, tampilan, penyimpanan lokal, dan hasil build saat ini.

## Architecture Decisions

- Gunakan struktur `product-first`: implementasi, style, dan metadata produk tinggal berdekatan.
- Pisahkan `categories` dari `products`: kategori adalah metadata navigasi; produk adalah item yang bisa dibuka.
- Homepage membaca `categories` dan `products` dari registry, lalu mengelompokkan produk saat render. Menambah kategori atau produk tidak memerlukan perubahan JSX homepage.
- Gunakan satu route lookup terpusat untuk route produk dan halaman legacy.
- Pertahankan hash routing. React Router tidak diperlukan.
- Navbar homepage memiliki satu row desktop yang konsisten: brand, link navigasi, `Eksperimen`, mode warna, dan share. Pada mobile, link teks disembunyikan tetapi action tetap berjejer dan touch-safe.
- Hero desktop memakai `min-height: calc(100dvh - var(--home-nav-height))` dengan batas minimum/maximum yang wajar agar headline, CTA, showcase, dan proof terlihat dalam viewport pertama tanpa scroll. Mobile boleh bertambah tinggi secara natural.
- Hindari plugin system, auto-discovery build-time, monorepo, dan abstraksi generik yang belum dibutuhkan.
- Produk HTML mandiri tetap berada di `public/products/`, dengan wrapper React di folder produk yang sama secara konseptual.

## Target Structure

```text
src/
├─ app/
│  ├─ App.jsx
│  ├─ routes.js
│  └─ useHashRoute.js
├─ pages/
│  │  ├─ HomePage.jsx
│  │  └─ home.css
├─ catalog/
│  ├─ categories.js
│  └─ products.js
├─ products/
│  ├─ registry.js
│  ├─ typing-survival/
│  │  ├─ product.js
│  │  ├─ TypingSurvivalPage.jsx
│  │  ├─ gameState.js
│  │  ├─ typingWords.js
│  │  ├─ retroAudio.js
│  │  └─ typing-survival.css
│  ├─ refresh-man/
│  │  ├─ product.js
│  │  ├─ RefreshManPage.jsx
│  │  └─ refresh-man.css
│  └─ cv-creator/
│     ├─ product.js
│     ├─ CvCreatorPage.jsx
│     └─ ...
├─ experiments/
│  └─ profile-templates/
├─ community/
├─ shared/
│  ├─ config/
│  ├─ ui/
│  └─ styles/
└─ main.jsx

public/
└─ products/
   └─ refresh-man/
      └─ index.html
```

## Product and Category Interfaces

Kategori dan produk sengaja memiliki interface terpisah:

```js
export const categories = [
  {
    id: 'playground',
    title: 'Playground',
    description: 'Game dan eksperimen interaktif.',
    icon: 'sports_esports',
    order: 20,
  },
]

export const products = [
  {
    slug: 'refresh-man',
    route: '#/game-lawas',
    title: 'Refresh Man: Urban Rush',
    description: 'Endless arcade game langsung di browser.',
    category: 'playground',
    icon: 'directions_run',
    author: {
      name: 'Dermawan Purba',
      github: 'https://github.com/Dermawanpurba',
    },
    Page: RefreshManPage,
  },
]
```

`src/catalog/categories.js` menjadi daftar kategori yang dapat ditambah contributor. `src/catalog/products.js` menjadi daftar produk. Homepage mengelompokkan produk berdasarkan `category`, mengurutkan berdasarkan `order`, lalu merender kartu. Route lookup mengambil `route` dari produk tanpa blok `if` baru.

Menambah kategori baru hanya memerlukan satu object di `categories.js`. Menambah produk ke kategori yang sudah ada hanya memerlukan satu object di `products.js` dan satu implementasi produk. Tidak perlu menyentuh JSX homepage, navbar, atau menu manual.

## Extension Rules

### Menambah kategori

Contributor menambahkan satu entry ke `src/catalog/categories.js`:

```js
{
  id: 'developer-tools',
  title: 'Developer Tools',
  description: 'Utility untuk pekerjaan development.',
  icon: 'code',
  order: 30,
}
```

Homepage membuat section/card kategori secara otomatis. Kategori tanpa produk tidak dirender agar halaman tidak menampilkan ruang kosong.

### Menambah produk

Contributor membuat folder produk dan satu metadata produk. Field `category` harus merujuk ke `categories.js`. Jika category ID tidak dikenal, validasi registry harus gagal saat build atau lint, bukan diam-diam menaruh produk ke kategori lain.

### Menambah tipe kontribusi di luar produk

Kontribusi yang bukan produk tidak dipaksa masuk product registry:

- kategori baru → `catalog/categories.js`
- produk/tool/game → `catalog/products.js` + folder `products/`
- eksperimen visual → `experiments/profile-templates/`
- perbaikan homepage → `pages/home/`
- komponen reusable → `shared/ui/`
- community resource → `community/`

Ini menjaga interface registry tetap kecil; contributor tidak perlu memalsukan semua perubahan sebagai “produk”.

## UI Acceptance Criteria

- Pada desktop dengan viewport tinggi sekitar 768px atau lebih, navbar dan hero utama muat di viewport pertama tanpa memerlukan scroll untuk melihat CTA, proof, dan showcase.
- Navbar tidak membungkus: tombol `Eksperimen`, mode warna, dan share selalu berada dalam satu baris horizontal.
- Pada mobile, link navigasi teks boleh disembunyikan; tiga action tetap berjejer, masing-masing minimal 44×44px, tanpa horizontal overflow.
- Homepage tetap dirender dari category/product registry setelah ekstraksi; restrukturisasi tidak boleh meng-hardcode ulang kartu kategori di JSX.


## Task List

### Phase 1: Product Contract

- [ ] Task 1: Tetapkan bentuk metadata produk
  - Acceptance: semua field wajib terdokumentasi; `slug`, `route`, `title`, `category`, `author`, dan `Page` tervalidasi secara sederhana.
  - Verification: registry dapat diimpor dan seluruh entry mempunyai route unik.
  - Files: `src/products/registry.js`, `src/products/*/product.js`.

- [ ] Task 2: Buat route lookup terpusat
  - Acceptance: `App.jsx` tidak lagi memiliki rangkaian `if (route === ...)`; unknown route kembali ke homepage.
  - Verification: semua hash route lama masih merender halaman yang sama.
  - Files: `src/app/routes.jsx`, `src/app/useHashRoute.js`, `src/app/App.jsx`.

### Checkpoint: Contract

- [ ] `npm run lint` berhasil.
- [ ] `npm run build` berhasil.
- [ ] Semua route lama tersedia.

### Phase 2: Homepage Boundary

- [ ] Task 3: Ekstrak homepage dari App
  - Acceptance: markup, state template switcher, share, theme, katalog, kontribusi, dan footer berada di `pages/home`.
  - Verification: homepage mempertahankan tampilan dan interaksi sekarang.
  - Files: `src/pages/home/HomePage.jsx`, `src/pages/home/home.css`, `src/app/App.jsx`.

- [ ] Task 4: Hubungkan homepage ke product registry
  - Acceptance: kartu produk, kategori, route, dan identitas GitHub berasal dari registry; konfigurasi kategori hardcoded dihapus.
  - Verification: menambahkan satu registry entry menghasilkan kartu dan route tanpa mengedit homepage.
  - Files: `src/catalog/registry.js`, `src/catalog/products.js`, `src/pages/home/HomePage.jsx`.

### Checkpoint: Homepage

- [ ] `npm run lint` dan `npm run build` berhasil.
- [ ] Homepage menampilkan produk dan atribusi dari registry.
- [ ] Navigasi keyboard dan layout mobile tetap berfungsi.

### Phase 3: Product Migration

- [ ] Task 5: Pindahkan Typing Survival
  - Acceptance: seluruh reducer, word bank, audio, persistence, page, dan CSS berada di `src/products/typing-survival/`.
  - Verification: start, typing benar/salah, pause, timeout, game-over, dan best score tetap bekerja.

- [ ] Task 6: Pindahkan Refresh Man
  - Acceptance: wrapper berada di `src/products/refresh-man/`; HTML berada di `public/products/refresh-man/index.html`; atribusi Dermawan Purba dipertahankan.
  - Verification: game dimuat melalui route produk dan tombol kembali bekerja.

- [ ] Task 7: Pindahkan CV Creator
  - Acceptance: semua file Creator berada di `src/products/cv-creator/` tanpa mengubah data browser yang sudah tersimpan.
  - Verification: edit, autosave, preview, dan export tetap bekerja.

### Checkpoint: Products

- [ ] Seluruh produk dapat dibuka dari registry.
- [ ] Tidak ada import dari lokasi lama.
- [ ] Storage key lama tetap dipertahankan.

### Phase 4: Supporting Modules

- [ ] Task 8: Kelompokkan eksperimen profil
  - Acceptance: seluruh template visual berada di `src/experiments/profile-templates/`; route tetap sama.
  - Verification: setiap template lama dapat dibuka.

- [ ] Task 9: Pisahkan community dan shared config
  - Acceptance: data komunitas tidak lagi bercampur dengan produk; social/site/theme berada di `shared/config`.
  - Verification: community route, gate, social links, theme, dan share tetap bekerja.

- [ ] Task 10: Bersihkan file dan export lama
  - Acceptance: file, import, CSS, dan constant yang sudah digantikan dihapus; tidak ada alias kompatibilitas sementara.
  - Verification: pencarian lokasi lama tidak menemukan caller aktif.

### Phase 5: Contributor Experience

- [ ] Task 11: Tambahkan template produk
  - Acceptance: tersedia contoh minimal untuk produk React dan produk HTML mandiri.
  - Verification: contoh mengikuti interface registry dan bisa dibuild setelah disalin.

- [ ] Task 12: Tambahkan CONTRIBUTING.md
  - Acceptance: menjelaskan struktur produk, metadata author/GitHub, route, asset, accessibility, build, lint, dan lisensi MIT.
  - Verification: contributor baru dapat mengikuti alur tanpa perlu mengedit App atau homepage.

### Checkpoint: Complete

- [ ] `npm run lint` berhasil tanpa warning.
- [ ] `npm run build` berhasil.
- [ ] Homepage dan seluruh route lama berfungsi.
- [ ] Menambahkan produk hanya memerlukan folder produk dan satu registry entry.
- [ ] Atribusi author terlihat pada setiap produk.

## Risks and Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Import rusak saat file dipindah | Tinggi | Migrasikan satu produk per task dan build setelah setiap perpindahan |
| Hash route berubah | Tinggi | Pertahankan nilai route lama di metadata produk |
| LocalStorage pengguna hilang | Tinggi | Jangan mengubah storage key saat memindahkan implementasi |
| CSS bocor ke route lain | Sedang | Scope style per halaman/produk dan jangan memindahkan semuanya ke global CSS |
| Produk HTML gagal di GitHub Pages | Sedang | Gunakan path relatif dan smoke-check hasil `dist/` |
| Registry menjadi terlalu pintar | Sedang | Registry hanya menyimpan metadata dan komponen; tanpa plugin lifecycle |

## Non-goals

- Tidak mengubah UI atau gameplay.
- Tidak mengganti hash routing dengan React Router.
- Tidak membuat backend, database, CMS, atau package workspace.
- Tidak melakukan auto-import folder dengan build plugin.
- Tidak mengubah lisensi MIT atau identitas pembuat produk.
