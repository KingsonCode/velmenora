"use client";

import { useEffect, useState } from "react";
import AdminAuthGate from "../../../_components/AdminAuthGate";
import { adminGet, adminPost } from "../_components/adminAffiliateApi";

type PayoutRequest = {
  id?: string;
  affiliateId?: string;
  affiliateName?: string;
  affiliateEmail?: string;
  requestedAmount?: string | number;
  amount?: string | number;
  currency?: string;
  status?: string;
  method?: string;
  createdAt?: string;
  requestedAt?: string;
  [key: string]: unknown;
};

function money(value: unknown, currency = "USD") {
  const n = Number(value ?? 0);
  return `${currency} ${n.toLocaleString("en-US", {
    maximumFractionDigits: 2,
  })}`;
}

function pickRows(payload: unknown): PayoutRequest[] {
  const p = payload as any;

  if (Array.isArray(p)) return p;
  if (Array.isArray(p?.payoutRequests)) return p.payoutRequests;
  if (Array.isArray(p?.affiliatePayoutRequests)) return p.affiliatePayoutRequests;
  if (Array.isArray(p?.data)) return p.data;

  return [];
}

export default function AdminAffiliatePayoutsPage() {
  const [rows, setRows] = useState<PayoutRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [busyId, setBusyId] = useState<string>("");

  async function load() {
    setLoading(true);
    setError("");

    const result = await adminGet<unknown>("admin/affiliate/payouts");

    if (!result.ok) {
      setError(result.error || "Failed to load payout requests");
      setRows([]);
    } else {
      setRows(pickRows(result.raw));
    }

    setLoading(false);
  }

  async function action(id: string, actionName: "approve" | "reject" | "pay") {
    setBusyId(id);
    setError("");

    const result = await adminPost(
      `admin/affiliate/payouts/${actionName}`,
      { payoutId: id, reviewerId: "admin" }
    );

    if (!result.ok) {
      setError(result.error || `Failed to ${actionName}`);
    }

    await load();
    setBusyId("");
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <AdminAuthGate>
      <main className="min-h-screen bg-slate-950 px-6 py-8 text-slate-100">
      <section className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-cyan-300">
              Velmenora Admin
            </p>
            <h1 className="text-3xl font-bold">Affiliate Payout Requests</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-400">
              Review payout requests, approve eligible payouts, and mark paid
              after manual settlement.
            </p>
          </div>

          <button
            onClick={load}
            className="rounded-xl border border-slate-700 px-4 py-2 text-sm font-semibold hover:bg-slate-900"
          >
            Refresh
          </button>
        </div>

        {error ? (
          <div className="mb-4 rounded-xl border border-red-500/40 bg-red-950/30 p-4 text-sm text-red-200">
            {error}
          </div>
        ) : null}

        <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60">
          <table className="w-full min-w-[1000px] text-left text-sm">
            <thead className="bg-slate-900 text-xs uppercase tracking-wide text-slate-400">
              <tr>
                <th className="px-4 py-3">Affiliate</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Method</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Requested</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td className="px-4 py-6 text-slate-400" colSpan={7}>
                    Loading payout requests...
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td className="px-4 py-6 text-slate-400" colSpan={7}>
                    No payout requests found.
                  </td>
                </tr>
              ) : (
                rows.map((row, index) => {
                  const id = String(row.id ?? index);
                  const currency = String(row.currency ?? "USD");
                  const amount = row.requestedAmount ?? row.amount ?? 0;

                  return (
                    <tr key={id} className="border-t border-slate-800">
                      <td className="px-4 py-4 font-medium">
                        {String(row.affiliateName ?? row.affiliateId ?? "—")}
                      </td>
                      <td className="px-4 py-4 text-slate-300">
                        {String(row.affiliateEmail ?? "—")}
                      </td>
                      <td className="px-4 py-4 font-bold text-emerald-300">
                        {money(amount, currency)}
                      </td>
                      <td className="px-4 py-4 text-slate-300">
                        {String(row.method ?? "manual")}
                      </td>
                      <td className="px-4 py-4">
                        <span className="rounded-full border border-cyan-500/30 bg-cyan-950/30 px-3 py-1 text-xs text-cyan-200">
                          {String(row.status ?? "unknown").replaceAll("_", " ")}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-slate-400">
                        {row.requestedAt || row.createdAt
                          ? new Date(
                              String(row.requestedAt ?? row.createdAt)
                            ).toLocaleString()
                          : "—"}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            disabled={busyId === id}
                            onClick={() => action(id, "approve")}
                            className="rounded-lg bg-emerald-500 px-3 py-2 text-xs font-bold text-slate-950 disabled:opacity-50"
                          >
                            Approve
                          </button>
                          <button
                            disabled={busyId === id}
                            onClick={() => action(id, "reject")}
                            className="rounded-lg bg-red-500 px-3 py-2 text-xs font-bold text-white disabled:opacity-50"
                          >
                            Reject
                          </button>
                          <button
                            disabled={busyId === id}
                            onClick={() => action(id, "pay")}
                            className="rounded-lg bg-cyan-400 px-3 py-2 text-xs font-bold text-slate-950 disabled:opacity-50"
                          >
                            Mark Paid
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
    </AdminAuthGate>
  );
}
