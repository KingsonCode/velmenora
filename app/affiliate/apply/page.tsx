"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";

type AuthState = "checking" | "guest" | "member";

type AffiliateMe = {
  ok?: boolean;
  approved?: boolean;
  application?: {
    status?: string;
    rejectionReason?: string | null;
  } | null;
  affiliate?: {
    affiliateCode?: string;
  } | null;
};

function getErrorMessage(value: unknown, fallback: string) {
  if (value instanceof Error) return value.message;
  return fallback;
}

export default function AffiliateApplyPage() {
  const [authState, setAuthState] = useState<AuthState>("checking");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [displayName, setDisplayName] = useState("");
  const [audience, setAudience] = useState("");
  const [reason, setReason] = useState("");
  const [channels, setChannels] = useState({
    tiktok: "",
    instagram: "",
    youtube: "",
    whatsapp: "",
    website: "",
  });

  const [affiliateMe, setAffiliateMe] = useState<AffiliateMe | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [loginBusy, setLoginBusy] = useState(false);

  async function loadState() {
    setStatus(null);

    const authRes = await fetch("/api/auth/me", {
      credentials: "include",
      cache: "no-store",
    });

    if (!authRes.ok) {
      setAuthState("guest");
      setAffiliateMe(null);
      return;
    }

    setAuthState("member");

    const affiliateRes = await fetch("/api/funded/affiliate/me", {
      credentials: "include",
      cache: "no-store",
    });

    if (affiliateRes.ok) {
      const data = await affiliateRes.json();
      setAffiliateMe(data);
    }
  }

  useEffect(() => {
    loadState().catch(() => {
      setAuthState("guest");
    });
  }, []);

  async function signIn(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoginBusy(true);
    setStatus(null);

    try {
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(data?.message || data?.error || "Sign in failed");
      }

      setStatus("Signed in successfully. Loading affiliate application...");
      await loadState();
    } catch (err: unknown) {
      setStatus(getErrorMessage(err, "Sign in failed."));
    } finally {
      setLoginBusy(false);
    }
  }

  function updateChannel(key: keyof typeof channels, value: string) {
    setChannels((current) => ({ ...current, [key]: value }));
  }

  async function submitApplication(e: FormEvent<HTMLFormElement>) {
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
          channels,
        }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok || !data?.ok) {
        if (res.status === 401) {
          setAuthState("guest");
          throw new Error("Please sign in before applying.");
        }

        throw new Error(data?.message || data?.error || "Application failed");
      }

      setStatus(
        data.alreadyApproved
          ? "You are already approved. Open your affiliate dashboard."
          : "Application submitted. Admin review is pending."
      );

      await loadState();
    } catch (err: unknown) {
      setStatus(getErrorMessage(err, "Failed to submit application."));
    } finally {
      setBusy(false);
    }
  }

  const applicationStatus = affiliateMe?.application?.status;
  const approved = Boolean(affiliateMe?.approved);

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <section className="mx-auto max-w-3xl">
        <Link href="/affiliate" className="text-sm text-emerald-300 hover:underline">
          ← Affiliate Program
        </Link>

        <h1 className="mt-6 text-4xl font-black">Apply to become an affiliate</h1>
        <p className="mt-3 text-slate-300">
          Sign in first, then this page will open the affiliate request form. Referral links are issued only after approval.
        </p>

        {authState === "checking" && (
          <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.03] p-6">
            Checking your session...
          </div>
        )}

        {authState === "guest" && (
          <form
            onSubmit={signIn}
            className="mt-8 space-y-5 rounded-3xl border border-white/10 bg-white/[0.03] p-6"
          >
            <div>
              <h2 className="text-2xl font-black">Sign in to continue</h2>
              <p className="mt-2 text-slate-400">
                Sign in with your Velmenora account to open the affiliate request form.
              </p>
            </div>

            <label className="block">
              <span className="text-sm font-semibold text-slate-200">Email</span>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 outline-none focus:border-emerald-300"
                placeholder="you@example.com"
                type="email"
                autoComplete="email"
                required
              />
            </label>

            <label className="block">
              <span className="text-sm font-semibold text-slate-200">Password</span>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 outline-none focus:border-emerald-300"
                placeholder="Your password"
                type="password"
                autoComplete="current-password"
                required
              />
            </label>

            <button
              disabled={loginBusy}
              className="w-full rounded-2xl bg-emerald-400 px-6 py-4 font-black text-slate-950 disabled:opacity-60"
            >
              {loginBusy ? "Signing in..." : "Sign In to Submit Affiliate Request"}
            </button>

            <div className="flex flex-wrap gap-4 text-sm">
              <Link href="/sign-in" className="text-emerald-300 hover:underline">
                Open sign-in page
              </Link>
              <Link href="/forgot-password" className="text-slate-300 hover:underline">
                Forgot password?
              </Link>
              <Link href="/affiliate" className="text-slate-300 hover:underline">
                Back to affiliate program
              </Link>
            </div>

            {status && (
              <div className="rounded-2xl border border-white/10 bg-slate-900 p-4 text-sm text-slate-200">
                {status}
              </div>
            )}
          </form>
        )}

        {authState === "member" && approved && (
          <div className="mt-8 rounded-3xl border border-emerald-400/20 bg-emerald-400/10 p-6">
            <h2 className="text-2xl font-black">You are already approved</h2>
            <p className="mt-2 text-slate-300">
              Your affiliate code is active. Open your dashboard to copy your referral link.
            </p>
            <Link
              href="/affiliate/dashboard"
              className="mt-5 inline-block rounded-2xl bg-emerald-400 px-6 py-3 font-black text-slate-950"
            >
              Open Affiliate Dashboard
            </Link>
          </div>
        )}

        {authState === "member" && !approved && applicationStatus === "pending" && (
          <div className="mt-8 rounded-3xl border border-yellow-400/20 bg-yellow-400/10 p-6">
            <h2 className="text-2xl font-black">Application under review</h2>
            <p className="mt-2 text-slate-300">
              Your affiliate application has been submitted. Admin review is pending.
            </p>
          </div>
        )}

        {authState === "member" && !approved && applicationStatus === "rejected" && (
          <div className="mt-8 rounded-3xl border border-red-400/20 bg-red-400/10 p-6">
            <h2 className="text-2xl font-black">Application rejected</h2>
            <p className="mt-2 text-slate-300">
              {affiliateMe?.application?.rejectionReason ||
                "Your application was not approved. You may update your details and submit again."}
            </p>
          </div>
        )}

        {authState === "member" && !approved && applicationStatus !== "pending" && (
          <form
            onSubmit={submitApplication}
            className="mt-8 space-y-5 rounded-3xl border border-white/10 bg-white/[0.03] p-6"
          >
            <label className="block">
              <span className="text-sm font-semibold text-slate-200">Display name</span>
              <input
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 outline-none focus:border-emerald-300"
                placeholder="Your public partner name"
                required
              />
            </label>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="block">
                <span className="text-sm font-semibold text-slate-200">TikTok / Short-form</span>
                <input
                  value={channels.tiktok}
                  onChange={(e) => updateChannel("tiktok", e.target.value)}
                  className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 outline-none focus:border-emerald-300"
                  placeholder="@velmenora"
                />
              </label>

              <label className="block">
                <span className="text-sm font-semibold text-slate-200">Instagram</span>
                <input
                  value={channels.instagram}
                  onChange={(e) => updateChannel("instagram", e.target.value)}
                  className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 outline-none focus:border-emerald-300"
                  placeholder="@velmenora"
                />
              </label>

              <label className="block">
                <span className="text-sm font-semibold text-slate-200">YouTube</span>
                <input
                  value={channels.youtube}
                  onChange={(e) => updateChannel("youtube", e.target.value)}
                  className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 outline-none focus:border-emerald-300"
                  placeholder="@VelmenoraOfficial"
                />
              </label>

              <label className="block">
                <span className="text-sm font-semibold text-slate-200">WhatsApp / Community</span>
                <input
                  value={channels.whatsapp}
                  onChange={(e) => updateChannel("whatsapp", e.target.value)}
                  className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 outline-none focus:border-emerald-300"
                  placeholder="+255700000000 or group name"
                />
              </label>
            </div>

            <label className="block">
              <span className="text-sm font-semibold text-slate-200">Website / Blog</span>
              <input
                value={channels.website}
                onChange={(e) => updateChannel("website", e.target.value)}
                className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 outline-none focus:border-emerald-300"
                placeholder="https://www.example.com"
                type="url"
              />
            </label>

            <label className="block">
              <span className="text-sm font-semibold text-slate-200">Audience / channel</span>
              <textarea
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                className="mt-2 min-h-28 w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 outline-none focus:border-emerald-300"
                placeholder="Example: TikTok traders, WhatsApp forex group, blog traffic..."
                required
              />
            </label>

            <label className="block">
              <span className="text-sm font-semibold text-slate-200">
                Why should we approve you?
              </span>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="mt-2 min-h-28 w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 outline-none focus:border-emerald-300"
                placeholder="Explain your traffic source and promotion plan."
                required
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
        )}
      </section>
    </main>
  );
}
