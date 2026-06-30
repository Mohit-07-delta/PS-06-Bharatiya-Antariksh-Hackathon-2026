# 🌱 AgriSense AI
**Bharatiya Antariksh Hackathon 2026 | Problem Statement 06**

An AI-powered, multi-modal satellite data platform for automated crop type mapping, growth stage phenology tracking, and FAO-56 moisture stress advisory.

---

## 🚀 Quick Start

### 1. Backend (FastAPI + Machine Learning)
```bash
# Create and activate virtual environment
python -m venv venv
.\venv\Scripts\activate      # Windows
# source venv/bin/activate   # Linux/Mac

# Install dependencies
pip install -r requirements.txt

# Run the API server
uvicorn main:app --port 8000 --reload
```

### 2. Frontend (Next.js + React)
```bash
# Open a new terminal
npm install
npm run dev
```
*Access the interactive dashboard at `http://localhost:3000`*

### 3. Offline Data & Google Earth Engine Setup
To fetch real Sentinel-2 and MODIS data:
```bash
earthengine authenticate
python download_offline_data.py --gee
```

---

## 📂 Project Structure

```text
ps-06-agrisense/
├── main.py                  # Core FastAPI backend & orchestration
├── train_model.py           # Trains the Random Forest classifier
├── download_offline_data.py # GEE & Open-Meteo data extraction pipeline
├── config.json              # Dynamic thresholds (FAO-56 Kc values)
├── pages/
│   └── index.js             # Next.js Dashboard Entry Point
├── components/
│   ├── MapWidget.jsx        # Leaflet dynamic map interface
│   └── HistoryChart.jsx     # Recharts time-series visualization
├── crop_rf_model.pkl        # Serialized pre-trained Random Forest model
├── data/                    # Generated ground truth & weather data
└── models/                  # Exported PyTorch/Torchvision weights
```

---

## ⚙️ Pipeline Architecture

| Phase | Component | What it does |
| :--- | :--- | :--- |
| **1. Ingestion** | `download_offline_data.py` | Extracts Sentinel-2 (Optical), Sentinel-1 (SAR), and SMAP data via Google Earth Engine. Fetches local weather via Open-Meteo. |
| **2. Inference** | `main.py` | Assembles features (NDVI, NDWI, SAR_VV, SAR_VH) → Passes to Random Forest Classifier → Predicts Crop Type & Confidence. |
| **3. Agronomy** | `main.py` (FAO-56 Engine) | Maps predicted crop to growth stage. Calculates Crop Evapotranspiration (ETc) using Kc values to estimate Water Deficit (mm). |
| **4. Advisory** | `main.py` (Rule Engine) | Translates deficit into actionable local irrigation advice (Healthy, Low, Medium, High Stress). |
| **5. Interface** | Next.js + Leaflet | Renders real-time, color-coded map markers avoiding N+1 latency bottlenecks via asynchronous fetching. |

---

## 🧠 ML Classifier Details

- **Algorithm:** RandomForestClassifier
- **Features:** 
  - `NDVI` (Normalized Difference Vegetation Index)
  - `NDWI` (Normalized Difference Water Index)
  - `SAR_VV` & `SAR_VH` (Synthetic Aperture Radar backscatter)
- **Irrigation Logic:** Implements the UN **FAO-56 Penman-Monteith** standard for crop water requirements.
- **Handling Latency:** The system avoids the backend N+1 problem by returning O(1) lightweight geometries on map load, and performing heavy ML/GEE inference only upon discrete user field selection.

---

## 📡 Data Sources

| Data Type | Source | Purpose |
| :--- | :--- | :--- |
| Optical Imagery | Sentinel-2 (via GEE) | NDVI & NDWI extraction |
| Radar Imagery | Sentinel-1 (via GEE) | Cloud-penetrating structural data (SAR) |
| Soil Moisture | NASA SMAP / ESA | Base moisture initialization |
| Weather Data | Open-Meteo API | Historical precipitation & ET0 |

---

## ⚠️ Known Limitations & Future Scope

1. **Google Earth Engine Quotas:** Heavy concurrent requests to GEE can result in rate limits. The current pipeline mitigates this by fetching analysis dynamically per-field.
2. **Deep Learning Integration:** Currently utilizes a robust Random Forest baseline. Integrating the downloaded PyTorch `ResNet18` weights for spatial CNN-based classification is the immediate next step.
3. **Hyperlocal Weather:** ET0 is currently approximated. Connecting to ISRO's MOSDAC APIs for hyper-accurate local meteorological data would improve FAO-56 precision.

---
*Built for the Bharatiya Antariksh Hackathon 2026*
