import { useState } from "react";
import { CHILDREN, COLORS, initialWeekSchedules, initialNotes, INITIAL_ACTIVITIES } from "./constants";
import { getWeekRange, getWeekDates } from "./utils/weekHelpers";
import { EMPTY_WEEK } from "./constants";

import WeeklyView   from "./components/WeeklyView";
import ChildView    from "./components/ChildView";
import PrintPreview from "./components/PrintPreview";
import AdminPanel   from "./components/admin/AdminPanel";

const TABS = [
  { id: "weekly", label: "Mingguan", icon: "📅" },
  { id: "child",  label: "Per Anak", icon: "👶" },
  { id: "admin",  label: "Admin",    icon: "⚙️" },
];

export default function App() {
  // ── State ──────────────────────────────────────────────────────────────────
  const [weekSchedules,  setWeekSchedules]  = useState(initialWeekSchedules);
  const [weekIndex,      setWeekIndex]      = useState(0);
  const [notes,          setNotes]          = useState(initialNotes);
  const [activities,     setActivities]     = useState(INITIAL_ACTIVITIES);
  const [showWeekend,    setShowWeekend]    = useState(false);
  const [view,           setView]           = useState("weekly");
  const [selChild,       setSelChild]       = useState("Aaron");
  const [showPrint,      setShowPrint]      = useState(false);

  // ── Derived ────────────────────────────────────────────────────────────────
  const weekRange  = getWeekRange(weekIndex);
  const dayDates   = getWeekDates(weekIndex);
  const totalWeeks = Object.keys(weekSchedules).length;

  const schedule = weekSchedules[weekIndex] || EMPTY_WEEK;

  const setSchedule = (updater) =>
    setWeekSchedules((prev) => ({
      ...prev,
      [weekIndex]:
        typeof updater === "function"
          ? updater(prev[weekIndex] || EMPTY_WEEK)
          : updater,
    }));

  // ── Shared props ───────────────────────────────────────────────────────────
  const weekProps = { weekRange, dayDates, weekIndex, setWeekIndex, totalWeeks };

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap"
        rel="stylesheet"
      />

      <div style={{ maxWidth: 430, margin: "0 auto", minHeight: "100vh", background: "#F4F5FB", fontFamily: "'Nunito', sans-serif" }}>

        {/* ── Header ── */}
        <div style={{ background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 55%, #0f3460 100%)", padding: "18px 18px 22px", position: "sticky", top: 0, zIndex: 100 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={{ fontWeight: 900, fontSize: 24, color: "#fff", letterSpacing: -0.5, lineHeight: 1 }}>
                🦸 MARVEL
              </div>
              <div style={{ fontSize: 9, color: "#ffffff65", marginTop: 3, letterSpacing: 1.2, fontWeight: 700 }}>
                MANAJEMEN AKTIVITAS RENCANA VALIDASI JADWAL
              </div>
            </div>
            <button
              onClick={() => setShowPrint(true)}
              style={{ background: "rgba(255,255,255,0.14)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 10, padding: "7px 12px", color: "#fff", fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: 12, cursor: "pointer" }}
            >
              🖨️ Print
            </button>
          </div>

          {/* Week navigation */}
          <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 7 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <button
                onClick={() => setWeekIndex((i) => Math.max(0, i - 1))}
                disabled={weekIndex === 0}
                style={{ background: weekIndex === 0 ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 7, width: 26, height: 26, cursor: weekIndex === 0 ? "not-allowed" : "pointer", color: weekIndex === 0 ? "rgba(255,255,255,0.3)" : "#fff", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}
              >
                ‹
              </button>
              <div style={{ display: "inline-flex", alignItems: "center", background: "rgba(255,255,255,0.10)", borderRadius: 9, padding: "4px 10px" }}>
                <span style={{ fontSize: 10, color: "#ffffffAA", fontWeight: 600 }}>
                  📅 {weekRange.start} — {weekRange.end}
                </span>
              </div>
              <button
                onClick={() => setWeekIndex((i) => i + 1)}
                style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 7, width: 26, height: 26, cursor: "pointer", color: "#fff", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}
              >
                ›
              </button>
            </div>
            {showWeekend && (
              <div style={{ fontSize: 9, background: "#37474F", color: "#fff", borderRadius: 6, padding: "3px 8px", fontWeight: 700 }}>
                + Wknd
              </div>
            )}
          </div>

          {/* Child filter pills (child view only) */}
          {view === "child" && (
            <div style={{ display: "flex", gap: 5, marginTop: 12 }}>
              {CHILDREN.map((ch) => {
                const cc = COLORS[ch];
                return (
                  <button
                    key={ch}
                    onClick={() => setSelChild(ch)}
                    style={{
                      flex: 1, padding: "6px 4px", borderRadius: 10,
                      border: `2px solid ${selChild === ch ? cc.accent : "transparent"}`,
                      background: selChild === ch ? cc.accent : "rgba(255,255,255,0.1)",
                      color: "#fff", fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 11,
                      cursor: "pointer", transition: "all 0.2s",
                    }}
                  >
                    {ch}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* ── Page Content ── */}
        <div style={{ padding: "14px 14px 88px" }}>
          {view === "weekly" && (
            <WeeklyView
              schedule={schedule}
              notes={notes}
              showWeekend={showWeekend}
              {...weekProps}
            />
          )}
          {view === "child" && (
            <ChildView
              schedule={schedule}
              notes={notes}
              child={selChild}
              showWeekend={showWeekend}
              {...weekProps}
            />
          )}
          {view === "admin" && (
            <AdminPanel
              schedule={schedule}       setSchedule={setSchedule}
              notes={notes}             setNotes={setNotes}
              activities={activities}   setActivities={setActivities}
              showWeekend={showWeekend} setShowWeekend={setShowWeekend}
              weekSchedules={weekSchedules} setWeekSchedules={setWeekSchedules}
              {...weekProps}
            />
          )}
        </div>

        {/* ── Bottom Navigation ── */}
        <div style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 430, background: "rgba(255,255,255,0.96)", backdropFilter: "blur(20px)", borderTop: "1px solid #E8E8E8", display: "flex", padding: "8px 0 18px", zIndex: 200 }}>
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setView(t.id)}
              style={{ flex: 1, border: "none", background: "transparent", display: "flex", flexDirection: "column", alignItems: "center", gap: 3, cursor: "pointer", padding: "5px 0" }}
            >
              <span style={{ fontSize: 19 }}>{t.icon}</span>
              <span style={{ fontFamily: "'Nunito', sans-serif", fontWeight: view === t.id ? 900 : 600, fontSize: 10, color: view === t.id ? "#1a1a2e" : "#BBBBBB", transition: "all 0.2s" }}>
                {t.label}
              </span>
              {view === t.id && (
                <div style={{ width: 22, height: 3, borderRadius: 2, background: "#1a1a2e" }} />
              )}
            </button>
          ))}
        </div>

        {/* ── Print Modal ── */}
        {showPrint && (
          <PrintPreview
            schedule={schedule}
            notes={notes}
            activities={activities}
            showWeekend={showWeekend}
            weekRange={weekRange}
            dayDates={dayDates}
            onClose={() => setShowPrint(false)}
          />
        )}
      </div>
    </>
  );
}
