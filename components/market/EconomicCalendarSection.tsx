import type { CalendarItem } from "@/lib/markets/feed-normalizers";

type EconomicCalendarSectionProps = {
    items?: CalendarItem[];
    pair?: string;
    lang?: string;
    symbol?: string;
    marketName?: string;
    category?: string;
};

type ImpactLevel = "High" | "Medium" | "Low";

function formatEventTime(date: string) {
    if (!date) return "--";

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) return "--";

    return parsed.toLocaleString(undefined, {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

function getImpactLevel(importance?: number): ImpactLevel {
    if (typeof importance === "number") {
        if (importance >= 3) return "High";
        if (importance >= 2) return "Medium";
        return "Low";
    }

    return "Medium";
}

function getImpactClasses(level: ImpactLevel) {
    if (level === "High") {
        return "border-red-500/20 bg-red-500/10 text-red-300";
    }

    if (level === "Low") {
        return "border-emerald-500/20 bg-emerald-500/10 text-emerald-300";
    }

    return "border-amber-500/20 bg-amber-500/10 text-amber-300";
}

function countHighImpact(items: CalendarItem[]) {
    return items.filter((item) => getImpactLevel(item.importance) === "High").length;
}

export default function EconomicCalendarSection({
    items = [],
    symbol,
    marketName,
    category,
}: EconomicCalendarSectionProps) {
    const safeItems = Array.isArray(items) ? items : [];
    const highImpactCount = countHighImpact(safeItems);
    const contextLabel = marketName ?? symbol ?? "This market";
    const marketCategory = category ?? "macro";

    return (
        <section className="overflow-hidden rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,#0B0F1A_0%,#090D16_100%)] shadow-[0_0_0_1px_rgba(255,255,255,0.02)]">
            <div className="border-b border-white/10 px-5 py-6 sm:px-6">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                    <div className="max-w-3xl">
                        <div className="mb-3 inline-flex items-center rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-cyan-300">
                            Economic Calendar
                        </div>

                        <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                            Key Economic Events
                        </h2>

                        <p className="mt-3 text-sm leading-6 text-gray-400 sm:text-[15px]">
                            Track upcoming macro events shaping {contextLabel}. Monitor high-impact
                            releases, forecasts, and previous readings that may influence{" "}
                            {marketCategory} price action.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 sm:w-fit">
                        <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-gray-300">
                            <div className="text-[11px] uppercase tracking-[0.16em] text-gray-500">
                                Events loaded
                            </div>
                            <div className="mt-1 text-xl font-semibold text-white">
                                {safeItems.length}
                            </div>
                        </div>

                        <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-gray-300">
                            <div className="text-[11px] uppercase tracking-[0.16em] text-gray-500">
                                High impact
                            </div>
                            <div className="mt-1 text-xl font-semibold text-white">
                                {highImpactCount}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {safeItems.length === 0 ? (
                <div className="px-5 py-10 sm:px-6">
                    <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] px-6 py-10 text-center">
                        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-xl">
                            📅
                        </div>

                        <h3 className="text-base font-semibold text-white">
                            No calendar events right now
                        </h3>

                        <p className="mt-2 mx-auto max-w-xl text-sm leading-6 text-gray-400">
                            There are no relevant economic releases available at the moment.
                            Check back shortly for fresh macro updates and market-moving events.
                        </p>
                    </div>
                </div>
            ) : (
                <div className="divide-y divide-white/5">
                    {safeItems.map((item) => {
                        const impact = getImpactLevel(item.importance);

                        return (
                            <article
                                key={item.id}
                                className="group relative px-5 py-5 transition-colors duration-200 hover:bg-white/[0.03] sm:px-6"
                            >
                                <div className="absolute left-0 top-0 hidden h-full w-px bg-gradient-to-b from-cyan-400/0 via-cyan-400/20 to-cyan-400/0 sm:block" />

                                <div className="grid gap-5 xl:grid-cols-[180px_minmax(0,1fr)_260px]">
                                    <div className="min-w-0">
                                        <div className="text-[11px] uppercase tracking-[0.16em] text-gray-500">
                                            Time
                                        </div>

                                        <div className="mt-1 text-sm font-medium text-gray-200">
                                            {formatEventTime(item.date)}
                                        </div>

                                        <div className="mt-4 flex flex-wrap items-center gap-2">
                                            <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-xs font-medium text-gray-300">
                                                {item.country || "--"}
                                            </span>

                                            <span
                                                className={`rounded-full border px-2.5 py-1 text-xs font-medium ${getImpactClasses(
                                                    impact
                                                )}`}
                                            >
                                                {impact} Impact
                                            </span>
                                        </div>
                                    </div>

                                    <div className="min-w-0">
                                        <h3 className="text-base font-semibold leading-6 text-white sm:text-lg">
                                            {item.event}
                                        </h3>

                                        <p className="mt-2 text-sm leading-6 text-gray-400">
                                            {item.category || "Economic release"}
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 xl:grid-cols-3">
                                        <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
                                            <div className="text-[11px] uppercase tracking-[0.14em] text-gray-500">
                                                Actual
                                            </div>
                                            <div className="mt-2 text-sm font-semibold text-white">
                                                {item.actual || "--"}
                                            </div>
                                        </div>

                                        <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
                                            <div className="text-[11px] uppercase tracking-[0.14em] text-gray-500">
                                                Forecast
                                            </div>
                                            <div className="mt-2 text-sm font-semibold text-white">
                                                {item.forecast || "--"}
                                            </div>
                                        </div>

                                        <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
                                            <div className="text-[11px] uppercase tracking-[0.14em] text-gray-500">
                                                Previous
                                            </div>
                                            <div className="mt-2 text-sm font-semibold text-white">
                                                {item.previous || "--"}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </article>
                        );
                    })}
                </div>
            )}
        </section>
    );
}