import { ImageResponse } from "next/og";

/**
 * Default Open Graph + Twitter card image for the SATMA frontend.
 * Lives at the (frontend) route-group level so every public page
 * inherits this image when shared on Twitter/X, LinkedIn, WhatsApp,
 * Facebook, Slack, Discord, ChatGPT (link cards) etc.
 *
 * Per-route overrides are easy to add later: drop a file
 * `opengraph-image.tsx` next to that page.tsx and Next.js prefers it.
 *
 * Rendered at request-time via Next's `ImageResponse` (built on Satori).
 * Uses system-stack fonts so we don't have to ship a custom font
 * payload — the visual identity comes from color + composition.
 */

// Defaults to Node.js runtime — Next 16 supports ImageResponse on
// the regular runtime, no edge declaration needed.
export const alt =
  "SATMA — agencia creativa · Marketing humano. Potenciado con IA.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  // Palette inlined here so the visual is stable even if globals.css drifts.
  const ink = "#0F1117";
  const navy = "#181A21";
  const periwinkle = "#B3CBFF";
  const off = "#F4F6FB";
  const muted = "#8A93A6";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: `linear-gradient(135deg, ${navy} 0%, ${ink} 100%)`,
          color: off,
          position: "relative",
        }}
      >
        {/* Decorative periwinkle glow, top-right */}
        <div
          style={{
            position: "absolute",
            top: -250,
            right: -250,
            width: 700,
            height: 700,
            borderRadius: 9999,
            background: `radial-gradient(closest-side, ${periwinkle}33, transparent 70%)`,
            display: "flex",
          }}
        />

        {/* Top row: eyebrow + brand mark */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          <div
            style={{
              fontSize: 20,
              letterSpacing: "0.32em",
              textTransform: "uppercase",
              color: muted,
              display: "flex",
            }}
          >
            Agencia creativa · Monterrey
          </div>
          <div
            style={{
              fontSize: 130,
              fontWeight: 800,
              letterSpacing: "-0.05em",
              lineHeight: 1,
              color: off,
              display: "flex",
            }}
          >
            satma
          </div>
        </div>

        {/* Center quote */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 24,
            maxWidth: 1000,
          }}
        >
          <div
            style={{
              fontSize: 64,
              lineHeight: 1.1,
              letterSpacing: "-0.025em",
              fontWeight: 500,
              color: off,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <span style={{ display: "flex" }}>Marketing humano.</span>
            <span style={{ display: "flex", color: periwinkle, fontWeight: 300 }}>
              Potenciado con IA.
            </span>
          </div>
        </div>

        {/* Bottom row: URL + verticals */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
          }}
        >
          <div
            style={{
              fontSize: 28,
              color: off,
              fontWeight: 600,
              display: "flex",
            }}
          >
            satma.mx
          </div>
          <div
            style={{
              fontSize: 16,
              color: muted,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              display: "flex",
            }}
          >
            Jurídico · Médico · Asociaciones · Retail · Gobierno
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
