import { useState } from "react";
import HeaderBar from "../components/HeaderBar";
import FooterBar from "../components/FooterBar";
import SearchIIN from "../components/SearchIIN";
import ClientCard from "../components/ClientCard";
import AuthorsSection from "../components/AuthorsSection";
import { getClientByIin } from "../services/clientService";
import type { Client } from "../types/Client";
import "./AppLayout.css";

export default function AppLayout() {
  const [client, setClient] = useState<Client | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onFoundIIN = async (iin: string) => {
    setError(null);
    setClient(null);
    setLoading(true);
    try {
      const c = await getClientByIin(iin);
      setClient(c);
    } catch (e: any) {
      if (e?.status === 404) setError("Клиент с таким ИИН не найден.");
      else setError(e?.message || "Ошибка запроса. Повторите попытку.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <HeaderBar />
      <main className="main-content">
        <h2 style={{ marginTop: 0 }}>Проверка кредитоспособности</h2>
        <p style={{ color: "#666", marginTop: "-6px" }}>
          Введите ИИН клиента и нажмите «Найти»
        </p>

        <SearchIIN
          onFound={onFoundIIN}
          // локальные валидации сейчас не нужны — не показываем сообщение от формы
          onError={() => { setError(null); setClient(null); }}
        />

        {loading && <div className="info-banner">Идёт поиск клиента…</div>}
        {error && !loading && <div className="error-banner">{error}</div>}
        {client && !loading && <ClientCard client={client} />}
        <AuthorsSection />
      </main>
      <FooterBar />
    </div>
  );
}
