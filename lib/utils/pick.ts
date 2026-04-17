/* ================= TYPES ================= */

export type NonEmptyArray<T> = readonly [T, ...T[]];

/* ================= CORE PICK ================= */

/**
 * Picks a random item from a non-empty array
 * Guaranteed safe at type level
 */
export function pick<T>(arr: NonEmptyArray<T>): T {
    const index = Math.floor(Math.random() * arr.length);
    return arr[index]!;
}

/* ================= SAFE PICK (FALLBACK) ================= */

/**
 * Use when array might be empty (less strict)
 */
export function safePick<T>(arr: readonly T[], fallback: T): T {
    if (!arr.length) return fallback;
    return arr[Math.floor(Math.random() * arr.length)]!;
}

/* ================= MULTI PICK ================= */

/**
 * Pick multiple unique items
 */
export function pickMany<T>(
    arr: readonly T[],
    count: number
): T[] {
    if (count <= 0) return [];

    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

/* ================= WEIGHTED PICK (ADVANCED 🔥) ================= */

export function weightedPick<T>(
    items: { value: T; weight: number }[]
): T {
    const total = items.reduce((sum, i) => sum + i.weight, 0);
    let random = Math.random() * total;

    for (const item of items) {
        if (random < item.weight) return item.value;
        random -= item.weight;
    }

    return items[0]!.value;
}