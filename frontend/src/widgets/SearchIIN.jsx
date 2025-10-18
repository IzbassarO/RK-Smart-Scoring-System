import { useState } from "react";
import "./SearchIIN.css";

export default function SearchIIN({ onFound, onError }) {
  const [clientId, setClientId] = useState("");
  const [loading, setLoading] = useState(false); // можно оставить для UX

  const handleSubmit = (e) => {
    e.preventDefault();
    const cleaned = clientId.replace(/\D/g, "");
    if (!cleaned) {
      onError("Please enter Client ID (digits only).");
      return;
    }
    setLoading(true);
    // БЕЗ симуляции: просто отдаём ИИН родителю, он сделает реальный fetch
    onFound(cleaned);
    setLoading(false);
  };

  return (
    <form className="iin-form" onSubmit={handleSubmit}>
      <label htmlFor="clientId" className="iin-label">
        Search Client by ID
      </label>
      <div className="iin-row">
        <input
          id="clientId"
          inputMode="numeric"
          className="iin-input"
          placeholder="Enter Client ID"
          value={clientId}
          onChange={(e) => setClientId(e.target.value.replace(/\D/g, ""))}
        />
        <button type="submit" className="iin-button" disabled={loading}>
          {loading ? "Searching..." : "Search"}
        </button>
      </div>
    </form>
  );
}
