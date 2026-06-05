import { BadgeDollarSign } from "lucide-react";
import { DecisionCard } from "@/components/DecisionCard";
import { creditDecision } from "@/lib/advisory";
import { getCreditApplications } from "@/lib/data";

export default function CreditPage() {
  const applications = getCreditApplications();

  return (
    <section className="section">
      <div className="section-title">
        <BadgeDollarSign size={24} />
        <h2>Farm Credit Scoring</h2>
      </div>
      <div className="record-grid">
        {applications.map((item) => (
          <DecisionCard
            key={item.applicant_id}
            eyebrow={item.applicant_id}
            title={item.name}
            meta={`${item.location.country} | NGN ${item.requested_loan_NGN.toLocaleString("en-NG")} | ${item.farm_size_ha}ha`}
            badges={[
              item.mobile_money_provider ?? "No wallet",
              item.cooperative_membership ? "Cooperative" : "No cooperative",
              item.expected_score_band
            ]}
            decision={creditDecision(item)}
          />
        ))}
      </div>
    </section>
  );
}
