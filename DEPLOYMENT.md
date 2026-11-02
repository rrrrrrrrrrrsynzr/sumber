# Deployment Pradnyasiwi Quadtech

Aplikasi sekarang terdiri dari frontend React/Vite dan backend Node/Express dengan SQLite persisten. GitHub Pages hanya dapat menyajikan file statis sehingga **tidak dapat menjalankan API feedback**. Host aplikasi ini pada server Node.js/container dengan volume penyimpanan persisten, atau gunakan layanan hosting Node yang mendukung persistent disk. Domain `source.pradnyasiwi.web.id` dapat diarahkan ke server tersebut melalui DNS.

## Syarat

- Node.js 22.x
- Platform Linux x64/ARM64 yang didukung `better-sqlite3` (modul native akan di-build/install pada host)
- Reverse proxy TLS seperti Caddy/Nginx di production
- Volume persisten untuk file SQLite

## Setup dan menjalankan di server

1. Salin project ke server dan jalankan `npm ci`.
2. Salin `.env.example` menjadi `.env`; buat `ADMIN_USERNAME` dan `ADMIN_PASSWORD` yang kuat, lalu atur `FEEDBACK_DB_PATH` ke volume persistent di luar direktori rilis, misalnya `/var/lib/pradnyasiwi/feedback.sqlite`.
3. Build frontend dengan `npm run build`.
4. Jalankan `npm start` dengan `NODE_ENV=production`, `HOST=127.0.0.1`, `PORT=3000`, dan `TRUST_PROXY=true` hanya bila server berada di belakang reverse proxy yang Anda kendalikan.
5. Atur reverse proxy agar HTTPS untuk `source.pradnyasiwi.web.id` diteruskan ke port aplikasi. Gunakan Let's Encrypt atau sertifikat TLS dari host.
6. Arahkan DNS record A/AAAA atau CNAME `source` ke host. Jangan mengarahkan custom domain ini ke GitHub Pages jika API feedback harus berfungsi.
7. Siapkan proses supervisor (systemd, Docker Compose, PM2, atau layanan managed) agar aplikasi restart saat boot.

### Opsi Docker Compose

Salin `.env.example` sebagai `.env`, ganti nama pengguna dan kata sandi admin, lalu jalankan `docker compose up -d --build`. Container menerbitkan port `3000` hanya ke localhost dan menyimpan SQLite pada named volume `feedback_data`. Hubungkan Caddy/Nginx di host ke `127.0.0.1:3000` untuk TLS.

Contoh Environment:

```env
NODE_ENV=production
HOST=127.0.0.1
PORT=3000
FEEDBACK_DB_PATH=/var/lib/pradnyasiwi/feedback.sqlite
ADMIN_USERNAME=nama-admin
ADMIN_PASSWORD=ganti-dengan-kata-sandi-kuat
TRUST_PROXY=true
```

Jangan commit `.env` atau kirim kredensial admin di frontend. SQLite menyimpan data setelah proses restart selama volume database dipertahankan. Atur backup dan batas retensi secara berkala.

## Pengembangan lokal

- `npm run dev:full` menjalankan Vite dan API server bersamaan. Vite meneruskan `/api` ke `localhost:3000`.
- Buat `.env` dari `.env.example` sebelum memakai API.
- `npm run build && npm start` menjalankan build production lokal di port `3000`.

## Feedback dan panel internal

- Pengunjung mengirim masukan melalui `POST /api/feedback`; API memvalidasi kategori/rating/panjang pesan dan membatasi request.
- Panel hanya-baca ada di `https://source.pradnyasiwi.web.id/dev/feedback`. Halaman meminta nama pengguna/kata sandi, lalu browser memakai autentikasi Basic pada API admin. Tetapkan `ADMIN_USERNAME`/`ADMIN_PASSWORD` pada server. Server mewajibkan HTTPS di deployment karena kredensial admin hanya aman melalui TLS.
- Konten masukan tidak muncul di halaman publik. Endpoint daftar (`GET /api/admin/feedback`) mengembalikan 1000 item terakhir setelah autentikasi.

## GitHub Actions

Workflow `.github/workflows/pages.yml` hanya memvalidasi/build. Ia **tidak deploy ke GitHub Pages**. Hubungkan repository ke runner atau platform Node hosting pilihan Anda; simpan environment secrets di pengaturan host dan buat disk persisten.
