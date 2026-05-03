"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

function ResetPasswordClient() {
  const params = useSearchParams();
  const token = params.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!token) {
      setError("Reset token is missing.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, password }),
      });

      let data: any = null;

      try {
        data = await res.json();
      } catch {
        throw new Error("Invalid server response");
      }

      if (!res.ok || data?.ok === false) {
        throw new Error(data?.message || data?.error || "Password reset failed");
      }

      setMessage(data?.message || "Password has been reset. You can now sign in.");
      setPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setError(err.message || "Password reset failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-black px-6 py-16 text-white">
      <section className="mx-auto max-w-md rounded-[2rem] border border-white/10 bg-white/[0.03] p-8">
        <p className="text-sm font-black uppercase tracking-[0.25em] text-green-400">
          Reset Password
        </p>

        <h1 className="mt-3 text-4xl font-black">Create a new password</h1>

        <p className="mt-3 text-sm text-gray-400">
          Your new password must be at least 8 characters.
        </p>

        {!token && (
          <div className="mt-6 rounded-2xl border border-red-900 bg-red-950/30 p-4 text-sm text-red-300">
            Reset token is missing. Request a new password reset link.
          </div>
        )}

        <form onSubmit={submit} className="mt-7 space-y-4">
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-300">
              New Password
            </label>
            <input
              type="password"
              value={password}
              disabled={loading || !token}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-black px-4 py-4 outline-none transition focus:border-green-500 disabled:opacity-60"
              required
              minLength={8}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-300">
              Confirm New Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              disabled={loading || !token}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-black px-4 py-4 outline-none transition focus:border-green-500 disabled:opacity-60"
              required
              minLength={8}
            />
          </div>

          {message && (
            <div className="rounded-2xl border border-green-900 bg-green-950/30 p-4 text-sm text-green-300">
              {message}
              <a
                href="/sign-in"
                className="mt-3 block font-bold text-green-400 hover:text-green-300"
              >
                Sign in now →
              </a>
            </div>
          )}

          {error && (
            <div className="rounded-2xl border border-red-900 bg-red-950/30 p-4 text-sm text-red-300">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !token || !password || !confirmPassword}
            className="w-full rounded-2xl bg-green-500 py-4 font-black text-black transition hover:bg-green-400 disabled:bg-gray-700 disabled:text-gray-400"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        <a
          href="/forgot-password"
          className="mt-5 block text-center text-sm font-bold text-green-400 hover:text-green-300"
        >
          Request a new reset link
        </a>
      </section>
    </main>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-black px-6 py-16 text-white">
          <section className="mx-auto max-w-md rounded-[2rem] border border-white/10 bg-white/[0.03] p-8">
            Loading reset form...
          </section>
        </main>
      }
    >
      <ResetPasswordClient />
    </Suspense>
  );
}
