import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import type {
  ClimateForecast,
  CreditApplication,
  CropCase,
  FarmerProfile,
  MarketPrice,
  StorageAdvisory
} from "@agriintel/types";
import { parseCsv } from "./csv";

function getDataDir() {
  const candidates = [
    path.resolve(process.cwd(), "data"),
    path.resolve(process.cwd(), "../../data")
  ];
  const dataDir = candidates.find((candidate) => existsSync(candidate));
  if (!dataDir) {
    throw new Error(`Unable to find data directory from ${process.cwd()}`);
  }
  return dataDir;
}

function readJson<T>(relativePath: string): T {
  return JSON.parse(readFileSync(path.join(getDataDir(), relativePath), "utf8")) as T;
}

function readCsv<T extends Record<string, unknown>>(relativePath: string): T[] {
  return parseCsv<T>(readFileSync(path.join(getDataDir(), relativePath), "utf8"));
}

export function getCropCases() {
  return readJson<CropCase[]>("c1_crop_health/crop_disease_cases.json");
}

export function getFarmerProfiles() {
  return readJson<FarmerProfile[]>("c2_extension/farmer_profiles.json");
}

export function getMarketPrices() {
  return readCsv<MarketPrice>("c3_postharvest/market_prices.csv");
}

export function getStorageAdvisories() {
  return readJson<StorageAdvisory[]>("c3_postharvest/storage_advisory.json");
}

export function getClimateForecasts() {
  return readCsv<ClimateForecast>("c4_climate/seasonal_forecasts.csv");
}

export function getCreditApplications() {
  return readJson<CreditApplication[]>("c5_finance/credit_applications.json");
}
