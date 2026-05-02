type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function statusLabel(status: string | undefined) {
  switch (status) {
    case "paid":
      return "Payment confirmed";
    case "manual_review":
      return "Manual review required";
    case "failed":
      return "Payment failed";
    case "refunded":
      return "Payment refunded";
    default:
      return "Payment processing";
  }
}

export default async function PaymentSuccessPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const paymentId = first(params.paymentId);

  if (!paymentId) {
    return (
      <main className="min-h-screen bg-slate-950 px-6 py-16 text-white">
        <section className="mx-auto max-w-2xl rounded-2xl border border-white/10 bg-white/5 p-8 shadow-xl">
          <p className="text-sm uppercase tracking-[0.25em] text-yellow-400">
            Payment status
          </p>
          <h1 className="mt-4 text-3xl font-bold">Payment reference missing</h1>
          <p className="mt-4 text-slate-300">
            We could not read the payment reference from the return URL. Please
            open your dashboard or contact support if you already paid.
          </p>
          <a
            href="/funded"
            className="mt-8 inline-flex rounded-xl bg-yellow-400 px-5 py-3 font-semibold text-slate-950"
          >
            Back to dashboard
          </a>
        </section>
      </main>
    );
  }

  const apiBase =
    process.env.FUNDED_BACKEND_URL ??
    process.env.NEXT_PUBLIC_FUNDED_API_URL ??
    "https://api.velmenora.com";

  let data: {
    ok?: boolean;
    paid?: boolean;
    payment?: {
      id: string;
      status: string;
      amount: string;
      currency: string;
      provider?: string;
      providerReference?: string | null;
    };
    challengeAccount?: {
      id: string;
      status: string;
      paymentStatus: string;
    } | null;
    error?: string;
  };

  try {
    const res = await fetch(
      `${apiBase}/api/funded/payment/status?paymentId=${encodeURIComponent(
        paymentId,
      )}`,
      { cache: "no-store" },
    );

    data = await res.json();
  } catch {
    data = {
      ok: false,
      error: "status_check_failed",
    };
  }

  const paymentStatus = data.payment?.status;
  const isPaid = data.paid || paymentStatus === "paid";
  const isManualReview = paymentStatus === "manual_review";
  const isFailed = paymentStatus === "failed" || paymentStatus === "refunded";
  const accountId = data.challengeAccount?.id;

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-16 text-white">
      <section className="mx-auto max-w-2xl rounded-2xl border border-white/10 bg-white/5 p-8 shadow-xl">
        <p className="text-sm uppercase tracking-[0.25em] text-yellow-400">
          {statusLabel(paymentStatus)}
        </p>

        <h1 className="mt-4 text-3xl font-bold">
          {isPaid
            ? "Challenge account ready"
            : isManualReview
              ? "Payment is under manual review"
              : isFailed
                ? "Payment could not be completed"
                : "Payment is being confirmed"}
        </h1>

        <p className="mt-4 text-slate-300">
          {isPaid
            ? "Your payment has been confirmed and your challenge account is now active."
            : isManualReview
              ? "We received a payment update, but the amount or status requires manual review before your challenge account can be activated."
              : isFailed
                ? "The payment was not completed successfully. You can return and try again."
                : "Your payment is being confirmed. Crypto payments may take a few minutes to update after network confirmation."}
        </p>

        <div className="mt-6 rounded-xl border border-white/10 bg-slate-900/80 p-4 text-sm text-slate-300">
          <div className="flex justify-between gap-4">
            <span>Payment ID</span>
            <span className="font-mono text-white">{paymentId}</span>
          </div>

          {paymentStatus && (
            <div className="mt-2 flex justify-between gap-4">
              <span>Status</span>
              <span className="font-semibold text-white">{paymentStatus}</span>
            </div>
          )}

          {data.payment?.amount && (
            <div className="mt-2 flex justify-between gap-4">
              <span>Amount</span>
              <span className="font-semibold text-white">
                {data.payment.amount} {data.payment.currency}
              </span>
            </div>
          )}

          {data.challengeAccount?.status && (
            <div className="mt-2 flex justify-between gap-4">
              <span>Challenge status</span>
              <span className="font-semibold text-white">
                {data.challengeAccount.status}
              </span>
            </div>
          )}
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          {isPaid && accountId ? (
            <a
              href={`/funded/account/${accountId}`}
              className="inline-flex rounded-xl bg-yellow-400 px-5 py-3 font-semibold text-slate-950"
            >
              Open challenge account
            </a>
          ) : (
            <a
              href={`/funded/payment/success?paymentId=${encodeURIComponent(
                paymentId,
              )}`}
              className="inline-flex rounded-xl bg-yellow-400 px-5 py-3 font-semibold text-slate-950"
            >
              Refresh status
            </a>
          )}

          <a
            href="/funded"
            className="inline-flex rounded-xl border border-white/15 px-5 py-3 font-semibold text-white"
          >
            Back to dashboard
          </a>
        </div>
      </section>
    </main>
  );
}
