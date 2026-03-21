// ─── Schedule Hook ────────────────────────────────────────────────────────────
// Saat ini menggunakan local state.
// Untuk koneksi Supabase: install @supabase/supabase-js,
// uncomment bagian supabase di src/lib/supabase.js,
// lalu gunakan fungsi-fungsi di bawah ini.

import { supabase } from "../lib/supabase";

// Transform flat DB rows → { day: { child: { activity: time } } }
export function rowsToSchedule(rows = []) {
  return rows.reduce((acc, row) => {
    if (!acc[row.day_name])                         acc[row.day_name] = {};
    if (!acc[row.day_name][row.child_name])         acc[row.day_name][row.child_name] = {};
    acc[row.day_name][row.child_name][row.activity] = row.time_range;
    return acc;
  }, {});
}

export async function fetchSchedule(weekIndex) {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("week_schedules")
    .select("*")
    .eq("week_index", weekIndex);
  if (error) throw error;
  return rowsToSchedule(data);
}

export async function upsertScheduleEntry({ weekIndex, day, child, activity, timeRange }) {
  if (!supabase) return;
  const { error } = await supabase.from("week_schedules").upsert(
    { week_index: weekIndex, day_name: day, child_name: child, activity, time_range: timeRange, updated_at: new Date().toISOString() },
    { onConflict: "week_index,day_name,child_name,activity" }
  );
  if (error) throw error;
}

export async function deleteScheduleEntry({ weekIndex, day, child, activity }) {
  if (!supabase) return;
  const { error } = await supabase
    .from("week_schedules")
    .delete()
    .eq("week_index", weekIndex)
    .eq("day_name",   day)
    .eq("child_name", child)
    .eq("activity",   activity);
  if (error) throw error;
}
