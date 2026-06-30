import json
import os

DATA_FILE = os.path.join(os.path.dirname(__file__), 'data', 'field_band_statistics.json')

def extract_latest_features(farm_id: str):
    """
    Extracts the latest week (Week 4) satellite features for a farm
    and computes the Vegetation-Moisture Fusion Index (VMFI).
    """
    try:
        with open(DATA_FILE, 'r') as f:
            cache = json.load(f)
    except Exception as e:
        print(f"Warning: Could not read satellite cache: {e}")
        cache = {}

    # Default fallback profiles if field is missing or cache read fails
    if farm_id not in cache:
        if farm_id == 'farm_2':
            # Soybean peak vigor profile
            latest = {"week": "Week 4", "NDVI": 0.78, "NDWI": 0.22, "SAR_VV": -7.5, "SAR_VH": -11.0, "SAR_Ratio": 1.47}
        else:
            # Wheat vegetative profile
            latest = {"week": "Week 4", "NDVI": 0.48, "NDWI": -0.08, "SAR_VV": -8.5, "SAR_VH": -17.0, "SAR_Ratio": 2.00}
    else:
        # Get the last entry in the time-series (Week 4)
        latest = cache[farm_id][-1]

    # Compute Vegetation-Moisture Fusion Index (VMFI)
    # VMFI = NDVI * (1 + NDWI) * (SAR_Ratio)
    ndvi = latest["NDVI"]
    ndwi = latest["NDWI"]
    sar_ratio = latest.get("SAR_Ratio", latest["SAR_VH"] / latest["SAR_VV"] if latest["SAR_VV"] != 0 else 0)
    
    vmfi = round(ndvi * (1.0 + ndwi) * abs(sar_ratio), 4)

    return {
        "NDVI": ndvi,
        "NDWI": ndwi,
        "SAR_VV": latest["SAR_VV"],
        "SAR_VH": latest["SAR_VH"],
        "SAR_Ratio": sar_ratio,
        "VMFI": vmfi
    }

def extract_historical_features(farm_id: str):
    """
    Extracts the full 4-week time-series of satellite features for a farm.
    """
    try:
        with open(DATA_FILE, 'r') as f:
            cache = json.load(f)
    except Exception:
        cache = {}

    if farm_id not in cache:
        # Default mock time-series
        if farm_id == 'farm_2':
            return [
                {"week": "Week 1", "NDVI": 0.35, "NDWI": -0.10, "SAR_VV": -12.0, "SAR_VH": -20.0, "SAR_Ratio": 1.67},
                {"week": "Week 2", "NDVI": 0.52, "NDWI": 0.05, "SAR_VV": -10.5, "SAR_VH": -17.0, "SAR_Ratio": 1.62},
                {"week": "Week 3", "NDVI": 0.68, "NDWI": 0.18, "SAR_VV": -9.0, "SAR_VH": -14.0, "SAR_Ratio": 1.56},
                {"week": "Week 4", "NDVI": 0.78, "NDWI": 0.22, "SAR_VV": -7.5, "SAR_VH": -11.0, "SAR_Ratio": 1.47}
            ]
        else:
            return [
                {"week": "Week 1", "NDVI": 0.20, "NDWI": -0.35, "SAR_VV": -15.0, "SAR_VH": -25.0, "SAR_Ratio": 1.67},
                {"week": "Week 2", "NDVI": 0.28, "NDWI": -0.28, "SAR_VV": -13.0, "SAR_VH": -22.0, "SAR_Ratio": 1.69},
                {"week": "Week 3", "NDVI": 0.38, "NDWI": -0.18, "SAR_VV": -10.0, "SAR_VH": -19.0, "SAR_Ratio": 1.90},
                {"week": "Week 4", "NDVI": 0.48, "NDWI": -0.08, "SAR_VV": -8.5, "SAR_VH": -17.0, "SAR_Ratio": 2.00}
            ]
            
    return cache[farm_id]
