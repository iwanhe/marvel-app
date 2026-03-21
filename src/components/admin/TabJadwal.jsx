import { CHILDREN, COLORS, ALL_DAYS, WEEKDAYS, WEEKEND } from "../../constants";
import ChildAvatar from "../ChildAvatar";
import ActivityBadge from "../ActivityBadge";

export default function TabJadwal({
  schedule, saveScheduleEntry, deleteScheduleEntry, activities,
  showWeekend, dayDates,
  selDay, setSelDay, selChild, setSelChild,
  editAct, setEditAct, editTime, setEditTime,
  setEditNote, notes, flash,
}) {
  const c    = COLORS[selChild];
  const acts = schedule[selDay]?.[selChild] || {};

  const inp = {
    width: "100%", padding: "10px 12px", borderRadius: 10, border: "1px solid #E0E0E0",
    fontFamily: "'Nunito', sans-serif", fontSize: 13, background: "#FAFAFA",
    boxSizing: "border-box", outline: "none",
  };

  const handleAdd = () => {
    if (!editAct || !editTime) { flash("⚠️ Pilih aktivitas dan isi waktu!"); return; }
    // Panggil saveScheduleEntry dari App.jsx — ini yang menyimpan ke Supabase
    saveScheduleEntry({ day: selDay, child: selChild, activity: editAct, timeRange: editTime });
    flash(`✅ ${editAct} ditambahkan untuk ${selChild} — ${selDay}`);
    setEditAct(""); setEditTime("");
  };

  const handleDelete = (act) => {
    // Panggil deleteScheduleEntry dari App.jsx — ini yang menghapus dari Supabase
    deleteScheduleEntry({ day: selDay, child: selChild, activity: act });
    flash(`🗑️ ${act} dihapus`);
  };

  return (
    <>
      {/* Day selector */}
      <div style={{ marginBottom: 12 }}>
        <div style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 11, color: "#AAA", marginBottom: 6, letterSpacing: 0.5 }}>PILIH HARI</div>
        <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
          {(showWeekend ? ALL_DAYS : WEEKDAYS).map((d) => {
            const iw = WEEKEND.includes(d);
            return (
              <button key={d} onClick={() => setSelDay(d)} style={{
                padding: "5px 9px", borderRadius: 9, border: "none", cursor: "pointer",
                fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: 11,
                background: selDay === d ? (iw ? "#37474F" : "#1a1a2e") : "#F0F0F0",
                color: selDay === d ? "#fff" : "#666", transition: "all 0.2s",
              }}>
                {d} <span style={{ fontSize: 9, opacity: 0.7 }}>{dayDates[d]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Child selector */}
      <div style={{ marginBottom: 14 }}>
        <div style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 11, color: "#AAA", marginBottom: 6 }}>PILIH ANAK</div>
        <div style={{ display: "flex", gap: 6 }}>
          {CHILDREN.map((ch) => {
            const cc = COLORS[ch];
            return (
              <button key={ch} onClick={() => { setSelChild(ch); setEditNote(notes[ch] || ""); }} style={{
                flex: 1, padding: "8px 4px", borderRadius: 12,
                border: `2px solid ${selChild === ch ? cc.accent : "#EEE"}`,
                cursor: "pointer", fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 11,
                background: selChild === ch ? cc.bg : "#FAFAFA", color: cc.accent,
                display: "flex", flexDirection: "column", alignItems: "center", gap: 4, transition: "all 0.2s",
              }}>
                <ChildAvatar name={ch} size={26} />{ch}
              </button>
            );
          })}
        </div>
      </div>

      {/* Current schedule */}
      <div style={{ borderRadius: 14, border: `1px solid ${c.accent}20`, background: c.bg, padding: 13, marginBottom: 12 }}>
        <div style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 12, color: c.accent, marginBottom: 8 }}>
          {selChild} — {selDay}, {dayDates[selDay]} 2026
        </div>
        {Object.keys(acts).length === 0 ? (
          <div style={{ fontFamily: "'Nunito', sans-serif", fontSize: 11, color: "#BBB" }}>Belum ada jadwal</div>
        ) : (
          Object.entries(acts).map(([act, time]) => (
            <div key={act} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "6px 10px", borderRadius: 9, background: "#fff", marginBottom: 5, boxShadow: "0 1px 4px #00000009" }}>
              <ActivityBadge activity={act} time={time} />
              <button onClick={() => handleDelete(act)} style={{ border: "none", background: "#FFEBEE", color: "#E53935", borderRadius: 7, padding: "3px 9px", cursor: "pointer", fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: 11 }}>
                Hapus
              </button>
            </div>
          ))
        )}
      </div>

      {/* Add form */}
      <div style={{ borderRadius: 14, border: "1px solid #EBEBEB", background: "#fff", padding: 14 }}>
        <div style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 13, color: "#333", marginBottom: 10 }}>➕ Tambah Jadwal</div>
        <select value={editAct} onChange={(e) => setEditAct(e.target.value)} style={{ ...inp, marginBottom: 8, color: editAct ? "#333" : "#AAA" }}>
          <option value="">Pilih Aktivitas...</option>
          {activities.map((a) => <option key={a} value={a}>{a}</option>)}
        </select>
        <input
          type="text" placeholder="Waktu (contoh: 16.00-17.00)"
          value={editTime} onChange={(e) => setEditTime(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          style={{ ...inp, marginBottom: 10 }}
        />
        <button onClick={handleAdd} style={{ width: "100%", padding: "12px", borderRadius: 12, border: "none", background: "linear-gradient(135deg, #1a1a2e, #0f3460)", color: "#fff", fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 14, cursor: "pointer" }}>
          Simpan Jadwal
        </button>
      </div>
    </>
  );
}
