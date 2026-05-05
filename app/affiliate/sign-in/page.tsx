"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type AuthState = "checking" | "guest" | "member";

function messageFrom(value: unknown, fallback: string) {
  if (value instanceof Error) return value.message;
  return fallback;
}

export default function AffiliateSignInPage() {
  const router = useRouter();

  const [authState, setAuthState] = useState<AuthState>("checking");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function routeMember() {
    const affiliateRes = await fetch("/api/funded/affiliate/me", {
      credentials: "include",
      cache: "no-store",
    });

    if (!affiliateRes.ok) {
      router.push("/affiliate/apply");
      return;
    }

    const affiliate = await affiliateRes.json().catch(() => null);

    if (affiliate?.approved) {
      router.push("/affiliate/dashboard");
      return;
    }

    router.push("/affiliate/apply");
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
    setStatus("You are already signed in. Checking affiliate access...");
    await routeMember();
  }

  useEffect(() => {
    checkSession().catch(() => setAuthState("guest"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function signIn(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
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

      setAuthState("member");
      setStatus("Signed in. Opening your affiliate area...");
      await routeMember();
    } catch (err: unknown) {
      setStatus(messageFrom(err, "Sign in failed."));
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <section className="mx-auto max-w-xl">
        <Link href="/affiliate" className="text-sm text-emerald-300 hover:underline">
          ← Affiliate Program
        </Link>

        <h1 className="mt-6 text-4xl font-black">Affiliate Sign In</h1>
        <p className="mt-3 text-slate-300">
          Sign in to open your affiliate dashboard. If you are not approved yet, we will
          take you to the application page.
        </p>

        {authState === "checking" && (
          <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.03] p-6 text-slate-300">
            Checking your session...
          </div>
        )}

        {authState !== "checking" && (
          <form
            onSubmit={signIn}
            className="mt-8 space-y-5 rounded-3xl border border-white/10 bg-white/[0.03] p-6"
          >
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
              {busy ? "Signing in..." : "Sign In & Open Affiliate Area"}
            </button>

            <div className="flex flex-wrap gap-4 text-sm">
              <Link href="/forgot-password" className="text-slate-300 hover:underline">
                Forgot password?
              </Link>
              <Link href="/affiliate/apply" className="text-emerald-300 hover:underline">
                Apply as affiliate
              </Link>
            </div>

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
