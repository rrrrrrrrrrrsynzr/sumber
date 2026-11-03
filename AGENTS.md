# Petunjuk untuk AI Agent Berikutnya

## Konteks proyek
- Ini situs pameran STEM Pradnyasiwi Quadtech, SMPN 4 Pakem. Frontend memakai React dan Vite; backend feedback ada di `server/`.
- Gunakan bahasa Indonesia yang jelas dan ramah pengunjung. Jangan tampilkan instruksi developer seperti perintah terminal, nama framework, atau jargon teknis pada UI publik.
- Jangan mengubah klaim manfaat, spesifikasi, keselamatan, atau hasil pengujian alat tanpa data dari tim. Model dan ilustrasi saat ini masih konsep.

## Model 3D
- Komponen viewer ada di `src/DryerModel3D.jsx`; visual memakai Three.js, React Three Fiber, dan Drei (`Canvas`, `OrbitControls`, `ContactShadows`).
- Pola interaksi Canvas dan orbit controls diadaptasi dari `frontend/src/components/MachineOverview.tsx` pada repositori saudara `Web-Gokil`; geometri di sini dibuat sebagai konsep penjemur padi, bukan hasil pemindaian/CAD.
- Saat foto prototipe atau berkas CAD diberikan, gunakan itu sebagai acuan untuk memperbaiki proporsi, posisi komponen, bahan, dan detail. Tanyakan bila sudut atau bagian penting tidak terlihat; jangan mengarang detail teknis.
- Pertahankan drag untuk rotasi, zoom yang dibatasi, tombol atur ulang sudut, fallback jika WebGL tidak tersedia, serta dukungan layar sentuh. Hindari memulai rotasi otomatis.

## Branding dan keterbacaan
- Lambang sekolah yang disediakan berada di `files/Untitled design.png`; logo SVG untuk UI ada di `assets/pradnyasiwi.svg` dan favicon PNG menunjuk ke gambar sekolah tersebut.
- Prioritaskan teks yang cukup besar, kontras yang baik, tata letak responsif, dan gerakan yang menghormati `prefers-reduced-motion`.
- Layar pemuatan/pesan publik sebaiknya memberi konteks pengunjung atau fun fact, bukan istilah development.

## Validasi
- Jalankan `npm run build` setelah perubahan frontend.
- Periksa tampilan desktop dan mobile, pemuatan favicon/logo, kontrol 3D, serta fallback tanpa WebGL bila perubahan menyentuh area tersebut.
- Jangan memasukkan `dist/`, kredensial, file `.env`, atau database runtime ke commit.
