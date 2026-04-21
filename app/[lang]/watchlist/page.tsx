import type { Metadata } from "next";
import { notFound } from "next/navigation";

import type { Lang } from "@/lib/i18n";
import WatchlistPageClient from "@/components/market/WatchlistPageClient";

const SUPPORTED_LANGS = ["en", "ar", "de", "fr"] as const;

type PageParams = Promise<{ lang: string }>;

function isValidLang(value: string): value is Lang {
    return SUPPORTED_LANGS.includes(value as Lang);
}

const copy = {
    en: {
        title: "Your Watchlist | Velmenora",
        description: "View and manage your saved forex, metals, and crypto markets.",
    },
    ar: {
        title: "قائمة المتابعة | Velmenora",
        description: "اعرض وأدر الأسواق المحفوظة من الفوركس والمعادن والعملات الرقمية.",
    },
    de: {
        title: "Deine Watchlist | Velmenora",
        description: "Verwalte deine gespeicherten Forex-, Metall- und Kryptomärkte.",
    },
    fr: {
        title: "Votre liste de suivi | Velmenora",
        description:
            "Consultez et gérez vos marchés forex, métaux et crypto enregistrés.",
    },
} satisfies Record<Lang, { title: string; description: string }>;

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
            title: "Watchlist | Velmenora",
            description: "Manage your saved markets.",
        };
    }

    return {
        title: copy[lang].title,
        description: copy[lang].description,
        alternates: {
            canonical: `/${lang}/country/watchlist`,
        },
        openGraph: {
            title: copy[lang].title,
            description: copy[lang].description,
            url: `/${lang}/country/watchlist`,
            siteName: "Velmenora",
            type: "website",
        },
        twitter: {
            card: "summary_large_image",
            title: copy[lang].title,
            description: copy[lang].description,
        },
    };
}

export default async function WatchlistPage({
    params,
}: {
    params: PageParams;
}) {
    const { lang } = await params;

    if (!isValidLang(lang)) {
        notFound();
    }

    return (
        <main className="min-h-screen bg-black text-white">
            <WatchlistPageClient lang={lang} />
        </main>
    );
}