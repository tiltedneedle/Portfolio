"use client";

/**
 * The root layout itself failed, so nothing from globals.css or the fonts
 * can be assumed. Plain, legible, in the room's colours by value.
 */
export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, background: "#0b0b0c", color: "#f2efe9", fontFamily: "system-ui, sans-serif" }}>
        <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", padding: "48px 24px" }}>
          <div style={{ maxWidth: 720, margin: "0 auto", width: "100%" }}>
            <p style={{ fontFamily: "ui-monospace, Consolas, monospace", fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase", color: "#8e8a82" }}>
              Fault / The room went dark
            </p>
            <h1 style={{ fontSize: "clamp(40px, 9vw, 120px)", lineHeight: 0.9, margin: "24px 0 0", fontWeight: 800, textTransform: "uppercase" }}>Cut.</h1>
            <p style={{ maxWidth: "44ch", color: "#8e8a82", lineHeight: 1.6, marginTop: 24 }}>
              The site failed before it could draw anything. Reload the page; if it keeps happening, tell us and mention this reference.
            </p>
            {error.digest && (
              <p style={{ fontFamily: "ui-monospace, Consolas, monospace", fontSize: 12, color: "#56534e", marginTop: 12 }}>Ref {error.digest}</p>
            )}
            <button
              type="button"
              onClick={reset}
              style={{
                marginTop: 32,
                padding: "12px 28px",
                borderRadius: 999,
                border: 0,
                background: "#f2efe9",
                color: "#0b0b0c",
                fontSize: 15,
                cursor: "pointer",
              }}
            >
              Try again
            </button>
          </div>
        </main>
      </body>
    </html>
  );
}
