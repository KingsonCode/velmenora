"use client";

import { useState } from "react";

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
    }

    setLoading(null);
  }

  if (accountStatus === "payout_paid") {
    return (
      <div className="mt-4 rounded-xl border border-green-500 bg-green-900/20 p-4">
        <p className="text-green-400 font-semibold">✅ Payout Paid</p>
        <p className="text-sm text-gray-300 mt-1">
          Your reward payout has been marked as paid.
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
      <div className="mt-4 rounded-xl border border-blue-500/40 bg-blue-950/20 p-4">
        <p className="text-blue-400 font-semibold">Payout in Progress</p>
        <p className="text-sm text-gray-300 mt-1">
          Current payout status:{" "}
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
          className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-700 disabled:text-gray-400 py-3 rounded-xl font-semibold text-black transition"
        >
          {loading === "request-payout" ? "Requesting Payout..." : "Request Payout"}
        </button>

        {error && (
          <p className="mt-3 text-sm text-red-400 border border-red-900 bg-red-950/30 rounded-lg p-3">
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
          className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-700 disabled:text-gray-400 py-3 rounded-xl font-semibold text-black transition"
        >
          {loading === "submit-review" ? "Submitting..." : "Submit for Review"}
        </button>

        {error && (
          <p className="mt-3 text-sm text-red-400 border border-red-900 bg-red-950/30 rounded-lg p-3">
            {error}
          </p>
        )}
      </div>
    );
  }

  return null;
}
