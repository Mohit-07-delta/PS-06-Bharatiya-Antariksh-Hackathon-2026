import pandas as pd
import numpy as np
import joblib
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.metrics import accuracy_score, cohen_kappa_score, classification_report, confusion_matrix
import os

print("--- PS-06: Machine Learning Model Evaluation ---")
print("Loading 'crop_rf_model.pkl'...")
try:
    model = joblib.load('crop_rf_model.pkl')
except FileNotFoundError:
    print("❌ Error: crop_rf_model.pkl not found. Run 'python train_model.py' first.")
    exit(1)

print("Generating physically realistic validation dataset (150 samples per crop)...")
np.random.seed(99)
n_val = 150

# 1. Soybean
soybean_ndvi = np.random.normal(0.75, 0.06, n_val)
soybean_ndwi = np.random.normal(0.18, 0.05, n_val)
soybean_vv = np.random.normal(-8.0, 1.0, n_val)
soybean_vh = np.random.normal(-12.0, 1.2, n_val)
soybean_crop = ['Soybean'] * n_val

# 2. Wheat
wheat_ndvi = np.random.normal(0.40, 0.08, n_val)
wheat_ndwi = np.random.normal(-0.15, 0.07, n_val)
wheat_vv = np.random.normal(-11.0, 1.5, n_val)
wheat_vh = np.random.normal(-19.5, 2.0, n_val)
wheat_crop = ['Wheat'] * n_val

# 3. Cotton
cotton_ndvi = np.random.normal(0.55, 0.07, n_val)
cotton_ndwi = np.random.normal(-0.05, 0.05, n_val)
cotton_vv = np.random.normal(-9.5, 1.0, n_val)
cotton_vh = np.random.normal(-14.5, 1.2, n_val)
cotton_crop = ['Cotton'] * n_val

# Merge validation dataset
df = pd.DataFrame({
    'NDVI': np.concatenate([soybean_ndvi, wheat_ndvi, cotton_ndvi]),
    'NDWI': np.concatenate([soybean_ndwi, wheat_ndwi, cotton_ndwi]),
    'SAR_VV': np.concatenate([soybean_vv, wheat_vv, cotton_vv]),
    'SAR_VH': np.concatenate([soybean_vh, wheat_vh, cotton_vh]),
    'True_Crop': np.concatenate([soybean_crop, wheat_crop, cotton_crop])
})

df['SAR_Ratio'] = df['SAR_VH'] / df['SAR_VV']

X_test = df[['NDVI', 'NDWI', 'SAR_VV', 'SAR_VH', 'SAR_Ratio']]
y_true = df['True_Crop']

print("\nRunning Inference...")
y_pred = model.predict(X_test)

# Calculate Metrics
acc = accuracy_score(y_true, y_pred)
kappa = cohen_kappa_score(y_true, y_pred)

print("\n" + "="*50)
print(f"[METRIC] Overall Accuracy: {acc * 100:.2f}% (Target > 85%)")
print(f"[METRIC] Kappa Coefficient: {kappa:.4f}")
print("="*50 + "\n")

print("Detailed Classification Report:")
report = classification_report(y_true, y_pred)
print(report)

print("Generating Confusion Matrix Plot...")
cm = confusion_matrix(y_true, y_pred, labels=['Soybean', 'Wheat', 'Cotton'])
plt.figure(figsize=(8, 6))
sns.heatmap(cm, annot=True, fmt='d', cmap='Blues', xticklabels=['Soybean', 'Wheat', 'Cotton'], yticklabels=['Soybean', 'Wheat', 'Cotton'])
plt.title('Crop Classification Confusion Matrix (Gaussian Data)')
plt.xlabel('Predicted Label')
plt.ylabel('True Label')
plt.tight_layout()

os.makedirs('plots', exist_ok=True)
plot_path = 'plots/confusion_matrix.png'
plt.savefig(plot_path, dpi=300)
print(f"[SUCCESS] Confusion Matrix saved to '{plot_path}'")

# Generate MODEL_CARD.md
model_card_content = f"""# Model Card: AgriSense AI Crop Classifier

## Model Description
- **Type:** Random Forest Classifier
- **Features:** 5 features (NDVI, NDWI, SAR_VV, SAR_VH, SAR_Ratio)
- **Classes:** Soybean, Wheat, Cotton

## Performance Metrics (Gaussian Realistic Evaluation)
- **Overall Accuracy:** {acc * 100:.2f}%
- **Cohen's Kappa:** {kappa:.4f}

## Detailed Report
```
{report}
```

## Methodology & Limitations
The model is trained on Gaussian-distributed synthetic profiles derived from remote sensing literature on crop reflectance (Sentinel-2 NDVI, NDWI) and radar backscatter (Sentinel-1 SAR VV, VH) characteristics in Central India (Bhopal region). 

### Limitations:
- The data is physically simulated, not fully extracted from ground-truth pixel geometries.
- Atmospheric and soil background noise variations are simplified.
- Temporal patterns are evaluated separately via the secondary LSTM Deep Learning module.
"""

with open('MODEL_CARD.md', 'w') as f:
    f.write(model_card_content)
print("Created MODEL_CARD.md successfully!")
print("\nEvaluation Complete!")
