import Link from "next/link";
import { BookOpen, TrendingUp, GraduationCap } from "lucide-react";

export default function LearnForex() {
    return (
        <section className="py-20 bg-black text-white">

            <div className="max-w-6xl mx-auto px-4">

                {/* 🔥 HEADER */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Learn Forex Trading the{" "}
                        <span className="text-yellow-400">Right Way</span>
                    </h2>

                    <p className="text-gray-400 max-w-2xl mx-auto">
                        Master forex step by step with beginner-friendly guides,
                        strategies, and real trading insights.
                    </p>
                </div>

                {/* 💎 FEATURED ARTICLE (HIGH CTR) */}
                <div className="mb-10">
                    <Link
                        href="/academy/what-is-forex"
                        className="block p-8 rounded-2xl bg-gradient-to-r from-yellow-500/20 to-orange-500/10 border border-yellow-400/20 hover:scale-[1.02] transition"
                    >
                        <div className="flex items-center gap-4 mb-4">
                            <BookOpen className="text-yellow-400" size={28} />
                            <span className="text-sm text-yellow-400 font-semibold">
                                START HERE
                            </span>
                        </div>

                        <h3 className="text-2xl font-bold mb-2">
                            What is Forex Trading?
                        </h3>

                        <p className="text-gray-300">
                            Understand how the forex market works, how traders make money,
                            and why millions trade currencies daily.
                        </p>
                    </Link>
                </div>

                {/* 📚 GRID ARTICLES */}
                <div className="grid md:grid-cols-2 gap-6 mb-12">

                    <Link
                        href="/academy/how-to-trade-forex"
                        className="p-6 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition"
                    >
                        <div className="flex items-center gap-3 mb-3">
                            <TrendingUp className="text-yellow-400" size={22} />
                            <h4 className="font-semibold text-lg">
                                How to Trade Forex
                            </h4>
                        </div>

                        <p className="text-gray-400 text-sm">
                            Learn how to open trades, analyze charts, and manage risk like a pro.
                        </p>
                    </Link>

                    <Link
                        href="/academy/forex-for-beginners"
                        className="p-6 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition"
                    >
                        <div className="flex items-center gap-3 mb-3">
                            <GraduationCap className="text-yellow-400" size={22} />
                            <h4 className="font-semibold text-lg">
                                Forex for Beginners
                            </h4>
                        </div>

                        <p className="text-gray-400 text-sm">
                            Start your forex journey with simple strategies and easy explanations.
                        </p>
                    </Link>

                </div>

                {/* 🚀 CTA → ACADEMY */}
                <div className="text-center">
                    <Link
                        href="/academy"
                        className="inline-block px-8 py-4 bg-yellow-500 text-black font-semibold rounded-xl hover:scale-105 transition shadow-lg"
                    >
                        🎓 Go to Forex Academy
                    </Link>
                </div>

            </div>
        </section>
    );
}