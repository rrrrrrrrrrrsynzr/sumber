# Pradnyasiwi Quadtech

Website pameran STEM untuk memperkenalkan konsep alat penjemur padi otomatis dari tim Pradnyasiwi Quadtech, SMPN 4 Pakem.

## Menjalankan lokal

Butuh Node.js 22.x.

```sh
npm ci
npm run dev
```

Frontend dibuat dengan React dan Vite, sedangkan backend Node/Express menyimpan feedback pada SQLite. Karena itu aplikasi ini bukan lagi situs statis: GitHub Pages tidak dapat menjalankan backend. Ikuti panduan host Node di [DEPLOYMENT.md](DEPLOYMENT.md).

## Feedback

Form feedback mengirim masukan ke backend dan SQLite persisten. Daftar masukan hanya terlihat di panel internal `/dev/feedback`, yang membutuhkan kredensial server. Halaman publik tidak menampilkan daftar masukan.

## Hosting

Domain yang disiapkan: `source.pradnyasiwi.web.id`. Arahkan DNS ke server Node hosting Anda dan gunakan HTTPS. Panduan deploy dan alasan GitHub Pages tidak sesuai ada di [DEPLOYMENT.md](DEPLOYMENT.md).

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
- `server/` — API Express dan database SQLite.
- `Dockerfile` dan `compose.yaml` — cara menjalankan server dengan volume database persisten.
- `DEPLOYMENT.md` — setup server, storage, keamanan, dan domain.
- `assets/` — ilustrasi lokal untuk hero, galeri, dan ikon.
- `files/` — dokumen PDF sumber penelitian.
- `CNAME` — domain khusus GitHub Pages.
- `.github/workflows/pages.yml` — build dan deploy otomatis ke GitHub Pages.
