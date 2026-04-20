import type { Metadata } from "next";
import { notFound } from "next/navigation";

import TopMarkets from "@/components/TopMarkets";
import EconomicCalendarSection from "@/components/market/EconomicCalendarSection";

const SUPPORTED_LANGS = ["en", "ar", "de", "fr"] as const;
type Lang = (typeof SUPPORTED_LANGS)[number];

type PageParams = Promise<{ lang: string }>;

function isValidLang(value: string): value is Lang {
    return SUPPORTED_LANGS.includes(value as Lang);
}

const copy: Record<
    Lang,
    {
        title: string;
        description: string;
        badge: string;
        heroTitle: string;
        heroText: string;
        overviewTitle: string;
        overviewText: string;
        opportunitiesTitle: string;
        opportunitiesText: string;
        researchTitle: string;
        researchText: string;
    }
> = {
    en: {
        title: "Forex Markets | Velmenora",
        description:
            "Explore major forex pairs, gold, crypto markets, live sentiment, real economic events, and trading opportunities.",
        badge: "Live Market Hub",
        heroTitle: "Forex Markets",
        heroText:
            "Track major currency pairs, gold, and crypto markets with live insights, economic events, sentiment, and broker discovery.",
        overviewTitle: "Market Overview",
        overviewText:
            "Follow major forex pairs, metals, and crypto instruments from one clean hub built for comparison, sentiment, macro context, and deeper research.",
        opportunitiesTitle: "Live Opportunities",
        opportunitiesText:
            "Jump from overview pages into individual market pages for chart, pair-specific news, economic events, and broker-focused conversion paths.",
        researchTitle: "Market Research Flow",
        researchText:
            "Use this section as your market intelligence hub, then connect that traffic into compare pages, broker reviews, and affiliate funnels.",
    },
    ar: {
        title: "أسواق الفوركس | Velmenora",
        description:
            "استكشف أزواج الفوركس الرئيسية والذهب والعملات الرقمية ومعنويات السوق والأحداث الاقتصادية المباشرة.",
        badge: "مركز الأسواق المباشر",
        heroTitle: "أسواق الفوركس",
        heroText:
            "تابع أزواج العملات الرئيسية والذهب والعملات الرقمية مع الرؤى المباشرة والأحداث الاقتصادية ومعنويات السوق واكتشاف الوسطاء.",
        overviewTitle: "نظرة عامة على السوق",
        overviewText:
            "تابع أزواج الفوركس الرئيسية والمعادن والعملات الرقمية من مركز واحد منظم للمقارنة ومعنويات السوق والسياق الاقتصادي والبحث الأعمق.",
        opportunitiesTitle: "فرص مباشرة",
        opportunitiesText:
            "انتقل من صفحات النظرة العامة إلى صفحات الأسواق الفردية للحصول على الرسم البياني والأخبار الخاصة بالزوج والأحداث الاقتصادية ومسارات التحويل الخاصة بالوسطاء.",
        researchTitle: "مسار بحث السوق",
        researchText:
            "استخدم هذا القسم كمركز لذكاء السوق، ثم اربط هذا الترافيك بصفحات المقارنة ومراجعات الوسطاء ومسارات الأفلييت.",
    },
    de: {
        title: "Forex-Märkte | Velmenora",
        description:
            "Entdecke wichtige Forex-Paare, Gold, Kryptomärkte, Live-Sentiment und reale Wirtschaftstermine.",
        badge: "Live-Markt-Hub",
        heroTitle: "Forex-Märkte",
        heroText:
            "Verfolge große Währungspaare, Gold und Kryptomärkte mit Live-Einblicken, Wirtschaftsterminen, Sentiment und Broker-Optionen.",
        overviewTitle: "Marktüberblick",
        overviewText:
            "Beobachte große Forex-Paare, Metalle und Krypto-Instrumente in einem klaren Hub für Vergleich, Sentiment, Makro-Kontext und tiefere Analyse.",
        opportunitiesTitle: "Live-Chancen",
        opportunitiesText:
            "Wechsle von Übersichtsseiten zu einzelnen Marktseiten für Charts, paarspezifische Nachrichten, Wirtschaftstermine und brokerbezogene Conversion-Pfade.",
        researchTitle: "Markt-Research-Flow",
        researchText:
            "Nutze diesen Bereich als Marktintelligenz-Hub und leite den Traffic dann in Vergleichsseiten, Broker-Reviews und Affiliate-Funnels weiter.",
    },
    fr: {
        title: "Marchés Forex | Velmenora",
        description:
            "Découvrez les principales paires forex, l’or, les cryptos, le sentiment du marché et les événements économiques en direct.",
        badge: "Hub de marché en direct",
        heroTitle: "Marchés Forex",
        heroText:
            "Suivez les principales paires de devises, l’or et les marchés crypto avec des analyses en direct, des événements économiques, le sentiment du marché et la découverte de brokers.",
        overviewTitle: "Vue d’ensemble du marché",
        overviewText:
            "Suivez les principales paires forex, les métaux et les cryptos depuis un hub clair conçu pour la comparaison, le sentiment, le contexte macro et une recherche plus poussée.",
        opportunitiesTitle: "Opportunités en direct",
        opportunitiesText:
            "Passez des pages d’aperçu aux pages de marché individuelles pour les graphiques, les actualités spécifiques à la paire, les événements économiques et les parcours de conversion liés aux brokers.",
        researchTitle: "Flux de recherche marché",
        researchText:
            "Utilisez cette section comme hub d’intelligence de marché, puis reliez ce trafic aux pages de comparaison, aux avis brokers et aux funnels affiliés.",
    },
};

export function generateStaticParams(): Array<{ lang: Lang }> {
    return SUPPORTED_LANGS.map((lang) => ({ lang }));
}

export async function generateMetadata({
    params,
}: {
    params: PageParams;
}): Promise<Metadata> {
    const { lang } = await params;

    if (!isValidLang(lang)) {
        return {
            title: "Markets | Velmenora",
            description: "Explore market opportunities on Velmenora.",
        };
    }

    const t = copy[lang];

    return {
        title: t.title,
        description: t.description,
        alternates: {
            canonical: `/${lang}/markets`,
        },
        openGraph: {
            title: t.title,
            description: t.description,
            url: `/${lang}/markets`,
            siteName: "Velmenora",
            type: "website",
        },
        twitter: {
            card: "summary_large_image",
            title: t.title,
            description: t.description,
        },
    };
}

export default async function MarketsPage({
    params,
}: {
    params: PageParams;
}) {
    const { lang } = await params;

    if (!isValidLang(lang)) {
        notFound();
    }

    const t = copy[lang];

    return (
        <main className="min-h-screen bg-black text-white">
            <section className="border-b border-white/10">
                <div className="mx-auto max-w-7xl px-4 pt-24 pb-12">
                    <div className="max-w-3xl">
                        <span className="mb-4 inline-flex rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-300">
                            {t.badge}
                        </span>

                        <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
                            {t.heroTitle}
                        </h1>

                        <p className="mt-4 text-base leading-7 text-gray-400 md:text-lg">
                            {t.heroText}
                        </p>
                    </div>
                </div>
            </section>

            <section className="py-4">
                <TopMarkets lang={lang} />
            </section>

            <EconomicCalendarSection />

            <section className="mx-auto max-w-7xl px-4 py-12">
                <div className="grid gap-6 md:grid-cols-3">
                    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
                        <h2 className="text-lg font-semibold">{t.overviewTitle}</h2>
                        <p className="mt-3 text-sm leading-6 text-gray-400">
                            {t.overviewText}
                        </p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
                        <h2 className="text-lg font-semibold">{t.opportunitiesTitle}</h2>
                        <p className="mt-3 text-sm leading-6 text-gray-400">
                            {t.opportunitiesText}
                        </p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
                        <h2 className="text-lg font-semibold">{t.researchTitle}</h2>
                        <p className="mt-3 text-sm leading-6 text-gray-400">
                            {t.researchText}
                        </p>
                    </div>
                </div>
            </section>
        </main>
    );
}