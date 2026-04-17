"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/tracking";

type TrackingViewProps = {
    page: string;
    broker?: string;
    comparisonKey?: string;
};

export default function TrackingView({
    page,
    broker,
    comparisonKey,
}: TrackingViewProps) {
    useEffect(() => {
        trackEvent({
            type: "view",
            page,
            ...(broker ? { broker } : {}),
            ...(comparisonKey ? { broker: comparisonKey } : {}),
        });
    }, [broker, comparisonKey, page]);

    return null;
}
