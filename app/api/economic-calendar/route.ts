import { NextResponse } from "next/server";
import { fetchEconomicCalendar, toSafeArray } from "@/lib/markets/provider";
import {
    dedupeCalendarItems,
    normalizeCalendarItem,
    sortCalendar,
    type CalendarItem,
} from "@/lib/markets/feed-normalizers";

export async function GET() {
    try {
        const data = await fetchEconomicCalendar();

        const raw = toSafeArray(data);

        const normalized = dedupeCalendarItems(
            raw
                .map(normalizeCalendarItem)
                .filter((item): item is CalendarItem => item !== null)
        )
            .sort(sortCalendar)
            .slice(0, 25);

        console.log("economic-calendar raw:", raw.length);
        console.log("economic-calendar normalized:", normalized.length);

        return NextResponse.json(normalized, {
            status: 200,
            headers: {
                "Cache-Control": "s-maxage=300, stale-while-revalidate=600",
            },
        });
    } catch (error) {
        console.error("economic-calendar api error", error);

        return NextResponse.json([], {
            status: 200,
            headers: {
                "Cache-Control": "s-maxage=60, stale-while-revalidate=120",
            },
        });
    }
}