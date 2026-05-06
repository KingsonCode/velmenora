"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type AuthState = "checking" | "guest" | "member";
type AccessState = "unknown" | "approved" | "pending" | "not_applied" | "rejected";

function messageFrom(value: unknown, fallback: string) {
  if (value instanceof Error) return value.message;
  return fallback;
}

function StatusPill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-black uppercase tracking-[0.22em] text-emerald-300">
      {children}
    </span>
  );
}

function InfoRow({ step, title, body }: { step: string; title: string; body: string }) {
  return (
    <div className="flex gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-400 text-sm font-black text-slate-950">
        {step}
      </div>
      <div>
        <p className="font-black text-white">{title}</p>
        <p className="mt-1 text-sm leading-6 text-slate-400">{body}</p>
      </div>
    </div>
  );
}

export default function AffiliateSignInPage() {
  const router = useRouter();

  const [authState, setAuthState] = useState<AuthState>("checking");
  const [accessState, setAccessState] = useState<AccessState>("unknown");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [status, setStatus] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function checkAffiliateAccess() {
    const affiliateRes = await fetch("/api/funded/affiliate/me", {
      credentials: "include",
      cache: "no-store",
    });

    if (!affiliateRes.ok) {
      setAccessState("not_applied");
      setStatus("This member account does not have an approved affiliate profile yet.");
      return;
    }

    const affiliate = await affiliateRes.json().catch(() => null);

    if (affiliate?.approved) {
      setAccessState("approved");
      setStatus("Affiliate account found. Opening your dashboard...");
      router.push("/affiliate/dashboard");
      return;
    }

    const appStatus = affiliate?.application?.status;

    if (appStatus === "pending") {
      setAccessState("pending");
      setStatus("Your affiliate application is still under admin review.");
      return;
    }

    if (appStatus === "rejected") {
      setAccessState("rejected");
      setStatus(
        affiliate?.application?.rejectionReason ||
          "Your affiliate application was not approved. You may apply again with better details."
      );
      return;
    }

    setAccessState("not_applied");
    setStatus("Apply first. Admin approval will unlock your affiliate dashboard and referral link.");
  }

  async function checkSession() {
    const res = await fetch("/api/auth/me", {
      credentials: "include",
      cache: "no-store",
    });

    if (!res.ok) {
      setAuthState("guest");
      return;
    }

    setAuthState("member");
    setStatus("Signed in. Checking your affiliate access...");
    await checkAffiliateAccess();
  }

  useEffect(() => {
    checkSession().catch(() => setAuthState("guest"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function signIn(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setStatus(null);
    setAccessState("unknown");

    try {
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(data?.message || data?.error || "Sign in failed. Check your email and password.");
      }

      setAuthState("member");
      setStatus("Signed in. Checking your affiliate access...");
      await checkAffiliateAccess();
    } catch (err: unknown) {
      setStatus(messageFrom(err, "Sign in failed."));
    } finally {
      setBusy(false);
    }
  }

  const statusTitle =
    accessState === "pending"
      ? "Application under review"
      : accessState === "rejected"
        ? "Application not approved"
        : "No approved affiliate dashboard yet";

  const statusTone =
    accessState === "pending"
      ? "border-yellow-400/25 bg-yellow-400/10"
      : accessState === "rejected"
        ? "border-red-400/25 bg-red-400/10"
        : "border-emerald-400/20 bg-emerald-400/10";

  return (
    <main className="min-h-screen bg-slate-950 pt-28 text-white sm:pt-32">
      <section className="mx-auto grid max-w-6xl gap-10 px-6 pb-16 lg:grid-cols-[1fr_0.9fr] lg:items-start">
        <div>
          <Link href="/affiliate" className="text-sm font-semibold text-emerald-300 hover:underline">
            ← Affiliate Program
          </Link>

          <div className="mt-8">
            <StatusPill>Secure Affiliate Access</StatusPill>

            <h1 className="mt-5 text-5xl font-black leading-tight md:text-6xl">
              Affiliate Sign In
            </h1>

            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
              Sign in to open your affiliate dashboard. If your account is still pending
              or not yet approved, you will see the correct next step instead of a blocked dashboard.
            </p>
          </div>

          <div className="mt-8 grid gap-3">
            <InfoRow
              step="1"
              title="Sign in with your Velmenora account"
              body="Sign in with your Velmenora member account. If you are not registered yet, create an account first."
            />
            <InfoRow
              step="2"
              title="We verify your affiliate status"
              body="Approved affiliates go directly to the dashboard. Pending users see review status."
            />
            <InfoRow
              step="3"
              title="Approved partners get referral links"
              body="Your code and payout tools appear only after admin approval."
            />
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-6 shadow-2xl shadow-black/20">
          {authState === "checking" && (
            <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-6 text-slate-300">
              Checking your session...
            </div>
          )}

          {authState === "guest" && (
            <form onSubmit={signIn} className="space-y-5">
              <div>
                <h2 className="text-2xl font-black">Open affiliate area</h2>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Already have a Velmenora account? Sign in below. New users should create a member account first.
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
                disabled={busy}
                className="w-full rounded-2xl bg-emerald-400 px-6 py-4 font-black text-slate-950 disabled:opacity-60"
              >
                {busy ? "Signing in..." : "Sign In & Check Access"}
              </button>

              <div className="grid gap-3 sm:grid-cols-2">
                <Link
                  href="/affiliate/apply"
                  className="rounded-2xl border border-emerald-400/30 bg-emerald-400/10 px-5 py-3 text-center font-black text-emerald-300 hover:bg-emerald-400/15"
                >
                  Apply as Affiliate
                </Link>

                <Link
                  href="/forgot-password"
                  className="rounded-2xl border border-white/10 px-5 py-3 text-center font-black text-slate-300 hover:bg-white/10"
                >
                  Forgot Password
                </Link>
              </div>

              {status && (
                <div className="rounded-2xl border border-white/10 bg-slate-900 p-4 text-sm text-slate-200">
                  {status}
                </div>
              )}
            </form>
          )}

          {authState === "member" && accessState !== "approved" && (
            <div className={`rounded-3xl border p-7 sm:p-8 ${statusTone}`}>
              <p className="text-xs font-black uppercase tracking-[0.24em] text-slate-400">
                Affiliate Status
              </p>

              <h2 className="mt-3 text-3xl font-black">{statusTitle}</h2>

              <p className="mt-5 max-w-3xl leading-8 text-slate-300">
                {status ||
                  "This account does not have an approved affiliate profile yet. Apply first, then admin approval will unlock the dashboard."}
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <Link
                  href="/affiliate/apply"
                  className="rounded-2xl bg-emerald-400 px-5 py-3 text-center font-black text-slate-950 hover:bg-emerald-300"
                >
                  {accessState === "pending" ? "View Application" : "Apply as Affiliate"}
                </Link>

                <Link
                  href="/member"
                  className="rounded-2xl border border-white/15 px-5 py-3 text-center font-black text-white hover:bg-white/10"
                >
                  View Member Area
                </Link>
              </div>

              <div className="mt-8 rounded-2xl border border-white/10 bg-black/25 p-5 text-sm leading-7 text-slate-300">
                Approved affiliates receive a referral code, tracking link, commission stats,
                and payout request access inside the dashboard.
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
