// ─── Settings Helpers (Supabase) ──────────────────────────────────────────────
import { supabase } from "../lib/supabase";

export async function fetchSettings() {
  if (!supabase) return null;
  const { data, error } = await supabase.from("app_settings").select("key, value");
  if (error) throw error;
  return (data || []).reduce((acc, r) => { acc[r.key] = r.value; return acc; }, {});
}

export async function updateSetting({ key, value }) {
  if (!supabase) return;
  const { error } = await supabase.from("app_settings").upsert({ key, value }, { onConflict: "key" });
  if (error) throw error;
}
