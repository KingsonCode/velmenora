import { ShieldCheck, Zap, BookOpen } from "lucide-react";

export default function WhyVelmenora() {
    return (
        <section className="py-20 bg-gradient-to-b from-black to-gray-900 text-white">

            <div className="max-w-6xl mx-auto px-4 text-center">

                {/* 🔥 HEADER */}
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                    Why Traders Choose{" "}
                    <span className="text-yellow-400">Velmenora</span>
                </h2>

                <p className="text-gray-400 max-w-2xl mx-auto mb-12">
                    We simplify forex trading by helping you find trusted brokers,
                    compare features, and make smarter decisions — faster.
                </p>

                {/* 💎 CARDS */}
                <div className="grid md:grid-cols-3 gap-6">

                    {/* 🛡 TRUST */}
                    <div className="p-6 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition shadow-lg">
                        <div className="mb-4 flex justify-center">
                            <ShieldCheck className="text-yellow-400" size={32} />
                        </div>

                        <h3 className="font-semibold text-lg mb-2">
                            Verified & Trusted Brokers
                        </h3>

                        <p className="text-gray-400 text-sm">
                            We only list regulated and reliable brokers with proven track records.
                            No scams. No guesswork.
                        </p>
                    </div>

                    {/* ⚡ SPEED */}
                    <div className="p-6 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition shadow-lg">
                        <div className="mb-4 flex justify-center">
                            <Zap className="text-yellow-400" size={32} />
                        </div>

                        <h3 className="font-semibold text-lg mb-2">
                            Fast & Smart Comparisons
                        </h3>

                        <p className="text-gray-400 text-sm">
                            Instantly compare spreads, fees, platforms, and features —
                            all in one place.
                        </p>
                    </div>

                    {/* 📚 EDUCATION */}
                    <div className="p-6 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition shadow-lg">
                        <div className="mb-4 flex justify-center">
                            <BookOpen className="text-yellow-400" size={32} />
                        </div>

                        <h3 className="font-semibold text-lg mb-2">
                            Beginner-Friendly Guides
                        </h3>

                        <p className="text-gray-400 text-sm">
                            Learn forex step by step with simple guides, tips, and strategies
                            tailored for African traders.
                        </p>
                    </div>

                </div>

                {/* ✅ TRUST BADGE LINE */}
                <div className="mt-12 flex flex-wrap justify-center gap-6 text-sm text-gray-400">
                    <span>✔ 100% Free to Use</span>
                    <span>✔ No Hidden Bias</span>
                    <span>✔ Regularly Updated Data</span>
                </div>

            </div>
        </section>
    );
}