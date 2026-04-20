export const WATCHLIST_KEY = "velmenora_watchlist";

export type WatchlistItem = {
    pair: string;
    name?: string;
    savedAt: number;
};

function normalizePair(pair: string) {
    return pair.replace("/", "").toLowerCase();
}

export function getWatchlist(): WatchlistItem[] {
    if (typeof window === "undefined") return [];

    try {
        const raw = localStorage.getItem(WATCHLIST_KEY);
        if (!raw) return [];

        const parsed = JSON.parse(raw);

        if (!Array.isArray(parsed)) return [];

        return parsed.filter(
            (item) =>
                item &&
                typeof item.pair === "string" &&
                (typeof item.name === "string" || typeof item.name === "undefined") &&
                typeof item.savedAt === "number"
        );
    } catch {
        return [];
    }
}

export function saveWatchlist(items: WatchlistItem[]) {
    if (typeof window === "undefined") return;
    localStorage.setItem(WATCHLIST_KEY, JSON.stringify(items));
}

export function isInWatchlist(pair: string) {
    const normalized = normalizePair(pair);
    return getWatchlist().some((item) => normalizePair(item.pair) === normalized);
}

export function addToWatchlist(item: Omit<WatchlistItem, "savedAt">) {
    const current = getWatchlist();
    const normalized = normalizePair(item.pair);

    if (current.some((x) => normalizePair(x.pair) === normalized)) {
        return current;
    }

    const nextItem: WatchlistItem = {
        pair: normalized,
        savedAt: Date.now(),
        ...(item.name ? { name: item.name } : {}),
    };

    const next: WatchlistItem[] = [nextItem, ...current];

    saveWatchlist(next);
    return next;
}

export function removeFromWatchlist(pair: string) {
    const normalized = normalizePair(pair);
    const next = getWatchlist().filter(
        (item) => normalizePair(item.pair) !== normalized
    );

    saveWatchlist(next);
    return next;
}

export function toggleWatchlist(item: Omit<WatchlistItem, "savedAt">) {
    if (isInWatchlist(item.pair)) {
        const next = removeFromWatchlist(item.pair);
        return { saved: false, items: next };
    }

    const next = addToWatchlist(item);
    return { saved: true, items: next };
}

export function formatPair(pair: string) {
    const clean = pair.replace("/", "").toUpperCase();

    if (clean.length === 6) {
        return `${clean.slice(0, 3)}/${clean.slice(3)}`;
    }

    return clean;
}