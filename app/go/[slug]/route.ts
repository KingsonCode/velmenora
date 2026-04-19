import { NextRequest, NextResponse } from "next/server";
import { getBroker } from "@/lib/brokers";
import { buildAffiliateLink } from "@/lib/affiliate";

/* ================= RATE LIMIT ================= */
const RATE_LIMIT = new Map<string, number>();
const RATE_LIMIT_WINDOW_MS = 1000;

/* ================= RATE LIMIT ================= */
function isRateLimited(ip: string): boolean {
    const now = Date.now();
    const last = RATE_LIMIT.get(ip) || 0;

    if (now - last < RATE_LIMIT_WINDOW_MS) {
        return true;
    }

    RATE_LIMIT.set(ip, now);
    return false;
}

/* ================= IP ================= */
function getIP(req: NextRequest): string {
    return (
        req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
        req.headers.get("x-real-ip") ||
        "unknown"
    );
}

/* ================= BOT FILTER ================= */
function isBot(ua: string): boolean {
    return /bot|crawl|spider|meta|facebook|whatsapp|preview|curl|wget/i.test(
        ua.toLowerCase()
    );
}

/* ================= DEVICE DETECTION ================= */
function getDevice(ua: string): "mobile" | "tablet" | "desktop" {
    if (/tablet/i.test(ua)) return "tablet";
    if (/mobile/i.test(ua)) return "mobile";
    return "desktop";
}

/* ================= FALLBACK ================= */
function getFallbackUrl(req: NextRequest): URL {
    return new URL("/brokers", req.url);
}

/* ================= MAIN ================= */
export async function GET(
    req: NextRequest,
    context: { params: Promise<{ slug: string }> }
) {
    const { slug } = await context.params;
    const broker = getBroker(slug);

    /* ================= FAIL SAFE ================= */
    if (!broker) {
        return NextResponse.redirect(getFallbackUrl(req));
    }

    const ip = getIP(req);

    /* ================= RATE LIMIT ================= */
    if (isRateLimited(ip)) {
        return NextResponse.redirect(getFallbackUrl(req));
    }

    const ua = req.headers.get("user-agent") || "";

    /* ================= BOT BLOCK ================= */
    if (isBot(ua)) {
        return NextResponse.redirect(getFallbackUrl(req));
    }

    /* ================= CONTEXT ================= */
    const device = getDevice(ua);
    const rawCountry = req.headers.get("x-vercel-ip-country");
    const country = rawCountry?.trim().toUpperCase() || undefined;

    const { searchParams } = new URL(req.url);
    const source = searchParams.get("src") || "direct";
    const blogSlug = searchParams.get("slug") || "";
    const brokerParam = searchParams.get("broker") || slug;

    /* ================= AFFILIATE LINK ================= */
    const finalUrl = buildAffiliateLink({
        broker,
        device,
        source,
        blogSlug,
        ...(country ? { country } : {}),
    });
    /* ================= NON-BLOCKING LOG ================= */
    const payload = {
        broker: slug,
        brokerParam,
        blogSlug,
        country: country || "unknown",
        device,
        source,
        ts: Date.now(),
    };

    queueMicrotask(() => {
        try {
            console.log("🔥 CLICK:", JSON.stringify(payload));
        } catch { }
    });

    /* ================= FUTURE DB HOOK ================= */
    /*
    queueMicrotask(async () => {
        await db.insert(clicks).values(payload).onConflictDoNothing();
    });
    */

    /* ================= REDIRECT ================= */
    return NextResponse.redirect(finalUrl, 302);
}