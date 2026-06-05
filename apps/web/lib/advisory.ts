import type {
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

export function cropDecision(item: CropCase, soil?: SoilProfile) {
  return {
    title: item.expected_diagnosis,
    confidence: `${Math.round(item.confidence_floor * 100)}%+`,
    body: item.recommended_action,
    csvContext: soil
      ? `CSV soil: ${soil.soil_type}, pH ${soil.pH}, NPK ${soil.nitrogen_ppm}/${soil.phosphorus_ppm}/${soil.potassium_ppm}.`
      : "No matching soil CSV row."
  };
}

export function extensionDecision(item: FarmerProfile, calendar?: SeasonalCalendarAdvisory) {
  const voiceOnly = /illiterate|cannot use text/i.test(item.constraints) || /voice/i.test(item.preferred_channel);
  return {
    title: voiceOnly ? `Voice call in ${item.language}` : item.preferred_channel,
    confidence: "High",
    body: voiceOnly
      ? "Route through voice, not app or SMS, and keep the advisory practical for low-cash constraints."
      : `Personalize around ${item.goals}`,
    csvContext: calendar
      ? `CSV calendar: ${calendar.crop} shifts to ${calendar.ai_adjusted_planting_date}; variety ${calendar.recommended_variety}.`
      : "No matching seasonal calendar CSV row."
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

export function climateDecision(item: ClimateForecast, history?: HistoricalRainfallYield) {
  return {
    title: item.location_id === "CL006"
      ? "Fallow 50% and plant short-season sorghum"
      : `Plant ${item.adjusted_variety}`,
    confidence: item.forecast_confidence,
    body: item.rationale,
    csvContext: history
      ? `Historical data: ${history.extreme_events.slice(-3).join("; ")}.`
      : "No matching historical rainfall/yield row."
  };
}

export function creditDecision(item: CreditApplication, cooperative?: CooperativeRepaymentHistory) {
  return {
    title: item.expected_credit_decision,
    confidence: item.expected_score_band,
    body: item.applicant_id === "AC003"
      ? "Fairness guardrail: refer to human review because the NDVI decline is climate-driven."
      : item.notes,
    csvContext: cooperative
      ? `CSV cooperative: ${cooperative.cooperative_name}, repayment ${cooperative.repayment_rate_pct}%, default ${cooperative.default_rate_pct}%.`
      : "No matching cooperative CSV row."
  };
}
