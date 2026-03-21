import { ACT_COLORS } from "../constants";

export default function ActivityBadge({ activity, time, small }) {
  const color = ACT_COLORS[activity] || "#555";
  return (
    <div
      style={{
        display: "inline-flex", alignItems: "center", gap: 4,
        background: color + "15", border: `1px solid ${color}35`,
        borderRadius: 7, padding: small ? "2px 6px" : "4px 9px", marginBottom: 3,
      }}
    >
      <span style={{ width: 5, height: 5, borderRadius: "50%", background: color, flexShrink: 0 }} />
      <span style={{ fontSize: small ? 10 : 11, fontWeight: 700, color, fontFamily: "'Nunito', sans-serif" }}>
        {activity}
      </span>
      {time && (
        <span style={{ fontSize: small ? 9 : 10, color: color + "BB", fontFamily: "'Nunito', sans-serif" }}>
          {time}
        </span>
      )}
    </div>
  );
}
