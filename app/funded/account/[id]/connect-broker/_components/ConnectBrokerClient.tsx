"use client";

import { useMemo, useState } from "react";

type Props = {
  accountId: string;
};

type BrokerOption = {
  slug: string;
  name: string;
  active: boolean;
  href: string;
  platforms: Array<"MT4" | "MT5">;
  servers: Array<{
    name: string;
    platform: "MT4" | "MT5";
    accountType: "DEMO" | "REAL";
  }>;
};

const brokers: BrokerOption[] = [
  {
    slug: "exness",
    name: "Exness",
    active: true,
    href: "/go/exness",
    platforms: ["MT4", "MT5"],
    servers: [
      { name: "Exness-MT5Trial", platform: "MT5", accountType: "DEMO" },
      { name: "Exness-MT4Trial", platform: "MT4", accountType: "DEMO" },
      { name: "Exness-MT5Real", platform: "MT5", accountType: "REAL" },
      { name: "Exness-MT4Real", platform: "MT4", accountType: "REAL" },
    ],
  },
  {
    slug: "xm",
    name: "XM",
    active: true,
    href: "/go/xm",
    platforms: ["MT4", "MT5"],
    servers: [
      { name: "XMGlobal-Demo", platform: "MT5", accountType: "DEMO" },
      { name: "XMGlobal-MT4 Demo", platform: "MT4", accountType: "DEMO" },
      { name: "XMGlobal-MT5", platform: "MT5", accountType: "REAL" },
      { name: "XMGlobal-MT4", platform: "MT4", accountType: "REAL" },
    ],
  },
  { slug: "deriv", name: "Deriv", active: false, href: "/go/deriv", platforms: [], servers: [] },
  { slug: "tickmill", name: "Tickmill", active: false, href: "/go/tickmill", platforms: [], servers: [] },
  { slug: "hantec", name: "Hantec", active: false, href: "/go/hantec", platforms: [], servers: [] },
  { slug: "octa", name: "Octa", active: false, href: "/go/octa", platforms: [], servers: [] },
  { slug: "axi", name: "Axi", active: false, href: "/go/axi", platforms: [], servers: [] },
  { slug: "avatrade", name: "AvaTrade", active: false, href: "/go/avatrade", platforms: [], servers: [] },
  { slug: "roboforex", name: "RoboForex", active: false, href: "/go/roboforex", platforms: [], servers: [] },
  { slug: "pepperstone", name: "Pepperstone", active: false, href: "/go/pepperstone", platforms: [], servers: [] },
];

const API_BASE =
  process.env.NEXT_PUBLIC_FUNDED_API_URL || "https://api.velmenora.com";

export default function ConnectBrokerClient({ accountId }: Props) {
  const [brokerName, setBrokerName] = useState("exness");
  const [accountType, setAccountType] = useState<"DEMO" | "REAL">("DEMO");
  const [platformType, setPlatformType] = useState<"MT4" | "MT5">("MT5");
  const [accountLogin, setAccountLogin] = useState("");
  const [serverName, setServerName] = useState("");
  const [investorPassword, setInvestorPassword] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function getSelectedBroker() {
    const broker =
      brokers.find((b) => b.slug === brokerName) ??
      brokers.find((b) => b.slug === "exness");

    if (!broker) {
      throw new Error("No broker configuration found");
    }

    return broker;
  }

  const selectedBroker = getSelectedBroker();

  const availableServers = useMemo(() => {
    return selectedBroker.servers.filter(
      (s) => s.platform === platformType && s.accountType === accountType,
    );
  }, [selectedBroker, platformType, accountType]);

  function selectBroker(slug: string) {
    const broker = brokers.find((b) => b.slug === slug);
    if (!broker || !broker.active) return;

    setBrokerName(broker.slug);
    setPlatformType("MT5");
    setAccountType("DEMO");
    setServerName("");
    setError("");
    setSuccess("");
  }

  async function submitBroker(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSuccess("");

    const broker = getSelectedBroker();

    if (!broker.active) {
      setError("This broker is not enabled for automatic verification yet.");
      return;
    }

    if (!serverName) {
      setError("Select a valid server name.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/broker-account/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          challengeAccountId: accountId,
          brokerName,
          accountType,
          platformType,
          accountLogin,
          serverName,
          investorPassword,
          note,
        }),
      });

      let data: any = null;

      try {
        data = await res.json();
      } catch {
        throw new Error("Invalid server response");
      }

      if (!res.ok || data?.ok === false) {
        throw new Error(data?.message || data?.error || "Broker submission failed");
      }

      setSuccess("Broker account submitted. Verification is now pending.");
      setInvestorPassword("");
    } catch (err: any) {
      setError(err.message || "Unexpected error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-black px-6 py-12 text-white">
      <div className="mx-auto max-w-7xl">
        <section className="rounded-[2rem] border border-green-500/20 bg-green-950/10 p-8">
          <p className="text-sm font-black uppercase tracking-[0.25em] text-green-400">
            Connect Trading Account
          </p>

          <h1 className="mt-3 text-4xl font-black md:text-6xl">
            Submit investor access
          </h1>

          <p className="mt-4 max-w-3xl text-gray-400">
            Submit MT4/MT5 investor/read-only credentials so Velmenora can verify
            your balance, equity, trading days, drawdown, and profit target progress.
          </p>

          <div className="mt-6 rounded-2xl border border-yellow-500/30 bg-yellow-950/10 p-5 text-sm text-yellow-100">
            <p className="font-bold">Security note</p>
            <p className="mt-2 text-yellow-100/80">
              Submit investor/read-only password only. Never submit your master
              trading password.
            </p>
          </div>
        </section>

        <section className="mt-8">
          <div className="mb-5 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.25em] text-green-400">
                Partner Brokers
              </p>
              <h2 className="mt-2 text-3xl font-black">Recommended brokers</h2>
            </div>
            <p className="max-w-2xl text-sm text-gray-500">
              Exness and XM are enabled for submission now. More partner brokers
              will be enabled after server/account validation rules are added.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {brokers.map((broker) => (
              <div
                key={broker.slug}
                className={`rounded-3xl border p-5 ${
                  broker.slug === brokerName
                    ? "border-green-500 bg-green-950/20"
                    : "border-white/10 bg-white/[0.03]"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-xl font-black">{broker.name}</h3>
                    <p
                      className={`mt-1 text-xs font-bold ${
                        broker.active ? "text-green-400" : "text-yellow-400"
                      }`}
                    >
                      {broker.active ? "Enabled" : "Partner / coming soon"}
                    </p>
                  </div>
                </div>

                <div className="mt-5 grid gap-2">
                  {broker.active ? (
                    <button
                      type="button"
                      onClick={() => selectBroker(broker.slug)}
                      className="rounded-xl bg-green-500 px-4 py-3 text-sm font-black text-black hover:bg-green-400"
                    >
                      Use this broker
                    </button>
                  ) : (
                    <a
                      href={broker.href}
                      className="rounded-xl border border-white/10 px-4 py-3 text-center text-sm font-bold text-gray-300 hover:border-green-500 hover:text-green-400"
                    >
                      Open partner account
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-8 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6">
            <h2 className="text-2xl font-black">Current selection</h2>

            <div className="mt-5 space-y-4 text-sm">
              <div className="flex justify-between border-b border-white/10 pb-3">
                <span className="text-gray-500">Broker</span>
                <span className="font-bold">{selectedBroker.name}</span>
              </div>

              <div className="flex justify-between border-b border-white/10 pb-3">
                <span className="text-gray-500">Challenge Account</span>
                <span className="max-w-[220px] truncate font-mono">{accountId}</span>
              </div>

              <div className="flex justify-between border-b border-white/10 pb-3">
                <span className="text-gray-500">Verification</span>
                <span className="text-yellow-400">Pending after submit</span>
              </div>

              <div className="rounded-2xl border border-green-500/20 bg-green-950/10 p-4 text-gray-300">
                <p className="font-bold text-green-400">Investor password only</p>
                <p className="mt-2 leading-6">
                  This access should not allow trading or withdrawals. It is only
                  used for read-only verification.
                </p>
              </div>
            </div>
          </div>

          <form
            onSubmit={submitBroker}
            className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6"
          >
            <h2 className="text-2xl font-black">Broker account details</h2>
            <p className="mt-2 text-sm text-gray-400">
              Enter the exact account details from your MT4/MT5 broker portal.
            </p>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-300">
                  Broker
                </label>
                <select
                  value={brokerName}
                  onChange={(e) => selectBroker(e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-black px-4 py-4 outline-none focus:border-green-500"
                >
                  {brokers
                    .filter((b) => b.active)
                    .map((broker) => (
                      <option key={broker.slug} value={broker.slug}>
                        {broker.name}
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-300">
                  Account Type
                </label>
                <select
                  value={accountType}
                  onChange={(e) => {
                    setAccountType(e.target.value as "DEMO" | "REAL");
                    setServerName("");
                  }}
                  className="w-full rounded-2xl border border-white/10 bg-black px-4 py-4 outline-none focus:border-green-500"
                >
                  <option value="DEMO">DEMO</option>
                  <option value="REAL">REAL</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-300">
                  Platform
                </label>
                <select
                  value={platformType}
                  onChange={(e) => {
                    setPlatformType(e.target.value as "MT4" | "MT5");
                    setServerName("");
                  }}
                  className="w-full rounded-2xl border border-white/10 bg-black px-4 py-4 outline-none focus:border-green-500"
                >
                  <option value="MT5">MT5</option>
                  <option value="MT4">MT4</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-300">
                  Server Name
                </label>
                <select
                  value={serverName}
                  onChange={(e) => setServerName(e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-black px-4 py-4 outline-none focus:border-green-500"
                  required
                >
                  <option value="">Select server</option>
                  {availableServers.map((server) => (
                    <option key={server.name} value={server.name}>
                      {server.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-300">
                  Login / Account Number
                </label>
                <input
                  type="text"
                  value={accountLogin}
                  onChange={(e) => setAccountLogin(e.target.value)}
                  placeholder="e.g. 12345678"
                  className="w-full rounded-2xl border border-white/10 bg-black px-4 py-4 outline-none focus:border-green-500"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-300">
                  Investor Password
                </label>
                <input
                  type="password"
                  value={investorPassword}
                  onChange={(e) => setInvestorPassword(e.target.value)}
                  placeholder="Read-only investor password"
                  className="w-full rounded-2xl border border-white/10 bg-black px-4 py-4 outline-none focus:border-green-500"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-semibold text-gray-300">
                  Optional Note
                </label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Any extra detail for verification..."
                  rows={4}
                  className="w-full rounded-2xl border border-white/10 bg-black px-4 py-4 outline-none focus:border-green-500"
                />
              </div>
            </div>

            {error && (
              <div className="mt-5 rounded-2xl border border-red-900 bg-red-950/30 p-4 text-sm text-red-300">
                {error}
              </div>
            )}

            {success && (
              <div className="mt-5 rounded-2xl border border-green-500/30 bg-green-950/20 p-4 text-sm text-green-300">
                {success}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-6 w-full rounded-2xl bg-green-500 py-4 font-black text-black transition hover:bg-green-400 disabled:bg-gray-700 disabled:text-gray-400"
            >
              {loading ? "Submitting..." : "Submit Broker Account"}
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
