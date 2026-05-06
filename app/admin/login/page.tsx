"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function login(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setLoading(true);
    setError("");

    const res = await fetch("/api/admin/session/login", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ password }),
    });

    const json = await res.json().catch(() => null);

    setLoading(false);

    if (!res.ok || !json?.ok) {
      setError(json?.error || "Login failed");
      return;
    }

    router.push("/admin/funded/affiliates/applications");
    router.refresh();
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white">
      <section className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900/70 p-8 shadow-2xl">
        <p className="text-sm uppercase tracking-[0.25em] text-cyan-300">
          Velmenora Admin
        </p>

        <h1 className="mt-3 text-3xl font-black">Admin Login</h1>

        <p className="mt-2 text-sm text-slate-400">
          Enter the private admin UI password to access operational dashboards.
        </p>

        <form onSubmit={login} className="mt-8 space-y-4">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-300">
              Admin Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-400"
              placeholder="Enter admin password"
              autoComplete="current-password"
            />
          </div>

          {error ? (
            <div className="rounded-xl border border-red-500/40 bg-red-950/30 p-3 text-sm text-red-200">
              {error}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={loading || !password}
            className="w-full rounded-xl bg-cyan-400 px-4 py-3 font-black text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Open Admin Dashboard"}
          </button>
        </form>
      </section>
    </main>
  );
}
