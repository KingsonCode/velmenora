import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Velmenora Funded Challenge | Instant 10K, 25K & 50K Trading Challenges",
  description:
    "Start a Velmenora simulated funded challenge from $35. Trade a virtual 10K, 25K, or 50K account, follow strict risk rules, and qualify for fixed rewards after review.",
  alternates: {
    canonical: "/funded",
  },
  openGraph: {
    title: "Velmenora Funded Challenge",
    description:
      "Choose a simulated funded challenge, trade transparent rules, and qualify for fixed rewards after review.",
    url: "https://www.velmenora.com/funded",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Velmenora Funded Challenge",
    description:
      "Instant simulated funded challenges: 10K, 25K, and 50K plans with fixed rewards.",
  },
};

const plans = [
  {
    badge: "Starter",
    name: "Instant 10K",
    slug: "instant-10k",
    fee: "$35",
    balance: "$10,000",
    reward: "$100",
    target: "10%",
    dailyLoss: "5%",
    drawdown: "10%",
    tradingDays: "7 days",
    consistency: "35%",
    risk: "2%",
    lot: "1.00",
    featured: false,
    description:
      "Best for disciplined traders who want a lower-cost path into the Velmenora challenge system.",
  },
  {
    badge: "Most Popular",
    name: "Instant 25K",
    slug: "instant-25k",
    fee: "$79",
    balance: "$25,000",
    reward: "$150",
    target: "10%",
    dailyLoss: "5%",
    drawdown: "10%",
    tradingDays: "7 days",
    consistency: "35%",
    risk: "2%",
    lot: "2.00",
    featured: true,
    description:
      "The strongest balance between entry fee, account size, and fixed reward potential.",
  },
  {
    badge: "High Ticket",
    name: "Instant 50K",
    slug: "instant-50k",
    fee: "$149",
    balance: "$50,000",
    reward: "$250",
    target: "10%",
    dailyLoss: "5%",
    drawdown: "10%",
    tradingDays: "7 days",
    consistency: "35%",
    risk: "1.5%",
    lot: "3.00",
    featured: false,
    description:
      "Built for serious traders who want a larger simulated account and higher fixed reward ceiling.",
  },
];

const faqs = [
  {
    q: "Is Velmenora Funded Challenge a real-money trading account?",
    a: "No. It is a simulated funded challenge. Traders use a virtual balance and may qualify for fixed rewards after meeting the rules and passing review.",
  },
  {
    q: "What are the main rules?",
    a: "Each plan uses a 10% profit target, 5% daily loss limit, 10% overall drawdown limit, 7 minimum trading days, consistency rule, and maximum risk or lot-size controls.",
  },
  {
    q: "How does the consistency rule work?",
    a: "No single trading day should contribute more than 35% of the total profit used to pass the challenge. This discourages lucky spikes and high-risk gambling behavior.",
  },
  {
    q: "When can I request a reward?",
    a: "After hitting the profit target, completing the minimum trading days, staying within risk limits, and passing manual review.",
  },
  {
    q: "What happens if I fail?",
    a: "Failed accounts are not eligible for reward review. A retry discount system may be offered to eligible traders in a later release.",
  },
];

function JsonLd() {
  const data = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: "Velmenora Funded Challenge",
      url: "https://www.velmenora.com/funded",
      description:
        "Simulated funded trading challenge plans with fixed rewards and transparent risk rules.",
    },
    {
      "@context": "https://schema.org",
      "@type": "OfferCatalog",
      name: "Velmenora Funded Challenge Plans",
      itemListElement: plans.map((plan) => ({
        "@type": "Offer",
        name: plan.name,
        price: plan.fee.replace("$", ""),
        priceCurrency: "USD",
        url: `https://www.velmenora.com/funded/apply?plan=${plan.slug}`,
        itemOffered: {
          "@type": "Service",
          name: `${plan.name} Simulated Funded Challenge`,
          description: plan.description,
        },
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((faq) => ({
        "@type": "Question",
        name: faq.q,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.a,
        },
      })),
    },
  ];

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="mt-2 text-2xl font-black text-white">{value}</p>
    </div>
  );
}

export default function FundedPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <JsonLd />

      <section className="relative overflow-hidden px-6 py-20">
        <div className="absolute left-1/2 top-0 h-[560px] w-[560px] -translate-x-1/2 rounded-full bg-green-500/10 blur-3xl" />
        <div className="relative mx-auto max-w-6xl">
          <p className="mb-4 inline-flex rounded-full border border-green-500/30 bg-green-500/10 px-4 py-2 text-sm font-black text-green-400">
            Simulated Funded Trading Challenge
          </p>

          <h1 className="max-w-5xl text-5xl font-black leading-tight tracking-tight md:text-7xl">
            Pass the challenge.
            <span className="block text-green-400">Qualify for fixed rewards.</span>
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-gray-300 md:text-xl">
            Choose a 10K, 25K, or 50K simulated account. Hit the profit target,
            respect strict risk rules, complete 7 trading days, and submit for
            review.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href="/funded/apply?plan=instant-25k"
              className="rounded-2xl bg-green-500 px-7 py-4 font-black text-black transition hover:bg-green-400"
            >
              Start Most Popular Plan
            </a>
            <a
              href="#plans"
              className="rounded-2xl border border-white/15 px-7 py-4 font-black text-white transition hover:border-green-500 hover:text-green-400"
            >
              Compare Plans
            </a>
          </div>

          <div className="mt-12 grid gap-4 md:grid-cols-4">
            <StatCard label="Starting Fee" value="$35" />
            <StatCard label="Account Sizes" value="10K / 25K / 50K" />
            <StatCard label="Profit Target" value="10%" />
            <StatCard label="Minimum Days" value="7" />
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-white/[0.02] px-6 py-8">
        <div className="mx-auto grid max-w-6xl gap-4 text-sm text-gray-300 md:grid-cols-4">
          <div className="rounded-xl border border-white/10 bg-black/40 p-4">✅ Crypto checkout ready</div>
          <div className="rounded-xl border border-white/10 bg-black/40 p-4">✅ Fixed reward model</div>
          <div className="rounded-xl border border-white/10 bg-black/40 p-4">✅ Consistency rule enforced</div>
          <div className="rounded-xl border border-white/10 bg-black/40 p-4">✅ Risk cap protected</div>
        </div>
      </section>

      <section id="plans" className="px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 max-w-3xl">
            <p className="text-sm font-black uppercase tracking-[0.25em] text-green-400">
              Challenge Plans
            </p>
            <h2 className="mt-3 text-4xl font-black md:text-5xl">
              Choose your simulated account size
            </h2>
            <p className="mt-4 text-gray-400">
              Pricing is built for disciplined traders. The rules are strict by
              design: hit target, avoid drawdown, pass consistency, and keep risk controlled.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
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
                    Most Popular
                  </div>
                )}

                <p className="text-sm font-black uppercase tracking-[0.25em] text-green-400">
                  {plan.badge}
                </p>

                <h3 className="mt-4 text-4xl font-black">{plan.name}</h3>
                <p className="mt-3 min-h-[72px] text-sm leading-6 text-gray-400">
                  {plan.description}
                </p>

                <div className="mt-6 flex items-end justify-between">
                  <div>
                    <p className="text-sm text-gray-500">One-time fee</p>
                    <p className="text-4xl font-black">{plan.fee}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Fixed reward</p>
                    <p className="text-2xl font-black text-green-400">{plan.reward}</p>
                  </div>
                </div>

                <div className="mt-7 grid grid-cols-2 gap-3">
                  <StatCard label="Balance" value={plan.balance} />
                  <StatCard label="Target" value={plan.target} />
                  <StatCard label="Max DD" value={plan.drawdown} />
                  <StatCard label="Min Days" value={plan.tradingDays} />
                </div>

                <div className="mt-6 rounded-2xl border border-yellow-500/20 bg-yellow-950/10 p-4 text-sm text-gray-300">
                  <p className="font-bold text-yellow-300">Risk controls</p>
                  <p className="mt-2">
                    Daily loss {plan.dailyLoss}. Consistency cap {plan.consistency}.
                    Max risk {plan.risk}. Max lot {plan.lot}.
                  </p>
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
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.25em] text-green-400">
              Military-grade rules
            </p>
            <h2 className="mt-3 text-4xl font-black md:text-5xl">
              Built to reward consistency, not gambling
            </h2>
            <p className="mt-4 text-gray-400">
              Velmenora uses multiple gates before an account can move to review:
              target profit, minimum days, drawdown control, consistency, and
              risk limits.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {[
              ["Profit Target", "10%", "Reach the required net profit."],
              ["Minimum Trading Days", "7", "Show consistency across multiple days."],
              ["Consistency Rule", "35%", "No single day should dominate total profit."],
              ["Risk Cap", "1.5–2%", "Risk and lot size are monitored."],
            ].map(([title, value, text]) => (
              <div key={title} className="rounded-3xl border border-white/10 bg-black p-6">
                <p className="font-bold text-green-400">{title}</p>
                <p className="mt-2 text-3xl font-black">{value}</p>
                <p className="mt-2 text-sm text-gray-400">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <div className="mb-10 text-center">
            <p className="text-sm font-black uppercase tracking-[0.25em] text-green-400">
              FAQ
            </p>
            <h2 className="mt-3 text-4xl font-black">Funded challenge questions</h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq) => (
              <div key={faq.q} className="rounded-3xl border border-white/10 bg-black p-6">
                <h3 className="font-bold">{faq.q}</h3>
                <p className="mt-3 text-sm leading-6 text-gray-400">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="mx-auto max-w-5xl rounded-[2rem] border border-green-500/30 bg-green-950/20 p-8 text-center shadow-[0_0_70px_rgba(34,197,94,0.12)] md:p-12">
          <p className="text-sm font-black uppercase tracking-[0.25em] text-green-400">
            Start now
          </p>
          <h2 className="mt-3 text-4xl font-black md:text-5xl">
            Pick the account size that matches your discipline
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-gray-300">
            The 25K plan is the best starting point for most traders. The 50K
            plan is for serious traders who want a larger simulated challenge.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <a href="/funded/apply?plan=instant-25k" className="rounded-2xl bg-green-500 px-7 py-4 font-black text-black transition hover:bg-green-400">
              Start 25K Challenge
            </a>
            <a href="/funded/apply?plan=instant-50k" className="rounded-2xl border border-white/15 px-7 py-4 font-black text-white transition hover:border-green-500 hover:text-green-400">
              Start 50K Challenge
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
