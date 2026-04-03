import numpy as np
import pickle
from sklearn.ensemble import IsolationForest, RandomForestClassifier
from pathlib import Path

# Reproducibility
np.random.seed(42)

# ===============================
# Isolation Forest Training
# ===============================

# Generate realistic "normal" transactions: 1 – 5000 EUR
normal_amounts = np.random.lognormal(mean=3.5, sigma=1.0, size=5000)
normal_amounts = normal_amounts[(normal_amounts > 1) & (normal_amounts < 5000)]

X_train_iso = normal_amounts.reshape(-1, 1)

iso_model = IsolationForest(
    n_estimators=200,
    contamination=0.01,
    random_state=42
)

iso_model.fit(X_train_iso)

# ===============================
# Random Forest Training
# ===============================

n_samples = 5000

amounts = np.random.exponential(scale=2000, size=n_samples)
is_new_country = np.random.randint(0, 2, n_samples)
tx_type = np.random.randint(0, 2, n_samples)
hour = np.random.randint(0, 24, n_samples)

X_rf = np.column_stack((amounts, is_new_country, tx_type, hour))

# Fraud pattern simulation
y_rf = (
    (amounts > 10000) |
    ((is_new_country == 1) & (tx_type == 1) & (hour > 22)) |
    (amounts > 50000)
).astype(int)

rf_model = RandomForestClassifier(
    n_estimators=200,
    max_depth=8,
    random_state=42
)

rf_model.fit(X_rf, y_rf)

# ===============================
# Save models
# ===============================

BASE_PATH = Path(__file__).parent

with open(BASE_PATH / "model.pkl", "wb") as f:
    pickle.dump(iso_model, f)

with open(BASE_PATH / "random_forest.pkl", "wb") as f:
    pickle.dump(rf_model, f)

# ===============================
# Quick sanity test
# ===============================

print("🔎 IsolationForest test:", iso_model.predict([[10], [100], [2000], [1000000]]))

test_features = [[5000, 1, 1, 23]]  # suspicious pattern
print("🔎 RandomForest fraud probability:", rf_model.predict_proba(test_features))

print("✅ Models trained and saved.")