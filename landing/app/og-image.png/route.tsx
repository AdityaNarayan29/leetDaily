import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0a0a0a",
          backgroundImage:
            "radial-gradient(circle at 25% 25%, rgba(249,115,22,0.15) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(239,68,68,0.1) 0%, transparent 50%)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginBottom: "24px",
          }}
        >
          <div
            style={{
              width: "64px",
              height: "64px",
              borderRadius: "16px",
              background: "linear-gradient(135deg, #f97316, #ef4444)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "36px",
            }}
          >
            🔥
          </div>
          <span
            style={{
              fontSize: "48px",
              fontWeight: 700,
              color: "white",
            }}
          >
            LeetDaily
          </span>
        </div>

        <div
          style={{
            fontSize: "28px",
            color: "rgba(255,255,255,0.7)",
            textAlign: "center",
            maxWidth: "700px",
            lineHeight: 1.4,
          }}
        >
          Daily LeetCode Challenge Reminder & Streak Tracker
        </div>

        <div
          style={{
            display: "flex",
            gap: "32px",
            marginTop: "40px",
          }}
        >
          {["Streak Tracking", "Company Tags", "30-Day Heatmap", "Smart Reminders"].map(
            (feature) => (
              <div
                key={feature}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "8px 16px",
                  borderRadius: "9999px",
                  border: "1px solid rgba(249,115,22,0.3)",
                  backgroundColor: "rgba(249,115,22,0.1)",
                  fontSize: "16px",
                  color: "rgba(255,255,255,0.8)",
                }}
              >
                {feature}
              </div>
            )
          )}
        </div>

        <div
          style={{
            position: "absolute",
            bottom: "32px",
            fontSize: "18px",
            color: "rgba(255,255,255,0.4)",
          }}
        >
          Free Chrome Extension — leetdaily.masst.dev
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
