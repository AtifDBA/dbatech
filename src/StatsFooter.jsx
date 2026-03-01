import { useEffect, useState } from "react";

// ✅ Drop this component into your React project
// Usage: import StatsFooter from "./StatsFooter";
// Then add <StatsFooter /> at the bottom of your App.js or layout component

const stats = [
  { value: "11", label: "Total Topics", type: "number" },
  { value: "13", label: "Knowledge Pages", type: "number" },
  { value: "3",  label: "Technology Areas", type: "number" },
  { value: null, label: "Secured Admin",    type: "lock" },
];

function LockIcon() {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0 }}>
      <div
        style={{
          width: 14,
          height: 10,
          border: "3px solid #f5c518",
          borderBottom: "none",
          borderRadius: "7px 7px 0 0",
          marginBottom: -1,
        }}
      />
      <div
        style={{
          width: 22,
          height: 17,
          background: "#f5c518",
          borderRadius: 4,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: 5,
            height: 7,
            borderRadius: 3,
            background: "#0d1b2e",
            marginTop: 2,
          }}
        />
      </div>
    </div>
  );
}

export default function StatsFooter() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Trigger fade-in after mount
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <footer
      style={{
        background: "linear-gradient(135deg, #0d1b2e 0%, #112240 100%)",
        borderTop: "1px solid #1e3a5f",
        padding: "30px 40px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 0,
        flexWrap: "wrap",
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      {stats.map((stat, i) => (
        <div
          key={i}
          style={{ display: "flex", alignItems: "center", gap: 0 }}
        >
          {/* Stat item */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 8,
              padding: "0 48px",
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(14px)",
              transition: `opacity 0.5s ease ${i * 0.1}s, transform 0.5s ease ${i * 0.1}s`,
              cursor: stat.type === "lock" ? "default" : "default",
            }}
          >
            {stat.type === "lock" ? (
              <LockIcon />
            ) : (
              <span
                style={{
                  fontFamily: "'Georgia', 'Times New Roman', serif",
                  fontSize: 30,
                  fontWeight: 700,
                  color: "#e8edf5",
                  lineHeight: 1,
                  letterSpacing: "-0.5px",
                }}
              >
                {stat.value}
              </span>
            )}
            <span
              style={{
                fontSize: 12,
                fontWeight: 500,
                color: "#7a90aa",
                letterSpacing: "0.05em",
                textAlign: "center",
                fontFamily: "'Segoe UI', sans-serif",
              }}
            >
              {stat.label}
            </span>
          </div>

          {/* Divider between items (not after last) */}
          {i < stats.length - 1 && (
            <div
              style={{
                width: 1,
                height: 44,
                background: "#1e3a5f",
                flexShrink: 0,
              }}
            />
          )}
        </div>
      ))}

      {/* Optional copyright line */}
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          marginTop: 20,
        }}
      >
        <span
          style={{
            display: "inline-block",
            fontSize: 11,
            color: "#3d5470",
            letterSpacing: "0.06em",
            fontFamily: "'Segoe UI', sans-serif",
            borderTop: "1px solid #1a2f48",
            paddingTop: 14,
          }}
        >
          © {new Date().getFullYear()} ITLearn Hub · All rights reserved
        </span>
      </div>
    </footer>
  );
}
