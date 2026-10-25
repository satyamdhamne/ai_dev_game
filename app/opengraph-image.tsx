import { ImageResponse } from "next/og";

export const alt = "Spot the AI Bug: AI writes your code. Can you catch its bugs?";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const CODE = [
  { n: 17, text: "total_pages = max(1, -(-len(items) // per_page))", bug: false },
  { n: 18, text: "start = page * per_page", bug: true },
  { n: 19, text: "end = start + per_page", bug: false },
];

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0a0d12",
          color: "#e6e9ef",
          padding: "64px 72px",
          fontFamily: "monospace",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", fontSize: 34, fontWeight: 700 }}>
          <span style={{ color: "#3ddc84", marginRight: 16 }}>&gt;</span>
          <span>spot_the</span>
          <span style={{ color: "#3ddc84" }}>_ai_</span>
          <span>bug</span>
          <span style={{ width: 18, height: 34, background: "#3ddc84", marginLeft: 10 }} />
        </div>

        <div style={{ display: "flex", flexDirection: "column", fontSize: 30, borderRadius: 20, border: "2px solid #232a36", background: "#10141b", padding: "20px 0" }}>
          {CODE.map((l) => (
            <div
              key={l.n}
              style={{
                display: "flex",
                padding: "8px 28px",
                background: l.bug ? "rgba(255,95,102,0.15)" : "transparent",
                borderLeft: l.bug ? "6px solid #ff5f66" : "6px solid transparent",
              }}
            >
              <span style={{ color: l.bug ? "#ff5f66" : "#5a6478", width: 64 }}>{l.bug ? "x" : l.n}</span>
              <span>{l.text}</span>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 60, fontWeight: 800, fontFamily: "sans-serif", letterSpacing: -1.5 }}>
            AI writes your code.
          </div>
          <div style={{ fontSize: 60, fontWeight: 800, fontFamily: "sans-serif", color: "#3ddc84", letterSpacing: -1.5 }}>
            Can you catch its bugs?
          </div>
          <div style={{ marginTop: 18, fontSize: 26, color: "#8a93a6" }}>A daily game for developers · spottheaibug.com</div>
        </div>
      </div>
    ),
    size,
  );
}
