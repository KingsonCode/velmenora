"use client";

import { useState } from "react";

function nextUrl() {
  if (typeof window === "undefined") return "/member";
  const next = new URLSearchParams(window.location.search).get("next");
  if (!next || !next.startsWith("/") || next.startsWith("//")) return "/member";
  return next;
}

export default function SignUpPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ fullName, email, phone, password }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok || data?.ok === false) {
        throw new Error(data?.message || data?.error || "Account creation failed");
      }

      window.location.href = nextUrl();
    } catch (err: any) {
      setError(err.message || "Account creation failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-black px-6 py-16 text-white">
      <section className="mx-auto max-w-md rounded-[2rem] border border-white/10 bg-white/[0.03] p-8">
        <p className="text-sm font-black uppercase tracking-[0.25em] text-green-400">
          Create Account
        </p>

        <h1 className="mt-3 text-4xl font-black">Create your Velmenora account</h1>

        <p className="mt-3 text-sm leading-6 text-gray-400">
          Use one account for funded challenges, affiliate applications, dashboard access,
          and payouts.
        </p>

        <form onSubmit={submit} className="mt-7 space-y-4">
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-300">
              Full name
            </label>
            <input
              value={fullName}
              disabled={loading}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-black px-4 py-4 outline-none transition focus:border-green-500 disabled:opacity-60"
              placeholder="Your full name"
              required
            />
          </div>

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
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-300">
              Phone / WhatsApp optional
            </label>
            <input
              value={phone}
              disabled={loading}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-black px-4 py-4 outline-none transition focus:border-green-500 disabled:opacity-60"
              placeholder="+255700000000"
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
              placeholder="Minimum 8 characters"
              required
              minLength={8}
            />
          </div>

          {error && (
            <div className="rounded-2xl border border-red-900 bg-red-950/30 p-4 text-sm text-red-300">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !fullName || !email || password.length < 8}
            className="w-full rounded-2xl bg-green-500 py-4 font-black text-black transition hover:bg-green-400 disabled:bg-gray-700 disabled:text-gray-400"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-gray-400">
          Already have an account?{" "}
          <a
            href={`/sign-in?next=${encodeURIComponent(nextUrl())}`}
            className="font-bold text-green-400 hover:text-green-300"
          >
            Sign in
          </a>
        </p>
      </section>
    </main>
  );
}
