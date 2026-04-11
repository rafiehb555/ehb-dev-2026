export async function fetchJson<T>(url: string, fallback: T): Promise<T> {
  try {
    const res = await fetch(url, { cache: "no-store" });
    const json = await res.json().catch(() => null);
    if (!res.ok) throw new Error(json?.error?.message ?? `Failed to load ${url}`);
    return (json?.data ?? json) as T;
  } catch {
    return fallback;
  }
}
