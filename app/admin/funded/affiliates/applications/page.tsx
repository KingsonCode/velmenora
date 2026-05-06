"use client";

import { useEffect, useState } from "react";
import AdminAuthGate from "../../../_components/AdminAuthGate";
import AdminNav from "../../../_components/AdminNav";
import { adminGet, adminPost } from "../_components/adminAffiliateApi";

type AffiliateApplication = {
  id?: string;
  userId?: string;
  name?: string;
  email?: string;
  status?: string;
  referralCode?: string;
  createdAt?: string;
  [key: string]: unknown;
};

function pickRows(payload: unknown): AffiliateApplication[] {
  const p = payload as any;

  if (Array.isArray(p)) return p;
  if (Array.isArray(p?.applications)) return p.applications;
  if (Array.isArray(p?.affiliateApplications)) return p.affiliateApplications;
  if (Array.isArray(p?.data)) return p.data;

  return [];
}

export default function AdminAffiliateApplicationsPage() {
  const [rows, setRows] = useState<AffiliateApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [busyId, setBusyId] = useState<string>("");

  async function load() {
    setLoading(true);
    setError("");

    const result = await adminGet<unknown>("admin/affiliate/applications");

    if (!result.ok) {
      setError(result.error || "Failed to load applications");
      setRows([]);
    } else {
      setRows(pickRows(result.raw));
    }

    setLoading(false);
  }

  async function action(id: string, actionName: "approve" | "reject") {
    setBusyId(id);
    setError("");

    const result = await adminPost(
      `admin/affiliate/applications/${id}/${actionName}`,
      {}
    );

    if (!result.ok) {
      setError(result.error || `Failed to ${actionName}`);
    }

    await load();
    setBusyId("");
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <AdminAuthGate>
      <main className="min-h-screen bg-slate-950 px-6 py-8 text-slate-100">
      <section className="mx-auto max-w-7xl">
        <AdminNav />
        <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-cyan-300">
              Velmenora Admin
            </p>
            <h1 className="text-3xl font-bold">Affiliate Applications</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-400">
              Review new affiliate applicants. Actions are sent through the
              server-side admin proxy only.
            </p>
          </div>

          <button
            onClick={load}
            className="rounded-xl border border-slate-700 px-4 py-2 text-sm font-semibold hover:bg-slate-900"
          >
            Refresh
          </button>
        </div>

        {error ? (
          <div className="mb-4 rounded-xl border border-red-500/40 bg-red-950/30 p-4 text-sm text-red-200">
            {error}
          </div>
        ) : null}

        <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="bg-slate-900 text-xs uppercase tracking-wide text-slate-400">
              <tr>
                <th className="px-4 py-3">Applicant</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Referral Code</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Created</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td className="px-4 py-6 text-slate-400" colSpan={6}>
                    Loading applications...
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td className="px-4 py-6 text-slate-400" colSpan={6}>
                    No affiliate applications found.
                  </td>
                </tr>
              ) : (
                rows.map((row, index) => {
                  const id = String(row.id ?? row.userId ?? index);
                  const status = String(row.status ?? "unknown");

                  return (
                    <tr key={id} className="border-t border-slate-800">
                      <td className="px-4 py-4 font-medium">
                        {String(row.name ?? "Unknown")}
                      </td>
                      <td className="px-4 py-4 text-slate-300">
                        {String(row.email ?? "—")}
                      </td>
                      <td className="px-4 py-4 text-slate-300">
                        {String(row.referralCode ?? "—")}
                      </td>
                      <td className="px-4 py-4">
                        <span className="rounded-full border border-cyan-500/30 bg-cyan-950/30 px-3 py-1 text-xs text-cyan-200">
                          {status.replaceAll("_", " ")}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-slate-400">
                        {row.createdAt
                          ? new Date(String(row.createdAt)).toLocaleString()
                          : "—"}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            disabled={busyId === id}
                            onClick={() => action(id, "approve")}
                            className="rounded-lg bg-emerald-500 px-3 py-2 text-xs font-bold text-slate-950 disabled:opacity-50"
                          >
                            Approve
                          </button>
                          <button
                            disabled={busyId === id}
                            onClick={() => action(id, "reject")}
                            className="rounded-lg bg-red-500 px-3 py-2 text-xs font-bold text-white disabled:opacity-50"
                          >
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
    </AdminAuthGate>
  );
}
