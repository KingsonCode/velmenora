import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/* 🔥 BROKER LINKS (AFFILIATE) */
const BROKER_LINKS: Record<string, string> = {
    exness: "https://one.exnessonelink.com/a/tmodpmod",
    deriv: "https://one.exnessonelink.com/a/tmodpmod",
};

/* 🔥 GET HANDLER (NEXT 16 FIXED) */
export async function GET(
    request: NextRequest,
    context: { params: Promise<{ broker: string }> }
) {
    const { broker } = await context.params;

    const url = BROKER_LINKS[broker];

    if (!url) {
        return NextResponse.redirect("https://velmenora.com");
    }

    return NextResponse.redirect(url);
}