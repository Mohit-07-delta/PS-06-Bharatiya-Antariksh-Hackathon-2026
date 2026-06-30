import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
import joblib

print("Generating synthetic satellite training data...")
# Simulating features extracted from Google Earth Engine (Sentinel-1 & 2)
# Features: NDVI (Vegetation), NDWI (Water), VV & VH (SAR Backscatter)
data = {
    'NDVI': np.random.uniform(0.2, 0.9, 1000),
    'NDWI': np.random.uniform(-0.5, 0.5, 1000),
    'SAR_VV': np.random.uniform(-20, -5, 1000),
    'SAR_VH': np.random.uniform(-30, -10, 1000),
}
# PS-06 Specific Requirement: SAR VH/VV Ratio
data['SAR_Ratio'] = data['SAR_VH'] / data['SAR_VV']
df = pd.DataFrame(data)

# Rule-based target generation for training
# If high NDVI and specific SAR, label as 'Soybean', else 'Wheat', etc.
conditions = [
    (df['NDVI'] > 0.6) & (df['NDWI'] > 0.1),
    (df['NDVI'] <= 0.6) & (df['SAR_Ratio'] > 1.5)
]
choices = ['Soybean', 'Wheat']
df['Crop_Type'] = np.select(conditions, choices, default='Cotton')

# Train the Model
print("Training Random Forest Classifier...")
X = df[['NDVI', 'NDWI', 'SAR_VV', 'SAR_VH', 'SAR_Ratio']]
y = df['Crop_Type']

model = RandomForestClassifier(n_estimators=50, random_state=42)
model.fit(X, y)

# Save the model for FastAPI to use
joblib.dump(model, 'crop_rf_model.pkl')
print("Model saved successfully as 'crop_rf_model.pkl'!")
