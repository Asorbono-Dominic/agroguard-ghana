import joblib
import numpy as np
import os
from typing import Dict

# Load model artifacts at startup
BASE = os.path.dirname(os.path.abspath(__file__))
MODEL_DIR = os.path.join(BASE, "../../../ml-service/models")

model = joblib.load(os.path.join(MODEL_DIR, "model.pkl"))
le_region = joblib.load(os.path.join(MODEL_DIR, "le_region.pkl"))
le_crop = joblib.load(os.path.join(MODEL_DIR, "le_crop.pkl"))
features = joblib.load(os.path.join(MODEL_DIR, "features.pkl"))

RECOMMENDATIONS = {
    "high_temp": "Apply mulch around plants to retain soil moisture and reduce heat stress.",
    "low_rain": "Irrigate immediately — aim for at least 25mm of water over the next 3 days.",
    "excess_rain": "Improve field drainage to prevent waterlogging and root rot.",
    "poor_ph": "Apply lime to raise soil pH or sulphur to lower it toward the 5.5–6.5 optimal range.",
    "high_humidity": "Apply appropriate fungicide to prevent fungal disease spread.",
    "drought_region": "Consider drought-resistant crop varieties for this region.",
    "early_stage": "Young crops are vulnerable — monitor daily and protect from pests.",
}

def get_risk_level(score: float) -> str:
    if score >= 0.70:
        return "HIGH"
    elif score >= 0.45:
        return "MEDIUM"
    return "LOW"

def predict(
    region: str,
    crop_type: str,
    planting_month: int,
    days_since_planting: int,
    soil_ph: float,
    weather: Dict,
) -> Dict:
    # Encode categoricals safely
    region_enc = (
        le_region.transform([region])[0]
        if region in le_region.classes_
        else 0
    )
    crop_enc = (
        le_crop.transform([crop_type])[0]
        if crop_type in le_crop.classes_
        else 0
    )

    # Use median yield_drop_pct as neutral value
    yield_drop_pct = 5.0

    feature_vector = np.array([[
        region_enc,
        crop_enc,
        planting_month,
        days_since_planting,
        soil_ph,
        weather["temperature_max"],
        weather["temperature_min"],
        weather["precipitation_7day"],
        weather["humidity"],
        yield_drop_pct,
    ]])

    risk_score = float(model.predict_proba(feature_vector)[0][1])
    risk_level = get_risk_level(risk_score)

    # Determine contributing factors
    factors = []
    recs = []

    if weather["temperature_max"] > 35:
        factors.append("High temperature stress")
        recs.append(RECOMMENDATIONS["high_temp"])
    if weather["precipitation_7day"] < 20:
        factors.append("Low rainfall forecast")
        recs.append(RECOMMENDATIONS["low_rain"])
    if weather["precipitation_7day"] > 90:
        factors.append("Excessive rainfall risk")
        recs.append(RECOMMENDATIONS["excess_rain"])
    if soil_ph < 5.0 or soil_ph > 7.0:
        factors.append("Suboptimal soil pH")
        recs.append(RECOMMENDATIONS["poor_ph"])
    if weather["humidity"] > 85:
        factors.append("High humidity — fungal risk")
        recs.append(RECOMMENDATIONS["high_humidity"])
    if region in ["Northern", "Upper East", "Upper West"]:
        factors.append("Drought-prone region")
        recs.append(RECOMMENDATIONS["drought_region"])
    if days_since_planting < 21:
        factors.append("Early growth stage — high vulnerability")
        recs.append(RECOMMENDATIONS["early_stage"])

    if not factors:
        factors = ["Conditions are within normal range"]
        recs = ["Continue regular monitoring and maintain current practices."]

    return {
        "risk_score": round(risk_score * 100, 1),
        "risk_level": risk_level,
        "factors": factors[:3],
        "recommendations": recs[:3],
    } 
