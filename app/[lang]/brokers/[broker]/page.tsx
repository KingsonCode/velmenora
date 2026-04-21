import { notFound } from "next/navigation";
import { headers } from "next/headers";
import type { Metadata } from "next";

import { getBroker, getRelatedBrokers } from "@/lib/brokers";
import { resolveGeo } from "@/lib/geo";

/* 🔥 COMPONENTS */
import BrokerHeroCard from "@/components/broker/BrokerHeroCard";
import BrokerStatsGrid from "@/components/broker/BrokerStatsGrid";
import BrokerTrustCard from "@/components/broker/BrokerTrustCard";
import BrokerCTA from "@/components/broker/BrokerCTA";
import StickyCTA from "@/components/broker/StickyCTA";

/* ================= TYPES ================= */
type Props = {
    params: Promise<{
        broker: string;
        lang: string;
    }>;
};

/* ================= LANG ENGINE ================= */
function getTranslations(lang: string, brokerName: string, geoLabel: string) {
    switch (lang) {
        case "de":
            return {
                title: `${brokerName} Bewertung (${geoLabel}) – Lohnt es sich?`,
                description: `Vollständige Bewertung von ${brokerName} mit Spreads, Auszahlungen und Plattformen.`,
                intro1: `${brokerName} ist einer der zuverlässigsten Forex-Broker weltweit.`,
                intro2: `Trader in ${geoLabel} bevorzugen ${brokerName} wegen schneller Ausführung und stabiler Plattform.`,
                compare: `Vergleiche ${brokerName}`,
                cta: `Jetzt Konto eröffnen`,
            };

        case "ar":
            return {
                title: `مراجعة ${brokerName} (${geoLabel}) — هل يستحق؟`,
                description: `مراجعة كاملة لـ ${brokerName} تشمل السبريد والسحب والمنصات.`,
                intro1: `${brokerName} هو أحد أكثر الوسطاء موثوقية عالميًا.`,
                intro2: `المتداولون في ${geoLabel} يفضلون ${brokerName} بسبب السرعة والموثوقية.`,
                compare: `قارن ${brokerName}`,
                cta: `ابدأ التداول الآن`,
            };

        default:
            return {
                title: `${brokerName} Review (${geoLabel}) — Is It Worth It?`,
                description: `Full ${brokerName} review covering spreads, withdrawals, platforms.`,
                intro1: `${brokerName} is one of the most trusted forex brokers globally.`,
                intro2: `Traders in ${geoLabel} prefer ${brokerName} due to its execution speed.`,
                compare: `Compare ${brokerName}`,
                cta: `Open Account Now`,
            };
    }
}

/* ================= RTL SUPPORT ================= */
function isRTL(lang: string) {
    return lang === "ar";
}

/* ================= HELPER ================= */
async function buildRequestFromHeaders() {
    const h = await headers();

    return {
        headers: h,
        nextUrl: { searchParams: new URLSearchParams() },
        cookies: { get: () => undefined },
    } as any;
}

/* ================= SEO ================= */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { broker: slug, lang } = await params;

    const broker = getBroker(slug);
    if (!broker) return {};

    const geoLabel = "Global";

    const t = getTranslations(lang, broker.name, geoLabel);

    return {
        title: t.title,
        description: t.description,
    };
}

/* ================= PAGE ================= */
export default async function BrokerLangPage({ params }: Props) {
    const { broker: slug, lang } = await params;

    const broker = getBroker(slug);
    if (!broker) return notFound();

    const req = await buildRequestFromHeaders();
    const geo = resolveGeo(req);

    const { config, payments, intent } = geo;

    const geoLabel = config?.seo?.keyword_modifier || "Global";

    const t = getTranslations(lang, broker.name, geoLabel);

    const rtl = isRTL(lang);

    const related = getRelatedBrokers(broker.slug, 3);

    return (
        <main
            dir={rtl ? "rtl" : "ltr"}
            className={`w-full max-w-7xl mx-auto px-6 py-12 ${rtl ? "text-right" : ""
                }`}
        >
            {/* 🌍 LANGUAGE */}
            <div className="mb-6 text-sm text-gray-400">
                {lang.toUpperCase()}
            </div>

            {/* HERO */}
            <BrokerHeroCard broker={broker} geoLabel={geoLabel} />

            {/* STATS */}
            <BrokerStatsGrid broker={broker} payments={payments} />

            {/* TRUST */}
            <BrokerTrustCard broker={broker} />

            {/* SEO CONTENT */}
            <section className="mb-20 bg-gray-900 p-10 rounded-2xl border border-gray-800">
                <h2 className="text-2xl font-bold mb-4">
                    {t.title}
                </h2>

                <p className="text-gray-400 leading-relaxed mb-4">
                    {t.intro1}
                </p>

                <p className="text-gray-400 leading-relaxed">
                    {t.intro2}
                </p>
            </section>

            {/* RELATED */}
            {related.length > 0 && (
                <section className="mb-24">
                    <h2 className="text-2xl font-bold mb-6">
                        {t.compare}
                    </h2>

                    <div className="grid md:grid-cols-3 gap-6">
                        {related.map((b) => (
                            <a
                                key={b.slug}
                                href={`/${lang}/country/brokers/${b.slug}`}
                                className="bg-gray-900 p-6 rounded-2xl border border-gray-800 hover:border-gray-600 transition"
                            >
                                <h3 className="font-semibold mb-2">
                                    {b.name}
                                </h3>

                                <p className="text-gray-400 text-sm">
                                    {b.features?.join(", ")}
                                </p>

                                <div className="mt-4 text-green-400 text-sm">
                                    →
                                </div>
                            </a>
                        ))}
                    </div>
                </section>
            )}

            {/* CTA */}
            <BrokerCTA broker={broker} />

            {/* STICKY CTA */}
            <StickyCTA broker={broker} />
        </main>
    );
}
