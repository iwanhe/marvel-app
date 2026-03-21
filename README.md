# 🦸 MARVEL
**Manajemen Aktivitas Rencana Validasi Jadwal**

Aplikasi penjadwalan mingguan untuk Aaron, Bellva, Belvin, dan Adriel.

---

## Quick Start (Tanpa Supabase)

```bash
# 1. Install & jalankan — hanya butuh React!
npm install
npm run dev
```

App langsung berjalan dengan data lokal (state). Tidak perlu konfigurasi apapun.

---

## Menghubungkan ke Supabase (Opsional)

```bash
# 1. Install Supabase client
npm install @supabase/supabase-js

# 2. Buat file .env.local
cp .env.example .env.local
# Isi dengan credentials dari Supabase dashboard

# 3. Uncomment kode di src/lib/supabase.js
```

Lihat **MARVEL-Panduan-Implementasi.docx** untuk langkah lengkap setup database.

---

## Tech Stack

| Layer       | Library              | Versi  |
|-------------|----------------------|--------|
| Framework   | React                | 18.x   |
| Bundler     | Vite                 | 5.x    |
| Backend*    | Supabase             | 2.x    |
| Hosting     | Netlify              | —      |

*Supabase opsional — app berjalan penuh dengan local state

---

## Struktur Folder

```
src/
├── components/
│   ├── admin/
│   │   ├── AdminLogin.jsx      ← Form login
│   │   ├── AdminPanel.jsx      ← Container admin (4 tab)
│   │   ├── TabJadwal.jsx       ← Tambah/hapus jadwal
│   │   ├── TabCatatan.jsx      ← Edit catatan anak
│   │   ├── TabAktivitas.jsx    ← Master data aktivitas
│   │   └── TabTampilan.jsx     ← Toggle weekend + kelola minggu
│   ├── ActivityBadge.jsx       ← Badge warna per aktivitas
│   ├── ChildAvatar.jsx         ← Avatar per anak
│   ├── ChildView.jsx           ← Jadwal per anak
│   ├── PrintPreview.jsx        ← Modal print jadwal
│   ├── Toggle.jsx              ← Switch on/off
│   └── WeeklyView.jsx          ← Jadwal mingguan semua anak
├── constants/index.js          ← Data, warna, seed awal
├── utils/weekHelpers.js        ← Kalender dinamis
├── hooks/                      ← Helper async Supabase (opsional)
├── lib/supabase.js             ← Supabase client (stub by default)
├── App.jsx                     ← Root component
└── main.jsx                    ← Entry point
```

---

## Admin Panel

- Buka tab **⚙️ Admin** di aplikasi
- Default login: `marvel` / `marvel2026`
- Untuk produksi: ganti dengan Supabase Auth
