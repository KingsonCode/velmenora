import { NextResponse } from "next/server";
import {
    fetchLatestNews,
    toSafeArray,
    type TradingEconomicsRawItem,
} from "@/lib/markets/provider";

type NewsItem = {
    id: string;
    title: string;
    summary: string;
    source: string;
    time: string;
    url: string;
};

function normalizeNewsItem(item: TradingEconomicsRawItem): NewsItem | null {
    const id = String(
        item.id ??
        item.ID ??
        item.date ??
        item.Date ??
        item.title ??
        item.Title ??
        ""
    ).trim();

    const title = String(item.title ?? item.Title ?? "").trim();
    const summary = String(
        item.description ??
        item.Description ??
        item.teaser ??
        item.Teaser ??
        ""
    ).trim();

    const source = String(item.source ?? item.Source ?? "Trading Economics").trim();
    const time = String(item.date ?? item.Date ?? "").trim();
    const url = String(item.url ?? item.URL ?? "#").trim();

    if (!id || !title) {
        return null;
    }

    return {
        id,
        title,
        summary: summary || "Latest macro market update.",
        source: source || "Trading Economics",
        time,
        url: url || "#",
    };
}

function dedupeNews(items: NewsItem[]) {
    const seen = new Set<string>();

    return items.filter((item) => {
        const key = `${item.title}__${item.source}`.toLowerCase();

        if (seen.has(key)) {
            return false;
        }

        seen.add(key);
        return true;
    });
}

function sortNews(a: NewsItem, b: NewsItem) {
    const aTime = new Date(a.time).getTime();
    const bTime = new Date(b.time).getTime();

    if (Number.isFinite(aTime) && Number.isFinite(bTime) && aTime !== bTime) {
        return bTime - aTime;
    }

    return 0;
}

export async function GET() {
    try {
        const data = await fetchLatestNews();

        const normalized = dedupeNews(
            toSafeArray(data)
                .map(normalizeNewsItem)
                .filter((item): item is NewsItem => item !== null)
        )
            .sort(sortNews)
            .slice(0, 12);

        return NextResponse.json(normalized, { status: 200 });
    } catch (error) {
        console.error("market-news api error", error);
        return NextResponse.json([], { status: 200 });
    }
}