"use client";

import { useMemo } from "react";
import {
    ResponsiveContainer,
    AreaChart,
    Area,
} from "recharts";

type Props = {
    data?: number[];
};

export default function Sparkline({ data = [] }: Props) {

    /* 🔥 GUARD CLAUSE */
    if (!data || data.length < 2) return null;

    /* 🔥 MEMO (PERFORMANCE BOOST) */
    const chartData = useMemo(
        () => data.map((v, i) => ({ value: v, i })),
        [data]
    );

    /* 🔥 SAFE VALUES */
    const first = data[0];
    const last = data[data.length - 1];

    if (first === undefined || last === undefined) return null;

    /* 🔥 TREND DETECTION */
    const isUp = last > first;

    const strokeColor = isUp ? "#22c55e" : "#ef4444";

    return (
        <div className="w-20 h-8">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>

                    {/* 🔥 GRADIENT */}
                    <defs>
                        <linearGradient
                            id={`grad-${isUp ? "up" : "down"}`}
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                        >
                            <stop
                                offset="0%"
                                stopColor={strokeColor}
                                stopOpacity={0.4}
                            />
                            <stop
                                offset="100%"
                                stopColor={strokeColor}
                                stopOpacity={0}
                            />
                        </linearGradient>
                    </defs>

                    {/* 🔥 AREA */}
                    <Area
                        type="monotone"
                        dataKey="value"
                        stroke={strokeColor}
                        strokeWidth={2}
                        fill={`url(#grad-${isUp ? "up" : "down"})`}
                        dot={false}
                        isAnimationActive={false} // 🔥 prevents jitter
                    />

                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}