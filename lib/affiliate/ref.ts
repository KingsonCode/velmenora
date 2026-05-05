export function captureRefFromUrl() {
  if (typeof window === "undefined") return;

  const params = new URLSearchParams(window.location.search);
  const ref = params.get("ref");

  if (!ref) return;

  try {
    const expires = new Date();
    expires.setDate(expires.getDate() + 30);

    document.cookie = `vel_ref=${encodeURIComponent(ref)}; path=/; expires=${expires.toUTCString()}; SameSite=Lax`;
  } catch {}
}

export function getStoredRef(): string | null {
  if (typeof document === "undefined") return null;

  const match = document.cookie.match(/(?:^|;\s*)vel_ref=([^;]+)/);
  const value = match?.[1];

  return value ? decodeURIComponent(value) : null;
}
