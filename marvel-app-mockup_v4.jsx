import { useState } from "react";

// ─── Constants ───────────────────────────────────────────────────────────────
const CHILDREN = ["Aaron", "Bellva", "Belvin", "Adriel"];
const INITIAL_ACTIVITIES = ["Sekolah", "Rockstar", "Kumon", "Les Inggris", "Les Mandarin", "Les Piano"];
const ALL_DAYS = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];
const WEEKDAYS = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat"];
const WEEKEND = ["Sabtu", "Minggu"];

const COLORS = {
  Aaron:  { bg: "#FFF0E6", accent: "#FF6B35", light: "#FFE4D0", grad: "#FF8C5A" },
  Bellva: { bg: "#FFF0F6", accent: "#E91E8C", light: "#FCE4F0", grad: "#F06292" },
  Belvin: { bg: "#F0FFF4", accent: "#2E7D32", light: "#C8E6C9", grad: "#43A047" },
  Adriel: { bg: "#FDF0FF", accent: "#9C27B0", light: "#E1BEE7", grad: "#AB47BC" },
};
const ACT_COLORS = {
  Sekolah:        "#1565C0",
  Rockstar:       "#C62828",
  Kumon:          "#E65100",
  "Les Inggris":  "#00695C",
  "Les Mandarin": "#6A1B9A",
  "Les Piano":    "#4E342E",
};

// Base Monday: 09 Mar 2026
const BASE_DATE = new Date(2026, 2, 9);

function getWeekStart(weekIndex) {
  const d = new Date(BASE_DATE);
  d.setDate(d.getDate() + weekIndex * 7);
  return d;
}

function getWeekDates(weekIndex) {
  const start = getWeekStart(weekIndex);
  const DAYS_ID = ["Senin","Selasa","Rabu","Kamis","Jumat","Sabtu","Minggu"];
  const result = {};
  DAYS_ID.forEach((day, i) => {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    result[day] = d.toLocaleDateString("id-ID", { day: "2-digit", month: "short" });
  });
  return result;
}

function getWeekRange(weekIndex) {
  const start = getWeekStart(weekIndex);
  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  const fmt = (d) => d.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" });
  return { start: fmt(start), end: fmt(end) };
}

function weekKey(weekIndex) {
  const d = getWeekStart(weekIndex);
  return `${d.getFullYear()}-W${String(Math.ceil((d.getDate() + (d.getDay() === 0 ? 6 : d.getDay() - 1)) / 7)).padStart(2,"0")}`;
}

const initialSchedule = {
  Senin:  { Aaron: { Sekolah: "06.45-14.30", "Les Piano": "19.00-19.30" }, Bellva: { Sekolah: "10.40-14.40" }, Belvin: { Sekolah: "09.00-13.15" }, Adriel: { Sekolah: "10.15-12.45" } },
  Selasa: { Aaron: { Sekolah: "06.45-14.30", Kumon: "16.00-17.00" }, Bellva: { Sekolah: "06.45-14.00", Rockstar: "16.00" }, Belvin: { Sekolah: "09.00-13.15", Rockstar: "14.00" }, Adriel: { Sekolah: "10.15-12.45", Rockstar: "13.00-15.00" } },
  Rabu:   { Aaron: { Sekolah: "06.45-14.10" }, Bellva: { Sekolah: "10.40-14.40" }, Belvin: { Sekolah: "10.15-13.15" }, Adriel: { Sekolah: "09.00-12.45" } },
  Kamis:  { Aaron: { Sekolah: "06.45-13.10", "Les Mandarin": "17.00-18.00" }, Bellva: { Sekolah: "11.10-15.10", Rockstar: "16.00" }, Belvin: { Sekolah: "10.15-13.15", Rockstar: "14.00" }, Adriel: { Sekolah: "10.15-12.45", Rockstar: "13.00-15.00" } },
  Jumat:  { Aaron: { Sekolah: "06.45-13.10", Kumon: "16.00-17.00", "Les Mandarin": "14.00-15.00" }, Bellva: { Sekolah: "09.30-14.40", Rockstar: "16.00" }, Belvin: { Sekolah: "10.15-13.15", Rockstar: "14.00", "Les Inggris": "16.00" }, Adriel: { Sekolah: "09.00-12.45" } },
  Sabtu:  { Aaron: {}, Bellva: {}, Belvin: {}, Adriel: {} },
  Minggu: { Aaron: {}, Bellva: {}, Belvin: {}, Adriel: {} },
};
const initialWeekSchedules = { 0: initialSchedule };

const initialNotes = {
  Aaron:  "Bawa bekal & air minum. Sepatu olahraga setiap Rabu.",
  Bellva: "Jadwal Rockstar konfirmasi dulu ke Kak Rina.",
  Belvin: "Les Mandarin mulai bulan depan. Cek jadwal baru.",
  Adriel: "Antar jemput koordinasi dengan Pak Budi.",
};



// ─── Atoms ────────────────────────────────────────────────────────────────────
function ChildAvatar({ name, size = 32 }) {
  const c = COLORS[name];
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: `linear-gradient(135deg, ${c.accent}, ${c.grad})`,
      display: "flex", alignItems: "center", justifyContent: "center",
      color: "#fff", fontWeight: 900, fontSize: size * 0.4,
      fontFamily: "'Nunito', sans-serif", flexShrink: 0,
      boxShadow: `0 2px 8px ${c.accent}50`,
    }}>{name[0]}</div>
  );
}

function ActivityBadge({ activity, time, small }) {
  const color = ACT_COLORS[activity] || "#555";
  return (
    <div style={{
      display: "inline-flex", alignItems: "center", gap: 4,
      background: color + "15", border: `1px solid ${color}35`,
      borderRadius: 7, padding: small ? "2px 6px" : "4px 9px", marginBottom: 3,
    }}>
      <span style={{ width: 5, height: 5, borderRadius: "50%", background: color, flexShrink: 0 }} />
      <span style={{ fontSize: small ? 10 : 11, fontWeight: 700, color, fontFamily: "'Nunito', sans-serif" }}>{activity}</span>
      {time && <span style={{ fontSize: small ? 9 : 10, color: color + "BB", fontFamily: "'Nunito', sans-serif" }}>{time}</span>}
    </div>
  );
}

function Toggle({ value, onChange }) {
  return (
    <div onClick={() => onChange(!value)} style={{
      width: 50, height: 28, borderRadius: 14, cursor: "pointer",
      background: value ? "#1a1a2e" : "#DDD", position: "relative", transition: "background 0.3s", flexShrink: 0,
    }}>
      <div style={{
        position: "absolute", top: 3, left: value ? 25 : 3,
        width: 22, height: 22, borderRadius: "50%", background: "#fff",
        boxShadow: "0 1px 4px #0000003A", transition: "left 0.3s",
      }} />
    </div>
  );
}

// ─── Weekly View ──────────────────────────────────────────────────────────────
function WeeklyView({ schedule, notes, showWeekend, weekRange, dayDates, weekIndex, setWeekIndex, totalWeeks }) {
  const days = showWeekend ? ALL_DAYS : WEEKDAYS;
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14, gap: 8 }}>
        <button onClick={() => setWeekIndex(i => Math.max(0, i - 1))} disabled={weekIndex === 0} style={{ border: "1px solid #E0E0E0", background: weekIndex === 0 ? "#F8F8F8" : "#fff", borderRadius: 9, width: 32, height: 32, cursor: weekIndex === 0 ? "not-allowed" : "pointer", color: weekIndex === 0 ? "#CCC" : "#333", fontSize: 16, flexShrink: 0 }}>‹</button>
        <div style={{ flex: 1, textAlign: "center", fontFamily: "'Nunito', sans-serif", fontSize: 11, fontWeight: 700, color: "#666", background: "#fff", borderRadius: 10, padding: "6px 10px", border: "1px solid #EBEBEB", boxShadow: "0 1px 4px #0000000A" }}>
          📅 {weekRange.start} — {weekRange.end}
          {showWeekend && <span style={{ marginLeft: 6, fontSize: 10, background: "#ECEFF1", color: "#546E7A", borderRadius: 5, padding: "1px 6px", fontWeight: 700 }}>+Wknd</span>}
        </div>
        <button onClick={() => setWeekIndex(i => i + 1)} style={{ border: "1px solid #E0E0E0", background: "#fff", borderRadius: 9, width: 32, height: 32, cursor: "pointer", color: "#333", fontSize: 16, flexShrink: 0 }}>›</button>
      </div>

      {days.map(day => {
        const isWknd = WEEKEND.includes(day);
        return (
          <div key={day} style={{
            marginBottom: 14, borderRadius: 16, background: "#fff",
            boxShadow: "0 2px 12px #00000009", overflow: "hidden",
            border: isWknd ? "1px solid #CFD8DC" : "1px solid #EBEBEB",
          }}>
            {/* Day header */}
            <div style={{
              padding: "10px 16px",
              background: isWknd ? "linear-gradient(135deg, #37474F, #546E7A)" : "linear-gradient(135deg, #1a1a2e, #16213e)",
              color: "#fff", display: "flex", alignItems: "center", justifyContent: "space-between",
            }}>
              <span style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 14 }}>
                {isWknd ? "🌙" : "☀️"} {day}
              </span>
              <span style={{
                fontFamily: "'Nunito', sans-serif", fontSize: 11,
                background: "rgba(255,255,255,0.15)", borderRadius: 6, padding: "2px 9px", fontWeight: 600,
              }}>{dayDates[day]} 2026</span>
            </div>

            {/* Children grid */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
              {CHILDREN.map((child, i) => {
                const acts = schedule[day]?.[child] || {};
                const c = COLORS[child];
                const hasActs = Object.keys(acts).length > 0;
                return (
                  <div key={child} style={{
                    padding: "10px 11px",
                    borderRight: i % 2 === 0 ? "1px solid #F3F3F3" : "none",
                    borderBottom: i < 2 ? "1px solid #F3F3F3" : "none",
                    background: hasActs ? c.bg : "#FAFAFA",
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 6 }}>
                      <ChildAvatar name={child} size={22} />
                      <span style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 11, color: c.accent }}>{child}</span>
                    </div>
                    {!hasActs
                      ? <span style={{ fontSize: 10, color: "#CCC", fontFamily: "'Nunito', sans-serif" }}>{isWknd ? "🎉 Libur" : "Tidak ada jadwal"}</span>
                      : <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                          {Object.entries(acts).map(([act, time]) => <ActivityBadge key={act} activity={act} time={time} small />)}
                        </div>
                    }
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
          {CHILDREN.map(child => {
            const c = COLORS[child];
            return (
              <div key={child} style={{
                borderRadius: 14, background: c.bg, border: `1px solid ${c.accent}20`,
                padding: "11px 13px", boxShadow: "0 1px 6px #0000000A",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 7 }}>
                  <ChildAvatar name={child} size={24} />
                  <span style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 12, color: c.accent }}>{child}</span>
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

// ─── Child View ───────────────────────────────────────────────────────────────
function ChildView({ schedule, notes, child, showWeekend, weekRange, dayDates, weekIndex, setWeekIndex, totalWeeks }) {
  const c = COLORS[child];
  const days = showWeekend ? ALL_DAYS : WEEKDAYS;
  return (
    <div>
      <div style={{
        borderRadius: 20, padding: "18px 20px", marginBottom: 14,
        background: `linear-gradient(135deg, ${c.accent}, ${c.grad})`,
        color: "#fff", display: "flex", alignItems: "center", gap: 14,
        boxShadow: `0 6px 24px ${c.accent}40`,
      }}>
        <ChildAvatar name={child} size={52} />
        <div>
          <div style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 900, fontSize: 22 }}>{child}</div>
          <div style={{ fontFamily: "'Nunito', sans-serif", fontSize: 11, opacity: 0.85 }}>
            📅 {weekRange.start} — {weekRange.end}
          </div>
        </div>
      </div>

      {days.map(day => {
        const isWknd = WEEKEND.includes(day);
        const acts = schedule[day]?.[child] || {};
        const hasActs = Object.keys(acts).length > 0;
        return (
          <div key={day} style={{
            marginBottom: 10, borderRadius: 14, overflow: "hidden",
            border: `1px solid ${hasActs ? c.accent + "25" : "#EBEBEB"}`,
            background: "#fff", boxShadow: "0 1px 6px #00000008",
          }}>
            <div style={{
              padding: "8px 14px",
              background: hasActs ? c.light : isWknd ? "#ECEFF1" : "#F8F8F8",
              display: "flex", alignItems: "center", justifyContent: "space-between",
            }}>
              <span style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 13, color: hasActs ? c.accent : "#90A4AE" }}>
                {isWknd ? "🌙" : "☀️"} {day}
              </span>
              <span style={{ fontFamily: "'Nunito', sans-serif", fontSize: 10, fontWeight: 700, color: "#888", background: "rgba(0,0,0,0.06)", borderRadius: 6, padding: "2px 7px" }}>
                {dayDates[day]} 2026
              </span>
            </div>
            <div style={{ padding: "10px 14px" }}>
              {!hasActs
                ? <span style={{ fontSize: 11, color: "#CCC", fontFamily: "'Nunito', sans-serif" }}>{isWknd ? "🎉 Libur" : "Tidak ada jadwal"}</span>
                : <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                    {Object.entries(acts).map(([act, time]) => <ActivityBadge key={act} activity={act} time={time} />)}
                  </div>
              }
            </div>
          </div>
        );
      })}

      <div style={{ borderRadius: 14, background: c.bg, border: `1px solid ${c.accent}20`, padding: "14px 16px", marginTop: 6 }}>
        <div style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 13, color: c.accent, marginBottom: 7 }}>📝 Catatan</div>
        <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: 13, color: "#555", lineHeight: 1.6, margin: 0, fontWeight: 600 }}>
          {notes[child] || <span style={{ color: "#CCC" }}>Belum ada catatan</span>}
        </p>
      </div>
    </div>
  );
}

// ─── Admin Login ─────────────────────────────────────────────────────────────────────────────────
const ADMIN_CREDS = { user: "marvel", pass: "marvel2026" };

function AdminLogin({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [err, setErr] = useState("");
  const [shake, setShake] = useState(false);

  const handleLogin = () => {
    if (username === ADMIN_CREDS.user && password === ADMIN_CREDS.pass) {
      onLogin();
    } else {
      setErr("Username atau password salah!");
      setShake(true);
      setTimeout(() => setShake(false), 500);
      setTimeout(() => setErr(""), 3000);
    }
  };

  const inp = {
    width: "100%", padding: "12px 14px 12px 42px", borderRadius: 12,
    border: "1.5px solid #E0E0E0", fontFamily: "'Nunito', sans-serif",
    fontSize: 14, background: "#FAFAFA", boxSizing: "border-box", outline: "none", color: "#333",
  };

  return (
    <div>
      <style>{"@keyframes shake{0%,100%{transform:translateX(0)}20%{transform:translateX(-8px)}40%{transform:translateX(8px)}60%{transform:translateX(-6px)}80%{transform:translateX(6px)}}.shake{animation:shake 0.45s ease;}"}</style>
      <div style={{ borderRadius: 20, padding: "28px 24px 24px", background: "linear-gradient(135deg, #1a1a2e, #0f3460)", color: "#fff", textAlign: "center", marginBottom: 20, boxShadow: "0 8px 32px #1a1a2e40" }}>
        <div style={{ fontSize: 48, marginBottom: 10 }}>🔐</div>
        <div style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 900, fontSize: 22 }}>Admin Panel</div>
        <div style={{ fontFamily: "'Nunito', sans-serif", fontSize: 12, opacity: 0.6, marginTop: 4 }}>Masukkan kredensial untuk melanjutkan</div>
      </div>
      <div className={shake ? "shake" : ""} style={{ borderRadius: 18, background: "#fff", border: "1px solid #EBEBEB", padding: "22px 20px", boxShadow: "0 2px 16px #0000000A" }}>
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 11, color: "#AAA", marginBottom: 6, letterSpacing: 0.5 }}>USERNAME</div>
          <div style={{ position: "relative" }}>
            <span style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", fontSize: 16, pointerEvents: "none" }}>👤</span>
            <input type="text" placeholder="Masukkan username" value={username} onChange={e => setUsername(e.target.value)} onKeyDown={e => e.key === "Enter" && handleLogin()} style={inp} />
          </div>
        </div>
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 11, color: "#AAA", marginBottom: 6, letterSpacing: 0.5 }}>PASSWORD</div>
          <div style={{ position: "relative" }}>
            <span style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", fontSize: 16, pointerEvents: "none" }}>🔑</span>
            <input type={showPass ? "text" : "password"} placeholder="Masukkan password" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === "Enter" && handleLogin()} style={{ ...inp, paddingRight: 44 }} />
            <button onClick={() => setShowPass(!showPass)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", border: "none", background: "transparent", cursor: "pointer", fontSize: 16, padding: 4 }}>
              {showPass ? "🙈" : "👁️"}
            </button>
          </div>
        </div>
        {err && (
          <div style={{ marginBottom: 14, padding: "10px 14px", borderRadius: 10, background: "#FFEBEE", border: "1px solid #FFCDD2", fontFamily: "'Nunito', sans-serif", fontSize: 12, fontWeight: 700, color: "#C62828" }}>
            ⚠️ {err}
          </div>
        )}
        <button onClick={handleLogin} style={{ width: "100%", padding: "14px", borderRadius: 13, border: "none", background: "linear-gradient(135deg, #1a1a2e, #0f3460)", color: "#fff", fontFamily: "'Nunito', sans-serif", fontWeight: 900, fontSize: 15, cursor: "pointer", boxShadow: "0 4px 16px #1a1a2e40" }}>
          Masuk ke Admin Panel →
        </button>
        <div style={{ textAlign: "center", marginTop: 14, fontFamily: "'Nunito', sans-serif", fontSize: 11, color: "#CCC" }}>Hanya untuk administrator MARVEL</div>
      </div>
    </div>
  );
}

// ─── Admin Panel ──────────────────────────────────────────────────────────────
function AdminPanel({ schedule, setSchedule, notes, setNotes, activities, setActivities, showWeekend, setShowWeekend, weekRange, dayDates, weekIndex, setWeekIndex, weekSchedules, setWeekSchedules, totalWeeks }) {
  const [loggedIn, setLoggedIn] = useState(false);
  const [tab, setTab] = useState("jadwal");
  const [selDay, setSelDay] = useState("Senin");
  const [selChild, setSelChild] = useState("Aaron");
  const [editAct, setEditAct] = useState("");
  const [editTime, setEditTime] = useState("");
  const [editNote, setEditNote] = useState(notes["Aaron"] || "");
  const [msg, setMsg] = useState("");
  const [newActName, setNewActName] = useState("");
  const [actMsg, setActMsg] = useState("");

  if (!loggedIn) return <AdminLogin onLogin={() => setLoggedIn(true)} />;

  const c = COLORS[selChild];
  const acts = schedule[selDay]?.[selChild] || {};
  const flash = (t) => { setMsg(t); setTimeout(() => setMsg(""), 3000); };
  const flashAct = (t) => { setActMsg(t); setTimeout(() => setActMsg(""), 3000); };

  const handleAdd = () => {
    if (!editAct || !editTime) { flash("⚠️ Pilih aktivitas dan isi waktu!"); return; }
    setSchedule(prev => ({ ...prev, [selDay]: { ...prev[selDay], [selChild]: { ...(prev[selDay]?.[selChild] || {}), [editAct]: editTime } } }));
    flash(`✅ ${editAct} ditambahkan untuk ${selChild} — ${selDay}`);
    setEditAct(""); setEditTime("");
  };
  const handleDelete = (act) => {
    setSchedule(prev => { const u = { ...(prev[selDay]?.[selChild] || {}) }; delete u[act]; return { ...prev, [selDay]: { ...prev[selDay], [selChild]: u } }; });
    flash(`🗑️ ${act} dihapus`);
  };
  const handleSaveNote = () => { setNotes(prev => ({ ...prev, [selChild]: editNote })); flash("✅ Catatan disimpan!"); };
  const handleAddAct = () => {
    const trimmed = newActName.trim();
    if (!trimmed) { flashAct("⚠️ Nama aktivitas tidak boleh kosong!"); return; }
    if (activities.includes(trimmed)) { flashAct("⚠️ Aktivitas sudah ada!"); return; }
    setActivities(prev => [...prev, trimmed]);
    flashAct("✅ Aktivitas berhasil ditambahkan!");
    setNewActName("");
  };
  const handleDeleteAct = (act) => {
    if (INITIAL_ACTIVITIES.includes(act)) { flashAct("⚠️ Aktivitas default tidak bisa dihapus!"); return; }
    setActivities(prev => prev.filter(a => a !== act));
    flashAct("🗑️ Aktivitas dihapus!");
  };

  const adminTabs = [
    { id: "jadwal", label: "Jadwal", icon: "📅" },
    { id: "catatan", label: "Catatan", icon: "📝" },
    { id: "aktivitas", label: "Aktivitas", icon: "🏷️" },
    { id: "tampilan", label: "Tampilan", icon: "🎛️" },
  ];

  const inp = {
    width: "100%", padding: "10px 12px", borderRadius: 10, border: "1px solid #E0E0E0",
    fontFamily: "'Nunito', sans-serif", fontSize: 13, background: "#FAFAFA", boxSizing: "border-box", outline: "none",
  };

  return (
    <div>
      <div style={{ borderRadius: 18, padding: "14px 18px", marginBottom: 14, background: "linear-gradient(135deg, #1a1a2e, #16213e)", color: "#fff" }}>
        <div style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 900, fontSize: 17 }}>⚙️ Admin Panel</div>
        <div style={{ fontFamily: "'Nunito', sans-serif", fontSize: 11, opacity: 0.6, marginTop: 2 }}>📅 {weekRange.start} — {weekRange.end}</div>
      </div>

      {/* Sub-tabs */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", background: "#EBEBEB", borderRadius: 12, padding: 4, marginBottom: 16, gap: 2 }}>
        {adminTabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            padding: "8px 6px", borderRadius: 9, border: "none",
            background: tab === t.id ? "#fff" : "transparent",
            fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 12,
            color: tab === t.id ? "#1a1a2e" : "#888", cursor: "pointer",
            boxShadow: tab === t.id ? "0 1px 6px #00000015" : "none", transition: "all 0.2s",
          }}>{t.icon} {t.label}</button>
        ))}
      </div>

      {/* ── JADWAL ── */}
      {tab === "jadwal" && <>
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 11, color: "#AAA", marginBottom: 6, letterSpacing: 0.5 }}>PILIH HARI</div>
          <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
            {(showWeekend ? ALL_DAYS : WEEKDAYS).map(d => {
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

        <div style={{ marginBottom: 14 }}>
          <div style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 11, color: "#AAA", marginBottom: 6 }}>PILIH ANAK</div>
          <div style={{ display: "flex", gap: 6 }}>
            {CHILDREN.map(ch => {
              const cc = COLORS[ch];
              return (
                <button key={ch} onClick={() => { setSelChild(ch); setEditNote(notes[ch] || ""); }} style={{
                  flex: 1, padding: "8px 4px", borderRadius: 12, border: `2px solid ${selChild === ch ? cc.accent : "#EEE"}`,
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

        <div style={{ borderRadius: 14, border: `1px solid ${c.accent}20`, background: c.bg, padding: 13, marginBottom: 12 }}>
          <div style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 12, color: c.accent, marginBottom: 8 }}>
            {selChild} — {selDay}, {dayDates[selDay]} 2026
          </div>
          {Object.keys(acts).length === 0
            ? <div style={{ fontFamily: "'Nunito', sans-serif", fontSize: 11, color: "#BBB" }}>Belum ada jadwal</div>
            : Object.entries(acts).map(([act, time]) => (
                <div key={act} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "6px 10px", borderRadius: 9, background: "#fff", marginBottom: 5, boxShadow: "0 1px 4px #00000009" }}>
                  <ActivityBadge activity={act} time={time} />
                  <button onClick={() => handleDelete(act)} style={{ border: "none", background: "#FFEBEE", color: "#E53935", borderRadius: 7, padding: "3px 9px", cursor: "pointer", fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: 11 }}>Hapus</button>
                </div>
              ))
          }
        </div>

        <div style={{ borderRadius: 14, border: "1px solid #EBEBEB", background: "#fff", padding: 14 }}>
          <div style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 13, color: "#333", marginBottom: 10 }}>➕ Tambah Jadwal</div>
          <select value={editAct} onChange={e => setEditAct(e.target.value)} style={{ ...inp, marginBottom: 8, color: editAct ? "#333" : "#AAA" }}>
            <option value="">Pilih Aktivitas...</option>
            {activities.map(a => <option key={a} value={a}>{a}</option>)}
          </select>
          <input type="text" placeholder="Waktu (contoh: 16.00-17.00)" value={editTime} onChange={e => setEditTime(e.target.value)} style={{ ...inp, marginBottom: 10 }} />
          <button onClick={handleAdd} style={{ width: "100%", padding: "12px", borderRadius: 12, border: "none", background: "linear-gradient(135deg, #1a1a2e, #0f3460)", color: "#fff", fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 14, cursor: "pointer" }}>
            Simpan Jadwal
          </button>
        </div>
      </>}

      {/* ── CATATAN ── */}
      {tab === "catatan" && <>
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 11, color: "#AAA", marginBottom: 6 }}>PILIH ANAK</div>
          <div style={{ display: "flex", gap: 6 }}>
            {CHILDREN.map(ch => {
              const cc = COLORS[ch];
              return (
                <button key={ch} onClick={() => { setSelChild(ch); setEditNote(notes[ch] || ""); }} style={{
                  flex: 1, padding: "8px 4px", borderRadius: 12, border: `2px solid ${selChild === ch ? cc.accent : "#EEE"}`,
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

        <div style={{ borderRadius: 14, border: `1px solid ${c.accent}20`, background: c.bg, padding: 14 }}>
          <div style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 13, color: c.accent, marginBottom: 10 }}>📝 Catatan untuk {selChild}</div>
          <textarea value={editNote} onChange={e => setEditNote(e.target.value)} placeholder={`Tulis catatan penting untuk ${selChild}...`} rows={5}
            style={{ width: "100%", padding: "12px", borderRadius: 10, border: `1px solid ${c.accent}30`, fontFamily: "'Nunito', sans-serif", fontSize: 13, lineHeight: 1.6, background: "#fff", color: "#333", resize: "vertical", boxSizing: "border-box", outline: "none" }}
          />
          <button onClick={handleSaveNote} style={{ width: "100%", marginTop: 10, padding: "12px", borderRadius: 12, border: "none", background: `linear-gradient(135deg, ${c.accent}, ${c.grad})`, color: "#fff", fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 14, cursor: "pointer" }}>
            Simpan Catatan
          </button>
        </div>

        <div style={{ marginTop: 16 }}>
          <div style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 11, color: "#AAA", marginBottom: 10, letterSpacing: 0.5 }}>SEMUA CATATAN</div>
          {CHILDREN.map(ch => {
            const cc = COLORS[ch];
            return (
              <div key={ch} style={{ borderRadius: 12, background: cc.bg, border: `1px solid ${cc.accent}20`, padding: "10px 13px", marginBottom: 8 }}>
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
      </>}

      {/* ── AKTIVITAS ── */}
      {tab === "aktivitas" && (
          <div>
            {/* List aktivitas */}
            <div style={{ borderRadius: 14, background: "#fff", border: "1px solid #EBEBEB", padding: 14, marginBottom: 12 }}>
              <div style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 13, color: "#333", marginBottom: 10 }}>
                🏷️ Master Data Aktivitas
                <span style={{ marginLeft: 8, fontFamily: "'Nunito', sans-serif", fontSize: 11, fontWeight: 700, background: "#1a1a2e", color: "#fff", borderRadius: 6, padding: "2px 8px" }}>
                  {activities.length} aktivitas
                </span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                {activities.map((act, i) => {
                  const color = ACT_COLORS[act] || "#555";
                  const isDefault = INITIAL_ACTIVITIES.includes(act);
                  return (
                    <div key={act} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "9px 12px", borderRadius: 10, background: color + "10", border: "1px solid " + color + "25" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ width: 10, height: 10, borderRadius: "50%", background: color, flexShrink: 0 }} />
                        <span style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: 13, color: color }}>{act}</span>
                        {isDefault && <span style={{ fontFamily: "'Nunito', sans-serif", fontSize: 9, fontWeight: 800, background: color + "20", color: color, borderRadius: 4, padding: "1px 6px", letterSpacing: 0.3 }}>DEFAULT</span>}
                      </div>
                      <button onClick={() => handleDeleteAct(act)} style={{ border: "none", background: isDefault ? "#F5F5F5" : "#FFEBEE", color: isDefault ? "#CCC" : "#E53935", borderRadius: 7, padding: "3px 9px", cursor: isDefault ? "not-allowed" : "pointer", fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: 11 }}>
                        {isDefault ? "🔒" : "Hapus"}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Form tambah aktivitas baru */}
            <div style={{ borderRadius: 14, background: "#fff", border: "1px solid #EBEBEB", padding: 14 }}>
              <div style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 13, color: "#333", marginBottom: 10 }}>➕ Tambah Aktivitas Baru</div>
              <div style={{ marginBottom: 10 }}>
                <div style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 11, color: "#AAA", marginBottom: 6, letterSpacing: 0.5 }}>NAMA AKTIVITAS</div>
                <input
                  type="text" placeholder="Contoh: Les Matematika, Renang..."
                  value={newActName} onChange={e => setNewActName(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleAddAct()}
                  style={{ width: "100%", padding: "10px 12px", borderRadius: 10, border: "1px solid #E0E0E0", fontFamily: "'Nunito', sans-serif", fontSize: 13, background: "#FAFAFA", boxSizing: "border-box", outline: "none" }}
                />
              </div>

              {/* Preview badge */}
              {newActName.trim() && (
                <div style={{ marginBottom: 10, padding: "8px 12px", borderRadius: 10, background: "#F8F8F8", border: "1px solid #EBEBEB" }}>
                  <div style={{ fontFamily: "'Nunito', sans-serif", fontSize: 11, color: "#AAA", marginBottom: 6, fontWeight: 700 }}>PREVIEW BADGE</div>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 4, background: "#55555518", border: "1px solid #55555535", borderRadius: 7, padding: "4px 9px" }}>
                    <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#555" }} />
                    <span style={{ fontSize: 11, fontWeight: 700, color: "#555", fontFamily: "'Nunito', sans-serif" }}>{newActName.trim()}</span>
                  </div>
                </div>
              )}

              <button onClick={handleAddAct} style={{ width: "100%", padding: "12px", borderRadius: 12, border: "none", background: "linear-gradient(135deg, #1a1a2e, #0f3460)", color: "#fff", fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 14, cursor: "pointer" }}>
                Tambah Aktivitas
              </button>

              {actMsg && (
                <div style={{ marginTop: 10, padding: "10px 14px", borderRadius: 10, fontFamily: "'Nunito', sans-serif", fontSize: 12, fontWeight: 700,
                  background: actMsg.startsWith("⚠️") ? "#FFF3E0" : actMsg.startsWith("🗑️") ? "#FCE4EC" : "#E8F5E9",
                  color: actMsg.startsWith("⚠️") ? "#E65100" : actMsg.startsWith("🗑️") ? "#C62828" : "#2E7D32",
                  border: "1px solid " + (actMsg.startsWith("⚠️") ? "#FFE0B2" : actMsg.startsWith("🗑️") ? "#FFCDD2" : "#C8E6C9"),
                }}>{actMsg}</div>
              )}
            </div>
          </div>
      )}

      {/* ── TAMPILAN ── */}
      {tab === "tampilan" && <>
        <div style={{ borderRadius: 16, background: "#fff", border: "1px solid #EBEBEB", overflow: "hidden", marginBottom: 12 }}>
          {/* Toggle row */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 18px", borderBottom: "1px solid #F5F5F5" }}>
            <div>
              <div style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 14, color: "#333" }}>🌙 Tampilkan Sabtu & Minggu</div>
              <div style={{ fontFamily: "'Nunito', sans-serif", fontSize: 11, color: "#AAA", marginTop: 2 }}>
                {showWeekend ? "Semua hari ditampilkan (Senin–Minggu)" : "Hanya hari kerja (Senin–Jumat)"}
              </div>
            </div>
            <Toggle value={showWeekend} onChange={setShowWeekend} />
          </div>

          {/* Visual indicator */}
          <div style={{ padding: "14px 18px", background: "#FAFAFA" }}>
            <div style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 11, color: "#AAA", marginBottom: 8, letterSpacing: 0.5 }}>HARI AKTIF</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {ALL_DAYS.map(d => {
                const iw = WEEKEND.includes(d);
                const active = !iw || showWeekend;
                return (
                  <div key={d} style={{
                    padding: "4px 10px", borderRadius: 8,
                    background: active ? (iw ? "#37474F" : "#1a1a2e") : "#EEE",
                    color: active ? "#fff" : "#BBB",
                    fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: 11,
                    transition: "all 0.3s",
                  }}>{d}</div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Week Manager */}
        <div style={{ borderRadius: 14, background: "#fff", border: "1px solid #EBEBEB", padding: "14px 18px" }}>
          <div style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 13, color: "#333", marginBottom: 12, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span>📅 Kelola Minggu</span>
            <span style={{ fontSize: 11, fontWeight: 700, background: "#1a1a2e", color: "#fff", borderRadius: 6, padding: "2px 8px" }}>{totalWeeks} minggu</span>
          </div>

          {/* Week list */}
          <div style={{ display: "flex", flexDirection: "column", gap: 7, marginBottom: 14 }}>
            {Object.keys(weekSchedules).map(wi => {
              const wiNum = parseInt(wi);
              const wr = getWeekRange(wiNum);
              const wd = getWeekDates(wiNum);
              const isCurrent = wiNum === weekIndex;
              return (
                <div key={wi} style={{ borderRadius: 11, border: isCurrent ? "2px solid #1a1a2e" : "1px solid #EBEBEB", background: isCurrent ? "#1a1a2e" : "#FAFAFA", padding: "10px 13px", cursor: "pointer", transition: "all 0.2s" }} onClick={() => setWeekIndex(wiNum)}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                    <div style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 12, color: isCurrent ? "#fff" : "#333" }}>
                      {isCurrent ? "📍" : "📅"} Minggu ke-{wiNum + 1}
                    </div>
                    {isCurrent && <span style={{ fontFamily: "'Nunito', sans-serif", fontSize: 9, fontWeight: 800, background: "rgba(255,255,255,0.2)", color: "#fff", borderRadius: 5, padding: "2px 7px" }}>AKTIF</span>}
                  </div>
                  <div style={{ fontFamily: "'Nunito', sans-serif", fontSize: 11, color: isCurrent ? "rgba(255,255,255,0.75)" : "#888", fontWeight: 600 }}>
                    {wr.start} — {wr.end}
                  </div>
                  <div style={{ display: "flex", gap: 4, marginTop: 6, flexWrap: "wrap" }}>
                    {ALL_DAYS.filter(d => !WEEKEND.includes(d)).map(d => (
                      <span key={d} style={{ fontFamily: "'Nunito', sans-serif", fontSize: 9, fontWeight: 700, background: isCurrent ? "rgba(255,255,255,0.15)" : "#EBEBEB", color: isCurrent ? "#fff" : "#777", borderRadius: 4, padding: "1px 5px" }}>{wd[d]}</span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Add new week button */}
          <button onClick={() => {
            const newIdx = Math.max(...Object.keys(weekSchedules).map(Number)) + 1;
            const emptyWeek = { Senin:{Aaron:{},Bellva:{},Belvin:{},Adriel:{}}, Selasa:{Aaron:{},Bellva:{},Belvin:{},Adriel:{}}, Rabu:{Aaron:{},Bellva:{},Belvin:{},Adriel:{}}, Kamis:{Aaron:{},Bellva:{},Belvin:{},Adriel:{}}, Jumat:{Aaron:{},Bellva:{},Belvin:{},Adriel:{}}, Sabtu:{Aaron:{},Bellva:{},Belvin:{},Adriel:{}}, Minggu:{Aaron:{},Bellva:{},Belvin:{},Adriel:{}} };
            setWeekSchedules(prev => ({ ...prev, [newIdx]: emptyWeek }));
            setWeekIndex(newIdx);
          }} style={{ width: "100%", padding: "12px", borderRadius: 12, border: "2px dashed #1a1a2e40", background: "#FAFAFA", color: "#1a1a2e", fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
            ➕ Tambah Minggu Baru
            <span style={{ fontSize: 11, fontWeight: 600, color: "#888" }}>({(() => { const nextIdx = Math.max(...Object.keys(weekSchedules).map(Number)) + 1; const wr = getWeekRange(nextIdx); return wr.start + " — " + wr.end; })()})</span>
          </button>

          {/* Divider */}
          <div style={{ margin: "14px 0 12px", borderTop: "1px solid #F0F0F0" }} />

          {/* Current week day breakdown */}
          <div style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 11, color: "#AAA", marginBottom: 8, letterSpacing: 0.5 }}>TANGGAL MINGGU AKTIF</div>
          {ALL_DAYS.map(d => (
            <div key={d} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", borderBottom: "1px solid #F8F8F8" }}>
              <span style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: 12, color: WEEKEND.includes(d) ? "#90A4AE" : "#333" }}>
                {WEEKEND.includes(d) ? "🌙" : "☀️"} {d}
              </span>
              <span style={{ fontFamily: "'Nunito', sans-serif", fontSize: 12, color: "#888", fontWeight: 600 }}>{dayDates[d]}</span>
            </div>
          ))}
        </div>
      </>}

      {msg && (
        <div style={{
          marginTop: 12, padding: "10px 14px", borderRadius: 10, fontFamily: "'Nunito', sans-serif", fontSize: 12, fontWeight: 700,
          background: msg.startsWith("⚠️") ? "#FFF3E0" : msg.startsWith("🗑️") ? "#FCE4EC" : "#E8F5E9",
          color: msg.startsWith("⚠️") ? "#E65100" : msg.startsWith("🗑️") ? "#C62828" : "#2E7D32",
          border: `1px solid ${msg.startsWith("⚠️") ? "#FFE0B2" : msg.startsWith("🗑️") ? "#FFCDD2" : "#C8E6C9"}`,
        }}>{msg}</div>
      )}
    </div>
  );
}

// ─── Print Preview ────────────────────────────────────────────────────────────
function PrintPreview({ schedule, notes, activities, showWeekend, weekRange, dayDates, onClose }) {
  const days = showWeekend ? ALL_DAYS : WEEKDAYS;
  const thS = { padding: "7px 8px", textAlign: "left", fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: 10, color: "#555", borderBottom: "2px solid #E8E8E8", whiteSpace: "nowrap" };
  const tdS = { padding: "7px 8px", fontFamily: "'Nunito', sans-serif", fontSize: 10, borderBottom: "1px solid #F0F0F0", verticalAlign: "top" };
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.65)", zIndex: 1000, display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "16px 8px 24px", overflowY: "auto" }}>
      <div style={{ background: "#fff", borderRadius: 20, width: "100%", maxWidth: 820, padding: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div>
            <div style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 900, fontSize: 24, color: "#1a1a2e" }}>🦸 MARVEL</div>
            <div style={{ fontFamily: "'Nunito', sans-serif", fontSize: 12, color: "#888", marginTop: 2 }}>
              Jadwal Mingguan • {weekRange.start} — {weekRange.end}{showWeekend ? " • Senin–Minggu" : " • Senin–Jumat"}
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => window.print()} style={{ padding: "8px 16px", borderRadius: 10, border: "none", background: "#1a1a2e", color: "#fff", fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>🖨️ Print</button>
            <button onClick={onClose} style={{ padding: "8px 16px", borderRadius: 10, border: "1px solid #E0E0E0", background: "#fff", color: "#555", fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>✕ Tutup</button>
          </div>
        </div>

        {days.map(day => {
          const iw = WEEKEND.includes(day);
          return (
            <div key={day} style={{ marginBottom: 16 }}>
              <div style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 900, fontSize: 13, color: "#fff", background: iw ? "#37474F" : "#1a1a2e", padding: "7px 14px", borderRadius: "10px 10px 0 0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span>{iw ? "🌙" : "☀️"} {day}</span>
                <span style={{ fontWeight: 600, fontSize: 11, opacity: 0.8 }}>{dayDates[day]} 2026</span>
              </div>
              <table style={{ width: "100%", borderCollapse: "collapse", border: "1px solid #EBEBEB", borderTop: "none" }}>
                <thead>
                  <tr style={{ background: "#F8F8F8" }}>
                    <th style={{ ...thS, width: "14%" }}>Anak</th>
                    {activities.map(a => <th key={a} style={thS}>{a}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {CHILDREN.map((child, i) => {
                    const cc = COLORS[child];
                    const acts = schedule[day]?.[child] || {};
                    return (
                      <tr key={child} style={{ background: i % 2 === 0 ? "#fff" : "#FAFAFA" }}>
                        <td style={{ ...tdS, fontWeight: 800, color: cc.accent }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                            <ChildAvatar name={child} size={18} />{child}
                          </div>
                        </td>
                        {activities.map(a => (
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
          <div style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 900, fontSize: 14, color: "#333", marginBottom: 12 }}>📝 Catatan Anak</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {CHILDREN.map(child => {
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

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function MARVELApp() {
  const [weekSchedules, setWeekSchedules] = useState(initialWeekSchedules);
  const [weekIndex, setWeekIndex] = useState(0);
  const [notes, setNotes] = useState(initialNotes);
  const [activities, setActivities] = useState(INITIAL_ACTIVITIES);
  const [showWeekend, setShowWeekend] = useState(false);
  const [view, setView] = useState("weekly");
  const [selChild, setSelChild] = useState("Aaron");
  const [showPrint, setShowPrint] = useState(false);

  const weekRange = getWeekRange(weekIndex);
  const dayDates = getWeekDates(weekIndex);
  const schedule = weekSchedules[weekIndex] || { Senin:{Aaron:{},Bellva:{},Belvin:{},Adriel:{}}, Selasa:{Aaron:{},Bellva:{},Belvin:{},Adriel:{}}, Rabu:{Aaron:{},Bellva:{},Belvin:{},Adriel:{}}, Kamis:{Aaron:{},Bellva:{},Belvin:{},Adriel:{}}, Jumat:{Aaron:{},Bellva:{},Belvin:{},Adriel:{}}, Sabtu:{Aaron:{},Bellva:{},Belvin:{},Adriel:{}}, Minggu:{Aaron:{},Bellva:{},Belvin:{},Adriel:{}} };
  const setSchedule = (updater) => setWeekSchedules(prev => ({ ...prev, [weekIndex]: typeof updater === "function" ? updater(prev[weekIndex] || schedule) : updater }));
  const totalWeeks = Object.keys(weekSchedules).length;

  const tabs = [
    { id: "weekly", label: "Mingguan", icon: "📅" },
    { id: "child",  label: "Per Anak", icon: "👶" },
    { id: "admin",  label: "Admin",    icon: "⚙️" },
  ];

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap" rel="stylesheet" />
      <div style={{ maxWidth: 430, margin: "0 auto", minHeight: "100vh", background: "#F4F5FB", fontFamily: "'Nunito', sans-serif" }}>

        {/* Header */}
        <div style={{ background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 55%, #0f3460 100%)", padding: "18px 18px 22px", position: "sticky", top: 0, zIndex: 100 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={{ fontWeight: 900, fontSize: 24, color: "#fff", letterSpacing: -0.5, lineHeight: 1 }}>🦸 MARVEL</div>
              <div style={{ fontSize: 9, color: "#ffffff65", marginTop: 3, letterSpacing: 1.2, fontWeight: 700 }}>MANAJEMEN AKTIVITAS RENCANA VALIDASI JADWAL</div>
            </div>
            <button onClick={() => setShowPrint(true)} style={{ background: "rgba(255,255,255,0.14)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 10, padding: "7px 12px", color: "#fff", fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: 12, cursor: "pointer" }}>
              🖨️ Print
            </button>
          </div>

          {/* Week range + weekend badge */}
          <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 7 }}>
            {/* Week navigation */}
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <button onClick={() => setWeekIndex(i => Math.max(0, i - 1))} disabled={weekIndex === 0} style={{ background: weekIndex === 0 ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 7, width: 26, height: 26, cursor: weekIndex === 0 ? "not-allowed" : "pointer", color: weekIndex === 0 ? "rgba(255,255,255,0.3)" : "#fff", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>‹</button>
              <div style={{ display: "inline-flex", alignItems: "center", background: "rgba(255,255,255,0.10)", borderRadius: 9, padding: "4px 10px" }}>
                <span style={{ fontSize: 10, color: "#ffffffAA", fontWeight: 600 }}>📅 {weekRange.start} — {weekRange.end}</span>
              </div>
              <button onClick={() => setWeekIndex(i => i + 1)} style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 7, width: 26, height: 26, cursor: "pointer", color: "#fff", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>›</button>
            </div>
            {showWeekend && (
              <div style={{ fontSize: 9, background: "#37474F", color: "#fff", borderRadius: 6, padding: "3px 8px", fontWeight: 700 }}>+ Wknd</div>
            )}
          </div>

          {/* Child filter (child view) */}
          {view === "child" && (
            <div style={{ display: "flex", gap: 5, marginTop: 12 }}>
              {CHILDREN.map(ch => {
                const cc = COLORS[ch];
                return (
                  <button key={ch} onClick={() => setSelChild(ch)} style={{
                    flex: 1, padding: "6px 4px", borderRadius: 10,
                    border: `2px solid ${selChild === ch ? cc.accent : "transparent"}`,
                    background: selChild === ch ? cc.accent : "rgba(255,255,255,0.1)",
                    color: "#fff", fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 11,
                    cursor: "pointer", transition: "all 0.2s",
                  }}>{ch}</button>
                );
              })}
            </div>
          )}
        </div>

        {/* Content */}
        <div style={{ padding: "14px 14px 88px" }}>
          {view === "weekly" && <WeeklyView schedule={schedule} notes={notes} showWeekend={showWeekend} weekRange={weekRange} dayDates={dayDates} weekIndex={weekIndex} setWeekIndex={setWeekIndex} totalWeeks={totalWeeks} />}
          {view === "child"  && <ChildView  schedule={schedule} notes={notes} child={selChild} showWeekend={showWeekend} weekRange={weekRange} dayDates={dayDates} weekIndex={weekIndex} setWeekIndex={setWeekIndex} totalWeeks={totalWeeks} />}
          {view === "admin"  && <AdminPanel schedule={schedule} setSchedule={setSchedule} notes={notes} setNotes={setNotes} activities={activities} setActivities={setActivities} showWeekend={showWeekend} setShowWeekend={setShowWeekend} weekRange={weekRange} dayDates={dayDates} weekIndex={weekIndex} setWeekIndex={setWeekIndex} weekSchedules={weekSchedules} setWeekSchedules={setWeekSchedules} totalWeeks={totalWeeks} />}
        </div>

        {/* Bottom nav */}
        <div style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 430, background: "rgba(255,255,255,0.96)", backdropFilter: "blur(20px)", borderTop: "1px solid #E8E8E8", display: "flex", padding: "8px 0 18px", zIndex: 200 }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setView(t.id)} style={{ flex: 1, border: "none", background: "transparent", display: "flex", flexDirection: "column", alignItems: "center", gap: 3, cursor: "pointer", padding: "5px 0" }}>
              <span style={{ fontSize: 19 }}>{t.icon}</span>
              <span style={{ fontFamily: "'Nunito', sans-serif", fontWeight: view === t.id ? 900 : 600, fontSize: 10, color: view === t.id ? "#1a1a2e" : "#BBBBBB", transition: "all 0.2s" }}>{t.label}</span>
              {view === t.id && <div style={{ width: 22, height: 3, borderRadius: 2, background: "#1a1a2e" }} />}
            </button>
          ))}
        </div>

        {showPrint && <PrintPreview schedule={schedule} notes={notes} activities={activities} showWeekend={showWeekend} weekRange={weekRange} dayDates={dayDates} onClose={() => setShowPrint(false)} />}
      </div>
    </>
  );
}
