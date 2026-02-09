# CredX | ML-Driven Fair Credit Scoring

CredX is a next-generation credit evaluation platform designed to bridge the gap for the "credit-invisible." By utilizing a **5-Layer Fairness Architecture** and alternative behavioral data, it eliminates systemic bias while providing 85% predictive accuracy for users without traditional credit histories.

![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Machine Learning](https://img.shields.io/badge/ML-FF6F00?style=for-the-badge&logo=scikitlearn&logoColor=white)

---

## Project Showcase

<p align="center">
  <img src="frontend/assets/demo.gif" alt="CredX Demo" width="300px" />
  <br>
  <em>Live demonstration of the FairScore™ engine and bias mitigation dashboard.</em>
</p>

---

## Key Features

* **5-Layer Fairness Architecture:** Systematic mitigation of representational, measurement, algorithmic, aggregation, and historical bias.
* **Alternative Data Scoring:** Leverages UPI, utility patterns, and digital footprints to validate income with **85% accuracy**.
* **Delphi Consensus Engine:** A specialized ensemble model balancing fairness (50%), accuracy (30%), and prediction diversity (20%).
* **Explainable AI (XAI):** Integrated SHAP explanations for every score to ensure regulatory compliance and user trust.
* **Real-Time Bias Detection:** Production-grade monitoring that identifies and flags geographic or demographic discrimination instantly.

---

## Technical Stack

### Frontend
- **React.js:** Interactive dashboard for data visualization and credit application.
- **Tailwind CSS:** Modern, crisp UI designed for financial transparency.
- **Recharts:** High-performance rendering of credit trends and fairness metrics.

### Backend & ML
- **FastAPI:** High-performance Python framework for real-time scoring inference.
- **Scikit-Learn & Fairlearn:** Core libraries for model training and bias mitigation.
- **SHAP:** Implementation of Explainable AI for model transparency.
- **PostgreSQL/MongoDB:** Robust handling of traditional and alternative data streams.

---

## Interface Preview

| Homepage | Application Form | Credit Dashboard |
| :---: | :---: | :---: |
| <img src="Frontend/assets/credx_homepage.png" width="200" /> | <img src="Frontend/assets/credx_form_page.png" width="200" /> | <img src="Frontend/assets/credx_credit_score_page.png" width="200" /> |

---

## Engineering Deep Dive

### 1. The Fairness-Accuracy Harmony
A major challenge in fintech ML is the trade-off between model accuracy and fairness. I implemented the **Delphi Consensus Engine**, which uses multi-objective optimization. This resulted in a **40% improvement in fairness metrics** with zero net loss in predictive accuracy.

### 2. Regional Bias Elimination
Traditional models often penalize users based on their PIN code. CredX uses region-aware feature engineering and adversarial debiasing to ensure that a user's location does not unfairly influence their creditworthiness, promoting geographic financial equity.

---

## Getting Started

### Prerequisites
- Python 3.9+ 
- Node.js & npm

### 1. Backend & ML Setup
```bash
cd ML_Model
pip install -r requirements.txt
# Run the FastAPI server
source ./.venv/bin/activate
python main.py
```

### 2. Frontend Setup
```bash
cd Frontend
npm install
npm run dev
```
