import { NextRequest, NextResponse } from "next/server";

/* ================= GEO DETECTION ================= */
function detectCountry(req: NextRequest): string {
    const vercel = req.headers.get("x-vercel-ip-country");
    const cloudflare = req.headers.get("cf-ipcountry");
    const generic = req.headers.get("x-geo-country");

    const country = vercel ?? cloudflare ?? generic ?? "OTHER";

    if (!country || country.length !== 2) return "OTHER";

    return country.toUpperCase();
}

/* ================= BOT DETECTION ================= */
function isBot(req: NextRequest): boolean {
    const ua = req.headers.get("user-agent") || "";
    return /bot|crawl|spider|slurp/i.test(ua);
}

/* ================= MAIN PROXY ================= */
export function proxy(req: NextRequest) {
    const url = req.nextUrl;

    // ❌ Skip static & API
    if (
        url.pathname.startsWith("/_next") ||
        url.pathname.includes(".") ||
        url.pathname.startsWith("/api")
    ) {
        return NextResponse.next();
    }

    const res = NextResponse.next();

    // 🔥 1. COUNTRY DETECTION
    const detectedCountry = detectCountry(req);

    // 🍪 2. USER OVERRIDE (if exists)
    const cookieCountry = req.cookies.get("user_country")?.value;

    const finalCountry = (cookieCountry || detectedCountry).toUpperCase();

    // 🍪 3. SET COOKIE (if changed)
    if (cookieCountry !== finalCountry) {
        res.cookies.set("user_country", finalCountry, {
            path: "/",
            maxAge: 60 * 60 * 24 * 30, // 30 days
            sameSite: "lax",
        });
    }

    // 🔗 4. SET HEADER (GLOBAL ACCESS)
    res.headers.set("x-user-country", finalCountry);

    /* ================= OPTIONAL REDIRECT ================= */
    // 👉 Enable hii ukitaka auto routing
    const pathname = url.pathname;

    const isRoot = pathname === "/";
    const isLocalized = /^\/(en|ar|de|fr)\//.test(pathname);

    // 🚫 Avoid bots (SEO safe)
    if (!isBot(req) && isRoot && !isLocalized) {
        const lang = "en"; // unaweza map via cluster later
        const countrySlug = finalCountry.toLowerCase();

        return NextResponse.redirect(
            new URL(`/${lang}/${countrySlug}`, req.url)
        );
    }

    return res;
}

/* ================= MATCHER ================= */
export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico|images|robots.txt|sitemap.xml).*)",
    ],
};