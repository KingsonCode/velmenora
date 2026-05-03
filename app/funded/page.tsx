const plans = [
  {
    badge: "Starter",
    name: "Instant 10K",
    slug: "instant-10k",
    fee: "$25",
    balance: "$10,000",
    reward: "$100",
    target: "10%",
    dailyLoss: "5%",
    drawdown: "10%",
    tradingDays: "3 days",
    featured: false,
    description:
      "Best for traders who want to prove consistency with a lower entry fee.",
  },
  {
    badge: "Most Popular",
    name: "Instant 25K",
    slug: "instant-25k",
    fee: "$59",
    balance: "$25,000",
    reward: "$115",
    target: "10%",
    dailyLoss: "5%",
    drawdown: "10%",
    tradingDays: "3 days",
    featured: true,
    description:
      "Higher simulated capital, stronger upside, and the same clear rules.",
  },
];

const steps = [
  {
    title: "Choose your challenge",
    text: "Pick a simulated account size and create your challenge account.",
  },
  {
    title: "Pay securely",
    text: "Complete checkout with crypto through NOWPayments. Your account activates automatically after confirmation.",
  },
  {
    title: "Trade the rules",
    text: "Reach the profit target while respecting daily loss and overall drawdown limits.",
  },
  {
    title: "Pass review & get paid",
    text: "Once eligible, submit for review and receive your fixed reward after approval.",
  },
];

const faqs = [
  {
    q: "What happens after payment?",
    a: "After payment confirmation, your challenge account is activated automatically and becomes ready inside your dashboard.",
  },
  {
    q: "What if my crypto payment is partially paid?",
    a: "Partial payments are placed under manual review. The challenge account is not activated until the payment is properly confirmed.",
  },
  {
    q: "Is this a real-money trading account?",
    a: "No. This is a simulated funded challenge. You trade a virtual balance and qualify for fixed rewards by following the rules.",
  },
  {
    q: "When do I receive the reward?",
    a: "After hitting the target, respecting risk limits, and passing review, the payout request can be approved and processed.",
  },
];

function StatCard({
  label,
  value,
  tone = "neutral",
}: {
  label: string;
  value: string;
  tone?: "neutral" | "green" | "yellow";
}) {
  const toneClass =
    tone === "green"
      ? "text-green-400"
      : tone === "yellow"
        ? "text-yellow-400"
        : "text-white";

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <p className="text-sm text-gray-500">{label}</p>
      <p className={`mt-2 text-2xl font-bold ${toneClass}`}>{value}</p>
    </div>
  );
}

export default function FundedPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <section className="relative overflow-hidden px-6 py-20">
        <div className="absolute left-1/2 top-0 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-green-500/10 blur-3xl" />
        <div className="relative mx-auto max-w-6xl">
          <div className="max-w-4xl">
            <p className="mb-4 inline-flex rounded-full border border-green-500/30 bg-green-500/10 px-4 py-2 text-sm font-semibold text-green-400">
              Velmenora Funded Challenge
            </p>

            <h1 className="text-5xl font-black leading-tight tracking-tight md:text-7xl">
              Prove your trading skill.
              <span className="block text-green-400">Get rewarded.</span>
            </h1>

            <p className="mt-6 max-w-3xl text-lg leading-8 text-gray-300 md:text-xl">
              Trade a simulated account, follow transparent risk rules, and
              qualify for a fixed reward after review. Simple rules. Fast
              activation. Crypto checkout ready.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="/funded/apply?plan=instant-10k"
                className="rounded-2xl bg-green-500 px-7 py-4 font-bold text-black transition hover:bg-green-400"
              >
                Start 10K Challenge
              </a>

              <a
                href="#plans"
                className="rounded-2xl border border-white/15 px-7 py-4 font-bold text-white transition hover:border-green-500 hover:text-green-400"
              >
                View Plans
              </a>
            </div>

            <p className="mt-5 text-sm text-gray-500">
              Payment confirmation activates your challenge account automatically.
            </p>
          </div>

          <div className="mt-12 grid gap-4 md:grid-cols-4">
            <StatCard label="Starting Fee" value="$25" tone="green" />
            <StatCard label="Virtual Balance" value="$10K / $25K" />
            <StatCard label="Profit Target" value="10%" tone="yellow" />
            <StatCard label="Fixed Reward" value="$100+" tone="green" />
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-white/[0.02] px-6 py-8">
        <div className="mx-auto grid max-w-6xl gap-4 text-sm text-gray-300 md:grid-cols-4">
          <div className="rounded-xl border border-white/10 bg-black/40 p-4">
            ✅ Automatic account activation
          </div>
          <div className="rounded-xl border border-white/10 bg-black/40 p-4">
            ✅ NOWPayments crypto checkout
          </div>
          <div className="rounded-xl border border-white/10 bg-black/40 p-4">
            ✅ Fixed reward model
          </div>
          <div className="rounded-xl border border-white/10 bg-black/40 p-4">
            ✅ Transparent risk rules
          </div>
        </div>
      </section>

      <section id="plans" className="px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-green-400">
              Challenge Plans
            </p>
            <h2 className="mt-3 text-4xl font-black md:text-5xl">
              Choose your account size
            </h2>
            <p className="mt-4 text-gray-400">
              Start with the 10K plan for a clean MVP path, or step into 25K for
              a higher simulated account and bigger fixed reward.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {plans.map((plan) => (
              <article
                key={plan.slug}
                className={`relative rounded-3xl border p-7 transition ${
                  plan.featured
                    ? "border-green-500 bg-green-950/20 shadow-[0_0_60px_rgba(34,197,94,0.14)]"
                    : "border-white/10 bg-white/[0.03] hover:border-green-500/60"
                }`}
              >
                {plan.featured && (
                  <div className="absolute -top-4 left-7 rounded-full bg-green-500 px-4 py-1 text-xs font-black text-black">
                    Most Popular 🔥
                  </div>
                )}

                <p className="text-sm font-bold uppercase tracking-[0.25em] text-green-400">
                  {plan.badge}
                </p>

                <div className="mt-4 flex items-end justify-between gap-4">
                  <div>
                    <h3 className="text-4xl font-black">{plan.name}</h3>
                    <p className="mt-2 text-gray-400">{plan.description}</p>
                  </div>

                  <div className="text-right">
                    <p className="text-sm text-gray-500">One-time fee</p>
                    <p className="text-3xl font-black text-white">{plan.fee}</p>
                  </div>
                </div>

                <div className="mt-7 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
                    <p className="text-xs text-gray-500">Virtual Balance</p>
                    <p className="mt-1 font-bold">{plan.balance}</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
                    <p className="text-xs text-gray-500">Fixed Reward</p>
                    <p className="mt-1 font-bold text-green-400">{plan.reward}</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
                    <p className="text-xs text-gray-500">Profit Target</p>
                    <p className="mt-1 font-bold">{plan.target}</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
                    <p className="text-xs text-gray-500">Min Trading Days</p>
                    <p className="mt-1 font-bold">{plan.tradingDays}</p>
                  </div>
                </div>

                <div className="mt-6 rounded-2xl border border-white/10 bg-black/40 p-4 text-sm text-gray-300">
                  <p>Risk limits:</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <span className="rounded-full bg-yellow-500/10 px-3 py-1 text-yellow-300">
                      Daily loss {plan.dailyLoss}
                    </span>
                    <span className="rounded-full bg-red-500/10 px-3 py-1 text-red-300">
                      Max drawdown {plan.drawdown}
                    </span>
                  </div>
                </div>

                <a
                  href={`/funded/apply?plan=${plan.slug}`}
                  className={`mt-7 block rounded-2xl px-5 py-4 text-center font-black transition ${
                    plan.featured
                      ? "bg-green-500 text-black hover:bg-green-400"
                      : "border border-green-500 text-green-400 hover:bg-green-500 hover:text-black"
                  }`}
                >
                  Start {plan.name} →
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white/[0.02] px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-green-400">
              How It Works
            </p>
            <h2 className="mt-3 text-4xl font-black md:text-5xl">
              From payment to active account
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-4">
            {steps.map((step, index) => (
              <div
                key={step.title}
                className="rounded-3xl border border-white/10 bg-black p-6"
              >
                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-2xl bg-green-500 font-black text-black">
                  {index + 1}
                </div>
                <h3 className="text-lg font-bold">{step.title}</h3>
                <p className="mt-3 text-sm leading-6 text-gray-400">
                  {step.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-green-400">
              Rules
            </p>
            <h2 className="mt-3 text-4xl font-black md:text-5xl">
              Clear pass criteria
            </h2>
            <p className="mt-4 text-gray-400">
              The challenge is intentionally simple: hit the target, respect
              the risk rules, and complete the minimum trading days.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-3xl border border-green-500/30 bg-green-950/10 p-6">
              <p className="text-green-400 font-bold">Profit Target</p>
              <p className="mt-2 text-3xl font-black">10%</p>
              <p className="mt-2 text-sm text-gray-400">
                Reach the required profit target on your simulated account.
              </p>
            </div>

            <div className="rounded-3xl border border-yellow-500/30 bg-yellow-950/10 p-6">
              <p className="text-yellow-400 font-bold">Daily Loss Limit</p>
              <p className="mt-2 text-3xl font-black">5%</p>
              <p className="mt-2 text-sm text-gray-400">
                Stay within the daily risk threshold to keep the account valid.
              </p>
            </div>

            <div className="rounded-3xl border border-red-500/30 bg-red-950/10 p-6">
              <p className="text-red-400 font-bold">Overall Drawdown</p>
              <p className="mt-2 text-3xl font-black">10%</p>
              <p className="mt-2 text-sm text-gray-400">
                Avoid breaching maximum overall drawdown from account equity.
              </p>
            </div>

            <div className="rounded-3xl border border-blue-500/30 bg-blue-950/10 p-6">
              <p className="text-blue-400 font-bold">Minimum Trading Days</p>
              <p className="mt-2 text-3xl font-black">3</p>
              <p className="mt-2 text-sm text-gray-400">
                Show basic consistency before submitting the account for review.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white/[0.02] px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <div className="mb-10 text-center">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-green-400">
              FAQ
            </p>
            <h2 className="mt-3 text-4xl font-black">Questions traders ask</h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq) => (
              <div
                key={faq.q}
                className="rounded-3xl border border-white/10 bg-black p-6"
              >
                <h3 className="font-bold">{faq.q}</h3>
                <p className="mt-3 text-sm leading-6 text-gray-400">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="mx-auto max-w-5xl rounded-[2rem] border border-green-500/30 bg-green-950/20 p-8 text-center shadow-[0_0_70px_rgba(34,197,94,0.12)] md:p-12">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-green-400">
            Ready?
          </p>
          <h2 className="mt-3 text-4xl font-black md:text-5xl">
            Start with the Instant 10K Challenge
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-gray-300">
            The cleanest MVP path: pay once, activate automatically, trade the
            rules, and qualify for a fixed reward.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <a
              href="/funded/apply?plan=instant-10k"
              className="rounded-2xl bg-green-500 px-7 py-4 font-black text-black transition hover:bg-green-400"
            >
              Start 10K Challenge
            </a>

            <a
              href="/funded/apply?plan=instant-25k"
              className="rounded-2xl border border-white/15 px-7 py-4 font-black text-white transition hover:border-green-500 hover:text-green-400"
            >
              Start 25K Challenge
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
