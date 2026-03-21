import { COLORS, ALL_DAYS, WEEKDAYS, WEEKEND } from "../constants";
import ChildAvatar from "./ChildAvatar";
import ActivityBadge from "./ActivityBadge";

export default function ChildView({
  schedule, notes, child, showWeekend, weekRange, dayDates,
}) {
  const c    = COLORS[child];
  const days = showWeekend ? ALL_DAYS : WEEKDAYS;

  return (
    <div>
      {/* Hero card */}
      <div
        style={{
          borderRadius: 20, padding: "18px 20px", marginBottom: 14,
          background: `linear-gradient(135deg, ${c.accent}, ${c.grad})`,
          color: "#fff", display: "flex", alignItems: "center", gap: 14,
          boxShadow: `0 6px 24px ${c.accent}40`,
        }}
      >
        <ChildAvatar name={child} size={52} />
        <div>
          <div style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 900, fontSize: 22 }}>{child}</div>
          <div style={{ fontFamily: "'Nunito', sans-serif", fontSize: 11, opacity: 0.85 }}>
            📅 {weekRange.start} — {weekRange.end}
          </div>
        </div>
      </div>

      {/* Day rows */}
      {days.map((day) => {
        const isWknd  = WEEKEND.includes(day);
        const acts    = schedule[day]?.[child] || {};
        const hasActs = Object.keys(acts).length > 0;
        return (
          <div
            key={day}
            style={{
              marginBottom: 10, borderRadius: 14, overflow: "hidden",
              border: `1px solid ${hasActs ? c.accent + "25" : "#EBEBEB"}`,
              background: "#fff", boxShadow: "0 1px 6px #00000008",
            }}
          >
            <div
              style={{
                padding: "8px 14px",
                background: hasActs ? c.light : isWknd ? "#ECEFF1" : "#F8F8F8",
                display: "flex", alignItems: "center", justifyContent: "space-between",
              }}
            >
              <span style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 13, color: hasActs ? c.accent : "#90A4AE" }}>
                {isWknd ? "🌙" : "☀️"} {day}
              </span>
              <span style={{ fontFamily: "'Nunito', sans-serif", fontSize: 10, fontWeight: 700, color: "#888", background: "rgba(0,0,0,0.06)", borderRadius: 6, padding: "2px 7px" }}>
                {dayDates[day]} 2026
              </span>
            </div>
            <div style={{ padding: "10px 14px" }}>
              {!hasActs ? (
                <span style={{ fontSize: 11, color: "#CCC", fontFamily: "'Nunito', sans-serif" }}>
                  {isWknd ? "🎉 Libur" : "Tidak ada jadwal"}
                </span>
              ) : (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                  {Object.entries(acts).map(([act, time]) => (
                    <ActivityBadge key={act} activity={act} time={time} />
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      })}

      {/* Notes */}
      <div style={{ borderRadius: 14, background: c.bg, border: `1px solid ${c.accent}20`, padding: "14px 16px", marginTop: 6 }}>
        <div style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 13, color: c.accent, marginBottom: 7 }}>
          📝 Catatan
        </div>
        <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: 13, color: "#555", lineHeight: 1.6, margin: 0, fontWeight: 600 }}>
          {notes[child] || <span style={{ color: "#CCC" }}>Belum ada catatan</span>}
        </p>
      </div>
    </div>
  );
}
