import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const COOKIE_NAME = "velmenora_admin_session";

export async function GET(req: NextRequest) {
  const session = req.cookies.get(COOKIE_NAME)?.value;

  return NextResponse.json({
    ok: true,
    authenticated: session === "authenticated",
  });
}
