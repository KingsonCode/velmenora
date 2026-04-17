import type { Broker } from "@/lib/types/broker";

type Props = {
    broker: Broker;
};

export default function ComparisonWinner({ broker }: Props) {
    return (
        <div className="text-center mt-10 p-6 border rounded-xl bg-green-900/20">
            <h2 className="text-2xl font-bold mb-2">🏆 Winner</h2>
            <p className="text-lg">{broker.name} is the better choice based on rating.</p>
        </div>
    );
}
