import { notFound } from "next/navigation";
import { headers } from "next/headers";
import Link from "next/link";
import type { Metadata } from "next";

import { getBroker, getRelatedBrokers } from "@/lib/brokers";
import { resolveGeo } from "@/lib/geo";

const BASE_URL = "https://velmenora.com";

const SUPPORTED_LANGUAGES =
    ["en", "ar", "de", "fr"] as const;

type SupportedLanguage =
    (typeof SUPPORTED_LANGUAGES)[number];

const LANGUAGE_LOCALES:
    Record<SupportedLanguage, string> = {
        en: "en_US",
        ar: "ar_AR",
        de: "de_DE",
        fr: "fr_FR",
    };

function isSupportedLanguage(
    lang: string
): lang is SupportedLanguage {
    return SUPPORTED_LANGUAGES.includes(
        lang as SupportedLanguage
    );
}

function buildBrokerUrl(
    lang: SupportedLanguage,
    slug: string
) {
    return `${BASE_URL}/${lang}/brokers/${slug}`;
}

function buildLanguageAlternates(slug: string) {
    const languages: Record<string, string> =
        Object.fromEntries(
            SUPPORTED_LANGUAGES.map((lang) => [
                lang,
                buildBrokerUrl(lang, slug),
            ])
        );

    languages["x-default"] =
        buildBrokerUrl("en", slug);

    return languages;
}

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
function getTranslations(
    lang: SupportedLanguage,
    brokerName: string,
    geoLabel: string
) {
    switch (lang) {
        case "de":
            return {
                title: `${brokerName} Bewertung (${geoLabel}) – Konditionen und Plattformen`,
                description: `Unabhängige Übersicht zu ${brokerName}, einschließlich Plattformen, Spreads, Auszahlungen und wichtiger Prüfpunkte.`,
                intro1: `Diese Übersicht fasst öffentlich verfügbare Informationen zu ${brokerName} und seinen Handelsbedingungen zusammen.`,
                intro2: `Prüfe Regulierung, Gebühren, Plattformbedingungen und Risikohinweise direkt beim Anbieter, bevor du ein Konto eröffnest.`,
                compare: `${brokerName} vergleichen`,
                home: "Startseite",
                brokers: "Broker",
                disclosure: "Broker-Verfügbarkeit und Bedingungen können je nach Land variieren. Prüfe Regulierung, Gebühren und Risikohinweise direkt beim Anbieter.",
            };

        case "ar":
            return {
                title: `مراجعة ${brokerName} (${geoLabel}) — الشروط والمنصات`,
                description: `نظرة مستقلة على ${brokerName} تشمل المنصات وفروق الأسعار والسحب ونقاط التحقق المهمة.`,
                intro1: `تلخص هذه الصفحة المعلومات المتاحة علناً حول ${brokerName} وشروط التداول الخاصة به.`,
                intro2: `تحقق من التنظيم والرسوم وشروط المنصة وتحذيرات المخاطر مباشرة من مقدم الخدمة قبل فتح حساب.`,
                compare: `قارن ${brokerName}`,
                home: "الرئيسية",
                brokers: "الوسطاء",
                disclosure: "قد يختلف توفر الوسيط وشروطه حسب البلد. تحقق من التنظيم والرسوم وتحذيرات المخاطر مباشرة من مقدم الخدمة.",
            };

        case "fr":
            return {
                title: `Avis ${brokerName} (${geoLabel}) — Conditions et plateformes`,
                description: `Présentation indépendante de ${brokerName}, notamment ses plateformes, spreads, retraits et principaux points de vérification.`,
                intro1: `Cette page résume les informations publiques concernant ${brokerName} et ses conditions de trading.`,
                intro2: `Vérifiez la réglementation, les frais, les conditions de plateforme et les avertissements de risque auprès du fournisseur avant d’ouvrir un compte.`,
                compare: `Comparer ${brokerName}`,
                home: "Accueil",
                brokers: "Courtiers",
                disclosure: "La disponibilité et les conditions du courtier peuvent varier selon le pays. Vérifiez la réglementation, les frais et les avertissements de risque auprès du fournisseur.",
            };

        default:
            return {
                title: `${brokerName} Review (${geoLabel}) — Conditions and Platforms`,
                description: `Independent overview of ${brokerName}, including platforms, spreads, withdrawals, and important verification points.`,
                intro1: `This review summarises publicly available information about ${brokerName} and its trading conditions.`,
                intro2: `Verify regulation, fees, platform terms, and risk disclosures directly with the provider before opening an account.`,
                compare: `Compare ${brokerName}`,
                home: "Home",
                brokers: "Brokers",
                disclosure: "Broker availability and terms can vary by country. Verify regulation, fees, and risk disclosures directly with the provider.",
            };
    }
}

/* ================= RTL SUPPORT ================= */
function isRTL(lang: SupportedLanguage) {
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
export async function generateMetadata({
    params,
}: Props): Promise<Metadata> {
    const {
        broker: slug,
        lang,
    } = await params;

    const broker = getBroker(slug);

    if (
        !broker ||
        !isSupportedLanguage(lang)
    ) {
        return {
            title: "Broker Review Not Found | Velmenora",
            robots: {
                index: false,
                follow: false,
            },
        };
    }

    const t =
        getTranslations(lang, broker.name, "Global");

    const canonical =
        buildBrokerUrl(lang, broker.slug);

    const alternateLocale =
        SUPPORTED_LANGUAGES
            .filter((candidate) => candidate !== lang)
            .map((candidate) =>
                LANGUAGE_LOCALES[candidate]
            );

    return {
        title: t.title,
        description: t.description,
        authors: [
            {
                name: "Velmenora Research",
                url: `${BASE_URL}/`,
            },
        ],
        publisher: "Velmenora",
        alternates: {
            canonical,
            languages:
                buildLanguageAlternates(broker.slug),
        },
        openGraph: {
            type: "website",
            title: t.title,
            description: t.description,
            url: canonical,
            siteName: "Velmenora",
            locale: LANGUAGE_LOCALES[lang],
            alternateLocale,
            images: [
                {
                    url: `${BASE_URL}/og-default.jpg`,
                    width: 1200,
                    height: 630,
                    alt: `${broker.name} broker review by Velmenora`,
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title: t.title,
            description: t.description,
            images: [`${BASE_URL}/og-default.jpg`],
        },
        robots: {
            index: true,
            follow: true,
        },
    };
}

/* ================= PAGE ================= */
export default async function BrokerLangPage({ params }: Props) {
    const {
        broker: slug,
        lang: requestedLanguage,
    } = await params;

    if (!isSupportedLanguage(requestedLanguage)) {
        return notFound();
    }

    const lang = requestedLanguage;

    const broker = getBroker(slug);
    if (!broker) return notFound();

    const req = await buildRequestFromHeaders();
    const geo = resolveGeo(req);

    const { config, payments, intent } = geo;

    const geoLabel = config?.seo?.keyword_modifier || "Global";

    const t = getTranslations(
        lang,
        broker.name,
        geoLabel
    );

    const seoT = getTranslations(
        lang,
        broker.name,
        "Global"
    );

    const rtl = isRTL(lang);

    const related =
        getRelatedBrokers(broker.slug, 3);

    const canonical =
        buildBrokerUrl(lang, broker.slug);

    const breadcrumbId =
        `${canonical}#breadcrumb`;

    const structuredData = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "WebPage",
                "@id": `${canonical}#webpage`,
                url: canonical,
                name: seoT.title,
                description: seoT.description,
                inLanguage: lang,
                isPartOf: {
                    "@id": `${BASE_URL}/#website`,
                },
                publisher: {
                    "@id": `${BASE_URL}/#organization`,
                },
                about: {
                    "@type": "Organization",
                    name: broker.name,
                },
                breadcrumb: {
                    "@id": breadcrumbId,
                },
            },
            {
                "@type": "BreadcrumbList",
                "@id": breadcrumbId,
                itemListElement: [
                    {
                        "@type": "ListItem",
                        position: 1,
                        name: t.home,
                        item: `${BASE_URL}/`,
                    },
                    {
                        "@type": "ListItem",
                        position: 2,
                        name: t.brokers,
                        item: `${BASE_URL}/brokers`,
                    },
                    {
                        "@type": "ListItem",
                        position: 3,
                        name: broker.name,
                        item: canonical,
                    },
                ],
            },
        ],
    };

    return (
        <>
            <script
                id="velmenora-broker-structured-data"
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(
                        structuredData
                    ).replace(/</g, "\\u003c"),
                }}
            />
            <main
            dir={rtl ? "rtl" : "ltr"}
            className={`w-full max-w-7xl mx-auto px-6 py-12 ${rtl ? "text-right" : ""
                }`}
        >
            <nav
                aria-label="Breadcrumb"
                className="mb-6 flex flex-wrap items-center gap-2 text-sm text-gray-400"
            >
                <Link
                    href="/"
                    className="transition hover:text-white"
                >
                    {t.home}
                </Link>
                <span aria-hidden="true">/</span>
                <Link
                    href="/brokers"
                    className="transition hover:text-white"
                >
                    {t.brokers}
                </Link>
                <span aria-hidden="true">/</span>
                <span aria-current="page">
                    {broker.name}
                </span>
            </nav>

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

            <aside
                className="mb-10 rounded-xl border border-amber-400/20 bg-amber-400/5 p-5 text-sm leading-relaxed text-gray-300"
                aria-label="Broker review disclosure"
            >
                {t.disclosure}
            </aside>

            {/* CTA */}
            <BrokerCTA broker={broker} />

            {/* STICKY CTA */}
            <StickyCTA broker={broker} />
            </main>
        </>
    );
}
