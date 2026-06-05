import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type {
  ClimateForecast,
  CooperativeRepaymentHistory,
  CreditApplication,
  CropCase,
  FarmerProfile,
  HistoricalRainfallYield,
  MarketPrice,
  SeasonalCalendarAdvisory,
  SoilProfile,
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
  soilProfiles: () => readCsv<SoilProfile>("c1_crop_health/soil_profiles.csv"),
  farmerProfiles: () => readJson<FarmerProfile[]>("c2_extension/farmer_profiles.json"),
  seasonalCalendar: () => readCsv<SeasonalCalendarAdvisory>("c2_extension/seasonal_calendar_advisory.csv"),
  marketPrices: () => readCsv<MarketPrice>("c3_postharvest/market_prices.csv"),
  storageAdvisories: () => readJson<StorageAdvisory[]>("c3_postharvest/storage_advisory.json"),
  climateForecasts: () => readCsv<ClimateForecast>("c4_climate/seasonal_forecasts.csv"),
  historicalRainfallYield: () => readJson<HistoricalRainfallYield[]>("c4_climate/historical_rainfall_yield.json"),
  creditApplications: () => readJson<CreditApplication[]>("c5_finance/credit_applications.json"),
  cooperativeHistory: () => readCsv<CooperativeRepaymentHistory>("c5_finance/cooperative_repayment_history.csv")
};
