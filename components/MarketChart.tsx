"use client";

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
} from "recharts";

type ChartPoint = {
    time: string;
    price: number;
};

type Props = {
    data: ChartPoint[];
};

function formatPrice(value: number) {
    if (value >= 1000) return value.toFixed(2);
    if (value >= 100) return value.toFixed(2);
    return value.toFixed(5);
}

function CustomTooltip({
    active,
    payload,
    label,
}: {
    active?: boolean;
    payload?: Array<{ value: number }>;
    label?: string;
}) {
    if (!active || !payload?.length) return null;

    const price = payload[0]?.value;

    return (
        <div className="rounded-2xl border border-white/10 bg-[#0B0F1A]/95 px-3 py-2 shadow-2xl backdrop-blur-md">
            <div className="text-[11px] uppercase tracking-[0.14em] text-gray-500">
                {label ?? "--"}
            </div>
            <div className="mt-1 text-sm font-semibold text-white">
                {typeof price === "number" ? formatPrice(price) : "--"}
            </div>
        </div>
    );
}

export default function MarketChart({ data }: Props) {
    const safeData = Array.isArray(data) ? data : [];
    const hasData = safeData.length > 0;

    return (
        <section className="overflow-hidden rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.015))]">
            <div className="border-b border-white/10 px-4 py-4 sm:px-5">
                <div className="flex items-center justify-between gap-3">
                    <div>
                        <div className="mb-2 inline-flex items-center rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-cyan-300">
                            Live Chart
                        </div>
                        <h2 className="text-lg font-semibold tracking-tight text-white sm:text-xl">
                            Price Movement
                        </h2>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-black/20 px-3 py-2 text-right">
                        <div className="text-[11px] uppercase tracking-[0.14em] text-gray-500">
                            Data Points
                        </div>
                        <div className="mt-1 text-sm font-semibold text-white">
                            {safeData.length}
                        </div>
                    </div>
                </div>
            </div>

            {!hasData ? (
                <div className="px-5 py-12 text-center">
                    <div className="mx-auto max-w-md rounded-2xl border border-dashed border-white/10 bg-white/[0.02] px-6 py-10">
                        <div className="text-base font-semibold text-white">
                            No chart data available
                        </div>
                        <p className="mt-2 text-sm leading-6 text-gray-400">
                            Live market price history is not available right now. Check back shortly.
                        </p>
                    </div>
                </div>
            ) : (
                <div className="h-[260px] w-full min-w-0 px-2 pb-3 pt-2 sm:h-[320px] sm:px-3">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                            data={safeData}
                            margin={{ top: 16, right: 16, left: 4, bottom: 8 }}
                        >
                            <CartesianGrid
                                stroke="rgba(255,255,255,0.06)"
                                vertical={false}
                            />

                            <XAxis
                                dataKey="time"
                                tick={{ fontSize: 11, fill: "#6B7280" }}
                                axisLine={false}
                                tickLine={false}
                                minTickGap={24}
                            />

                            <YAxis
                                domain={["auto", "auto"]}
                                tickFormatter={(value: number) => formatPrice(value)}
                                tick={{ fontSize: 11, fill: "#6B7280" }}
                                axisLine={false}
                                tickLine={false}
                                width={68}
                            />

                            <Tooltip content={<CustomTooltip />} />

                            <Line
                                type="monotone"
                                dataKey="price"
                                stroke="#22d3ee"
                                strokeWidth={2.5}
                                dot={false}
                                activeDot={{
                                    r: 4,
                                    fill: "#22d3ee",
                                    stroke: "#0B0F1A",
                                    strokeWidth: 2,
                                }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            )}
        </section>
    );
}