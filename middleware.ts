import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
    const country =
        req.headers.get("x-vercel-ip-country") || "OTHER";

    const res = NextResponse.next();

    // 🔥 SAVE COUNTRY IN COOKIE
    res.cookies.set("geo", country, {
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return res;
}