import { NextResponse } from "next/server";

type Params = Promise<{ pair: string }>;

export async function GET(
    _req: Request,
    { params }: { params: Params }
) {
    const { pair } = await params;

    if (!pair) {
        return NextResponse.json({ error: "Pair required" }, { status: 400 });
    }

    try {
        const symbol = `${pair.slice(0, 3)}/${pair.slice(3)}`;

        const res = await fetch(
            `https://api.twelvedata.com/price?symbol=${symbol}&apikey=${process.env.TWELVE_API_KEY}`,
            { next: { revalidate: 10 } } // 🔥 cache 10 sec
        );

        const data = await res.json();

        if (!data.price) throw new Error("No price");

        return NextResponse.json({
            pair,
            price: Number(data.price),
            timestamp: Date.now(),
        });

    } catch (err) {
        console.error(err);

        return NextResponse.json({
            pair,
            price: null,
            fallback: true,
        });
    }
}