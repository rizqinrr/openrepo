# OpenRepo

OpenRepo adalah katalog open-source berisi tools kecil, game browser, dan eksperimen interaktif yang dapat digunakan langsung tanpa instalasi atau akun.

**Live:** https://rizqinrr.github.io/openrepo/

## Produk yang tersedia

- **CV Creator** — membuat dan mengekspor CV langsung dari browser.
- **Typing Survival** — game mengetik dengan wave, nyawa, combo, dan best score lokal.
- **Refresh Man: Urban Rush** — endless arcade game karya [@Dermawanpurba](https://github.com/Dermawanpurba).
- **Profile experiments** — beberapa eksperimen visual seperti Arcade, Terminal, Swiss Editorial, dan Airbnb Experience.
- **Community links** — akses ke kanal komunitas yang dikurasi.

Setiap produk memiliki identitas pembuat melalui metadata `author` dan `github` pada katalog.

## Teknologi

- React 19
- Vite 8
- Framer Motion
- React Icons
- GitHub Pages

Sebagian produk mandiri dapat membawa implementasinya sendiri. Contohnya, Refresh Man disimpan di `public/products/refresh-man/` dan dibuka melalui wrapper React.

## Menjalankan secara lokal

Persyaratan: Node.js yang kompatibel dengan Vite 8.

```bash
npm install
npm run dev
```

Buka alamat yang ditampilkan Vite, biasanya `http://localhost:5173`.

## Perintah

| Perintah | Fungsi |
|---|---|
| `npm run dev` | Menjalankan development server |
| `npm run build` | Membuat production build di `dist/` |
| `npm run lint` | Menjalankan Oxlint |
| `npm run preview` | Meninjau production build secara lokal |
| `npm run deploy` | Membangun dan memublikasikan `dist/` ke branch `gh-pages` |

## Struktur repository

```text
openrepo/
├─ public/
│  └─ products/
│     └─ refresh-man/index.html
├─ src/
│  ├─ app/                     # Route lookup dan hash route hook
│  ├─ catalog/                 # Category/product registry tervalidasi
│  ├─ pages/
│  │  ├─ home/                 # Homepage dan style terisolasi
│  │  └─ legacy/               # Halaman CV/portfolio lama
│  ├─ products/
│  │  ├─ typing-survival/
│  │  ├─ refresh-man/
│  │  ├─ cv-creator/
│  │  ├─ _template-react/
│  │  └─ _template-html/
│  ├─ experiments/profile-templates/
│  ├─ community/
│  └─ shared/
│     ├─ config/
│     └─ styles/
├─ CONTRIBUTING.md
├─ LICENSE
├─ package.json
└─ vite.config.js
```

## Berkontribusi

Panduan lengkap tersedia di [CONTRIBUTING.md](CONTRIBUTING.md).

Ringkasnya:

1. Tambah kategori melalui `src/catalog/categories.js` bila diperlukan.
2. Salin template React atau HTML dari `src/products/`.
3. Daftarkan produk di `src/catalog/products.js`.
4. Isi `author.name` dan `author.github` dengan benar.
5. Jalankan lint dan build.

Homepage dan route lookup membaca registry yang sama. Contributor tidak perlu mengedit JSX homepage atau menambah blok route manual.

Contoh metadata produk:

```js
{
  slug: 'nama-tool',
  route: '#/nama-tool',
  title: 'Nama Tool',
  description: 'Deskripsi singkat.',
  category: 'playground',
  icon: 'extension',
  author: {
    name: 'username-github',
    github: 'https://github.com/username-github',
  },
  Page: ProductPage,
}
```

### Standar kontribusi

Sebelum membuka pull request:

```bash
npm run lint
npm run build
```

Kontribusi juga harus:

- Dapat digunakan dengan keyboard.
- Responsif pada layar mobile.
- Tidak menyertakan secret, credential, atau tracking tersembunyi.
- Tidak mengirim data pengguna ke server tanpa penjelasan dan persetujuan.
- Menggunakan kode dan aset yang dibuat sendiri atau yang izinnya kompatibel.
- Menyertakan `author` dan `github` yang benar.
- Menjaga fitur tetap berjalan tanpa backend jika backend memang tidak diperlukan.

## Routing

Project menggunakan hash routing sederhana tanpa React Router.

```text
#/typing-game   → Typing Survival
#/game-lawas    → Refresh Man: Urban Rush
#/creator       → CV Creator
#/komunitas     → Community
```

Route lain digunakan untuk eksperimen tampilan profil.

## Deployment

```bash
npm run deploy
```

Perintah tersebut menjalankan production build lalu memublikasikan folder `dist/` ke branch `gh-pages`.

Vite menggunakan `base: './'` agar asset tetap bekerja pada URL subpath GitHub Pages.

## Lisensi

Kode dalam repository ini tersedia di bawah [MIT License](LICENSE).

Identitas kreator tetap dicantumkan pada setiap produk. Dengan mengirim kontribusi, kontributor menyetujui bahwa kontribusinya didistribusikan di bawah lisensi repository ini.
