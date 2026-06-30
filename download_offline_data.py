import os
import argparse
import requests
import pandas as pd
import random

# Make data directories
os.makedirs('data', exist_ok=True)
os.makedirs('models', exist_ok=True)

def download_weather_data(lat=23.25, lng=77.40):
    print(f"Fetching historical weather data for {lat}, {lng}...")
    # Open-Meteo historical API (Free, No Auth required)
    # Fetching past 30 days of precipitation, max temp, min temp, and humidity
    url = f"https://archive-api.open-meteo.com/v1/archive?latitude={lat}&longitude={lng}&start_date=2026-05-01&end_date=2026-05-30&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=auto"
    
    response = requests.get(url)
    if response.status_code == 200:
        data = response.json()
        df = pd.DataFrame(data['daily'])
        df.to_csv('data/weather_history.csv', index=False)
        print("[SUCCESS] Weather data saved to data/weather_history.csv")
    else:
        print("[ERROR] Failed to fetch weather data")

def generate_ground_truth():
    print("Generating synthetic ground truth crop labels...")
    data = []
    crops = ['Wheat', 'Soybean', 'Cotton']
    for i in range(1, 101):
        data.append({
            'farm_id': f'farm_{i}',
            'lat': round(random.uniform(23.20, 23.40), 4),
            'lng': round(random.uniform(77.30, 77.50), 4),
            'crop_type': random.choice(crops),
            'sowing_date': f'2026-06-{random.randint(1, 15):02d}'
        })
    df = pd.DataFrame(data)
    df.to_csv('data/ground_truth_labels.csv', index=False)
    print("[SUCCESS] Ground truth labels saved to data/ground_truth_labels.csv")

def download_resnet_weights():
    print("Downloading Torchvision ResNet18 pre-trained weights...")
    try:
        import torch
        import torchvision.models as models
        
        # Load pre-trained model
        model = models.resnet18(weights=models.ResNet18_Weights.IMAGENET1K_V1)
        torch.save(model.state_dict(), 'models/resnet18_weights.pth')
        print("[SUCCESS] ResNet18 weights saved to models/resnet18_weights.pth")
    except ImportError:
        print("[ERROR] torch or torchvision not installed. Run: pip install torch torchvision")
    except Exception as e:
        print(f"[ERROR] Failed to download weights: {e}")

def run_gee_downloads():
    print("\n--- Starting Google Earth Engine Downloads ---")
    try:
        import ee
        ee.Initialize()
        print("[SUCCESS] Earth Engine initialized successfully.")
    except Exception as e:
        print("[ERROR] Earth Engine initialization failed. Please run 'earthengine authenticate' in your terminal.")
        return

    # Define a Region of Interest (ROI) - Bhopal area
    roi = ee.Geometry.Rectangle([77.30, 23.20, 77.50, 23.40])
    date_start = '2026-05-01'
    date_end = '2026-05-30'

    # 1. Sentinel-2
    print("Exporting Sentinel-2 composite to Google Drive...")
    s2 = ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED') \
        .filterBounds(roi) \
        .filterDate(date_start, date_end) \
        .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 20)) \
        .median() \
        .clip(roi)
    
    task_s2 = ee.batch.Export.image.toDrive(
        image=s2.select(['B4', 'B8', 'B3']), # Red, NIR, Green
        description='Hackathon_Sentinel2_Composite',
        folder='Hackathon_Data',
        scale=10,
        region=roi
    )
    task_s2.start()
    
    # 2. MODIS NDVI History
    print("Exporting MODIS NDVI history to Google Drive...")
    modis = ee.ImageCollection("MODIS/061/MOD13Q1") \
        .filterBounds(roi) \
        .filterDate('2025-01-01', '2026-05-30') \
        .select('NDVI') \
        .median() \
        .clip(roi)
    
    task_modis = ee.batch.Export.image.toDrive(
        image=modis,
        description='Hackathon_MODIS_NDVI',
        folder='Hackathon_Data',
        scale=250,
        region=roi
    )
    task_modis.start()
    
    # 3. SMAP Soil Moisture
    print("Exporting SMAP Soil Moisture to Google Drive...")
    smap = ee.ImageCollection("NASA_USDA/HSL/SMAP10KM_soil_moisture") \
        .filterBounds(roi) \
        .filterDate(date_start, date_end) \
        .select('ssm') \
        .median() \
        .clip(roi)
        
    task_smap = ee.batch.Export.image.toDrive(
        image=smap,
        description='Hackathon_SMAP_Moisture',
        folder='Hackathon_Data',
        scale=10000,
        region=roi
    )
    task_smap.start()
    
    print("[SUCCESS] Earth Engine Export tasks started! Check your Google Drive 'Hackathon_Data' folder in a few minutes.")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Download Hackathon Offline Data")
    parser.add_argument('--gee', action='store_true', help="Run Google Earth Engine downloads")
    args = parser.parse_args()

    print("=== Starting Offline Data Preparation ===")
    download_weather_data()
    generate_ground_truth()
    download_resnet_weights()
    
    if args.gee:
        run_gee_downloads()
    else:
        print("\nSkipping GEE downloads. Run with --gee to execute Earth Engine tasks.")
        print("Note: You must run 'earthengine authenticate' first!")
