import { ImageResponse } from "next/og";

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

/** Branded 1200x630 share card with a page-specific title. */
export function renderOgCard({ eyebrow, title, footer }: { eyebrow: string; title: string; footer?: string }) {
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
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", fontSize: 34, fontWeight: 700, fontFamily: "monospace" }}>
          <span style={{ color: "#3ddc84", marginRight: 16 }}>&gt;</span>
          <span>spot_the</span>
          <span style={{ color: "#3ddc84" }}>_ai_</span>
          <span>bug</span>
          <span style={{ width: 18, height: 34, background: "#3ddc84", marginLeft: 10 }} />
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 30, color: "#3ddc84", fontFamily: "monospace", marginBottom: 20 }}>{`// ${eyebrow}`}</div>
          <div style={{ fontSize: title.length > 48 ? 64 : 76, fontWeight: 800, letterSpacing: -1.5, lineHeight: 1.08 }}>{title}</div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 26, color: "#8a93a6" }}>
          <span>{footer ?? "Find the bug · answers & fixes included"}</span>
          <span>spottheaibug.com</span>
        </div>
      </div>
    ),
    ogSize,
  );
}
