# Contributing to OpenRepo

Terima kasih sudah ingin berkontribusi. OpenRepo menerima produk baru, kategori baru, perbaikan bug, peningkatan aksesibilitas, dan perbaikan desain.

## Menambahkan kategori

Tambahkan satu object ke `src/catalog/categories.js`:

```js
{
  id: 'developer-tools',
  title: 'Developer Tools',
  description: 'Utility untuk pekerjaan development.',
  icon: 'code',
  order: 40,
}
```

Kategori tanpa produk tidak dirender.

## Menambahkan produk React

1. Salin `src/products/_template-react/` ke folder baru.
2. Ganti page, stylesheet, dan `product.js`.
3. Pastikan `category` menunjuk ke ID yang tersedia.
4. Tambahkan metadata produk ke `src/catalog/products.js`.
5. Jangan mengubah JSX homepage atau route lookup.

Metadata minimal:

```js
{
  slug: 'nama-produk',
  route: '#/nama-produk',
  title: 'Nama Produk',
  description: 'Deskripsi singkat.',
  category: 'developer-tools',
  icon: 'extension',
  author: {
    name: 'username-github',
    github: 'https://github.com/username-github',
  },
  Page: ProductPage,
}
```

## Menambahkan produk HTML mandiri

1. Salin `src/products/_template-html/`.
2. Simpan HTML di `public/products/<slug>/index.html`.
3. Pastikan asset memakai path relatif.
4. Gunakan wrapper iframe dari template.
5. Tambahkan metadata produk ke `src/catalog/products.js`.

## Mengusulkan repository untuk katalog

Repository eksternal masuk melalui kurasi, bukan publikasi otomatis. Dari halaman `#/repos`, isi formulir **Punya repo yang benar-benar berguna?**. Formulir membuka GitHub issue yang sudah berisi URL, kategori, identitas pengusul, alasan, dan checklist lisensi.

Repository yang diusulkan harus:

- Dapat diakses publik dan memiliki lisensi yang jelas.
- Menyelesaikan masalah nyata, bukan hanya demo atau daftar tautan.
- Memiliki README yang menjelaskan instalasi dan penggunaan.
- Tidak mengandung malware, credential, tracking tersembunyi, atau klaim menyesatkan.
- Aktif dipelihara atau tetap berguna walau pengembangannya stabil.

Maintainer memeriksa manfaat, dokumentasi, keamanan, lisensi, dan kecocokan kategori. Usulan yang lolos ditambahkan sebagai satu object di `src/repositories/repositories.js` dengan struktur berikut:

```js
{
  slug: 'nama-repository',
  name: 'Nama Repository',
  owner: 'username-github',
  github: 'https://github.com/username-github/nama-repository',
  stars: 100,
  category: 'agent-tools',
  icon: 'extension',
  summary: 'Ringkasan singkat yang menjelaskan manfaat nyata.',
  description: 'Penjelasan lebih lengkap untuk modal detail repository.',
}
```

Gunakan ID yang tersedia di `repositoryCategories`. Jangan mengedit homepage atau kartu secara manual; keduanya membaca `repositories.js`.

### Memperbarui jumlah star

Jumlah star disimpan di `src/repositories/repository-stars.js` dan diperbarui otomatis oleh `.github/workflows/update-repository-stars.yml` setiap tiga hari. Workflow membaca `stargazers_count` dari GitHub REST API, menjalankan lint dan build, lalu hanya membuat commit bila angkanya berubah.

Untuk menjalankannya manual:

```bash
npm run update:stars
```

Jangan mengedit `repository-stars.js` secara manual.


## Atribusi

Setiap produk wajib menyertakan identitas pembuat:

```js
author: {
  name: 'username-github',
  github: 'https://github.com/username-github',
}
```

Jangan mengganti atribusi karya pihak lain. Untuk produk yang bukan buatan sendiri, pastikan izin redistribusi dan lisensinya jelas.

## Standar kontribusi

- Pertahankan hash route dan storage key yang sudah ada.
- Gunakan keyboard dan touch target minimal 44×44px.
- Pastikan layout berjalan pada mobile.
- Jangan menambahkan secret, credential, analytics, atau tracking tersembunyi.
- Jangan menambahkan request eksternal tanpa alasan yang terdokumentasi.
- Gunakan kode dan asset yang dibuat sendiri atau memiliki izin kompatibel.
- Scope stylesheet agar tidak merusak produk lain.

Jalankan sebelum membuat pull request:

```bash
npm run lint
npm run build
```

Dengan mengirim kontribusi, kamu menyetujui bahwa kontribusi tersebut didistribusikan berdasarkan [MIT License](LICENSE).
