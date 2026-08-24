import Link from "next/link";
import type { Metadata } from "next";
import AffiliateRefCapture from "@/app/funded/_components/AffiliateRefCapture";

export const metadata: Metadata = {
  title: "Start Velmenora | Funded Challenge & Broker Recommendations",
  description:
    "Start with Velmenora. Choose a simulated funded challenge, follow clear risk rules, or compare trusted forex brokers before opening your trading account.",
  alternates: {
    canonical: "/start",
  },
  openGraph: {
    title: "Start Velmenora",
    description:
      "Choose your path: start a simulated funded challenge or compare trusted forex brokers.",
    url: "https://velmenora.com/start",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Start Velmenora",
    description:
      "Start a Velmenora funded challenge or compare trusted forex brokers.",
  },
};

const plans = [
  {
    name: "10K Challenge",
    slug: "instant-10k",
    fee: "$35",
    reward: "$100",
    badge: "Best Starter",
    description:
      "Good first step for disciplined traders who want a lower-cost entry into the challenge.",
  },
  {
    name: "25K Challenge",
    slug: "instant-25k",
    fee: "$79",
    reward: "$150",
    badge: "Most Popular",
    description:
      "Balanced option for traders who want stronger reward potential without jumping too large.",
    featured: true,
  },
  {
    name: "50K Challenge",
    slug: "instant-50k",
    fee: "$149",
    reward: "$250",
    badge: "Higher Reward",
    description:
      "For experienced traders who can respect strict drawdown, risk, and consistency rules.",
  },
];

const rules = [
  ["Profit target", "10%", "Reach the profit target while keeping all rules intact."],
  ["Max daily loss", "5%", "Avoid breaching the daily drawdown limit."],
  ["Overall drawdown", "10%", "Protect the account from excessive total loss."],
  ["Minimum trading days", "7", "Show consistency across enough trading activity."],
];

const steps = [
  {
    n: "01",
    title: "Choose your plan",
    text: "Pick 10K, 25K, or 50K based on your trading confidence and risk discipline.",
  },
  {
    n: "02",
    title: "Activate your challenge",
    text: "Complete checkout and start your simulated challenge account process.",
  },
  {
    n: "03",
    title: "Connect broker access",
    text: "Submit MT4/MT5 investor access so metrics and rule checks can be reviewed.",
  },
  {
    n: "04",
    title: "Trade under rules",
    text: "Respect profit target, drawdown, daily loss, consistency, and risk rules.",
  },
  {
    n: "05",
    title: "Submit for review",
    text: "Passing is not automatic. Velmenora reviews rule compliance before reward approval.",
  },
];

function JsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Start Velmenora",
    url: "https://velmenora.com/start",
    description:
      "Landing page for Velmenora simulated funded challenge plans and broker recommendations.",
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Velmenora Challenge Plans",
      itemListElement: plans.map((plan) => ({
        "@type": "Offer",
        name: plan.name,
        price: plan.fee.replace("$", ""),
        priceCurrency: "USD",
        url: `https://velmenora.com/funded/apply?plan=${plan.slug}`,
      })),
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export default function StartPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-black text-white">
      <AffiliateRefCapture />
      <JsonLd />

      <section className="relative px-6 py-20 md:py-28">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#064e3b_0%,#020617_42%,#000_100%)]" />
        <div className="absolute left-1/2 top-[-180px] h-[640px] w-[640px] -translate-x-1/2 rounded-full bg-green-500/10 blur-3xl" />
        <div className="absolute right-[-120px] top-40 h-[380px] w-[380px] rounded-full bg-yellow-500/10 blur-3xl" />

        <div className="relative mx-auto max-w-6xl">
          <div className="mx-auto max-w-4xl text-center">
            <p className="mb-5 inline-flex rounded-full border border-green-500/30 bg-green-500/10 px-4 py-2 text-xs font-black uppercase tracking-[0.24em] text-green-300">
              Velmenora Start
            </p>

            <h1 className="text-5xl font-black leading-tight tracking-tight md:text-7xl">
              Pass the challenge.
              <span className="block bg-gradient-to-r from-green-300 to-yellow-300 bg-clip-text text-transparent">
                Qualify for fixed rewards.
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-gray-300 md:text-xl">
              Start a simulated funded challenge with clear rules, or compare
              trusted forex brokers before opening your trading account. No noisy
              charts. No broken news feeds. Just the next decision.
            </p>

            <div className="mt-9 flex flex-col justify-center gap-4 sm:flex-row">
              <Link
                href="/funded/apply?plan=instant-25k"
                className="rounded-2xl bg-green-500 px-8 py-4 text-center text-lg font-black text-black shadow-2xl shadow-green-500/20 transition hover:bg-green-400"
              >
                Start Most Popular Plan
              </Link>

              <Link
                href="#plans"
                className="rounded-2xl border border-white/15 bg-white/[0.04] px-8 py-4 text-center text-lg font-bold text-white transition hover:border-green-400 hover:text-green-300"
              >
                Compare Plans
              </Link>

              <Link
                href="/brokers"
                className="rounded-2xl border border-yellow-500/30 bg-yellow-500/10 px-8 py-4 text-center text-lg font-bold text-yellow-300 transition hover:bg-yellow-500/15"
              >
                Compare Brokers
              </Link>
            </div>
          </div>

          <div className="mt-14 grid gap-4 md:grid-cols-4">
            {rules.map(([label, value, text]) => (
              <div
                key={label}
                className="rounded-3xl border border-white/10 bg-white/[0.04] p-5"
              >
                <p className="text-sm text-gray-500">{label}</p>
                <p className="mt-2 text-3xl font-black text-white">{value}</p>
                <p className="mt-3 text-sm leading-6 text-gray-400">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="plans" className="px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 text-center">
            <p className="mb-3 inline-flex rounded-full border border-yellow-500/25 bg-yellow-500/10 px-4 py-2 text-xs font-black uppercase tracking-[0.24em] text-yellow-300">
              Challenge Plans
            </p>
            <h2 className="text-4xl font-black md:text-5xl">
              Choose your simulated account size
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-gray-400">
              Every plan uses strict review logic. Reaching the target is not
              enough if drawdown, consistency, trading days, or risk rules are breached.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {plans.map((plan) => (
              <article
                key={plan.slug}
                className={`relative rounded-[2rem] border p-7 ${
                  plan.featured
                    ? "border-green-500 bg-green-950/20 shadow-[0_0_80px_rgba(34,197,94,0.16)]"
                    : "border-white/10 bg-white/[0.035]"
                }`}
              >
                {plan.featured && (
                  <div className="absolute -top-4 left-7 rounded-full bg-green-500 px-4 py-1 text-xs font-black text-black">
                    Most Popular
                  </div>
                )}

                <p className="text-xs font-black uppercase tracking-[0.24em] text-green-300">
                  {plan.badge}
                </p>

                <h3 className="mt-4 text-4xl font-black">{plan.name}</h3>
                <p className="mt-3 min-h-[72px] text-sm leading-6 text-gray-400">
                  {plan.description}
                </p>

                <div className="mt-7 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
                    <p className="text-xs text-gray-500">One-time fee</p>
                    <p className="mt-1 text-3xl font-black">{plan.fee}</p>
                  </div>
                  <div className="rounded-2xl border border-green-500/20 bg-green-500/10 p-4">
                    <p className="text-xs text-green-300">Fixed reward</p>
                    <p className="mt-1 text-3xl font-black text-green-300">
                      {plan.reward}
                    </p>
                  </div>
                </div>

                <ul className="mt-6 space-y-3 text-sm text-gray-300">
                  <li className="rounded-xl border border-white/10 bg-black/30 px-4 py-3">
                    ✅ 10% profit target
                  </li>
                  <li className="rounded-xl border border-white/10 bg-black/30 px-4 py-3">
                    ✅ 5% max daily loss
                  </li>
                  <li className="rounded-xl border border-white/10 bg-black/30 px-4 py-3">
                    ✅ 10% overall drawdown
                  </li>
                  <li className="rounded-xl border border-white/10 bg-black/30 px-4 py-3">
                    ✅ Manual review before reward
                  </li>
                </ul>

                <Link
                  href={`/funded/apply?plan=${plan.slug}`}
                  className={`mt-7 block rounded-2xl px-6 py-4 text-center font-black transition ${
                    plan.featured
                      ? "bg-green-500 text-black hover:bg-green-400"
                      : "border border-green-500/30 bg-green-500/10 text-green-300 hover:bg-green-500/15"
                  }`}
                >
                  Start {plan.name}
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-white/[0.02] px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.24em] text-green-300">
                How it works
              </p>
              <h2 className="mt-3 text-4xl font-black md:text-5xl">
                A simple path with strict rules
              </h2>
              <p className="mt-4 text-sm leading-7 text-gray-400">
                This is not a signal service or a get-rich-quick page. Velmenora
                is built around rule-following, verification, and review.
              </p>
            </div>

            <div className="grid gap-4">
              {steps.map((step) => (
                <div
                  key={step.n}
                  className="grid gap-4 rounded-3xl border border-white/10 bg-black/40 p-5 md:grid-cols-[72px_1fr]"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-500 text-lg font-black text-black">
                    {step.n}
                  </div>
                  <div>
                    <h3 className="text-xl font-black">{step.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-gray-400">
                      {step.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-2">
          <div className="rounded-[2rem] border border-yellow-500/25 bg-yellow-950/10 p-7 md:p-8">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-yellow-300">
              Need a broker first?
            </p>
            <h2 className="mt-4 text-3xl font-black md:text-4xl">
              Compare brokers before you trade
            </h2>
            <p className="mt-4 text-sm leading-7 text-gray-300">
              If you do not have a broker yet, start with broker comparison.
              Velmenora helps you compare trust, platforms, payments, and regional fit.
            </p>
            <Link
              href="/brokers"
              className="mt-7 inline-flex rounded-2xl bg-yellow-400 px-6 py-4 font-black text-black transition hover:bg-yellow-300"
            >
              Compare Recommended Brokers
            </Link>
          </div>

          <div className="rounded-[2rem] border border-red-500/20 bg-red-950/10 p-7 md:p-8">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-red-300">
              Important clarity
            </p>
            <h2 className="mt-4 text-3xl font-black md:text-4xl">
              This is a simulated challenge
            </h2>
            <p className="mt-4 text-sm leading-7 text-gray-300">
              Velmenora challenge accounts are simulated. Rewards are fixed and
              require manual review approval. Rule breaches can fail the challenge
              even if the profit target was reached.
            </p>
            <Link
              href="/funded"
              className="mt-7 inline-flex rounded-2xl border border-white/15 px-6 py-4 font-black text-white transition hover:border-green-400 hover:text-green-300"
            >
              Read Full Challenge Details
            </Link>
          </div>
        </div>
      </section>

      <section className="px-6 pb-24">
        <div className="mx-auto max-w-6xl rounded-[2rem] border border-green-500/25 bg-gradient-to-br from-green-500/15 via-white/[0.03] to-black p-8 text-center md:p-12">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-green-300">
            Start now
          </p>
          <h2 className="mx-auto mt-4 max-w-4xl text-4xl font-black md:text-6xl">
            Pick the plan you can trade with discipline.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-gray-300">
            Do not choose the largest plan because of emotion. Choose the account
            size that matches your risk control and consistency.
          </p>

          <div className="mt-9 flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/funded/apply?plan=instant-10k"
              className="rounded-2xl border border-white/15 px-7 py-4 font-black text-white transition hover:border-green-400 hover:text-green-300"
            >
              Start 10K
            </Link>
            <Link
              href="/funded/apply?plan=instant-25k"
              className="rounded-2xl bg-green-500 px-7 py-4 font-black text-black transition hover:bg-green-400"
            >
              Start 25K
            </Link>
            <Link
              href="/funded/apply?plan=instant-50k"
              className="rounded-2xl border border-white/15 px-7 py-4 font-black text-white transition hover:border-green-400 hover:text-green-300"
            >
              Start 50K
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
