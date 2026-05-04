"use client";

import { useEffect, useState } from "react";

function money(value: unknown) {
  const n = Number(value ?? 0);
  return `$${n.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
}

function challengeCodeFromName(name: unknown) {
  const value = String(name ?? "").toUpperCase();

  if (value.includes("50K")) return "50K";
  if (value.includes("25K")) return "25K";
  if (value.includes("10K")) return "10K";

  return "ACC";
}

function accountDisplayId(account: any) {
  const suffix = String(account?.id ?? "").slice(-4).toUpperCase();
  const code = challengeCodeFromName(account?.challenge?.name);

  return `VM-${code}-${suffix || "0000"}`;
}

function prettyStatus(value: unknown) {
  const status = String(value ?? "unknown").toLowerCase();

  const labels: Record<string, string> = {
    pending_payment: "Pending Payment",
    payment_confirmed: "Payment Confirmed",
    assigned: "Assigned",
    active: "Active",
    under_review: "Under Review",
    passed: "Challenge Passed",
    failed: "Challenge Failed",
    payout_pending: "Reward Pending",
    payout_requested: "Reward Requested",
    payout_under_review: "Reward Under Review",
    payout_approved: "Reward Approved",
    payout_paid: "Reward Paid",
    verified: "Verified",
    rejected: "Rejected",
    pending: "Pending",
    not_connected: "Not Connected",
  };

  if (labels[status]) return labels[status];

  return status
    .replaceAll("_", " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function statusTone(status: string) {
  if (status === "payout_paid" || status === "passed" || status === "active") {
    return "border-green-500/30 bg-green-950/20 text-green-300";
  }

  if (status.includes("review") || status.includes("payout")) {
    return "border-blue-500/30 bg-blue-950/20 text-blue-300";
  }

  if (status === "failed") {
    return "border-red-500/30 bg-red-950/20 text-red-300";
  }

  return "border-yellow-500/30 bg-yellow-950/20 text-yellow-300";
}

function isPendingPayment(account: any) {
  return account?.status === "pending_payment" || account?.paymentStatus === "pending";
}

export default function MemberPage() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const meRes = await fetch("/api/auth/me", { cache: "no-store" });

        if (!meRes.ok) {
          window.location.href = "/sign-in";
          return;
        }

        const me = await meRes.json();
        setUser(me.user);

        const accountRes = await fetch("/api/member/challenges", {
          cache: "no-store",
        });

        const accountData = await accountRes.json();

        if (!accountRes.ok || accountData?.ok === false) {
          throw new Error(
            accountData?.message || accountData?.error || "Failed to load challenges",
          );
        }

        setAccounts(accountData.accounts || []);
      } catch (err: any) {
        setError(err.message || "Failed to load member area");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/";
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-black px-4 py-10 text-white sm:px-6 sm:py-16">
        <div className="mx-auto max-w-5xl rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
          Loading member area...
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black px-4 py-8 text-white sm:px-6 sm:py-12">
      <div className="mx-auto max-w-7xl">
        <section className="rounded-[1.75rem] border border-green-500/20 bg-green-950/10 p-6 sm:rounded-[2rem] sm:p-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.25em] text-green-400 sm:text-sm">
                Member Area
              </p>

              <h1 className="mt-3 text-4xl font-black leading-tight md:text-6xl">
                Welcome{user?.fullName ? `, ${user.fullName}` : ""}
              </h1>

              <p className="mt-3 max-w-2xl text-gray-400">
                Track your funded challenges, broker verification, metrics, reviews, and rewards.
              </p>
            </div>

            <button
              onClick={logout}
              className="rounded-2xl border border-white/10 px-5 py-3 font-bold text-white transition hover:border-red-500 hover:text-red-300"
            >
              Logout
            </button>
          </div>
        </section>

        {error && (
          <div className="mt-5 rounded-2xl border border-red-900 bg-red-950/30 p-4 text-sm text-red-300">
            {error}
          </div>
        )}

        <section className="mt-7 sm:mt-8">
          <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-3xl font-black">My Challenges</h2>
              <p className="mt-1 text-sm text-gray-500">
                Your challenge accounts are linked to your member account.
              </p>
            </div>

            <a
              href="/funded"
              className="sticky top-3 z-20 rounded-2xl bg-green-500 px-5 py-3 text-center font-black text-black shadow-[0_12px_40px_rgba(34,197,94,0.18)] transition hover:bg-green-400 md:static"
            >
              Start New Challenge
            </a>
          </div>

          {accounts.length === 0 ? (
            <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-6 text-center sm:rounded-[2rem] sm:p-8">
              <h3 className="text-2xl font-black">No challenges yet</h3>
              <p className="mt-2 text-gray-400">
                Start a funded challenge to create your first account.
              </p>
              <a
                href="/funded"
                className="mt-6 inline-flex rounded-2xl bg-green-500 px-6 py-3 font-black text-black hover:bg-green-400"
              >
                View Challenge Plans
              </a>
            </div>
          ) : (
            <div className="grid gap-4 lg:grid-cols-2">
              {accounts.map((account) => {
                const broker = account.brokerAccounts?.[0];
                const payout = account.payoutRequests?.[0];
                const pendingPayment = isPendingPayment(account);

                return (
                  <article
                    key={account.id}
                    className="rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-5 transition hover:border-green-500/40 hover:bg-white/[0.05] sm:rounded-[2rem] sm:p-6"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <h3 className="text-2xl font-black leading-tight">
                          {account.challenge?.name ?? "Challenge Account"}
                        </h3>

                        <p className="mt-1 text-xs font-semibold text-gray-500">
                          Account ID:{" "}
                          <span className="font-black text-gray-400">
                            {accountDisplayId(account)}
                          </span>
                        </p>
                      </div>

                      <span
                        className={`w-fit rounded-full border px-3 py-1 text-xs font-black ${statusTone(
                          account.status,
                        )}`}
                      >
                        {prettyStatus(account.status)}
                      </span>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-2.5 text-sm md:grid-cols-4 md:gap-3">
                      <div className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 sm:p-4">
                        <p className="text-gray-500">Balance</p>
                        <p className="mt-1 font-black">{money(account.currentBalance)}</p>
                      </div>

                      <div className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 sm:p-4">
                        <p className="text-gray-500">Equity</p>
                        <p className="mt-1 font-black">{money(account.currentEquity)}</p>
                      </div>

                      <div className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 sm:p-4">
                        <p className="text-gray-500">Broker</p>
                        <p className="mt-1 font-black">
                          {broker?.verificationStatus
                            ? prettyStatus(broker.verificationStatus)
                            : "Not Connected"}
                        </p>
                      </div>

                      <div className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 sm:p-4">
                        <p className="text-gray-500">Reward</p>
                        <p className="mt-1 font-black">
                          {payout?.status ? prettyStatus(payout.status) : "—"}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                      {pendingPayment ? (
                        <a
                          href={`/funded/account/${account.id}`}
                          className="flex min-h-12 flex-1 items-center justify-center rounded-2xl bg-green-500 px-5 py-3 text-center font-black text-black transition hover:bg-green-400"
                        >
                          Complete Payment
                        </a>
                      ) : (
                        <a
                          href={`/funded/account/${account.id}`}
                          className="flex min-h-12 flex-1 items-center justify-center rounded-2xl border border-white/10 px-5 py-3 text-center font-black text-white transition hover:border-green-500/40 hover:text-green-300"
                        >
                          View Dashboard
                        </a>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
