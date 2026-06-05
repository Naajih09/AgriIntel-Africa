import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type {
  ClimateForecast,
  CreditApplication,
  CropCase,
  FarmerProfile,
  MarketPrice,
  StorageAdvisory
} from "@agriintel/types";
import { parseCsv } from "./csv.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "../../../..");
const dataDir = path.join(rootDir, "data");

async function readJson<T>(relativePath: string): Promise<T> {
  const file = await readFile(path.join(dataDir, relativePath), "utf8");
  return JSON.parse(file) as T;
}

async function readCsv<T extends Record<string, unknown>>(relativePath: string): Promise<T[]> {
  const file = await readFile(path.join(dataDir, relativePath), "utf8");
  return parseCsv<T>(file);
}

export const datasets = {
  cropCases: () => readJson<CropCase[]>("c1_crop_health/crop_disease_cases.json"),
  farmerProfiles: () => readJson<FarmerProfile[]>("c2_extension/farmer_profiles.json"),
  marketPrices: () => readCsv<MarketPrice>("c3_postharvest/market_prices.csv"),
  storageAdvisories: () => readJson<StorageAdvisory[]>("c3_postharvest/storage_advisory.json"),
  climateForecasts: () => readCsv<ClimateForecast>("c4_climate/seasonal_forecasts.csv"),
  creditApplications: () => readJson<CreditApplication[]>("c5_finance/credit_applications.json")
};
