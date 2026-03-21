import { useState } from "react";
import { supabase } from "../../lib/supabase";
import { ADMIN_CREDS } from "../../constants";

export default function AdminLogin({ onLogin }) {
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [err,      setErr]      = useState("");
  const [shake,    setShake]    = useState(false);

  const triggerShake = (msg) => {
    setErr(msg);
    setShake(true);
    setTimeout(() => setShake(false), 500);
    setTimeout(() => setErr(""), 3000);
  };

  const handleLogin = async () => {
    if (!email || !password) {
      triggerShake("Email dan password harus diisi!");
      return;
    }

    // ── Mode Supabase Auth (Fase 2+) ────────────────────────────────────────
    if (supabase) {
      setLoading(true);
      try {
        const { error } = await supabase.auth.signInWithPassword({
          email:    email.trim(),
          password: password,
        });
        if (error) {
          // Terjemahkan pesan error Supabase ke Bahasa Indonesia
          const msg = error.message.includes("Invalid login")
            ? "Email atau password salah!"
            : error.message.includes("Email not confirmed")
            ? "Email belum dikonfirmasi. Cek inbox email kamu."
            : error.message.includes("Too many requests")
            ? "Terlalu banyak percobaan login. Tunggu beberapa menit."
            : "Login gagal: " + error.message;
          triggerShake(msg);
        } else {
          onLogin();
        }
      } catch (e) {
        triggerShake("Terjadi kesalahan koneksi. Coba lagi.");
      } finally {
        setLoading(false);
      }
      return;
    }

    // ── Fallback: credentials hardcoded (Fase 1 — tanpa Supabase) ──────────
    if (email === ADMIN_CREDS.user && password === ADMIN_CREDS.pass) {
      onLogin();
    } else {
      triggerShake("Username atau password salah!");
    }
  };

  // Label field: jika Supabase aktif tampilkan "EMAIL", jika tidak "USERNAME"
  const isSupabase   = Boolean(supabase);
  const fieldLabel   = isSupabase ? "EMAIL" : "USERNAME";
  const placeholder  = isSupabase ? "Masukkan email admin" : "Masukkan username";
  const inputType    = isSupabase ? "email" : "text";

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
        {/* Badge mode */}
        <div style={{
          display: "inline-block", marginTop: 10,
          fontSize: 10, fontWeight: 700, fontFamily: "'Nunito', sans-serif",
          background: isSupabase ? "rgba(76,175,80,0.25)" : "rgba(255,255,255,0.12)",
          color: isSupabase ? "#A5D6A7" : "#ffffff80",
          border: `1px solid ${isSupabase ? "#A5D6A750" : "rgba(255,255,255,0.2)"}`,
          borderRadius: 6, padding: "3px 10px",
        }}>
          {isSupabase ? "🔒 Supabase Auth" : "🔑 Mode Lokal"}
        </div>
      </div>

      {/* Form */}
      <div className={shake ? "shake" : ""} style={{ borderRadius: 18, background: "#fff", border: "1px solid #EBEBEB", padding: "22px 20px", boxShadow: "0 2px 16px #0000000A" }}>

        {/* Email / Username */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 11, color: "#AAA", marginBottom: 6, letterSpacing: 0.5 }}>
            {fieldLabel}
          </div>
          <div style={{ position: "relative" }}>
            <span style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", fontSize: 16, pointerEvents: "none" }}>
              {isSupabase ? "✉️" : "👤"}
            </span>
            <input
              type={inputType}
              placeholder={placeholder}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              autoComplete={isSupabase ? "email" : "username"}
              style={inp}
            />
          </div>
        </div>

        {/* Password */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 11, color: "#AAA", marginBottom: 6, letterSpacing: 0.5 }}>
            PASSWORD
          </div>
          <div style={{ position: "relative" }}>
            <span style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", fontSize: 16, pointerEvents: "none" }}>🔑</span>
            <input
              type={showPass ? "text" : "password"}
              placeholder="Masukkan password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              autoComplete="current-password"
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

        {/* Error message */}
        {err && (
          <div style={{ marginBottom: 14, padding: "10px 14px", borderRadius: 10, background: "#FFEBEE", border: "1px solid #FFCDD2", fontFamily: "'Nunito', sans-serif", fontSize: 12, fontWeight: 700, color: "#C62828" }}>
            ⚠️ {err}
          </div>
        )}

        {/* Submit button */}
        <button
          onClick={handleLogin}
          disabled={loading}
          style={{
            width: "100%", padding: "14px", borderRadius: 13, border: "none",
            background: loading
              ? "linear-gradient(135deg, #555, #777)"
              : "linear-gradient(135deg, #1a1a2e, #0f3460)",
            color: "#fff", fontFamily: "'Nunito', sans-serif",
            fontWeight: 900, fontSize: 15, cursor: loading ? "not-allowed" : "pointer",
            boxShadow: loading ? "none" : "0 4px 16px #1a1a2e40",
            transition: "all 0.2s",
          }}
        >
          {loading ? "⏳ Memverifikasi..." : "Masuk ke Admin Panel →"}
        </button>

        <div style={{ textAlign: "center", marginTop: 14, fontFamily: "'Nunito', sans-serif", fontSize: 11, color: "#CCC" }}>
          Hanya untuk administrator MARVEL
        </div>
      </div>
    </div>
  );
}
