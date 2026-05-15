export default function SimulatedEnvironmentPage() {
  return (
    <main className="min-h-screen bg-black px-6 py-16 text-white">
      <section className="mx-auto max-w-5xl">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-green-400">
          Velmenora Evaluation Model
        </p>

        <h1 className="mb-6 text-4xl font-bold md:text-5xl">
          Simulated Evaluation Environment
        </h1>

        <p className="mb-10 max-w-3xl text-lg leading-8 text-zinc-300">
          Velmenora provides simulated trading evaluation challenges designed to
          assess trader discipline, consistency, and risk management.
        </p>

        <div className="grid gap-5 md:grid-cols-2">
          {[
            [
              "No real capital allocation",
              "Challenge accounts are simulated and do not provide access to live trading capital.",
            ],
            [
              "Educational assessment",
              "The platform is designed for evaluation, skill assessment, and trader development.",
            ],
            [
              "Transparent rules",
              "Participants are assessed using profit target, drawdown, consistency, risk, and trading day rules.",
            ],
            [
              "Fixed reward review",
              "Rewards are fixed evaluation rewards subject to successful completion and manual review.",
            ],
          ].map(([title, body]) => (
            <div key={title} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <h2 className="mb-3 text-xl font-semibold text-white">{title}</h2>
              <p className="leading-7 text-zinc-300">{body}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
