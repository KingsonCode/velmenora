"use client";

import { useEffect, useMemo, useState } from "react";

type MoneyBucket = {
  amount?: string;
  count?: number;
};

type AffiliateStatsResponse = {
  ok?: boolean;
  error?: string;
  affiliate?: {
    id?: string;
    ref?: string;
    isActive?: boolean;
    user?: {
      id?: string;
      email?: string;
      fullName?: string;
    };
  };
  stats?: {
    conversions?: number;
    commissions?: {
      pending?: MoneyBucket;
      approved?: MoneyBucket;
      payoutRequested?: MoneyBucket;
      paid?: MoneyBucket;
      rejected?: MoneyBucket;
    };
    payouts?: {
      requested?: MoneyBucket;
      approved?: MoneyBucket;
      paid?: MoneyBucket;
    };
    referralLink?: string;
  };
};

type AffiliatePayout = {
  id: string;
  amount?: string;
  currency?: string;
  status?: string;
  method?: string | null;
  reference?: string | null;
  notes?: string | null;
  requestedAt?: string;
  approvedAt?: string | null;
  rejectedAt?: string | null;
  paidAt?: string | null;
  commissions?: Array<{
    id: string;
    amount?: string;
    currency?: string;
    status?: string;
    planSlug?: string;
    createdAt?: string;
  }>;
};

type AffiliatePayoutsResponse = {
  ok?: boolean;
  error?: string;
  ref?: string;
  payouts?: AffiliatePayout[];
};

function money(value: unknown, currency = "USD") {
  const n = Number(value ?? 0);

  if (!Number.isFinite(n)) {
    return `${currency} 0`;
  }

  return `${currency} ${n.toLocaleString("en-US", {
    minimumFractionDigits: n % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  })}`;
}

function prettyStatus(value: unknown) {
  const status = String(value ?? "unknown").toLowerCase();

  const labels: Record<string, string> = {
    pending: "Pending",
    approved: "Approved",
    payout_requested: "Payout Requested",
    requested: "Requested",
    paid: "Paid",
    rejected: "Rejected",
    review: "Under Review",
    blocked: "Blocked",
  };

  if (labels[status]) return labels[status];

  return status
    .replaceAll("_", " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function statusTone(status: unknown) {
  const value = String(status ?? "").toLowerCase();

  if (value === "approved" || value === "paid") {
    return "border-green-500/30 bg-green-950/20 text-green-300";
  }

  if (value.includes("request") || value.includes("pending") || value.includes("review")) {
    return "border-blue-500/30 bg-blue-950/20 text-blue-300";
  }

  if (value === "rejected" || value === "blocked") {
    return "border-red-500/30 bg-red-950/20 text-red-300";
  }

  return "border-white/10 bg-white/[0.03] text-gray-300";
}

function formatDate(value: unknown) {
  if (!value) return "—";

  const date = new Date(String(value));

  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

function statAmount(bucket?: MoneyBucket) {
  return money(bucket?.amount ?? 0);
}

function statCount(bucket?: MoneyBucket) {
  return Number(bucket?.count ?? 0).toLocaleString("en-US");
}

export default function AffiliateDashboardPage() {
  const [ref, setRef] = useState("");
  const [draftRef, setDraftRef] = useState("");
  const [loading, setLoading] = useState(false);
  const [requestingPayout, setRequestingPayout] = useState(false);
  const [copyState, setCopyState] = useState("");
  const [error, setError] = useState("");
  const [payoutMessage, setPayoutMessage] = useState("");
  const [statsData, setStatsData] = useState<AffiliateStatsResponse | null>(null);
  const [payoutsData, setPayoutsData] = useState<AffiliatePayoutsResponse | null>(null);

  const referralUrl = useMemo(() => {
    const rawPath = statsData?.stats?.referralLink || `/funded?ref=${encodeURIComponent(ref)}`;

    if (typeof window === "undefined") return rawPath;

    return `${window.location.origin}${rawPath.startsWith("/") ? rawPath : `/${rawPath}`}`;
  }, [ref, statsData?.stats?.referralLink]);

  async function loadAffiliate(nextRef: string) {
    const cleanRef = nextRef.trim();

    if (!cleanRef) {
      setError("Enter your affiliate ref to load the dashboard.");
      return;
    }

    setLoading(true);
    setError("");
    setPayoutMessage("");
    setStatsData(null);
    setPayoutsData(null);

    try {
      const [statsRes, payoutsRes] = await Promise.all([
        fetch(`/api/funded/affiliate/my-stats?ref=${encodeURIComponent(cleanRef)}`, {
          cache: "no-store",
        }),
        fetch(`/api/funded/affiliate/payouts?ref=${encodeURIComponent(cleanRef)}`, {
          cache: "no-store",
        }),
      ]);

      const statsJson = (await statsRes.json()) as AffiliateStatsResponse;
      const payoutsJson = (await payoutsRes.json()) as AffiliatePayoutsResponse;

      if (!statsRes.ok || statsJson.ok === false) {
        throw new Error(statsJson.error || "Failed to load affiliate stats");
      }

      if (!payoutsRes.ok || payoutsJson.ok === false) {
        throw new Error(payoutsJson.error || "Failed to load affiliate payouts");
      }

      setRef(cleanRef);
      setDraftRef(cleanRef);
      setStatsData(statsJson);
      setPayoutsData(payoutsJson);
      window.localStorage.setItem("velmenora_affiliate_ref", cleanRef);
      window.history.replaceState(null, "", `/affiliate?ref=${encodeURIComponent(cleanRef)}`);
    } catch (err: any) {
      setError(err?.message || "Failed to load affiliate dashboard");
    } finally {
      setLoading(false);
    }
  }

  async function requestPayout() {
    const cleanRef = ref.trim();

    if (!cleanRef) {
      setError("Load your affiliate ref before requesting payout.");
      return;
    }

    setRequestingPayout(true);
    setError("");
    setPayoutMessage("");

    try {
      const res = await fetch("/api/funded/affiliate/payout/request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ref: cleanRef,
          method: "manual",
          notes: "Requested from affiliate dashboard",
        }),
      });

      const data = await res.json();

      if (!res.ok || data?.ok === false) {
        throw new Error(data?.error || "Failed to request payout");
      }

      setPayoutMessage("Payout request submitted successfully.");
      await loadAffiliate(cleanRef);
    } catch (err: any) {
      setError(err?.message || "Failed to request payout");
    } finally {
      setRequestingPayout(false);
    }
  }

  async function copyReferralLink() {
    try {
      await navigator.clipboard.writeText(referralUrl);
      setCopyState("Copied");
      window.setTimeout(() => setCopyState(""), 1400);
    } catch {
      setCopyState("Copy failed");
      window.setTimeout(() => setCopyState(""), 1400);
    }
  }

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const initialRef =
      params.get("ref") || window.localStorage.getItem("velmenora_affiliate_ref") || "";

    setDraftRef(initialRef);

    if (initialRef) {
      void loadAffiliate(initialRef);
    }
  }, []);

  const commissions = statsData?.stats?.commissions;
  const payouts = payoutsData?.payouts ?? [];
  const approvedAmount = Number(commissions?.approved?.amount ?? 0);

  return (
    <main className="min-h-screen bg-black px-4 py-8 text-white sm:px-6 sm:py-12">
      <div className="mx-auto max-w-7xl">
        <section className="rounded-[1.75rem] border border-green-500/20 bg-green-950/10 p-6 sm:rounded-[2rem] sm:p-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.25em] text-green-400 sm:text-sm">
                Velmenora Affiliate
              </p>

              <h1 className="mt-3 text-4xl font-black leading-tight md:text-6xl">
                Affiliate Dashboard
              </h1>

              <p className="mt-3 max-w-2xl text-gray-400">
                Track your referrals, funded challenge conversions, commissions, and payout requests.
              </p>
            </div>

            <a
              href="/funded"
              className="rounded-2xl border border-white/10 px-5 py-3 text-center font-bold text-white transition hover:border-green-500 hover:text-green-300"
            >
              View Challenge Plans
            </a>
          </div>
        </section>

        <section className="mt-6 rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-5 sm:rounded-[2rem] sm:p-6">
          <div className="grid gap-3 lg:grid-cols-[1fr_auto]">
            <div>
              <label className="text-xs font-black uppercase tracking-[0.22em] text-gray-500">
                Affiliate Ref
              </label>

              <input
                value={draftRef}
                onChange={(event) => setDraftRef(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    void loadAffiliate(draftRef);
                  }
                }}
                placeholder="e.g. johntrader"
                className="mt-2 w-full rounded-2xl border border-white/10 bg-black/50 px-4 py-3 font-semibold text-white outline-none transition placeholder:text-gray-700 focus:border-green-500"
              />
            </div>

            <button
              onClick={() => loadAffiliate(draftRef)}
              disabled={loading}
              className="rounded-2xl bg-green-500 px-6 py-3 font-black text-black transition hover:bg-green-400 disabled:cursor-not-allowed disabled:opacity-60 lg:self-end"
            >
              {loading ? "Loading..." : "Load Dashboard"}
            </button>
          </div>

          {error && (
            <div className="mt-4 rounded-2xl border border-red-900 bg-red-950/30 p-4 text-sm font-semibold text-red-300">
              {prettyStatus(error)}
            </div>
          )}

          {payoutMessage && (
            <div className="mt-4 rounded-2xl border border-green-900 bg-green-950/30 p-4 text-sm font-semibold text-green-300">
              {payoutMessage}
            </div>
          )}
        </section>

        {statsData?.ok && (
          <>
            <section className="mt-6 grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
              <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-5 sm:rounded-[2rem] sm:p-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.22em] text-green-400">
                      Referral Link
                    </p>

                    <h2 className="mt-2 text-2xl font-black">
                      {statsData.affiliate?.user?.fullName ||
                        statsData.affiliate?.user?.email ||
                        statsData.affiliate?.ref}
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                      Ref:{" "}
                      <span className="font-black text-gray-300">
                        {statsData.affiliate?.ref}
                      </span>
                    </p>
                  </div>

                  <span
                    className={`w-fit rounded-full border px-3 py-1 text-xs font-black ${
                      statsData.affiliate?.isActive
                        ? "border-green-500/30 bg-green-950/20 text-green-300"
                        : "border-red-500/30 bg-red-950/20 text-red-300"
                    }`}
                  >
                    {statsData.affiliate?.isActive ? "Active" : "Inactive"}
                  </span>
                </div>

                <div className="mt-5 rounded-2xl border border-white/10 bg-black/40 p-4">
                  <p className="break-all text-sm font-semibold text-gray-300">
                    {referralUrl}
                  </p>
                </div>

                <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                  <button
                    onClick={copyReferralLink}
                    className="rounded-2xl bg-white px-5 py-3 text-center font-black text-black transition hover:bg-gray-200"
                  >
                    {copyState || "Copy Referral Link"}
                  </button>

                  <a
                    href={referralUrl}
                    className="rounded-2xl border border-white/10 px-5 py-3 text-center font-black text-white transition hover:border-green-500 hover:text-green-300"
                  >
                    Open Link
                  </a>
                </div>
              </div>

              <div className="rounded-[1.75rem] border border-green-500/20 bg-green-950/10 p-5 sm:rounded-[2rem] sm:p-6">
                <p className="text-xs font-black uppercase tracking-[0.22em] text-green-400">
                  Payout Action
                </p>

                <h2 className="mt-2 text-3xl font-black">
                  {money(approvedAmount)}
                </h2>

                <p className="mt-2 text-sm text-gray-400">
                  Approved commissions available for payout request. The backend will reject the request automatically if no approved commissions are eligible.
                </p>

                <button
                  onClick={requestPayout}
                  disabled={requestingPayout || approvedAmount <= 0}
                  className="mt-5 w-full rounded-2xl bg-green-500 px-5 py-3 font-black text-black transition hover:bg-green-400 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {requestingPayout ? "Requesting..." : "Request Payout"}
                </button>
              </div>
            </section>

            <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-5">
                <p className="text-sm text-gray-500">Conversions</p>
                <p className="mt-2 text-3xl font-black">
                  {Number(statsData.stats?.conversions ?? 0).toLocaleString("en-US")}
                </p>
              </div>

              <div className="rounded-[1.5rem] border border-yellow-500/20 bg-yellow-950/10 p-5">
                <p className="text-sm text-gray-500">Pending</p>
                <p className="mt-2 text-2xl font-black">{statAmount(commissions?.pending)}</p>
                <p className="mt-1 text-xs text-gray-500">{statCount(commissions?.pending)} records</p>
              </div>

              <div className="rounded-[1.5rem] border border-green-500/20 bg-green-950/10 p-5">
                <p className="text-sm text-gray-500">Approved</p>
                <p className="mt-2 text-2xl font-black">{statAmount(commissions?.approved)}</p>
                <p className="mt-1 text-xs text-gray-500">{statCount(commissions?.approved)} records</p>
              </div>

              <div className="rounded-[1.5rem] border border-blue-500/20 bg-blue-950/10 p-5">
                <p className="text-sm text-gray-500">Requested</p>
                <p className="mt-2 text-2xl font-black">
                  {statAmount(commissions?.payoutRequested)}
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  {statCount(commissions?.payoutRequested)} records
                </p>
              </div>

              <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-5">
                <p className="text-sm text-gray-500">Paid</p>
                <p className="mt-2 text-2xl font-black">{statAmount(commissions?.paid)}</p>
                <p className="mt-1 text-xs text-gray-500">{statCount(commissions?.paid)} records</p>
              </div>
            </section>

            <section className="mt-6 rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-5 sm:rounded-[2rem] sm:p-6">
              <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                <div>
                  <h2 className="text-3xl font-black">Payout History</h2>
                  <p className="mt-1 text-sm text-gray-500">
                    Latest payout requests and linked commission records.
                  </p>
                </div>

                <p className="text-sm font-bold text-gray-500">
                  {payouts.length.toLocaleString("en-US")} records
                </p>
              </div>

              {payouts.length === 0 ? (
                <div className="mt-5 rounded-2xl border border-white/10 bg-black/30 p-6 text-center">
                  <h3 className="text-xl font-black">No payout requests yet</h3>
                  <p className="mt-2 text-sm text-gray-500">
                    Approved commissions will become eligible for payout request.
                  </p>
                </div>
              ) : (
                <div className="mt-5 overflow-hidden rounded-2xl border border-white/10">
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[760px] text-left text-sm">
                      <thead className="border-b border-white/10 bg-white/[0.04] text-xs uppercase tracking-[0.18em] text-gray-500">
                        <tr>
                          <th className="px-4 py-3">Amount</th>
                          <th className="px-4 py-3">Status</th>
                          <th className="px-4 py-3">Method</th>
                          <th className="px-4 py-3">Commissions</th>
                          <th className="px-4 py-3">Requested</th>
                          <th className="px-4 py-3">Paid</th>
                        </tr>
                      </thead>

                      <tbody className="divide-y divide-white/10">
                        {payouts.map((payout) => (
                          <tr key={payout.id} className="bg-black/20">
                            <td className="px-4 py-4 font-black">
                              {money(payout.amount, payout.currency || "USD")}
                            </td>

                            <td className="px-4 py-4">
                              <span
                                className={`rounded-full border px-3 py-1 text-xs font-black ${statusTone(
                                  payout.status,
                                )}`}
                              >
                                {prettyStatus(payout.status)}
                              </span>
                            </td>

                            <td className="px-4 py-4 text-gray-300">
                              {payout.method || "manual"}
                            </td>

                            <td className="px-4 py-4 text-gray-300">
                              {Number(payout.commissions?.length ?? 0).toLocaleString("en-US")}
                            </td>

                            <td className="px-4 py-4 text-gray-400">
                              {formatDate(payout.requestedAt)}
                            </td>

                            <td className="px-4 py-4 text-gray-400">
                              {formatDate(payout.paidAt)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </main>
  );
}
