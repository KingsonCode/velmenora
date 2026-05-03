"use client";

import { useState } from "react";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      let data: any = null;

      try {
        data = await res.json();
      } catch {
        throw new Error("Invalid server response");
      }

      if (!res.ok || data?.ok === false) {
        throw new Error(data?.message || data?.error || "Invalid email or password");
      }

      window.location.href = "/member";
    } catch (err: any) {
      setError(err.message || "Sign in failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-black px-6 py-16 text-white">
      <section className="mx-auto max-w-md rounded-[2rem] border border-white/10 bg-white/[0.03] p-8">
        <p className="text-sm font-black uppercase tracking-[0.25em] text-green-400">
          Member Sign In
        </p>

        <h1 className="mt-3 text-4xl font-black">Access your account</h1>

        <p className="mt-3 text-sm text-gray-400">
          Sign in to view your funded challenges, broker verification, metrics, and payout status.
        </p>

        <form onSubmit={submit} className="mt-7 space-y-4">
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-300">
              Email
            </label>
            <input
              type="email"
              value={email}
              disabled={loading}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-black px-4 py-4 outline-none transition focus:border-green-500 disabled:opacity-60"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-300">
              Password
            </label>
            <input
              type="password"
              value={password}
              disabled={loading}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-black px-4 py-4 outline-none transition focus:border-green-500 disabled:opacity-60"
              required
            />
          </div>

          {error && (
            <div className="rounded-2xl border border-red-900 bg-red-950/30 p-4 text-sm text-red-300">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !email || !password}
            className="w-full rounded-2xl bg-green-500 py-4 font-black text-black transition hover:bg-green-400 disabled:bg-gray-700 disabled:text-gray-400"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <p className="mt-5 text-center text-xs text-gray-500">
          New here? Start from a funded challenge plan and create your account during application.
        </p>

        <a
          href="/funded"
          className="mt-4 block rounded-2xl border border-white/10 px-5 py-3 text-center font-bold text-white transition hover:border-green-500 hover:text-green-400"
        >
          View Funded Challenges
        </a>
      </section>
    </main>
  );
}
