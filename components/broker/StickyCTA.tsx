// /components/broker/StickyCTA.tsx

import type { Broker } from "@/lib/types/broker";

type Props = {
    broker: Broker;
    onClick?: () => void;
};

export default function StickyCTA({ broker, onClick }: Props) {
    return (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 backdrop-blur-md">
            <a
                href={`/go/${broker.slug}?src=sticky`}
                onClick={onClick}
                className="bg-green-600 px-10 py-4 rounded-xl shadow-2xl text-lg"
            >
                🚀 Open {broker.name}
            </a>
        </div>
    );
}
