// /components/broker/BrokerTrustCard.tsx

import type { Broker } from "@/lib/types/broker";

type Props = {
    broker: Broker;
};

export default function BrokerTrustCard({ broker }: Props) {
    return (
        <section className="mb-20 bg-gray-900 p-10 rounded-2xl border border-gray-800">

            <h2 className="text-2xl font-bold mb-4">
                Is {broker.name} Safe?
            </h2>

            <p className="text-gray-400 leading-relaxed">
                {broker.name} is a globally recognized broker offering stable trading infrastructure,
                strong execution speeds, and multiple account types. Traders choose {broker.name}
                for its transparency, fast withdrawals, and consistent performance across markets.
            </p>

        </section>
    );
}
