import { NextResponse } from "next/server";

type Params = Promise<{ pair: string }>;

type CalendarEvent = {
    id: string;
    title: string;
    country: string;
    impact: "low" | "medium" | "high";
    date: string;
    time: string;
    actual?: string;
    forecast?: string;
    previous?: string;
    pair: string;
};

const MOCK_EVENTS: CalendarEvent[] = [
    {
        id: "usd-nfp",
        title: "Non-Farm Payrolls",
        country: "US",
        impact: "high",
        date: "2026-04-20",
        time: "15:30",
        actual: "",
        forecast: "210K",
        previous: "198K",
        pair: "EURUSD",
    },
    {
        id: "usd-cpi",
        title: "CPI m/m",
        country: "US",
        impact: "high",
        date: "2026-04-20",
        time: "15:30",
        actual: "",
        forecast: "0.3%",
        previous: "0.2%",
        pair: "EURUSD",
    },
    {
        id: "gbp-boe",
        title: "BoE Interest Rate Decision",
        country: "UK",
        impact: "high",
        date: "2026-04-20",
        time: "14:00",
        actual: "",
        forecast: "5.25%",
        previous: "5.25%",
        pair: "GBPUSD",
    },
    {
        id: "jpy-cpi",
        title: "National Core CPI y/y",
        country: "JP",
        impact: "medium",
        date: "2026-04-20",
        time: "02:30",
        actual: "",
        forecast: "2.1%",
        previous: "2.0%",
        pair: "USDJPY",
    },
    {
        id: "aud-employment",
        title: "Employment Change",
        country: "AU",
        impact: "high",
        date: "2026-04-20",
        time: "04:30",
        actual: "",
        forecast: "22K",
        previous: "18K",
        pair: "AUDUSD",
    },
    {
        id: "eur-ecb",
        title: "ECB Press Conference",
        country: "EU",
        impact: "high",
        date: "2026-04-20",
        time: "15:45",
        actual: "",
        forecast: "",
        previous: "",
        pair: "EURUSD",
    },
];

function normalizePair(raw: string): string {
    return raw.replace(/[^a-zA-Z]/g, "").toUpperCase();
}

function isValidPair(pair: string): boolean {
    return /^[A-Z]{6}$/.test(pair);
}

function getRelatedCurrencies(pair: string): [string, string] {
    return [pair.slice(0, 3), pair.slice(3, 6)];
}

function matchesPair(event: CalendarEvent, pair: string): boolean {
    if (event.pair === pair) return true;

    const [base, quote] = getRelatedCurrencies(pair);
    return event.country === base || event.country === quote;
}

function sortByImpactAndTime(events: CalendarEvent[]): CalendarEvent[] {
    const impactRank: Record<CalendarEvent["impact"], number> = {
        high: 3,
        medium: 2,
        low: 1,
    };

    return [...events].sort((a, b) => {
        const impactDiff = impactRank[b.impact] - impactRank[a.impact];
        if (impactDiff !== 0) return impactDiff;

        const aDateTime = `${a.date}T${a.time}`;
        const bDateTime = `${b.date}T${b.time}`;

        return aDateTime.localeCompare(bDateTime);
    });
}

export async function GET(
    _req: Request,
    { params }: { params: Params }
) {
    const { pair: rawPair } = await params;

    const pair = normalizePair(rawPair);

    if (!pair) {
        return NextResponse.json(
            { error: "Pair is required" },
            { status: 400 }
        );
    }

    if (!isValidPair(pair)) {
        return NextResponse.json(
            { error: "Invalid pair format. Expected format like EURUSD." },
            { status: 400 }
        );
    }

    try {
        const filtered = MOCK_EVENTS.filter((event) => matchesPair(event, pair));
        const events = sortByImpactAndTime(filtered).slice(0, 8);

        return NextResponse.json(
            {
                pair,
                count: events.length,
                events,
            },
            {
                status: 200,
                headers: {
                    "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
                },
            }
        );
    } catch (error) {
        console.error("[economic-calendar pair route error]", error);

        return NextResponse.json(
            {
                pair,
                count: 0,
                events: [],
                fallback: true,
            },
            { status: 200 }
        );
    }
}