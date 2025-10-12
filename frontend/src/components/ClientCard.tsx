import type { Client } from "../types/Client";
import "./ClientCard.css";

type Props = { client: Client };

export default function ClientCard({ client }: Props) {
  // Паддим SK_ID_CURR до 12 символов и маскируем первые 6
  const maskSkId = (id: number) => {
    const s = String(id).padStart(12, "0");
    return s.replace(/^(\d{6})/, "******");
  };

  const incomeMonthly =
    typeof client.incomeAnnual === "number" && client.incomeAnnual > 0
      ? Math.round(client.incomeAnnual / 12)
      : null;

  return (
    <section className="client-card">
      <div className="client-header">
        <div className="client-avatar" aria-hidden>👤</div>
        <div>
          <h3 className="client-name">Клиент #{client.skIdCurr}</h3>
          <div className="client-meta">
            ИИН: <b>{maskSkId(client.skIdCurr)}</b>
            {client.age ? <> · Возраст: <b>{client.age}</b></> : null}
            {client.gender ? <> · Пол: <b>{client.gender}</b></> : null}
          </div>
        </div>
      </div>

      <div className="client-grid">
        <div><span>Занятость:</span><b>{client.employment || "—"}</b></div>
        <div>
          <span>Доход (мес):</span>
          <b>{incomeMonthly !== null ? `${incomeMonthly.toLocaleString()} ₸` : "—"}</b>
        </div>
        <div><span>Иждивенцы (дети):</span><b>{Number.isFinite(client.children) ? client.children : "—"}</b></div>
        <div><span>Жильё:</span><b>{client.housingType || "—"}</b></div>

        <div><span>Сумма кредита:</span><b>{client.creditAmount?.toLocaleString() ?? "—"}</b></div>
        <div><span>Аннуитет:</span><b>{client.annuity?.toLocaleString() ?? "—"}</b></div>
        <div><span>Цена товара:</span><b>{client.goodsPrice?.toLocaleString() ?? "—"}</b></div>

        <div><span>Образование:</span><b>{client.education || "—"}</b></div>
        <div><span>Семейное положение:</span><b>{client.familyStatus || "—"}</b></div>
        <div><span>Профессия:</span><b>{client.occupation || "—"}</b></div>
      </div>

      <div className="client-grid" style={{ marginTop: ".5rem" }}>
        <div><span>REG рейтинг:</span><b>{client.regionRatingClient ?? "—"}</b></div>
        <div><span>REG рейтинг (город):</span><b>{client.regionRatingClientWCity ?? "—"}</b></div>
        <div><span>EXT_SOURCE_1:</span><b>{client.extSource1 ?? "—"}</b></div>
        <div><span>EXT_SOURCE_2:</span><b>{client.extSource2 ?? "—"}</b></div>
        <div><span>EXT_SOURCE_3:</span><b>{client.extSource3 ?? "—"}</b></div>
      </div>
    </section>
  );
}
