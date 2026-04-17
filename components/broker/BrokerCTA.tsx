import type { Broker } from "@/lib/types/broker";

type Props = {
    broker: Broker;

    /* 🔥 OPTIONAL TRACKING */
    onClick?: () => void;

    /* 🔥 OPTIONAL OVERRIDES */
    href?: string;
    className?: string;
    title?: string;
    subtitle?: string;
    buttonText?: string;
};

export default function BrokerCTA({
    broker,
    onClick,
    href,
    className,
    title,
    subtitle,
    buttonText,
}: Props) {
    return (
        <section
            className={`text-center py-20 bg-gradient-to-br from-green-900/40 to-black rounded-2xl mb-24 border border-green-800 ${className || ""
                }`}
        >
            {/* 🔥 TITLE */}
            <h2 className="text-4xl font-bold mb-4">
                {title || `Ready to Trade with ${broker.name}?`}
            </h2>

            {/* 🔥 SUBTITLE */}
            <p className="text-gray-300 mb-8 text-lg">
                {subtitle ||
                    "Join thousands of traders already using one of the fastest brokers in the market."}
            </p>

            {/* 🔥 CTA BUTTON */}
            <a
                href={href || `/go/${broker.slug}?src=cta_main`}
                onClick={onClick}
                className="bg-green-600 px-12 py-5 rounded-xl text-xl font-semibold inline-block"
            >
                {buttonText || "🚀 Open Account Now"}
            </a>
        </section>
    );
}
