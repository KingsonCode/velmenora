export default function RefundPolicyPage() {
  return (
    <main className="min-h-screen bg-black px-6 py-16 text-white">
      <section className="mx-auto max-w-4xl">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-green-400">
          Velmenora Policy
        </p>

        <h1 className="mb-6 text-4xl font-bold md:text-5xl">
          Refund Policy
        </h1>

        <div className="space-y-7 text-zinc-300 leading-8">
          <p>
            Refund requests may be considered only before challenge credentials,
            account access, or challenge activation have been issued.
          </p>

          <p>
            Once a challenge has been activated, credentials have been delivered,
            or account access has been provided, purchases become non-refundable.
          </p>

          <p>
            Fraud, abuse, identity manipulation, payment manipulation, prohibited
            activity, or chargeback abuse voids refund eligibility.
          </p>

          <p>
            Velmenora reserves the right to manually review all refund requests
            before approval or rejection.
          </p>

          <p>
            To request support, contact support@velmenora.com with your account
            email and payment reference.
          </p>
        </div>
      </section>
    </main>
  );
}
