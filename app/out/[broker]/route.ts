import { NextResponse } from "next/server";
import { brokers } from "@/data/brokers";

/* =========================================================
   🔥 HELPER: GET IP
========================================================= */
function getIP(req: Request) {
    return (
        req.headers.get("x-forwarded-for") ||
        req.headers.get("x-real-ip") ||
        "unknown"
    );
}

/* =========================================================
   🔥 HELPER: GET USER AGENT
========================================================= */
function getUserAgent(req: Request) {
    return req.headers.get("user-agent") || "unknown";
}

/* =========================================================
   🔥 HELPER: BASIC BOT FILTER
========================================================= */
function isBot(ua: string) {
    return /bot|crawl|spider|slurp/i.test(ua);
}

/* =========================================================
   🔥 ROUTE
========================================================= */
export async function GET(
    req: Request,
    { params }: { params: { broker: string } }
) {
    const broker = brokers.find((b) => b.slug === params.broker);

    if (!broker) {
        return NextResponse.redirect(new URL("/", req.url));
    }

    /* ================= DATA ================= */
    const ip = getIP(req);
    const ua = getUserAgent(req);
    const referer = req.headers.get("referer") || "direct";

    /* ================= BOT CHECK ================= */
    if (!isBot(ua)) {
        const clickData = {
            broker: broker.slug,
            time: new Date().toISOString(),
            ip,
            ua,
            referer,
        };

        // 🔥 CURRENT: log (replace later with DB)
        console.log("CLICK:", clickData);

        // 👉 FUTURE:
        // await db.clicks.create({ data: clickData })
    }

    /* ================= REDIRECT ================= */
    return NextResponse.redirect(broker.link);
}