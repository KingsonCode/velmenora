"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";

export type CtaPlacement =
  | "hero"
  | "sticky_mobile"
  | "plan_card"
  | "final";

type TrackedCtaLinkProps = {
  href: string;
  placement: CtaPlacement;
  label: string;
  className?: string;
  children: ReactNode;
};

const PRESERVED_PARAMS = [
  "ref",
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
] as const;

function withPreservedParams(href: string, sourceSearch: string): string {
  const parts = href.split("?");
  const path = parts[0] || "/";
  const query = parts[1] || "";

  const nextParams = new URLSearchParams(query);
  const currentParams = new URLSearchParams(sourceSearch);

  for (const key of PRESERVED_PARAMS) {
    const value = currentParams.get(key);
    if (value && !nextParams.has(key)) {
      nextParams.set(key, value);
    }
  }

  const qs = nextParams.toString();
  return qs ? `${path}?${qs}` : path;
}

function trackCtaClick(payload: {
  placement: CtaPlacement;
  label: string;
  href: string;
}) {
  if (typeof window === "undefined") return;

  const body = JSON.stringify({
    ...payload,
    pagePath: window.location.pathname,
    pageSearch: window.location.search || undefined,
    referrer: document.referrer || undefined,
  });

  try {
    const blob = new Blob([body], { type: "application/json" });

    if (navigator.sendBeacon) {
      navigator.sendBeacon("/api/cta-track", blob);
      return;
    }

    fetch("/api/cta-track", {
      method: "POST",
      body,
      headers: {
        "Content-Type": "application/json",
      },
      keepalive: true,
    }).catch(() => {});
  } catch {
    // Tracking must never block conversion.
  }
}

export default function TrackedCtaLink({
  href,
  placement,
  label,
  className,
  children,
}: TrackedCtaLinkProps) {
  const [trackedHref, setTrackedHref] = useState(href);

  useEffect(() => {
    setTrackedHref(withPreservedParams(href, window.location.search));
  }, [href]);

  return (
    <Link
      href={trackedHref}
      className={className}
      onClick={() => trackCtaClick({ placement, label, href: trackedHref })}
    >
      {children}
    </Link>
  );
}
