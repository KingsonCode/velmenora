export function getBaseUrl(): string {
    const envUrl = process.env.NEXT_PUBLIC_BASE_URL?.trim();

    if (envUrl) {
        return envUrl.replace(/\/$/, "");
    }

    return "http://localhost:3000";
}