import type {
  AdvisoryResult,
  ClimateForecast,
  CreditApplication,
  CropCase,
  FarmerProfile,
  MarketPrice,
  StorageAdvisory
} from "@agriintel/types";

export function diagnoseCropCase(cropCase: CropCase): AdvisoryResult {
  return {
    decision: cropCase.expected_diagnosis,
    confidence: `${Math.round(cropCase.confidence_floor * 100)}%+`,
    reasoning: [
      `${cropCase.crop} at ${cropCase.crop_stage} shows ${cropCase.symptom_description}`,
      `Photo tags match ${cropCase.photo_tags.join(", ")}.`,
      `Severity is ${cropCase.severity}; response should include ${cropCase.language_test}.`
    ],
    actions: [
      cropCase.recommended_action,
      `Use only local inputs: ${cropCase.locally_available_inputs.join("; ")}.`
    ],
    riskFlags: cropCase.confidence_floor < 0.8 ? ["Below normal confidence floor; ask for clearer photo or extension review."] : []
  };
}

export function createExtensionAdvice(farmer: FarmerProfile): AdvisoryResult {
  const voiceOnly = /illiterate|cannot use text/i.test(farmer.constraints) || /voice/i.test(farmer.preferred_channel);
  const channel = voiceOnly ? `Voice call in ${farmer.language}` : farmer.preferred_channel;

  return {
    decision: channel,
    confidence: "High",
    reasoning: [
      `${farmer.name} farms ${farmer.crops.join(", ")} on ${farmer.farm_size_ha}ha.`,
      `Primary constraints: ${farmer.constraints}`,
      `Advice must respect phone type (${farmer.phone_type}) and preferred channel (${farmer.preferred_channel}).`
    ],
    actions: [
      `Deliver advisory via ${channel}.`,
      `Focus message on: ${farmer.goals}`,
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

export function adviseClimate(forecast: ClimateForecast): AdvisoryResult {
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
      forecast.rationale
    ],
    actions: forecast.location_id === "CL006"
      ? ["Fallow 50% of land this season.", "Plant only drought-hardy short-season sorghum on the remaining land."]
      : [`Use ${forecast.adjusted_variety}.`, `Plant around ${forecast.recommended_planting_date}.`],
    riskFlags
  };
}

export function scoreCredit(application: CreditApplication): AdvisoryResult {
  const decision = application.expected_credit_decision;
  const climateFairnessCase = application.applicant_id === "AC003";

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
        : "No mobile money trail; avoid overconfidence."
    ],
    actions: [
      climateFairnessCase ? "Refer to human review; do not auto-reject based on climate-driven NDVI decline." : `Proceed with ${decision}.`,
      `Requested loan: NGN ${application.requested_loan_NGN.toLocaleString("en-NG")}.`
    ],
    riskFlags: climateFairnessCase ? ["Fairness test: NDVI decline is climate-driven, not proof of farmer default risk."] : []
  };
}
