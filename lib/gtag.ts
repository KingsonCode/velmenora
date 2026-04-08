export const GA_ID = process.env.NEXT_PUBLIC_GA_ID || "G-VMWD4KBDS7";

// Extend window type (TypeScript safe)
declare global {
    interface Window {
        gtag?: (...args: any[]) => void;
    }
}

// 🔥 Page view (SAFE)
export const pageview = (url: string) => {
    if (!window.gtag) return;

    window.gtag("config", GA_ID, {
        page_path: url,
    });
};

// 🔥 Event tracking (FOR MONEY)
export const event = ({
    action,
    category,
    label,
    value,
}: {
    action: string;
    category: string;
    label?: string;
    value?: number;
}) => {
    if (!window.gtag) return;

    window.gtag("event", action, {
        event_category: category,
        event_label: label,
        value,
    });
};