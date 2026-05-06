import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const COOKIE_NAME = "velmenora_admin_session";

function unauthorized() {
  return NextResponse.json(
    {
      ok: false,
      error: "invalid_admin_password",
    },
    { status: 401 }
  );
}

export async function POST(req: NextRequest) {
  const expectedPassword = process.env.VELMENORA_ADMIN_UI_PASSWORD;

  if (!expectedPassword) {
    return NextResponse.json(
      {
        ok: false,
        error: "server_missing_admin_ui_password",
      },
      { status: 500 }
    );
  }

  const body = await req.json().catch(() => null);
  const password = String(body?.password ?? "");

  if (!password || password !== expectedPassword) {
    return unauthorized();
  }

  const res = NextResponse.json({
    ok: true,
  });

  res.cookies.set(COOKIE_NAME, "authenticated", {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8,
  });

  return res;
}
