"use client";

import { useEffect, useState } from "react";
import type { Lang } from "@/lib/i18n";
import { isInWatchlist, toggleWatchlist } from "@/lib/watchlist";

type Props = {
    pair: string;
    lang: Lang;
    name?: string;
    className?: string;
};

const text = {
    en: {
        add: "+ Watchlist",
        saved: "✓ Saved",
    },
    ar: {
        add: "+ قائمة المتابعة",
        saved: "✓ محفوظ",
    },
    de: {
        add: "+ Watchlist",
        saved: "✓ Gespeichert",
    },
    fr: {
        add: "+ Liste de suivi",
        saved: "✓ Enregistré",
    },
} satisfies Record<Lang, { add: string; saved: string }>;

export default function WatchlistButton({
    pair,
    lang,
    name,
    className,
}: Props) {
    const t = text[lang];
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        setSaved(isInWatchlist(pair));
    }, [pair]);

    function handleClick() {
        const payload = {
            pair,
            ...(name ? { name } : {}),
        };

        const result = toggleWatchlist(payload);
        setSaved(result.saved);
    }

    return (
        <button
            type="button"
            onClick={handleClick}
            className={
                className ??
                "rounded-lg border border-gray-700 px-5 py-2 transition hover:border-gray-500"
            }
        >
            {saved ? t.saved : t.add}
        </button>
    );
}