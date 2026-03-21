import { supabase } from '../../lib/supabase';
import { useState } from "react";
import { ADMIN_CREDS } from "../../constants";

export default function AdminLogin({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [err,      setErr]      = useState("");
  const [shake,    setShake]    = useState(false);

  //const handleLogin = () => {
  //  if (username === ADMIN_CREDS.user && password === ADMIN_CREDS.pass) {
  //    onLogin();
  //  } else {
  //    setErr("Username atau password salah!");
  //    setShake(true);
  //    setTimeout(() => setShake(false), 500);
  //    setTimeout(() => setErr(""), 3000);
  //  }
  //};

// Ganti fungsi handleLogin menjadi:
const handleLogin = async () => {
  setErr("");
  const { error } = await supabase.auth.signInWithPassword({
    email: username,    // field username sekarang diisi dengan email
    password: password,
  });
  if (error) {
    setErr('Email atau password salah!');
    setShake(true);
    setTimeout(() => setShake(false), 500);
  } else {
    onLogin();
  }
};


  const inp = {
    width: "100%", padding: "12px 14px 12px 42px", borderRadius: 12,
    border: "1.5px solid #E0E0E0", fontFamily: "'Nunito', sans-serif",
    fontSize: 14, background: "#FAFAFA", boxSizing: "border-box",
    outline: "none", color: "#333",
  };

  return (
    <div>
      <style>
        {"@keyframes shake{0%,100%{transform:translateX(0)}20%{transform:translateX(-8px)}40%{transform:translateX(8px)}60%{transform:translateX(-6px)}80%{transform:translateX(6px)}}.shake{animation:shake 0.45s ease;}"}
      </style>

      {/* Hero */}
      <div style={{ borderRadius: 20, padding: "28px 24px 24px", background: "linear-gradient(135deg, #1a1a2e, #0f3460)", color: "#fff", textAlign: "center", marginBottom: 20, boxShadow: "0 8px 32px #1a1a2e40" }}>
        <div style={{ fontSize: 48, marginBottom: 10 }}>🔐</div>
        <div style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 900, fontSize: 22 }}>Admin Panel</div>
        <div style={{ fontFamily: "'Nunito', sans-serif", fontSize: 12, opacity: 0.6, marginTop: 4 }}>
          Masukkan kredensial untuk melanjutkan
        </div>
      </div>

      {/* Form */}
      <div className={shake ? "shake" : ""} style={{ borderRadius: 18, background: "#fff", border: "1px solid #EBEBEB", padding: "22px 20px", boxShadow: "0 2px 16px #0000000A" }}>
        {/* Username */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 11, color: "#AAA", marginBottom: 6, letterSpacing: 0.5 }}>USERNAME</div>
          <div style={{ position: "relative" }}>
            <span style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", fontSize: 16, pointerEvents: "none" }}>👤</span>
            <input
              type="text"
              placeholder="Masukkan email admin / username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              style={inp}
            />
          </div>
        </div>

        {/* Password */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 11, color: "#AAA", marginBottom: 6, letterSpacing: 0.5 }}>PASSWORD</div>
          <div style={{ position: "relative" }}>
            <span style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", fontSize: 16, pointerEvents: "none" }}>🔑</span>
            <input
              type={showPass ? "text" : "password"}
              placeholder="Masukkan password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              style={{ ...inp, paddingRight: 44 }}
            />
            <button
              onClick={() => setShowPass(!showPass)}
              style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", border: "none", background: "transparent", cursor: "pointer", fontSize: 16, padding: 4 }}
            >
              {showPass ? "🙈" : "👁️"}
            </button>
          </div>
        </div>

        {err && (
          <div style={{ marginBottom: 14, padding: "10px 14px", borderRadius: 10, background: "#FFEBEE", border: "1px solid #FFCDD2", fontFamily: "'Nunito', sans-serif", fontSize: 12, fontWeight: 700, color: "#C62828" }}>
            ⚠️ {err}
          </div>
        )}

        <button
          onClick={handleLogin}
          style={{ width: "100%", padding: "14px", borderRadius: 13, border: "none", background: "linear-gradient(135deg, #1a1a2e, #0f3460)", color: "#fff", fontFamily: "'Nunito', sans-serif", fontWeight: 900, fontSize: 15, cursor: "pointer", boxShadow: "0 4px 16px #1a1a2e40" }}
        >
          Masuk ke Admin Panel →
        </button>
        <div style={{ textAlign: "center", marginTop: 14, fontFamily: "'Nunito', sans-serif", fontSize: 11, color: "#CCC" }}>
          Hanya untuk administrator MARVEL
        </div>
      </div>
    </div>
  );
}
