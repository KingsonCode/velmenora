import Link from "next/link";
import type { BrokerCardData } from "@/lib/content";
import { buildLocalizedHref } from "@/lib/content/helpers";

type BrokerCardsBlockProps = {
    lang?: string;
    brokers?: BrokerCardData[];
    title?: string;
    ctaLabel?: string;
};

export default function BrokerCardsBlock({
    lang = "en",
    brokers = [],
    title = "Recommended Brokers",
    ctaLabel = "View broker",
}: BrokerCardsBlockProps) {
    if (!brokers.length) return null;

    return (
        <section className="mt-14" aria-labelledby="recommended-brokers-heading">
            <h2 id="recommended-brokers-heading" className="mb-5 text-2xl font-semibold">
                {title}
            </h2>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {brokers.map((broker) => (
                    <article
                        key={broker.slug}
                        className="rounded-2xl border border-white/10 p-5"
                    >
                        {broker.badge ? (
                            <div className="mb-3 inline-flex rounded-full border border-white/10 px-3 py-1 text-xs text-gray-300">
                                {broker.badge}
                            </div>
                        ) : null}

                        <h3 className="text-lg font-semibold">{broker.name}</h3>

                        {broker.description ? (
                            <p className="mt-2 text-sm leading-6 text-gray-400">
                                {broker.description}
                            </p>
                        ) : null}

                        <Link
                            href={buildLocalizedHref(lang, broker.href || `/brokers/${broker.slug}`)}
                            className="mt-4 inline-block text-sm underline underline-offset-4"
                        >
                            {ctaLabel}
                        </Link>
                    </article>
                ))}
            </div>
        </section>
    );
}