import CTAButton from "@/components/CTAButton";

type Props = {
    topBroker?: {
        slug: string;
        name: string;
    };
};

export default function FinalCTA({
    topBroker = { slug: "exness", name: "Exness" },
}: Props) {
    return (
        <section className="relative py-24 text-center text-white overflow-hidden">

            {/* 🔥 BACKGROUND */}
            <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900 to-black" />

            {/* 🔥 GLOW */}
            <div className="absolute top-[-120px] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-yellow-500/20 blur-[140px] rounded-full" />

            <div className="relative max-w-4xl mx-auto px-4">

                {/* 💥 HEADLINE */}
                <h2 className="text-3xl md:text-5xl font-extrabold mb-6 leading-tight">
                    Start Trading with{" "}
                    <span className="text-yellow-400">
                        {topBroker.name}
                    </span>{" "}
                    Today
                </h2>

                {/* ✨ SUBTEXT */}
                <p className="text-gray-400 mb-10 text-lg max-w-2xl mx-auto">
                    Trade with a verified broker offering fast withdrawals,
                    low spreads, and powerful trading platforms.
                </p>

                {/* 🚀 PRIMARY CTA */}
                <div className="flex justify-center mb-6">
                    <CTAButton
                        broker={topBroker.slug}
                        country="tanzania"
                        position="bottom"
                        text={`🚀 Open ${topBroker.name} Account`}
                        className="bg-yellow-500 text-black px-10 py-5 rounded-2xl font-bold text-lg hover:scale-105 transition shadow-xl"
                    />
                </div>

                {/* ⚡ ALT CTA (TESTING READY) */}
                <div className="flex justify-center mb-8">
                    <CTAButton
                        broker={topBroker.slug}
                        country="tanzania"
                        position="bottom"
                        text="Start Trading Now"
                        className="text-sm text-gray-400 underline hover:text-white transition"
                    />
                </div>

                {/* 🔍 SECONDARY NAV */}
                <div className="flex flex-wrap justify-center gap-4 text-sm mb-10">

                    <a
                        href="/explorer"
                        className="px-5 py-2 border border-white/20 rounded-full hover:bg-white/10 transition"
                    >
                        🔍 Compare Brokers
                    </a>

                    <a
                        href="/academy"
                        className="px-5 py-2 border border-white/20 rounded-full hover:bg-white/10 transition"
                    >
                        🎓 Learn Forex First
                    </a>

                </div>

                {/* ✅ TRUST STRIP */}
                <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-400">
                    <span>✔ No Hidden Fees</span>
                    <span>✔ Fast Withdrawals</span>
                    <span>✔ Trusted by Traders</span>
                </div>

            </div>
        </section>
    );
}