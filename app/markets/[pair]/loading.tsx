export default function Loading() {
    return (
        <main className="bg-black text-white min-h-screen animate-pulse">

            {/* 🔹 HEADER SKELETON */}
            <section className="border-b border-gray-800 bg-[#070B14]">
                <div className="max-w-6xl mx-auto px-4 py-5 space-y-4">

                    <div className="flex flex-col md:flex-row md:justify-between gap-4">
                        <div className="space-y-2">
                            <div className="h-8 w-40 bg-gray-800 rounded" />
                            <div className="h-4 w-64 bg-gray-800 rounded" />
                        </div>

                        <div className="space-y-2 text-right">
                            <div className="h-6 w-24 bg-gray-800 rounded ml-auto" />
                            <div className="h-4 w-32 bg-gray-800 rounded ml-auto" />
                        </div>
                    </div>

                    {/* STATS */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="h-16 bg-[#0B0F1A] rounded-lg border border-gray-800" />
                        ))}
                    </div>

                    {/* BUTTONS */}
                    <div className="flex gap-3 mt-4">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="h-10 w-32 bg-gray-800 rounded-lg" />
                        ))}
                    </div>
                </div>
            </section>

            {/* 🔹 CONTENT */}
            <div className="max-w-6xl mx-auto px-4 py-6 space-y-10">

                {/* 📊 CHART */}
                <section>
                    <div className="h-[400px] w-full bg-[#0B0F1A] rounded-xl border border-gray-800" />
                </section>

                {/* 📈 SENTIMENT */}
                <section className="space-y-4">
                    <div className="h-5 w-40 bg-gray-800 rounded" />

                    <div className="bg-[#0B0F1A] p-5 rounded-xl border border-gray-800 space-y-4">
                        <div className="h-3 w-full bg-gray-800 rounded-full" />
                        <div className="flex justify-between">
                            <div className="h-3 w-10 bg-gray-800 rounded" />
                            <div className="h-3 w-10 bg-gray-800 rounded" />
                        </div>
                        <div className="h-3 w-24 bg-gray-800 rounded" />
                    </div>
                </section>

                {/* 📰 NEWS */}
                <section className="space-y-4">
                    <div className="h-5 w-40 bg-gray-800 rounded" />

                    <div className="space-y-3">
                        {[...Array(4)].map((_, i) => (
                            <div
                                key={i}
                                className="p-4 rounded-lg border border-gray-800 bg-[#0B0F1A] space-y-2"
                            >
                                <div className="h-4 w-3/4 bg-gray-800 rounded" />
                                <div className="h-3 w-full bg-gray-800 rounded" />
                                <div className="h-3 w-1/2 bg-gray-800 rounded" />
                            </div>
                        ))}
                    </div>
                </section>

                {/* 🏦 BROKERS */}
                <section className="space-y-4">
                    <div className="h-5 w-48 bg-gray-800 rounded" />

                    <div className="grid md:grid-cols-3 gap-4">
                        {[...Array(3)].map((_, i) => (
                            <div
                                key={i}
                                className="h-32 rounded-xl border border-gray-800 bg-[#0B0F1A]"
                            />
                        ))}
                    </div>
                </section>

                {/* 🚀 CTA */}
                <section>
                    <div className="h-12 w-full bg-gray-800 rounded-lg" />
                </section>

            </div>
        </main>
    );
}