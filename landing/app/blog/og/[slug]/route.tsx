import { ImageResponse } from "next/og";
import { getPost } from "@/lib/blog";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  let title = "LeetDaily Blog";
  let description = "";
  try {
    const post = getPost(slug);
    title = post.title;
    description = post.description;
  } catch {
    // fallback to defaults
  }

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "60px 80px",
          backgroundColor: "#0a0a0a",
          backgroundImage:
            "radial-gradient(circle at 25% 25%, rgba(249,115,22,0.15) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(239,68,68,0.1) 0%, transparent 50%)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "32px",
          }}
        >
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "10px",
              background: "linear-gradient(135deg, #f97316, #ef4444)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "22px",
            }}
          >
            🔥
          </div>
          <span
            style={{
              fontSize: "24px",
              fontWeight: 600,
              color: "rgba(255,255,255,0.6)",
            }}
          >
            LeetDaily Blog
          </span>
        </div>

        <div
          style={{
            fontSize: "48px",
            fontWeight: 700,
            color: "white",
            lineHeight: 1.2,
            marginBottom: "20px",
            maxWidth: "900px",
          }}
        >
          {title}
        </div>

        <div
          style={{
            fontSize: "22px",
            color: "rgba(255,255,255,0.5)",
            lineHeight: 1.4,
            maxWidth: "800px",
          }}
        >
          {description.length > 120
            ? description.slice(0, 120) + "..."
            : description}
        </div>

        <div
          style={{
            position: "absolute",
            bottom: "40px",
            left: "80px",
            fontSize: "18px",
            color: "rgba(255,255,255,0.3)",
          }}
        >
          leetdaily.masst.dev/blog
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
