export default function AffiliatePage() {
  const commissions = [
    { plan: "10K", price: "$35", commission: "$7" },
    { plan: "25K", price: "$79", commission: "$15" },
    { plan: "50K", price: "$149", commission: "$30" },
  ];

  const channels = [
    "Forex traders",
    "Trading students",
    "TikTok trading audiences",
    "Telegram trading groups",
    "WhatsApp communities",
    "YouTube trading followers",
    "Instagram finance pages",
    "Signal group members",
  ];

  const faqs = [
    {
      q: "When do I earn commission?",
      a: "You earn when your approved referral buys a Velmenora Funded Challenge plan successfully.",
    },
    {
      q: "Do I earn from clicks or signups?",
      a: "No. Clicks and signups are tracked, but commission is paid only after a successful paid conversion.",
    },
    {
      q: "How much can I earn?",
      a: "10K pays $7, 25K pays $15, and 50K pays $30 per successful paid referral.",
    },
    {
      q: "Can I promote using WhatsApp, TikTok, or Telegram?",
      a: "Yes. WhatsApp, TikTok, Telegram, Instagram, YouTube, and trading communities are accepted if promoted ethically.",
    },
    {
      q: "Can I refer myself?",
      a: "No. Self-referrals, duplicate accounts, fake users, and suspicious activity are not allowed.",
    },
    {
      q: "When do I get my referral link?",
      a: "After your affiliate application is reviewed and approved by Velmenora.",
    },
  ];

  return (
    <main className="min-h-screen bg-black text-white">
      <section className="mx-auto max-w-5xl px-5 py-16 sm:px-8">
        <div className="rounded-[2rem] border border-emerald-500/20 bg-emerald-950/10 p-6 shadow-2xl sm:p-10">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.35em] text-emerald-400">
            Velmenora Affiliate Program
          </p>

          <h1 className="text-5xl font-black leading-tight sm:text-7xl">
            Earn Money Promoting Velmenora
          </h1>

          <p className="mt-6 max-w-3xl text-xl leading-9 text-slate-300">
            Refer serious traders to Velmenora Funded Challenge and earn
            commissions when your approved referrals buy verified challenge
            plans.
          </p>

          <p className="mt-4 max-w-3xl text-slate-400">
            No monthly targets. No salary model. You earn only from successful
            paid referrals.
          </p>

          <div className="mt-8 grid gap-4 sm:flex">
            <a
              href="/affiliate/apply"
              className="rounded-2xl bg-emerald-400 px-8 py-4 text-center text-lg font-black text-black"
            >
              Join Affiliate Program
            </a>
            <a
              href="/affiliate/dashboard"
              className="rounded-2xl border border-white/15 px-8 py-4 text-center text-lg font-black text-white"
            >
              Affiliate Sign In
            </a>
          </div>

          <p className="mt-6 text-sm text-slate-500">
            You must be logged in to apply. Referral links are issued only after
            approval.
          </p>
        </div>

        <section className="mt-10 rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 sm:p-8">
          <h2 className="text-3xl font-black">How it works</h2>

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {[
              ["1. Create account / sign in", "Use your Velmenora member account to apply."],
              ["2. Apply as affiliate", "Tell us your audience, promotion channels, and how you plan to promote Velmenora."],
              ["3. Get reviewed", "Our admin team reviews every application before issuing a referral code."],
              ["4. Start promoting", "Once approved, you receive your unique referral link."],
              ["5. Earn commissions", "When a referred trader buys a verified funded challenge plan, your commission is recorded."],
              ["6. Request payout", "Track your commissions and request payout once eligible."],
            ].map(([title, body]) => (
              <div key={title} className="rounded-3xl border border-white/10 bg-black/40 p-5">
                <h3 className="text-xl font-black">{title}</h3>
                <p className="mt-2 leading-7 text-slate-400">{body}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-2xl border border-emerald-500/20 bg-emerald-950/10 p-5">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-emerald-400">
              Example referral link
            </p>
            <p className="mt-2 break-all font-mono text-slate-200">
              velmenora.com/funded?ref=yourname
            </p>
          </div>
        </section>

        <section className="mt-10 rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 sm:p-8">
          <h2 className="text-3xl font-black">Commission Structure</h2>
          <p className="mt-3 text-slate-400">
            Commissions are paid only after successful paid challenge purchases.
          </p>

          <div className="mt-6 overflow-hidden rounded-3xl border border-white/10">
            <table className="w-full text-left">
              <thead className="bg-white/5 text-sm uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="p-4">Plan</th>
                  <th className="p-4">Customer Price</th>
                  <th className="p-4">Affiliate</th>
                </tr>
              </thead>
              <tbody>
                {commissions.map((row) => (
                  <tr key={row.plan} className="border-t border-white/10">
                    <td className="p-4 text-xl font-black">{row.plan}</td>
                    <td className="p-4 text-slate-300">{row.price}</td>
                    <td className="p-4 text-xl font-black text-emerald-400">{row.commission}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-10 grid gap-6 md:grid-cols-3">
          {[
            ["Earn from paid challenge referrals", "You earn commissions when approved referrals purchase verified plans."],
            ["Protected affiliate dashboard", "Approved affiliates get a private dashboard for referral links, stats, commissions, and payout requests."],
            ["Manual approval protects payouts", "Every partner is reviewed before receiving a referral code. This prevents fake partners and payout abuse."],
          ].map(([title, body]) => (
            <div key={title} className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6">
              <h3 className="text-2xl font-black">{title}</h3>
              <p className="mt-4 leading-8 text-slate-400">{body}</p>
            </div>
          ))}
        </section>

        <section className="mt-10 rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 sm:p-8">
          <h2 className="text-3xl font-black">What you can promote</h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 md:grid-cols-4">
            {channels.map((item) => (
              <div key={item} className="rounded-2xl border border-white/10 bg-black/40 p-4 text-slate-300">
                {item}
              </div>
            ))}
          </div>
        </section>

        <section className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="rounded-[2rem] border border-emerald-500/20 bg-emerald-950/10 p-6">
            <h2 className="text-3xl font-black">Who should apply</h2>
            <ul className="mt-5 space-y-3 text-slate-300">
              {["Trading content creators", "Forex educators", "TikTok finance creators", "Telegram group owners", "WhatsApp closers", "YouTube creators", "Affiliate marketers", "Traders with active networks"].map((x) => (
                <li key={x}>✓ {x}</li>
              ))}
            </ul>
          </div>

          <div className="rounded-[2rem] border border-red-500/20 bg-red-950/10 p-6">
            <h2 className="text-3xl font-black">Who should not apply</h2>
            <ul className="mt-5 space-y-3 text-slate-300">
              {["Fake account promoters", "Self-referral attempts", "No audience or promotion plan", "Misleading income claims", "Guaranteed profit promises", "Spam or deceptive marketing"].map((x) => (
                <li key={x}>× {x}</li>
              ))}
            </ul>
          </div>
        </section>

        <section className="mt-10 rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 sm:p-8">
          <h2 className="text-3xl font-black">Important Rules</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {[
              "Commissions are paid only after successful paid challenge purchases.",
              "Clicks alone do not earn commission.",
              "Signups alone do not earn commission.",
              "Fake referrals and self-referrals are not allowed.",
              "Duplicate or suspicious accounts may be rejected.",
              "Velmenora may review, approve, reject, or hold commissions if abuse is detected.",
              "Referral links are issued only after approval.",
              "Refunded or fraudulent purchases may void commissions.",
            ].map((rule) => (
              <div key={rule} className="rounded-2xl border border-white/10 bg-black/40 p-4 text-slate-300">
                {rule}
              </div>
            ))}
          </div>
        </section>

        <section className="mt-10 rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 sm:p-8">
          <h2 className="text-3xl font-black">Payout Notes</h2>
          <p className="mt-4 leading-8 text-slate-400">
            Affiliate commissions become eligible for payout after review.
            Payout approval may depend on successful payment confirmation,
            valid referral attribution, fraud review, no self-referral, no
            duplicate abuse, and no suspicious traffic pattern.
          </p>
        </section>

        <section className="mt-10 rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 sm:p-8">
          <h2 className="text-3xl font-black">Frequently Asked Questions</h2>

          <div className="mt-6 grid gap-4">
            {faqs.map((item) => (
              <details key={item.q} className="rounded-2xl border border-white/10 bg-black/40 p-5">
                <summary className="cursor-pointer text-lg font-black">{item.q}</summary>
                <p className="mt-3 leading-7 text-slate-400">{item.a}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="mt-10 rounded-[2rem] border border-emerald-500/20 bg-emerald-950/10 p-8 text-center">
          <h2 className="text-4xl font-black">Ready to earn from serious trader referrals?</h2>
          <p className="mx-auto mt-4 max-w-2xl leading-8 text-slate-300">
            Join the Velmenora Affiliate Program and start promoting the funded
            challenge with a protected dashboard, clear commission structure,
            and transparent tracking.
          </p>

          <div className="mt-8 grid gap-4 sm:flex sm:justify-center">
            <a href="/affiliate/apply" className="rounded-2xl bg-emerald-400 px-8 py-4 text-lg font-black text-black">
              Apply Now
            </a>
            <a href="/affiliate/dashboard" className="rounded-2xl border border-white/15 px-8 py-4 text-lg font-black text-white">
              Affiliate Sign In
            </a>
          </div>
        </section>
      </section>
    </main>
  );
}
