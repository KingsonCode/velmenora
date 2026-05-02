"use client";

import { useState } from "react";

type Props = {
  accountId: string;
  initialBalance: number;
};

export default function MetricsActions({ accountId, initialBalance }: Props) {
  const [loading, setLoading] = useState<string | null>(null);
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
    <div className="mt-6 border border-gray-800 rounded-xl p-4 bg-black">
      <p className="text-sm text-gray-400 mb-3">
        Dev Simulation Panel
      </p>

      <div className="grid md:grid-cols-2 gap-3">
        <button
          onClick={() => sendMetrics("profit")}
          disabled={!!loading}
          className="bg-green-500 hover:bg-green-600 disabled:bg-gray-700 px-4 py-3 rounded-lg text-black font-semibold transition"
        >
          {loading === "profit" ? "Simulating..." : "Simulate Pass +10%"}
        </button>

        <button
          onClick={() => sendMetrics("loss")}
          disabled={!!loading}
          className="bg-red-500 hover:bg-red-600 disabled:bg-gray-700 px-4 py-3 rounded-lg text-black font-semibold transition"
        >
          {loading === "loss" ? "Simulating..." : "Simulate Loss Breach"}
        </button>
      </div>
    </div>
  );
}
