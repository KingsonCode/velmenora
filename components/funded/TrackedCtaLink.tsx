"use client";

import Link from "next/link";
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

function trackCtaClick(payload: {
  placement: CtaPlacement;
  label: string;
  href: string;
}) {
  if (typeof window === "undefined") return;

  const body = JSON.stringify({
    ...payload,
    pagePath: window.location.pathname,
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
  return (
    <Link
      href={href}
      className={className}
      onClick={() => trackCtaClick({ placement, label, href })}
    >
      {children}
    </Link>
  );
}
