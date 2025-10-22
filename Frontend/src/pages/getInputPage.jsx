import React, { useState } from "react";
import {
  Home,
  CreditCard,
  FileText,
  MessageSquare,
  AtSign,
  Settings,
  Target,
} from "lucide-react";
import logo from "./logo.png";

const GENDER_MAP = { 1: ["Male", "M"], 2: ["Female", "F"] };
const CASTE_GROUP_MAP = {
  1: "General",
  2: "OBC",
  3: "SC",
  4: "ST",
  5: "Other",
};
const REGION_MAP = {
  1: "North",
  2: "South",
  3: "East",
  4: "West",
  5: "Central",
};
const EMPLOYMENT_TYPE_MAP = {
  1: "Salaried",
  2: "Self-Employed",
  3: "Unemployed",
  4: "Student",
  5: "Agriculture",
};

const emptyFormData = {
  applicant_id: "",
  age: "",
  gender_code: "",
  caste_code: "",
  region_code: "",
  employment_code: "",
  monthly_income: "",
  income_stability: "",
  avg_balance: "",
  savings_ratio: "",
  expense_income_ratio: "",
  utility_payment_score: "",
  rent_payment_score: "",
  upi_transactions: "",
  upi_avg_amount: "",
  mobile_recharge_freq: "",
  digital_wallet_usage: "",
  merchant_diversity: "",
  credit_lines: "",
  credit_tenure_months: "",
  missed_payments: "",
  avg_days_past_due: "",
  credit_utilization: "",
  consent_given: "1",
  document_verified: "1",
};

export function GetInputPage({
  setInputsTaken,
  setMockData,
  setRawInputData,
  initialData,
  startWithFormOpen = false,
}) {
  const [showForm, setShowForm] = useState(startWithFormOpen);

  const [formData, setFormData] = useState(initialData || emptyFormData);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowForm(false);
    try {
      const response = await fetch("http://localhost:8000/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const predictionResult = await response.json();
        console.log("Data submitted successfully!", predictionResult);

        setMockData(predictionResult);
        setRawInputData(formData);

        setInputsTaken(true);
      } else {
        console.error("Failed to submit data");
        setShowForm(true);
      }
    } catch (err) {
      console.error("Error:", err);
      setShowForm(true);
    }
  };

  const handleCancel = () => {
    if (startWithFormOpen) {
      setInputsTaken(true);
    } else {
      setShowForm(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#0A0A0A] text-white overflow-hidden">
      <main className="flex-1 flex flex-col items-center justify-center p-8 bg-gradient-to-br from-[#0A0A0A] via-[#121212] to-[#0A0A0A] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-br from-[#FFA384]/5 via-transparent to-transparent rounded-full blur-[100px] opacity-50 -translate-x-1/4 -translate-y-1/4"></div>
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-gradient-to-tl from-[#FFB59A]/5 via-transparent to-transparent rounded-full blur-[120px] opacity-40 translate-x-1/4 translate-y-1/4"></div>

        <div className="text-center max-w-2xl w-full z-10">
          <img
            src="https://placehold.co/150x150/1A1A1A/32a84a?text=CredX"
            alt="Credit Score Visualization Placeholder"
            className="mx-auto mb-8 w-32 h-32 rounded-full border-4 border-[#32a84a]/30 shadow-lg object-cover bg-[#1A1A1A]"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src =
                "https://placehold.co/150x150/1A1A1A/FFFFFF?text=Image+Error";
            }}
          />
          <h1 className="text-4xl md:text-5xl font-extrabold mb-5 text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-300 to-white leading-tight">
            Unlock Your Fair Credit Score
          </h1>
          <p className="text-lg text-gray-400 mb-12 max-w-md mx-auto">
            Get an accurate, AI-powered assessment of your creditworthiness in
            seconds. It's fast, free, and secure.
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="btn btn-primary btn-xl"
          >
            Check Your Credit Score
          </button>
        </div>
      </main>

      {showForm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#141414] rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col border border-gray-800">
            <div className="flex items-center px-8 py-6 border-b border-gray-800">
              <img src={logo} className="h-15 w-15 mr-3" alt="logo"></img>
              <h2 className="text-2xl font-bold text-white">
                Enter Applicant Details
              </h2>
            </div>

            <div className="flex-1 overflow-y-auto px-8 py-6">
              <form
                onSubmit={handleSubmit}
                id="applicant-form"
                className="space-y-8"
              >
                <div className="space-y-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-1 h-6 bg-gradient-to-b from-[#FFA384] to-[#FFB59A] rounded-full"></div>
                    <h3 className="text-lg font-semibold text-white">
                      Personal Information
                    </h3>
                  </div>
                  <div className="grid grid-cols-2 gap-4 pl-4">
                    <div className="flex flex-col">
                      <label className="text-gray-400 mb-2 text-sm font-medium">
                        Applicant Name
                      </label>
                      <input
                        type="text"
                        name="applicant_id"
                        value={formData.applicant_id}
                        onChange={handleChange}
                        placeholder="Enter Full Name"
                        className="bg-[#1A1A1A] border border-gray-700 rounded-lg p-3 text-white focus:border-[#FFA384] focus:ring-1 focus:ring-[#FFA384] transition-all placeholder:text-gray-600"
                        required
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="text-gray-400 mb-2 text-sm font-medium">
                        Age
                      </label>
                      <input
                        type="number"
                        name="age"
                        value={formData.age}
                        onChange={handleChange}
                        placeholder="Enter age"
                        className="bg-[#1A1A1A] border border-gray-700 rounded-lg p-3 text-white focus:border-[#FFA384] focus:ring-1 focus:ring-[#FFA384] transition-all placeholder:text-gray-600"
                        required
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="text-gray-400 mb-2 text-sm font-medium">
                        Gender
                      </label>
                      <select
                        name="gender_code"
                        value={formData.gender_code}
                        onChange={handleChange}
                        className="bg-[#1A1A1A] border border-gray-700 rounded-lg p-3 text-white focus:border-[#FFA384] focus:ring-1 focus:ring-[#FFA384] transition-all"
                        required
                      >
                        <option value="" disabled>
                          Select gender
                        </option>
                        {Object.entries(GENDER_MAP).map(([code, [label]]) => (
                          <option key={code} value={code}>
                            {label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="flex flex-col">
                      <label className="text-gray-400 mb-2 text-sm font-medium">
                        Caste Group
                      </label>
                      <select
                        name="caste_code"
                        value={formData.caste_code}
                        onChange={handleChange}
                        className="bg-[#1A1A1A] border border-gray-700 rounded-lg p-3 text-white focus:border-[#FFA384] focus:ring-1 focus:ring-[#FFA384] transition-all"
                        required
                      >
                        <option value="" disabled>
                          Select caste group
                        </option>
                        {Object.entries(CASTE_GROUP_MAP).map(
                          ([code, label]) => (
                            <option key={code} value={code}>
                              {label}
                            </option>
                          ),
                        )}
                      </select>
                    </div>
                    <div className="flex flex-col">
                      <label className="text-gray-400 mb-2 text-sm font-medium">
                        Region
                      </label>
                      <select
                        name="region_code"
                        value={formData.region_code}
                        onChange={handleChange}
                        className="bg-[#1A1A1A] border border-gray-700 rounded-lg p-3 text-white focus:border-[#FFA384] focus:ring-1 focus:ring-[#FFA384] transition-all"
                        required
                      >
                        <option value="" disabled>
                          Select region
                        </option>
                        {Object.entries(REGION_MAP).map(([code, label]) => (
                          <option key={code} value={code}>
                            {label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-1 h-6 bg-gradient-to-b from-[#FFA384] to-[#FFB59A] rounded-full"></div>
                    <h3 className="text-lg font-semibold text-white">
                      Employment & Income
                    </h3>
                  </div>
                  <div className="grid grid-cols-2 gap-4 pl-4">
                    <div className="flex flex-col">
                      <label className="text-gray-400 mb-2 text-sm font-medium">
                        Employment Type
                      </label>
                      <select
                        name="employment_code"
                        value={formData.employment_code}
                        onChange={handleChange}
                        className="bg-[#1A1A1A] border border-gray-700 rounded-lg p-3 text-white focus:border-[#FFA384] focus:ring-1 focus:ring-[#FFA384] transition-all"
                        required
                      >
                        <option value="" disabled>
                          Select employment type
                        </option>
                        {Object.entries(EMPLOYMENT_TYPE_MAP).map(
                          ([code, label]) => (
                            <option key={code} value={code}>
                              {label}
                            </option>
                          ),
                        )}
                      </select>
                    </div>
                    <div className="flex flex-col">
                      <label className="text-gray-400 mb-2 text-sm font-medium">
                        Monthly Income
                      </label>
                      <input
                        type="number"
                        name="monthly_income"
                        value={formData.monthly_income}
                        onChange={handleChange}
                        placeholder="Enter monthly income"
                        className="bg-[#1A1A1A] border border-gray-700 rounded-lg p-3 text-white focus:border-[#FFA384] focus:ring-1 focus:ring-[#FFA384] transition-all placeholder:text-gray-600"
                        required
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="text-gray-400 mb-2 text-sm font-medium">
                        Income Stability (0-1)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        max="1"
                        name="income_stability"
                        value={formData.income_stability}
                        onChange={handleChange}
                        placeholder="Enter income stability (e.g., 0.8)"
                        className="bg-[#1A1A1A] border border-gray-700 rounded-lg p-3 text-white focus:border-[#FFA384] focus:ring-1 focus:ring-[#FFA384] transition-all placeholder:text-gray-600"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-1 h-6 bg-gradient-to-b from-[#FFA384] to-[#FFB59A] rounded-full"></div>
                    <h3 className="text-lg font-semibold text-white">
                      Financial Metrics
                    </h3>
                  </div>
                  <div className="grid grid-cols-2 gap-4 pl-4">
                    <div className="flex flex-col">
                      <label className="text-gray-400 mb-2 text-sm font-medium">
                        Average Balance
                      </label>
                      <input
                        type="number"
                        name="avg_balance"
                        value={formData.avg_balance}
                        onChange={handleChange}
                        placeholder="Enter average balance"
                        className="bg-[#1A1A1A] border border-gray-700 rounded-lg p-3 text-white focus:border-[#FFA384] focus:ring-1 focus:ring-[#FFA384] transition-all placeholder:text-gray-600"
                        required
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="text-gray-400 mb-2 text-sm font-medium">
                        Savings Ratio (0-1)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        max="1"
                        name="savings_ratio"
                        value={formData.savings_ratio}
                        onChange={handleChange}
                        placeholder="Enter savings ratio (e.g., 0.2)"
                        className="bg-[#1A1A1A] border border-gray-700 rounded-lg p-3 text-white focus:border-[#FFA384] focus:ring-1 focus:ring-[#FFA384] transition-all placeholder:text-gray-600"
                        required
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="text-gray-400 mb-2 text-sm font-medium">
                        Expense Income Ratio (0-1)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        max="1"
                        name="expense_income_ratio"
                        value={formData.expense_income_ratio}
                        onChange={handleChange}
                        placeholder="Enter expense income ratio (e.g., 0.5)"
                        className="bg-[#1A1A1A] border border-gray-700 rounded-lg p-3 text-white focus:border-[#FFA384] focus:ring-1 focus:ring-[#FFA384] transition-all placeholder:text-gray-600"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-1 h-6 bg-gradient-to-b from-[#FFA384] to-[#FFB59A] rounded-full"></div>
                    <h3 className="text-lg font-semibold text-white">
                      Payment Behavior
                    </h3>
                  </div>
                  <div className="grid grid-cols-2 gap-4 pl-4">
                    <div className="flex flex-col">
                      <label className="text-gray-400 mb-2 text-sm font-medium">
                        Utility Payment Score (0-100)
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        name="utility_payment_score"
                        value={formData.utility_payment_score}
                        onChange={handleChange}
                        placeholder="Enter utility payment score (e.g., 85)"
                        className="bg-[#1A1A1A] border border-gray-700 rounded-lg p-3 text-white focus:border-[#FFA384] focus:ring-1 focus:ring-[#FFA384] transition-all placeholder:text-gray-600"
                        required
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="text-gray-400 mb-2 text-sm font-medium">
                        Rent Payment Score (0-100)
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        name="rent_payment_score"
                        value={formData.rent_payment_score}
                        onChange={handleChange}
                        placeholder="Enter rent payment score (e.g., 90)"
                        className="bg-[#1A1A1A] border border-gray-700 rounded-lg p-3 text-white focus:border-[#FFA384] focus:ring-1 focus:ring-[#FFA384] transition-all placeholder:text-gray-600"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-1 h-6 bg-gradient-to-b from-[#FFA384] to-[#FFB59A] rounded-full"></div>
                    <h3 className="text-lg font-semibold text-white">
                      Digital Activity
                    </h3>
                  </div>
                  <div className="grid grid-cols-2 gap-4 pl-4">
                    <div className="flex flex-col">
                      <label className="text-gray-400 mb-2 text-sm font-medium">
                        UPI Transactions (Count)
                      </label>
                      <input
                        type="number"
                        name="upi_transactions"
                        value={formData.upi_transactions}
                        onChange={handleChange}
                        placeholder="Enter UPI transactions (count)"
                        className="bg-[#1A1A1A] border border-gray-700 rounded-lg p-3 text-white focus:border-[#FFA384] focus:ring-1 focus:ring-[#FFA384] transition-all placeholder:text-gray-600"
                        required
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="text-gray-400 mb-2 text-sm font-medium">
                        UPI Average Amount
                      </label>
                      <input
                        type="number"
                        name="upi_avg_amount"
                        value={formData.upi_avg_amount}
                        onChange={handleChange}
                        placeholder="Enter UPI average amount"
                        className="bg-[#1A1A1A] border border-gray-700 rounded-lg p-3 text-white focus:border-[#FFA384] focus:ring-1 focus:ring-[#FFA384] transition-all placeholder:text-gray-600"
                        required
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="text-gray-400 mb-2 text-sm font-medium">
                        Mobile Recharge Frequency
                      </label>
                      <input
                        type="number"
                        name="mobile_recharge_freq"
                        value={formData.mobile_recharge_freq}
                        onChange={handleChange}
                        placeholder="Enter mobile recharge frequency"
                        className="bg-[#1A1A1A] border border-gray-700 rounded-lg p-3 text-white focus:border-[#FFA384] focus:ring-1 focus:ring-[#FFA384] transition-all placeholder:text-gray-600"
                        required
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="text-gray-400 mb-2 text-sm font-medium">
                        Digital Wallet Usage (0-1)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        max="1"
                        name="digital_wallet_usage"
                        value={formData.digital_wallet_usage}
                        onChange={handleChange}
                        placeholder="Enter digital wallet usage (e.g., 0.6)"
                        className="bg-[#1A1A1A] border border-gray-700 rounded-lg p-3 text-white focus:border-[#FFA384] focus:ring-1 focus:ring-[#FFA384] transition-all placeholder:text-gray-600"
                        required
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="text-gray-400 mb-2 text-sm font-medium">
                        Merchant Diversity (Count)
                      </label>
                      <input
                        type="number"
                        name="merchant_diversity"
                        value={formData.merchant_diversity}
                        onChange={handleChange}
                        placeholder="Enter merchant diversity (count)"
                        className="bg-[#1A1A1A] border border-gray-700 rounded-lg p-3 text-white focus:border-[#FFA384] focus:ring-1 focus:ring-[#FFA384] transition-all placeholder:text-gray-600"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-1 h-6 bg-gradient-to-b from-[#FFA384] to-[#FFB59A] rounded-full"></div>
                    <h3 className="text-lg font-semibold text-white">
                      Credit History
                    </h3>
                  </div>
                  <div className="grid grid-cols-2 gap-4 pl-4">
                    <div className="flex flex-col">
                      <label className="text-gray-400 mb-2 text-sm font-medium">
                        Credit Lines (Count)
                      </label>
                      <input
                        type="number"
                        name="credit_lines"
                        value={formData.credit_lines}
                        onChange={handleChange}
                        placeholder="Enter credit lines (count)"
                        className="bg-[#1A1A1A] border border-gray-700 rounded-lg p-3 text-white focus:border-[#FFA384] focus:ring-1 focus:ring-[#FFA384] transition-all placeholder:text-gray-600"
                        required
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="text-gray-400 mb-2 text-sm font-medium">
                        Credit Tenure (Months)
                      </label>
                      <input
                        type="number"
                        name="credit_tenure_months"
                        value={formData.credit_tenure_months}
                        onChange={handleChange}
                        placeholder="Enter credit tenure in months"
                        className="bg-[#1A1A1A] border border-gray-700 rounded-lg p-3 text-white focus:border-[#FFA384] focus:ring-1 focus:ring-[#FFA384] transition-all placeholder:text-gray-600"
                        required
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="text-gray-400 mb-2 text-sm font-medium">
                        Missed Payments (Count)
                      </label>
                      <input
                        type="number"
                        name="missed_payments"
                        value={formData.missed_payments}
                        onChange={handleChange}
                        placeholder="Enter missed payments (count)"
                        className="bg-[#1A1A1A] border border-gray-700 rounded-lg p-3 text-white focus:border-[#FFA384] focus:ring-1 focus:ring-[#FFA384] transition-all placeholder:text-gray-600"
                        required
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="text-gray-400 mb-2 text-sm font-medium">
                        Average Days Past Due
                      </label>
                      <input
                        type="number"
                        name="avg_days_past_due"
                        value={formData.avg_days_past_due}
                        onChange={handleChange}
                        placeholder="Enter average days past due"
                        className="bg-[#1A1A1A] border border-gray-700 rounded-lg p-3 text-white focus:border-[#FFA384] focus:ring-1 focus:ring-[#FFA384] transition-all placeholder:text-gray-600"
                        required
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="text-gray-400 mb-2 text-sm font-medium">
                        Credit Utilization (0-1)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        max="1"
                        name="credit_utilization"
                        value={formData.credit_utilization}
                        onChange={handleChange}
                        placeholder="Enter credit utilization (e.g., 0.4)"
                        className="bg-[#1A1A1A] border border-gray-700 rounded-lg p-3 text-white focus:border-[#FFA384] focus:ring-1 focus:ring-[#FFA384] transition-all placeholder:text-gray-600"
                        required
                      />
                    </div>
                  </div>
                </div>
              </form>
            </div>

            <div className="px-8 py-6 border-t border-gray-800 flex justify-end gap-4">
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-3 rounded-xl bg-gray-600 hover:bg-gray-700 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="applicant-form"
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#FFA384] to-[#FFB59A] text-black hover:opacity-90 transition"
              >
                Get Fair Credit Score
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}