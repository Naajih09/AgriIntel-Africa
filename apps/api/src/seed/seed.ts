import { datasets } from "../lib/data.js";

async function main() {
  const [cropCases, farmers, prices, storage, climate, credit] = await Promise.all([
    datasets.cropCases(),
    datasets.farmerProfiles(),
    datasets.marketPrices(),
    datasets.storageAdvisories(),
    datasets.climateForecasts(),
    datasets.creditApplications()
  ]);

  console.log("Seed source files loaded:");
  console.table({
    cropCases: cropCases.length,
    farmerProfiles: farmers.length,
    marketPrices: prices.length,
    storageAdvisories: storage.length,
    climateForecasts: climate.length,
    creditApplications: credit.length
  });
  console.log("Prisma insert/upsert wiring is the next step once DATABASE_URL is available.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
