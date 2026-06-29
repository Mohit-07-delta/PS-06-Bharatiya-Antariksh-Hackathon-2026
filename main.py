from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import random
import joblib
import numpy as np

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

@app.get("/api/farms")
def get_farms():
    """Returns a list of dummy farms to populate the map."""
    return [
        {"id": "farm_1", "name": "North Field", "crop": "Wheat", "lat": 23.25, "lng": 77.40},
        {"id": "farm_2", "name": "South Field", "crop": "Soybean", "lat": 23.32, "lng": 77.48}
    ]

@app.get("/api/analyze/{farm_id}")
def analyze_farm(farm_id: str):
    # 1. Mock ML Classification Output
    if farm_id == "farm_2":
        predicted_crop = "Soybean"
        growth_stage = "Flowering"
        rainfall_8_day = 0.0  # mm
    else:
        predicted_crop = "Wheat"
        growth_stage = "Vegetative"
        rainfall_8_day = 20.0  # mm
        
    # Simulated confidence
    confidence = random.uniform(0.85, 0.98)

    # 2. FAO-56 Calculations
    kc_dict = {
        "Wheat": {"Vegetative": 0.8},
        "Soybean": {"Flowering": 1.15}
    }
    
    # Get the Crop Coefficient (Kc) for the specific crop and stage
    kc = kc_dict.get(predicted_crop, {}).get(growth_stage, 1.0)
    
    # Simulate a daily Reference Evapotranspiration (ET0) between 4.5 and 6.5 mm/day
    daily_et0 = random.uniform(4.5, 6.5)
    
    # Calculate 8-Day ETc (Crop Evapotranspiration / Water Requirement)
    etc_8_day = 8 * (daily_et0 * kc)
    
    # Calculate Water Deficit: Max(0, ETc - Rainfall)
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

    # Simulated NDWI-based moisture percent for backward compatibility with frontend
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
