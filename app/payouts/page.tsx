export default function PayoutsPage() {
  return (
    <main className="min-h-screen bg-black px-6 py-16 text-white">
      <section className="mx-auto max-w-5xl">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-green-400">
          Velmenora Rewards
        </p>

        <h1 className="mb-6 text-4xl font-bold md:text-5xl">
          Evaluation Reward Process
        </h1>

        <p className="mb-10 max-w-3xl text-lg leading-8 text-zinc-300">
          Velmenora rewards are fixed evaluation rewards. They are subject to
          successful challenge completion, manual review, verification, and
          anti-fraud checks.
        </p>

        <div className="space-y-5">
          {[
            [
              "1. Complete the challenge rules",
              "Participants must meet the profit target, minimum trading days, drawdown limits, consistency rules, and risk controls.",
            ],
            [
              "2. Submit or enter review",
              "Eligible accounts may enter manual review before any reward decision is made.",
            ],
            [
              "3. Compliance and anti-fraud checks",
              "Velmenora reviews trading behavior, rule compliance, payment status, account signals, and suspicious activity.",
            ],
            [
              "4. Fixed reward decision",
              "Approved accounts may qualify for the published fixed reward. Rewards are not guaranteed and may be denied for violations.",
            ],
          ].map(([title, body]) => (
            <div key={title} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <h2 className="mb-2 text-xl font-semibold text-white">{title}</h2>
              <p className="leading-7 text-zinc-300">{body}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
