import { notFound } from "next/navigation";
import Link from "next/link";
import { brokers } from "@/data/brokers";
import CTAButton from "@/components/CTAButton";

/* =========================================================
   🔥 SEO METADATA
========================================================= */
export async function generateMetadata({ params }: any) {
    const broker = brokers.find((b) => b.slug === params.slug);

    if (!broker) return { title: "Broker Not Found" };

    return {
        title: `${broker.name} Review (2026)`,
        description: broker.description,
        openGraph: {
            title: broker.name,
            description: broker.description,
            url: `https://velmenora.com/broker/${broker.slug}`,
        },
    };
}

/* =========================================================
   🔥 PAGE
========================================================= */
export default function BrokerPage({ params }: any) {
    const broker = brokers.find((b) => b.slug === params.slug);
    if (!broker) return notFound();

    const country = "tanzania";

    return (
        <div className="min-h-screen text-white bg-[#020617] pb-24">

            {/* 🔥 HERO */}
            <section className="text-center py-24 px-6">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                    {broker.name} Review
                </h1>

                <p className="text-gray-400 mb-6 max-w-xl mx-auto">
                    {broker.description}
                </p>

                <div className="text-yellow-400 text-lg mb-6">
                    ★ {broker.rating.toFixed(1)} / 5 Rating
                </div>

                {/* 🔥 HERO CTA */}
                <CTAButton
                    broker={broker.slug}
                    country={country}
                    href={`/go/${broker.slug}?src=broker-hero`}
                    text="Open Account →"
                    className="bg-gradient-primary px-10 py-5 rounded-xl font-semibold shadow-xl hover:scale-[1.03]"
                />

                <div className="mt-6 text-sm text-gray-400">
                    Trusted by thousands • Fast withdrawals • Secure platform
                </div>
            </section>

            {/* 🔥 QUICK STATS */}
            <section className="max-w-5xl mx-auto px-6 mb-16">
                <div className="grid md:grid-cols-3 gap-6 text-center">

                    <div className="bg-white/5 p-6 rounded-xl">
                        <p className="text-gray-400 text-sm">Min Deposit</p>
                        <p className="text-xl font-semibold">{broker.minDeposit}</p>
                    </div>

                    <div className="bg-white/5 p-6 rounded-xl">
                        <p className="text-gray-400 text-sm">Leverage</p>
                        <p className="text-xl font-semibold">{broker.leverage}</p>
                    </div>

                    <div className="bg-white/5 p-6 rounded-xl">
                        <p className="text-gray-400 text-sm">Spread</p>
                        <p className="text-xl font-semibold">{broker.spreadsFrom}</p>
                    </div>

                </div>
            </section>

            {/* 🔥 PROS & CONS */}
            <section className="max-w-5xl mx-auto px-6 mb-16 grid md:grid-cols-2 gap-8">

                <div className="bg-green-500/10 border border-green-500/20 p-6 rounded-xl">
                    <h2 className="text-xl font-bold mb-4 text-green-400">Pros</h2>
                    <ul className="space-y-2 text-sm">
                        {broker.features.map((p: string, i: number) => (
                            <li key={i}>✔ {p}</li>
                        ))}
                    </ul>
                </div>

                <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-xl">
                    <h2 className="text-xl font-bold mb-4 text-red-400">Cons</h2>
                    <ul className="space-y-2 text-sm">
                        <li>✖ Limited bonuses</li>
                    </ul>
                </div>

            </section>

            {/* 🔥 INTERNAL LINKING (VERY IMPORTANT SEO) */}
            <section className="text-center mb-16">
                <p className="text-gray-400 mb-4">
                    Want to compare more options?
                </p>

                <Link
                    href="/compare"
                    className="text-blue-400 hover:underline"
                >
                    Compare all forex brokers →
                </Link>
            </section>

            {/* 🔥 MID CTA */}
            <div className="text-center mb-16">
                <CTAButton
                    broker={broker.slug}
                    country={country}
                    href={`/go/${broker.slug}?src=broker-mid`}
                    text="Start Trading Now →"
                    className="bg-blue-600 px-8 py-4 rounded-xl font-semibold"
                />
            </div>

            {/* 🔥 FINAL CTA */}
            <section className="text-center py-20 px-6 border-t border-white/10">
                <h2 className="text-3xl font-bold mb-4">
                    Ready to Trade with {broker.name}?
                </h2>

                <p className="text-gray-400 mb-6">
                    Join thousands of traders using this trusted broker.
                </p>

                <CTAButton
                    broker={broker.slug}
                    country={country}
                    href={`/go/${broker.slug}?src=broker-bottom`}
                    text="Open Account Now →"
                    className="bg-green-500 px-10 py-5 rounded-xl font-semibold"
                />

                <p className="text-gray-500 text-sm mt-4">
                    Fast signup • No hidden fees • Secure
                </p>
            </section>

        </div>
    );
}