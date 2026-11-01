# Pradnyasiwi Quadtech

Website pameran STEM untuk memperkenalkan konsep alat penjemur padi otomatis dari tim Pradnyasiwi Quadtech, SMPN 4 Pakem.

## Menjalankan lokal

Butuh Node.js 20.19+ atau 22.12+.

```sh
npm ci
npm run dev
```

Situs ini dibuat dengan React dan Vite. Tidak ada backend atau layanan server aplikasi; GitHub Actions membangun file statis untuk GitHub Pages.

## GitHub Pages

Workflow di `.github/workflows/pages.yml` menerbitkan situs secara otomatis setiap kali ada push ke branch `main`. Setelah workflow pertama berhasil, pastikan **Settings → Pages → Build and deployment → Source** memakai **GitHub Actions**. URL situs akan muncul di halaman Pages dan pada hasil workflow.

## Konten yang perlu dilengkapi

- Ganti ilustrasi galeri dan bagian cerita/behind-the-scenes dengan dokumentasi proyek.
- Tambahkan sumber dan referensi resmi pada bagian Referensi & Sumber setelah daftar rujukan tersedia.
- Perbarui deskripsi cara kerja, spesifikasi, dan manfaat sesuai kemampuan alat yang sudah diuji.
- Ilustrasi dan ikon disimpan sebagai SVG lokal di `assets/`.

## Berkas

- `src/main.jsx` — halaman dan komponen React.
- `src/styles.css` — desain responsif, gerakan, dan dukungan reduced motion.
- `assets/` — ilustrasi lokal untuk hero, galeri, dan ikon.
- `.github/workflows/pages.yml` — build dan deploy otomatis ke GitHub Pages.
