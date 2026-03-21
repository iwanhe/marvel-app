export default function Toggle({ value, onChange }) {
  return (
    <div
      onClick={() => onChange(!value)}
      style={{
        width: 50, height: 28, borderRadius: 14, cursor: "pointer",
        background: value ? "#1a1a2e" : "#DDD",
        position: "relative", transition: "background 0.3s", flexShrink: 0,
      }}
    >
      <div
        style={{
          position: "absolute", top: 3, left: value ? 25 : 3,
          width: 22, height: 22, borderRadius: "50%", background: "#fff",
          boxShadow: "0 1px 4px #0000003A", transition: "left 0.3s",
        }}
      />
    </div>
  );
}
