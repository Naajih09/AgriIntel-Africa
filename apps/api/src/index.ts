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

app.get("/api/crop-health/:caseId/diagnosis", async (request, response) => {
  const cropCase = (await datasets.cropCases()).find((item) => item.case_id === request.params.caseId);
  if (!cropCase) return response.status(404).json({ error: "Crop case not found" });
  response.json({ case: cropCase, advisory: diagnoseCropCase(cropCase) });
});

app.get("/api/extension", async (_request, response) => {
  response.json(await datasets.farmerProfiles());
});

app.get("/api/extension/:farmerId/advisory", async (request, response) => {
  const farmer = (await datasets.farmerProfiles()).find((item) => item.farmer_id === request.params.farmerId);
  if (!farmer) return response.status(404).json({ error: "Farmer profile not found" });
  response.json({ farmer, advisory: createExtensionAdvice(farmer) });
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

app.get("/api/climate/:locationId/advisory", async (request, response) => {
  const forecast = (await datasets.climateForecasts()).find((item) => item.location_id === request.params.locationId);
  if (!forecast) return response.status(404).json({ error: "Climate forecast not found" });
  response.json({ forecast, advisory: adviseClimate(forecast) });
});

app.get("/api/credit", async (_request, response) => {
  response.json(await datasets.creditApplications());
});

app.get("/api/credit/:applicantId/decision", async (request, response) => {
  const application = (await datasets.creditApplications()).find((item) => item.applicant_id === request.params.applicantId);
  if (!application) return response.status(404).json({ error: "Credit application not found" });
  response.json({ application, advisory: scoreCredit(application) });
});

app.listen(port, () => {
  console.log(`AgriIntel API listening on http://localhost:${port}`);
});
