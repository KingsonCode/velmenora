"use client";

import { event } from "@/lib/gtag";

type Props = {
    broker: string;
    country?: string;
    href?: string;
    text?: string;
    className?: string;
};

export default function CTAButton({
    broker,
    country = "global",
    href,
    text,
    className = "",
}: Props) {
    // 🔥 Default affiliate links (can scale later)
    const defaultLinks: Record<string, string> = {
        exness: "https://one.exnessonelink.com/a/tmodpmod",
    };

    const finalHref = href || defaultLinks[broker] || "#";

    const handleClick = () => {
        event({
            action: "click_broker",
            category: "affiliate",
            label: `${broker}_${country}`,
            value: 1,
        });
    };

    return (
        <a
            href={finalHref}
            target="_blank"
            rel="nofollow noopener noreferrer"
            onClick={handleClick}
            className={className || "cta-button"}
        >
            {text || "🚀 Start Trading Now"}
        </a>
    );
}