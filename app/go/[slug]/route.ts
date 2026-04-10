import { NextRequest, NextResponse } from "next/server";
import { brokers } from "@/lib/brokers";

/* ================= IP ================= */
function getIP(req: NextRequest) {
    const forwarded = req.headers.get("x-forwarded-for");
    if (forwarded) return forwarded.split(",")[0];

    return req.headers.get("x-real-ip") || "unknown";
}

/* ================= BOT DETECTION (IMPROVED) ================= */
function isBot(userAgent: string) {
    return /bot|crawl|spider|slurp|facebook|whatsapp|preview|meta|curl|python|wget/i.test(
        userAgent.toLowerCase()
    );
}

/* ================= DEVICE ================= */
function getDevice(userAgent: string) {
    if (/mobile/i.test(userAgent)) return "mobile";
    if (/tablet/i.test(userAgent)) return "tablet";
    return "desktop";
}

/* ================= MAIN ================= */
export async function GET(
    req: NextRequest,
    context: { params: Promise<{ slug: string }> }
) {
    const { slug } = await context.params;

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

    /* ================= INPUT ================= */

    const source = searchParams.get("src") || "market_page";

    const userAgent = req.headers.get("user-agent") || "";
    const ip = getIP(req);
    const bot = isBot(userAgent);
    const device = getDevice(userAgent);

    /* ================= GEO ================= */

    const country =
        req.headers.get("x-vercel-ip-country") || "unknown";

    /* ================= BOT BLOCK ================= */

    if (bot) {
        return NextResponse.redirect(new URL("/", req.url));
    }

    /* ================= SAFE URL BUILD ================= */

    let finalUrl: URL;

    try {
        finalUrl = new URL(broker.url);
    } catch {
        return NextResponse.json(
            { error: "Invalid broker URL" },
            { status: 500 }
        );
    }

    /* 🔥 IMPORTANT: DO NOT BREAK AFFILIATE PARAMS */
    finalUrl.searchParams.set("utm_source", "velmenora");
    finalUrl.searchParams.set("utm_medium", "affiliate");
    finalUrl.searchParams.set("utm_campaign", slug);
    finalUrl.searchParams.set("utm_content", source);

    /* EXTRA TRACKING */
    finalUrl.searchParams.set("device", device);
    finalUrl.searchParams.set("geo", country);

    /* ================= LOG ================= */

    const logPayload = {
        event: "affiliate_click",
        broker: broker.slug,
        source,
        country,
        device,
        ip,
        userAgent,
        timestamp: new Date().toISOString(),
    };

    console.log(JSON.stringify(logPayload));

    /* ================= OPTIONAL DB ================= */
    /*
    await db.query(
      `
      INSERT INTO clicks (broker, source, country, device, ip, user_agent, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, NOW())
      ON CONFLICT DO NOTHING
      `,
      [broker.slug, source, country, device, ip, userAgent]
    );
    */

    /* ================= REDIRECT ================= */

    return NextResponse.redirect(finalUrl.toString(), 302);
}