"use client";

import {
    LineChart,
    Line,
    XAxis,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

type Props = {
    data: { time: string; price: number }[];
};

export default function MarketChart({ data }: Props) {
    return (
        <div className="w-full h-[180px] min-w-0"> {/* 🔥 FIX ALL */}
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                    <XAxis
                        dataKey="time"
                        tick={{ fontSize: 10, fill: "#888" }}
                        axisLine={false}
                        tickLine={false}
                    />

                    <Tooltip
                        contentStyle={{
                            background: "#111",
                            border: "1px solid rgba(255,255,255,0.1)",
                            borderRadius: "8px",
                            fontSize: "12px",
                        }}
                        labelStyle={{ color: "#aaa" }}
                    />

                    <Line
                        type="monotone"
                        dataKey="price"
                        stroke="#22c55e" // 🔥 green trading color
                        strokeWidth={2}
                        dot={false}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}