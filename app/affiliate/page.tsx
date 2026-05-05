import Link from "next/link";

export const dynamic = "force-dynamic";

const benefits = [
  {
    title: "Earn from paid challenge referrals",
    body: "Promote Velmenora Funded Challenge and earn commissions when approved referrals buy verified plans.",
  },
  {
    title: "Protected affiliate dashboard",
    body: "Approved affiliates get a private dashboard for referral links, stats, commissions, and payout requests.",
  },
  {
    title: "Manual approval protects payouts",
    body: "Every partner is reviewed before receiving a referral code. This prevents fake partners and payout abuse.",
  },
];

export default function AffiliateLandingPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="rounded-[2rem] border border-emerald-500/20 bg-emerald-500/[0.03] p-8 md:p-12">
          <p className="text-sm font-black uppercase tracking-[0.35em] text-emerald-400">
            Velmenora Affiliate Program
          </p>

          <div className="mt-6 grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div>
              <h1 className="max-w-4xl text-5xl font-black leading-tight md:text-7xl">
                Earn Money Promoting Velmenora
              </h1>

              <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
                Join the Velmenora affiliate program, refer serious traders to the
                funded challenge, and earn commissions after approved conversions.
              </p>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Link
                  href="/affiliate/apply"
                  className="rounded-2xl bg-emerald-400 px-7 py-4 text-center text-lg font-black text-black hover:bg-emerald-300"
                >
                  Join Affiliate Program
                </Link>

                <Link
                  href="/affiliate/sign-in"
                  className="rounded-2xl border border-white/15 px-7 py-4 text-center text-lg font-black text-white hover:bg-white/10"
                >
                  Affiliate Sign In
                </Link>
              </div>

              <p className="mt-4 text-sm text-slate-500">
                You must be logged in to apply. Referral links are issued only after approval.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
              <h2 className="text-2xl font-black">How it works</h2>

              <ol className="mt-5 space-y-4 text-slate-300">
                <li>
                  <span className="font-bold text-white">1. Create account / sign in</span>
                  <br />
                  Use your Velmenora member account.
                </li>
                <li>
                  <span className="font-bold text-white">2. Apply as affiliate</span>
                  <br />
                  Tell us your audience and promotion channels.
                </li>
                <li>
                  <span className="font-bold text-white">3. Get approved</span>
                  <br />
                  Admin reviews your application and activates your affiliate code.
                </li>
                <li>
                  <span className="font-bold text-white">4. Earn commissions</span>
                  <br />
                  Track referrals, commissions, and payout requests from your dashboard.
                </li>
              </ol>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {benefits.map((item) => (
            <article
              key={item.title}
              className="rounded-3xl border border-white/10 bg-white/[0.03] p-6"
            >
              <h3 className="text-xl font-black">{item.title}</h3>
              <p className="mt-3 leading-7 text-slate-400">{item.body}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
