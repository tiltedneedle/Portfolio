import { ImageResponse } from "next/og";

export const alt = "Tilted Needle — Built to make brands go viral";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const stats = [
  { value: "2B+", label: "ORGANIC VIEWS" },
  { value: "$250M+", label: "REVENUE GENERATED" },
  { value: "11+", label: "FLAGSHIP CLIENTS" },
];

// Rendered by Satori at build time: flexbox only, inline styles only.
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
          background: "#000000",
          padding: "72px 80px",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -260,
            left: -160,
            width: 720,
            height: 720,
            borderRadius: 9999,
            background:
              "radial-gradient(circle, rgba(255,255,255,0.10) 0%, rgba(0,0,0,0) 70%)",
            display: "flex",
          }}
        />

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: 9999,
              background: "#f5f5f7",
              display: "flex",
            }}
          />
          <div
            style={{
              fontSize: 26,
              color: "#f5f5f7",
              letterSpacing: "-0.02em",
              fontWeight: 600,
              display: "flex",
            }}
          >
            Tilted Needle
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 84,
              fontWeight: 700,
              color: "#f5f5f7",
              letterSpacing: "-0.035em",
              lineHeight: 1.04,
              display: "flex",
            }}
          >
            Built to make brands
          </div>
          <div
            style={{
              fontSize: 84,
              fontWeight: 700,
              color: "#a1a1a6",
              letterSpacing: "-0.035em",
              lineHeight: 1.04,
              display: "flex",
            }}
          >
            go viral.
          </div>
          <div
            style={{
              marginTop: 26,
              fontSize: 28,
              color: "#86868b",
              letterSpacing: "-0.01em",
              display: "flex",
            }}
          >
            Short-form specialists with a full growth stack. London · Dubai · Global.
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "flex-end", gap: 64 }}>
          {stats.map((stat) => (
            <div key={stat.label} style={{ display: "flex", flexDirection: "column" }}>
              <div
                style={{
                  fontSize: 52,
                  fontWeight: 700,
                  color: "#f5f5f7",
                  letterSpacing: "-0.02em",
                  display: "flex",
                }}
              >
                {stat.value}
              </div>
              <div
                style={{
                  marginTop: 6,
                  fontSize: 18,
                  color: "#86868b",
                  letterSpacing: "0.1em",
                  display: "flex",
                }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
    size
  );
}
