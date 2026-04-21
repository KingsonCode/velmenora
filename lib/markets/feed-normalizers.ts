import type { TradingEconomicsRawItem } from "@/lib/markets/provider";

export type CalendarItem = {
    id: string;
    date: string;
    country: string;
    category: string;
    event: string;
    importance: number;
    actual: string;
    forecast: string;
    previous: string;
};

export type NewsItem = {
    id: string;
    title: string;
    summary: string;
    source: string;
    time: string;
    url: string;
};

const DEFAULT_NEWS_SOURCE = "Trading Economics";
const DEFAULT_NEWS_SUMMARY = "Latest market update.";

export function toImportance(value: unknown): number {
    if (typeof value === "number" && Number.isFinite(value)) {
        return value;
    }

    if (typeof value === "string") {
        const parsed = Number(value);
        return Number.isFinite(parsed) ? parsed : 0;
    }

    return 0;
}

export function toSafeUrl(value: unknown): string {
    const raw = String(value ?? "").trim();

    if (!raw) return "#";

    try {
        return new URL(raw).toString();
    } catch {
        return "#";
    }
}

export function isValidDateString(value: unknown): value is string {
    if (typeof value !== "string" || !value.trim()) {
        return false;
    }

    const time = new Date(value).getTime();
    return Number.isFinite(time);
}

export function getSafeTime(value: unknown): number | null {
    if (typeof value !== "string" || !value.trim()) {
        return null;
    }

    const parsed = new Date(value).getTime();
    return Number.isFinite(parsed) ? parsed : null;
}

export function normalizeCalendarItem(
    item: TradingEconomicsRawItem
): CalendarItem | null {
    const rawId =
        item.CalendarId ?? item.CalendarID ?? item.Date ?? item.Event ?? "";
    const id = String(rawId).trim();

    const date = String(item.Date ?? "").trim();
    const country = String(item.Country ?? "").trim();
    const category = String(item.Category ?? item.Event ?? "").trim();
    const event = String(item.Event ?? "").trim();

    if (!id || !date || !country || !event) {
        return null;
    }

    return {
        id,
        date,
        country,
        category: category || "Economic release",
        event,
        importance: toImportance(item.Importance),
        actual: String(item.Actual ?? "").trim(),
        forecast: String(item.Forecast ?? "").trim(),
        previous: String(item.Previous ?? "").trim(),
    };
}

export function normalizeNewsItem(
    item: TradingEconomicsRawItem
): NewsItem | null {
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

    const source = String(
        item.source ?? item.Source ?? DEFAULT_NEWS_SOURCE
    ).trim();
    const time = String(item.date ?? item.Date ?? "").trim();
    const url = toSafeUrl(item.url ?? item.URL);

    if (!id || !title) {
        return null;
    }

    return {
        id,
        title,
        summary: summary || DEFAULT_NEWS_SUMMARY,
        source: source || DEFAULT_NEWS_SOURCE,
        time,
        url,
    };
}

export function dedupeCalendarItems(items: CalendarItem[]) {
    const seen = new Set<string>();

    return items.filter((item) => {
        const key = `${item.date}__${item.country}__${item.event}`.toLowerCase();

        if (seen.has(key)) {
            return false;
        }

        seen.add(key);
        return true;
    });
}

export function dedupeNewsItems(items: NewsItem[]) {
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

export function sortCalendar(a: CalendarItem, b: CalendarItem) {
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

export function sortNews(a: NewsItem, b: NewsItem) {
    const aTime = getSafeTime(a.time);
    const bTime = getSafeTime(b.time);

    if (aTime !== null && bTime !== null && aTime !== bTime) {
        return bTime - aTime;
    }

    return a.title.localeCompare(b.title);
}