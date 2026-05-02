type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function PaymentCancelPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const paymentId = first(params.paymentId);

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-16 text-white">
      <section className="mx-auto max-w-2xl rounded-2xl border border-white/10 bg-white/5 p-8 shadow-xl">
        <p className="text-sm uppercase tracking-[0.25em] text-yellow-400">
          Payment cancelled
        </p>

        <h1 className="mt-4 text-3xl font-bold">
          Your challenge account has not been activated
        </h1>

        <p className="mt-4 text-slate-300">
          The checkout was cancelled or not completed. You can return to your
          dashboard and try again.
        </p>

        {paymentId && (
          <div className="mt-6 rounded-xl border border-white/10 bg-slate-900/80 p-4 text-sm text-slate-300">
            <div className="flex justify-between gap-4">
              <span>Payment ID</span>
              <span className="font-mono text-white">{paymentId}</span>
            </div>
          </div>
        )}

        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href="/funded"
            className="inline-flex rounded-xl bg-yellow-400 px-5 py-3 font-semibold text-slate-950"
          >
            Back to dashboard
          </a>

          {paymentId && (
            <a
              href={`/funded/payment/success?paymentId=${encodeURIComponent(
                paymentId,
              )}`}
              className="inline-flex rounded-xl border border-white/15 px-5 py-3 font-semibold text-white"
            >
              Check payment status
            </a>
          )}
        </div>
      </section>
    </main>
  );
}
