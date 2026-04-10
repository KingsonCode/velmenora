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
    /* 🔥 LOG ERROR (important for debugging) */
    useEffect(() => {
        console.error("Market Page Error:", error);
    }, [error]);

    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">

            {/* 🚨 TITLE */}
            <h2 className="text-2xl font-bold mb-2">
                Market Data Unavailable
            </h2>

            {/* 📄 DESCRIPTION */}
            <p className="text-sm text-gray-400 max-w-md mb-6">
                We couldn’t load this market right now. This might be due to a temporary issue
                with data sources or network connectivity.
            </p>

            {/* 🔁 ACTIONS */}
            <div className="flex gap-3 flex-wrap justify-center">

                {/* RETRY */}
                <button
                    onClick={() => reset()}
                    className="px-5 py-2 bg-white text-black rounded-lg font-semibold hover:scale-105 transition"
                >
                    Retry
                </button>

                {/* BACK TO MARKETS */}
                <Link
                    href="/markets/eurusd"
                    className="px-5 py-2 border border-gray-700 rounded-lg text-sm hover:border-white transition"
                >
                    Go to Markets
                </Link>
            </div>

            {/* 🧠 EXTRA HELP */}
            <p className="text-xs text-gray-500 mt-6">
                If the problem persists, try refreshing or checking another market pair.
            </p>

            {/* ⚠️ DEBUG (optional remove in prod) */}
            <details className="mt-6 text-xs text-left text-gray-500 max-w-md">
                <summary className="cursor-pointer">Error details</summary>
                <pre className="mt-2 whitespace-pre-wrap">
                    {error.message}
                </pre>
            </details>
        </div>
    );
}