import EconomicCalendarSection from "@/components/market/EconomicCalendarSection";
import { getBaseUrl } from "@/lib/getBaseUrl";
import type { CalendarItem } from "@/lib/markets/feed-normalizers";

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
        typeof item.actual === "string" &&
        typeof item.forecast === "string" &&
        typeof item.previous === "string"
    );
}

function sortHomeCalendar(items: CalendarItem[]) {
    return [...items].sort((a, b) => {
        if (b.importance !== a.importance) {
            return b.importance - a.importance;
        }

        const aTime = new Date(a.date).getTime();
        const bTime = new Date(b.date).getTime();

        if (Number.isFinite(aTime) && Number.isFinite(bTime) && aTime !== bTime) {
            return aTime - bTime;
        }

        return a.event.localeCompare(b.event);
    });
}

async function getCalendar(): Promise<CalendarItem[]> {
    try {
        const res = await fetch(`${getBaseUrl()}/api/economic-calendar`, {
            next: { revalidate: 300 },
        });

        if (!res.ok) {
            return [];
        }

        const data: unknown = await res.json();

        if (!Array.isArray(data)) {
            return [];
        }

        return sortHomeCalendar(data.filter(isCalendarItem)).slice(0, 6);
    } catch {
        return [];
    }
}

export default async function HomeCalendar() {
    const items = await getCalendar();

    return (
        <EconomicCalendarSection
            items={items}
            marketName="Global Markets"
            category="macro"
        />
    );
}