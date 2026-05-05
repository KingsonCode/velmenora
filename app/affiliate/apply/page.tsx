"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

export default function AffiliateApplyPage() {
  const [displayName, setDisplayName] = useState("");
  const [audience, setAudience] = useState("");
  const [reason, setReason] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setStatus(null);

    try {
      const res = await fetch("/api/funded/affiliate/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          displayName,
          audience,
          reason,
          channels: {
            website: "",
            tiktok: "",
            instagram: "",
            whatsapp: "",
            youtube: "",
          },
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.ok) {
        throw new Error(data.message || data.reason || "Application failed");
      }

      setStatus(
        data.alreadyApproved
          ? "You are already approved. Open your dashboard."
          : "Application submitted. Admin review is pending."
      );
    } catch (err: any) {
      setStatus(err?.message || "Failed to submit application.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <section className="mx-auto max-w-3xl">
        <Link href="/affiliate" className="text-sm text-emerald-300 hover:underline">
          ← Affiliate Program
        </Link>

        <h1 className="mt-6 text-4xl font-black">Apply to become an affiliate</h1>
        <p className="mt-3 text-slate-300">
          This page is for logged-in members. Applications are reviewed before dashboard
          and payout access are enabled.
        </p>

        <form onSubmit={submit} className="mt-8 space-y-5 rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <label className="block">
            <span className="text-sm font-semibold text-slate-200">Display name</span>
            <input
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 outline-none focus:border-emerald-300"
              placeholder="Your public partner name"
            />
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-slate-200">Audience / channel</span>
            <textarea
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
              className="mt-2 min-h-28 w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 outline-none focus:border-emerald-300"
              placeholder="Example: TikTok traders, WhatsApp forex group, blog traffic..."
            />
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-slate-200">Why should we approve you?</span>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="mt-2 min-h-28 w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 outline-none focus:border-emerald-300"
              placeholder="Explain your traffic source and promotion plan."
            />
          </label>

          <button
            disabled={busy}
            className="w-full rounded-2xl bg-emerald-400 px-6 py-4 font-black text-slate-950 disabled:opacity-60"
          >
            {busy ? "Submitting..." : "Submit Application"}
          </button>

          {status && (
            <div className="rounded-2xl border border-white/10 bg-slate-900 p-4 text-sm text-slate-200">
              {status}
            </div>
          )}
        </form>
      </section>
    </main>
  );
}
