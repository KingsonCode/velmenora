import { NextResponse } from "next/server";
import { fetchCalendarByCountry, toSafeArray } from "@/lib/markets/provider";
import { PAIR_EVENT_MAP, type MarketPair } from "@/lib/markets/pair-map";
import {
    dedupeCalendarItems,
    getSafeTime,
    normalizeCalendarItem,
    type CalendarItem,
} from "@/lib/markets/feed-normalizers";

type Params = Promise<{ pair: string }>;

export const revalidate = 300;

function isPair(value: string): value is MarketPair {
    return value in PAIR_EVENT_MAP;
}

function getMatchScore(
    item: CalendarItem,
    config: (typeof PAIR_EVENT_MAP)[MarketPair]
) {
    const country = item.country.toLowerCase();
    const category = item.category.toLowerCase();
    const event = item.event.toLowerCase();
    const text = `${country} ${category} ${event}`;

    let score = 0;

    if ((config.countries ?? []).some((c) => country.includes(c.toLowerCase()))) {
        score += 4;
    }

    if (config.categories.some((c) => category.includes(c.toLowerCase()))) {
        score += 5;
    }

    const keywordHits = config.keywords.filter((k) =>
        text.includes(k.toLowerCase())
    ).length;

    score += keywordHits * 2;
    score += item.importance;

    return score;
}

function sortEvents(
    a: CalendarItem & { _score: number },
    b: CalendarItem & { _score: number }
) {
    if (b._score !== a._score) {
        return b._score - a._score;
    }

    const aTime = getSafeTime(a.date);
    const bTime = getSafeTime(b.date);

    if (aTime !== null && bTime !== null && aTime !== bTime) {
        return aTime - bTime;
    }

    if (b.importance !== a.importance) {
        return b.importance - a.importance;
    }

    return a.event.localeCompare(b.event);
}

export async function GET(
    _req: Request,
    { params }: { params: Params }
) {
    const { pair } = await params;

    if (!isPair(pair)) {
        return NextResponse.json([], { status: 200 });
    }

    try {
        const config = PAIR_EVENT_MAP[pair];
        const data = await fetchCalendarByCountry(config.countries ?? []);

        const normalized = dedupeCalendarItems(
            toSafeArray(data)
                .map(normalizeCalendarItem)
                .filter((item): item is CalendarItem => item !== null)
        )
            .map((item) => ({
                ...item,
                _score: getMatchScore(item, config),
            }))
            .filter((item) => item._score > 0)
            .sort(sortEvents)
            .slice(0, 12)
            .map(({ _score, ...item }) => item);

        return NextResponse.json(normalized, {
            status: 200,
            headers: {
                "Cache-Control": "s-maxage=300, stale-while-revalidate=600",
            },
        });
    } catch (error) {
        console.error("market-events api error", error);

        return NextResponse.json([], {
            status: 200,
            headers: {
                "Cache-Control": "s-maxage=60, stale-while-revalidate=120",
            },
        });
    }
}