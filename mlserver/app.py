from fastapi import FastAPI
from pydantic import BaseModel
import numpy as np

class ClientData(BaseModel):
    features: dict

app = FastAPI()

def fake_lgbm_predict_proba(x: dict) -> float:
    income = float(x.get("AMT_INCOME_TOTAL", 0))
    amount = float(x.get("AMT_CREDIT", 0))
    risk = min(0.99, max(0.01, amount / (income + 1e-6) * 0.1))
    return risk

def simple_bandit_decide(p_default: float):
    if p_default < 0.3:
        return "approve_standard", 0.08, 0.8, "Низкий риск — одобрить по стандартной ставке."
    elif p_default < 0.5:
        return "approve_high_rate", 0.05, 0.7, "Средний риск — одобрить по повышенной ставке."
    else:
        return "reject", -0.01, 0.9, "Высокий риск — отказать."

@app.post("/predict")
def predict(data: ClientData):
    p = float(fake_lgbm_predict_proba(data.features))
    action, exp_reward, conf, expl = simple_bandit_decide(p)
    return {
        "prob_default": p,
        "decision": action,
        "expected_reward": exp_reward,
        "confidence": conf,
        "explanation": expl,
        "top_factors": ["EXT_SOURCE_2", "DAYS_EMPLOYED", "PAYMENT_RATE"]
    }
