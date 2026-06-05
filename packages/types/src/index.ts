export type Location = {
  country: string;
  state?: string;
  region?: string;
  state_region?: string;
  county?: string;
  lga?: string;
  lat?: number;
  lon?: number;
  aez?: string;
};

export type CropCase = {
  case_id: string;
  farmer_id: string;
  location: Location;
  crop: string;
  crop_stage: string;
  days_after_planting: number;
  symptom_description: string;
  photo_tags: string[];
  expected_diagnosis: string;
  severity: string;
  recommended_action: string;
  locally_available_inputs: string[];
  language_test: string;
  confidence_floor: number;
};

export type SoilProfile = {
  farmer_id: string;
  location: string;
  soil_type: string;
  pH: number;
  nitrogen_ppm: number;
  phosphorus_ppm: number;
  potassium_ppm: number;
  organic_matter_pct: number;
  texture: string;
  drainage: string;
  last_soil_test_date: string;
  recommended_fertiliser: string;
  notes: string;
};

export type FarmerProfile = {
  farmer_id: string;
  name: string;
  language: string;
  phone_type: string;
  mobile_money: boolean;
  location: Location;
  farm_size_ha: number;
  crops: string[];
  goals: string;
  constraints: string;
  preferred_channel: string;
  education?: string;
  extension_visits_last_year?: number;
};

export type SeasonalCalendarAdvisory = {
  farmer_id: string;
  crop: string;
  country: string;
  aez: string;
  traditional_planting_date: string;
  ai_adjusted_planting_date: string;
  reason_for_shift: string;
  recommended_variety: string;
  variety_change_reason: string;
  input_timing_advice: string;
  estimated_yield_baseline_kg_ha: number;
  estimated_yield_optimised_kg_ha: number;
};

export type MarketPrice = {
  record_id: string;
  date: string;
  commodity: string;
  market_name: string;
  market_type: string;
  country: string;
  state: string;
  price_local_currency: number;
  currency: string;
  price_usd_per_kg: number;
  price_trend_7day: number;
  price_trend_30day: number;
  volume_traded_kg: number;
  quality_grade: string;
  notes: string;
};

export type StorageAdvisory = {
  farmer_id: string;
  commodity: string;
  quantity_kg: number;
  harvest_date: string;
  current_storage: string;
  location: Location;
  current_farm_gate_price_NGN_kg?: number;
  assessment: {
    shelf_life_current_days: number;
    risk: string;
    recommendation: string;
    sell_or_store: string;
    nearest_cold_storage: string | null;
    nearest_hermetic_bag_supplier?: string;
    matched_buyers: Array<{
      buyer: string;
      price_NGN_kg: number;
      min_quantity_kg: number;
      contact: string;
      requirement?: string;
    }>;
  };
};

export type ClimateForecast = {
  location_id: string;
  country: string;
  state_region: string;
  lat: number;
  lon: number;
  aez: string;
  crop: string;
  season: string;
  forecast_onset_2025: string;
  forecast_confidence: string;
  forecast_rainfall_anomaly_pct: string;
  dry_spell_risk_category: string;
  flood_risk_category: string;
  recommended_planting_date: string;
  adjusted_variety: string;
  rationale: string;
};

export type HistoricalRainfallYield = {
  location_id: string;
  country: string;
  state: string;
  years: number[];
  onset_date_doy: number[];
  total_rainfall_mm: number[];
  dry_spells_gt14days: number[];
  yield_loss_pct_vs_potential: number[];
  extreme_events: string[];
  [key: string]: unknown;
};

export type CreditApplication = {
  applicant_id: string;
  name: string;
  location: Location;
  farm_size_ha: number;
  land_tenure: string;
  crops: string[];
  formal_credit_history: boolean;
  cooperative_membership: boolean;
  cooperative_repayment_record?: string;
  mobile_money_account: boolean;
  mobile_money_provider: string | null;
  satellite_ndvi_last_season?: number | null;
  satellite_ndvi_change_yoy?: number | null;
  requested_loan_NGN?: number;
  requested_loan_ETB?: number;
  requested_loan_KES?: number;
  requested_loan_GHS?: number;
  loan_purpose: string;
  estimated_repayment_capacity_NGN?: number;
  expected_credit_decision: string;
  expected_score_band: string;
  notes: string;
};

export type CooperativeRepaymentHistory = {
  cooperative_id: string;
  cooperative_name: string;
  country: string;
  state_region: string;
  members: number;
  years_active: number;
  total_loans_disbursed_USD: number;
  total_repaid_USD: number;
  repayment_rate_pct: number;
  avg_loan_size_USD: number;
  default_rate_pct: number;
  top_default_reasons: string;
  notes: string;
};

export type AdvisoryResult = {
  decision: string;
  confidence: string;
  reasoning: string[];
  actions: string[];
  riskFlags?: string[];
};
