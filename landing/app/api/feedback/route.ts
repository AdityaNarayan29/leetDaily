import { NextResponse } from "next/server";

const GOOGLE_FORM_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLScAtGeMsp4yqzqvn4ao82gHdAte__2aqNZP7R5z3NaKzD6zSQ/formResponse";

export async function POST(request: Request) {
  try {
    const { reason, details } = await request.json();

    const body = new URLSearchParams();
    body.append("entry.1892502064", reason || "");
    body.append("entry.1590935666", details || "");

    await fetch(GOOGLE_FORM_URL, {
      method: "POST",
      body,
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
