"use client";

import { trackClick } from "@/lib/tracking";
import type { MouseEvent, ReactNode } from "react";

/* ================= TYPES ================= */

type Props = {
    href: string;
    broker?: string;
    page: string;
    cta: string;
    country?: string;

    children: ReactNode;

    className?: string;     // ✅ styling
    target?: "_blank" | "_self"; // ✅ optional new tab
    rel?: string;           // ✅ security (noopener etc)
};

/* ================= COMPONENT ================= */

export default function TrackedLink({
    href,
    broker,
    page,
    cta,
    country,
    children,
    className,
    target = "_self",
    rel,
}: Props) {

    const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
        try {
            trackClick({
                broker: broker || "unknown",
                page,
                cta,
                ...(country ? { country } : {}),
            });
        } catch (err) {
            console.error("Tracking error:", err);
        }

        /* 🔥 OPTIONAL: ensure tracking fires before navigation (advanced) */
        // if (target === "_self") {
        //     e.preventDefault();
        //     setTimeout(() => {
        //         window.location.href = href;
        //     }, 100);
        // }
    };

    return (
        <a
            href={href}
            onClick={handleClick}
            className={className}
            target={target}
            rel={target === "_blank" ? rel || "noopener noreferrer" : rel}
        >
            {children}
        </a>
    );
}