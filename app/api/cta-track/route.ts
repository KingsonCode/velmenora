import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL =
  process.env.FUNDED_BACKEND_URL ||
  process.env.NEXT_PUBLIC_FUNDED_BACKEND_URL ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "http://localhost:8002";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const res = await fetch(`${BACKEND_URL}/api/funded/cta/track`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "user-agent": req.headers.get("user-agent") || "",
        "x-forwarded-for":
          req.headers.get("x-forwarded-for") ||
          req.headers.get("x-real-ip") ||
          "",
        "x-vercel-ip-country": req.headers.get("x-vercel-ip-country") || "",
        "cf-ipcountry": req.headers.get("cf-ipcountry") || "",
        "x-geo-country": req.headers.get("x-geo-country") || "",
        "referer": req.headers.get("referer") || "",
      },
      body: JSON.stringify(body),
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json({ ok: false }, { status: 200 });
    }

    const data = await res.json();
    return NextResponse.json(data, { status: 200 });
  } catch {
    return NextResponse.json({ ok: false }, { status: 200 });
  }
}
