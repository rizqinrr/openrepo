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
