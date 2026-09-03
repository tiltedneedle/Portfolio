import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const alt = "Tilted Needle. Cut for the scroll.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const readouts = [
  { value: "2B+", label: "ORGANIC VIEWS" },
  { value: "$250M+", label: "REVENUE GENERATED" },
  { value: "11+", label: "FLAGSHIP CLIENTS" },
];

const STAGE = "#0b0b0c";
const INK = "#f2efe9";
const MID = "#8e8a82";
const FAINT = "#56534e";
const RULE = "rgba(242,239,233,0.24)";

// Satori (which renders this at build time) reads TTF/OTF/WOFF only, so the
// three faces here are static WOFF copies of the variable woff2 the site uses.
// Flexbox and inline styles only; no CSS variables, no repeating gradients.
async function font(file: string) {
  return readFile(join(process.cwd(), "src/app/fonts", file));
}

function Row({ left, right }: { left: [string, string]; right: [string, string] }) {
  const cell = (k: string, v: string, align: "flex-start" | "flex-end") => (
    <div style={{ display: "flex", gap: 14, justifyContent: align, fontFamily: "Mono", fontSize: 20, letterSpacing: "0.12em", color: MID }}>
      <span style={{ color: FAINT }}>{k}</span>
      <span>{v}</span>
    </div>
  );
  return (
    <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
      {cell(left[0], left[1], "flex-start")}
      {cell(right[0], right[1], "flex-end")}
    </div>
  );
}

export default async function OpengraphImage() {
  const [display, serif, mono] = await Promise.all([
    font("big-shoulders-display-800.woff"),
    font("instrument-serif-italic.woff"),
    font("jetbrains-mono-500.woff"),
  ]);

  // The clapper stripe: alternating blocks, since Satori has no repeating gradient.
  const stripe = Array.from({ length: 24 }, (_, i) => (
    <div key={i} style={{ width: 50, height: 18, background: i % 2 === 0 ? INK : "transparent", transform: "skewX(-30deg)" }} />
  ));

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: STAGE,
          padding: "44px 72px 48px",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          <div style={{ display: "flex", overflow: "hidden", width: "100%", gap: 0 }}>{stripe}</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, borderTop: `1px solid ${RULE}`, borderBottom: `1px solid ${RULE}`, padding: "14px 0" }}>
            <Row left={["PROD.", "TILTED NEEDLE"]} right={["REEL", "2026"]} />
            <Row left={["SCENE", "01"]} right={["TAKE", "01"]} />
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontFamily: "Display", fontSize: 150, lineHeight: 0.86, color: INK, letterSpacing: "0.01em", display: "flex", whiteSpace: "nowrap" }}>
            CUT FOR THE
          </div>
          <div style={{ fontFamily: "Serif", fontSize: 132, lineHeight: 0.9, color: INK, display: "flex", marginTop: 6 }}>scroll.</div>
        </div>

        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", borderTop: `1px solid ${RULE}`, paddingTop: 18 }}>
          <div style={{ display: "flex", gap: 56 }}>
            {readouts.map((r) => (
              <div key={r.label} style={{ display: "flex", flexDirection: "column" }}>
                <div style={{ fontFamily: "Display", fontSize: 54, lineHeight: 1, color: INK, display: "flex" }}>{r.value}</div>
                <div style={{ marginTop: 8, fontFamily: "Mono", fontSize: 16, letterSpacing: "0.12em", color: MID, display: "flex" }}>{r.label}</div>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, fontFamily: "Mono", fontSize: 18, letterSpacing: "0.12em", color: MID }}>
            <div style={{ width: 10, height: 10, borderRadius: 999, background: "#e2422b", display: "flex" }} />
            LONDON · DUBAI
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Display", data: display, weight: 800, style: "normal" },
        { name: "Serif", data: serif, weight: 400, style: "italic" },
        { name: "Mono", data: mono, weight: 500, style: "normal" },
      ],
    }
  );
}
