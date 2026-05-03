import { NextRequest, NextResponse } from "next/server";

const BACKEND_BASE_URL =
  process.env.FUNDED_BACKEND_URL ||
  process.env.NEXT_PUBLIC_FUNDED_API_URL ||
  "https://api.velmenora.com";

async function proxyRequest(
  req: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  const { path } = await context.params;
  const targetUrl = `${BACKEND_BASE_URL}/api/auth/${path.join("/")}`;

  const body =
    req.method === "GET" || req.method === "HEAD"
      ? undefined
      : await req.arrayBuffer();

  const headers: HeadersInit = {
    "Content-Type": req.headers.get("content-type") || "application/json",
  };

  const cookie = req.headers.get("cookie");
  if (cookie) {
    headers.Cookie = cookie;
  }

  const init: RequestInit = {
    method: req.method,
    headers,
    cache: "no-store",
  };

  if (body !== undefined) {
    init.body = body;
  }

  const res = await fetch(targetUrl, init);

  const text = await res.text();

  const response = new NextResponse(text, {
    status: res.status,
    headers: {
      "Content-Type": res.headers.get("content-type") || "application/json",
    },
  });

  const setCookie = res.headers.get("set-cookie");
  if (setCookie) {
    response.headers.set("Set-Cookie", setCookie);
  }

  return response;
}

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  return proxyRequest(req, context);
}

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  return proxyRequest(req, context);
}
