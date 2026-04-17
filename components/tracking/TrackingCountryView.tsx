"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/tracking";

type Props = {
    country: string;
};

export default function TrackingCountryView({ country }: Props) {
    useEffect(() => {
        trackEvent({
            type: "view",
            page: "country",
            country,
        });
    }, [country]);

    return null;
}