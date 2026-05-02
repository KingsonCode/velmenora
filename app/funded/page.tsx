export default function FundedPage() {
    return (
        <main className="min-h-screen bg-black text-white px-6 py-12">
            <div className="max-w-6xl mx-auto">
                <section className="mb-12">
                    <p className="text-green-400 font-semibold mb-3">
                        Velmenora Funded Challenge
                    </p>

                    <h1 className="text-4xl md:text-6xl font-bold mb-5 leading-tight">
                        Prove Your Skill. Pass the Challenge. Get Paid.
                    </h1>

                    <p className="text-gray-400 max-w-3xl text-lg">
                        Trade a simulated funded account, follow clear rules, and receive a fixed reward after successful review.
                    </p>
                </section>

                <div className="bg-green-900/20 border border-green-500 rounded-xl p-5 mb-8">
                    <p className="text-green-400 font-semibold">
                        ⚡ Simple Rules • 💰 Fixed Rewards • ⏱ Fast Review
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    <div className="border border-gray-800 rounded-2xl p-6 bg-black hover:border-green-500 transition">
                        <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">
                            Starter Challenge
                        </p>

                        <h2 className="text-3xl font-bold mb-2">Instant 10K</h2>

                        <p className="text-gray-400 mb-1">
                            <span className="text-white text-2xl font-bold">$25</span> one-time fee
                        </p>

                        <p className="text-green-400 text-sm mb-6">
                            Pass and receive $100 reward
                        </p>

                        <ul className="text-sm text-gray-300 space-y-2 mb-6">
                            <li>• Simulated Balance: $10,000</li>
                            <li>• Profit Target: 10%</li>
                            <li>• Daily Loss Limit: 5%</li>
                            <li>• Max Drawdown: 10%</li>
                            <li>• Fixed Reward: $100</li>
                        </ul>

                        <a
                            href="/funded/apply?plan=instant-10k"
                            className="block text-center bg-green-500 hover:bg-green-600 transition px-4 py-3 rounded-xl font-semibold text-black"
                        >
                            Start 10K Challenge → Win $100
                        </a>
                    </div>

                    <div className="relative border border-green-500 rounded-2xl p-6 bg-green-950/10 hover:bg-green-950/20 transition shadow-[0_0_40px_rgba(34,197,94,0.12)]">
                        <div className="absolute -top-4 left-6 bg-green-500 text-black text-xs font-bold px-4 py-1 rounded-full">
                            Most Popular 🔥
                        </div>

                        <p className="text-xs text-green-400 uppercase tracking-widest mb-2">
                            Pro Challenge
                        </p>

                        <h2 className="text-3xl font-bold mb-2">Instant 25K</h2>

                        <p className="text-gray-400 mb-1">
                            <span className="text-white text-2xl font-bold">$59</span> one-time fee
                        </p>

                        <p className="text-green-400 text-sm mb-1">
                            Includes +$15 bonus reward
                        </p>

                        <p className="text-gray-500 text-sm mb-6">
                            Higher capital. Higher reward. Same clear rules.
                        </p>

                        <ul className="text-sm text-gray-300 space-y-2 mb-6">
                            <li>• Simulated Balance: $25,000</li>
                            <li>• Profit Target: 10%</li>
                            <li>• Daily Loss Limit: 5%</li>
                            <li>• Max Drawdown: 10%</li>
                            <li>• Fixed Reward: $115</li>
                        </ul>

                        <a
                            href="/funded/apply?plan=instant-25k"
                            className="block text-center bg-green-500 hover:bg-green-600 transition px-4 py-3 rounded-xl font-semibold text-black"
                        >
                            Start 25K Challenge → Win $115
                        </a>
                    </div>
                </div>

                <div className="mt-10 grid md:grid-cols-3 gap-4">
                    <div className="border border-gray-800 p-5 rounded-xl bg-gray-950">
                        <h3 className="font-semibold mb-2">1. Choose a Challenge</h3>
                        <p className="text-sm text-gray-400">
                            Select 10K or 25K based on your confidence and trading level.
                        </p>
                    </div>

                    <div className="border border-gray-800 p-5 rounded-xl bg-gray-950">
                        <h3 className="font-semibold mb-2">2. Follow the Rules</h3>
                        <p className="text-sm text-gray-400">
                            Reach 10% profit while staying within daily and overall loss limits.
                        </p>
                    </div>

                    <div className="border border-gray-800 p-5 rounded-xl bg-gray-950">
                        <h3 className="font-semibold mb-2">3. Get Reviewed & Paid</h3>
                        <p className="text-sm text-gray-400">
                            Successful accounts are reviewed and approved for fixed reward payout.
                        </p>
                    </div>
                </div>

                <div className="mt-10 border border-gray-800 p-5 rounded-xl bg-black">
                    <p className="text-sm text-gray-300 leading-relaxed">
                        <span className="text-white font-semibold">Pass Criteria</span>
                        <br />

                        <span className="text-green-400">✔</span> Hit{" "}
                        <span className="text-white font-semibold">10% profit target</span>
                        <br />

                        <span className="text-green-400">✔</span> Maintain consistency for at least{" "}
                        <span className="text-white font-semibold">3 trading days</span>
                        <br />

                        <span className="text-green-400">✔</span> Stay within{" "}
                        <span className="text-white font-semibold">strict risk limits</span> to qualify for{" "}
                        <span className="text-green-400 font-semibold">payout</span>:
                        <br />

                        <span className="ml-4 text-gray-400">
                            • Max <span className="text-white">5% daily loss</span>
                        </span>
                        <br />

                        <span className="ml-4 text-gray-400">
                            • Max <span className="text-white">10% overall drawdown</span>
                        </span>
                    </p>

                    <div className="mt-12 text-center text-gray-400 space-y-2">
                        <p>✔ Real evaluation system</p>
                        <p>✔ Transparent rules</p>
                        <p>✔ Fixed reward model</p>
                        <p>✔ Fast payout processing after review</p>
                    </div>
                </div>
            </div>
        </main>
    );
}