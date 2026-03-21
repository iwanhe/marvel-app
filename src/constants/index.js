// ─── App Constants ────────────────────────────────────────────────────────────

export const CHILDREN = ["Aaron", "Bellva", "Belvin", "Adriel"];

export const INITIAL_ACTIVITIES = [
  "Sekolah", "Rockstar", "Kumon", "Les Inggris", "Les Mandarin", "Les Piano",
];

export const ALL_DAYS   = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];
export const WEEKDAYS   = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat"];
export const WEEKEND    = ["Sabtu", "Minggu"];

export const COLORS = {
  Aaron:  { bg: "#FFF0E6", accent: "#FF6B35", light: "#FFE4D0", grad: "#FF8C5A" },
  Bellva: { bg: "#FFF0F6", accent: "#E91E8C", light: "#FCE4F0", grad: "#F06292" },
  Belvin: { bg: "#F0FFF4", accent: "#2E7D32", light: "#C8E6C9", grad: "#43A047" },
  Adriel: { bg: "#FDF0FF", accent: "#9C27B0", light: "#E1BEE7", grad: "#AB47BC" },
};

export const ACT_COLORS = {
  Sekolah:        "#1565C0",
  Rockstar:       "#C62828",
  Kumon:          "#E65100",
  "Les Inggris":  "#00695C",
  "Les Mandarin": "#6A1B9A",
  "Les Piano":    "#4E342E",
};

// Admin credentials — in production replace with Supabase Auth
export const ADMIN_CREDS = { user: "marvel", pass: "marvel2026" };

// Initial data seeds
export const initialSchedule = {
  Senin:  { Aaron: { Sekolah: "06.45-14.30", "Les Piano": "19.00-19.30" }, Bellva: { Sekolah: "10.40-14.40" }, Belvin: { Sekolah: "09.00-13.15" }, Adriel: { Sekolah: "10.15-12.45" } },
  Selasa: { Aaron: { Sekolah: "06.45-14.30", Kumon: "16.00-17.00" }, Bellva: { Sekolah: "06.45-14.00", Rockstar: "16.00" }, Belvin: { Sekolah: "09.00-13.15", Rockstar: "14.00" }, Adriel: { Sekolah: "10.15-12.45", Rockstar: "13.00-15.00" } },
  Rabu:   { Aaron: { Sekolah: "06.45-14.10" }, Bellva: { Sekolah: "10.40-14.40" }, Belvin: { Sekolah: "10.15-13.15" }, Adriel: { Sekolah: "09.00-12.45" } },
  Kamis:  { Aaron: { Sekolah: "06.45-13.10", "Les Mandarin": "17.00-18.00" }, Bellva: { Sekolah: "11.10-15.10", Rockstar: "16.00" }, Belvin: { Sekolah: "10.15-13.15", Rockstar: "14.00" }, Adriel: { Sekolah: "10.15-12.45", Rockstar: "13.00-15.00" } },
  Jumat:  { Aaron: { Sekolah: "06.45-13.10", Kumon: "16.00-17.00", "Les Mandarin": "14.00-15.00" }, Bellva: { Sekolah: "09.30-14.40", Rockstar: "16.00" }, Belvin: { Sekolah: "10.15-13.15", Rockstar: "14.00", "Les Inggris": "16.00" }, Adriel: { Sekolah: "09.00-12.45" } },
  Sabtu:  { Aaron: {}, Bellva: {}, Belvin: {}, Adriel: {} },
  Minggu: { Aaron: {}, Bellva: {}, Belvin: {}, Adriel: {} },
};

export const initialWeekSchedules = { 0: initialSchedule };

export const initialNotes = {
  Aaron:  "Bawa bekal & air minum. Sepatu olahraga setiap Rabu.",
  Bellva: "Jadwal Rockstar konfirmasi dulu ke Kak Rina.",
  Belvin: "Les Mandarin mulai bulan depan. Cek jadwal baru.",
  Adriel: "Antar jemput koordinasi dengan Pak Budi.",
};

export const EMPTY_WEEK = {
  Senin:  { Aaron: {}, Bellva: {}, Belvin: {}, Adriel: {} },
  Selasa: { Aaron: {}, Bellva: {}, Belvin: {}, Adriel: {} },
  Rabu:   { Aaron: {}, Bellva: {}, Belvin: {}, Adriel: {} },
  Kamis:  { Aaron: {}, Bellva: {}, Belvin: {}, Adriel: {} },
  Jumat:  { Aaron: {}, Bellva: {}, Belvin: {}, Adriel: {} },
  Sabtu:  { Aaron: {}, Bellva: {}, Belvin: {}, Adriel: {} },
  Minggu: { Aaron: {}, Bellva: {}, Belvin: {}, Adriel: {} },
};
