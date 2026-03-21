// ─── Supabase Client ──────────────────────────────────────────────────────────
//
// FILE INI SUDAH DIKONFIGURASI UNTUK DUA MODE:
//
// MODE 1 — Tanpa Supabase (default, Fase 1)
//   App berjalan dengan local state. Tidak butuh install apapun.
//
// MODE 2 — Dengan Supabase (Fase 2)
//   Langkah:
//   1. Jalankan: npm install @supabase/supabase-js
//   2. Buat file .env.local di root folder, isi:
//        VITE_SUPABASE_URL=https://xxxx.supabase.co
//        VITE_SUPABASE_ANON_KEY=eyJ...
//   3. Ganti seluruh isi file ini dengan kode di bagian MODE 2 di bawah
//
// ─────────────────────────────────────────────────────────────────────────────
// MODE 1 — AKTIF SEKARANG (hapus/comment bagian ini saat pindah ke Mode 2)
// ─────────────────────────────────────────────────────────────────────────────
export const supabase = null;

// ─────────────────────────────────────────────────────────────────────────────
// MODE 2 — UNTUK FASE 2 (hapus kode Mode 1 di atas, lalu uncomment ini)
// ─────────────────────────────────────────────────────────────────────────────
// import { createClient } from "@supabase/supabase-js";
//
// const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
// const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
//
// if (!supabaseUrl || !supabaseKey) {
//   console.warn("⚠️ Supabase credentials tidak ditemukan di .env.local");
// }
//
// export const supabase = createClient(supabaseUrl, supabaseKey);
