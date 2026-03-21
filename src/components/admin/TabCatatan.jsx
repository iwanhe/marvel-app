import { CHILDREN, COLORS } from "../../constants";
import ChildAvatar from "../ChildAvatar";

export default function TabCatatan({
  notes, setNotes,
  selChild, setSelChild,
  editNote, setEditNote,
  flash,
}) {
  const c = COLORS[selChild];

  const handleSave = () => {
    setNotes((prev) => ({ ...prev, [selChild]: editNote }));
    flash("✅ Catatan disimpan!");
  };

  return (
    <>
      {/* Child selector */}
      <div style={{ marginBottom: 14 }}>
        <div style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 11, color: "#AAA", marginBottom: 6 }}>PILIH ANAK</div>
        <div style={{ display: "flex", gap: 6 }}>
          {CHILDREN.map((ch) => {
            const cc = COLORS[ch];
            return (
              <button
                key={ch}
                onClick={() => { setSelChild(ch); setEditNote(notes[ch] || ""); }}
                style={{
                  flex: 1, padding: "8px 4px", borderRadius: 12,
                  border: `2px solid ${selChild === ch ? cc.accent : "#EEE"}`,
                  cursor: "pointer", fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 11,
                  background: selChild === ch ? cc.bg : "#FAFAFA", color: cc.accent,
                  display: "flex", flexDirection: "column", alignItems: "center", gap: 4, transition: "all 0.2s",
                }}
              >
                <ChildAvatar name={ch} size={26} />{ch}
              </button>
            );
          })}
        </div>
      </div>

      {/* Edit textarea */}
      <div style={{ borderRadius: 14, border: `1px solid ${c.accent}20`, background: c.bg, padding: 14 }}>
        <div style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 13, color: c.accent, marginBottom: 10 }}>
          📝 Catatan untuk {selChild}
        </div>
        <textarea
          value={editNote}
          onChange={(e) => setEditNote(e.target.value)}
          placeholder={`Tulis catatan penting untuk ${selChild}...`}
          rows={5}
          style={{
            width: "100%", padding: "12px", borderRadius: 10,
            border: `1px solid ${c.accent}30`, fontFamily: "'Nunito', sans-serif",
            fontSize: 13, lineHeight: 1.6, background: "#fff", color: "#333",
            resize: "vertical", boxSizing: "border-box", outline: "none",
          }}
        />
        <button
          onClick={handleSave}
          style={{
            width: "100%", marginTop: 10, padding: "12px", borderRadius: 12, border: "none",
            background: `linear-gradient(135deg, ${c.accent}, ${c.grad})`,
            color: "#fff", fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 14, cursor: "pointer",
          }}
        >
          Simpan Catatan
        </button>
      </div>

      {/* All notes preview */}
      <div style={{ marginTop: 16 }}>
        <div style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 11, color: "#AAA", marginBottom: 10, letterSpacing: 0.5 }}>
          SEMUA CATATAN
        </div>
        {CHILDREN.map((ch) => {
          const cc = COLORS[ch];
          return (
            <div
              key={ch}
              style={{ borderRadius: 12, background: cc.bg, border: `1px solid ${cc.accent}20`, padding: "10px 13px", marginBottom: 8 }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 5 }}>
                <ChildAvatar name={ch} size={20} />
                <span style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 12, color: cc.accent }}>{ch}</span>
              </div>
              <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: 11, color: "#666", margin: 0, lineHeight: 1.5, fontWeight: 600 }}>
                {notes[ch] || <span style={{ color: "#CCC" }}>Belum ada catatan</span>}
              </p>
            </div>
          );
        })}
      </div>
    </>
  );
}
