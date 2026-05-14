"use client";

import { useEffect, useState } from "react";

type Props = {
  accountId: string;
  accountStatus: string;
  isReady: boolean;
  latestPayoutStatus?: string | null;
};

export default function AccountActions({
  accountId,
  accountStatus,
  isReady,
  latestPayoutStatus,
}: Props) {
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [retakeCode, setRetakeCode] = useState("");

  useEffect(() => {
    const url = new URL(window.location.href);
    const fromUrl = url.searchParams.get("retakeCode") || url.searchParams.get("discountCode");
    const fromStorage = window.localStorage.getItem("velmenora_retake_code") || "";
    const code = fromUrl || fromStorage;

    if (code) {
      setRetakeCode(code);
      window.localStorage.setItem("velmenora_retake_code", code);
    }
  }, []);

  async function startPayment() {
    setLoading("payment");
    setError("");

    try {
      const res = await fetch("/api/funded/payment/initiate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          challengeAccountId: accountId,
            discountCode: retakeCode || undefined,
        }),
      });

      let data: any = null;

      try {
        data = await res.json();
      } catch {
        throw new Error("Invalid payment server response");
      }

      if (!res.ok || data?.ok === false) {
        throw new Error(
          data?.message || data?.error || data?.reason || "Payment initiation failed",
        );
      }

      const checkoutUrl =
        data?.checkoutUrl || data?.payment?.checkoutUrl || data?.paymentUrl;

      if (!checkoutUrl) {
        throw new Error("Checkout URL was not returned");
      }

      window.location.href = checkoutUrl;
    } catch (err: any) {
      setError(err.message || "Unexpected payment error");
      setLoading(null);
    }
  }

  async function postAction(action: "submit-review" | "request-payout") {
    setLoading(action);
    setError("");

    const endpoint =
      action === "submit-review"
        ? `/api/funded/account/${accountId}/review/submit`
        : `/api/funded/account/${accountId}/payout/request`;

    try {
      const init: RequestInit = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      };

      const res = await fetch(endpoint, init);
      const data = await res.json();

      if (!res.ok || data?.ok === false) {
        throw new Error(data?.message || data?.reason || "Action failed");
      }

      window.location.reload();
    } catch (err: any) {
      setError(err.message || "Unexpected error");
      setLoading(null);
    }
  }

  if (accountStatus === "pending_payment") {
    return (
      <div className="mt-5">
          {retakeCode && (
            <div className="mb-4 rounded-2xl border border-green-500/30 bg-green-950/20 p-4 text-sm text-green-200">
              <p className="font-bold text-green-300">Discount code applied</p>
              <p className="mt-1">
                Code: <span className="font-mono font-bold text-white">{retakeCode}</span>
              </p>
              <p className="mt-1 text-xs text-green-200/80">
                Your discount will be validated against your email and selected plan at checkout.
              </p>
            </div>
          )}

        <button
          onClick={startPayment}
          disabled={!!loading}
          className="w-full rounded-2xl bg-green-500 py-4 font-black text-black transition hover:bg-green-400 disabled:bg-gray-700 disabled:text-gray-400"
        >
          {loading === "payment" ? "Opening Secure Checkout..." : "Pay Now"}
        </button>

        <p className="mt-3 text-center text-xs text-gray-500">
          Secure crypto checkout powered by NOWPayments. Your account activates
          automatically after payment confirmation.
        </p>

        {error && (
          <p className="mt-4 rounded-2xl border border-red-900 bg-red-950/30 p-4 text-sm text-red-300">
            {error}
          </p>
        )}
      </div>
    );
  }

  if (accountStatus === "payout_paid") {
    return (
      <div className="mt-4 rounded-2xl border border-green-500 bg-green-900/20 p-4">
        <p className="font-semibold text-green-400">✅ Reward Paid</p>
        <p className="mt-1 text-sm text-gray-300">
          Your reward has been marked as paid.
        </p>
      </div>
    );
  }

  if (
    accountStatus === "payout_requested" ||
    accountStatus === "payout_under_review" ||
    accountStatus === "payout_approved"
  ) {
    return (
      <div className="mt-4 rounded-2xl border border-blue-500/40 bg-blue-950/20 p-4">
        <p className="font-semibold text-blue-400">Reward in Progress</p>
        <p className="mt-1 text-sm text-gray-300">
          Current reward status:{" "}
          <span className="text-white">{latestPayoutStatus || accountStatus}</span>
        </p>
      </div>
    );
  }

  if (accountStatus === "passed") {
    return (
      <div className="mt-4">
        <button
          onClick={() => postAction("request-payout")}
          disabled={!!loading}
          className="w-full rounded-2xl bg-green-500 py-4 font-black text-black transition hover:bg-green-400 disabled:bg-gray-700 disabled:text-gray-400"
        >
          {loading === "request-payout" ? "Requesting Payout..." : "Request Payout"}
        </button>

        {error && (
          <p className="mt-4 rounded-2xl border border-red-900 bg-red-950/30 p-4 text-sm text-red-300">
            {error}
          </p>
        )}
      </div>
    );
  }

  if (accountStatus === "active" && !isReady) {
    return (
      <div className="mt-5 space-y-3">
        <a
          href={`/funded/account/${accountId}/connect-broker`}
          className="block w-full rounded-2xl bg-green-500 py-4 text-center font-black text-black transition hover:bg-green-400"
        >
          Connect Trading Account
        </a>

        <p className="text-center text-xs text-gray-500">
          Submit MT4/MT5 investor access so Velmenora can verify your trading progress.
        </p>

        {error && (
          <p className="mt-4 rounded-2xl border border-red-900 bg-red-950/30 p-4 text-sm text-red-300">
            {error}
          </p>
        )}
      </div>
    );
  }

  if (accountStatus === "active" && isReady) {
    return (
      <div className="mt-4">
        <button
          onClick={() => postAction("submit-review")}
          disabled={!!loading}
          className="w-full rounded-2xl bg-green-500 py-4 font-black text-black transition hover:bg-green-400 disabled:bg-gray-700 disabled:text-gray-400"
        >
          {loading === "submit-review" ? "Submitting..." : "Submit for Review"}
        </button>

        {error && (
          <p className="mt-4 rounded-2xl border border-red-900 bg-red-950/30 p-4 text-sm text-red-300">
            {error}
          </p>
        )}
      </div>
    );
  }

  return null;
}
