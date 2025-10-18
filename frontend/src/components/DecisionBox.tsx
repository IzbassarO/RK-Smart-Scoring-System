import { useState } from "react";
import { scoreByIin, type ScoreResult } from "../services/scoreService";

export default function DecisionBox({ iin }: { iin: string }) {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ScoreResult | null>(null);

  const onSubmit = async () => {
    setError(null); setResult(null); setLoading(true);
    try {
      const data = await scoreByIin(iin, amount ? Number(amount) : undefined);
      setResult(data);
    } catch (e: any) {
      setError(e?.message || "Ошибка скоринга");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card" style={{ marginTop: 12 }}>
      <h3>Проверка кредитоспособности</h3>
      <div style={{ display: "flex", gap: 8 }}>
        <input
          inputMode="numeric"
          placeholder="Сумма кредита"
          value={amount}
          onChange={(e) => setAmount(e.target.value.replace(/[^\d.]/g, ""))}
          style={{ flex: 1 }}
        />
        <button onClick={onSubmit} disabled={loading}>
          {loading ? "Проверяем..." : "Проверить"}
        </button>
      </div>
      {error && <div className="error-banner" style={{ marginTop: 8 }}>{error}</div>}
      {result && (
        <div className="info-banner" style={{ marginTop: 8 }}>
          Решение: <b>{result.decision === "approve" ? "Одобрить" : "Отказать"}</b> ·
          PD = {(result.probability * 100).toFixed(2)}% (порог {result.threshold * 100}%)
        </div>
      )}
    </div>
  );
}
