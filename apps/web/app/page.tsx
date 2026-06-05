import { BadgeDollarSign, CloudSun, Leaf, MessageSquareText, Sprout, Warehouse } from "lucide-react";
import { ModuleCard } from "@/components/ModuleCard";
import {
  getClimateForecasts,
  getCreditApplications,
  getCropCases,
  getFarmerProfiles,
  getMarketPrices,
  getStorageAdvisories
} from "@/lib/data";

const modules = [
  {
    code: "C1",
    title: "Crop Health Diagnostics",
    description: "Diagnose disease cases from symptoms, photo tags, local inputs, and language needs.",
    href: "/crop-health",
    Icon: Sprout
  },
  {
    code: "C2",
    title: "Extension Services",
    description: "Personalize advice by phone type, language, cash constraints, and preferred channel.",
    href: "/extension",
    Icon: MessageSquareText
  },
  {
    code: "C3",
    title: "Market Intelligence",
    description: "Compare prices, shelf life, buyer fit, transport risk, and storage decisions.",
    href: "/market",
    Icon: Warehouse
  },
  {
    code: "C4",
    title: "Climate Advisor",
    description: "Adjust planting dates and varieties based on seasonal forecasts and uncertainty.",
    href: "/climate",
    Icon: CloudSun
  },
  {
    code: "C5",
    title: "Farm Credit Scoring",
    description: "Use cooperative, mobile money, and farm-performance signals with fairness guardrails.",
    href: "/credit",
    Icon: BadgeDollarSign
  }
];

export default function HomePage() {
  const cropCases = getCropCases();
  const farmerProfiles = getFarmerProfiles();
  const storageAdvisories = getStorageAdvisories();
  const climateForecasts = getClimateForecasts();
  const creditApplications = getCreditApplications();
  const marketPrices = getMarketPrices();
  const countries = new Set([
    ...cropCases.map((item) => item.location.country),
    ...farmerProfiles.map((item) => item.location.country),
    ...storageAdvisories.map((item) => item.location.country),
    ...climateForecasts.map((item) => item.country),
    ...creditApplications.map((item) => item.location.country),
    ...marketPrices.map((item) => item.country)
  ]);
  const stats = [
    ["5", "intelligence modules"],
    [String(cropCases.length + farmerProfiles.length + storageAdvisories.length + climateForecasts.length + creditApplications.length), "demo cases"],
    [String(countries.size), "countries covered"]
  ];

  return (
    <>
      <section className="hero">
        <div>
          <div className="eyebrow">OPay & Google National Innovation Challenge 2026</div>
          <h1>AgriIntel Africa</h1>
          <p className="hero-copy">
            A working intelligence layer for smallholder farmers: crop diagnosis, extension routing,
            market decisions, climate resilience, and fair credit scoring from one connected dataset.
          </p>
          <div className="badge-row">
            <span className="badge">Hausa</span>
            <span className="badge">Wolof</span>
            <span className="badge">Swahili</span>
            <span className="badge">Amharic</span>
            <span className="badge">OPay signal ready</span>
          </div>
        </div>
        <aside className="panel">
          <Leaf size={28} />
          <h2>Demo spine</h2>
          <p>
            Every screen is backed by the attached structured test data, with deterministic advisory
            logic matching the PRD’s critical judge scenarios.
          </p>
          <div className="stats">
            {stats.map(([value, label]) => (
              <div className="stat" key={label}>
                <strong>{value}</strong>
                <span>{label}</span>
              </div>
            ))}
          </div>
        </aside>
      </section>

      <section className="section">
        <div className="section-title">
          <Leaf size={22} />
          <h2>Modules</h2>
        </div>
        <div className="module-grid">
          {modules.map((module) => (
            <ModuleCard key={module.code} {...module} />
          ))}
        </div>
      </section>
    </>
  );
}
