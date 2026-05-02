"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";

export default function FundedApplyClient() {
    const params = useSearchParams();
    const plan = params.get("plan");

    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleSubmit(e: any) {
        e.preventDefault();

        if (!plan) {
            setError("Invalid plan selected");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 10000);

            const res = await fetch("/api/funded/apply", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    fullName: name,
                    planSlug: plan,
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

            if (!res.ok) {
                throw new Error(
                    data?.message || data?.error || "Request failed. Try again."
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
        }

        setLoading(false);
    }

    return (
        <main className="min-h-screen bg-black text-white px-6 py-12">
            <div className="max-w-md mx-auto">
                <h1 className="text-2xl font-bold mb-2">
                    Start Your Challenge
                </h1>

                <p className="text-gray-400 mb-6 text-sm">
                    Plan:{" "}
                    <span className="text-green-400">
                        {plan || "No plan selected"}
                    </span>
                </p>

                <div className="bg-gray-900 border border-gray-800 p-4 rounded-lg mb-6 text-sm text-gray-300">
                    Pass the challenge and receive a fixed{" "}
                    <span className="text-green-400 font-semibold">$100 payout</span>.
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        placeholder="Full Name"
                        value={name}
                        disabled={loading}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full p-3 rounded bg-gray-900 border border-gray-800 focus:border-green-500 outline-none disabled:opacity-60"
                        required
                    />

                    <input
                        type="email"
                        placeholder="Email Address"
                        value={email}
                        disabled={loading}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-3 rounded bg-gray-900 border border-gray-800 focus:border-green-500 outline-none disabled:opacity-60"
                        required
                    />

                    {error && (
                        <div className="text-red-400 text-sm border border-red-900 bg-red-950/30 p-3 rounded">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading || !email || !name || !plan}
                        className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-700 disabled:text-gray-400 transition py-3 rounded font-semibold text-black"
                    >
                        {loading ? "Creating Account..." : "Create Account & Continue"}
                    </button>
                </form>
            </div>
        </main>
    );
}