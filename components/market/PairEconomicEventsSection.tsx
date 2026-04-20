import EconomicCalendarSection from "@/components/market/EconomicCalendarSection";
import { getBaseUrl } from "@/lib/getBaseUrl";
import type { CalendarItem } from "@/lib/markets/feed-normalizers";

type PairEconomicEventsSectionProps = {
    pair: string;
    lang?: string;
    symbol?: string;
    marketName?: string;
    category?: string;
};

export const revalidate = 300;

function isCalendarItem(value: unknown): value is CalendarItem {
    if (!value || typeof value !== "object") {
        return false;
    }

    const item = value as Record<string, unknown>;

    return (
        typeof item.id === "string" &&
        typeof item.date === "string" &&
        typeof item.country === "string" &&
        typeof item.category === "string" &&
        typeof item.event === "string" &&
        typeof item.importance === "number" &&
        (typeof item.actual === "string" || typeof item.actual === "undefined") &&
        (typeof item.forecast === "string" || typeof item.forecast === "undefined") &&
        (typeof item.previous === "string" || typeof item.previous === "undefined")
    );
}

async function getEvents(pair: string): Promise<CalendarItem[]> {
    try {
        const res = await fetch(`${getBaseUrl()}/api/market-events/${pair}`, {
            next: { revalidate: 300 },
        });

        if (!res.ok) {
            throw new Error("Failed pair events fetch");
        }

        const data: unknown = await res.json();

        if (!Array.isArray(data)) {
            return [];
        }

        return data.filter(isCalendarItem);
    } catch {
        return [];
    }
}

export default async function PairEconomicEventsSection({
    pair,
    symbol,
    marketName,
    category,
}: PairEconomicEventsSectionProps) {
    const items = await getEvents(pair);

    return (
        <EconomicCalendarSection
            items={items}
            {...(symbol ? { symbol } : {})}
            {...(marketName ? { marketName } : {})}
            {...(category ? { category } : {})}
        />
    );
}