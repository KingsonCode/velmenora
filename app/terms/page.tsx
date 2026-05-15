export default function TermsPage() {
  return (
    <main className="min-h-screen bg-black px-6 py-16 text-white">
      <section className="mx-auto max-w-5xl">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-green-400">
          Velmenora Legal
        </p>

        <h1 className="mb-6 text-4xl font-bold md:text-5xl">
          Terms & Conditions
        </h1>

        <p className="mb-10 max-w-3xl text-lg leading-8 text-zinc-300">
          Velmenora provides simulated trading evaluation challenges designed to
          assess trader discipline, consistency, and risk management.
        </p>

        <div className="space-y-8 text-zinc-300 leading-8">
          <section>
            <h2 className="mb-3 text-2xl font-semibold text-white">
              1. Simulated Evaluation Environment
            </h2>
            <p>
              Velmenora challenge accounts are simulated. No real capital is
              allocated to participants during the evaluation process. The
              platform is intended for educational evaluation, skill assessment,
              and trader development purposes.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold text-white">
              2. No Brokerage, Investment, or Financial Advice
            </h2>
            <p>
              Velmenora does not provide brokerage services, investment
              services, portfolio management, financial advice, or access to
              live trading capital. Users are responsible for their own trading
              decisions outside the Velmenora platform.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold text-white">
              3. Challenge Rules
            </h2>
            <ul className="list-disc space-y-2 pl-6">
              <li>Participants must follow all published challenge rules.</li>
              <li>Risk limits, drawdown limits, and trading day requirements apply.</li>
              <li>Consistency and risk management rules may affect eligibility.</li>
              <li>Rule breaches may result in challenge failure.</li>
              <li>All results remain subject to manual review.</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold text-white">
              4. Fixed Reward Eligibility
            </h2>
            <p>
              Velmenora rewards are fixed evaluation rewards. They are not
              investment returns, profit shares, trading profits, or guaranteed
              payments. Reward eligibility requires successful completion of the
              challenge rules, manual review approval, identity or account
              verification where required, and fraud screening.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold text-white">
              5. Manual Review
            </h2>
            <p>
              Passing automated metrics does not guarantee reward approval.
              Velmenora reserves the right to review account activity, trading
              behavior, payment history, user identity, and compliance signals
              before approving or rejecting any reward request.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold text-white">
              6. Prohibited Activity
            </h2>
            <ul className="list-disc space-y-2 pl-6">
              <li>Fraud, abuse, or manipulation of platform systems.</li>
              <li>Identity misuse, duplicate abuse, or payment manipulation.</li>
              <li>Exploiting technical issues, pricing errors, or loopholes.</li>
              <li>Using prohibited strategies or behavior designed to bypass rules.</li>
              <li>Chargeback abuse or false payment disputes.</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold text-white">
              7. Disputes
            </h2>
            <p>
              Disputes should be submitted to support@velmenora.com with the
              user email, account reference, payment reference, and a clear
              explanation of the issue.
            </p>
          </section>
        </div>
      </section>
    </main>
  );
}
