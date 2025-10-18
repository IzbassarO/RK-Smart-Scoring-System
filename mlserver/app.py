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
THRESHOLD = 0.65

app = FastAPI(title="RK Smart Scoring ML API")

class PredictIn(BaseModel):
    features: Dict[str, Any]
    creditAmount: Optional[float] = None  # ← принимаем сумму (по желанию)

class PredictOut(BaseModel):
    probability: float
    decision: str
    threshold: float

@app.get("/health")
def health():
    return {"status": "ok", "model": str(MODEL_PATH), "features": str(FEATS_PATH), "count": len(feature_names)}

# Официальный эндпоинт
@app.get("/features")
def get_features():
    return {"features": feature_names, "count": len(feature_names)}

# Совместимость со старым кодом (.NET дергает /model/features)
@app.get("/model/features")
def get_features_compat():
    return {"features": feature_names, "count": len(feature_names)}

@app.post("/predict", response_model=PredictOut)
def predict(payload: PredictIn):
    # Если передали creditAmount — положим в один из «стандартных» ключей, если он есть среди feature_names.
    if payload.creditAmount is not None:
        for key in ("AMT_CREDIT", "CREDIT_AMOUNT", "credit_amount"):
            if key in feature_names:
                payload.features[key] = payload.creditAmount
                break  # нашли подходящий — хватит

    try:
        row = [float(payload.features.get(name, 0.0)) for name in feature_names]
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Bad feature value: {e}")

    X = np.asarray(row, dtype=float).reshape(1, -1)
    proba = float(model.predict_proba(X)[:, 1])
    decision = "approve" if proba >= THRESHOLD else "decline"
    return {"probability": proba, "decision": decision, "threshold": THRESHOLD}

if __name__ == "__main__":
    uvicorn.run("app:app", host="0.0.0.0", port=9000, reload=True)
