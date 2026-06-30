from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import random
import joblib
import numpy as np

import pandas as pd
import json

app = FastAPI(title="AgriSense AI API")

# Allow Next.js frontend to communicate with this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Change to your frontend URL in production
    allow_methods=["*"],
    allow_headers=["*"],
)

# LOAD THE PRE-TRAINED AI MODEL
try:
    rf_model = joblib.load('crop_rf_model.pkl')
    print("ML Model loaded successfully!")
except Exception as e:
    print("Warning: Model not found. Run train_model.py first.")
    rf_model = None

# LOAD CONFIG
try:
    with open('config.json', 'r') as f:
        config = json.load(f)
        kc_dict = config.get("kc_dict", {})
except Exception as e:
    print("Warning: config.json not found.")
    kc_dict = {"Wheat": {"Vegetative": 0.8}, "Soybean": {"Flowering": 1.15}}

def get_farm_analysis(farm_id: str):
    # 1. Real ML Pipeline Inference
    if rf_model:
        if farm_id == "farm_2":
            features_dict = {'NDVI': [0.75], 'NDWI': [0.15], 'SAR_VV': [-10.0], 'SAR_VH': [-15.0]}
        else:
            features_dict = {'NDVI': [0.45], 'NDWI': [-0.10], 'SAR_VV': [-8.0], 'SAR_VH': [-20.0]}
            
        features_df = pd.DataFrame(features_dict)
        predicted_crop = rf_model.predict(features_df)[0]
        confidence = float(max(rf_model.predict_proba(features_df)[0]))
    else:
        predicted_crop = "Soybean" if farm_id == "farm_2" else "Wheat"
        confidence = random.uniform(0.85, 0.98)

    # Growth stage mapping and dummy rainfall
    if predicted_crop == "Soybean":
        growth_stage = "Flowering"
        rainfall_8_day = 0.0  # mm
    else:
        growth_stage = "Vegetative"
        rainfall_8_day = 20.0  # mm

    # 2. FAO-56 Calculations
    kc = kc_dict.get(predicted_crop, {}).get(growth_stage, 1.0)
    daily_et0 = random.uniform(4.5, 6.5)
    etc_8_day = 8 * (daily_et0 * kc)
    water_deficit_mm = max(0.0, etc_8_day - rainfall_8_day)

    # 3. Rule Engine Output
    if water_deficit_mm <= 0:
        stress_level = "Healthy"
        recommendation = f"{predicted_crop} ({growth_stage}): Optimal moisture. No irrigation needed. Surplus rainfall detected."
    elif 0 < water_deficit_mm <= 15:
        stress_level = "Low"
        recommendation = f"{predicted_crop} ({growth_stage}): Mild deficit ({water_deficit_mm:.1f} mm). Monitor soil moisture closely; no immediate irrigation required."
    elif 15 < water_deficit_mm <= 30:
        stress_level = "Medium"
        recommendation = f"{predicted_crop} ({growth_stage}): Moderate stress detected ({water_deficit_mm:.1f} mm deficit). Plan to irrigate in the next 2-3 days."
    else:
        stress_level = "High"
        recommendation = f"CRITICAL: {predicted_crop} ({growth_stage}) is facing severe water stress ({water_deficit_mm:.1f} mm deficit). Irrigate immediately to prevent yield loss."

    if stress_level == "Healthy":
        moisture = random.randint(60, 80)
    elif stress_level == "Low":
        moisture = random.randint(45, 59)
    elif stress_level == "Medium":
        moisture = random.randint(30, 44)
    else:
        moisture = random.randint(15, 29)

    return {
        "farm_id": farm_id,
        "crop": predicted_crop,
        "confidence": round(confidence, 2),
        "moisture_percent": moisture,
        "stress_level": stress_level,
        "growth_stage": growth_stage,
        "water_deficit_mm": round(water_deficit_mm, 2),
        "recommendation": recommendation
    }

@app.get("/api/farms")
def get_farms():
    """Returns aggregated farm data with stress levels."""
    farms = [
        {"id": "farm_1", "name": "North Field", "lat": 23.25, "lng": 77.40},
        {"id": "farm_2", "name": "South Field", "lat": 23.32, "lng": 77.48}
    ]
    # Append analysis dynamically
    for farm in farms:
        analysis = get_farm_analysis(farm["id"])
        farm["crop"] = analysis["crop"]
        farm["stress_level"] = analysis["stress_level"]
    return farms

@app.get("/api/analyze/{farm_id}")
def analyze_farm(farm_id: str):
    return get_farm_analysis(farm_id)
