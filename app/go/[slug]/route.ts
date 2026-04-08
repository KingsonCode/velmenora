import { NextResponse } from "next/server";
import { brokers } from "@/data/brokers";

/* =========================================================
   🔥 HELPER: GET CLIENT IP
========================================================= */
function getIP(req: Request) {
    return (
        req.headers.get("x-forwarded-for") ||
        req.headers.get("x-real-ip") ||
        "unknown"
    );
}

/* =========================================================
   🔥 HELPER: BOT DETECTION
========================================================= */
function isBot(userAgent: string | null) {
    if (!userAgent) return false;

    return /bot|crawl|spider|slurp|facebook|whatsapp/i.test(userAgent);
}

/* =========================================================
   🔥 MAIN HANDLER
========================================================= */
export async function GET(req: Request, { params }: any) {
    const { searchParams } = new URL(req.url);

    const slug = params.slug;
    const broker = brokers.find((b) => b.slug === slug);

    /* ❌ INVALID BROKER */
    if (!broker) {
        return NextResponse.redirect("https://velmenora.com");
    }

    /* =========================================================
       🔥 TRACKING DATA
    ========================================================= */
    const source = searchParams.get("src") || "unknown";
    const country = searchParams.get("country") || "global";

    const userAgent = req.headers.get("user-agent");
    const ip = getIP(req);
    const bot = isBot(userAgent);

    /* =========================================================
       🔥 LOG (FOR NOW → console, later DB)
    ========================================================= */
    if (!bot) {
        console.log("🔥 CLICK EVENT", {
            broker: broker.slug,
            source,
            country,
            ip,
            userAgent,
            timestamp: new Date().toISOString(),
        });
    }

    /* =========================================================
       🔥 REDIRECT WITH TRACKING PARAMS
    ========================================================= */

    const finalUrl = new URL(broker.link);

    finalUrl.searchParams.set("utm_source", "velmenora");
    finalUrl.searchParams.set("utm_medium", "affiliate");
    finalUrl.searchParams.set("utm_campaign", source);
    finalUrl.searchParams.set("utm_content", country);

    /* =========================================================
       🔥 REDIRECT
    ========================================================= */
    return NextResponse.redirect(finalUrl.toString(), {
        status: 302,
    });
}