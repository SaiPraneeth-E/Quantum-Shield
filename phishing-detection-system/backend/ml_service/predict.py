"""
FastAPI ML Service: Quantum-Enhanced Phishing Detection.
Pipeline: URL -> features -> scaler -> quantum features -> final model -> prediction.
"""
import os
import numpy as np
from pathlib import Path
import joblib
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

from features import extract_url_features

app = FastAPI(title="Phishing Detection ML Service")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE = Path(__file__).resolve().parent
MODELS_LOADED = {}


def load_pkl(name: str):
    """Load pickle file if present."""
    path = BASE / f"{name}.pkl"
    if not path.exists():
        return None
    try:
        return joblib.load(path)
    except Exception:
        return None


def ensure_models():
    """Lazy-load models once."""
    if MODELS_LOADED:
        return
    scaler = load_pkl("scaler")
    quantum_model = load_pkl("quantum_model")
    quantum_scaler = load_pkl("quantum_scaler")
    phishing_model = load_pkl("phishing_model")
    MODELS_LOADED["scaler"] = scaler
    MODELS_LOADED["quantum_model"] = quantum_model
    MODELS_LOADED["quantum_scaler"] = quantum_scaler
    MODELS_LOADED["phishing_model"] = phishing_model


class PredictRequest(BaseModel):
    url: str


@app.post("/predict")
def predict(request: PredictRequest):
    ensure_models()
    url = (request.url or "").strip()
    if not url:
        raise HTTPException(status_code=400, detail="URL is required")

    # 1. Extract features from URL
    X = extract_url_features(url)

    scaler = MODELS_LOADED.get("scaler")
    quantum_model = MODELS_LOADED.get("quantum_model")
    quantum_scaler = MODELS_LOADED.get("quantum_scaler")
    phishing_model = MODELS_LOADED.get("phishing_model")

    if phishing_model is not None and scaler is not None:
        # 2. Preprocessing (scaler)
        X_scaled = scaler.transform(X)

        # 3. Quantum feature generation (if available)
        if quantum_model is not None:
            try:
                if hasattr(quantum_model, "transform"):
                    Q = quantum_model.transform(X_scaled)
                elif hasattr(quantum_model, "predict"):
                    Q = quantum_model.predict(X_scaled)
                else:
                    Q = X_scaled
                if quantum_scaler is not None and hasattr(quantum_scaler, "transform"):
                    Q = quantum_scaler.transform(Q)
                if Q.ndim == 1:
                    Q = Q.reshape(1, -1)
                X_final = np.hstack([X_scaled, Q]) if Q.shape[1] > 0 else X_scaled
            except Exception:
                X_final = X_scaled
        else:
            X_final = X_scaled

        # 4. Final model prediction
        pred = phishing_model.predict(X_final)[0]
        if hasattr(phishing_model, "predict_proba"):
            proba = phishing_model.predict_proba(X_final)[0]
            confidence = float(np.max(proba))
        else:
            confidence = 0.9 if pred == 1 else 0.9
            
        # Map to labels (assume 1 = phishing, 0 = legitimate, or class names)
        if hasattr(phishing_model, "classes_"):
            labels = list(phishing_model.classes_)
            pred_label = "phishing" if (pred == 1 or (labels and str(pred).lower() == "phishing")) else "legitimate"
        else:
            pred_label = "phishing" if pred == 1 else "legitimate"
            
        # Explainability: Extract Risk Factors
        risk_factors = []
        # features indices based on features.py:
        # [0]: len(full)
        # [19]: subdomain count
        # [18]: has IP (re.search IP)
        # [20]: https (1.0 if starts with https)
        # [23]: suspicious keywords count
        # [24]: hyphens in domain
        
        orig_features = X[0]
        
        if orig_features[18] == 1.0:
            risk_factors.append("IP Address used in domain")
        if orig_features[20] == 0.0:
            risk_factors.append("No HTTPS/SSL certificate")
        if orig_features[23] > 0:
            risk_factors.append("Suspicious keywords in URL (e.g., login, bank)")
        if orig_features[0] > 75:
            risk_factors.append("URL is abnormally long")
        if orig_features[19] > 2:
            risk_factors.append("Multiple subdomains detected")
        if orig_features[24] > 1:
             risk_factors.append("Multiple hyphens in domain")

    else:
        # Fallback when no .pkl files: simple heuristic + deterministic "demo" output
        features = X[0]
        suspicious_score = (
            features[18]
            + (1 - features[20])
            + min(1.0, features[0] / 200)
        ) / 3.0
        pred_label = "phishing" if suspicious_score > 0.45 else "legitimate"
        confidence = max(0.5, min(0.95, 0.5 + abs(suspicious_score - 0.5)))
        
        risk_factors = []
        if features[18] == 1.0: risk_factors.append("IP Address used in domain")
        if features[20] == 0.0: risk_factors.append("No HTTPS/SSL certificate")
        if features[23] > 0: risk_factors.append("Suspicious keywords in URL")
        if features[0] > 75: risk_factors.append("URL is abnormally long")

    return {
        "prediction": pred_label,
        "confidence": round(confidence, 4),
        "risk_factors": risk_factors
    }


@app.get("/health")
def health():
    return {"status": "ok"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=int(os.environ.get("PORT", 8000)))
