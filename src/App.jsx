import { useState, useEffect } from "react";
import { CHILDREN, COLORS, initialWeekSchedules, initialNotes, INITIAL_ACTIVITIES } from "./constants";
//import { getWeekRange, getWeekDates } from "./utils/weekHelpers";
import { getWeekRange, getWeekDates, BASE_DATE, getCurrentMonday } from "./utils/weekHelpers"; //added 26 Mar 2026
import { EMPTY_WEEK } from "./constants";
import { supabase } from "./lib/supabase";

import WeeklyView   from "./components/WeeklyView";
import ChildView    from "./components/ChildView";
import PrintPreview from "./components/PrintPreview";
import AdminPanel   from "./components/admin/AdminPanel";

const TABS = [
  { id: "weekly", label: "Mingguan", icon: "📅" },
  { id: "child",  label: "Per Anak", icon: "👶" },
  { id: "admin",  label: "Admin",    icon: "⚙️" },
];

function rowsToSchedule(rows) {
  return (rows || []).reduce((acc, row) => {
    if (!acc[row.day_name])                         acc[row.day_name] = {};
    if (!acc[row.day_name][row.child_name])         acc[row.day_name][row.child_name] = {};
    acc[row.day_name][row.child_name][row.activity] = row.time_range;
    return acc;
  }, {});
}

export default function App() {
  const [weekSchedules, setWeekSchedules] = useState(initialWeekSchedules);
  //const [weekIndex,     setWeekIndex]     = useState(0);
  const initialWeekIndex = Math.round((getCurrentMonday() - BASE_DATE) / (7 * 24 * 60 * 60 * 1000));//added 22 Mar 2026, change 23 Mar 2026
  const [weekIndex, setWeekIndex] = useState(initialWeekIndex); //added 22 Mar 2026
  const [notes,         setNotes]         = useState(initialNotes);
  const [activities,    setActivities]    = useState(INITIAL_ACTIVITIES);
  const [showWeekend,   setShowWeekend]   = useState(false);
  const [view,          setView]          = useState("weekly");
  const [selChild,      setSelChild]      = useState("Aaron");
  const [showPrint,     setShowPrint]     = useState(false);
  const [dbStatus,      setDbStatus]      = useState(supabase ? "loading" : "offline");

  useEffect(() => {
    if (!supabase) { setDbStatus("offline"); return; }

    async function loadAll() {
      setDbStatus("loading");
      try {
        const { data: scheduleRows, error: e1 } = await supabase
          .from("week_schedules").select("*").order("week_index");
        if (e1) throw new Error("load jadwal: " + e1.message);

        if (scheduleRows && scheduleRows.length > 0) {
          const byWeek = scheduleRows.reduce((acc, row) => {
            if (!acc[row.week_index]) acc[row.week_index] = [];
            acc[row.week_index].push(row);
            return acc;
          }, {});
          const weekMap = {};
          Object.entries(byWeek).forEach(([wi, rows]) => {
            weekMap[parseInt(wi)] = rowsToSchedule(rows);
          });
          if (!weekMap[0]) weekMap[0] = EMPTY_WEEK;
          setWeekSchedules(weekMap);
        }

        const { data: noteRows, error: e2 } = await supabase
          .from("child_notes").select("child_name, note");
        if (e2) throw new Error("load catatan: " + e2.message);
        if (noteRows && noteRows.length > 0) {
          setNotes(prev => ({
            ...prev,
            ...noteRows.reduce((acc, r) => { acc[r.child_name] = r.note; return acc; }, {}),
          }));
        }

        const { data: actRows, error: e3 } = await supabase
          .from("activities").select("name").order("created_at");
        if (e3) throw new Error("load aktivitas: " + e3.message);
        if (actRows && actRows.length > 0) {
          setActivities(actRows.map(r => r.name));
        }

        setDbStatus("ok");
        console.log("✅ Supabase terhubung, semua data dimuat.");
      } catch (err) {
        console.error("❌ Supabase error:", err.message);
        setDbStatus("error");
      }
    }
    loadAll();
  }, []);

  const weekRange  = getWeekRange(weekIndex);
  const dayDates   = getWeekDates(weekIndex);
  const totalWeeks = Object.keys(weekSchedules).length;
  const schedule   = weekSchedules[weekIndex] || EMPTY_WEEK;

  // ── Simpan jadwal → update state + upsert ke Supabase ─────────────────────
  const saveScheduleEntry = async ({ day, child, activity, timeRange }) => {
    setWeekSchedules(prev => {
      const cur = prev[weekIndex] || EMPTY_WEEK;
      return {
        ...prev,
        [weekIndex]: {
          ...cur,
          [day]: {
            ...(cur[day] || {}),
            [child]: { ...(cur[day]?.[child] || {}), [activity]: timeRange },
          },
        },
      };
    });

    if (!supabase) {
      console.warn("⚠️ Supabase null — aktifkan src/lib/supabase.js untuk menyimpan ke DB.");
      return;
    }
    const { error } = await supabase.from("week_schedules").upsert(
      { week_index: weekIndex, day_name: day, child_name: child,
        activity, time_range: timeRange, updated_at: new Date().toISOString() },
      { onConflict: "week_index,day_name,child_name,activity" }
    );
    if (error) console.error("❌ Gagal simpan:", error.message);
    else console.log(`✅ Tersimpan: ${child} ${day} ${activity}`);
  };

  // ── Hapus jadwal → update state + delete dari Supabase ────────────────────
  const deleteScheduleEntry = async ({ day, child, activity }) => {
    setWeekSchedules(prev => {
      const cur = prev[weekIndex] || EMPTY_WEEK;
      const childSched = { ...(cur[day]?.[child] || {}) };
      delete childSched[activity];
      return {
        ...prev,
        [weekIndex]: { ...cur, [day]: { ...(cur[day] || {}), [child]: childSched } },
      };
    });

    if (!supabase) return;
    const { error } = await supabase.from("week_schedules").delete()
      .eq("week_index", weekIndex).eq("day_name", day)
      .eq("child_name", child).eq("activity", activity);
    if (error) console.error("❌ Gagal hapus:", error.message);
    else console.log(`✅ Dihapus: ${child} ${day} ${activity}`);
  };

  // ── Simpan catatan ─────────────────────────────────────────────────────────
  const saveNote = async (childName, note) => {
    setNotes(prev => ({ ...prev, [childName]: note }));
    if (!supabase) return;
    const { error } = await supabase.from("child_notes").upsert(
      { child_name: childName, note, updated_at: new Date().toISOString() },
      { onConflict: "child_name" }
    );
    if (error) console.error("❌ Gagal simpan catatan:", error.message);
    else console.log("✅ Catatan disimpan:", childName);
  };

  // ── Aktivitas ──────────────────────────────────────────────────────────────
  const saveActivity = async (name) => {
    setActivities(prev => [...prev, name]);
    if (!supabase) return;
    const { error } = await supabase.from("activities").insert({ name, is_default: false });
    if (error) console.error("❌ Gagal simpan aktivitas:", error.message);
  };

  const removeActivity = async (name) => {
    setActivities(prev => prev.filter(a => a !== name));
    if (!supabase) return;
    const { error } = await supabase.from("activities").delete()
      .eq("name", name).eq("is_default", false);
    if (error) console.error("❌ Gagal hapus aktivitas:", error.message);
  };

  const addWeek = (newIdx) => {
    setWeekSchedules(prev => ({ ...prev, [newIdx]: EMPTY_WEEK }));
    setWeekIndex(newIdx);
  };

  const weekProps = { weekRange, dayDates, weekIndex, setWeekIndex, totalWeeks };

  const ST = {
    offline: { label: "📴 Mode Lokal", bg: "rgba(255,255,255,0.08)", color: "#ffffff50", border: "rgba(255,255,255,0.1)" },
    loading: { label: "⏳ Memuat...",  bg: "rgba(255,193,7,0.2)",   color: "#FFD54F",   border: "#FFD54F50" },
    ok:      { label: "🟢 Tersambung", bg: "rgba(76,175,80,0.2)",   color: "#A5D6A7",   border: "#A5D6A750" },
    error:   { label: "🔴 DB Error",   bg: "rgba(244,67,54,0.2)",   color: "#EF9A9A",   border: "#EF9A9A50" },
  };
  const st = ST[dbStatus];

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap" rel="stylesheet" />
      <div style={{ maxWidth: 430, margin: "0 auto", minHeight: "100vh", background: "#F4F5FB", fontFamily: "'Nunito', sans-serif" }}>

        {/* Header */}
        <div style={{ background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 55%, #0f3460 100%)", padding: "18px 18px 22px", position: "sticky", top: 0, zIndex: 100 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={{ fontWeight: 900, fontSize: 24, color: "#fff", letterSpacing: -0.5, lineHeight: 1 }}>🦸 MARVEL</div>
              <div style={{ fontSize: 9, color: "#ffffff65", marginTop: 3, letterSpacing: 1.2, fontWeight: 700 }}>MANAJEMEN AKTIVITAS RENCANA VALIDASI JADWAL</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ fontSize: 9, fontWeight: 700, fontFamily: "'Nunito', sans-serif", background: st.bg, color: st.color, border: `1px solid ${st.border}`, borderRadius: 6, padding: "3px 8px" }}>
                {st.label}
              </div>
              <button onClick={() => setShowPrint(true)} style={{ background: "rgba(255,255,255,0.14)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 10, padding: "7px 12px", color: "#fff", fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: 12, cursor: "pointer" }}>
                🖨️ Print
              </button>
            </div>
          </div>

          {/* DB Error banner */}
          {dbStatus === "error" && (
            <div style={{ marginTop: 10, padding: "8px 12px", borderRadius: 8, background: "rgba(244,67,54,0.15)", border: "1px solid rgba(244,67,54,0.3)", fontFamily: "'Nunito', sans-serif", fontSize: 10, color: "#EF9A9A", fontWeight: 600 }}>
              ⚠️ Gagal terhubung ke DB. Cek .env.local & koneksi internet. Tekan F12 → Console untuk detail.
            </div>
          )}

          {/* Week navigation */}
          <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 7 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <button onClick={() => setWeekIndex(i => Math.max(0, i - 1))} disabled={false}//edited 23 mar 2026
                style={{ background: weekIndex === 0 ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 7, width: 26, height: 26, cursor: weekIndex === 0 ? "not-allowed" : "pointer", color: weekIndex === 0 ? "rgba(255,255,255,0.3)" : "#fff", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>‹</button>
              <div style={{ display: "inline-flex", alignItems: "center", background: "rgba(255,255,255,0.10)", borderRadius: 9, padding: "4px 10px" }}>
                <span style={{ fontSize: 10, color: "#ffffffAA", fontWeight: 600 }}>📅 {weekRange.start} — {weekRange.end}</span>
              </div>
              <button onClick={() => setWeekIndex(i => i + 1)}
                style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 7, width: 26, height: 26, cursor: "pointer", color: "#fff", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>›</button>
            </div>
            {showWeekend && <div style={{ fontSize: 9, background: "#37474F", color: "#fff", borderRadius: 6, padding: "3px 8px", fontWeight: 700 }}>+ Wknd</div>}
          </div>

          {view === "child" && (
            <div style={{ display: "flex", gap: 5, marginTop: 12 }}>
              {["Aaron","Bellva","Belvin","Adriel"].map(ch => {
                const cc = COLORS[ch];
                return (
                  <button key={ch} onClick={() => setSelChild(ch)} style={{
                    flex: 1, padding: "6px 4px", borderRadius: 10,
                    border: `2px solid ${selChild === ch ? cc.accent : "transparent"}`,
                    background: selChild === ch ? cc.accent : "rgba(255,255,255,0.1)",
                    color: "#fff", fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 11, cursor: "pointer", transition: "all 0.2s",
                  }}>{ch}</button>
                );
              })}
            </div>
          )}
        </div>

        {/* Content */}
        <div style={{ padding: "14px 14px 88px" }}>
          {view === "weekly" && <WeeklyView schedule={schedule} notes={notes} showWeekend={showWeekend} {...weekProps} />}
          {view === "child"  && <ChildView  schedule={schedule} notes={notes} child={selChild} showWeekend={showWeekend} {...weekProps} />}
          {view === "admin"  && (
            <AdminPanel
              schedule={schedule}
              saveScheduleEntry={saveScheduleEntry}
              deleteScheduleEntry={deleteScheduleEntry}
              notes={notes} saveNote={saveNote}
              activities={activities} saveActivity={saveActivity} removeActivity={removeActivity}
              showWeekend={showWeekend} setShowWeekend={setShowWeekend}
              weekSchedules={weekSchedules} addWeek={addWeek}
              setWeekIndex={setWeekIndex}
              {...weekProps}
            />
          )}
        </div>

        {/* Bottom nav */}
        <div style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 430, background: "rgba(255,255,255,0.96)", backdropFilter: "blur(20px)", borderTop: "1px solid #E8E8E8", display: "flex", padding: "8px 0 18px", zIndex: 200 }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setView(t.id)} style={{ flex: 1, border: "none", background: "transparent", display: "flex", flexDirection: "column", alignItems: "center", gap: 3, cursor: "pointer", padding: "5px 0" }}>
              <span style={{ fontSize: 19 }}>{t.icon}</span>
              <span style={{ fontFamily: "'Nunito', sans-serif", fontWeight: view === t.id ? 900 : 600, fontSize: 10, color: view === t.id ? "#1a1a2e" : "#BBBBBB", transition: "all 0.2s" }}>{t.label}</span>
              {view === t.id && <div style={{ width: 22, height: 3, borderRadius: 2, background: "#1a1a2e" }} />}
            </button>
          ))}
        </div>

        {showPrint && (
          <PrintPreview schedule={schedule} notes={notes} activities={activities} showWeekend={showWeekend} weekRange={weekRange} dayDates={dayDates} onClose={() => setShowPrint(false)} />
        )}
      </div>
    </>
  );
}
