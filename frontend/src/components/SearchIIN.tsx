import { useState } from "react";
import "./SearchIIN.css";

type Props = { onFound: (iin: string) => void; onError: (msg: string) => void; };

export default function SearchIIN({ onFound, onError }: Props) {
  const [iin, setIin] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = iin.replace(/\D/g, "");
    if (!cleaned) {
      onError("Введите ИИН (цифры).");
      return;
    }
    setLoading(true);
    try {
      onFound(cleaned);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="iin-form" onSubmit={handleSubmit} noValidate>
      <label htmlFor="iin" className="iin-label">Поиск по ИИН</label>
      <div className="iin-row">
        <input
          id="iin"
          inputMode="numeric"
          className="iin-input"
          placeholder="Введите ИИН"
          value={iin}
          onChange={(e) => setIin(e.target.value.replace(/\D/g, ""))}
          aria-label="ИИН"
        />
        <button type="submit" className="iin-button" disabled={loading}>
          {loading ? "Поиск..." : "Найти"}
        </button>
      </div>
      <p className="iin-hint">Поиск выполняется по точному идентификатору клиента.</p>
    </form>
  );
}
