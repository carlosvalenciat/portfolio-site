import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const alt =
  "Carlos Valencia — AI & Automation Engineer. Integrations, AI agents and ERP.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Social preview, generated at build time.
 *
 * This is the one image the site genuinely needs: it is what a recruiter
 * sees when the link is pasted into LinkedIn, Slack or WhatsApp. Built
 * from the same tokens as the page — no external asset, no network fetch,
 * nothing proprietary.
 */
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
          background: "#07080b",
          padding: 72,
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -220,
            left: -140,
            width: 780,
            height: 780,
            borderRadius: 9999,
            background:
              "radial-gradient(circle, rgba(14,116,144,0.42) 0%, rgba(7,8,11,0) 66%)",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -300,
            right: -160,
            width: 760,
            height: 760,
            borderRadius: 9999,
            background:
              "radial-gradient(circle, rgba(34,211,238,0.20) 0%, rgba(7,8,11,0) 68%)",
            display: "flex",
          }}
        />

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 21,
              letterSpacing: 4,
              color: "#22d3ee",
              fontWeight: 600,
              display: "flex",
            }}
          >
            AI &amp; AUTOMATION ENGINEER
          </div>
          <div
            style={{
              fontSize: 104,
              color: "#eceff5",
              fontWeight: 700,
              letterSpacing: -3.5,
              marginTop: 26,
              display: "flex",
            }}
          >
            Carlos Valencia
          </div>
          <div
            style={{
              fontSize: 33,
              color: "#9aa3b2",
              marginTop: 18,
              display: "flex",
            }}
          >
            Integrations · AI Agents · ERP
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid rgba(255,255,255,0.10)",
            paddingTop: 30,
          }}
        >
          <div style={{ fontSize: 25, color: "#767f8f", display: "flex" }}>
            cvalenciat.dev
          </div>
          <div style={{ fontSize: 25, color: "#767f8f", display: "flex" }}>
            Guadalajara, México
          </div>
        </div>
      </div>
    ),
    size,
  );
}
