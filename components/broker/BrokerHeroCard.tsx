// /components/broker/BrokerHeroCard.tsx

import Link from "next/link";
import type { Broker } from "@/lib/types/broker";

type Props = {
    broker: Broker;
    geoLabel?: string;
};

export default function BrokerHeroCard({ broker, geoLabel }: Props) {
    return (
        <section className="mb-16">
            <div className="bg-gradient-to-br from-blue-900/60 to-black p-12 rounded-2xl border border-gray-800 shadow-xl">

                <div className="grid md:grid-cols-2 gap-10 items-center">

                    {/* LEFT */}
                    <div>
                        <h1 className="text-5xl font-bold mb-4 leading-tight">
                            {broker.name} Review {geoLabel}
                        </h1>

                        <p className="text-gray-300 mb-6 text-lg">
                            Ultra-low spreads, fast withdrawals, and a reliable trading experience trusted by traders worldwide.
                        </p>

                        {/* TRUST BADGES */}
                        <div className="flex gap-4 text-sm text-gray-400 mb-6 flex-wrap">
                            <span>✔ Fast withdrawals</span>
                            <span>✔ Low spreads</span>
                            <span>✔ MT4/MT5</span>
                        </div>

                        <div className="flex gap-4 flex-wrap">
                            <Link
                                href={`/go/${broker.slug}?src=hero_primary`}
                                className="bg-green-600 px-8 py-4 rounded-xl font-semibold text-lg"
                            >
                                🚀 Open Account
                            </Link>

                            <Link
                                href={`#compare`}
                                className="border border-gray-600 px-6 py-4 rounded-xl"
                            >
                                Compare Brokers
                            </Link>
                        </div>
                    </div>

                    {/* RIGHT */}
                    <div className="bg-gray-900 p-6 rounded-xl text-center">
                        <div className="text-yellow-400 text-3xl mb-2">
                            ⭐ {broker.rating ?? "4.5"}
                        </div>

                        <p className="text-gray-400 text-sm">
                            Rated by global traders
                        </p>
                    </div>

                </div>
            </div>
        </section>
    );
}
