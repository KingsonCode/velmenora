"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";

type AffiliateMe = {
  ok: boolean;
  approved: boolean;
  affiliate?: any;
  application?: any;
};

export default function AffiliateDashboardPage() {
  const [me, setMe] = useState<AffiliateMe | null>(null);
  const [stats, setStats] = useState<any>(null);
  const [payouts, setPayouts] = useState<any[]>([]);
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  async function load() {
    setMessage(null);

    const meRes = await fetch("/api/funded/affiliate/me", { credentials: "include" });
    const meData = await meRes.json();
    setMe(meData);

    if (meRes.ok && meData.approved) {
      const [statsRes, payoutsRes] = await Promise.all([
        fetch("/api/funded/affiliate/me/stats", { credentials: "include" }),
        fetch("/api/funded/affiliate/me/payouts", { credentials: "include" }),
      ]);

      const statsData = await statsRes.json();
      const payoutsData = await payoutsRes.json();

      if (statsRes.ok) setStats(statsData.stats);
      if (payoutsRes.ok) setPayouts(payoutsData.payouts || []);
    }
  }

  useEffect(() => {
    load().catch((err) => setMessage(err?.message || "Failed to load dashboard."));
  }, []);

  async function requestPayout(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage(null);

    const res = await fetch("/api/funded/affiliate/me/payout/request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        amount: Number(amount),
        payoutMethod: "manual",
        currency: "USD",
        payoutDetails: {},
      }),
    });

    const data = await res.json();

    if (!res.ok || !data.ok) {
      setMessage(data.message || data.reason || "Payout request failed.");
      return;
    }

    setAmount("");
    setMessage("Payout request submitted.");
    await load();
  }

  if (!me) {
    return (
      <main className="min-h-screen bg-slate-950 p-6 text-white">
        Loading affiliate dashboard...
      </main>
    );
  }

  if (!me.approved) {
    return (
      <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
        <section className="mx-auto max-w-3xl rounded-3xl border border-yellow-400/20 bg-yellow-400/10 p-8">
          <h1 className="text-3xl font-black">Affiliate access pending</h1>
          <p className="mt-3 text-slate-200">
            Your affiliate dashboard is protected. You need an approved affiliate profile
            before stats and payout access are available.
          </p>
          <div className="mt-6 flex gap-3">
            <Link href="/affiliate/apply" className="rounded-2xl bg-emerald-400 px-5 py-3 font-bold text-slate-950">
              Apply Now
            </Link>
            <Link href="/affiliate" className="rounded-2xl border border-white/15 px-5 py-3 font-bold">
              Back
            </Link>
          </div>
        </section>
      </main>
    );
  }

  const affiliate = me.affiliate || {};
  const link =
    typeof window !== "undefined"
      ? `${window.location.origin}/funded?ref=${affiliate.affiliateCode}`
      : "";

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <section className="mx-auto max-w-6xl">
        <h1 className="text-4xl font-black">Affiliate Dashboard</h1>
        <p className="mt-2 text-slate-300">Approved affiliate money area.</p>

        {message && (
          <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
            {message}
          </div>
        )}

        <div className="mt-8 grid gap-5 md:grid-cols-4">
          {[
            ["Code", affiliate.affiliateCode],
            ["Rate", `${stats?.commissionRatePct ?? affiliate.commissionRatePct ?? 0}%`],
            ["Earned", `$${Number(stats?.totalEarned ?? affiliate.totalEarned ?? 0).toLocaleString()}`],
            ["Balance", `$${Number(stats?.payoutBalance ?? affiliate.payoutBalance ?? 0).toLocaleString()}`],
          ].map(([label, value]) => (
            <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <p className="text-sm text-slate-400">{label}</p>
              <p className="mt-2 text-2xl font-black">{value}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <h2 className="text-xl font-bold">Your referral link</h2>
          <div className="mt-3 overflow-x-auto rounded-xl bg-slate-900 p-4 text-sm text-emerald-300">
            {link}
          </div>
        </div>

        <form onSubmit={requestPayout} className="mt-8 rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <h2 className="text-xl font-bold">Request payout</h2>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <input
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="flex-1 rounded-xl border border-white/10 bg-slate-900 px-4 py-3 outline-none"
              placeholder="Amount in USD"
              inputMode="numeric"
            />
            <button className="rounded-xl bg-emerald-400 px-6 py-3 font-black text-slate-950">
              Request
            </button>
          </div>
        </form>

        <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <h2 className="text-xl font-bold">Recent payouts</h2>
          <div className="mt-4 space-y-3">
            {payouts.length === 0 ? (
              <p className="text-slate-400">No payout requests yet.</p>
            ) : (
              payouts.map((payout) => (
                <div key={payout.id} className="rounded-2xl border border-white/10 bg-slate-900 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <span className="font-bold">${Number(payout.amount).toLocaleString()}</span>
                    <span className="rounded-full border border-white/10 px-3 py-1 text-xs uppercase text-slate-300">
                      {String(payout.status).replaceAll("_", " ")}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
