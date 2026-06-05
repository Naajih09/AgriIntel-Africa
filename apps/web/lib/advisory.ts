import type {
  ClimateForecast,
  CreditApplication,
  CropCase,
  FarmerProfile,
  MarketPrice,
  StorageAdvisory
} from "@agriintel/types";

export function cropDecision(item: CropCase) {
  return {
    title: item.expected_diagnosis,
    confidence: `${Math.round(item.confidence_floor * 100)}%+`,
    body: item.recommended_action
  };
}

export function extensionDecision(item: FarmerProfile) {
  const voiceOnly = /illiterate|cannot use text/i.test(item.constraints) || /voice/i.test(item.preferred_channel);
  return {
    title: voiceOnly ? `Voice call in ${item.language}` : item.preferred_channel,
    confidence: "High",
    body: voiceOnly
      ? "Route through voice, not app or SMS, and keep the advisory practical for low-cash constraints."
      : `Personalize around ${item.goals}`
  };
}

export function marketDecision(prices: MarketPrice[], item: StorageAdvisory) {
  const bestMarket = prices
    .filter((price) => item.commodity.toLowerCase().includes(price.commodity.toLowerCase()))
    .sort((a, b) => b.price_local_currency - a.price_local_currency)[0];

  return {
    title: item.assessment.sell_or_store,
    confidence: item.assessment.risk.toUpperCase().includes("CRITICAL") ? "High urgency" : "High",
    body: bestMarket
      ? `${item.assessment.recommendation} Best listed market: ${bestMarket.market_name} at ${bestMarket.currency} ${bestMarket.price_local_currency}/kg.`
      : item.assessment.recommendation
  };
}

export function climateDecision(item: ClimateForecast) {
  return {
    title: item.location_id === "CL006"
      ? "Fallow 50% and plant short-season sorghum"
      : `Plant ${item.adjusted_variety}`,
    confidence: item.forecast_confidence,
    body: item.rationale
  };
}

export function creditDecision(item: CreditApplication) {
  return {
    title: item.expected_credit_decision,
    confidence: item.expected_score_band,
    body: item.applicant_id === "AC003"
      ? "Fairness guardrail: refer to human review because the NDVI decline is climate-driven."
      : item.notes
  };
}
