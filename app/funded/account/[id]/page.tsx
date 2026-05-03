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

function prettyStatus(value: unknown) {
  return String(value ?? "unknown").replaceAll("_", " ");
}

function statusTone(status: string) {
  if (status === "failed") {
    return "border-red-500/30 bg-red-950/20 text-red-300";
  }

  if (status === "passed" || status === "payout_paid" || status === "active") {
    return "border-green-500/30 bg-green-950/20 text-green-300";
  }

  if (
    status === "under_review" ||
    status === "payout_requested" ||
    status === "payout_under_review" ||
    status === "payout_approved"
  ) {
    return "border-blue-500/30 bg-blue-950/20 text-blue-300";
  }

  return "border-yellow-500/30 bg-yellow-950/20 text-yellow-300";
}

function ProgressBar({
  value,
  tone,
}: {
  value: number;
  tone: "green" | "yellow" | "red";
}) {
  const bar =
    tone === "green"
      ? "bg-green-500"
      : tone === "yellow"
        ? "bg-yellow-500"
        : "bg-red-500";

  return (
    <div className="h-3 overflow-hidden rounded-full bg-white/10">
      <div className={`h-full rounded-full ${bar}`} style={{ width: `${value}%` }} />
    </div>
  );
}

export default async function FundedAccountPage({ params }: PageProps) {
  const { id } = await params;

  const apiBase =
    process.env.FUNDED_BACKEND_URL ??
    process.env.NEXT_PUBLIC_FUNDED_API_URL ??
    "https://api.velmenora.com";

  const res = await fetch(`${apiBase}/api/funded/account/${id}`, {
    cache: "no-store",
  });

  const data = await res.json();
  const account = data?.challengeAccount;
  const challenge = account?.challenge;
  const payment = account?.payments?.[0];
  const latestPayout = account?.payoutRequests?.[0];

  if (!data?.ok || !account) {
    return (
      <main className="min-h-screen bg-black px-6 py-16 text-white">
        <div className="mx-auto max-w-3xl rounded-3xl border border-white/10 bg-white/[0.03] p-8">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-red-400">
            Account Error
          </p>
          <h1 className="mt-3 text-4xl font-black">Account not found</h1>
          <p className="mt-3 text-gray-400">
            We could not load this funded challenge account.
          </p>
          <a
            href="/funded"
            className="mt-6 inline-flex rounded-2xl bg-green-500 px-6 py-3 font-bold text-black hover:bg-green-400"
          >
            Back to Challenges
          </a>
        </div>
      </main>
    );
  }

  const initialBalance = Number(account.initialBalance ?? 0);
  const currentBalance = Number(account.currentBalance ?? 0);
  const currentEquity = Number(account.currentEquity ?? 0);
  const rewardAmount = Number(challenge?.rewardAmount ?? 0);

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
    100,
  );

  const drawdownProgress = Math.min(
    Math.max((Number(account.overallDrawdownPct ?? 0) / drawdownLimit) * 100, 0),
    100,
  );

  const profitOk = profitPct >= targetPct;
  const daysOk = Number(account.tradingDaysCount ?? 0) >= minTradingDays;
  const riskOk = !account.dailyLossBreached && !account.overallDrawdownBreached;
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
    <main className="min-h-screen bg-black px-6 py-12 text-white">
      <div className="mx-auto max-w-7xl">
        <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-white/[0.06] via-white/[0.02] to-green-950/20 p-8 shadow-[0_0_80px_rgba(34,197,94,0.08)] md:p-10">
          <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-green-500/10 blur-3xl" />

          <div className="relative flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.25em] text-green-400">
                Velmenora Funded Dashboard
              </p>

              <h1 className="mt-4 text-4xl font-black tracking-tight md:text-6xl">
                {challenge?.name ?? "Challenge Account"}
              </h1>

              <p className="mt-4 max-w-3xl text-gray-400">
                Track challenge status, risk limits, payment confirmation, rule
                progress, and fixed reward eligibility.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className={`rounded-2xl border px-5 py-4 ${statusTone(account.status)}`}>
                <p className="text-xs uppercase tracking-[0.2em] opacity-70">Status</p>
                <p className="mt-1 text-xl font-black capitalize">
                  {prettyStatus(account.status)}
                </p>
              </div>

              <div
                className={`rounded-2xl border px-5 py-4 ${payment?.status === "paid"
                    ? "border-green-500/30 bg-green-950/20 text-green-300"
                    : "border-yellow-500/30 bg-yellow-950/20 text-yellow-300"
                  }`}
              >
                <p className="text-xs uppercase tracking-[0.2em] opacity-70">Payment</p>
                <p className="mt-1 text-xl font-black capitalize">
                  {prettyStatus(payment?.status ?? account.paymentStatus)}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
            <p className="text-sm text-gray-500">Balance</p>
            <p className="mt-2 text-3xl font-black">{money(currentBalance)}</p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
            <p className="text-sm text-gray-500">Equity</p>
            <p className="mt-2 text-3xl font-black">{money(currentEquity)}</p>
          </div>

          <div className="rounded-3xl border border-green-500/30 bg-green-950/10 p-6">
            <p className="text-sm text-gray-500">Profit</p>
            <p className={`mt-2 text-3xl font-black ${profitPct >= 0 ? "text-green-400" : "text-red-400"}`}>
              {pct(profitPct)}
            </p>
          </div>

          <div className="rounded-3xl border border-green-500/30 bg-green-950/10 p-6">
            <p className="text-sm text-gray-500">Fixed Reward</p>
            <p className="mt-2 text-3xl font-black text-green-400">
              {money(rewardAmount)}
            </p>
          </div>
        </section>

        <section className="mt-6 grid gap-6 xl:grid-cols-[1.45fr_0.85fr]">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 md:p-8">
            <div className="mb-7 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-2xl font-black">Challenge Progress</h2>
                <p className="mt-1 text-sm text-gray-500">
                  Rules update as metrics are submitted to the account.
                </p>
              </div>

              <span
                className={`w-fit rounded-full border px-4 py-2 text-sm font-bold ${isReady
                    ? "border-green-500/30 bg-green-950/20 text-green-300"
                    : "border-yellow-500/30 bg-yellow-950/20 text-yellow-300"
                  }`}
              >
                {isReady ? "Ready for review" : "Not ready yet"}
              </span>
            </div>

            <div className="space-y-7">
              <div>
                <div className="mb-2 flex justify-between text-sm">
                  <span className="text-gray-400">Profit Target</span>
                  <span className="font-semibold">
                    {pct(profitPct)} / {pct(targetPct)}
                  </span>
                </div>
                <ProgressBar value={profitProgress} tone="green" />
              </div>

              <div>
                <div className="mb-2 flex justify-between text-sm">
                  <span className="text-gray-400">Daily Loss Used</span>
                  <span className="font-semibold">
                    {pct(account.dailyLossPct)} / {pct(dailyLimit)}
                  </span>
                </div>
                <ProgressBar value={dailyLossProgress} tone="yellow" />
              </div>

              <div>
                <div className="mb-2 flex justify-between text-sm">
                  <span className="text-gray-400">Max Drawdown Used</span>
                  <span className="font-semibold">
                    {pct(account.overallDrawdownPct)} / {pct(drawdownLimit)}
                  </span>
                </div>
                <ProgressBar value={drawdownProgress} tone="red" />
              </div>
            </div>

            <MetricsActions accountId={account.id} initialBalance={initialBalance} />

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-black/40 p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-gray-500">
                  Profit Rule
                </p>
                <p className={`mt-3 font-bold ${profitOk ? "text-green-400" : "text-red-400"}`}>
                  {profitOk ? "Passed" : "Pending"}
                </p>
                <p className="mt-1 text-sm text-gray-400">
                  {pct(profitPct)} / {pct(targetPct)}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/40 p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-gray-500">
                  Trading Days
                </p>
                <p className={`mt-3 font-bold ${daysOk ? "text-green-400" : "text-red-400"}`}>
                  {daysOk ? "Complete" : "Pending"}
                </p>
                <p className="mt-1 text-sm text-gray-400">
                  {account.tradingDaysCount} / {minTradingDays}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/40 p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-gray-500">
                  Risk Rules
                </p>
                <p className={`mt-3 font-bold ${riskOk ? "text-green-400" : "text-red-400"}`}>
                  {riskOk ? "Within limits" : "Breached"}
                </p>
                <p className="mt-1 text-sm text-gray-400">
                  Daily and overall drawdown checks
                </p>
              </div>
            </div>
          </div>

          <aside className="space-y-6">
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6">
              <h2 className="text-xl font-black">Next Step</h2>

              <div className="mt-5 rounded-2xl border border-green-500/30 bg-green-950/20 p-5">
                <p className="font-bold text-green-400">{statusLabel}</p>
                <p className="mt-2 text-sm leading-6 text-gray-300">
                  Current account state is{" "}
                  <span className="font-semibold text-white">
                    {prettyStatus(account.status)}
                  </span>
                  . Payment state is{" "}
                  <span className="font-semibold text-white">
                    {prettyStatus(account.paymentStatus)}
                  </span>
                  .
                </p>
              </div>

              <AccountActions
                accountId={account.id}
                accountStatus={account.status}
                isReady={isReady}
                latestPayoutStatus={latestPayout?.status}
              />

              <a
                href="/funded"
                className="mt-4 block rounded-2xl border border-white/10 px-5 py-4 text-center font-bold text-white transition hover:border-green-500 hover:text-green-400"
              >
                Back to Challenges
              </a>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6">
              <h2 className="text-xl font-black">Account Details</h2>

              <div className="mt-5 space-y-4 text-sm">
                <div className="flex justify-between gap-4 border-b border-white/10 pb-3">
                  <span className="text-gray-500">Account ID</span>
                  <span className="max-w-[190px] truncate font-mono text-gray-200">
                    {account.id}
                  </span>
                </div>

                <div className="flex justify-between gap-4 border-b border-white/10 pb-3">
                  <span className="text-gray-500">Trader</span>
                  <span className="text-right text-gray-200">
                    {account.user?.fullName ?? "Trader"}
                  </span>
                </div>

                <div className="flex justify-between gap-4 border-b border-white/10 pb-3">
                  <span className="text-gray-500">Plan</span>
                  <span className="text-gray-200">
                    {challenge?.name ?? "Challenge"}
                  </span>
                </div>

                <div className="flex justify-between gap-4 border-b border-white/10 pb-3">
                  <span className="text-gray-500">Started</span>
                  <span className="text-gray-200">
                    {account.startedAt
                      ? new Date(account.startedAt).toLocaleDateString()
                      : "Not started"}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-gray-500">Payment Provider</span>
                  <span className="text-gray-200 capitalize">
                    {payment?.provider ?? "pending"}
                  </span>
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] border border-green-500/20 bg-green-950/10 p-6">
              <h2 className="text-xl font-black">Reward Rules</h2>
              <ul className="mt-4 space-y-3 text-sm text-gray-300">
                <li>✅ Hit {pct(targetPct)} profit target</li>
                <li>✅ Complete at least {minTradingDays} trading days</li>
                <li>✅ Stay within daily loss and drawdown limits</li>
                <li>✅ Submit account for review when eligible</li>
              </ul>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
