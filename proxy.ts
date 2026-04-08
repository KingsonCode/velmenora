import { NextRequest, NextResponse } from "next/server";

export function proxy(req: NextRequest) {
    const res = NextResponse.next();

    const country =
        req.headers.get("x-vercel-ip-country") || "OTHER";

    const normalizedCountry = country.toUpperCase();

    const existing = req.cookies.get("geo")?.value;

    if (existing !== normalizedCountry) {
        res.cookies.set("geo", normalizedCountry, {
            path: "/",
            maxAge: 60 * 60 * 24 * 7,
            sameSite: "lax",
        });
    }

    res.headers.set("x-user-country", normalizedCountry);

    return res;
}

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico|images).*)"],
};