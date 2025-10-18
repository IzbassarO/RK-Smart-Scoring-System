# app.py
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional, Dict, Any
import os
from pathlib import Path
import joblib, numpy as np, uvicorn

BASE_DIR = Path(__file__).resolve().parent
MODELS_DIR = BASE_DIR / "models"
MODEL_PATH = Path(os.getenv("MODEL_PATH", MODELS_DIR / "last_model.pkl")).resolve()
FEATS_PATH = Path(os.getenv("FEATS_PATH", MODELS_DIR / "last_features.pkl")).resolve()

if not MODEL_PATH.exists(): raise RuntimeError(f"Модель не найдена: {MODEL_PATH}")
if not FEATS_PATH.exists(): raise RuntimeError(f"Список фич не найден: {FEATS_PATH}")

model = joblib.load(MODEL_PATH)
feature_names = joblib.load(FEATS_PATH)

# --- ВАЖНО: управление трактовкой вероятности ---
# PROBA_KIND = 'approval'  → proba = вероятность одобрения
# PROBA_KIND = 'default'   → proba = вероятность дефолта (PD)
PROBA_KIND = os.getenv("PROBA_KIND", "approval").lower()  # 'approval' или 'default'
THRESHOLD = float(os.getenv("THRESHOLD", "0.65"))         # порог для ОДОБРЕНИЯ
# Если это PD, внутренний порог на PD = 1 - THRESHOLD (пример: 0.65 → PD-cut 0.35)
PD_CUT = 1.0 - THRESHOLD

app = FastAPI(title="RK Smart Scoring ML API")

class PredictIn(BaseModel):
    features: Dict[str, Any]
    creditAmount: Optional[float] = None

class PredictOut(BaseModel):
    probability: float
    decision: str
    threshold: float

@app.get("/health")
def health():
    return {
        "status": "ok",
        "model": str(MODEL_PATH),
        "features": str(FEATS_PATH),
        "count": len(feature_names),
        "proba_kind": PROBA_KIND,
        "threshold": THRESHOLD,
        "pd_cut": PD_CUT if PROBA_KIND == "default" else None,
        "cwd": str(Path.cwd()),
    }

@app.get("/features")
def get_features():
    return {"features": feature_names, "count": len(feature_names)}

@app.get("/model/features")
def get_features_compat():
    return {"features": feature_names, "count": len(feature_names)}

@app.post("/predict", response_model=PredictOut)
def predict(payload: PredictIn):
    # подставим кредитную сумму, если дали и есть подходящее имя
    if payload.creditAmount is not None:
        for key in ("AMT_CREDIT", "CREDIT_AMOUNT", "credit_amount"):
            if key in feature_names:
                payload.features[key] = payload.creditAmount
                break

    try:
        row = [float(payload.features.get(name, 0.0)) for name in feature_names]
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Bad feature value: {e}")

    X = np.asarray(row, dtype=float).reshape(1, -1)
    proba = float(model.predict_proba(X)[:, 1])

    if PROBA_KIND == "approval":
        # вероятность одобрения
        decision = "approve" if proba >= THRESHOLD else "decline"
        threshold_out = THRESHOLD
    else:
        # вероятность дефолта (PD)
        decision = "approve" if proba <= PD_CUT else "decline"
        threshold_out = THRESHOLD  # наружу отдаём твой порог одобрения

    return {"probability": proba, "decision": decision, "threshold": threshold_out}

if __name__ == "__main__":
    uvicorn.run("app:app", host="0.0.0.0", port=9000, reload=True)
