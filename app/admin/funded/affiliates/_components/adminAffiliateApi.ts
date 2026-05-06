export type AdminApiResult<T> = {
  ok: boolean;
  data?: T;
  error?: string;
  raw?: unknown;
};

export async function adminGet<T>(path: string): Promise<AdminApiResult<T>> {
  const res = await fetch(`/api/admin/funded/${path.replace(/^\/+/, "")}`, {
    method: "GET",
    cache: "no-store",
  });

  const json = await res.json().catch(() => null);

  if (!res.ok) {
    return {
      ok: false,
      error: json?.error || `request_failed_${res.status}`,
      raw: json,
    };
  }

  return {
    ok: true,
    data: json as T,
    raw: json,
  };
}

export async function adminPost<T>(
  path: string,
  body?: Record<string, unknown>
): Promise<AdminApiResult<T>> {
  const res = await fetch(`/api/admin/funded/${path.replace(/^\/+/, "")}`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(body ?? {}),
  });

  const json = await res.json().catch(() => null);

  if (!res.ok) {
    return {
      ok: false,
      error: json?.error || `request_failed_${res.status}`,
      raw: json,
    };
  }

  return {
    ok: true,
    data: json as T,
    raw: json,
  };
}
