import { ALL_DAYS, WEEKDAYS, WEEKEND } from "../../constants";
import { getWeekRange, getWeekDates } from "../../utils/weekHelpers";
import Toggle from "../Toggle";
import { EMPTY_WEEK } from "../../constants";

export default function TabTampilan({
  showWeekend, setShowWeekend,
  weekIndex, setWeekIndex,
  weekSchedules, setWeekSchedules,
  totalWeeks, dayDates,
}) {
  const nextIdx = Math.max(...Object.keys(weekSchedules).map(Number)) + 1;
  const nextRange = getWeekRange(nextIdx);

  const handleAddWeek = () => {
    setWeekSchedules((prev) => ({ ...prev, [nextIdx]: EMPTY_WEEK }));
    setWeekIndex(nextIdx);
  };

  return (
    <>
      {/* Weekend toggle card */}
      <div style={{ borderRadius: 16, background: "#fff", border: "1px solid #EBEBEB", overflow: "hidden", marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 18px", borderBottom: "1px solid #F5F5F5" }}>
          <div>
            <div style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 14, color: "#333" }}>
              🌙 Tampilkan Sabtu &amp; Minggu
            </div>
            <div style={{ fontFamily: "'Nunito', sans-serif", fontSize: 11, color: "#AAA", marginTop: 2 }}>
              {showWeekend ? "Semua hari ditampilkan (Senin–Minggu)" : "Hanya hari kerja (Senin–Jumat)"}
            </div>
          </div>
          <Toggle value={showWeekend} onChange={setShowWeekend} />
        </div>

        {/* Active days preview */}
        <div style={{ padding: "14px 18px", background: "#FAFAFA" }}>
          <div style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 11, color: "#AAA", marginBottom: 8, letterSpacing: 0.5 }}>
            HARI AKTIF
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {ALL_DAYS.map((d) => {
              const iw     = WEEKEND.includes(d);
              const active = !iw || showWeekend;
              return (
                <div
                  key={d}
                  style={{
                    padding: "4px 10px", borderRadius: 8,
                    background: active ? (iw ? "#37474F" : "#1a1a2e") : "#EEE",
                    color: active ? "#fff" : "#BBB",
                    fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: 11,
                    transition: "all 0.3s",
                  }}
                >
                  {d}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Week manager */}
      <div style={{ borderRadius: 14, background: "#fff", border: "1px solid #EBEBEB", padding: "14px 18px" }}>
        <div style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 13, color: "#333", marginBottom: 12, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span>📅 Kelola Minggu</span>
          <span style={{ fontSize: 11, fontWeight: 700, background: "#1a1a2e", color: "#fff", borderRadius: 6, padding: "2px 8px" }}>
            {totalWeeks} minggu
          </span>
        </div>

        {/* Week list */}
        <div style={{ display: "flex", flexDirection: "column", gap: 7, marginBottom: 14 }}>
          {Object.keys(weekSchedules).map((wi) => {
            const wiNum     = parseInt(wi);
            const wr        = getWeekRange(wiNum);
            const wd        = getWeekDates(wiNum);
            const isCurrent = wiNum === weekIndex;
            return (
              <div
                key={wi}
                onClick={() => setWeekIndex(wiNum)}
                style={{
                  borderRadius: 11,
                  border: isCurrent ? "2px solid #1a1a2e" : "1px solid #EBEBEB",
                  background: isCurrent ? "#1a1a2e" : "#FAFAFA",
                  padding: "10px 13px", cursor: "pointer", transition: "all 0.2s",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                  <div style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 12, color: isCurrent ? "#fff" : "#333" }}>
                    {isCurrent ? "📍" : "📅"} Minggu ke-{wiNum + 1}
                  </div>
                  {isCurrent && (
                    <span style={{ fontFamily: "'Nunito', sans-serif", fontSize: 9, fontWeight: 800, background: "rgba(255,255,255,0.2)", color: "#fff", borderRadius: 5, padding: "2px 7px" }}>
                      AKTIF
                    </span>
                  )}
                </div>
                <div style={{ fontFamily: "'Nunito', sans-serif", fontSize: 11, color: isCurrent ? "rgba(255,255,255,0.75)" : "#888", fontWeight: 600 }}>
                  {wr.start} — {wr.end}
                </div>
                <div style={{ display: "flex", gap: 4, marginTop: 6, flexWrap: "wrap" }}>
                  {WEEKDAYS.map((d) => (
                    <span
                      key={d}
                      style={{
                        fontFamily: "'Nunito', sans-serif", fontSize: 9, fontWeight: 700,
                        background: isCurrent ? "rgba(255,255,255,0.15)" : "#EBEBEB",
                        color: isCurrent ? "#fff" : "#777",
                        borderRadius: 4, padding: "1px 5px",
                      }}
                    >
                      {wd[d]}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Add week button */}
        <button
          onClick={handleAddWeek}
          style={{
            width: "100%", padding: "12px", borderRadius: 12,
            border: "2px dashed #1a1a2e40", background: "#FAFAFA", color: "#1a1a2e",
            fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 13, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
          }}
        >
          ➕ Tambah Minggu Baru
          <span style={{ fontSize: 11, fontWeight: 600, color: "#888" }}>
            ({nextRange.start} — {nextRange.end})
          </span>
        </button>

        {/* Divider */}
        <div style={{ margin: "14px 0 12px", borderTop: "1px solid #F0F0F0" }} />

        {/* Active week date breakdown */}
        <div style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 11, color: "#AAA", marginBottom: 8, letterSpacing: 0.5 }}>
          TANGGAL MINGGU AKTIF
        </div>
        {ALL_DAYS.map((d) => (
          <div key={d} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", borderBottom: "1px solid #F8F8F8" }}>
            <span style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: 12, color: WEEKEND.includes(d) ? "#90A4AE" : "#333" }}>
              {WEEKEND.includes(d) ? "🌙" : "☀️"} {d}
            </span>
            <span style={{ fontFamily: "'Nunito', sans-serif", fontSize: 12, color: "#888", fontWeight: 600 }}>
              {dayDates[d]}
            </span>
          </div>
        ))}
      </div>
    </>
  );
}
