import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const body = await req.json();

    /* 🔥 LOG (FOR NOW) */
    console.log("TRACKED:", body);

    /* 🔥 FUTURE:
       - save to DB
       - send to analytics
    */

    return NextResponse.json({ ok: true });
}