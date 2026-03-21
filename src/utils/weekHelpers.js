// ─── Week & Calendar Helpers ──────────────────────────────────────────────────

// Base Monday: 09 Mar 2026
export const BASE_DATE = new Date(2026, 2, 9);

export function getWeekStart(weekIndex) {
  const d = new Date(BASE_DATE);
  d.setDate(d.getDate() + weekIndex * 7);
  return d;
}

export function getWeekDates(weekIndex) {
  const start = getWeekStart(weekIndex);
  const DAYS_ID = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];
  const result = {};
  DAYS_ID.forEach((day, i) => {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    result[day] = d.toLocaleDateString("id-ID", { day: "2-digit", month: "short" });
  });
  return result;
}

export function getWeekRange(weekIndex) {
  const start = getWeekStart(weekIndex);
  const end   = new Date(start);
  end.setDate(end.getDate() + 6);
  const fmt = (d) =>
    d.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" });
  return { start: fmt(start), end: fmt(end) };
}

export function weekKey(weekIndex) {
  const d = getWeekStart(weekIndex);
  const weekNum = Math.ceil(
    (d.getDate() + (d.getDay() === 0 ? 6 : d.getDay() - 1)) / 7
  );
  return `${d.getFullYear()}-W${String(weekNum).padStart(2, "0")}`;
}
