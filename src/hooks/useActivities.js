// ─── Activities Helpers (Supabase) ────────────────────────────────────────────
import { supabase } from "../lib/supabase";

export async function fetchActivities() {
  if (!supabase) return null;
  const { data, error } = await supabase.from("activities").select("name, is_default").order("created_at");
  if (error) throw error;
  return (data || []).map(r => r.name);
}

export async function addActivity(name) {
  if (!supabase) return;
  const { error } = await supabase.from("activities").insert({ name, is_default: false });
  if (error) throw error;
}

export async function deleteActivity(name) {
  if (!supabase) return;
  const { error } = await supabase.from("activities").delete().eq("name", name).eq("is_default", false);
  if (error) throw error;
}
