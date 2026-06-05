import { MessageSquareText } from "lucide-react";
import { DecisionCard } from "@/components/DecisionCard";
import { extensionDecision } from "@/lib/advisory";
import { getFarmerProfiles, getSeasonalCalendar } from "@/lib/data";

export default function ExtensionPage() {
  const farmers = getFarmerProfiles();
  const calendar = getSeasonalCalendar();

  return (
    <section className="section">
      <div className="section-title">
        <MessageSquareText size={24} />
        <h2>Extension Services</h2>
      </div>
      <div className="record-grid">
        {farmers.map((item) => (
          <DecisionCard
            key={item.farmer_id}
            eyebrow={item.farmer_id}
            title={item.name}
            meta={`${item.location.country} | ${item.phone_type} | ${item.farm_size_ha}ha`}
            badges={[item.language, item.preferred_channel, `${item.extension_visits_last_year ?? 0} visits`]}
            decision={extensionDecision(item, calendar.find((row) => row.farmer_id === item.farmer_id))}
          />
        ))}
      </div>
    </section>
  );
}
