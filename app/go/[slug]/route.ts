// app/go/[slug]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { brokers } from "@/lib/brokers";

/* =========================================================
   🔥 HELPER: GET CLIENT IP
========================================================= */
function getIP(req: NextRequest) {
    return (
        req.headers.get("x-forwarded-for") ||
        req.headers.get("x-real-ip") ||
        "unknown"
    );
}

/* =========================================================
   🔥 HELPER: BOT DETECTION
========================================================= */
function isBot(userAgent: string) {
    return /bot|crawl|spider|slurp|facebook|whatsapp|preview|meta|curl/i.test(
        userAgent.toLowerCase()
    );
}

/* =========================================================
   🔥 MAIN HANDLER (NEXT 16 FIXED)
========================================================= */
export async function GET(
    req: NextRequest,
    context: { params: Promise<{ slug: string }> }
) {
    const { slug } = await context.params; // ✅ muhimu sana

    const { searchParams } = new URL(req.url);
    const broker = brokers[slug as keyof typeof brokers];

    /* ================= VALIDATION ================= */

    if (!broker) {
        return NextResponse.json(
            { error: "Broker not found", slug },
            { status: 404 }
        );
    }

    if (!broker.active) {
        return NextResponse.json(
            { error: "Broker inactive", slug },
            { status: 403 }
        );
    }

    /* ================= TRACKING INPUT ================= */

    const source = searchParams.get("src") || "direct";
    const countryParam = searchParams.get("country") || "auto";

    const userAgent = req.headers.get("user-agent") || "";
    const ip = getIP(req);
    const bot = isBot(userAgent);

    /* ================= GEO DETECTION ================= */

    const countryHeader =
        req.headers.get("x-vercel-ip-country") || "unknown";

    const country =
        countryParam !== "auto" ? countryParam : countryHeader;

    /* ================= BOT HANDLING ================= */

    if (bot) {
        return NextResponse.redirect(new URL("/", req.url));
    }

    /* ================= BUILD FINAL URL ================= */

    const finalUrl = new URL(broker.url);

    finalUrl.searchParams.set("utm_source", "velmenora");
    finalUrl.searchParams.set("utm_medium", "affiliate");
    finalUrl.searchParams.set("utm_campaign", slug);
    finalUrl.searchParams.set("utm_content", source);
    finalUrl.searchParams.set("geo", country);

    /* ================= LOGGING ================= */

    const logPayload = {
        event: "affiliate_click",
        broker: broker.slug,
        source,
        country,
        ip,
        userAgent,
        timestamp: new Date().toISOString(),
    };

    console.log(JSON.stringify(logPayload));

    /* ================= OPTIONAL: DB TRACKING ================= */
    /*
    await db.query(
      `
      INSERT INTO clicks (broker, source, country, ip, user_agent, created_at)
      VALUES ($1, $2, $3, $4, $5, NOW())
      ON CONFLICT DO NOTHING
      `,
      [broker.slug, source, country, ip, userAgent]
    );
    */

    /* ================= REDIRECT ================= */

    return NextResponse.redirect(finalUrl.toString(), 302);
}