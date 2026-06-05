import cors from "cors";
import "dotenv/config";
import express from "express";
import { datasets } from "./lib/data.js";
import {
  adviseClimate,
  analyzeMarket,
  createExtensionAdvice,
  diagnoseCropCase,
  scoreCredit
} from "./services/advisory.js";

const app = express();
const port = Number(process.env.PORT ?? 4000);

app.use(cors());
app.use(express.json());

app.get("/health", (_request, response) => {
  response.json({ ok: true, service: "agriintel-api" });
});

app.get("/api/crop-health", async (_request, response) => {
  response.json(await datasets.cropCases());
});

app.get("/api/crop-health/soil-profiles", async (_request, response) => {
  response.json(await datasets.soilProfiles());
});

app.get("/api/crop-health/:caseId/diagnosis", async (request, response) => {
  const cropCase = (await datasets.cropCases()).find((item) => item.case_id === request.params.caseId);
  if (!cropCase) return response.status(404).json({ error: "Crop case not found" });
  const soil = (await datasets.soilProfiles()).find((item) => item.farmer_id === cropCase.farmer_id);
  response.json({ case: cropCase, soil, advisory: diagnoseCropCase(cropCase, soil) });
});

app.get("/api/extension", async (_request, response) => {
  response.json(await datasets.farmerProfiles());
});

app.get("/api/extension/seasonal-calendar", async (_request, response) => {
  response.json(await datasets.seasonalCalendar());
});

app.get("/api/extension/:farmerId/advisory", async (request, response) => {
  const farmer = (await datasets.farmerProfiles()).find((item) => item.farmer_id === request.params.farmerId);
  if (!farmer) return response.status(404).json({ error: "Farmer profile not found" });
  const calendar = (await datasets.seasonalCalendar()).find((item) => item.farmer_id === farmer.farmer_id);
  response.json({ farmer, calendar, advisory: createExtensionAdvice(farmer, calendar) });
});

app.get("/api/market/prices", async (_request, response) => {
  response.json(await datasets.marketPrices());
});

app.get("/api/market/storage/:farmerId/advisory", async (request, response) => {
  const storage = (await datasets.storageAdvisories()).find((item) => item.farmer_id === request.params.farmerId);
  if (!storage) return response.status(404).json({ error: "Storage advisory not found" });
  response.json({ storage, advisory: analyzeMarket(await datasets.marketPrices(), storage) });
});

app.get("/api/climate", async (_request, response) => {
  response.json(await datasets.climateForecasts());
});

app.get("/api/climate/history", async (_request, response) => {
  response.json(await datasets.historicalRainfallYield());
});

app.get("/api/climate/:locationId/advisory", async (request, response) => {
  const forecast = (await datasets.climateForecasts()).find((item) => item.location_id === request.params.locationId);
  if (!forecast) return response.status(404).json({ error: "Climate forecast not found" });
  const history = (await datasets.historicalRainfallYield()).find((item) => item.location_id === forecast.location_id);
  response.json({ forecast, history, advisory: adviseClimate(forecast, history) });
});

app.get("/api/credit", async (_request, response) => {
  response.json(await datasets.creditApplications());
});

app.get("/api/credit/cooperatives", async (_request, response) => {
  response.json(await datasets.cooperativeHistory());
});

app.get("/api/credit/:applicantId/decision", async (request, response) => {
  const application = (await datasets.creditApplications()).find((item) => item.applicant_id === request.params.applicantId);
  if (!application) return response.status(404).json({ error: "Credit application not found" });
  const cooperative = (await datasets.cooperativeHistory()).find(
    (item) =>
      item.country === application.location.country &&
      (item.state_region === application.location.state || item.state_region === application.location.region)
  );
  response.json({ application, cooperative, advisory: scoreCredit(application, cooperative) });
});

app.listen(port, () => {
  console.log(`AgriIntel API listening on http://localhost:${port}`);
});
