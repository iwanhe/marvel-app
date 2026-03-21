// ─── Notes Helpers (Supabase) ─────────────────────────────────────────────────
import { supabase } from "../lib/supabase";

export async function fetchNotes() {
  if (!supabase) return null;
  const { data, error } = await supabase.from("child_notes").select("child_name, note");
  if (error) throw error;
  return (data || []).reduce((acc, r) => { acc[r.child_name] = r.note; return acc; }, {});
}

export async function upsertNote({ childName, note }) {
  if (!supabase) return;
  const { error } = await supabase.from("child_notes").upsert(
    { child_name: childName, note, updated_at: new Date().toISOString() },
    { onConflict: "child_name" }
  );
  if (error) throw error;
}
