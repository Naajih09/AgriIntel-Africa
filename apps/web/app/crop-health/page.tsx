import { Sprout } from "lucide-react";
import { DecisionCard } from "@/components/DecisionCard";
import { cropDecision } from "@/lib/advisory";
import { getCropCases } from "@/lib/data";

export default function CropHealthPage() {
  const cases = getCropCases();

  return (
    <section className="section">
      <div className="section-title">
        <Sprout size={24} />
        <h2>Crop Health Diagnostics</h2>
      </div>
      <div className="record-grid">
        {cases.map((item) => (
          <DecisionCard
            key={item.case_id}
            eyebrow={item.case_id}
            title={`${item.crop} in ${item.location.state}, ${item.location.country}`}
            meta={`${item.crop_stage} | ${item.days_after_planting} days after planting`}
            badges={[item.severity, item.language_test, item.photo_tags.join(" + ")]}
            decision={cropDecision(item)}
          />
        ))}
      </div>
    </section>
  );
}
