export type ScoreResult = {
  probability: number;
  decision: "approve" | "decline";
  threshold: number;
};

export async function scoreByIin(iin: string, creditAmount?: number): Promise<ScoreResult> {
  const base = import.meta.env.VITE_API_URL ?? "http://localhost:8080";
  const url = `${base}/api/score/${iin}` + (creditAmount ? `?creditAmount=${creditAmount}` : "");
  const res = await fetch(url, { method: "POST" });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
