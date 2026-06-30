# Model Card: AgriSense AI Crop Classifier

## Model Description
- **Type:** Random Forest Classifier
- **Features:** 5 features (NDVI, NDWI, SAR_VV, SAR_VH, SAR_Ratio)
- **Classes:** Soybean, Wheat, Cotton

## Performance Metrics (Gaussian Realistic Evaluation)
- **Overall Accuracy:** 97.33%
- **Cohen's Kappa:** 0.9600

## Detailed Report
```
              precision    recall  f1-score   support

      Cotton       0.94      0.99      0.96       150
     Soybean       1.00      0.99      1.00       150
       Wheat       0.99      0.94      0.96       150

    accuracy                           0.97       450
   macro avg       0.97      0.97      0.97       450
weighted avg       0.97      0.97      0.97       450

```

## Methodology & Limitations
The model is trained on Gaussian-distributed synthetic profiles derived from remote sensing literature on crop reflectance (Sentinel-2 NDVI, NDWI) and radar backscatter (Sentinel-1 SAR VV, VH) characteristics in Central India (Bhopal region). 

### Limitations:
- The data is physically simulated, not fully extracted from ground-truth pixel geometries.
- Atmospheric and soil background noise variations are simplified.
- Temporal patterns are evaluated separately via the secondary LSTM Deep Learning module.
