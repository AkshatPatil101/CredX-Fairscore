import uvicorn
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from fastapi.encoders import jsonable_encoder

from FairModel import run_multi_model_prediction

class ApplicantData(BaseModel):
    applicant_id: str
    age: int
    gender_code: int
    caste_code: int
    region_code: int
    employment_code: int
    monthly_income: int
    income_stability: float
    avg_balance: int
    savings_ratio: float
    expense_income_ratio: float
    utility_payment_score: int
    rent_payment_score: int
    upi_transactions: int
    upi_avg_amount: int
    mobile_recharge_freq: int
    digital_wallet_usage: float
    merchant_diversity: int
    credit_lines: int
    credit_tenure_months: int
    missed_payments: int
    avg_days_past_due: int
    credit_utilization: float
    consent_given: int
    document_verified: int


app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/submit")
def handle_form_submission(data: ApplicantData):
    
    applicant_dict = data.model_dump()
    print(applicant_dict)
    print("-------------------------------")

    print("--- Model Result ---")

    result = run_multi_model_prediction(applicant_dict)
        
    print(result)
    print("--------------------")

    return jsonable_encoder(result)

    return {
            "success": False,
            "error": "An error occurred during prediction", 
            "details": str(e)
    }


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

