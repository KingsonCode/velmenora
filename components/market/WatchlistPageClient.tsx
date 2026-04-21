"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Lang } from "@/lib/i18n";
import {
    formatPair,
    getWatchlist,
    removeFromWatchlist,
    type WatchlistItem,
} from "@/lib/watchlist";

type Props = {
    lang: Lang;
};

const text = {
    en: {
        title: "Your Watchlist",
        subtitle: "Track your saved markets and jump back into analysis quickly.",
        emptyTitle: "Your watchlist is empty",
        emptyText: "Save markets from any market page and they will appear here.",
        viewMarket: "Open Market",
        remove: "Remove",
        browseMarkets: "Browse Markets",
    },
    ar: {
        title: "قائمة المتابعة",
        subtitle: "تابع الأسواق المحفوظة وارجع بسرعة إلى التحليل.",
        emptyTitle: "قائمة المتابعة فارغة",
        emptyText: "احفظ الأسواق من صفحات الأسواق وستظهر هنا.",
        viewMarket: "فتح السوق",
        remove: "إزالة",
        browseMarkets: "تصفح الأسواق",
    },
    de: {
        title: "Deine Watchlist",
        subtitle:
            "Behalte gespeicherte Märkte im Blick und kehre schnell zur Analyse zurück.",
        emptyTitle: "Deine Watchlist ist leer",
        emptyText: "Speichere Märkte von den Marktseiten, dann erscheinen sie hier.",
        viewMarket: "Markt öffnen",
        remove: "Entfernen",
        browseMarkets: "Märkte ansehen",
    },
    fr: {
        title: "Votre liste de suivi",
        subtitle:
            "Suivez vos marchés enregistrés et revenez rapidement à l’analyse.",
        emptyTitle: "Votre liste de suivi est vide",
        emptyText:
            "Enregistrez des marchés depuis les pages de marché et ils apparaîtront ici.",
        viewMarket: "Ouvrir le marché",
        remove: "Retirer",
        browseMarkets: "Voir les marchés",
    },
} satisfies Record<
    Lang,
    {
        title: string;
        subtitle: string;
        emptyTitle: string;
        emptyText: string;
        viewMarket: string;
        remove: string;
        browseMarkets: string;
    }
>;

export default function WatchlistPageClient({ lang }: Props) {
    const t = text[lang];
    const [items, setItems] = useState<WatchlistItem[]>([]);

    useEffect(() => {
        setItems(getWatchlist());
    }, []);

    function handleRemove(pair: string) {
        const next = removeFromWatchlist(pair);
        setItems(next);
    }

    return (
        <section className="mx-auto max-w-7xl px-4 py-12">
            <div className="max-w-3xl">
                <h1 className="text-4xl font-bold tracking-tight">{t.title}</h1>
                <p className="mt-3 text-base text-gray-400">{t.subtitle}</p>
            </div>

            {items.length === 0 ? (
                <div className="mt-10 rounded-2xl border border-white/10 bg-white/[0.02] p-8">
                    <h2 className="text-xl font-semibold">{t.emptyTitle}</h2>
                    <p className="mt-2 text-sm text-gray-400">{t.emptyText}</p>

                    <Link
                        href={`/${lang}/country/markets`}
                        className="mt-5 inline-flex rounded-lg bg-blue-600 px-5 py-2 font-medium text-white transition hover:bg-blue-700"
                    >
                        {t.browseMarkets}
                    </Link>
                </div>
            ) : (
                <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {items.map((item) => {
                        const formatted = formatPair(item.pair);
                        const label = item.name ?? formatted;

                        return (
                            <div
                                key={item.pair}
                                className="rounded-2xl border border-white/10 bg-[#0B0F1A] p-5"
                            >
                                <h2 className="text-xl font-semibold">{label}</h2>
                                <p className="mt-1 text-sm text-gray-400">{formatted}</p>

                                <div className="mt-5 flex gap-3">
                                    <Link
                                        href={`/${lang}/country/markets/${item.pair}`}
                                        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
                                    >
                                        {t.viewMarket}
                                    </Link>

                                    <button
                                        type="button"
                                        onClick={() => handleRemove(item.pair)}
                                        className="rounded-lg border border-gray-700 px-4 py-2 text-sm transition hover:border-gray-500"
                                    >
                                        {t.remove}
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </section>
    );
}