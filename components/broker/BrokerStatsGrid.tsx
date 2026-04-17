// /components/broker/BrokerStatsGrid.tsx

import type { Broker } from "@/lib/types/broker";

type Props = {
    broker: Broker;
    payments: string[];
};

export default function BrokerStatsGrid({ broker, payments }: Props) {
    return (
        <section className="grid md:grid-cols-3 gap-6 mb-20">

            {/* TRADING */}
            <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800">
                <h3 className="font-semibold mb-3 text-lg">Trading</h3>
                <ul className="text-gray-400 space-y-2">
                    {broker.features?.map((f) => (
                        <li key={f}>✔ {f}</li>
                    ))}
                </ul>
            </div>

            {/* PAYMENTS */}
            <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800">
                <h3 className="font-semibold mb-3 text-lg">Payments</h3>
                <ul className="text-gray-400 space-y-2">
                    {payments.map((p) => (
                        <li key={p}>✔ {p}</li>
                    ))}
                </ul>
            </div>

            {/* WHY */}
            <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800">
                <h3 className="font-semibold mb-3 text-lg">Why {broker.name}</h3>
                <p className="text-gray-400">
                    Designed for traders who need speed, reliability, and low costs.
                </p>
            </div>

        </section>
    );
}
