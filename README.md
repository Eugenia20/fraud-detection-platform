# Fraud Detection Platform

A production-ready full-stack financial fraud detection system using machine learning and rule-based analysis. The system monitors transactions in real time, assigns risk scores, and flags suspicious activity for further investigation.

---

## 🚀 Features

* Real-time transaction monitoring
* Machine learning-based fraud detection
* Rule-based risk scoring system
* JWT authentication and role-based access
* Admin dashboard for fraud analysis
* Secure API with rate limiting and logging

---

## 🏗️ Project Structure

```
backend/     → FastAPI backend (API, ML integration, database)
frontend/    → React frontend (UI, dashboards)
```

---

## 🧠 Tech Stack

### Backend

* Python
* FastAPI
* PostgreSQL
* SQLAlchemy
* Alembic

### Machine Learning

* Scikit-learn
* Pandas
* NumPy

### Frontend

* React (Vite)
* TailwindCSS

### DevOps

* Docker (in progress)
* GitHub (version control & CI/CD)

---

## ⚙️ How to Run (Development)

### Backend

```
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Frontend

```
cd frontend
npm install
npm run dev
```

---

## 🔐 Security Features

* JWT authentication
* Password hashing
* Rate limiting
* Input validation (Pydantic)
* Fraud detection (ML + rules)

---

## 📊 Dataset

The machine learning model was trained using a publicly available financial transactions dataset obtained from Kaggle.

* Dataset: *Financial Transactions Dataset for Fraud Detection*
* Source: Kaggle

Due to size and licensing constraints, the dataset is not included in this repository.

You can access the dataset here:
https://www.kaggle.com/datasets/aryan208/financial-transactions-dataset-for-fraud-detection

---

## 📊 Fraud Detection Approach

The system uses a hybrid fraud detection model combining machine learning and rule-based analysis.

### Machine Learning Models

* Random Forest Classifier (primary supervised model)
* Isolation Forest (anomaly detection for unusual transactions)

The models analyze transaction patterns such as amount, behavior, and deviations to identify potentially fraudulent activity.

### Rule-Based Logic

Additional heuristic rules are applied, including:

* Large transaction thresholds
* New or unusual transaction locations
* Suspicious transaction types

### Final Decision

Each transaction is assigned:

* A fraud risk score
* A fraud label (fraud / not fraud)
* Explanation reasons for flagged transactions

This hybrid approach improves detection accuracy by combining statistical learning with domain-specific rules.

---

## 📄 License

This project is proprietary.

Unauthorized use, copying, modification, or distribution of this software is strictly prohibited without explicit permission from the author.

---

## 👩‍💻 Author

Eugenia Wakama
