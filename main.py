from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import random

app = FastAPI(title="AgriSense AI API")

# Allow Next.js frontend to communicate with this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Change to your frontend URL in production
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/farms")
def get_farms():
    """Returns a list of dummy farms to populate the map."""
    return [
        {"id": "farm_1", "name": "North Field", "crop": "Wheat", "lat": 23.25, "lng": 77.40},
        {"id": "farm_2", "name": "South Field", "crop": "Soybean", "lat": 23.32, "lng": 77.48}
    ]

@app.get("/api/analyze/{farm_id}")
def analyze_farm(farm_id: str):
    """
    Mock ML Pipeline & Rule Engine. 
    Later, you will replace this logic with your .pkl model predictions.
    """
    # Simulating data extraction and model inference
    moisture = random.randint(20, 60)
    
    # Simple Rule Engine (as per your pitch)
    stress_level = "High" if moisture < 35 else "Low"
    if stress_level == "High":
        recommendation = "Irrigate 25mm today. High evapotranspiration detected."
    else:
        recommendation = "Moisture is optimal. Next irrigation check in 3 days."
    
    return {
        "farm_id": farm_id,
        "crop": "Soybean" if farm_id == "farm_2" else "Wheat",
        "confidence": 0.94,
        "moisture_percent": moisture,
        "stress_level": stress_level,
        "growth_stage": "Flowering",
        "recommendation": recommendation
    }
