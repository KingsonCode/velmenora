"use client";

import { useState } from "react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setLoading(true);
    setMessage("");
    setError("");

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      let data: any = null;

      try {
        data = await res.json();
      } catch {
        throw new Error("Invalid server response");
      }

      if (!res.ok || data?.ok === false) {
        throw new Error(data?.message || data?.error || "Reset request failed");
      }

      setMessage(
        data?.message ||
          "If an account exists for this email, reset instructions will be sent.",
      );
    } catch (err: any) {
      setError(err.message || "Reset request failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-black px-6 py-16 text-white">
      <section className="mx-auto max-w-md rounded-[2rem] border border-white/10 bg-white/[0.03] p-8">
        <p className="text-sm font-black uppercase tracking-[0.25em] text-green-400">
          Password Reset
        </p>

        <h1 className="mt-3 text-4xl font-black">Forgot your password?</h1>

        <p className="mt-3 text-sm text-gray-400">
          Enter your account email. If it exists, reset instructions will be sent.
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

          {message && (
            <div className="rounded-2xl border border-green-900 bg-green-950/30 p-4 text-sm text-green-300">
              {message}
            </div>
          )}

          {error && (
            <div className="rounded-2xl border border-red-900 bg-red-950/30 p-4 text-sm text-red-300">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !email}
            className="w-full rounded-2xl bg-green-500 py-4 font-black text-black transition hover:bg-green-400 disabled:bg-gray-700 disabled:text-gray-400"
          >
            {loading ? "Sending..." : "Send Reset Instructions"}
          </button>
        </form>

        <a
          href="/sign-in"
          className="mt-5 block text-center text-sm font-bold text-green-400 hover:text-green-300"
        >
          Back to Sign In
        </a>
      </section>
    </main>
  );
}
