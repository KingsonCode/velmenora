"use client";

import { useEffect, useState } from "react";

function money(value: unknown) {
  const n = Number(value ?? 0);
  return `$${n.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
}

function prettyStatus(value: unknown) {
  return String(value ?? "unknown").replaceAll("_", " ");
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
          throw new Error(accountData?.message || accountData?.error || "Failed to load challenges");
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
      <main className="min-h-screen bg-black px-6 py-16 text-white">
        <div className="mx-auto max-w-5xl rounded-3xl border border-white/10 bg-white/[0.03] p-8">
          Loading member area...
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black px-6 py-12 text-white">
      <div className="mx-auto max-w-7xl">
        <section className="rounded-[2rem] border border-green-500/20 bg-green-950/10 p-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.25em] text-green-400">
                Member Area
              </p>

              <h1 className="mt-3 text-4xl font-black md:text-6xl">
                Welcome{user?.fullName ? `, ${user.fullName}` : ""}
              </h1>

              <p className="mt-3 text-gray-400">
                Track your funded challenges, broker verification, metrics, reviews, and payouts.
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
          <div className="mt-6 rounded-2xl border border-red-900 bg-red-950/30 p-4 text-sm text-red-300">
            {error}
          </div>
        )}

        <section className="mt-8">
          <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-3xl font-black">My Challenges</h2>
              <p className="mt-1 text-sm text-gray-500">
                Your challenge accounts are linked to your member account.
              </p>
            </div>

            <a
              href="/funded"
              className="rounded-2xl bg-green-500 px-5 py-3 text-center font-black text-black transition hover:bg-green-400"
            >
              Start New Challenge
            </a>
          </div>

          {accounts.length === 0 ? (
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-8 text-center">
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
            <div className="grid gap-5 lg:grid-cols-2">
              {accounts.map((account) => {
                const broker = account.brokerAccounts?.[0];
                const payout = account.payoutRequests?.[0];

                return (
                  <a
                    key={account.id}
                    href={`/funded/account/${account.id}`}
                    className="block rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 transition hover:border-green-500/40 hover:bg-white/[0.05]"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <h3 className="text-2xl font-black">
                          {account.challenge?.name ?? "Challenge Account"}
                        </h3>
                        <p className="mt-1 text-xs text-gray-500">{account.id}</p>
                      </div>

                      <span
                        className={`w-fit rounded-full border px-3 py-1 text-xs font-black capitalize ${statusTone(
                          account.status,
                        )}`}
                      >
                        {prettyStatus(account.status)}
                      </span>
                    </div>

                    <div className="mt-5 grid grid-cols-2 gap-3 text-sm md:grid-cols-4">
                      <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                        <p className="text-gray-500">Balance</p>
                        <p className="mt-1 font-black">{money(account.currentBalance)}</p>
                      </div>

                      <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                        <p className="text-gray-500">Equity</p>
                        <p className="mt-1 font-black">{money(account.currentEquity)}</p>
                      </div>

                      <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                        <p className="text-gray-500">Broker</p>
                        <p className="mt-1 font-black capitalize">
                          {broker?.verificationStatus
                            ? prettyStatus(broker.verificationStatus)
                            : "Not connected"}
                        </p>
                      </div>

                      <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                        <p className="text-gray-500">Payout</p>
                        <p className="mt-1 font-black capitalize">
                          {payout?.status ? prettyStatus(payout.status) : "—"}
                        </p>
                      </div>
                    </div>
                  </a>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
