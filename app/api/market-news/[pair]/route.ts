import { NextResponse } from "next/server";
import { fetchLatestNews, toSafeArray } from "@/lib/markets/provider";
import { PAIR_EVENT_MAP, type MarketPair } from "@/lib/markets/pair-map";
import {
    dedupeNewsItems,
    normalizeNewsItem,
    sortNews,
    type NewsItem,
} from "@/lib/markets/feed-normalizers";

type Params = Promise<{ pair: string }>;

export const revalidate = 300;

function isPair(value: string): value is MarketPair {
    return value in PAIR_EVENT_MAP;
}

function getMatchScore(
    item: NewsItem,
    config: (typeof PAIR_EVENT_MAP)[MarketPair]
) {
    const text = `${item.title} ${item.summary} ${item.source}`.toLowerCase();
    let score = 0;

    const keywordHits = config.keywords.filter((keyword) =>
        text.includes(keyword.toLowerCase())
    ).length;

    score += keywordHits * 3;

    const countryHits = (config.countries ?? []).filter((country) =>
        text.includes(country.toLowerCase())
    ).length;

    score += countryHits * 2;

    const categoryHits = config.categories.filter((category) =>
        text.includes(category.toLowerCase())
    ).length;

    score += categoryHits * 2;

    if (/interest rate|inflation|cpi|payrolls|fed|ecb|boj|boe|gdp|yield/i.test(text)) {
        score += 1;
    }

    return score;
}

function sortPairNews(
    a: NewsItem & { _score: number },
    b: NewsItem & { _score: number }
) {
    if (b._score !== a._score) {
        return b._score - a._score;
    }

    return sortNews(a, b);
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
        const data = await fetchLatestNews();

        const normalized = dedupeNewsItems(
            toSafeArray(data)
                .map(normalizeNewsItem)
                .filter((item): item is NewsItem => item !== null)
        )
            .map((item) => ({
                ...item,
                _score: getMatchScore(item, config),
            }))
            .filter((item) => item._score > 0)
            .sort(sortPairNews)
            .slice(0, 8)
            .map(({ _score, ...item }) => item);

        return NextResponse.json(normalized, {
            status: 200,
            headers: {
                "Cache-Control": "s-maxage=300, stale-while-revalidate=600",
            },
        });
    } catch (error) {
        console.error("pair market-news api error", error);

        return NextResponse.json([], {
            status: 200,
            headers: {
                "Cache-Control": "s-maxage=60, stale-while-revalidate=120",
            },
        });
    }
}