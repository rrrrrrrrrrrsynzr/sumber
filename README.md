# Pradnyasiwi Quadtech

Website pameran STEM untuk memperkenalkan konsep alat penjemur padi otomatis dari tim Pradnyasiwi Quadtech, SMPN 4 Pakem.

## Menjalankan lokal

Butuh Node.js 20.19+ atau 22.12+.

```sh
npm ci
npm run dev
```

Situs ini dibuat dengan React dan Vite. Tidak ada backend atau layanan server aplikasi; GitHub Actions membangun file statis untuk GitHub Pages.

## Feedback

Form feedback menyimpan masukan hanya di `localStorage` pada browser pengunjung. Karena situs ini statis dan tanpa backend, masukan tidak terkirim ke tim atau tersinkron ke perangkat lain.

## GitHub Pages

Workflow di `.github/workflows/pages.yml` menerbitkan situs secara otomatis setiap kali ada push ke branch `main`. Setelah workflow pertama berhasil, pastikan **Settings → Pages → Build and deployment → Source** memakai **GitHub Actions**. URL situs akan muncul di halaman Pages dan pada hasil workflow.

Domain khusus yang disiapkan: `source.pradnyasiwi.web.id`. Supaya domain dan tautan PDF aktif, tambahkan DNS CNAME `source` yang mengarah ke `rrrrrrrrrrrsynzr.github.io`, lalu atur domain yang sama pada **Settings → Pages → Custom domain**. DNS dikelola di penyedia domain dan tidak dapat diubah dari repository ini.

## Konten yang perlu dilengkapi

- Ganti ilustrasi galeri dengan dokumentasi alat dan proses asli.
- Sumber yang ditampilkan sekarang: penelitian postur kerja petani rumput laut dengan REBA, artikel Siloam tentang heat stroke, dan salinan PDF penelitian di `files/Postur tubuh.pdf`.
- Perbarui deskripsi cara kerja, spesifikasi, dan manfaat sesuai kemampuan alat yang sudah diuji.
- Ilustrasi dan ikon disimpan sebagai SVG lokal di `assets/`.

## Berkas

- `src/main.jsx` — halaman dan komponen React.
- `src/styles.css` — desain responsif halaman dan dukungan reduced motion.
- `src/content-layout.css` — hierarki sumber di halaman awal, model konseptual yang dapat diputar, dan bagian kelompok.
- `src/source-references.css` — tampilan kartu dan ringkasan sumber.
- `src/intro-motion.css` — tahapan loading, orbit logo, dan transisi menuju halaman.
- `assets/` — ilustrasi lokal untuk hero, galeri, dan ikon.
- `files/` — dokumen PDF sumber penelitian.
- `CNAME` — domain khusus GitHub Pages.
- `.github/workflows/pages.yml` — build dan deploy otomatis ke GitHub Pages.
