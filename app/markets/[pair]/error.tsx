"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
    error,
    reset,
}: {
    error: Error;
    reset: () => void;
}) {
    useEffect(() => {
        console.error("Market Page Error:", error);
    }, [error]);

    return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">

            {/* 🔥 ICON */}
            <div className="mb-6 text-red-500 text-4xl">
                ⚠️
            </div>

            {/* 🚨 TITLE */}
            <h2 className="text-2xl md:text-3xl font-bold mb-3">
                Market Data Unavailable
            </h2>

            {/* 📄 DESCRIPTION */}
            <p className="text-sm md:text-base text-gray-400 max-w-md mb-8">
                We couldn’t load this market right now. This may be a temporary issue
                with live data providers or network connectivity.
            </p>

            {/* 🔁 ACTIONS */}
            <div className="flex flex-wrap gap-3 justify-center mb-6">

                {/* RETRY */}
                <button
                    onClick={() => reset()}
                    className="px-6 py-2 bg-white text-black rounded-lg font-semibold hover:scale-105 transition"
                >
                    Retry
                </button>

                {/* BACK TO MARKETS */}
                <Link
                    href="/markets"
                    className="px-6 py-2 border border-gray-700 rounded-lg text-sm hover:border-white transition"
                >
                    Browse Markets
                </Link>

                {/* BACK HOME */}
                <Link
                    href="/"
                    className="px-6 py-2 border border-gray-700 rounded-lg text-sm hover:border-white transition"
                >
                    Home
                </Link>
            </div>

            {/* 💰 MONETIZATION CTA */}
            <div className="mt-2">
                <Link
                    href="/brokers"
                    className="inline-block bg-yellow-500 text-black px-6 py-3 rounded-lg font-semibold hover:scale-105 transition"
                >
                    View Top Brokers
                </Link>
            </div>

            {/* 🧠 DEBUG (DEV ONLY) */}
            {process.env.NODE_ENV !== "production" && (
                <details className="mt-8 text-xs text-left text-gray-500 max-w-md">
                    <summary className="cursor-pointer">Error details</summary>
                    <pre className="mt-2 whitespace-pre-wrap">
                        {error.message}
                    </pre>
                </details>
            )}
        </div>
    );
}