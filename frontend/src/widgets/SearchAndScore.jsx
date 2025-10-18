// widgets/SearchAndScore.jsx
import React, { useState } from "react";
import {
  Card, CardBody, Typography, Button, IconButton, Input, Chip,
  Dialog, DialogHeader, DialogBody, DialogFooter,
} from "@material-tailwind/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import SearchIIN from "@/widgets/SearchIIN";

const API_BASE = import.meta.env.VITE_API_BASE || "";

function fmtPct(x) {
  if (typeof x !== "number" || Number.isNaN(x)) return "—";
  return `${(x * 100).toFixed(1)}%`; // 0..1 -> XX.X%
}

export default function SearchAndScore() {
  const [foundIIN, setFoundIIN] = useState(null);
  const [client, setClient] = useState(null);
  const [loadingClient, setLoadingClient] = useState(false);

  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [scoring, setScoring] = useState(false);
  const [decision, setDecision] = useState(null);
  const [error, setError] = useState(null);

  const fetchClient = async (iin) => {
    setLoadingClient(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/api/client/${iin}`);
      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || "Client not found");
      }
      const data = await res.json();
      setClient(data);
      setOpen(true);
    } catch (e) {
      setClient(null);
      setOpen(false);
      setError("Клиент не найден в базе.");
      console.warn(e);
    } finally {
      setLoadingClient(false);
    }
  };

  const onFound = async (iin) => {
    setFoundIIN(iin);
    setDecision(null);      // сброс предыдущего результата
    await fetchClient(iin); // открытие модалки — внутри fetchClient()
  };

  const onError = (msg) => {
    setError(msg);
  };

  const handleClose = () => setOpen(false);

  const handleScore = async () => {
    if (!foundIIN) return;
    setScoring(true);
    setError(null);
    setDecision(null);
    try {
      const params = new URLSearchParams();
      // amount опционален: если пусто — не добавляем
      const cleaned = (amount || "").replace(/\D/g, "");
      if (cleaned) params.set("creditAmount", cleaned);

      const res = await fetch(
        `${API_BASE}/api/score/${foundIIN}?${params.toString()}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({}), // тело не требуется, сервер сам соберёт features
        }
      );

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Scoring service error");
      }

      const data = await res.json(); // { probability, decision, threshold }
      // Показываем только понятный итог; p нигде автоматически не светим
      setDecision({
        approved: data.decision === "approve",
        details: {
          probability: data.probability,
          threshold: data.threshold,
        },
      });
    } catch (e) {
      setError("Сервис скоринга недоступен. Попробуйте позже.");
      console.error(e);
    } finally {
      setScoring(false);
    }
  };

  return (
    <div className="mt-24">
      <Card className="mx-auto max-w-3xl rounded-xl shadow-lg shadow-gray-500/10">
        <CardBody>
          <Typography variant="h4" color="blue-gray" className="mb-4 font-bold">
            Поиск клиента по ИИН
          </Typography>

          {/* Поиск по ИИН */}
          <SearchIIN onFound={onFound} onError={onError} />

          {/* Статусы/ошибки */}
          {loadingClient && (
            <Typography variant="small" className="mt-3 text-blue-gray-500">
              Идёт загрузка данных клиента…
            </Typography>
          )}
          {error && (
            <Typography variant="small" className="mt-3 text-red-500">
              {error}
            </Typography>
          )}

          {/* Блок анализа — доступен после успешного поиска */}
          {foundIIN && !loadingClient && (
            <div className="mt-6 space-y-4">
              <Typography variant="small" className="text-blue-gray-600">
                Клиент найден: <span className="font-semibold">{foundIIN}</span>
              </Typography>

              {/* В одной линии: textfield суммы и кнопка проверки */}
              <div className="flex items-center gap-3">
                <div className="relative flex-1">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 opacity-70">
                    ₸
                  </span>
                  <Input
                    type="text"
                    label="Сумма кредита (необязательно)"
                    value={amount}
                    onChange={(e) =>
                      setAmount(e.target.value.replace(/[^\d]/g, ""))
                    }
                    className="pl-7"
                  />
                </div>

                {/* Кнопка НЕ зависит от заполненности суммы */}
                <Button color="blue" onClick={handleScore} disabled={scoring}>
                  {scoring ? "Проверяем…" : "Проверить кредитоспособность"}
                </Button>
              </div>

              {/* Итог — только после клика */}
              {decision && (
                <div className="mt-2 flex items-center gap-3">
                  <Chip
                    value={decision.approved ? "Одобрено" : "Отказано"}
                    color={decision.approved ? "green" : "red"}
                    className="font-medium"
                  />
                  <div className="text-sm text-blue-gray-700">
                    Вероятность: <b>{fmtPct(decision.details.probability)}</b>
                    {" · "}
                    Порог: <b>{fmtPct(decision.details.threshold)}</b>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardBody>
      </Card>

      {/* Модалка с данными клиента (реальные данные из Mongo) */}
      <Dialog open={open} handler={handleClose} size="lg" className="max-w-3xl">
        <DialogHeader className="justify-between">
          <Typography variant="h5" color="blue-gray">
            Данные клиента
          </Typography>
          <IconButton variant="text" onClick={handleClose} aria-label="Закрыть">
            <XMarkIcon className="h-6 w-6" />
          </IconButton>
        </DialogHeader>
        <DialogBody divider className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {client ? (
            <>
              <InfoRow label="SK_ID_CURR" value={client.skIdCurr} />
              <InfoRow label="Возраст" value={client.age} />
              <InfoRow label="Пол" value={client.gender} />
              <InfoRow label="Семейный статус" value={client.familyStatus} />
              <InfoRow label="Жильё" value={client.housingType} />
              <InfoRow label="Занятость" value={client.employment} />
              <InfoRow label="Образование" value={client.education} />
              <InfoRow label="Профессия" value={client.occupation} />
              <InfoRow label="Дети" value={client.children} />
              <InfoRow label="Члены семьи" value={client.familyMembers} />
              <InfoRow label="Годовой доход" value={client.incomeAnnual} />
              <InfoRow label="Кредит (заявка/текущий)" value={client.creditAmount} />
              <InfoRow label="Аннуитет" value={client.annuity} />
              <InfoRow label="Цена товара" value={client.goodsPrice} />
              <InfoRow label="EXT_SOURCE_1" value={client.extSource1} />
              <InfoRow label="EXT_SOURCE_2" value={client.extSource2} />
              <InfoRow label="EXT_SOURCE_3" value={client.extSource3} />
              <InfoRow label="REGION_RATING_CLIENT" value={client.regionRatingClient} />
              <InfoRow label="REGION_RATING_CLIENT_W_CITY" value={client.regionRatingClientWCity} />
            </>
          ) : (
            <Typography>Загрузка…</Typography>
          )}
        </DialogBody>
        <DialogFooter>
          <Button variant="text" color="blue-gray" onClick={handleClose} className="mr-2">
            Закрыть
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="flex items-baseline gap-2">
      <Typography variant="small" className="w-48 shrink-0 text-blue-gray-500">
        {label}:
      </Typography>
      <Typography variant="small" color="blue-gray" className="font-medium">
        {value ?? "—"}
      </Typography>
    </div>
  );
}
