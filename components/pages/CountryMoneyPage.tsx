import Link from "next/link";
import type { Broker } from "@/lib/types/broker";

import {
    buildCountryPageData,
    getBrokerBadge,
    getBrokerHighlights,
    getBrokerReason,
} from "@/lib/country-page/helpers";

import SchemaMarkup from "@/components/SchemaMarkup";
import TrackingCountryView from "@/components/tracking/TrackingCountryView";
import TrackedLink from "@/components/tracking/TrackedLink";

type Props = {
    countryCode: string;
    countryName: string;
    countrySlug: string;
    brokers: Broker[];
};

export default function CountryMoneyPage({
    countryCode,
    countryName,
    countrySlug,
    brokers,
}: Props) {
    const built = buildCountryPageData(brokers, countryName);

    const {
        rankedBrokers,
        topBroker,
        topBrokerSummary,
        topBrokerStrip,
        countryHighlights,
        comparisonRows,
        faq,
    } = built;

    return (
        <div className="mx-auto max-w-4xl space-y-8 px-6 py-12 pb-32">
            <TrackingCountryView country={countryCode} />

            {/* ================= HEADER ================= */}
            <header className="space-y-4">
                {/* SUMMARY */}
                {topBroker && topBrokerSummary && (
                    <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                        <p className="text-xs text-gray-500">
                            Best Broker in {countryName}
                        </p>
                        <h2 className="text-lg font-semibold text-white">
                            {topBrokerSummary.title}
                        </h2>
                        <p className="text-sm text-gray-400">
                            {topBrokerSummary.subtitle}
                        </p>

                        <div className="mt-3 flex gap-2">
                            <TrackedLink
                                href={`/go/${topBroker.slug}?src=summary`}
                                broker={topBroker.slug}
                                page="country"
                                cta="summary"
                                country={countryCode}
                                className="rounded-xl bg-green-600 px-4 py-2 text-sm text-white"
                            >
                                Open Account
                            </TrackedLink>

                            <Link
                                href={`/brokers/${topBroker.slug}`}
                                className="rounded-xl border border-white/10 px-4 py-2 text-sm"
                            >
                                Review
                            </Link>
                        </div>
                    </section>
                )}

                {/* TOP 3 */}
                <section className="grid gap-4 md:grid-cols-3">
                    {topBrokerStrip.map((b) => (
                        <article
                            key={b.slug}
                            className="rounded-xl border border-white/10 p-4"
                        >
                            <p className="text-xs text-gray-500">#{b.rank}</p>
                            <h3 className="font-semibold">{b.name}</h3>
                            <p className="text-sm text-gray-400">{b.badge}</p>

                            <TrackedLink
                                href={`/go/${b.slug}?src=top3`}
                                broker={b.slug}
                                page="country"
                                cta="top3"
                                country={countryCode}
                                className="mt-3 inline-block text-green-400 text-sm"
                            >
                                Open →
                            </TrackedLink>
                        </article>
                    ))}
                </section>

                <h1 className="text-3xl font-bold">
                    Best Forex Brokers in {countryName}
                </h1>

                {/* JUMP LINKS */}
                <nav className="flex flex-wrap gap-2">
                    {[
                        ["quick-picks", "Quick Picks"],
                        ["top-brokers", "Top Brokers"],
                        ["comparison-table", "Compare"],
                        ["faq", "FAQ"],
                    ].map(([id, label]) => (
                        <a
                            key={id}
                            href={`#${id}`}
                            className="rounded-full border border-white/10 px-4 py-2 text-sm"
                        >
                            {label}
                        </a>
                    ))}
                </nav>
            </header>

            {/* ================= QUICK PICKS ================= */}
            <section id="quick-picks" className="scroll-mt-24 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {countryHighlights.map((item) => (
                    <div key={item.key} className="border p-4 rounded-xl">
                        <p className="text-xs text-gray-500">{item.title}</p>
                        <h3 className="font-semibold">
                            {item.broker?.name || "Explore"}
                        </h3>

                        {item.broker && (
                            <TrackedLink
                                href={`/go/${item.broker.slug}?src=highlight`}
                                broker={item.broker.slug}
                                page="country"
                                cta="highlight"
                                country={countryCode}
                                className="text-green-400 text-sm"
                            >
                                Open →
                            </TrackedLink>
                        )}
                    </div>
                ))}
            </section>

            {/* ================= BROKER LIST ================= */}
            <section id="top-brokers" className="scroll-mt-24 space-y-4">
                {rankedBrokers.map((b, i) => (
                    <article key={b.slug} className="border p-5 rounded-xl">
                        <div className="flex justify-between">
                            <div>
                                <h3 className="font-semibold">
                                    #{i + 1} {b.name}
                                </h3>
                                <p className="text-sm text-gray-400">
                                    {getBrokerReason(b)}
                                </p>
                            </div>

                            <TrackedLink
                                href={`/go/${b.slug}`}
                                broker={b.slug}
                                page="country"
                                cta="list"
                                country={countryCode}
                                className="bg-green-600 px-4 py-2 rounded-lg text-white"
                            >
                                Open
                            </TrackedLink>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-4">
                            {getBrokerHighlights(b).map((h) => (
                                <div key={h.label}>
                                    <p className="text-xs text-gray-500">{h.label}</p>
                                    <p className="text-sm">{h.value}</p>
                                </div>
                            ))}
                        </div>
                    </article>
                ))}
            </section>

            {/* ================= TABLE ================= */}
            <section id="comparison-table" className="scroll-mt-24">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr>
                                <th>Broker</th>
                                <th>Rating</th>
                                <th>Deposit</th>
                                <th>Platforms</th>
                                <th>Payments</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {comparisonRows.map((r) => (
                                <tr key={r.slug}>
                                    <td>{r.name}</td>
                                    <td>{r.rating}</td>
                                    <td>{r.minDeposit}</td>
                                    <td>{r.platforms}</td>
                                    <td>{r.payments}</td>
                                    <td>
                                        <TrackedLink
                                            href={`/go/${r.slug}`}
                                            broker={r.slug}
                                            page="country"
                                            cta="table"
                                            country={countryCode}
                                            className="text-green-400"
                                        >
                                            Open
                                        </TrackedLink>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* ================= FAQ ================= */}
            <section id="faq" className="scroll-mt-24 space-y-4">
                {faq.map((f, i) => (
                    <div key={i} className="border p-4 rounded-xl">
                        <h3 className="font-semibold">{f.question}</h3>
                        <p className="text-sm text-gray-400">{f.answer}</p>
                    </div>
                ))}
            </section>

            {/* FAQ SCHEMA */}
            <SchemaMarkup
                data={{
                    "@context": "https://schema.org",
                    "@type": "FAQPage",
                    mainEntity: faq.map((f) => ({
                        "@type": "Question",
                        name: f.question,
                        acceptedAnswer: {
                            "@type": "Answer",
                            text: f.answer,
                        },
                    })),
                }}
            />

            {/* ================= STICKY CTA ================= */}
            {topBroker && (
                <div className="fixed bottom-0 inset-x-0 bg-black border-t border-white/10 p-4 flex justify-between items-center">
                    <div>
                        <p className="text-xs text-gray-500">Top Pick</p>
                        <p className="text-sm">{topBroker.name}</p>
                    </div>

                    <TrackedLink
                        href={`/go/${topBroker.slug}?src=sticky`}
                        broker={topBroker.slug}
                        page="country"
                        cta="sticky"
                        country={countryCode}
                        className="bg-green-600 px-4 py-2 rounded-lg text-white"
                    >
                        Open
                    </TrackedLink>
                </div>
            )}
        </div>
    );
}