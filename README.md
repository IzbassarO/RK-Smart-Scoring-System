# RK Smart Scoring System

dotnet run --launch-profile "backend"

npm run dev

curl -i http://localhost:8080/api/client/100002

# 1) Подними сервис
uvicorn app:app --host 0.0.0.0 --port 9000

# 2) Посмотри контракт фичей
curl http://localhost:9000/model/features

# 3) Тестовый запрос (заполни реальные значения!)
curl -X POST http://localhost:9000/predict \
  -H "Content-Type: application/json" \
  -d '{
    "features": {
      "AMT_INCOME_TOTAL": 1800000,
      "AMT_CREDIT": 800000,
      "AMT_ANNUITY": 85000,
      "AMT_GOODS_PRICE": 900000,
      "CNT_CHILDREN": 0,
      "CNT_FAM_MEMBERS": 2,
      "CODE_GENDER": "M",
      "NAME_FAMILY_STATUS": "Single / not married",
      "NAME_HOUSING_TYPE": "House / apartment",
      "NAME_INCOME_TYPE": "Working",
      "NAME_EDUCATION_TYPE": "Secondary / secondary special",
      "OCCUPATION_TYPE": "Laborers",
      "EXT_SOURCE_1": 0.52,
      "EXT_SOURCE_2": 0.71,
      "EXT_SOURCE_3": 0.48,
      "REGION_RATING_CLIENT": 2,
      "REGION_RATING_CLIENT_W_CITY": 2,
      "AMT_CREDIT_PER_PERSON": 400000,
      "AMT_INCOME_TOTAL_PER_PERSON": 900000,
      "AMT_ANNUITY_PER_PERSON": 42500
    }
  }'

<div align="center">

# 🧠 SmartScoring KZ  
### Intelligent Credit Scoring System powered by AI

*Modern full-stack platform for real-time creditworthiness evaluation using machine learning.*

</div>

---

## 📘 Overview

**SmartScoring KZ** is an end-to-end credit scoring system that combines  
AI-driven analytics, a .NET backend, and a FastAPI microservice for ML predictions.

It enables financial institutions to evaluate clients’ creditworthiness  
instantly, securely, and transparently.

---

## 🚀 Key Features

- 🔍 **Client Search by IIN** — instantly retrieve client profiles from MongoDB.  
- 🤖 **AI-Powered Scoring** — LightGBM model hosted in a FastAPI ML microservice.  
- 🧮 **Explainable Predictions** — interpretable results and decision probabilities.  
- ⚙️ **RESTful Architecture** — clean separation between frontend, backend, and ML.  
- 📊 **Swagger Documentation** — interactive API docs built into the backend.  
- 🐳 **Dockerized Infrastructure** — deploy all services with a single command.  

---

## 🏗️ System Architecture

```text
[ React + Tailwind + MaterialTailwind ]
                │
                ▼
   [ ASP.NET Core 8 Web API (C#) ]
                │
                ▼
     [ FastAPI (ML microservice) ]
                │
                ▼
             [ MongoDB ]
