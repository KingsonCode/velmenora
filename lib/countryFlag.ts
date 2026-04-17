export function getFlag(code?: string | null): string {
    // 🔒 HARD SAFETY
    if (!code || typeof code !== "string") {
        return "🌍";
    }

    const normalized = code.trim().toUpperCase();

    // ❌ INVALID (not ISO-2)
    if (normalized.length !== 2) {
        return "🌍";
    }

    // 🔥 A-Z ONLY CHECK
    if (!/^[A-Z]{2}$/.test(normalized)) {
        return "🌍";
    }

    try {
        // 🇹🇿 → TZ → regional indicator symbols
        return normalized
            .split("")
            .map((char) =>
                String.fromCodePoint(127397 + char.charCodeAt(0))
            )
            .join("");
    } catch {
        return "🌍";
    }
}