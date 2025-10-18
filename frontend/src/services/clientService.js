import { apiGet } from "./api";

export async function getClientById(id) {
  try {
    return await apiGet(`/api/client/${encodeURIComponent(id)}`);
  } catch (e) {
    if (e && e.status === 404) {
      throw new Error("Client not found in the database.");
    }
    throw e;
  }
}
