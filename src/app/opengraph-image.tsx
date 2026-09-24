import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

/**
 * The card a shared link shows: the slate of a private screening, and
 * nothing else. The proxy serves this same image for every path, so a
 * client's name never appears in a preview on Slack, WhatsApp or mail.
 */
export const alt = "Tilted Needle. A private screening.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const STAGE = "#0b0b0c";
const INK = "#f2efe9";
const MID = "#8e8a82";
const TALLY = "#e2422b";
const RULE = "rgba(242,239,233,0.22)";

// Satori reads TTF/OTF/WOFF only: these are the static WOFF copies of the
// variable faces the site uses. Flexbox and inline styles only.
async function font(file: string) {
  return readFile(join(process.cwd(), "src/app/fonts", file));
}

export default async function Image() {
  const [display, serif, mono] = await Promise.all([font("big-shoulders-display-800.woff"), font("instrument-serif-italic.woff"), font("jetbrains-mono-500.woff")]);
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: STAGE, color: INK, padding: 64 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontFamily: "Mono", fontSize: 22, letterSpacing: "0.14em", color: MID }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 12, height: 12, borderRadius: 12, background: TALLY }} />
            <span>PRIVATE SCREENING</span>
          </div>
          <span>TILTED NEEDLE</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontFamily: "Display", fontSize: 168, lineHeight: 0.86, letterSpacing: "-0.01em", textTransform: "uppercase" }}>Enter the</div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 28 }}>
            <div style={{ fontFamily: "Serif", fontSize: 168, lineHeight: 0.86, fontStyle: "italic" }}>room.</div>
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", borderTop: "1px solid " + RULE, paddingTop: 24, fontFamily: "Mono", fontSize: 20, letterSpacing: "0.12em", color: MID }}>
          <span>YOUR COMPLETE VIRAL CONTENT SYSTEM</span>
          <span>ACCESS CODE REQUIRED</span>
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
