import Link from "next/link";
import type { Lang } from "@/lib/i18n";
import { getBaseUrl } from "@/lib/getBaseUrl";

/* ================= TYPES ================= */
type NewsItem = {
    id?: string;
    title: string;
    summary: string;
    time?: string;
    source?: string;
    url?: string;
};

type MarketNewsProps = {
    pair: string;
    lang: Lang;
    symbol?: string;
    marketName?: string;
    category?: string;
};

/* ================= HELPERS ================= */
function formatPair(pair: string) {
    const clean = pair.replace("/", "").toUpperCase();

    if (clean.length === 6) {
        return `${clean.slice(0, 3)}/${clean.slice(3)}`;
    }

    return pair.toUpperCase();
}

function formatTimestamp(value?: string) {
    if (!value) return "";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return date.toLocaleString(undefined, {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

async function getNews(pair: string): Promise<NewsItem[]> {
    try {
        const res = await fetch(`${getBaseUrl()}/api/market-news/${pair}`, {
            next: { revalidate: 300 },
        });

        if (!res.ok) {
            throw new Error("Failed market news fetch");
        }

        const data = await res.json();

        if (!Array.isArray(data)) {
            return [];
        }

        return data
            .map((item: any, index: number) => ({
                id: item.id ?? `${pair}-${index}`,
                title: item.title ?? item.headline ?? "Market Update",
                summary:
                    item.summary ??
                    item.description ??
                    item.teaser ??
                    "Latest market update for this trading pair.",
                time: item.time ?? item.date ?? item.publishedAt ?? "",
                source: item.source ?? item.provider ?? "Velmenora",
                url: item.url ?? "#",
            }))
            .filter((item: NewsItem) => item.title && item.summary)
            .slice(0, 6);
    } catch {
        return [];
    }
}

const text = {
    en: {
        latest: "Latest",
        news: "News",
        updated: "Updated live",
        more: "View more",
        fallbackTitle: "No market news available yet",
        fallbackSummary:
            "Fresh headlines and pair-specific updates will appear here once the news feed is connected.",
    },
    ar: {
        latest: "أحدث",
        news: "الأخبار",
        updated: "تحديث مباشر",
        more: "عرض المزيد",
        fallbackTitle: "لا توجد أخبار متاحة حالياً",
        fallbackSummary:
            "ستظهر هنا العناوين الجديدة والتحديثات الخاصة بهذا الزوج عند ربط موجز الأخبار.",
    },
    de: {
        latest: "Neueste",
        news: "Nachrichten",
        updated: "Live aktualisiert",
        more: "Mehr anzeigen",
        fallbackTitle: "Noch keine Marktnachrichten verfügbar",
        fallbackSummary:
            "Neue Schlagzeilen und marktspezifische Updates erscheinen hier, sobald der News-Feed verbunden ist.",
    },
    fr: {
        latest: "Dernières",
        news: "Actualités",
        updated: "Mis à jour en direct",
        more: "Voir plus",
        fallbackTitle: "Aucune actualité disponible pour le moment",
        fallbackSummary:
            "Les derniers titres et mises à jour spécifiques à cette paire apparaîtront ici une fois le flux connecté.",
    },
} satisfies Record<
    Lang,
    {
        latest: string;
        news: string;
        updated: string;
        more: string;
        fallbackTitle: string;
        fallbackSummary: string;
    }
>;

/* ================= COMPONENT ================= */
export default async function MarketNews({
    pair,
    lang,
    symbol,
    marketName,
}: MarketNewsProps) {
    const news = await getNews(pair);

    const t = text[lang];
    const formattedPair = formatPair(pair);

    if (!Array.isArray(news) || news.length === 0) {
        return (
            <section className="overflow-hidden rounded-3xl border border-white/10 bg-[linear-gradient(180deg,#0B0F1A_0%,#090D16_100%)]">
                <div className="border-b border-white/10 px-5 py-5 sm:px-6">
                    <div className="flex items-center justify-between gap-3">
                        <div>
                            <div className="mb-2 inline-flex items-center rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-cyan-300">
                                {t.latest} {formattedPair} {t.news}
                            </div>

                            <h2 className="text-2xl font-semibold tracking-tight text-white">
                                {marketName || symbol
                                    ? `${marketName ?? symbol} Headlines`
                                    : `${formattedPair} Headlines`}
                            </h2>
                        </div>

                        <span className="text-xs text-gray-500">{t.updated}</span>
                    </div>
                </div>

                <div className="px-5 py-10 sm:px-6">
                    <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] px-6 py-10">
                        <p className="text-lg font-semibold text-white">{t.fallbackTitle}</p>
                        <p className="mt-2 max-w-2xl text-sm text-gray-400">
                            {t.fallbackSummary}
                        </p>
                    </div>
                </div>
            </section>
        );
    }

    const [featured, ...rest] = news;
    const visible = rest.slice(0, 5);

    if (!featured) return null;

    return (
        <section className="overflow-hidden rounded-3xl border border-white/10 bg-[linear-gradient(180deg,#0B0F1A_0%,#090D16_100%)]">
            <div className="border-b border-white/10 px-5 py-5 sm:px-6">
                <div className="flex items-center justify-between gap-3">
                    <div>
                        <div className="mb-2 inline-flex items-center rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-cyan-300">
                            {t.latest} {formattedPair} {t.news}
                        </div>

                        <h2 className="text-2xl font-semibold tracking-tight text-white">
                            {marketName || symbol
                                ? `${marketName ?? symbol} Headlines`
                                : `${formattedPair} Headlines`}
                        </h2>
                    </div>

                    <span className="text-xs text-gray-500">{t.updated}</span>
                </div>
            </div>

            <div className="space-y-4 px-5 py-5 sm:px-6">
                <Link href={featured.url ?? "#"}>
                    <article className="group rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:border-white/20 hover:bg-white/[0.045]">
                        <p className="text-xl font-semibold leading-7 text-white transition group-hover:text-cyan-300">
                            {featured.title}
                        </p>

                        <p className="mt-3 text-sm leading-6 text-gray-400">
                            {featured.summary}
                        </p>

                        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-gray-500">
                            {featured.source && (
                                <span className="rounded-full border border-white/10 bg-black/20 px-2.5 py-1 text-gray-300">
                                    {featured.source}
                                </span>
                            )}
                            {featured.time && <span>{formatTimestamp(featured.time)}</span>}
                        </div>
                    </article>
                </Link>

                {visible.length > 0 && (
                    <div className="grid gap-3">
                        {visible.map((item, index) => (
                            <Link key={item.id ?? `${item.title}-${index}`} href={item.url ?? "#"}>
                                <article className="group rounded-2xl border border-white/10 bg-black/20 p-4 transition hover:border-white/20 hover:bg-white/[0.03]">
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="min-w-0">
                                            <p className="text-sm font-semibold leading-6 text-white transition group-hover:text-cyan-300">
                                                {item.title}
                                            </p>

                                            <p className="mt-1 line-clamp-2 text-sm text-gray-400">
                                                {item.summary}
                                            </p>

                                            <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] text-gray-500">
                                                {item.source && (
                                                    <span className="rounded-full border border-white/10 bg-white/[0.03] px-2 py-1 text-gray-300">
                                                        {item.source}
                                                    </span>
                                                )}
                                                {item.time && <span>{formatTimestamp(item.time)}</span>}
                                            </div>
                                        </div>

                                        <div className="pt-1 text-sm text-gray-500 transition group-hover:text-white">
                                            →
                                        </div>
                                    </div>
                                </article>
                            </Link>
                        ))}
                    </div>
                )}

                <Link
                    href={`/${lang}/country/news/${pair.toLowerCase()}`}
                    className="block w-full rounded-2xl border border-white/10 bg-white/[0.02] px-4 py-3 text-center text-sm font-medium text-white transition hover:border-white/20 hover:bg-white/[0.05]"
                >
                    {t.more} {formattedPair} {t.news} →
                </Link>
            </div>
        </section>
    );
}