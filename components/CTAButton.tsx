"use client";

import { useRef } from "react";
import { event } from "@/lib/gtag";
import { getBroker } from "@/lib/brokers";

/* ========================= */
export type Position =
    | "top"
    | "mid"
    | "bottom"
    | "hero"
    | "sticky"
    | "card"
    | "compare"
    | "table"
    | "unknown";

/* ========================= */
type Props = {
    broker: string;
    country?: string;
    href?: string;
    text?: string;
    className?: string;
    position?: Position;
    onClick?: () => void;
};

/* ========================= */
export default function CTAButton({
    broker,
    country = "global",
    href,
    text,
    className = "",
    position = "unknown",
    onClick,
}: Props) {
    const clickedRef = useRef(false);
    const brokerData = getBroker(broker);

    /* 🔥 FINAL LINK → USE /go/ ROUTE */
    const finalHref =
        href || (brokerData ? `/go/${broker}` : null);

    if (!finalHref) {
        if (process.env.NODE_ENV === "development") {
            console.warn(`⚠️ No broker found: ${broker}`);
        }
        return null;
    }

    /* ========================= */
    const handleClick = async () => {
        if (clickedRef.current) return; // 🔥 prevent spam clicks
        clickedRef.current = true;

        const payload = {
            broker,
            country,
            position,
            ts: Date.now(),
        };

        /* 🔥 CLIENT ANALYTICS */
        if (typeof window !== "undefined" && (window as any).gtag) {
            (window as any).gtag("event", "affiliate_click", {
                broker,
                country,
                position,
                event_category: "affiliate",
                event_label: `${broker}_${country}_${position}`,
                value: 1,
            });
        }

        event({
            action: "affiliate_click",
            category: "affiliate",
            label: `${broker}_${country}_${position}`,
            value: 1,
        });

        /* 🔥 SERVER TRACKING (VERY IMPORTANT) */
        try {
            navigator.sendBeacon?.(
                "/api/track",
                JSON.stringify(payload)
            );
        } catch { }

        if (onClick) onClick();

        if (process.env.NODE_ENV === "development") {
            console.log("🔥 Affiliate Click:", payload);
        }
    };

    return (
        <a
            href={finalHref}
            target="_blank"
            rel="nofollow noopener noreferrer sponsored"
            onClick={handleClick}
            data-broker={broker}
            data-country={country}
            data-position={position}
            className={
                className ||
                "bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-semibold transition"
            }
        >
            {text || "🚀 Start Trading Now"}
        </a>
    );
}