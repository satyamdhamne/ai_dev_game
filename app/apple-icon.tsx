import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#0a0d12" }}>
        <svg width="132" height="132" viewBox="0 0 64 64" fill="none" stroke="#3ddc84" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 22l8 8-8 8" />
          <ellipse cx="41" cy="35" rx="8" ry="10" />
          <path d="M41 25v20M33 31h-4M53 31h-4M33 40h-4M53 40h-4M37 25l-3-4M45 25l3-4" />
        </svg>
      </div>
    ),
    size,
  );
}
