import { NextRequest, NextResponse } from "next/server";

/* =========================================================
   GEO CONSTANTS
========================================================= */

const COUNTRY_COOKIE = "user_country";
const DEFAULT_COUNTRY = "OTHER";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

/* =========================================================
   HELPERS
========================================================= */

function normalizeCountry(value?: string | null): string {
    if (!value) return DEFAULT_COUNTRY;

    const normalized = value.trim().toUpperCase();

    // ISO-like 2-letter only; otherwise fallback
    if (!/^[A-Z]{2}$/.test(normalized)) {
        return DEFAULT_COUNTRY;
    }

    return normalized;
}

function detectCountry(req: NextRequest): string {
    // Ordered by common deployment providers
    const candidates = [
        req.headers.get("x-vercel-ip-country"),
        req.headers.get("cf-ipcountry"),
        req.headers.get("x-country-code"),
        req.headers.get("x-geo-country"),
        req.headers.get("cloudfront-viewer-country"),
    ];

    for (const candidate of candidates) {
        const country = normalizeCountry(candidate);
        if (country !== DEFAULT_COUNTRY) {
            return country;
        }
    }

    return DEFAULT_COUNTRY;
}

function shouldBypass(pathname: string): boolean {
    if (
        pathname.startsWith("/_next") ||
        pathname.startsWith("/api") ||
        pathname.startsWith("/images") ||
        pathname.startsWith("/fonts")
    ) {
        return true;
    }

    // Static files like .png, .jpg, .svg, .js, .css, etc.
    if (pathname.includes(".") && !pathname.endsWith(".well-known")) {
        return true;
    }

    return false;
}

function buildGeoPayload(req: NextRequest): {
    detectedCountry: string;
    cookieCountry: string;
    finalCountry: string;
    countrySource: "cookie" | "header" | "fallback";
} {
    const detectedCountry = detectCountry(req);
    const cookieCountry = normalizeCountry(
        req.cookies.get(COUNTRY_COOKIE)?.value
    );

    if (cookieCountry !== DEFAULT_COUNTRY) {
        return {
            detectedCountry,
            cookieCountry,
            finalCountry: cookieCountry,
            countrySource: "cookie",
        };
    }

    if (detectedCountry !== DEFAULT_COUNTRY) {
        return {
            detectedCountry,
            cookieCountry,
            finalCountry: detectedCountry,
            countrySource: "header",
        };
    }

    return {
        detectedCountry,
        cookieCountry,
        finalCountry: DEFAULT_COUNTRY,
        countrySource: "fallback",
    };
}

/* =========================================================
   MAIN PROXY
========================================================= */

export function proxy(req: NextRequest) {
    const { pathname } = req.nextUrl;

    // Skip internals, APIs, and static assets
    if (shouldBypass(pathname)) {
        return NextResponse.next();
    }

    const res = NextResponse.next();

    const { detectedCountry, cookieCountry, finalCountry, countrySource } =
        buildGeoPayload(req);

    /* =========================
       SET / REFRESH COUNTRY COOKIE
    ========================= */
    const incomingCookie = req.cookies.get(COUNTRY_COOKIE)?.value;
    const normalizedIncomingCookie = normalizeCountry(incomingCookie);

    if (normalizedIncomingCookie !== finalCountry) {
        res.cookies.set(COUNTRY_COOKIE, finalCountry, {
            path: "/",
            maxAge: COOKIE_MAX_AGE,
            sameSite: "lax",
            httpOnly: false, // allow client-side geo-aware UI if needed
            secure: process.env.NODE_ENV === "production",
        });
    }

    /* =========================
       EXPOSE GEO CONTEXT TO APP
    ========================= */
    res.headers.set("x-user-country", finalCountry);
    res.headers.set("x-detected-country", detectedCountry);
    res.headers.set("x-country-source", countrySource);

    return res;
}

/* =========================================================
   MATCHER
========================================================= */

export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|manifest.webmanifest|site.webmanifest).*)",
    ],
};