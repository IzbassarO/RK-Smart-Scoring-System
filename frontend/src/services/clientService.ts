const API = import.meta.env.VITE_API_URL ?? "http://localhost:8080";

export async function getClientByIin(iin: string) {
  const r = await fetch(`${API}/api/client/${encodeURIComponent(iin)}`);
  if (!r.ok) {
    const errBody = await r.json().catch(() => ({}));
    const e: any = new Error(errBody?.message || "Request failed");
    e.status = r.status;
    throw e;
  }
  return (await r.json()) as import("../types/Client").Client;
}
