import { CloudSun } from "lucide-react";
import { DecisionCard } from "@/components/DecisionCard";
import { climateDecision } from "@/lib/advisory";
import { getClimateForecasts, getClimateHistory } from "@/lib/data";

export default function ClimatePage() {
  const forecasts = getClimateForecasts();
  const history = getClimateHistory();

  return (
    <section className="section">
      <div className="section-title">
        <CloudSun size={24} />
        <h2>Climate Resilience Advisor</h2>
      </div>
      <div className="record-grid">
        {forecasts.map((item) => (
          <DecisionCard
            key={item.location_id}
            eyebrow={item.location_id}
            title={`${item.crop} in ${item.state_region}, ${item.country}`}
            meta={`${item.season} | onset ${item.forecast_onset_2025}`}
            badges={[item.dry_spell_risk_category, item.flood_risk_category, item.forecast_rainfall_anomaly_pct]}
            decision={climateDecision(item, history.find((row) => row.location_id === item.location_id))}
          />
        ))}
      </div>
    </section>
  );
}
