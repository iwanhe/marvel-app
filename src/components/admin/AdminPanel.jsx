import { useState } from "react";
import { COLORS } from "../../constants";
import AdminLogin from "./AdminLogin";
import TabJadwal from "./TabJadwal";
import TabCatatan from "./TabCatatan";
import TabAktivitas from "./TabAktivitas";
import TabTampilan from "./TabTampilan";

const ADMIN_TABS = [
  { id: "jadwal",    label: "Jadwal",    icon: "📅" },
  { id: "catatan",   label: "Catatan",   icon: "📝" },
  { id: "aktivitas", label: "Aktivitas", icon: "🏷️" },
  { id: "tampilan",  label: "Tampilan",  icon: "🎛️" },
];

export default function AdminPanel({
  schedule, setSchedule,
  notes, setNotes,
  activities, setActivities,
  showWeekend, setShowWeekend,
  weekRange, dayDates,
  weekIndex, setWeekIndex,
  weekSchedules, setWeekSchedules,
  totalWeeks,
}) {
  const [loggedIn,  setLoggedIn]  = useState(false);
  const [tab,       setTab]       = useState("jadwal");
  const [selDay,    setSelDay]    = useState("Senin");
  const [selChild,  setSelChild]  = useState("Aaron");
  const [editAct,   setEditAct]   = useState("");
  const [editTime,  setEditTime]  = useState("");
  const [editNote,  setEditNote]  = useState(notes["Aaron"] || "");
  const [msg,       setMsg]       = useState("");
  const [newActName, setNewActName] = useState("");
  const [actMsg,    setActMsg]    = useState("");

  if (!loggedIn) return <AdminLogin onLogin={() => setLoggedIn(true)} />;

  const flash    = (t) => { setMsg(t);    setTimeout(() => setMsg(""),    3000); };
  const flashAct = (t) => { setActMsg(t); setTimeout(() => setActMsg(""), 3000); };

  return (
    <div>
      {/* Panel header */}
      <div style={{ borderRadius: 18, padding: "14px 18px", marginBottom: 14, background: "linear-gradient(135deg, #1a1a2e, #16213e)", color: "#fff" }}>
        <div style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 900, fontSize: 17 }}>⚙️ Admin Panel</div>
        <div style={{ fontFamily: "'Nunito', sans-serif", fontSize: 11, opacity: 0.6, marginTop: 2 }}>
          📅 {weekRange.start} — {weekRange.end}
        </div>
      </div>

      {/* Sub-tabs (2×2 grid) */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", background: "#EBEBEB", borderRadius: 12, padding: 4, marginBottom: 16, gap: 2 }}>
        {ADMIN_TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              padding: "8px 6px", borderRadius: 9, border: "none",
              background: tab === t.id ? "#fff" : "transparent",
              fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 12,
              color: tab === t.id ? "#1a1a2e" : "#888", cursor: "pointer",
              boxShadow: tab === t.id ? "0 1px 6px #00000015" : "none",
              transition: "all 0.2s",
            }}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {tab === "jadwal" && (
        <TabJadwal
          schedule={schedule} setSchedule={setSchedule}
          activities={activities}
          showWeekend={showWeekend} dayDates={dayDates}
          selDay={selDay} setSelDay={setSelDay}
          selChild={selChild} setSelChild={setSelChild}
          editAct={editAct} setEditAct={setEditAct}
          editTime={editTime} setEditTime={setEditTime}
          setEditNote={setEditNote} notes={notes}
          flash={flash}
        />
      )}

      {tab === "catatan" && (
        <TabCatatan
          notes={notes} setNotes={setNotes}
          selChild={selChild} setSelChild={setSelChild}
          editNote={editNote} setEditNote={setEditNote}
          flash={flash}
        />
      )}

      {tab === "aktivitas" && (
        <TabAktivitas
          activities={activities} setActivities={setActivities}
          newActName={newActName} setNewActName={setNewActName}
          actMsg={actMsg} flashAct={flashAct}
        />
      )}

      {tab === "tampilan" && (
        <TabTampilan
          showWeekend={showWeekend} setShowWeekend={setShowWeekend}
          weekIndex={weekIndex} setWeekIndex={setWeekIndex}
          weekSchedules={weekSchedules} setWeekSchedules={setWeekSchedules}
          totalWeeks={totalWeeks} dayDates={dayDates}
        />
      )}

      {/* Flash message */}
      {msg && (
        <div
          style={{
            marginTop: 12, padding: "10px 14px", borderRadius: 10,
            fontFamily: "'Nunito', sans-serif", fontSize: 12, fontWeight: 700,
            background: msg.startsWith("⚠️") ? "#FFF3E0" : msg.startsWith("🗑️") ? "#FCE4EC" : "#E8F5E9",
            color:      msg.startsWith("⚠️") ? "#E65100" : msg.startsWith("🗑️") ? "#C62828" : "#2E7D32",
            border: `1px solid ${msg.startsWith("⚠️") ? "#FFE0B2" : msg.startsWith("🗑️") ? "#FFCDD2" : "#C8E6C9"}`,
          }}
        >
          {msg}
        </div>
      )}
    </div>
  );
}
