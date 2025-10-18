import { useState } from "react";
import "./AppLayout.css";
import HeaderBar from "../components/HeaderBar";
import SearchIIN from "../components/SearchIIN";
import { getClientByIin } from "../services/clientService";
import { scoreByIin } from "../services/scoreService";
import type { Client } from "../types/Client";
import AuthorsSection from "../components/AuthorsSection";
import FooterBar from "../components/FooterBar";

export default function AppLayout() {
  const [error, setError] = useState<string | null>(null);
  const [client, setClient] = useState<Client | null>(null);
  const [score, setScore] = useState<{ decision: "approve"|"decline"; probability: number } | null>(null);

  // запомним последний ИИН, чтобы кнопка вызывала скоринг по нему
  const [lastIin, setLastIin] = useState<string | null>(null);

  // UI локально (инпут суммы визуально не влияет на кнопку)
  const [amount, setAmount] = useState<string>("");
  const [scoreLoading, setScoreLoading] = useState(false);

  const onError = (msg: string) => {
    setError(msg);
    setClient(null);
    setScore(null);
    setLastIin(null);
  };

  const onFound = async (iin: string) => {
    setError(null);
    setClient(null);
    setScore(null);
    setAmount("");
    setLastIin(iin); // <-- сохранили ИИН для кнопки

    try {
      const c = await getClientByIin(iin);
      setClient(c);
      // не считаем автоматически — только по кнопке
    } catch (e: any) {
      if (e?.status === 404) setError("Клиент с таким ИИН не найден.");
      else setError(e?.message || "Ошибка поиска клиента.");
    }
  };

  const handleAmountChange = (v: string) => {
    const digitsOnly = v.replace(/\D/g, "").slice(0, 12);
    setAmount(digitsOnly);
  };

  const runScoring = async () => {
    if (!client || !lastIin) return;
    try {
      setError(null);
      setScoreLoading(true);
      // ВАЖНО: игнорируем amount по твоему требованию
      const s = await scoreByIin(lastIin);
      setScore({ decision: s.decision, probability: s.probability });
    } catch {
      setError("Сервис скоринга временно недоступен. Попробуйте позже.");
    } finally {
      setScoreLoading(false);
    }
  };

  return (
    <div className="app-container">
      <HeaderBar />

      <main className="main-content">
        {/* SECTION: Поиск */}
        <section className="section search-section">
          <SearchIIN onFound={onFound} onError={onError} />
          {error && <div className="error-banner">{error}</div>}
        </section>

        {/* SECTION: фиксированная зона под карту клиента */}
        <section className="section client-host">
          {client && (
            <div className="client-card">
              <div className="client-card__header">
                <h2>Профиль клиента</h2>
                {/* ЧИП и p здесь не показываем */}
              </div>

              <div className="client-card__grid">
                <div className="client-field"><b>ID:</b> {client.skIdCurr}</div>
                <div className="client-field"><b>Возраст:</b> {client.age}</div>
                <div className="client-field"><b>Пол:</b> {client.gender || "—"}</div>
                <div className="client-field"><b>Семья:</b> {client.familyStatus}</div>
                <div className="client-field"><b>Доход годовой:</b> {client.incomeAnnual?.toLocaleString()}</div>
                <div className="client-field"><b>Сумма кредита:</b> {client.creditAmount?.toLocaleString()}</div>
                <div className="client-field"><b>Занятость:</b> {client.employment}</div>
                <div className="client-field"><b>Образование:</b> {client.education}</div>
              </div>

              {/* Линия: инпут + кнопка в одну строку */}
              <div className="scorebar">
                <div className="amount-input-wrap">
                  <span className="amount-prefix">₸</span>
                  <input
                    id="amount"
                    className="amount-input"
                    inputMode="numeric"
                    placeholder={client.creditAmount ? client.creditAmount.toLocaleString() : "Введите сумму"}
                    value={amount}
                    onChange={(e) => handleAmountChange(e.target.value)}
                    aria-label="Сумма кредита"
                  />
                </div>

                <button
                  type="button"
                  className="primary-btn"
                  onClick={runScoring}
                  disabled={scoreLoading}
                >
                  {scoreLoading ? "Рассчитываю…" : "Проверить кредитоспособность"}
                </button>
              </div>

              {/* Результат — только после клика по кнопке */}
              {score && (
                <div className="score-result">
                  <span className={`decision-chip ${score.decision === "approve" ? "ok" : "bad"}`}>
                    {score.decision === "approve" ? "Одобрить" : "Отказать"}
                  </span>
                  <span className="score-prob">p={score.probability.toFixed(3)}</span>
                </div>
              )}
            </div>
          )}
        </section>

        <div className="divider" role="separator" aria-label="Разделитель" />

        {/* SECTION: Авторы */}
        <section className="section">
          <AuthorsSection />
        </section>
      </main>
      <FooterBar />
    </div>
  );
}
