"use client";

import { useState } from "react";

type Props = {
  accountId: string;
  initialBalance: number;
};

const SHOW_DEV_METRICS =
  process.env.NEXT_PUBLIC_SHOW_FUNDED_DEV_TOOLS === "true";

export default function MetricsActions({ accountId, initialBalance }: Props) {
  const [loading, setLoading] = useState<string | null>(null);

  if (!SHOW_DEV_METRICS) {
    return null;
  }

  const targetBalance = Math.round(initialBalance * 1.1);

  async function sendMetrics(type: "profit" | "loss") {
    setLoading(type);

    const payload =
      type === "profit"
        ? {
            currentBalance: targetBalance,
            currentEquity: targetBalance,
            pnl: targetBalance - initialBalance,
            tradingDaysCount: 5,
          }
        : {
            currentBalance: Math.round(initialBalance * 0.93),
            currentEquity: Math.round(initialBalance * 0.93),
            pnl: Math.round(initialBalance * -0.07),
            tradingDaysCount: 1,
          };

    await fetch(`/api/funded/account/${accountId}/metrics`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    window.location.reload();
  }

  return (
    <div className="mt-6 rounded-xl border border-yellow-500/30 bg-yellow-950/10 p-4">
      <p className="mb-3 text-sm font-semibold text-yellow-300">
        Dev Simulation Panel
      </p>

      <div className="grid gap-3 md:grid-cols-2">
        <button
          onClick={() => sendMetrics("profit")}
          disabled={!!loading}
          className="rounded-lg bg-green-500 px-4 py-3 font-semibold text-black transition hover:bg-green-600 disabled:bg-gray-700"
        >
          {loading === "profit" ? "Simulating..." : "Simulate Pass +10%"}
        </button>

        <button
          onClick={() => sendMetrics("loss")}
          disabled={!!loading}
          className="rounded-lg bg-red-500 px-4 py-3 font-semibold text-black transition hover:bg-red-600 disabled:bg-gray-700"
        >
          {loading === "loss" ? "Simulating..." : "Simulate Loss Breach"}
        </button>
      </div>
    </div>
  );
}
