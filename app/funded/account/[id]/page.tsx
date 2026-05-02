import AccountActions from "./AccountActions";
import MetricsActions from "./MetricsActions";

type PageProps = {
  params: Promise<{ id: string }>;
};

function money(value: unknown) {
  const n = Number(value ?? 0);
  return `$${n.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
}

function pct(value: unknown) {
  const n = Number(value ?? 0);
  return `${n.toFixed(2)}%`;
}

export default async function FundedAccountPage({ params }: PageProps) {
  const { id } = await params;

  const apiBase =
    process.env.FUNDED_BACKEND_URL ??
    process.env.NEXT_PUBLIC_FUNDED_API_URL ??
    "https://api.velmenora.com";

  const res = await fetch(
    `${apiBase}/api/funded/account/${id}`,
    { cache: "no-store" }
  );

  const data = await res.json();
  const account = data?.challengeAccount;
  const challenge = account?.challenge;
  const payment = account?.payments?.[0];
  const latestPayout = account?.payoutRequests?.[0];

  if (!data?.ok || !account) {
    return (
      <main className="min-h-screen bg-black text-white px-6 py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-3">Account not found</h1>
          <a href="/funded" className="text-green-400">
            Back to Challenges
          </a>
        </div>
      </main>
    );
  }

  const initialBalance = Number(account.initialBalance ?? 0);
  const currentEquity = Number(account.currentEquity ?? 0);

  const profitPct =
    initialBalance > 0
      ? ((currentEquity - initialBalance) / initialBalance) * 100
      : 0;

  const targetPct = Number(challenge?.profitTargetPct ?? 10);
  const dailyLimit = Number(challenge?.maxDailyLossPct ?? 5);
  const drawdownLimit = Number(challenge?.maxOverallDrawdownPct ?? 10);
  const minTradingDays = Number(challenge?.minTradingDays ?? 3);

  const profitProgress = Math.min(Math.max((profitPct / targetPct) * 100, 0), 100);

  const dailyLossProgress = Math.min(
    Math.max((Number(account.dailyLossPct ?? 0) / dailyLimit) * 100, 0),
    100
  );

  const drawdownProgress = Math.min(
    Math.max((Number(account.overallDrawdownPct ?? 0) / drawdownLimit) * 100, 0),
    100
  );

  const profitOk = profitPct >= targetPct;
  const daysOk = Number(account.tradingDaysCount ?? 0) >= minTradingDays;
  const riskOk =
    !account.dailyLossBreached && !account.overallDrawdownBreached;

  const isReady = profitOk && daysOk && riskOk;

  const statusLabel =
    account.paymentStatus === "pending"
      ? "Complete Payment Confirmation"
      : account.status === "active"
        ? isReady
          ? "Ready for Review"
          : "Continue Challenge"
        : account.status === "under_review"
          ? "Under Review"
          : account.status === "passed"
            ? "Challenge Passed"
            : account.status === "failed"
              ? "Challenge Failed"
              : account.status === "payout_requested"
                ? "Payout Requested"
                : account.status === "payout_under_review"
                  ? "Payout Under Review"
                  : account.status === "payout_approved"
                    ? "Payout Approved"
                    : account.status === "payout_paid"
                      ? "Payout Paid"
                      : "Continue";

  return (
    <main className="min-h-screen bg-black text-white px-6 py-12">
      <div className="max-w-6xl mx-auto">
        <section className="mb-10">
          <p className="text-green-400 font-semibold mb-3">
            Velmenora Funded Dashboard
          </p>

          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {challenge?.name ?? "Challenge Account"}
          </h1>

          <p className="text-gray-400 max-w-3xl">
            Track your challenge status, payment state, trading metrics, rule
            progress, and reward eligibility.
          </p>
        </section>

        <div className="bg-green-900/20 border border-green-500 rounded-xl p-5 mb-8">
          <p className="text-green-400 font-semibold tracking-wide">
            ⚡ Simple Rules • 💰 Fixed Rewards • 🚀 Fast Review
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="border border-gray-800 rounded-xl p-5 bg-gray-950">
            <p className="text-gray-500 text-sm mb-1">Account ID</p>
            <p className="text-sm break-all">{account.id}</p>
          </div>

          <div
            className={`rounded-xl p-5 border ${account.status === "failed"
                ? "border-red-500/40 bg-red-950/10"
                : account.status === "passed" || account.status === "payout_paid"
                  ? "border-green-500/40 bg-green-950/10"
                  : account.status === "under_review" ||
                    account.status === "payout_requested" ||
                    account.status === "payout_under_review" ||
                    account.status === "payout_approved"
                    ? "border-blue-500/40 bg-blue-950/10"
                    : "border-yellow-500/40 bg-yellow-950/10"
              }`}
          >
            <p className="text-gray-500 text-sm mb-1">Status</p>
            <p
              className={`font-semibold ${account.status === "failed"
                  ? "text-red-400"
                  : account.status === "passed" || account.status === "payout_paid"
                    ? "text-green-400"
                    : account.status === "under_review" ||
                      account.status === "payout_requested" ||
                      account.status === "payout_under_review" ||
                      account.status === "payout_approved"
                      ? "text-blue-400"
                      : "text-yellow-400"
                }`}
            >
              {account.status}
            </p>
          </div>

          <div className="border border-gray-800 rounded-xl p-5 bg-gray-950">
            <p className="text-gray-500 text-sm mb-1">Payment</p>
            <p className="text-white font-semibold">
              {payment?.status ?? account.paymentStatus}
            </p>
          </div>

          <div className="border border-green-500/40 rounded-xl p-5 bg-green-950/10">
            <p className="text-gray-500 text-sm mb-1">Reward</p>
            <p className="text-green-400 font-semibold">
              {money(challenge?.rewardAmount)}
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 border border-gray-800 rounded-2xl p-6 bg-gray-950">
            <h2 className="text-xl font-semibold mb-5">Challenge Progress</h2>

            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div className="bg-black border border-gray-800 rounded-xl p-4">
                <p className="text-gray-500 text-sm mb-1">Balance</p>
                <p className="text-2xl font-bold">
                  {money(account.currentBalance)}
                </p>
              </div>

              <div className="bg-black border border-gray-800 rounded-xl p-4">
                <p className="text-gray-500 text-sm mb-1">Equity</p>
                <p className="text-2xl font-bold">
                  {money(account.currentEquity)}
                </p>
              </div>

              <div className="bg-black border border-gray-800 rounded-xl p-4">
                <p className="text-gray-500 text-sm mb-1">Profit</p>
                <p
                  className={`text-2xl font-bold ${profitPct >= 0 ? "text-green-400" : "text-red-400"
                    }`}
                >
                  {pct(profitPct)}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-400">Profit Target</span>
                  <span>
                    {pct(profitPct)} / {pct(targetPct)}
                  </span>
                </div>
                <div className="h-3 bg-gray-900 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500"
                    style={{ width: `${profitProgress}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-400">Daily Loss Used</span>
                  <span>
                    {pct(account.dailyLossPct)} / {pct(dailyLimit)}
                  </span>
                </div>
                <div className="h-3 bg-gray-900 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-yellow-500"
                    style={{ width: `${dailyLossProgress}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-400">Max Drawdown Used</span>
                  <span>
                    {pct(account.overallDrawdownPct)} / {pct(drawdownLimit)}
                  </span>
                </div>
                <div className="h-3 bg-gray-900 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-red-500"
                    style={{ width: `${drawdownProgress}%` }}
                  />
                </div>
              </div>
            </div>

            <MetricsActions
              accountId={account.id}
              initialBalance={initialBalance}
            />
          </div>

          <div className="space-y-6">
            <div
              className={`rounded-2xl p-5 border ${isReady
                  ? "border-green-500 bg-green-900/20"
                  : "border-yellow-500/40 bg-yellow-900/10"
                }`}
            >
              <h2 className="text-lg font-semibold mb-3">
                {isReady ? "🟢 Ready for Review" : "⏳ Not Ready Yet"}
              </h2>

              <div className="space-y-2 text-sm text-gray-300">
                <p>
                  <span className={profitOk ? "text-green-400" : "text-red-400"}>
                    {profitOk ? "✔" : "❌"}
                  </span>{" "}
                  Profit Target:{" "}
                  <span className="text-white">
                    {pct(profitPct)} / {pct(targetPct)}
                  </span>
                </p>

                <p>
                  <span className={daysOk ? "text-green-400" : "text-red-400"}>
                    {daysOk ? "✔" : "❌"}
                  </span>{" "}
                  Trading Days:{" "}
                  <span className="text-white">
                    {account.tradingDaysCount} / {minTradingDays}
                  </span>
                </p>

                <p>
                  <span className={riskOk ? "text-green-400" : "text-red-400"}>
                    {riskOk ? "✔" : "❌"}
                  </span>{" "}
                  Risk Rules:{" "}
                  <span className="text-white">
                    {riskOk ? "Within limits" : "Breached"}
                  </span>
                </p>
              </div>

              <AccountActions
                accountId={account.id}
                accountStatus={account.status}
                isReady={isReady}
                latestPayoutStatus={latestPayout?.status}
              />
            </div>

            <div className="border border-gray-800 rounded-2xl p-6 bg-black">
              <h2 className="text-xl font-semibold mb-4">Next Step</h2>

              <div className="border border-green-500 bg-green-900/20 rounded-xl p-4 mb-5">
                <p className="text-green-400 font-semibold mb-1">
                  {statusLabel}
                </p>

                <p className="text-sm text-gray-300">
                  Current account state: {account.status}. Payment state:{" "}
                  {account.paymentStatus}.
                </p>

                {latestPayout && (
                  <p className="text-sm text-gray-300 mt-2">
                    Latest payout:{" "}
                    <span className="text-white">{latestPayout.status}</span>
                  </p>
                )}
              </div>

              <a
                href="/funded"
                className="block text-center border border-gray-700 hover:border-green-500 transition px-5 py-3 rounded-xl font-semibold"
              >
                Back to Challenges
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}