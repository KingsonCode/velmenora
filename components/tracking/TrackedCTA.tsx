"use client";

import type { MouseEvent, ReactNode } from "react";
import { trackClick } from "@/lib/tracking";

type Broker = {
    slug: string;
    name?: string;
    url?: string;
};

type Props = {
    broker: Broker;
    href?: string;
    page: string;
    cta: string;
    children: ReactNode;
    className?: string;
};

export default function TrackedCTA({
    broker,
    href,
    page,
    cta,
    children,
    className,
}: Props) {
    const targetHref = href ?? broker.url ?? `/go/${broker.slug}`;

    const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
        trackClick({
            broker: broker.slug,
            page,
            cta,
        });

        // Delay navigation briefly when sendBeacon is unavailable so tracking can finish.
        if (!navigator.sendBeacon) {
            e.preventDefault();

            setTimeout(() => {
                window.location.href = targetHref;
            }, 60);
        }
    };

    return (
        <a href={targetHref} onClick={handleClick} className={className}>
            {children}
        </a>
    );
}
