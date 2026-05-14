"use client";

import { getStoredRef } from "@/lib/affiliate/ref";
import { getFundedPlan } from "@/lib/funded/config";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

export default function FundedApplyClient() {
  const params = useSearchParams();
  const plan = params.get("plan") ?? "";
  const retakeCode = params.get("retakeCode") ?? params.get("discountCode") ?? "";
  const selectedPlan = getFundedPlan(plan);

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!selectedPlan) {
      setError("Invalid plan selected. Please go back and choose a challenge.");
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
    setError("");

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000);
      const ref = getStoredRef();

      const res = await fetch("/api/funded/apply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          fullName: name,
          phone: phone || undefined,
          password,
          planSlug: plan,
          ref: ref || undefined,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      let data: any = null;

      try {
        data = await res.json();
      } catch {
        throw new Error("Invalid server response");
      }

      if (!res.ok || data?.ok === false) {
        throw new Error(
          data?.message ||
            data?.error ||
            data?.reason ||
            "Request failed. Try again.",
        );
      }

      const accountId = data?.challengeAccount?.id;

      if (!accountId) {
        throw new Error("Account creation failed");
      }

      window.location.href = `/funded/account/${accountId}`;
    } catch (err: any) {
      if (err.name === "AbortError") {
        setError("Request timed out. Please try again.");
      } else {
        setError(err.message || "Unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  }

  if (!selectedPlan) {
    return (
      <main className="min-h-screen bg-black px-6 py-16 text-white">
        <div className="mx-auto max-w-3xl rounded-3xl border border-red-500/30 bg-red-950/10 p-8">
          <p className="text-sm font-black uppercase tracking-[0.25em] text-red-400">
            Invalid Plan
          </p>
          <h1 className="mt-3 text-4xl font-black">Choose a valid challenge</h1>
          <p className="mt-3 text-gray-400">
            The plan in your URL is missing or invalid.
          </p>
          <a
            href="/funded#plans"
            className="mt-6 inline-flex rounded-2xl bg-green-500 px-6 py-3 font-bold text-black hover:bg-green-400"
          >
            View Challenge Plans
          </a>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black px-6 py-12 text-white">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
        <section className="rounded-[2rem] border border-green-500/20 bg-green-950/10 p-8">
          <p className="text-sm font-black uppercase tracking-[0.25em] text-green-400">
            Start Challenge
          </p>

          <h1 className="mt-3 text-4xl font-black md:text-5xl">
            {selectedPlan.name}
          </h1>

          <p className="mt-4 text-gray-400">
            Create your challenge account, then continue to secure crypto
            checkout. Your dashboard activates automatically after payment
            confirmation.
          </p>

          <div className="mt-7 grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
              <p className="text-xs text-gray-500">Entry Fee</p>
              <p className="mt-1 text-2xl font-black text-green-400">
                {selectedPlan.fee}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
              <p className="text-xs text-gray-500">Reward</p>
              <p className="mt-1 text-2xl font-black text-green-400">
                {selectedPlan.reward}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
              <p className="text-xs text-gray-500">Virtual Balance</p>
              <p className="mt-1 font-bold">{selectedPlan.balance}</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
              <p className="text-xs text-gray-500">Profit Target</p>
              <p className="mt-1 font-bold">{selectedPlan.target}</p>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-yellow-500/20 bg-yellow-950/10 p-5 text-sm text-gray-300">
            <p className="font-bold text-yellow-300">Risk rules</p>
            <p className="mt-2">
              Daily loss limit: {selectedPlan.dailyLoss}. Max drawdown:{" "}
              {selectedPlan.drawdown}. Minimum trading days: 7.
            </p>
          </div>

          <div className="mt-6 rounded-2xl border border-white/10 bg-black/40 p-5 text-sm text-gray-400">
            <p className="font-bold text-white">What happens next?</p>
            <ol className="mt-3 list-decimal space-y-2 pl-5">
              <li>Create your challenge account.</li>
              <li>Open your account dashboard.</li>
              <li>Complete NOWPayments checkout.</li>
              <li>Your account becomes active after payment confirmation.</li>
            </ol>
          </div>
        </section>

        <section className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-8">
          <h2 className="text-2xl font-black">Create your account</h2>
          <p className="mt-2 text-sm text-gray-400">
            Use accurate details. These will be attached to your challenge
            account and payout review.
          </p>

          <form onSubmit={handleSubmit} className="mt-7 space-y-4">
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-300">
                Full Name
              </label>
              <input
                type="text"
                placeholder="Your full name"
                value={name}
                disabled={loading}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-black px-4 py-4 outline-none transition focus:border-green-500 disabled:opacity-60"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-300">
                Email Address
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                disabled={loading}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-black px-4 py-4 outline-none transition focus:border-green-500 disabled:opacity-60"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-300">
                Phone Number <span className="text-gray-500">(optional)</span>
              </label>
              <input
                type="tel"
                placeholder="+255..."
                value={phone}
                disabled={loading}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-black px-4 py-4 outline-none transition focus:border-green-500 disabled:opacity-60"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-300">
                Password
              </label>
              <input
                type="password"
                placeholder="Create a secure password"
                value={password}
                disabled={loading}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-black px-4 py-4 outline-none transition focus:border-green-500 disabled:opacity-60"
                required
                minLength={8}
              />
              <p className="mt-2 text-xs text-gray-500">
                Use at least 8 characters. You will use this to sign in to your member area.
              </p>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-300">
                Confirm Password
              </label>
              <input
                type="password"
                placeholder="Repeat your password"
                value={confirmPassword}
                disabled={loading}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-black px-4 py-4 outline-none transition focus:border-green-500 disabled:opacity-60"
                required
                minLength={8}
              />
            </div>

            {error && (
              <div className="rounded-2xl border border-red-900 bg-red-950/30 p-4 text-sm text-red-300">
                {error}
                {error.includes("Sign in") || error.includes("sign in") ? (
                  <a href="/sign-in" className="mt-3 block font-bold text-green-400 hover:text-green-300">
                    Sign in to continue →
                  </a>
                ) : null}
              </div>
            )}

            <button
              type="submit"
              disabled={
                loading ||
                !email ||
                !name ||
                !password ||
                !confirmPassword ||
                !selectedPlan
              }
              className="w-full rounded-2xl bg-green-500 py-4 font-black text-black transition hover:bg-green-400 disabled:bg-gray-700 disabled:text-gray-400"
            >
              {loading ? "Creating Account..." : "Create Account & Continue"}
            </button>

            <p className="text-center text-xs text-gray-500">
              Already have a Velmenora account?{" "}
              <a href="/sign-in" className="font-bold text-green-400 hover:text-green-300">
                Sign in
              </a>
              . Next: secure payment checkout. Account activates after payment confirmation.
            </p>
          </form>
        </section>
      </div>
    </main>
  );
}
