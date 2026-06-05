import { BadgeDollarSign } from "lucide-react";
import { DecisionCard } from "@/components/DecisionCard";
import { creditDecision } from "@/lib/advisory";
import { getCooperativeHistory, getCreditApplications } from "@/lib/data";

export default function CreditPage() {
  const applications = getCreditApplications();
  const cooperatives = getCooperativeHistory();

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
            meta={`${item.location.country} | ${formatRequestedLoan(item)} | ${item.farm_size_ha}ha`}
            badges={[
              item.mobile_money_provider ?? "No wallet",
              item.cooperative_membership ? "Cooperative" : "No cooperative",
              item.expected_score_band
            ]}
            decision={creditDecision(
              item,
              cooperatives.find(
                (row) =>
                  row.country === item.location.country &&
                  (row.state_region === item.location.state || row.state_region === item.location.region)
              )
            )}
          />
        ))}
      </div>
    </section>
  );
}

function formatRequestedLoan(item: ReturnType<typeof getCreditApplications>[number]) {
  const loanOptions = [
    ["NGN", item.requested_loan_NGN],
    ["ETB", item.requested_loan_ETB],
    ["KES", item.requested_loan_KES],
    ["GHS", item.requested_loan_GHS]
  ] as const;
  const loan = loanOptions.find(([, value]) => typeof value === "number");

  if (!loan || typeof loan[1] !== "number") {
    return "Loan not specified";
  }

  return `${loan[0]} ${loan[1].toLocaleString()}`;
}
