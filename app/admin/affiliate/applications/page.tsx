"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

type AffiliateApplication = {
  id: string;
  userId: string;
  status: "pending" | "approved" | "rejected" | string;
  displayName?: string | null;
  audience?: string | null;
  reason?: string | null;
  rejectionReason?: string | null;
  reviewedAt?: string | null;
  createdAt?: string | null;
  user?: {
    id?: string;
    email?: string;
    fullName?: string | null;
    role?: string;
    isActive?: boolean;
  };
};

function statusClass(status: string) {
  if (status === "approved") return "border-emerald-400/25 bg-emerald-400/10 text-emerald-300";
  if (status === "rejected") return "border-red-400/25 bg-red-400/10 text-red-300";
  return "border-yellow-400/25 bg-yellow-400/10 text-yellow-300";
}

function prettyDate(value?: string | null) {
  if (!value) return "—";
  try {
    return new Date(value).toLocaleString();
  } catch {
    return value;
  }
}

export default function AdminAffiliateApplicationsPage() {
  const [adminKey, setAdminKey] = useState("");
  const [applications, setApplications] = useState<AffiliateApplication[]>([]);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [commissionRate, setCommissionRate] = useState("20");
  const [rejectReasons, setRejectReasons] = useState<Record<string, string>>({});

  useEffect(() => {
    const saved = window.sessionStorage.getItem("velmenora_admin_key") || "";
    setAdminKey(saved);
  }, []);

  const grouped = useMemo(() => {
    return {
      pending: applications.filter((app) => app.status === "pending"),
      approved: applications.filter((app) => app.status === "approved"),
      rejected: applications.filter((app) => app.status === "rejected"),
      other: applications.filter(
        (app) => !["pending", "approved", "rejected"].includes(app.status),
      ),
    };
  }, [applications]);

  async function loadApplications(e?: FormEvent) {
    e?.preventDefault();

    if (!adminKey.trim()) {
      setStatus("Enter ADMIN_API_KEY first.");
      return;
    }

    window.sessionStorage.setItem("velmenora_admin_key", adminKey.trim());
    setLoading(true);
    setStatus("Loading applications...");

    try {
      const res = await fetch("/api/funded/admin/affiliate/applications", {
        headers: {
          "x-admin-secret": adminKey.trim(),
        },
        cache: "no-store",
      });

      const data = await res.json().catch(() => null);

      if (!res.ok || !data?.ok) {
        throw new Error(data?.message || data?.error || "Failed to load applications");
      }

      setApplications(data.applications || []);
      setStatus(`Loaded ${(data.applications || []).length} applications.`);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Failed to load applications");
    } finally {
      setLoading(false);
    }
  }

  async function approve(id: string) {
    if (!adminKey.trim()) {
      setStatus("ADMIN_API_KEY is required.");
      return;
    }

    setLoading(true);
    setStatus("Approving application...");

    try {
      const res = await fetch(`/api/funded/admin/affiliate/applications/${id}/approve`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-secret": adminKey.trim(),
        },
        body: JSON.stringify({
          commissionRatePct: Number(commissionRate || 20),
        }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok || !data?.ok) {
        throw new Error(data?.message || data?.error || "Failed to approve application");
      }

      setStatus(
        `Approved. Code: ${data?.affiliate?.affiliateCode || "created"}. Approval email attempted.`,
      );
      await loadApplications();
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Failed to approve application");
    } finally {
      setLoading(false);
    }
  }

  async function reject(id: string) {
    if (!adminKey.trim()) {
      setStatus("ADMIN_API_KEY is required.");
      return;
    }

    const reason = rejectReasons[id]?.trim();
    if (!reason) {
      setStatus("Enter a rejection reason first.");
      return;
    }

    setLoading(true);
    setStatus("Rejecting application...");

    try {
      const res = await fetch(`/api/funded/admin/affiliate/applications/${id}/reject`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-secret": adminKey.trim(),
        },
        body: JSON.stringify({ reason }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok || !data?.ok) {
        throw new Error(data?.message || data?.error || "Failed to reject application");
      }

      setStatus("Application rejected.");
      await loadApplications();
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Failed to reject application");
    } finally {
      setLoading(false);
    }
  }

  function ApplicationCard({ app }: { app: AffiliateApplication }) {
    return (
      <article className="rounded-3xl border border-white/10 bg-white/[0.035] p-5">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <h3 className="text-xl font-black">
              {app.displayName || app.user?.fullName || app.user?.email || "Affiliate applicant"}
            </h3>
            <p className="mt-1 text-sm text-slate-400">{app.user?.email || "No email"}</p>
          </div>

          <span className={`w-fit rounded-full border px-3 py-1 text-xs font-black uppercase ${statusClass(app.status)}`}>
            {app.status}
          </span>
        </div>

        <div className="mt-4 grid gap-3 text-sm md:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
            <p className="font-black text-slate-300">Audience</p>
            <p className="mt-2 leading-6 text-slate-400">{app.audience || "—"}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
            <p className="font-black text-slate-300">Reason</p>
            <p className="mt-2 leading-6 text-slate-400">{app.reason || "—"}</p>
          </div>
        </div>

        <div className="mt-4 grid gap-3 text-xs text-slate-500 md:grid-cols-3">
          <p>User ID: {app.userId}</p>
          <p>Created: {prettyDate(app.createdAt)}</p>
          <p>Reviewed: {prettyDate(app.reviewedAt)}</p>
        </div>

        {app.rejectionReason && (
          <div className="mt-4 rounded-2xl border border-red-400/20 bg-red-400/10 p-4 text-sm text-red-200">
            {app.rejectionReason}
          </div>
        )}

        {app.status === "pending" && (
          <div className="mt-5 grid gap-3 border-t border-white/10 pt-5">
            <div className="flex flex-col gap-3 md:flex-row">
              <label className="block md:w-48">
                <span className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">
                  Commission %
                </span>
                <input
                  value={commissionRate}
                  onChange={(e) => setCommissionRate(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 outline-none focus:border-emerald-300"
                  type="number"
                  min="0"
                  max="80"
                />
              </label>

              <button
                onClick={() => approve(app.id)}
                disabled={loading}
                className="self-end rounded-2xl bg-emerald-400 px-6 py-3 font-black text-black disabled:opacity-60"
              >
                Approve
              </button>
            </div>

            <div className="flex flex-col gap-3 md:flex-row">
              <input
                value={rejectReasons[app.id] || ""}
                onChange={(e) =>
                  setRejectReasons((current) => ({
                    ...current,
                    [app.id]: e.target.value,
                  }))
                }
                className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 outline-none focus:border-red-300"
                placeholder="Rejection reason"
              />
              <button
                onClick={() => reject(app.id)}
                disabled={loading}
                className="rounded-2xl border border-red-400/30 px-6 py-3 font-black text-red-300 disabled:opacity-60"
              >
                Reject
              </button>
            </div>
          </div>
        )}
      </article>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <section className="mx-auto max-w-6xl">
        <div className="rounded-[2rem] border border-emerald-400/20 bg-emerald-400/10 p-8">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-emerald-300">
            Velmenora Admin
          </p>
          <h1 className="mt-4 text-4xl font-black md:text-6xl">
            Affiliate Applications
          </h1>
          <p className="mt-4 max-w-3xl leading-7 text-slate-300">
            Review affiliate applicants, approve trusted partners, reject weak or risky
            submissions, and trigger approval notifications.
          </p>
        </div>

        <form
          onSubmit={loadApplications}
          className="mt-6 rounded-3xl border border-white/10 bg-white/[0.035] p-5"
        >
          <label className="block">
            <span className="text-sm font-black text-slate-300">Admin API Key</span>
            <input
              value={adminKey}
              onChange={(e) => setAdminKey(e.target.value)}
              className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 outline-none focus:border-emerald-300"
              placeholder="Paste ADMIN_API_KEY"
              type="password"
            />
          </label>

          <button
            disabled={loading}
            className="mt-4 rounded-2xl bg-emerald-400 px-6 py-3 font-black text-black disabled:opacity-60"
          >
            {loading ? "Working..." : "Load Applications"}
          </button>

          {status && (
            <div className="mt-4 rounded-2xl border border-white/10 bg-slate-900 p-4 text-sm text-slate-200">
              {status}
            </div>
          )}
        </form>

        <div className="mt-6 grid gap-3 md:grid-cols-4">
          <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
            <p className="text-sm text-slate-400">Pending</p>
            <p className="mt-1 text-3xl font-black">{grouped.pending.length}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
            <p className="text-sm text-slate-400">Approved</p>
            <p className="mt-1 text-3xl font-black">{grouped.approved.length}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
            <p className="text-sm text-slate-400">Rejected</p>
            <p className="mt-1 text-3xl font-black">{grouped.rejected.length}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
            <p className="text-sm text-slate-400">Total</p>
            <p className="mt-1 text-3xl font-black">{applications.length}</p>
          </div>
        </div>

        <div className="mt-8 space-y-5">
          {applications.length === 0 ? (
            <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-8 text-slate-400">
              No applications loaded yet.
            </div>
          ) : (
            applications.map((app) => <ApplicationCard key={app.id} app={app} />)
          )}
        </div>
      </section>
    </main>
  );
}
