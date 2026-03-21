import { CHILDREN, COLORS, ALL_DAYS, WEEKDAYS, WEEKEND } from "../constants";
import ChildAvatar from "./ChildAvatar";
import ActivityBadge from "./ActivityBadge";

export default function WeeklyView({
  schedule, notes, showWeekend, weekRange, dayDates,
  weekIndex, setWeekIndex,
}) {
  const days = showWeekend ? ALL_DAYS : WEEKDAYS;

  return (
    <div>
      {/* Week navigator */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14, gap: 8 }}>
        <button
          onClick={() => setWeekIndex((i) => Math.max(0, i - 1))}
          disabled={weekIndex === 0}
          style={{
            border: "1px solid #E0E0E0",
            background: weekIndex === 0 ? "#F8F8F8" : "#fff",
            borderRadius: 9, width: 32, height: 32,
            cursor: weekIndex === 0 ? "not-allowed" : "pointer",
            color: weekIndex === 0 ? "#CCC" : "#333",
            fontSize: 16, flexShrink: 0,
          }}
        >
          ‹
        </button>
        <div
          style={{
            flex: 1, textAlign: "center", fontFamily: "'Nunito', sans-serif",
            fontSize: 11, fontWeight: 700, color: "#666", background: "#fff",
            borderRadius: 10, padding: "6px 10px", border: "1px solid #EBEBEB",
            boxShadow: "0 1px 4px #0000000A",
          }}
        >
          📅 {weekRange.start} — {weekRange.end}
          {showWeekend && (
            <span style={{ marginLeft: 6, fontSize: 10, background: "#ECEFF1", color: "#546E7A", borderRadius: 5, padding: "1px 6px", fontWeight: 700 }}>
              +Wknd
            </span>
          )}
        </div>
        <button
          onClick={() => setWeekIndex((i) => i + 1)}
          style={{
            border: "1px solid #E0E0E0", background: "#fff",
            borderRadius: 9, width: 32, height: 32, cursor: "pointer",
            color: "#333", fontSize: 16, flexShrink: 0,
          }}
        >
          ›
        </button>
      </div>

      {/* Day cards */}
      {days.map((day) => {
        const isWknd = WEEKEND.includes(day);
        return (
          <div
            key={day}
            style={{
              marginBottom: 14, borderRadius: 16, background: "#fff",
              boxShadow: "0 2px 12px #00000009", overflow: "hidden",
              border: isWknd ? "1px solid #CFD8DC" : "1px solid #EBEBEB",
            }}
          >
            {/* Day header */}
            <div
              style={{
                padding: "10px 16px",
                background: isWknd
                  ? "linear-gradient(135deg, #37474F, #546E7A)"
                  : "linear-gradient(135deg, #1a1a2e, #16213e)",
                color: "#fff", display: "flex", alignItems: "center", justifyContent: "space-between",
              }}
            >
              <span style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 14 }}>
                {isWknd ? "🌙" : "☀️"} {day}
              </span>
              <span
                style={{
                  fontFamily: "'Nunito', sans-serif", fontSize: 11,
                  background: "rgba(255,255,255,0.15)", borderRadius: 6,
                  padding: "2px 9px", fontWeight: 600,
                }}
              >
                {dayDates[day]} 2026
              </span>
            </div>

            {/* 2×2 children grid */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
              {CHILDREN.map((child, i) => {
                const acts   = schedule[day]?.[child] || {};
                const c      = COLORS[child];
                const hasActs = Object.keys(acts).length > 0;
                return (
                  <div
                    key={child}
                    style={{
                      padding: "10px 11px",
                      borderRight:  i % 2 === 0 ? "1px solid #F3F3F3" : "none",
                      borderBottom: i < 2       ? "1px solid #F3F3F3" : "none",
                      background: hasActs ? c.bg : "#FAFAFA",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 6 }}>
                      <ChildAvatar name={child} size={22} />
                      <span style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 11, color: c.accent }}>
                        {child}
                      </span>
                    </div>
                    {!hasActs ? (
                      <span style={{ fontSize: 10, color: "#CCC", fontFamily: "'Nunito', sans-serif" }}>
                        {isWknd ? "🎉 Libur" : "Tidak ada jadwal"}
                      </span>
                    ) : (
                      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        {Object.entries(acts).map(([act, time]) => (
                          <ActivityBadge key={act} activity={act} time={time} small />
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Notes section */}
      <div style={{ marginTop: 6 }}>
        <div style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 13, color: "#555", marginBottom: 10 }}>
          📝 Catatan Anak
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {CHILDREN.map((child) => {
            const c = COLORS[child];
            return (
              <div
                key={child}
                style={{
                  borderRadius: 14, background: c.bg,
                  border: `1px solid ${c.accent}20`,
                  padding: "11px 13px", boxShadow: "0 1px 6px #0000000A",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 7 }}>
                  <ChildAvatar name={child} size={24} />
                  <span style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 12, color: c.accent }}>
                    {child}
                  </span>
                </div>
                <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: 11, color: "#555", lineHeight: 1.5, margin: 0, fontWeight: 600 }}>
                  {notes[child] || <span style={{ color: "#CCC" }}>Belum ada catatan</span>}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
