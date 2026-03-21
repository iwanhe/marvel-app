import { INITIAL_ACTIVITIES, ACT_COLORS } from "../../constants";

export default function TabAktivitas({
  activities, saveActivity, removeActivity,
  newActName, setNewActName,
  actMsg, flashAct,
}) {
  const handleAdd = () => {
    const trimmed = newActName.trim();
    if (!trimmed) { flashAct("⚠️ Nama aktivitas tidak boleh kosong!"); return; }
    if (activities.includes(trimmed)) { flashAct("⚠️ Aktivitas sudah ada!"); return; }
    // saveActivity dari App.jsx — update state + simpan ke Supabase
    saveActivity(trimmed);
    flashAct("✅ Aktivitas berhasil ditambahkan!");
    setNewActName("");
  };

  const handleDelete = (act) => {
    if (INITIAL_ACTIVITIES.includes(act)) {
      flashAct("⚠️ Aktivitas default tidak bisa dihapus!"); return;
    }
    // removeActivity dari App.jsx — update state + hapus dari Supabase
    removeActivity(act);
    flashAct("🗑️ Aktivitas dihapus!");
  };

  return (
    <>
      {/* List */}
      <div style={{ borderRadius: 14, background: "#fff", border: "1px solid #EBEBEB", padding: 14, marginBottom: 12 }}>
        <div style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 13, color: "#333", marginBottom: 10 }}>
          🏷️ Master Data Aktivitas
          <span style={{ marginLeft: 8, fontFamily: "'Nunito', sans-serif", fontSize: 11, fontWeight: 700, background: "#1a1a2e", color: "#fff", borderRadius: 6, padding: "2px 8px" }}>
            {activities.length} aktivitas
          </span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
          {activities.map((act) => {
            const color     = ACT_COLORS[act] || "#555";
            const isDefault = INITIAL_ACTIVITIES.includes(act);
            return (
              <div key={act} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "9px 12px", borderRadius: 10, background: color + "10", border: `1px solid ${color}25` }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: color, flexShrink: 0 }} />
                  <span style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: 13, color }}>{act}</span>
                  {isDefault && <span style={{ fontFamily: "'Nunito', sans-serif", fontSize: 9, fontWeight: 800, background: color + "20", color, borderRadius: 4, padding: "1px 6px" }}>DEFAULT</span>}
                </div>
                <button onClick={() => handleDelete(act)} style={{ border: "none", background: isDefault ? "#F5F5F5" : "#FFEBEE", color: isDefault ? "#CCC" : "#E53935", borderRadius: 7, padding: "3px 9px", cursor: isDefault ? "not-allowed" : "pointer", fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: 11 }}>
                  {isDefault ? "🔒" : "Hapus"}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add form */}
      <div style={{ borderRadius: 14, background: "#fff", border: "1px solid #EBEBEB", padding: 14 }}>
        <div style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 13, color: "#333", marginBottom: 10 }}>➕ Tambah Aktivitas Baru</div>
        <div style={{ marginBottom: 10 }}>
          <div style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 11, color: "#AAA", marginBottom: 6, letterSpacing: 0.5 }}>NAMA AKTIVITAS</div>
          <input
            type="text" placeholder="Contoh: Les Matematika, Renang..."
            value={newActName} onChange={(e) => setNewActName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            style={{ width: "100%", padding: "10px 12px", borderRadius: 10, border: "1px solid #E0E0E0", fontFamily: "'Nunito', sans-serif", fontSize: 13, background: "#FAFAFA", boxSizing: "border-box", outline: "none" }}
          />
        </div>

        {newActName.trim() && (
          <div style={{ marginBottom: 10, padding: "8px 12px", borderRadius: 10, background: "#F8F8F8", border: "1px solid #EBEBEB" }}>
            <div style={{ fontFamily: "'Nunito', sans-serif", fontSize: 11, color: "#AAA", marginBottom: 6, fontWeight: 700 }}>PREVIEW BADGE</div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 4, background: "#55555518", border: "1px solid #55555535", borderRadius: 7, padding: "4px 9px" }}>
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#555" }} />
              <span style={{ fontSize: 11, fontWeight: 700, color: "#555", fontFamily: "'Nunito', sans-serif" }}>{newActName.trim()}</span>
            </div>
          </div>
        )}

        <button onClick={handleAdd} style={{ width: "100%", padding: "12px", borderRadius: 12, border: "none", background: "linear-gradient(135deg, #1a1a2e, #0f3460)", color: "#fff", fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 14, cursor: "pointer" }}>
          Tambah Aktivitas
        </button>

        {actMsg && (
          <div style={{
            marginTop: 10, padding: "10px 14px", borderRadius: 10,
            fontFamily: "'Nunito', sans-serif", fontSize: 12, fontWeight: 700,
            background: actMsg.startsWith("⚠️") ? "#FFF3E0" : actMsg.startsWith("🗑️") ? "#FCE4EC" : "#E8F5E9",
            color:      actMsg.startsWith("⚠️") ? "#E65100" : actMsg.startsWith("🗑️") ? "#C62828" : "#2E7D32",
            border: `1px solid ${actMsg.startsWith("⚠️") ? "#FFE0B2" : actMsg.startsWith("🗑️") ? "#FFCDD2" : "#C8E6C9"}`,
          }}>{actMsg}</div>
        )}
      </div>
    </>
  );
}
