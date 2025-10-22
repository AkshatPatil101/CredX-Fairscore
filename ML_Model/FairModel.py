import warnings
warnings.filterwarnings('ignore')

import numpy as np
import pandas as pd
import joblib
import json
from pathlib import Path
import xgboost as xgb
import traceback

OPTIMAL_THRESHOLD = 0.60

def display_section(title):
    print("\n" + "=" * 80)
    print(f" {title} ".center(80, "="))
    print("=" * 80)

display_section("🚀 LOADING TRAINED MODELS AND ARTIFACTS")

MODEL_DIR = Path("./models")
REPORTS_DIR = Path("./models")

if not MODEL_DIR.exists():
    print(f"❌ Model directory not found: {MODEL_DIR}")
    raise FileNotFoundError(f"Model directory does not exist: {MODEL_DIR}")

base_features_order_28 = []
original_features_order_27 = []
one_hot_region_order = []
final_35_features_order = []
fair_30_features_order = []

feature_scaler = None
label_encoders = None
income_model = None
model_region_aware = None
model_fair_xgb = None

expected_features_region = 0
expected_features_fair = 0

try:
    scaler_path = MODEL_DIR / "feature_scaler.pkl"
    if scaler_path.exists():
        feature_scaler = joblib.load(scaler_path)
        n_scaler_features = getattr(feature_scaler, 'n_features_in_', 0)
        print(f"✅ Feature scaler loaded (expects {n_scaler_features} features)")
        if n_scaler_features != 27:
            print(f"❌ ERROR: Scaler expects {n_scaler_features} features, but pipeline logic requires it to expect 27.")
            raise ValueError(f"Scaler expects {n_scaler_features} features, required 27.")
    else:
        print(f"❌ Feature scaler not found")
        raise FileNotFoundError("Feature scaler not found")

    encoder_path = MODEL_DIR / "label_encoders.pkl"
    if encoder_path.exists():
        label_encoders = joblib.load(encoder_path)
        print("✅ Label encoders loaded")
    else:
        print(f"❌ Label encoders not found")
        raise FileNotFoundError("Label encoders not found")

    feature_config_path = MODEL_DIR / "feature_names.json"
    if feature_config_path.exists():
        with open(feature_config_path, "r") as f:
            feature_config = json.load(f)

        original_features_order_27 = feature_config.get('all_features', [])
        print(f"🔧 Loaded {len(original_features_order_27)} original features from JSON for scaler.")
        if len(original_features_order_27) != 27:
            print(f"❌ ERROR: Expected 27 original features in JSON ('all_features' key), found {len(original_features_order_27)}.")
            raise ValueError("Incorrect number of original features for scaler in feature_names.json.")

        base_features_order_28 = original_features_order_27 + ['verified_income_from_ivl']
        print(f"✅ Base feature list constructed ({len(base_features_order_28)} features including IVL).")
    else:
        print(f"❌ ERROR: Feature config 'feature_names.json' is required but not found in {MODEL_DIR}")
        raise FileNotFoundError("Feature config 'feature_names.json' is required but not found")

    try:
        region_classes = label_encoders['region'].classes_
        one_hot_region_order = [f'region_{label_encoders["region"].transform([cls])[0]}' for cls in region_classes]
        if len(one_hot_region_order) != 5:
            print(f"⚠️ Warning: Expected 5 regions, found {len(one_hot_region_order)} in label encoder: {region_classes}. Using inferred order: {one_hot_region_order}.")
        else:
            print(f"🔧 One-hot region order inferred: {one_hot_region_order}")
    except KeyError:
        print(f"❌ ERROR: 'region' not found in label_encoders.pkl.")
        raise
    except Exception as e:
        print(f"❌ ERROR: Could not determine one-hot region order: {e}.")
        raise

    final_35_features_order = base_features_order_28 + ['region_encoded', 'employment_type_encoded'] + one_hot_region_order
    print(f"🔧 Final feature order defined ({len(final_35_features_order)} features for Region-Aware model)")

    fair_30_features_order = base_features_order_28 + ['region_encoded', 'employment_type_encoded']
    print(f"🔧 Final feature order defined ({len(fair_30_features_order)} features for Fair XGBoost model)")

    income_model_path = MODEL_DIR / "income_verification_model.pkl"
    if income_model_path.exists():
        try:
            income_model = joblib.load(income_model_path)
            print(f"✅ Income verification model loaded (RF-{getattr(income_model, 'n_estimators', 'N/A')})")
        except Exception as e:
            income_model = None
            print(f"⚠️ Income model error: {str(e)}")
    else:
        income_model = None
        print("⚠️ Income verification model not found (optional)")

    xgb_region_path = MODEL_DIR / "xgb_region_aware.pkl"
    fair_xgb_path = MODEL_DIR / "fair_xgb.pkl"

    if xgb_region_path.exists():
        try:
            model_region_aware = joblib.load(xgb_region_path)
            if isinstance(model_region_aware, xgb.XGBModel):
                expected_features_region = model_region_aware.get_booster().num_features()
            else:
                expected_features_region = getattr(model_region_aware, 'n_features_in_', 0)

            if expected_features_region != 35:
                print(f"❌ ERROR: Loaded Region-Aware model expects {expected_features_region} features, but pipeline is built for 35.")
                model_region_aware = None
            else:
                print(f"✅ Region-Aware XGBoost loaded (PRIMARY - {expected_features_region} features)")
        except Exception as e:
            print(f"⚠️ Region-aware error: {str(e)}")
            model_region_aware = None
    else:
        print(f"❌ Region-Aware XGBoost (xgb_region_aware.pkl) not found. This is the primary model.")

    if fair_xgb_path.exists():
        try:
            model_fair_xgb = joblib.load(fair_xgb_path)
            if isinstance(model_fair_xgb, xgb.XGBModel):
                expected_features_fair = model_fair_xgb.get_booster().num_features()
            else:
                expected_features_fair = getattr(model_fair_xgb, 'n_features_in_', 0)
            
            if expected_features_fair != 30:
                print(f"⚠️ Warning: Loaded Fair XGBoost model expects {expected_features_fair} features, but pipeline is built for 30. Disabling model.")
                model_fair_xgb = None
            else:
                print(f"✅ Fair XGBoost loaded (COMPARISON - {expected_features_fair} features)")
        except Exception as e:
            print(f"⚠️ Fair XGB error: {str(e)}")
            model_fair_xgb = None
    else:
        print(f"⚠️ Fair XGBoost (fair_xgb.pkl) not found. Will not be used for comparison.")

    if model_region_aware is None:
        print(f"❌ FATAL: The primary model (xgb_region_aware.pkl) failed to load. Predictions cannot proceed.")
        raise FileNotFoundError("Primary prediction model 'xgb_region_aware.pkl' not found or failed to load correctly")

    print("\n" + "🎉 ALL MODELS LOADED SUCCESSFULLY".center(80, " "))
    print(f"   Primary Model: {'✅ Region-Aware XGBoost' if model_region_aware else '❌ Not Loaded'}")
    print(f"   Comparison Model: {'✅ Fair XGBoost' if model_fair_xgb else '❌ Not Loaded'}")
    print(f"   Income Verification: {'✅ Available' if income_model else '❌ Not Available'}")
    print(f"   Threshold: {OPTIMAL_THRESHOLD} (Optimized)")

except Exception as e:
    print(f"❌ Error during artifact loading: {str(e)}")
    print(traceback.format_exc())
    raise

display_section("📋 CATEGORICAL MAPPINGS & TEST DATA")

GENDER_MAP = {1: ('Male', 'M'), 2: ('Female', 'F')}
CASTE_GROUP_MAP = {1: 'General', 2: 'OBC', 3: 'SC', 4: 'ST', 5: 'Other'}
REGION_MAP = {1: 'North', 2: 'South', 3: 'East', 4: 'West', 5: 'Central'}
EMPLOYMENT_TYPE_MAP = {1: 'Salaried', 2: 'Self-Employed', 3: 'Unemployed', 4: 'Student', 5: 'Agriculture'}
VERIFICATION_MAP = {1: True, 2: False}

REGION_NAME_TO_CODE = {v: k for k, v in REGION_MAP.items()}
EMPLOYMENT_NAME_TO_CODE = {v: k for k, v in EMPLOYMENT_TYPE_MAP.items()}
GENDER_NAME_TO_CODE = {v[0]: k for k, v in GENDER_MAP.items()}
CASTE_NAME_TO_CODE = {v: k for k, v in CASTE_GROUP_MAP.items()}

TEST_APPLICANT_JSON_GOOD = {
    "applicant_id": "APP-001",
    "age": 35,
    "gender_code": 1,
    "caste_code": 1,
    "region_code": 2,
    "employment_code": 1,
    "monthly_income": 80000,
    "income_stability": 0.8,
    "avg_balance": 150000,
    "savings_ratio": 0.3,
    "expense_income_ratio": 0.4,
    "utility_payment_score": 95,
    "rent_payment_score": 100,
    "upi_transactions": 120,
    "upi_avg_amount": 800,
    "mobile_recharge_freq": 2,
    "digital_wallet_usage": 70,
    "merchant_diversity": 0.8,
    "credit_lines": 3,
    "credit_tenure_months": 48,
    "missed_payments": 1000,
    "avg_days_past_due": 0,
    "credit_utilization": 0.25,
    "consent_given": 1,
    "document_verified": 1
}

TEST_APPLICANT_JSON_BAD = {
    "applicant_id": "APP-002",
    "age": 24,
    "gender_code": 2,
    "caste_code": 3,
    "region_code": 1,
    "employment_code": 2,
    "monthly_income": 25000,
    "income_stability": 0.3,
    "avg_balance": 5000,
    "savings_ratio": 0.05,
    "expense_income_ratio": 0.8,
    "utility_payment_score": 60,
    "rent_payment_score": 70,
    "upi_transactions": 30,
    "upi_avg_amount": 250,
    "mobile_recharge_freq": 4,
    "digital_wallet_usage": 40,
    "merchant_diversity": 0.3,
    "credit_lines": 1,
    "credit_tenure_months": 10,
    "missed_payments": 3,
    "avg_days_past_due": 15,
    "credit_utilization": 0.95,
    "consent_given": 1,
    "document_verified": 1
}

print("✅ Mappings and Test Applicants defined")

display_section("🔧 DEFINING TRANSFORMATION FUNCTIONS")

def convert_user_inputs_to_features(user_inputs):
    features = {}

    features['age'] = user_inputs['age']

    features['declared_income'] = user_inputs['monthly_income'] * 12

    features['verified_income'] = user_inputs['monthly_income'] * 12 * 0.95
    features['income_stability'] = user_inputs['income_stability']

    features['avg_balance'] = user_inputs['avg_balance']
    features['savings_ratio'] = user_inputs['savings_ratio']
    features['debt_to_income_ratio'] = user_inputs['expense_income_ratio']
    features['loan_emi_ratio'] = user_inputs['expense_income_ratio'] * 0.3

    features['utility_payment_timeliness'] = user_inputs['utility_payment_score'] / 100
    features['rent_payment_timeliness'] = user_inputs['rent_payment_score'] / 100

    features['mobile_recharge_freq'] = user_inputs['mobile_recharge_freq']
    features['mobile_recharge_var'] = user_inputs['mobile_recharge_freq'] * 0.2
    features['upi_txn_count'] = user_inputs['upi_transactions']
    features['upi_avg_txn_size'] = user_inputs['upi_avg_amount']
    features['merchant_diversity_score'] = user_inputs['merchant_diversity']
    features['digital_wallet_usage'] = user_inputs['digital_wallet_usage'] / 100
    features['app_finance_ratio'] = (user_inputs['digital_wallet_usage'] / 100) * 0.7
    features['sim_change_freq'] = 0.1
    features['battery_pattern_score'] = 0.5

    features['past_loans_count'] = user_inputs['credit_lines']
    features['missed_payments'] = user_inputs['missed_payments']
    features['avg_days_past_due'] = user_inputs['avg_days_past_due']
    features['credit_utilization_ratio'] = user_inputs['credit_utilization']
    features['credit_lines_active'] = user_inputs['credit_lines']
    features['credit_tenure_months'] = user_inputs['credit_tenure_months']

    features['consent_given'] = int(user_inputs['consent_given'])
    features['document_verified'] = int(user_inputs['document_verified'])

    features['verified_income_from_ivl'] = features['verified_income']
    ivl_status = "Using default estimate"

    if income_model is not None:
        try:
            ivl_input_features = [
                'utility_payment_timeliness', 'rent_payment_timeliness',
                'upi_txn_count', 'upi_avg_txn_size', 'avg_balance',
                'mobile_recharge_freq', 'digital_wallet_usage',
                'merchant_diversity_score', 'savings_ratio', 'age'
            ]
            raw_27_for_ivl_scaling = pd.DataFrame([{f: features.get(f, 0) for f in original_features_order_27}])
            scaled_27_for_ivl = feature_scaler.transform(raw_27_for_ivl_scaling)
            ivl_indices = [original_features_order_27.index(f) for f in ivl_input_features if f in original_features_order_27]
            ivl_scaled_input = scaled_27_for_ivl[:, ivl_indices]
            ivl_scaled_df = pd.DataFrame(ivl_scaled_input, columns=ivl_input_features)

            predicted_ivl = float(income_model.predict(ivl_scaled_df)[0])
            features['verified_income_from_ivl'] = predicted_ivl
            ivl_status = f"✅ IVL Model used. Predicted income: ₹{predicted_ivl:.0f}"

        except Exception as e:
            if "'DecisionTreeRegressor' object has no attribute 'monotonic_cst'" in str(e):
                ivl_status = "⚠️ IVL Model failed to load (monotonic_cst attribute missing). Using default estimate."
            else:
                ivl_status = f"⚠️ Failed to use IVL Model: {e}. Using default estimate."
            pass
    
    print(f"   IVL Status: {ivl_status}")
    
    return features, ivl_status

print("✅ Transformation functions defined")

def _run_single_prediction(model, model_name, expected_features, feature_vector, threshold):
    
    if feature_vector.shape[1] != expected_features:
        error_msg = f"FATAL: Final feature shape {feature_vector.shape[1]} does not match loaded model expectation {expected_features} for model '{model_name}'."
        print(f"❌ {error_msg}")
        raise ValueError(error_msg)

    pred_proba = model.predict_proba(feature_vector)[0]
    default_probability = float(pred_proba[1])
    approval_probability = float(pred_proba[0])
    is_approved = default_probability < threshold
    credit_score = int(300 + (approval_probability * 550))

    if credit_score >= 750:
        risk_category, risk_color = "Excellent", "#27ae60"
    elif credit_score >= 700:
        risk_category, risk_color = "Good", "#3498db"
    elif credit_score >= 650:
        risk_category, risk_color = "Fair", "#f39c12"
    elif credit_score >= 600:
        risk_category, risk_color = "Poor", "#e67e22"
    else:
        risk_category, risk_color = "Very Poor", "#e74c3c"

    return {
        "model": model_name,
        "score": credit_score,
        "approved": bool(is_approved),
        "default_risk": float(default_probability),
        "approval_probability": float(approval_probability),
        "risk_category": risk_category,
        "risk_color": risk_color,
        "feature_shape": list(feature_vector.shape),
        "error": None
    }

def run_multi_model_prediction(applicant_json_data, threshold=OPTIMAL_THRESHOLD):
    print(f"\n🔮 PROCESSING PREDICTION FOR APPLICANT: {applicant_json_data.get('applicant_id', 'N/A')}")
    
    all_predictions = {}
    recommendations = []
    positive_factors_list = []
    negative_factors_list = []
    final_decision = {}
    
    try:
        print("Step 1: Parsing Applicant JSON...")
        user_inputs = applicant_json_data.copy()
        
        user_inputs['gender_display'], user_inputs['gender_char'] = GENDER_MAP[user_inputs['gender_code']]
        user_inputs['caste_group'] = CASTE_GROUP_MAP[user_inputs['caste_code']]
        user_inputs['region'] = REGION_MAP[user_inputs['region_code']]
        user_inputs['employment_type'] = EMPLOYMENT_TYPE_MAP[user_inputs['employment_code']]
        user_inputs['consent_given'] = bool(int(user_inputs.get('consent_given', 1)))
        user_inputs['document_verified'] = bool(int(user_inputs.get('document_verified', 1)))
        
        applicant_profile_display = {
            "age": user_inputs['age'],
            "gender": user_inputs['gender_display'],
            "region": user_inputs['region'],
            "employment": user_inputs['employment_type'],
            "monthly_income": user_inputs['monthly_income']
        }
        print(f"✅ Applicant Profile: {applicant_profile_display}")

        print("Step 2: Converting user inputs to model features...")
        base_features_dict, ivl_status = convert_user_inputs_to_features(user_inputs)
        print(f"✅ Base feature engineering complete ({len(base_features_dict)} features)")

        
        print(f"Step 3: Running Model 1 (Region-Aware XGBoost)...")
        if model_region_aware:
            try:
                region_str = user_inputs['region']
                employment_str = user_inputs['employment_type']
                region_encoded = label_encoders['region'].transform([region_str])[0]
                employment_encoded = label_encoders['employment_type'].transform([employment_str])[0]
                num_regions = len(label_encoders['region'].classes_)
                one_hot_regions = np.zeros(num_regions)
                if region_encoded < num_regions: one_hot_regions[region_encoded] = 1
                
                raw_27_for_scaling_list = [base_features_dict.get(f, 0) for f in original_features_order_27]
                X_raw_27_for_scaling = np.array([raw_27_for_scaling_list])
                X_scaled_27 = feature_scaler.transform(X_raw_27_for_scaling)

                unscaled_ivl = np.array([[base_features_dict['verified_income_from_ivl']]])
                unscaled_region_encoded = np.array([[region_encoded]])
                unscaled_employment_encoded = np.array([[employment_encoded]])
                unscaled_one_hot = np.array([one_hot_regions])

                X_final_input_35 = np.concatenate([
                    X_scaled_27, unscaled_ivl, unscaled_region_encoded,
                    unscaled_employment_encoded, unscaled_one_hot
                ], axis=1)

                region_aware_result = _run_single_prediction(
                    model_region_aware, "Region-Aware XGBoost",
                    expected_features_region, X_final_input_35, threshold
                )
                all_predictions["Region-Aware XGBoost"] = region_aware_result
                print(f"✅ Region-Aware Model Complete. Score: {region_aware_result['score']}")
            
            except Exception as e:
                print(f"❌ Error running Region-Aware model: {e}")
                all_predictions["Region-Aware XGBoost"] = {"model": "Region-Aware XGBoost", "error": str(e), "feature_shape": [1, 35]}
        
        
        print(f"Step 4: Running Model 2 (Fair XGBoost)...")
        if model_fair_xgb:
            try:
                region_str = user_inputs['region']
                employment_str = user_inputs['employment_type']
                region_encoded = label_encoders['region'].transform([region_str])[0]
                employment_encoded = label_encoders['employment_type'].transform([employment_str])[0]

                raw_27_for_scaling_list = [base_features_dict.get(f, 0) for f in original_features_order_27]
                X_raw_27_for_scaling = np.array([raw_27_for_scaling_list])
                X_scaled_27 = feature_scaler.transform(X_raw_27_for_scaling)

                unscaled_ivl = np.array([[base_features_dict['verified_income_from_ivl']]])
                unscaled_region_encoded = np.array([[region_encoded]])
                unscaled_employment_encoded = np.array([[employment_encoded]])

                X_final_input_30 = np.concatenate([
                    X_scaled_27, unscaled_ivl, unscaled_region_encoded, unscaled_employment_encoded
                ], axis=1)

                fair_xgb_result = _run_single_prediction(
                    model_fair_xgb, "Fair XGBoost",
                    expected_features_fair, X_final_input_30, threshold
                )
                all_predictions["Fair XGBoost"] = fair_xgb_result
                print(f"✅ Fair XGBoost Model Complete. Score: {fair_xgb_result['score']}")

            except Exception as e:
                print(f"❌ Error running Fair XGBoost model: {e}")
                all_predictions["Fair XGBoost"] = {"model": "Fair XGBoost", "error": str(e), "feature_shape": [1, 30]}
        else:
            print(f"⚠️ Fair XGBoost model not loaded. Skipping.")

            
        print("\n" + "📊 PREDICTION RESULTS".center(80, " "))
        
        if "Region-Aware XGBoost" in all_predictions and all_predictions["Region-Aware XGBoost"]["error"] is None:
            final_decision = all_predictions["Region-Aware XGBoost"]
            
            is_approved = final_decision['approved'] 
            
            print(f"   Credit Score: {final_decision['score']}")
            print(f"   Risk: {final_decision['risk_category']}")
            print(f"   Status: {'✅ APPROVED' if is_approved else '❌ REJECTED'}")
            
            display_features = base_features_dict.copy()
            display_features['repayment_history_score'] = max(0, 100 - (user_inputs['missed_payments'] * 5 + user_inputs['avg_days_past_due'] * 0.5)) / 100
            display_features['digital_payment_score'] = (
                display_features.get('upi_txn_count', 0) / 100 * 0.4 + 
                (display_features.get('upi_avg_txn_size', 0) / 10000) * 0.3 +
                display_features.get('digital_wallet_usage', 0) * 0.3
            )
            
            print("\n" + "🔍 SCORE FACTOR ANALYSIS".center(80, " "))
            
            print("\n   ✅ Positive Factors (Leveraging Your Score)")
            pos_found = False
            if display_features.get('repayment_history_score', 0) > 0.8:
                factor_text = "Excellent payment history (few to no missed payments)"
                positive_factors_list.append({"text": factor_text, "type": "positive"})
                print(f"     • {factor_text}")
                pos_found = True
            if display_features.get('credit_utilization_ratio', 1) < 0.3:
                factor_text = "Low credit utilization (using < 30% of available credit)"
                positive_factors_list.append({"text": factor_text, "type": "positive"})
                print(f"     • {factor_text}")
                pos_found = True
            if display_features.get('savings_ratio', 0) > 0.2:
                factor_text = "Good savings ratio (saving > 20% of income)"
                positive_factors_list.append({"text": factor_text, "type": "positive"})
                print(f"     • {factor_text}")
                pos_found = True
            if display_features.get('digital_payment_score', 0) > 0.5:
                factor_text = "Strong digital payment activity"
                positive_factors_list.append({"text": factor_text, "type": "positive"})
                print(f"     • {factor_text}")
                pos_found = True
            if display_features.get('income_stability', 0) > 0.5:
                factor_text = "Stable income source"
                positive_factors_list.append({"text": factor_text, "type": "positive"})
                print(f"     • {factor_text}")
                pos_found = True
            if display_features.get('credit_tenure_months', 0) > 36:
                factor_text = "Established credit history ( > 3 years)"
                positive_factors_list.append({"text": factor_text, "type": "positive"})
                print(f"     • {factor_text}")
                pos_found = True
            
            if not pos_found:
                print("     • No strong positive factors identified based on these rules.")

            print("\n   ❌ Negative Factors (Degrading Your Score)")
            neg_found = False
            if display_features.get('missed_payments', 0) > 0:
                factor_text = f"{int(display_features['missed_payments'])} missed payments recorded"
                negative_factors_list.append({"text": factor_text, "type": "negative"})
                print(f"     • {factor_text}")
                neg_found = True
            if display_features.get('credit_utilization_ratio', 0) > 0.7:
                factor_text = "High credit utilization (using > 70% of available credit)"
                negative_factors_list.append({"text": factor_text, "type": "negative"})
                print(f"     • {factor_text}")
                neg_found = True
            if display_features.get('avg_days_past_due', 0) > 0:
                factor_text = f"Accounts previously {int(display_features['avg_days_past_due'])} days past due"
                negative_factors_list.append({"text": factor_text, "type": "negative"})
                print(f"     • {factor_text}")
                neg_found = True
            if display_features.get('savings_ratio', 1) < 0.1:
                factor_text = "Low savings ratio (saving < 10% of income)"
                negative_factors_list.append({"text": factor_text, "type": "negative"})
                print(f"     • {factor_text}")
                neg_found = True
            if display_features.get('credit_tenure_months', 100) < 12:
                factor_text = "Limited credit history ( < 1 year)"
                negative_factors_list.append({"text": factor_text, "type": "negative"})
                print(f"     • {factor_text}")
                neg_found = True
                
            if not neg_found:
                print("     • No strong negative factors identified. Keep up the good work!")
            
            print("\n   Note: This is not an exhaustive list. Your score is calculated using a")
            print("   comprehensive model. These are prominent factors identified by our analysis rules.")

            print("\n" + "💡 RECOMMENDATIONS".center(80, " "))
            if not is_approved:
                recommendations.extend(["• Focus on improving payment history (make all payments on time)",
                                        "• Reduce credit utilization ratio (ideally below 30%)"])
                if display_features.get('savings_ratio', 1) < 0.15: recommendations.append("• Increase savings ratio and build an emergency fund")
                if display_features.get('credit_tenure_months', 100) < 24: recommendations.append("• Continue building a positive credit history over time")
            else:
                recommendations.extend(["• Maintain your excellent payment discipline", "• Continue responsible credit usage"])
                if display_features.get('credit_utilization_ratio', 0) > 0.3: recommendations.append("• Consider keeping credit utilization low (below 30%) for optimal score")
                recommendations.append("• Monitor your credit report regularly for any inaccuracies")
            
            for rec in recommendations:
                print(f"   {rec}")

        else:
            print("❌ Final decision could not be made. Primary model failed.")
            final_decision = {"error": "Primary model failed to run"}
            
        model_predictions_list = [v for v in all_predictions.values() if v.get("error") is None]
        approved_count = sum(1 for p in model_predictions_list if p['approved'])
        total_count = len(model_predictions_list)
        unanimous = total_count > 0 and (approved_count == 0 or approved_count == total_count)
        
        final_json_output = {
            "success": True,
            "applicant_profile": applicant_profile_display,
            "final_decision": {
                "approved": final_decision.get('approved', False),
                "credit_score": final_decision.get('score', 0),
                "risk_category": final_decision.get('risk_category', 'Error'),
                "default_risk": final_decision.get('default_risk', 1.0),
                "approval_probability": final_decision.get('approval_probability', 0.0),
                "threshold": threshold
            },
            "model_predictions": model_predictions_list,
            "consensus": {
                "approved_count": approved_count,
                "total_count": total_count,
                "unanimous": unanimous
            },
            "positive_factors": positive_factors_list,
            "negative_factors": negative_factors_list,
            "recommendations": recommendations,
            "all_predictions": all_predictions,
            "colour": final_decision.get('risk_color'),
            "name": user_inputs.get('applicant_id')
        }
        print(final_json_output)
        return final_json_output
        
    except Exception as e:
        print(f"❌ UNHANDLED ERROR in prediction pipeline: {e}")
        print(traceback.format_exc())
        return {
            "success": False,
            "error": str(e),
            "traceback": traceback.format_exc(),
            "applicant_profile": applicant_json_data
        }

class NumpyJSONEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, np.bool_):
            return bool(obj)
        if isinstance(obj, np.integer):
            return int(obj)
        if isinstance(obj, np.floating):
            return float(obj)
        if isinstance(obj, np.ndarray):
            return obj.tolist()
        return super(NumpyJSONEncoder, self).default(obj)

print("✅ Custom JSON Encoder defined")

if __name__ == "__main__":

    display_section("🚀 RUNNING PREDICTION ON 'GOOD' TEST APPLICANT")

    try:
        good_result = run_multi_model_prediction(TEST_APPLICANT_JSON_GOOD)
        
        print("\n--- Final JSON Output (Good Applicant) ---")
        print(json.dumps(good_result, indent=2, cls=NumpyJSONEncoder))

    except Exception as e:
        print(f"❌ Execution failed for 'Good' applicant: {e}")
        print(traceback.format_exc())

    display_section("🚀 RUNNING PREDICTION ON 'BAD' TEST APPLICANT")

    try:
        bad_result = run_multi_model_prediction(TEST_APPLICANT_JSON_BAD)

        print("\n--- Final JSON Output (Bad Applicant) ---")
        print(json.dumps(bad_result, indent=2, cls=NumpyJSONEncoder))

    except Exception as e:
        print(f"❌ Execution failed for 'Bad' applicant: {e}")
        print(traceback.format_exc())

    display_section("✅ SYSTEM READY")
    print(f"🎉 System Initialized and Ready for JSON!")
    print(f"   ✅ Primary model loaded: {'Region-Aware XGBoost' if model_region_aware else 'N/A'}")
    print(f"   ✅ Comparison model loaded: {'Fair XGBoost' if model_fair_xgb else 'N/A'}")
    print(f"   ✅ Function run_multi_model_prediction(json_data) is ready.")
