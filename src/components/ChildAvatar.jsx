import { COLORS } from "../constants";

export default function ChildAvatar({ name, size = 32 }) {
  const c = COLORS[name];
  return (
    <div
      style={{
        width: size, height: size, borderRadius: "50%",
        background: `linear-gradient(135deg, ${c.accent}, ${c.grad})`,
        display: "flex", alignItems: "center", justifyContent: "center",
        color: "#fff", fontWeight: 900, fontSize: size * 0.4,
        fontFamily: "'Nunito', sans-serif", flexShrink: 0,
        boxShadow: `0 2px 8px ${c.accent}50`,
      }}
    >
      {name[0]}
    </div>
  );
}
