import { ImageResponse } from "next/og";

export const alt = "Ethan Saux — Je transforme des idées en produits numériques";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "flex-start",
          background:
            "radial-gradient(circle at 86% 10%, rgba(200,144,66,.28), transparent 32%), #0a0908",
          color: "#f0e8dc",
          display: "flex",
          flexDirection: "column",
          fontFamily: "Arial, sans-serif",
          height: "100%",
          justifyContent: "space-between",
          padding: "72px 84px",
          width: "100%",
        }}
      >
        <div style={{ fontSize: 24, letterSpacing: 9 }}>ETHAN SAUX</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 26 }}>
          <div style={{ fontSize: 69, lineHeight: 1.06, maxWidth: 940 }}>
            Je transforme des idées en produits numériques.
          </div>
          <div style={{ color: "#c89042", fontSize: 21, letterSpacing: 5 }}>
            CONCEPTION · DÉVELOPPEMENT · PUBLICATION
          </div>
        </div>
      </div>
    ),
    size,
  );
}
