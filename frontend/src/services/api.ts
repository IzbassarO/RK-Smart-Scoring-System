const BASE = import.meta.env.VITE_API_BASE ?? "http://localhost:8080/api";

export async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`, { credentials: "omit" });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    const error = new Error(text || `HTTP ${res.status}`);
    (error as any).status = res.status;
    throw error;
  }
  return res.json() as Promise<T>;
}
