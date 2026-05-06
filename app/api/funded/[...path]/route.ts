import { NextRequest, NextResponse } from "next/server";

type RouteContext = {
  params: Promise<{ path: string[] }>;
};

const BACKEND_URL =
  process.env.FUNDED_BACKEND_URL ||
  process.env.NEXT_PUBLIC_FUNDED_BACKEND_URL ||
  "http://localhost:8002";

const INTERNAL_API_SECRET = process.env.INTERNAL_API_SECRET || "";

function backendUrl(path: string[], search: string) {
  const joined = path.join("/");
  return `${BACKEND_URL.replace(/\/$/, "")}/api/funded/${joined}${search}`;
}

function isAffiliateMemberPath(path: string[]) {
  const joined = path.join("/");
  return (
    joined === "affiliate/apply" ||
    joined === "affiliate/me" ||
    joined === "affiliate/me/stats" ||
    joined === "affiliate/me/payouts" ||
    joined === "affiliate/me/payout/request"
  );
}

function isAffiliateAdminPath(path: string[]) {
  return path.join("/").startsWith("admin/affiliate/applications");
}

async function readCurrentUser(req: NextRequest) {
  const origin = req.nextUrl.origin;

  const res = await fetch(`${origin}/api/auth/me`, {
    method: "GET",
    headers: {
      cookie: req.headers.get("cookie") || "",
    },
    cache: "no-store",
  });

  if (!res.ok) return null;

  const data = await res.json().catch(() => null);

  const rawUser =
    data?.user ||
    data?.member ||
    data?.account ||
    data?.data?.user ||
    data?.data?.member ||
    data;

  const id =
    rawUser?.id ||
    rawUser?.userId ||
    rawUser?.sub ||
    rawUser?.memberId;

  const email = rawUser?.email || rawUser?.emailAddress;
  const role = rawUser?.role || rawUser?.userRole || rawUser?.type;

  if (!id && !email) return null;

  return {
    id: String(id || ""),
    email: email ? String(email) : "",
    role: role ? String(role) : "",
  };
}

function copySafeRequestHeaders(req: NextRequest) {
  const headers = new Headers();

  const contentType = req.headers.get("content-type");
  const accept = req.headers.get("accept");
  const userAgent = req.headers.get("user-agent");
  const xForwardedFor = req.headers.get("x-forwarded-for");

  if (contentType) headers.set("content-type", contentType);
  if (accept) headers.set("accept", accept);
  if (userAgent) headers.set("user-agent", userAgent);
  if (xForwardedFor) headers.set("x-forwarded-for", xForwardedFor);

  const adminSecret = req.headers.get("x-admin-secret");
  if (adminSecret) headers.set("x-admin-secret", adminSecret);

  return headers;
}

async function proxy(req: NextRequest, context: RouteContext) {
  const { path } = await context.params;
  const needsMember = isAffiliateMemberPath(path);
  const needsAdmin = isAffiliateAdminPath(path);

  const headers = copySafeRequestHeaders(req);

  if (needsAdmin) {
    const adminSecret = req.headers.get("x-admin-secret");

    if (!adminSecret) {
      return NextResponse.json(
        { ok: false, error: "admin_secret_required" },
        { status: 403 }
      );
    }

    headers.set("x-admin-secret", adminSecret);
  }

  if (needsMember) {
    if (!INTERNAL_API_SECRET) {
      return NextResponse.json(
        { ok: false, error: "internal_secret_not_configured" },
        { status: 500 }
      );
    }

    const user = await readCurrentUser(req);

    if (!user) {
      return NextResponse.json(
        { ok: false, error: "member_auth_required" },
        { status: 401 }
      );
    }

    headers.set("x-internal-api-secret", INTERNAL_API_SECRET);
    if (user.id) headers.set("x-member-user-id", user.id);
    if (user.email) headers.set("x-member-email", user.email);
    if (user.role) headers.set("x-member-role", user.role);
  }

  const method = req.method;
  const hasBody = !["GET", "HEAD"].includes(method);

  const upstreamInit: RequestInit = {
    method,
    headers,
    cache: "no-store",
  };

  if (hasBody) {
    upstreamInit.body = await req.arrayBuffer();
  }

  const upstream = await fetch(backendUrl(path, req.nextUrl.search), upstreamInit);

  const responseHeaders = new Headers(upstream.headers);
  responseHeaders.delete("content-encoding");
  responseHeaders.delete("transfer-encoding");

  return new NextResponse(upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers: responseHeaders,
  });
}

export async function GET(req: NextRequest, context: RouteContext) {
  return proxy(req, context);
}

export async function POST(req: NextRequest, context: RouteContext) {
  return proxy(req, context);
}

export async function PUT(req: NextRequest, context: RouteContext) {
  return proxy(req, context);
}

export async function PATCH(req: NextRequest, context: RouteContext) {
  return proxy(req, context);
}

export async function DELETE(req: NextRequest, context: RouteContext) {
  return proxy(req, context);
}
