import { CHILDREN, COLORS, ACT_COLORS, ALL_DAYS, WEEKDAYS, WEEKEND } from "../constants";
import ChildAvatar from "./ChildAvatar";

export default function PrintPreview({ schedule, notes, activities, showWeekend, weekRange, dayDates, onClose }) {
  const days = showWeekend ? ALL_DAYS : WEEKDAYS;

  const thS = {
    padding: "7px 8px", textAlign: "left",
    fontFamily: "'Nunito', sans-serif", fontWeight: 700,
    fontSize: 10, color: "#555", borderBottom: "2px solid #E8E8E8",
    whiteSpace: "nowrap",
  };
  const tdS = {
    padding: "7px 8px", fontFamily: "'Nunito', sans-serif",
    fontSize: 10, borderBottom: "1px solid #F0F0F0", verticalAlign: "top",
  };

  return (
    <div
      style={{
        position: "fixed", inset: 0, background: "rgba(0,0,0,0.65)",
        zIndex: 1000, display: "flex", alignItems: "flex-start",
        justifyContent: "center", padding: "16px 8px 24px", overflowY: "auto",
      }}
    >
      <div style={{ background: "#fff", borderRadius: 20, width: "100%", maxWidth: 820, padding: 24 }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div>
            <div style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 900, fontSize: 24, color: "#1a1a2e" }}>
              🦸 MARVEL
            </div>
            <div style={{ fontFamily: "'Nunito', sans-serif", fontSize: 12, color: "#888", marginTop: 2 }}>
              Jadwal Mingguan • {weekRange.start} — {weekRange.end}
              {showWeekend ? " • Senin–Minggu" : " • Senin–Jumat"}
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={() => window.print()}
              style={{ padding: "8px 16px", borderRadius: 10, border: "none", background: "#1a1a2e", color: "#fff", fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: 13, cursor: "pointer" }}
            >
              🖨️ Print
            </button>
            <button
              onClick={onClose}
              style={{ padding: "8px 16px", borderRadius: 10, border: "1px solid #E0E0E0", background: "#fff", color: "#555", fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: 13, cursor: "pointer" }}
            >
              ✕ Tutup
            </button>
          </div>
        </div>

        {/* Tables per day */}
        {days.map((day) => {
          const isWknd = WEEKEND.includes(day);
          return (
            <div key={day} style={{ marginBottom: 16 }}>
              <div
                style={{
                  fontFamily: "'Nunito', sans-serif", fontWeight: 900, fontSize: 13,
                  color: "#fff", background: isWknd ? "#37474F" : "#1a1a2e",
                  padding: "7px 14px", borderRadius: "10px 10px 0 0",
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                }}
              >
                <span>{isWknd ? "🌙" : "☀️"} {day}</span>
                <span style={{ fontWeight: 600, fontSize: 11, opacity: 0.8 }}>{dayDates[day]} 2026</span>
              </div>
              <table style={{ width: "100%", borderCollapse: "collapse", border: "1px solid #EBEBEB", borderTop: "none" }}>
                <thead>
                  <tr style={{ background: "#F8F8F8" }}>
                    <th style={{ ...thS, width: "14%" }}>Anak</th>
                    {activities.map((a) => <th key={a} style={thS}>{a}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {CHILDREN.map((child, i) => {
                    const cc   = COLORS[child];
                    const acts = schedule[day]?.[child] || {};
                    return (
                      <tr key={child} style={{ background: i % 2 === 0 ? "#fff" : "#FAFAFA" }}>
                        <td style={{ ...tdS, fontWeight: 800, color: cc.accent }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                            <ChildAvatar name={child} size={18} />
                            {child}
                          </div>
                        </td>
                        {activities.map((a) => (
                          <td key={a} style={{ ...tdS, color: acts[a] ? ACT_COLORS[a] : "#DDD", fontWeight: acts[a] ? 700 : 400 }}>
                            {acts[a] || "—"}
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          );
        })}

        {/* Notes */}
        <div style={{ marginTop: 20, borderTop: "2px solid #EBEBEB", paddingTop: 16 }}>
          <div style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 900, fontSize: 14, color: "#333", marginBottom: 12 }}>
            📝 Catatan Anak
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {CHILDREN.map((child) => {
              const cc = COLORS[child];
              return (
                <div key={child} style={{ borderRadius: 10, background: cc.bg, border: `1px solid ${cc.accent}25`, padding: "10px 13px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 5 }}>
                    <ChildAvatar name={child} size={20} />
                    <span style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 12, color: cc.accent }}>{child}</span>
                  </div>
                  <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: 11, color: "#555", margin: 0, lineHeight: 1.5, fontWeight: 600 }}>
                    {notes[child] || "—"}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
