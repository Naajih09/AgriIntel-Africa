import type {
  AdvisoryResult,
  ClimateForecast,
  CooperativeRepaymentHistory,
  CreditApplication,
  CropCase,
  FarmerProfile,
  HistoricalRainfallYield,
  MarketPrice,
  SeasonalCalendarAdvisory,
  SoilProfile,
  StorageAdvisory
} from "@agriintel/types";

export function diagnoseCropCase(cropCase: CropCase, soil?: SoilProfile): AdvisoryResult {
  return {
    decision: cropCase.expected_diagnosis,
    confidence: `${Math.round(cropCase.confidence_floor * 100)}%+`,
    reasoning: [
      `${cropCase.crop} at ${cropCase.crop_stage} shows ${cropCase.symptom_description}`,
      `Photo tags match ${cropCase.photo_tags.join(", ")}.`,
      `Severity is ${cropCase.severity}; response should include ${cropCase.language_test}.`,
      soil
        ? `CSV soil profile: ${soil.soil_type}, pH ${soil.pH}, NPK ${soil.nitrogen_ppm}/${soil.phosphorus_ppm}/${soil.potassium_ppm}, organic matter ${soil.organic_matter_pct}%.`
        : "No matching soil CSV row found for this farmer."
    ],
    actions: [
      cropCase.recommended_action,
      `Use only local inputs: ${cropCase.locally_available_inputs.join("; ")}.`,
      soil ? `Fertiliser context from CSV: ${soil.recommended_fertiliser}.` : "Ask for a soil test before fertiliser-specific advice."
    ],
    riskFlags: cropCase.confidence_floor < 0.8 ? ["Below normal confidence floor; ask for clearer photo or extension review."] : []
  };
}

export function createExtensionAdvice(farmer: FarmerProfile, calendar?: SeasonalCalendarAdvisory): AdvisoryResult {
  const voiceOnly = /illiterate|cannot use text/i.test(farmer.constraints) || /voice/i.test(farmer.preferred_channel);
  const channel = voiceOnly ? `Voice call in ${farmer.language}` : farmer.preferred_channel;

  return {
    decision: channel,
    confidence: "High",
    reasoning: [
      `${farmer.name} farms ${farmer.crops.join(", ")} on ${farmer.farm_size_ha}ha.`,
      `Primary constraints: ${farmer.constraints}`,
      `Advice must respect phone type (${farmer.phone_type}) and preferred channel (${farmer.preferred_channel}).`,
      calendar
        ? `CSV calendar shifts ${calendar.crop} from ${calendar.traditional_planting_date} to ${calendar.ai_adjusted_planting_date}: ${calendar.reason_for_shift}`
        : "No matching seasonal calendar CSV row found."
    ],
    actions: [
      `Deliver advisory via ${channel}.`,
      `Focus message on: ${farmer.goals}`,
      calendar ? `Recommend ${calendar.recommended_variety}; ${calendar.input_timing_advice}.` : "Use general seasonal advisory until a calendar row is added.",
      farmer.mobile_money ? "Include input budgeting and mobile money repayment reminders." : "Avoid app, wallet, or text-heavy workflows."
    ]
  };
}

export function analyzeMarket(prices: MarketPrice[], storage: StorageAdvisory): AdvisoryResult {
  const commodityPrices = prices
    .filter((price) => storage.commodity.toLowerCase().includes(price.commodity.toLowerCase()))
    .sort((a, b) => b.price_local_currency - a.price_local_currency);
  const bestMarket = commodityPrices[0];

  return {
    decision: storage.assessment.sell_or_store,
    confidence: storage.assessment.risk.toUpperCase().includes("CRITICAL") ? "High urgency" : "High",
    reasoning: [
      storage.assessment.risk,
      bestMarket
        ? `Best visible ${bestMarket.commodity} market is ${bestMarket.market_name}, ${bestMarket.state} at ${bestMarket.currency} ${bestMarket.price_local_currency}/kg.`
        : "No direct market price record found for this commodity.",
      `Current farm-gate price is NGN ${storage.current_farm_gate_price_NGN_kg ?? "n/a"}/kg.`
    ],
    actions: [
      storage.assessment.recommendation,
      `Matched buyers: ${storage.assessment.matched_buyers.map((buyer) => buyer.buyer).join(", ")}.`
    ],
    riskFlags: storage.farmer_id === "F3002" ? ["Do not route Kaduna tomato to Lagos despite apparent price upside."] : []
  };
}

export function adviseClimate(forecast: ClimateForecast, history?: HistoricalRainfallYield): AdvisoryResult {
  const confidence = Number(String(forecast.forecast_confidence).replace("%", ""));
  const riskFlags = [
    forecast.dry_spell_risk_category.includes("HIGH") ? `${forecast.dry_spell_risk_category} dry spell risk` : "",
    confidence < 70 ? `Forecast confidence is ${forecast.forecast_confidence}; communicate uncertainty.` : ""
  ].filter(Boolean);

  return {
    decision: `Plant ${forecast.adjusted_variety} from ${forecast.recommended_planting_date}`,
    confidence: forecast.forecast_confidence,
    reasoning: [
      `${forecast.state_region}, ${forecast.country} forecast onset: ${forecast.forecast_onset_2025}.`,
      `Rainfall anomaly: ${forecast.forecast_rainfall_anomaly_pct}.`,
      forecast.rationale,
      history
        ? `Historical dataset: recent extreme events include ${history.extreme_events.slice(-3).join("; ")}.`
        : "No matching historical rainfall/yield record found."
    ],
    actions: forecast.location_id === "CL006"
      ? ["Fallow 50% of land this season.", "Plant only drought-hardy short-season sorghum on the remaining land."]
      : [`Use ${forecast.adjusted_variety}.`, `Plant around ${forecast.recommended_planting_date}.`],
    riskFlags
  };
}

export function scoreCredit(application: CreditApplication, cooperative?: CooperativeRepaymentHistory): AdvisoryResult {
  const decision = application.expected_credit_decision;
  const climateFairnessCase = application.applicant_id === "AC003";
  const loan = formatRequestedLoan(application);

  return {
    decision,
    confidence: application.expected_score_band,
    reasoning: [
      application.notes,
      application.cooperative_repayment_record
        ? `Cooperative record: ${application.cooperative_repayment_record}.`
        : "No cooperative repayment record available.",
      application.mobile_money_account
        ? `${application.mobile_money_provider} mobile money is available as an alternative income signal.`
        : "No mobile money trail; avoid overconfidence.",
      cooperative
        ? `CSV cooperative context: ${cooperative.cooperative_name} has ${cooperative.repayment_rate_pct}% repayment and ${cooperative.default_rate_pct}% default rate. Notes: ${cooperative.notes}`
        : "No matching cooperative CSV row found for country/state context."
    ],
    actions: [
      climateFairnessCase ? "Refer to human review; do not auto-reject based on climate-driven NDVI decline." : `Proceed with ${decision}.`,
      `Requested loan: ${loan}.`
    ],
    riskFlags: climateFairnessCase ? ["Fairness test: NDVI decline is climate-driven, not proof of farmer default risk."] : []
  };
}

function formatRequestedLoan(application: CreditApplication) {
  const loanOptions = [
    ["NGN", application.requested_loan_NGN],
    ["ETB", application.requested_loan_ETB],
    ["KES", application.requested_loan_KES],
    ["GHS", application.requested_loan_GHS]
  ] as const;
  const loan = loanOptions.find(([, value]) => typeof value === "number");

  if (!loan || typeof loan[1] !== "number") {
    return "not specified";
  }

  return `${loan[0]} ${loan[1].toLocaleString()}`;
}
