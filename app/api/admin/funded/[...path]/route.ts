import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{
    path?: string[];
  }>;
};

const BACKEND_URL =
  process.env.FUNDED_BACKEND_URL ||
  process.env.NEXT_PUBLIC_FUNDED_BACKEND_URL ||
  "https://api.velmenora.com";

function buildTargetUrl(pathParts: string[], search: string) {
  const cleanBase = BACKEND_URL.replace(/\/+$/, "");
  const cleanPath = pathParts.map(encodeURIComponent).join("/");
  return `${cleanBase}/api/funded/${cleanPath}${search}`;
}

async function proxyAdminRequest(req: NextRequest, ctx: RouteContext) {
  const { path = [] } = await ctx.params;

  const adminSession = req.cookies.get("velmenora_admin_session")?.value;

  if (adminSession !== "authenticated") {
    return NextResponse.json(
      {
        ok: false,
        error: "admin_unauthorized",
      },
      { status: 401 }
    );
  }

  const adminSecret = process.env.FUNDED_ADMIN_SECRET;

  if (!adminSecret) {
    return NextResponse.json(
      {
        ok: false,
        error: "server_missing_funded_admin_secret",
      },
      { status: 500 }
    );
  }

  const targetUrl = buildTargetUrl(path, req.nextUrl.search);

  const headers = new Headers();

  headers.set("x-admin-secret", adminSecret);
  headers.set("accept", "application/json");

  const contentType = req.headers.get("content-type");
  if (contentType) {
    headers.set("content-type", contentType);
  }

  const method = req.method.toUpperCase();

  const hasBody = !["GET", "HEAD"].includes(method);

  const fetchInit: RequestInit = {
    method,
    headers,
    cache: "no-store",
  };

  if (hasBody) {
    fetchInit.body = await req.text();
  }

  const upstream = await fetch(targetUrl, fetchInit);

  const responseText = await upstream.text();

  let payload: unknown;

  try {
    payload = responseText ? JSON.parse(responseText) : null;
  } catch {
    payload = {
      ok: false,
      error: "upstream_non_json_response",
      status: upstream.status,
      body: responseText.slice(0, 1000),
    };
  }

  return NextResponse.json(payload, {
    status: upstream.status,
  });
}

export async function GET(req: NextRequest, ctx: RouteContext) {
  return proxyAdminRequest(req, ctx);
}

export async function POST(req: NextRequest, ctx: RouteContext) {
  return proxyAdminRequest(req, ctx);
}

export async function PATCH(req: NextRequest, ctx: RouteContext) {
  return proxyAdminRequest(req, ctx);
}

export async function PUT(req: NextRequest, ctx: RouteContext) {
  return proxyAdminRequest(req, ctx);
}

export async function DELETE(req: NextRequest, ctx: RouteContext) {
  return proxyAdminRequest(req, ctx);
}
