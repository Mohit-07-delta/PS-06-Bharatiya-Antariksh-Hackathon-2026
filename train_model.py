import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
import joblib

print("Generating physically realistic crop training data (Gaussian profiles)...")
np.random.seed(42)
n_samples = 500

# 1. Soybean: High NDVI, High NDWI, high SAR backscatter
soybean_ndvi = np.random.normal(0.75, 0.06, n_samples)
soybean_ndwi = np.random.normal(0.18, 0.05, n_samples)
soybean_vv = np.random.normal(-8.0, 1.0, n_samples)
soybean_vh = np.random.normal(-12.0, 1.2, n_samples)
soybean_crop = ['Soybean'] * n_samples

# 2. Wheat: Low-medium NDVI, lower NDWI, moderate SAR backscatter
wheat_ndvi = np.random.normal(0.40, 0.08, n_samples)
wheat_ndwi = np.random.normal(-0.15, 0.07, n_samples)
wheat_vv = np.random.normal(-11.0, 1.5, n_samples)
wheat_vh = np.random.normal(-19.5, 2.0, n_samples)
wheat_crop = ['Wheat'] * n_samples

# 3. Cotton: Medium-high NDVI, medium NDWI, moderate-high SAR backscatter
cotton_ndvi = np.random.normal(0.55, 0.07, n_samples)
cotton_ndwi = np.random.normal(-0.05, 0.05, n_samples)
cotton_vv = np.random.normal(-9.5, 1.0, n_samples)
cotton_vh = np.random.normal(-14.5, 1.2, n_samples)
cotton_crop = ['Cotton'] * n_samples

# Merge datasets
df = pd.DataFrame({
    'NDVI': np.concatenate([soybean_ndvi, wheat_ndvi, cotton_ndvi]),
    'NDWI': np.concatenate([soybean_ndwi, wheat_ndwi, cotton_ndwi]),
    'SAR_VV': np.concatenate([soybean_vv, wheat_vv, cotton_vv]),
    'SAR_VH': np.concatenate([soybean_vh, wheat_vh, cotton_vh]),
    'Crop_Type': np.concatenate([soybean_crop, wheat_crop, cotton_crop])
})

# PS-06 Specific Requirement: SAR VH/VV Ratio
df['SAR_Ratio'] = df['SAR_VH'] / df['SAR_VV']


# Train the Model
print("Training Random Forest Classifier...")
X = df[['NDVI', 'NDWI', 'SAR_VV', 'SAR_VH', 'SAR_Ratio']]
y = df['Crop_Type']

model = RandomForestClassifier(n_estimators=50, random_state=42)
model.fit(X, y)

# Save the model for FastAPI to use
joblib.dump(model, 'crop_rf_model.pkl')
print("Model saved successfully as 'crop_rf_model.pkl'!")
