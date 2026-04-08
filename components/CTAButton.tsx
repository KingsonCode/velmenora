"use client";

import { event } from "@/lib/gtag";

/* 🔥 POSITION TYPE (EXPANDED + FUTURE SAFE) */
type Position =
    | "hero"
    | "mid"
    | "bottom"
    | "sticky"
    | "card"
    | "compare"
    | "table"
    | "unknown";

type Props = {
    broker: string;
    country?: string;
    href?: string;
    text?: string;
    className?: string;
    position?: Position;
    onClick?: () => void;
};

/* 🔥 CENTRALIZED AFFILIATE LINKS */
const AFFILIATE_LINKS: Record<string, string> = {
    exness: "https://one.exnessonelink.com/a/tmodpmod",
    deriv: "#",
    xm: "#",
};

export default function CTAButton({
    broker,
    country = "global",
    href,
    text,
    className = "",
    position = "unknown",
    onClick,
}: Props) {
    const finalHref = href || AFFILIATE_LINKS[broker];

    /* ❌ SAFETY CHECK */
    if (!finalHref) {
        if (process.env.NODE_ENV === "development") {
            console.warn(`⚠️ No affiliate link for broker: ${broker}`);
        }
        return null;
    }

    const handleClick = () => {
        const payload = {
            broker,
            country,
            position,
            timestamp: new Date().toISOString(),
        };

        /* 🔥 GOOGLE ANALYTICS */
        if (typeof window !== "undefined" && (window as any).gtag) {
            (window as any).gtag("event", "affiliate_click", {
                broker,
                country,
                position,
                event_category: "affiliate",
                event_label: `${broker}_${country}`,
                value: 1,
            });
        }

        /* 🔥 CUSTOM TRACKING */
        event({
            action: "affiliate_click",
            category: "affiliate",
            label: `${broker}_${country}_${position}`,
            value: 1,
        });

        /* 🔥 OPTIONAL EXTENSION */
        if (onClick) onClick();

        /* 🔥 DEV LOG */
        if (process.env.NODE_ENV === "development") {
            console.log("🔥 Affiliate Click:", payload);
        }
    };

    return (
        <a
            href={finalHref}
            target="_blank"
            rel="nofollow noopener noreferrer"
            onClick={handleClick}
            data-broker={broker}
            data-country={country}
            data-position={position}
            data-type="affiliate"
            className={className || "cta-button"}
        >
            {text || "🚀 Start Trading Now"}
        </a>
    );
}