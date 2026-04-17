import type { Broker } from "@/lib/types/broker";

type Props = {
    brokerA: Broker;
    brokerB: Broker;
};

export default function ComparisonHero({ brokerA, brokerB }: Props) {
    return (
        <section className="text-center py-12">
            <h1 className="text-4xl font-bold">
                {brokerA.name} vs {brokerB.name}
            </h1>
            <p className="text-gray-400 mt-4">
                Compare features, fees, and performance to choose the best broker.
            </p>
        </section>
    );
}
