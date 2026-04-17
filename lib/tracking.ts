/* ================= TYPES ================= */

export type TrackEvent = {
    type: "click" | "view";
    broker?: string;
    page: string;
    cta?: string;

    /* context */
    country?: string;
    device?: "mobile" | "desktop" | "tablet";

    /* meta */
    timestamp?: number;
    sessionId?: string;
};

/* ================= SESSION ================= */

function getSessionId(): string {
    if (typeof window === "undefined") return "server";

    let id = localStorage.getItem("vm_session");

    if (!id) {
        id = crypto.randomUUID();
        localStorage.setItem("vm_session", id);
    }

    return id;
}

/* ================= DEVICE DETECT ================= */

function getDevice(): "mobile" | "desktop" | "tablet" {
    if (typeof navigator === "undefined") return "desktop";

    const ua = navigator.userAgent.toLowerCase();

    if (/mobile/.test(ua)) return "mobile";
    if (/tablet/.test(ua)) return "tablet";

    return "desktop";
}

/* ================= CORE TRACK ================= */

export function trackEvent(input: TrackEvent) {
    try {
        const event: TrackEvent = {
            ...input,
            timestamp: Date.now(),
            sessionId: getSessionId(),
            device: getDevice(),
        };

        /* 🔥 DEV LOG */
        if (process.env.NODE_ENV !== "production") {
            console.log("TRACK EVENT:", event);
        }

        /* 🔥 SEND (NON-BLOCKING) */
        if (typeof window !== "undefined") {
            navigator.sendBeacon?.(
                "/api/track",
                JSON.stringify(event)
            ) ||
                fetch("/api/track", {
                    method: "POST",
                    body: JSON.stringify(event),
                    headers: {
                        "Content-Type": "application/json",
                    },
                    keepalive: true,
                });
        }
    } catch (err) {
        console.error("Tracking failed:", err);
    }
}

/* ================= SHORTCUT ================= */

export function trackClick(data: {
    broker: string;
    page: string;
    cta?: string;
    country?: string;
}) {
    trackEvent({
        type: "click",
        ...data,
    });
}