import AffiliateRefCapture from "./_components/AffiliateRefCapture";
import type { Metadata } from "next";
import TrackedCtaLink from "@/components/funded/TrackedCtaLink";
import { fundedFaqs, fundedPlans, fundedSocialProof } from "@/lib/funded/config";

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
    url: "https://velmenora.com/funded",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Velmenora Funded Challenge",
    description:
      "Instant simulated funded challenges: 10K, 25K, and 50K plans with fixed rewards.",
  },
};

const plans = fundedPlans;
const faqs = fundedFaqs;
const socialProof = fundedSocialProof;

function JsonLd() {
  const data = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: "Velmenora Funded Challenge",
      url: "https://velmenora.com/funded",
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
        url: `https://velmenora.com/funded/apply?plan=${plan.slug}`,
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



function SocialProofSection() {
  return (
    <section className="px-6 py-14">
      <div className="mx-auto max-w-6xl rounded-[2rem] border border-green-500/20 bg-green-950/10 p-6 md:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.25em] text-green-400">
              Platform proof
            </p>
            <h2 className="mt-3 text-3xl font-black md:text-4xl">
              Built for serious challenge tracking
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-400">
              Velmenora now tracks account status, broker verification, metrics,
              rule breaches, reviews, and reward progress in one system.
            </p>
          </div>

          <a
            href="/member"
            className="rounded-2xl border border-white/15 px-5 py-3 text-center font-black text-white transition hover:border-green-500 hover:text-green-400"
          >
            View Member Area
          </a>
        </div>

        <div className="mt-7 grid gap-4 md:grid-cols-3">
          {socialProof.map((item) => (
            <div
              key={item.label}
              className="rounded-3xl border border-white/10 bg-black/40 p-5"
            >
              <p className="text-sm text-gray-500">{item.label}</p>
              <p className="mt-2 text-3xl font-black text-white">{item.value}</p>
              <p className="mt-2 text-sm leading-6 text-gray-400">{item.note}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-2xl border border-yellow-500/20 bg-yellow-950/10 p-4 text-sm leading-6 text-yellow-100/90">
          <span className="font-black text-yellow-300">Trust note:</span>{" "}
          Velmenora uses simulated accounts and fixed rewards. Passing requires
          rule compliance and review approval, not only reaching the profit target.
        </div>
      </div>
    </section>
  );
}


function ConversionKillerBar() {
  return (
    <section className="px-6 pb-6">
      <div className="mx-auto max-w-6xl rounded-3xl border border-yellow-500/25 bg-yellow-950/10 p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.25em] text-yellow-300">
              Limited review capacity
            </p>
            <h2 className="mt-2 text-2xl font-black text-white">
              New challenge reviews are processed in daily batches
            </h2>
            <p className="mt-2 text-sm leading-6 text-gray-400">
              Start earlier to enter the next review cycle after completing the
              rules. Passing still requires compliance and manual review approval.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/40 p-4 text-center">
            <p className="text-xs text-gray-500">Next review window</p>
            <p className="mt-1 text-2xl font-black text-yellow-300">Daily</p>
            <p className="mt-1 text-xs text-gray-500">UTC processing cycle</p>
          </div>
        </div>
      </div>
    </section>
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
      <AffiliateRefCapture />
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
            <TrackedCtaLink
              href="/funded/apply?plan=instant-25k"
              placement="hero"
              label="Hero CTA - Start Most Popular Plan"
              className="rounded-2xl bg-green-500 px-7 py-4 font-black text-black transition hover:bg-green-400"
            >
              Start Most Popular Plan
            </TrackedCtaLink>
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

      <SocialProofSection />
      <ConversionKillerBar />

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

                <TrackedCtaLink
                  href={`/funded/apply?plan=${plan.slug}`}
                  placement="plan_card"
                  label={`Plan Card CTA - ${plan.name}`}
                  className={`mt-7 block rounded-2xl px-5 py-4 text-center font-black transition ${
                    plan.featured
                      ? "bg-green-500 text-black hover:bg-green-400"
                      : "border border-green-500 text-green-400 hover:bg-green-500 hover:text-black"
                  }`}
                >
                  Start {plan.name} →
                </TrackedCtaLink>
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
              ["Risk Cap", "1.5%", "Risk and lot size are monitored."],
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

      <section className="px-6 py-10">
        <div className="mx-auto max-w-5xl rounded-[2rem] border border-cyan-400/25 bg-cyan-950/10 p-8 shadow-[0_0_70px_rgba(34,211,238,0.08)] md:p-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.25em] text-cyan-300">
                Affiliate Program
              </p>

              <h2 className="mt-3 text-3xl font-black md:text-4xl">
                Earn Commissions Promoting Velmenora Funded Challenge
              </h2>

              <p className="mt-3 max-w-2xl text-gray-300">
                Are you an influencer, educator, signal provider, or trading community owner?
                Promote Velmenora Funded Challenge, refer traders, and earn commissions
                when verified referrals purchase challenge plans.
              </p>
            </div>

            <a
              href="/affiliate"
              className="rounded-2xl bg-white px-7 py-4 text-center font-black text-black transition hover:bg-cyan-200"
            >
              Join Affiliate Program
            </a>
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
            <TrackedCtaLink
              href="/funded/apply?plan=instant-25k"
              placement="final"
              label="Final CTA - Start 25K Challenge"
              className="rounded-2xl bg-green-500 px-7 py-4 font-black text-black transition hover:bg-green-400"
            >
              Start 25K Challenge
            </TrackedCtaLink>
            <TrackedCtaLink
              href="/funded/apply?plan=instant-50k"
              placement="final"
              label="Final CTA - Start 50K Challenge"
              className="rounded-2xl border border-white/15 px-7 py-4 font-black text-white transition hover:border-green-500 hover:text-green-400"
            >
              Start 50K Challenge
            </TrackedCtaLink>
          </div>
        </div>
      </section>
      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-black/90 p-4 backdrop-blur md:hidden">
        <div className="mx-auto flex max-w-md items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-bold uppercase tracking-[0.18em] text-green-400">
              Most popular
            </p>
            <p className="truncate text-sm font-black text-white">
              Start 25K Challenge
            </p>
          </div>

          <TrackedCtaLink
            href="/funded/apply?plan=instant-25k"
            placement="sticky_mobile"
            label="Sticky Mobile CTA - Start 25K Challenge"
            className="shrink-0 rounded-2xl bg-green-500 px-5 py-3 text-sm font-black text-black transition hover:bg-green-400"
          >
            Start Now
          </TrackedCtaLink>
        </div>
      </div>

    </main>
  );
}
