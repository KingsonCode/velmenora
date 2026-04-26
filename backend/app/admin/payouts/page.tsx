"use client";

import { useEffect, useState } from "react";

type Payout = {
  id: string;
  userEmail: string;
  challengeAccountId: string;
  amount: string;
  status: string;
  requestedAt: string;
};

type PayoutDetail = {
  payout: {
    id: string;
    status: string;
    amount: string;
    requestedAt: string;
  };
  user: {
    email: string;
  };
  account: {
    id: string;
    initialBalance: string;
    currentBalance: string;
    currentEquity: string;
    tradingDaysCount: number;
  };
  snapshot: Record<string, unknown>;
  fraudFlags: Record<string, boolean>;
};

export default function AdminPayoutsPage() {
  const [data, setData] = useState<Payout[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<PayoutDetail | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [modalLoading, setModalLoading] = useState(false);

  async function getAdminToken() {
    let token = localStorage.getItem("admin_token");

    if (!token) {
      token = prompt("Enter admin token") || "";
      localStorage.setItem("admin_token", token);
    }

    return token;
  }

  async function load() {
    setLoading(true);

    const token = await getAdminToken();

    const res = await fetch("/api/admin/payouts", {
      headers: {
        "x-admin-token": token,
      },
    });

    const json = await res.json();
    setData(Array.isArray(json) ? json : []);
    setLoading(false);
  }

  async function openDetail(id: string) {
    setModalLoading(true);
    setRejectReason("");

    const token = await getAdminToken();

    const res = await fetch(`/api/admin/payouts/${id}`, {
      headers: {
        "x-admin-token": token,
      },
    });

    const json = await res.json();

    if (!res.ok) {
      alert(json.error || "Failed to load payout detail");
      setModalLoading(false);
      return;
    }

    setSelected(json);
    setModalLoading(false);
  }

  async function runAction(id: string, action: string) {
    const token = await getAdminToken();

    const res = await fetch(`/api/admin/payouts/${id}/action`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-admin-token": token,
      },
      body: JSON.stringify({ action }),
    });

    const json = await res.json();

    if (!res.ok) {
      alert(json.error || "Action failed");
      return;
    }

    await load();

    if (selected?.payout.id === id) {
      await openDetail(id);
    }
  }

  async function rejectPayout(id: string) {
    if (!rejectReason.trim()) {
      alert("Reject reason is required");
      return;
    }

    const token = await getAdminToken();

    const res = await fetch(`/api/admin/payouts/${id}/reject`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-admin-token": token,
      },
      body: JSON.stringify({ reason: rejectReason.trim() }),
    });

    const json = await res.json();

    if (!res.ok) {
      alert(json.error || "Reject failed");
      return;
    }

    setSelected(null);
    setRejectReason("");
    await load();
  }

  useEffect(() => {
    load();
  }, []);

  const hasFraudFlags =
    selected &&
    Object.values(selected.fraudFlags || {}).some((value) => value === true);

  if (loading) return <div className="p-6">Loading payouts...</div>;

  return (
    <div className="p-6">
      <button
        className="mb-4 border px-3 py-1"
        onClick={() => {
          localStorage.removeItem("admin_token");
          location.reload();
        }}
      >
        Logout
      </button>

      <h1 className="text-xl font-bold mb-4">Payout Requests</h1>

      <table className="w-full border text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 text-left">ID</th>
            <th className="p-2 text-left">User</th>
            <th className="p-2 text-left">Amount</th>
            <th className="p-2 text-left">Status</th>
            <th className="p-2 text-left">Requested</th>
            <th className="p-2 text-left">Actions</th>
          </tr>
        </thead>

        <tbody>
          {data.map((p) => (
            <tr key={p.id} className="border-t">
              <td className="p-2 font-mono">{p.id.slice(0, 8)}</td>
              <td className="p-2">{p.userEmail}</td>
              <td className="p-2">${p.amount}</td>
              <td className="p-2 font-semibold">{p.status}</td>
              <td className="p-2">
                {new Date(p.requestedAt).toLocaleString()}
              </td>

              <td className="p-2 space-x-2">
                <button
                  className="border px-2 py-1"
                  onClick={() => openDetail(p.id)}
                >
                  View
                </button>

                {p.status === "requested" && (
                  <button
                    className="border px-2 py-1"
                    onClick={() => runAction(p.id, "review")}
                  >
                    Review
                  </button>
                )}

                {p.status === "under_review" && (
                  <>
                    <button
                      className="border px-2 py-1"
                      onClick={() => runAction(p.id, "approve")}
                    >
                      Approve
                    </button>
                  </>
                )}

                {p.status === "approved" && (
                  <button
                    className="border px-2 py-1"
                    onClick={() => runAction(p.id, "pay")}
                  >
                    Mark Paid
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {modalLoading && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 border w-[720px]">
            Loading payout detail...
          </div>
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 border w-[820px] max-h-[90vh] overflow-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Payout Detail</h2>
              <button
                className="border px-2 py-1"
                onClick={() => setSelected(null)}
              >
                Close
              </button>
            </div>

            {hasFraudFlags ? (
              <div className="mb-4 border border-red-500 bg-red-50 p-3">
                <div className="font-bold text-red-700 mb-2">
                  Fraud Flags Detected
                </div>

                <ul className="list-disc pl-5 text-red-700">
                  {Object.entries(selected.fraudFlags).map(([key, value]) =>
                    value ? <li key={key}>{key}</li> : null
                  )}
                </ul>
              </div>
            ) : (
              <div className="mb-4 border border-green-500 bg-green-50 p-3 font-semibold text-green-700">
                No fraud flags detected
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
              <div>
                <strong>User:</strong> {selected.user.email}
              </div>
              <div>
                <strong>Status:</strong> {selected.payout.status}
              </div>
              <div>
                <strong>Amount:</strong> ${selected.payout.amount}
              </div>
              <div>
                <strong>Account:</strong> {selected.account.id}
              </div>
              <div>
                <strong>Initial Balance:</strong> $
                {selected.account.initialBalance}
              </div>
              <div>
                <strong>Current Balance:</strong> $
                {selected.account.currentBalance}
              </div>
              <div>
                <strong>Current Equity:</strong> $
                {selected.account.currentEquity}
              </div>
              <div>
                <strong>Trading Days:</strong>{" "}
                {selected.account.tradingDaysCount}
              </div>
            </div>

            <h3 className="font-bold mb-2">Eligibility Snapshot</h3>

            <pre className="bg-gray-100 p-3 text-xs overflow-auto mb-4">
              {JSON.stringify(selected.snapshot, null, 2)}
            </pre>

            {selected.payout.status === "requested" && (
              <button
                className="border px-3 py-1 mr-2"
                onClick={() => runAction(selected.payout.id, "review")}
              >
                Start Review
              </button>
            )}

            {selected.payout.status === "under_review" && (
              <div className="space-y-3">
                <button
                  className="border px-3 py-1 mr-2"
                  onClick={() => runAction(selected.payout.id, "approve")}
                >
                  Approve
                </button>

                <div>
                  <textarea
                    className="border w-full p-2 text-sm"
                    rows={3}
                    placeholder="Reject reason..."
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                  />

                  <button
                    className="border px-3 py-1 mt-2"
                    onClick={() => rejectPayout(selected.payout.id)}
                  >
                    Reject With Reason
                  </button>
                </div>
              </div>
            )}

            {selected.payout.status === "approved" && (
              <button
                className="border px-3 py-1"
                onClick={() => runAction(selected.payout.id, "pay")}
              >
                Mark Paid
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
