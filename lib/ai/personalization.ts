import { Broker } from "@/data/brokers";
import { scoreBroker } from "./recommendBroker";

/* ================= STORAGE ================= */
const STORAGE_KEY = "velmenora_user_profile";

/* ================= TYPES ================= */
type UserProfile = {
    clicks: Record<string, number>;
    lastViewed?: string;
    updatedAt?: number;
};

/* ================= INTERNAL CACHE ================= */
let cachedProfile: UserProfile | null = null;

/* ================= LOAD ================= */
function getProfile(): UserProfile {
    if (typeof window === "undefined") return { clicks: {} };

    if (cachedProfile) return cachedProfile;

    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        const parsed = raw ? JSON.parse(raw) : { clicks: {} };

        cachedProfile = {
            clicks: parsed.clicks || {},
            lastViewed: parsed.lastViewed,
            updatedAt: parsed.updatedAt || Date.now(),
        };

        return cachedProfile;
    } catch {
        return { clicks: {} };
    }
}

/* ================= SAVE ================= */
function saveProfile(profile: UserProfile) {
    if (typeof window === "undefined") return;

    profile.updatedAt = Date.now();
    cachedProfile = profile;

    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));

    /* 🔥 trigger UI updates */
    window.dispatchEvent(new Event("velmenora_profile_updated"));
}

/* ================= DECAY ================= */
function applyDecay(profile: UserProfile) {
    const now = Date.now();
    const diffDays =
        (now - (profile.updatedAt || now)) / (1000 * 60 * 60 * 24);

    if (diffDays < 1) return profile;

    const decayFactor = Math.pow(0.9, diffDays);

    const newClicks: Record<string, number> = {};

    for (const id of Object.keys(profile.clicks)) {
        const current = profile.clicks[id] ?? 0;
        newClicks[id] = Math.floor(current * decayFactor);
    }

    return {
        ...profile,
        clicks: newClicks,
    };
}

/* ================= TRACK ================= */
export function trackClick(brokerId: string) {
    const profile = applyDecay(getProfile());

    profile.clicks[brokerId] =
        (profile.clicks[brokerId] || 0) + 1;

    profile.lastViewed = brokerId;

    saveProfile(profile);
}

/* ================= PERSONAL SCORE ================= */
export function getPersonalizedScore(b: Broker): number {
    const base = scoreBroker(b);
    const profile = getProfile();

    let boost = 0;

    /* 🔁 FREQUENCY */
    const clicks = profile.clicks[b.id] || 0;
    boost += Math.min(clicks * 2, 10); // cap

    /* 👁 LAST VIEWED */
    if (profile.lastViewed === b.id) {
        boost += 3;
    }

    /* 📱 PLATFORM SIGNAL */
    if (b.platforms?.includes("MT5")) {
        boost += 1;
    }

    /* 🌍 GEO SIGNAL (TANZANIA BIAS) */
    if ((b as any).supportsTanzania) {
        boost += 2;
    }

    /* 💰 BUSINESS PRIORITY SIGNAL */
    if ((b as any).priority === "high") {
        boost += 2;
    }

    return base + boost;
}

/* ================= SORT ================= */
export function sortPersonalized(brokers: Broker[]) {
    return [...brokers].sort(
        (a, b) =>
            getPersonalizedScore(b) - getPersonalizedScore(a)
    );
}

/* ================= SUBSCRIBE ================= */
export function subscribeProfileUpdate(
    callback: () => void
) {
    if (typeof window === "undefined") return;

    window.addEventListener(
        "velmenora_profile_updated",
        callback
    );

    return () => {
        window.removeEventListener(
            "velmenora_profile_updated",
            callback
        );
    };
}