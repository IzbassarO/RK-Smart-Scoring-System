# app.py
import os, json, pickle
from typing import Dict, Any, List
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import numpy as np
import pandas as pd

MODEL_PATH = os.getenv("MODEL_PATH", "models/safe_lgb_model.pkl")
DECISION_THRESHOLD = float(os.getenv("DECISION_THRESHOLD", "0.70"))
FEATURES_PATH = os.getenv("FEATURES_PATH", "models/expected_features.json")

# === Загрузка модели ===
try:
    with open(MODEL_PATH, "rb") as f:
        PIPELINE = pickle.load(f)
except Exception as e:
    raise RuntimeError(f"Не удалось загрузить модель из {MODEL_PATH}: {e}")

# === Определяем EXPECTED_FEATURES ===
EXPECTED_FEATURES: List[str] = []
# 1) если есть сохранённый json — используем его
if os.path.exists(FEATURES_PATH):
    with open(FEATURES_PATH, "r", encoding="utf-8") as f:
        EXPECTED_FEATURES = json.load(f)

# 2) иначе — пробуем вытащить из самой модели (LGBMClassifier -> booster_.feature_name())
if not EXPECTED_FEATURES:
    booster = getattr(PIPELINE, "booster_", None)
    if booster is not None and hasattr(booster, "feature_name"):
        EXPECTED_FEATURES = list(booster.feature_name())

# 3) на худой конец — аварийный фоллбэк (но лучше до этого не доводить)
if not EXPECTED_FEATURES:
    raise RuntimeError("Не удалось определить список признаков: сохраните models/expected_features.json или используйте LGBMClassifier.booster_.feature_name().")

app = FastAPI(title="Credit Scoring Inference", version="1.0.1")

class ScoreRequest(BaseModel):
    features: Dict[str, Any]

class ScoreResponse(BaseModel):
    probability: float
    decision: str
    threshold: float

@app.get("/health")
def health():
    return {"status": "ok", "threshold": DECISION_THRESHOLD}

@app.get("/model/features")
def model_features():
    return {"expected_features": EXPECTED_FEATURES}

@app.post("/predict", response_model=ScoreResponse)
def predict(req: ScoreRequest):
    # Собираем ряд РОВНО в порядке EXPECTED_FEATURES
    row = [req.features.get(f, None) for f in EXPECTED_FEATURES]
    # В DataFrame с именами колонок — так пропадёт warning про feature names
    X = pd.DataFrame([row], columns=EXPECTED_FEATURES)
    # None -> NaN
    X = X.replace({None: np.nan})

    try:
        proba = float(PIPELINE.predict_proba(X)[0][1])
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {e}")

    decision = "approve" if proba >= DECISION_THRESHOLD else "decline"
    return ScoreResponse(probability=proba, decision=decision, threshold=DECISION_THRESHOLD)

EXPECTED_FEATURES = []

# 1) пробуем достать из модели
def feature_names_from_model(m):
    b = getattr(m, "booster_", None)
    if b is not None and hasattr(b, "feature_name"):
        return list(b.feature_name())
    try:
        b = m.named_steps["model"].booster_
        return list(b.feature_name())
    except Exception:
        return []

EXPECTED_FEATURES = feature_names_from_model(PIPELINE)

# 2) если не нашли в модели — берем из файла
if not EXPECTED_FEATURES and os.path.exists(FEATURES_PATH):
    with open(FEATURES_PATH, "r", encoding="utf-8") as f:
        EXPECTED_FEATURES = json.load(f)

if not EXPECTED_FEATURES:
    raise RuntimeError("Не удалось определить список признаков (ни в модели, ни в json).")