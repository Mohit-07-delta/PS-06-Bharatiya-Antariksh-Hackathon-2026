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
    # 1. Simulate extracting satellite features for the selected farm
    ndvi = random.uniform(0.3, 0.85)
    ndwi = random.uniform(-0.2, 0.4)
    sar_vv = random.uniform(-18, -8)
    sar_vh = random.uniform(-25, -12)
    
    # 2. RUN ACTUAL ML PREDICTION
    if rf_model:
        features = np.array([[ndvi, ndwi, sar_vv, sar_vh]])
        predicted_crop = rf_model.predict(features)[0]
        
        # Get probability (confidence score)
        probabilities = rf_model.predict_proba(features)[0]
        confidence = round(max(probabilities) * 100, 1)
    else:
        predicted_crop = "Unknown"
        confidence = 0.0

    # 3. Moisture & Rule Engine
    # Convert NDWI directly to a mock moisture percentage
    moisture = int((ndwi + 0.5) * 100) 
    growth_stage = "Flowering" if ndvi > 0.6 else "Vegetative"

    if moisture >= 50:
        stress_level = "Healthy"
        recommendation = f"Moisture is optimal. {predicted_crop} is healthy."
    elif 35 <= moisture < 50:
        stress_level = "Medium"
        recommendation = f"Monitor closely. Plan to irrigate {predicted_crop} in 2-3 days."
    else:
        stress_level = "High"
        recommendation = f"CRITICAL: {predicted_crop} is in {growth_stage} stage with low moisture. Irrigate 25 mm immediately."

    return {
        "farm_id": farm_id,
        "crop": predicted_crop,
        "confidence": confidence / 100,  # Frontend expects a decimal
        "moisture_percent": moisture,
        "stress_level": stress_level,
        "growth_stage": growth_stage,
        "recommendation": recommendation
    }
