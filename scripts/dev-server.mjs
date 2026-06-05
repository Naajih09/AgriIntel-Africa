import { createServer } from "node:http";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const dataDir = path.join(rootDir, "data");
const preferredPort = Number(process.env.PORT ?? 3000);

if (!existsSync(dataDir)) {
  console.error(`Data directory not found: ${dataDir}`);
  process.exit(1);
}

const data = loadData();

listen(preferredPort);

function listen(port) {
  const server = createServer((request, response) => {
    const url = new URL(request.url ?? "/", `http://${request.headers.host}`);

    if (url.pathname === "/health") {
      return sendJson(response, { ok: true, service: "agriintel-lite" });
    }

    if (url.pathname.startsWith("/api/")) {
      return handleApi(url.pathname, response);
    }

    return sendHtml(response, renderPage(url.pathname));
  });

  server.once("error", (error) => {
    if (error.code === "EADDRINUSE") {
      console.warn(`Port ${port} is busy; trying ${port + 1}.`);
      listen(port + 1);
      return;
    }

    throw error;
  });

  server.listen(port, () => {
  console.log(`AgriIntel Africa demo running at http://localhost:${port}`);
  console.log("This lite server uses no installed dependencies. Free disk space before running the full Next/Express stack.");
  });
}

function loadData() {
  return {
    cropCases: readJson("c1_crop_health/crop_disease_cases.json"),
    soilProfiles: readCsv("c1_crop_health/soil_profiles.csv"),
    farmers: readJson("c2_extension/farmer_profiles.json"),
    seasonalCalendar: readCsv("c2_extension/seasonal_calendar_advisory.csv"),
    prices: readCsv("c3_postharvest/market_prices.csv"),
    storage: readJson("c3_postharvest/storage_advisory.json"),
    climate: readCsv("c4_climate/seasonal_forecasts.csv"),
    climateHistory: readJson("c4_climate/historical_rainfall_yield.json"),
    credit: readJson("c5_finance/credit_applications.json"),
    cooperativeHistory: readCsv("c5_finance/cooperative_repayment_history.csv")
  };
}

function handleApi(pathname, response) {
  const routes = {
    "/api/crop-health": data.cropCases,
    "/api/crop-health/soil-profiles": data.soilProfiles,
    "/api/extension": data.farmers,
    "/api/extension/seasonal-calendar": data.seasonalCalendar,
    "/api/market/prices": data.prices,
    "/api/market/storage": data.storage,
    "/api/climate": data.climate,
    "/api/climate/history": data.climateHistory,
    "/api/credit": data.credit,
    "/api/credit/cooperatives": data.cooperativeHistory
  };

  const payload = routes[pathname];
  if (!payload) {
    return sendJson(response, { error: "Not found" }, 404);
  }
  return sendJson(response, payload);
}

function renderPage(pathname) {
  const pages = {
    "/": renderHome,
    "/crop-health": () => renderCards("Crop Health Diagnostics", "C1", data.cropCases.map(cropCard)),
    "/extension": () => renderCards("Extension Services", "C2", data.farmers.map(extensionCard)),
    "/market": () => renderMarket(),
    "/climate": () => renderCards("Climate Resilience Advisor", "C4", data.climate.map(climateCard)),
    "/credit": () => renderCards("Farm Credit Scoring", "C5", data.credit.map(creditCard))
  };

  const render = pages[pathname] ?? renderHome;
  return layout(render());
}

function renderHome() {
  const countries = new Set([
    ...data.cropCases.map((item) => item.location.country),
    ...data.farmers.map((item) => item.location.country),
    ...data.storage.map((item) => item.location.country),
    ...data.climate.map((item) => item.country),
    ...data.credit.map((item) => item.location.country),
    ...data.prices.map((item) => item.country)
  ]);
  const demoCases = data.cropCases.length + data.farmers.length + data.storage.length + data.climate.length + data.credit.length;

  return `
    <section class="hero">
      <div>
        <p class="eyebrow">OPay & Google National Innovation Challenge 2026</p>
        <h1>AgriIntel Africa</h1>
        <p class="lede">Five AI advisory modules backed by the attached structured test data: crop diagnosis, extension routing, market decisions, climate resilience, and fair credit scoring.</p>
        <div class="badges">
          <span>Hausa</span><span>Wolof</span><span>Swahili</span><span>Amharic</span><span>OPay signal ready</span>
        </div>
      </div>
      <aside>
        <strong>5</strong><span>intelligence modules</span>
        <strong>${demoCases}</strong><span>demo cases</span>
        <strong>${countries.size}</strong><span>countries covered</span>
      </aside>
    </section>
    ${renderCards("Modules", "Live demo", [
      moduleCard("C1", "Crop Health Diagnostics", "Diagnose disease cases from symptoms, photo tags, local inputs, and language needs.", "/crop-health"),
      moduleCard("C2", "Extension Services", "Personalize advice by phone type, language, cash constraints, and preferred channel.", "/extension"),
      moduleCard("C3", "Market Intelligence", "Compare prices, shelf life, buyer fit, transport risk, and storage decisions.", "/market"),
      moduleCard("C4", "Climate Advisor", "Adjust planting dates and varieties based on seasonal forecasts and uncertainty.", "/climate"),
      moduleCard("C5", "Farm Credit Scoring", "Use cooperative, mobile money, and farm-performance signals with fairness guardrails.", "/credit")
    ])}
  `;
}

function renderMarket() {
  const cards = data.storage.map((item) => {
    const best = data.prices
      .filter((price) => item.commodity.toLowerCase().includes(String(price.commodity).toLowerCase()))
      .sort((a, b) => Number(b.price_local_currency) - Number(a.price_local_currency))[0];

    return card(
      item.farmer_id,
      `${item.quantity_kg.toLocaleString()}kg ${item.commodity}`,
      `${item.location.state}, ${item.location.country}`,
      [item.assessment.risk.split(" ")[0], `${item.assessment.shelf_life_current_days} days shelf life`],
      item.assessment.sell_or_store,
      `${item.assessment.recommendation}${best ? ` Best listed market: ${best.market_name} at ${best.currency} ${best.price_local_currency}/kg.` : ""}`
    );
  });

  const rows = data.prices.map((price) => `
    <tr>
      <td>${escapeHtml(price.commodity)}</td>
      <td>${escapeHtml(price.market_name)}, ${escapeHtml(price.state)}</td>
      <td>${escapeHtml(price.currency)} ${escapeHtml(price.price_local_currency)}/kg</td>
      <td>${escapeHtml(price.price_trend_30day)}%</td>
      <td>${escapeHtml(price.notes)}</td>
    </tr>
  `).join("");

  return `
    ${renderCards("Post-Harvest & Market Intelligence", "C3", cards)}
    <section class="section">
      <div class="table-wrap">
        <table>
          <thead><tr><th>Commodity</th><th>Market</th><th>Price</th><th>30-day trend</th><th>Note</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    </section>
  `;
}

function cropCard(item) {
  const soil = data.soilProfiles.find((profile) => profile.farmer_id === item.farmer_id);
  return card(
    item.case_id,
    `${item.crop} in ${item.location.state}, ${item.location.country}`,
    `${item.crop_stage} | ${item.days_after_planting} days after planting`,
    [item.severity, item.language_test, item.photo_tags.join(" + ")],
    item.expected_diagnosis,
    item.recommended_action,
    soil ? `CSV soil: ${soil.soil_type}, pH ${soil.pH}, NPK ${soil.nitrogen_ppm}/${soil.phosphorus_ppm}/${soil.potassium_ppm}. Fertiliser: ${soil.recommended_fertiliser}.` : ""
  );
}

function extensionCard(item) {
  const voiceOnly = /illiterate|cannot use text/i.test(item.constraints) || /voice/i.test(item.preferred_channel);
  const calendar = data.seasonalCalendar.find((row) => row.farmer_id === item.farmer_id);
  return card(
    item.farmer_id,
    item.name,
    `${item.location.country} | ${item.phone_type} | ${item.farm_size_ha}ha`,
    [item.language, item.preferred_channel],
    voiceOnly ? `Voice call in ${item.language}` : item.preferred_channel,
    voiceOnly ? "Route through voice, not app or SMS, and keep the advisory practical for low-cash constraints." : `Personalize around ${item.goals}`,
    calendar ? `CSV calendar: plant ${calendar.crop} on ${calendar.ai_adjusted_planting_date} instead of ${calendar.traditional_planting_date}. Variety: ${calendar.recommended_variety}.` : ""
  );
}

function climateCard(item) {
  const history = data.climateHistory.find((row) => row.location_id === item.location_id);
  return card(
    item.location_id,
    `${item.crop} in ${item.state_region}, ${item.country}`,
    `${item.season} | onset ${item.forecast_onset_2025}`,
    [item.dry_spell_risk_category, item.flood_risk_category, item.forecast_rainfall_anomaly_pct],
    item.location_id === "CL006" ? "Fallow 50% and plant short-season sorghum" : `Plant ${item.adjusted_variety}`,
    item.rationale,
    history ? `Historical data: ${history.extreme_events.slice(-3).join("; ")}.` : ""
  );
}

function creditCard(item) {
  const cooperative = data.cooperativeHistory.find((row) =>
    row.country === item.location.country &&
    (row.state_region === item.location.state || row.state_region === item.location.region)
  );
  return card(
    item.applicant_id,
    item.name,
    `${item.location.country} | NGN ${Number(item.requested_loan_NGN).toLocaleString("en-NG")} | ${item.farm_size_ha}ha`,
    [item.mobile_money_provider ?? "No wallet", item.cooperative_membership ? "Cooperative" : "No cooperative", item.expected_score_band],
    item.expected_credit_decision,
    item.applicant_id === "AC003"
      ? "Fairness guardrail: refer to human review because the NDVI decline is climate-driven."
      : item.notes,
    cooperative ? `CSV cooperative: ${cooperative.cooperative_name}, repayment ${cooperative.repayment_rate_pct}%, default ${cooperative.default_rate_pct}%.` : ""
  );
}

function moduleCard(code, title, body, href) {
  return `<a class="card module" href="${href}"><p class="eyebrow">${code}</p><h3>${escapeHtml(title)}</h3><p>${escapeHtml(body)}</p></a>`;
}

function renderCards(title, eyebrow, cards) {
  return `
    <section class="section">
      <p class="eyebrow">${escapeHtml(eyebrow)}</p>
      <h2>${escapeHtml(title)}</h2>
      <div class="grid">${cards.join("")}</div>
    </section>
  `;
}

function card(eyebrow, title, meta, badges, decision, body, csvContext = "") {
  return `
    <article class="card">
      <p class="eyebrow">${escapeHtml(eyebrow)}</p>
      <h3>${escapeHtml(title)}</h3>
      <p class="meta">${escapeHtml(meta)}</p>
      <div class="badges">${badges.map((badge) => `<span>${escapeHtml(badge)}</span>`).join("")}</div>
      <div class="result">
        <strong>${escapeHtml(decision)}</strong>
        <p>${escapeHtml(body)}</p>
        ${csvContext ? `<p class="csv-context">${escapeHtml(csvContext)}</p>` : ""}
      </div>
    </article>
  `;
}

function layout(content) {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>AgriIntel Africa</title>
  <style>
    :root { --ink:#17211b; --muted:#627064; --paper:#fbfcf8; --line:#dfe7dc; --leaf:#27714b; --wash:#eef5eb; }
    * { box-sizing: border-box; }
    body { margin: 0; background: var(--paper); color: var(--ink); font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; letter-spacing: 0; }
    a { color: inherit; text-decoration: none; }
    .shell { max-width: 1180px; margin: 0 auto; padding: 28px 20px 56px; }
    header { align-items: center; border-bottom: 1px solid var(--line); display: flex; gap: 18px; justify-content: space-between; padding-bottom: 18px; }
    .brand { font-weight: 800; }
    nav { display: flex; flex-wrap: wrap; gap: 10px; }
    nav a { border: 1px solid var(--line); border-radius: 8px; padding: 8px 12px; }
    .hero { display: grid; gap: 28px; grid-template-columns: minmax(0, 1.2fr) minmax(280px, .8fr); padding: 42px 0 30px; }
    aside, .card { background: white; border: 1px solid var(--line); border-radius: 8px; }
    aside { display: grid; gap: 4px; padding: 18px; }
    aside strong { font-size: 2rem; }
    h1 { font-size: clamp(2.4rem, 5vw, 5.4rem); line-height: .95; margin: 10px 0 18px; }
    h2 { font-size: clamp(1.5rem, 3vw, 2.35rem); margin: 0 0 16px; }
    h3 { margin: 0; }
    p { color: var(--muted); line-height: 1.6; }
    .lede { font-size: 1.12rem; max-width: 720px; }
    .eyebrow { color: var(--leaf); font-size: .78rem; font-weight: 800; text-transform: uppercase; }
    .section { padding-top: 34px; }
    .grid { display: grid; gap: 14px; grid-template-columns: repeat(3, minmax(0, 1fr)); }
    .card { display: flex; flex-direction: column; gap: 10px; min-height: 230px; padding: 16px; }
    .module { min-height: 170px; }
    .meta { font-size: .9rem; }
    .badges { display: flex; flex-wrap: wrap; gap: 8px; }
    .badges span { background: var(--wash); border: 1px solid var(--line); border-radius: 999px; font-size: .78rem; font-weight: 700; padding: 5px 9px; }
    .result { background: #f7faf5; border-left: 4px solid var(--leaf); margin-top: auto; padding: 12px; }
    .csv-context { border-top: 1px solid var(--line); color: #31543f; font-size: .9rem; margin-top: 10px; padding-top: 10px; }
    .table-wrap { overflow-x: auto; }
    table { border-collapse: collapse; min-width: 760px; width: 100%; }
    td, th { border-bottom: 1px solid var(--line); padding: 10px; text-align: left; }
    th { color: var(--muted); font-size: .8rem; text-transform: uppercase; }
    @media (max-width: 900px) { .hero, .grid { grid-template-columns: 1fr 1fr; } }
    @media (max-width: 640px) { header { align-items: flex-start; flex-direction: column; } .hero, .grid { grid-template-columns: 1fr; } }
  </style>
</head>
<body>
  <main class="shell">
    <header>
      <a class="brand" href="/">AgriIntel Africa</a>
      <nav>
        <a href="/crop-health">Crop</a>
        <a href="/extension">Extension</a>
        <a href="/market">Market</a>
        <a href="/climate">Climate</a>
        <a href="/credit">Credit</a>
      </nav>
    </header>
    ${content}
  </main>
</body>
</html>`;
}

function readJson(relativePath) {
  return JSON.parse(readFileSync(path.join(dataDir, relativePath), "utf8"));
}

function readCsv(relativePath) {
  const content = readFileSync(path.join(dataDir, relativePath), "utf8").trim();
  const rows = content.split(/\r?\n/).map(parseCsvLine);
  const headers = rows.shift() ?? [];

  return rows.map((row) => Object.fromEntries(headers.map((header, index) => [header, coerceValue(row[index] ?? "")])));
}

function parseCsvLine(line) {
  const values = [];
  let value = "";
  let quoted = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    const next = line[index + 1];
    if (char === '"' && quoted && next === '"') {
      value += '"';
      index += 1;
    } else if (char === '"') {
      quoted = !quoted;
    } else if (char === "," && !quoted) {
      values.push(value);
      value = "";
    } else {
      value += char;
    }
  }

  values.push(value);
  return values;
}

function coerceValue(value) {
  const trimmed = String(value).trim();
  return /^[+-]?\d+(\.\d+)?$/.test(trimmed) ? Number(trimmed) : trimmed;
}

function sendHtml(response, html, status = 200) {
  response.writeHead(status, { "Content-Type": "text/html; charset=utf-8" });
  response.end(html);
}

function sendJson(response, payload, status = 200) {
  response.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  response.end(JSON.stringify(payload, null, 2));
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
