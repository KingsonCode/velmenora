import { NextRequest, NextResponse } from "next/server";

const BACKEND_BASE_URL =
  process.env.FUNDED_BACKEND_URL ||
  process.env.NEXT_PUBLIC_FUNDED_API_URL ||
  "https://api.velmenora.com";

export async function POST(req: NextRequest) {
  const body = await req.arrayBuffer();

  const res = await fetch(`${BACKEND_BASE_URL}/api/broker-account/submit`, {
    method: "POST",
    headers: {
      "Content-Type": req.headers.get("content-type") || "application/json",
    },
    body,
    cache: "no-store",
  });

  const text = await res.text();

  return new NextResponse(text, {
    status: res.status,
    headers: {
      "Content-Type": res.headers.get("content-type") || "application/json",
    },
  });
}
