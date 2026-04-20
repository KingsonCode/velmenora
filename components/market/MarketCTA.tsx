import { getAllBrokers, getTopBrokers } from "@/lib/brokers";
import type { Lang } from "@/lib/i18n";
import type { Category, CountryCode } from "@/lib/types/broker";

/* ================= HELPERS ================= */
function getCategory(pair: string): Category {
    const upper = pair.toUpperCase();

    if (upper.includes("XAU") || upper.includes("XAG")) return "CFD";
    if (upper.includes("BTC") || upper.includes("ETH")) return "CRYPTO";
    return "FOREX";
}

function formatPair(pair: string) {
    const clean = pair.replace("/", "").toUpperCase();

    if (clean.length === 6) {
        return `${clean.slice(0, 3)}/${clean.slice(3)}`;
    }

    return pair.toUpperCase();
}

function formatFeature(feature: string) {
    return feature
        .replace(/_/g, " ")
        .toLowerCase()
        .replace(/\b\w/g, (char) => char.toUpperCase());
}

/* ================= TYPES ================= */
type Props = {
    pair: string;
    lang: Lang;
    country?: CountryCode;
};

const text = {
    en: {
        tradeWith: "Trade",
        with: "with",
        ratedBroker: "Rated Broker",
        openFreeAccount: "Open Free Account",
        fastSignup: "Fast signup",
        noDeposit: "No deposit required",
        tailoredFor: "Broker selection tailored for",
        globalAvailability: "Broker selection based on global availability",
        finalCta: "Ready to Trade",
        trustedMatch: "Trusted Broker Match",
        whyChoose: "Why choose this broker",
        startNow: "Start Now",
    },
    ar: {
        tradeWith: "تداول",
        with: "مع",
        ratedBroker: "وسيط مُصنّف",
        openFreeAccount: "افتح حساباً مجانياً",
        fastSignup: "تسجيل سريع",
        noDeposit: "لا حاجة لإيداع",
        tailoredFor: "اختيار الوسيط مخصص لـ",
        globalAvailability: "اختيار الوسيط مبني على التوفر العالمي",
        finalCta: "جاهز للتداول",
        trustedMatch: "وسيط موثوق مناسب",
        whyChoose: "لماذا تختار هذا الوسيط",
        startNow: "ابدأ الآن",
    },
    de: {
        tradeWith: "Trade",
        with: "mit",
        ratedBroker: "Bewerteter Broker",
        openFreeAccount: "Kostenloses Konto eröffnen",
        fastSignup: "Schnelle Anmeldung",
        noDeposit: "Keine Einzahlung erforderlich",
        tailoredFor: "Broker-Auswahl zugeschnitten auf",
        globalAvailability: "Broker-Auswahl basierend auf globaler Verfügbarkeit",
        finalCta: "Bereit zum Traden",
        trustedMatch: "Passender vertrauenswürdiger Broker",
        whyChoose: "Warum diesen Broker wählen",
        startNow: "Jetzt starten",
    },
    fr: {
        tradeWith: "Trader",
        with: "avec",
        ratedBroker: "Broker noté",
        openFreeAccount: "Ouvrir un compte gratuit",
        fastSignup: "Inscription rapide",
        noDeposit: "Aucun dépôt requis",
        tailoredFor: "Sélection de broker adaptée pour",
        globalAvailability: "Sélection de broker basée sur la disponibilité globale",
        finalCta: "Prêt à trader",
        trustedMatch: "Broker fiable recommandé",
        whyChoose: "Pourquoi choisir ce broker",
        startNow: "Commencer maintenant",
    },
} satisfies Record<
    Lang,
    {
        tradeWith: string;
        with: string;
        ratedBroker: string;
        openFreeAccount: string;
        fastSignup: string;
        noDeposit: string;
        tailoredFor: string;
        globalAvailability: string;
        finalCta: string;
        trustedMatch: string;
        whyChoose: string;
        startNow: string;
    }
>;

export default function MarketCTA({ pair, lang, country }: Props) {
    const t = text[lang];
    const formattedPair = formatPair(pair);
    const category = getCategory(pair);

    const broker =
        getAllBrokers().find(
            (item) =>
                item.category.includes(category) &&
                (!country ||
                    !item.countries ||
                    item.countries.includes(country) ||
                    item.countries.includes("GLOBAL"))
        ) ?? getTopBrokers(country, 1)[0];

    if (!broker) return null;

    const primaryFeature = formatFeature(
        broker.features?.[0] ?? "Trusted trading conditions"
    );
    const secondaryFeature = formatFeature(
        broker.features?.[1] ?? "Fast execution"
    );
    const tertiaryFeature = formatFeature(
        broker.features?.[2] ?? "Reliable platform"
    );

    return (
        <section className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,#0B0F1A_0%,#090D16_100%)] shadow-[0_0_0_1px_rgba(255,255,255,0.02)]">
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute left-0 top-0 h-48 w-48 rounded-full bg-cyan-500/10 blur-3xl" />
                <div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-blue-500/10 blur-3xl" />
            </div>

            <div className="relative border-b border-white/10 px-5 py-6 sm:px-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                    <div className="max-w-3xl">
                        <div className="mb-3 inline-flex items-center rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-cyan-300">
                            {t.finalCta}
                        </div>

                        <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                            {t.tradeWith} {formattedPair} {t.with} {broker.name}
                        </h2>

                        <p className="mt-3 text-sm leading-6 text-gray-400 sm:text-[15px]">
                            {country
                                ? `${t.tailoredFor} ${country}`
                                : t.globalAvailability}
                        </p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-gray-300">
                        <div className="text-[11px] uppercase tracking-[0.16em] text-gray-500">
                            {t.trustedMatch}
                        </div>
                        <div className="mt-1 text-lg font-semibold text-white">
                            ⭐ {broker.rating} / 5
                        </div>
                    </div>
                </div>
            </div>

            <div className="relative grid gap-6 px-5 py-5 sm:px-6 lg:grid-cols-[minmax(0,1fr)_260px]">
                <div>
                    <div className="mb-4 flex flex-wrap items-center gap-2">
                        {broker.tags?.[0] && (
                            <span className="inline-flex rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-medium text-cyan-300">
                                {broker.tags[0]}
                            </span>
                        )}

                        <span className="inline-flex rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-medium text-gray-300">
                            {t.ratedBroker}
                        </span>
                    </div>

                    <p className="max-w-2xl text-sm leading-6 text-gray-400">
                        {primaryFeature} • {secondaryFeature} • {tertiaryFeature}
                    </p>

                    <div className="mt-5">
                        <div className="mb-3 text-[11px] uppercase tracking-[0.16em] text-gray-500">
                            {t.whyChoose}
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {[primaryFeature, secondaryFeature, tertiaryFeature].map((feature, index) => (
                                <span
                                    key={`${broker.slug}-cta-feature-${index}`}
                                    className="inline-flex rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-gray-300"
                                >
                                    {feature}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="mt-6 flex flex-wrap gap-3 text-xs text-gray-400">
                        <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1.5">
                            ⚡ {t.fastSignup}
                        </span>
                        <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1.5">
                            ✓ {t.noDeposit}
                        </span>
                    </div>
                </div>

                <div className="flex flex-col justify-between rounded-[24px] border border-white/10 bg-black/20 p-5">
                    <div>
                        <div className="text-[11px] uppercase tracking-[0.16em] text-gray-500">
                            {t.startNow}
                        </div>

                        <div className="mt-2 text-xl font-semibold tracking-tight text-white">
                            {broker.name}
                        </div>

                        <p className="mt-2 text-sm text-gray-400">
                            {formattedPair} {t.with} {broker.name}
                        </p>
                    </div>

                    <a
                        href={`/go/${broker.slug}?src=cta_${pair.toLowerCase()}`}
                        className="mt-6 inline-flex items-center justify-center rounded-2xl bg-cyan-500 px-5 py-3 text-sm font-semibold text-black transition hover:bg-cyan-400"
                    >
                        {t.openFreeAccount} →
                    </a>
                </div>
            </div>
        </section>
    );
}