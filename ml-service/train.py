import pandas as pd
import numpy as np
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.metrics import classification_report, f1_score
import xgboost as xgb
import joblib
import os

np.random.seed(42)

# ─── STEP 1: Load and process FAO data ───────────────────────────────────────
print("Loading FAO data...")
fao = pd.read_csv('../data/raw/faostat_ghana.csv')

# Keep only Yield rows
yield_df = fao[fao['Element'] == 'Yield'][['Item', 'Year', 'Value']].copy()
yield_df.columns = ['crop', 'year', 'yield_kg_ha']
yield_df['crop'] = yield_df['crop'].str.lower().str.strip()

# Simplify crop names
crop_map = {
    'cassava, fresh': 'cassava',
    'cocoa beans': 'cocoa',
    'groundnuts, excluding shelled': 'groundnut',
    'maize (corn)': 'maize',
    'tomatoes': 'tomato',
    'yams': 'yam'
}
yield_df['crop'] = yield_df['crop'].map(crop_map)
yield_df = yield_df.dropna(subset=['crop'])

# Compute yield drop % vs crop's own mean — this is our real risk signal
crop_means = yield_df.groupby('crop')['yield_kg_ha'].mean()
yield_df['yield_mean'] = yield_df['crop'].map(crop_means)
yield_df['yield_drop_pct'] = (
    (yield_df['yield_mean'] - yield_df['yield_kg_ha']) / yield_df['yield_mean'] * 100
)

# Years with yield drop > 8% vs mean = historically bad year = high risk
yield_df['bad_year'] = (yield_df['yield_drop_pct'] > 8).astype(int)

print(f"FAO data loaded: {len(yield_df)} yield records")
print(yield_df.groupby('crop')['bad_year'].mean().round(2))

# ─── STEP 2: Generate synthetic farmer-level records ─────────────────────────
print("\nGenerating farmer-level dataset...")

regions = [
    'Ashanti', 'Brong-Ahafo', 'Central', 'Eastern',
    'Greater Accra', 'Northern', 'Upper East',
    'Upper West', 'Volta', 'Western'
]

crops = list(yield_df['crop'].unique())
years = list(yield_df['year'].unique())

n_samples = 1500
records = []

for _ in range(n_samples):
    crop = np.random.choice(crops)
    year = np.random.choice(years)
    region = np.random.choice(regions)

    # Get real FAO risk label for this crop+year
    match = yield_df[(yield_df['crop'] == crop) & (yield_df['year'] == year)]
    if len(match) == 0:
        continue
    bad_year = match['bad_year'].values[0]
    yield_drop = match['yield_drop_pct'].values[0]

    # Simulate weather features (realistic Ghana ranges)
    temp_max = np.random.uniform(28, 42)
    temp_min = np.random.uniform(18, 28)
    precip = np.random.uniform(0, 120)
    humidity = np.random.uniform(30, 95)
    soil_ph = np.round(np.random.uniform(4.5, 7.5), 1)
    days_since_planting = np.random.randint(7, 120)
    planting_month = np.random.randint(1, 13)

    # Build risk label: FAO bad year is the anchor,
    # weather pushes it higher or lower
    risk_score = 0.5 if bad_year else 0.2

    if temp_max > 38: risk_score += 0.15
    if precip < 10: risk_score += 0.20
    elif precip < 25: risk_score += 0.10
    if precip > 90: risk_score += 0.10
    if soil_ph < 5.0 or soil_ph > 7.0: risk_score += 0.10
    if humidity > 85: risk_score += 0.10
    if region in ['Northern', 'Upper East', 'Upper West']: risk_score += 0.08
    if days_since_planting < 21: risk_score += 0.08
    risk_score += np.random.uniform(-0.05, 0.08)

    label = 1 if risk_score >= 0.50 else 0

    records.append({
        'region': region,
        'crop_type': crop,
        'year': year,
        'planting_month': planting_month,
        'days_since_planting': days_since_planting,
        'soil_ph': soil_ph,
        'temperature_max': round(temp_max, 1),
        'temperature_min': round(temp_min, 1),
        'precipitation_7day': round(precip, 1),
        'humidity': round(humidity, 1),
        'yield_drop_pct': round(yield_drop, 2),
        'crop_loss_risk': label
    })

df = pd.DataFrame(records)
print(f"Dataset shape: {df.shape}")
print(f"\nRisk distribution:")
print(df['crop_loss_risk'].value_counts())
print(f"High risk %: {df['crop_loss_risk'].mean()*100:.1f}%")

# Save processed dataset
os.makedirs('../data/processed', exist_ok=True)
df.to_csv('../data/processed/crop_loss_dataset.csv', index=False)
print("\nDataset saved to data/processed/crop_loss_dataset.csv")

# ─── STEP 3: Train the model ─────────────────────────────────────────────────
print("\nTraining XGBoost model...")

# Encode categoricals
le_region = LabelEncoder()
le_crop = LabelEncoder()
df['region_enc'] = le_region.fit_transform(df['region'])
df['crop_enc'] = le_crop.fit_transform(df['crop_type'])

features = [
    'region_enc', 'crop_enc', 'planting_month',
    'days_since_planting', 'soil_ph', 'temperature_max',
    'temperature_min', 'precipitation_7day', 'humidity',
    'yield_drop_pct'
]

X = df[features]
y = df['crop_loss_risk']

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

model = xgb.XGBClassifier(
    n_estimators=100,
    max_depth=4,
    learning_rate=0.1,
    use_label_encoder=False,
    eval_metric='logloss',
    random_state=42
)

model.fit(X_train, y_train)

# Evaluate
y_pred = model.predict(X_test)
print("\nClassification Report:")
print(classification_report(y_test, y_pred))

cv_scores = cross_val_score(model, X, y, cv=5, scoring='f1')
print(f"Cross-validated F1: {cv_scores.mean():.3f} (+/- {cv_scores.std():.3f})")

# ─── STEP 4: Save model artifacts ────────────────────────────────────────────
os.makedirs('models', exist_ok=True)
joblib.dump(model, 'models/model.pkl')
joblib.dump(le_region, 'models/le_region.pkl')
joblib.dump(le_crop, 'models/le_crop.pkl')
joblib.dump(features, 'models/features.pkl')

print("\nModel artifacts saved to ml-service/models/")
print("  - models/model.pkl")
print("  - models/le_region.pkl")
print("  - models/le_crop.pkl")
print("  - models/features.pkl")
print("\nTraining complete!")