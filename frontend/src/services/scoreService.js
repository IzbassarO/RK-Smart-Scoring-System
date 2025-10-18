import { apiPost } from "./api";

export async function scoreById(id, creditAmount) {
  const qs = creditAmount ? `?creditAmount=${encodeURIComponent(creditAmount)}` : "";
  return apiPost(`/api/score/${encodeURIComponent(id)}${qs}`);
}
