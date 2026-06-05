# Data Inputs

AgriIntel reads module data from `data/`. JSON files define the main demo cases, and CSV files add structured context that is joined into advisory decisions.

## C1 Crop Health

- Main cases: `data/c1_crop_health/crop_disease_cases.json`
- CSV context: `data/c1_crop_health/soil_profiles.csv`
- Join key: `farmer_id`
- Used for: soil type, pH, NPK, organic matter, drainage, and fertiliser context.

## C2 Extension

- Main profiles: `data/c2_extension/farmer_profiles.json`
- CSV context: `data/c2_extension/seasonal_calendar_advisory.csv`
- Join key: `farmer_id`
- Used for: adjusted planting date, variety, reason for shift, input timing, and yield improvement estimate.

## C3 Market

- Main storage cases: `data/c3_postharvest/storage_advisory.json`
- CSV context: `data/c3_postharvest/market_prices.csv`
- Join key: commodity matching
- Used for: best visible market, local price comparison, trend, and arbitrage signals.

## C4 Climate

- Main forecasts: `data/c4_climate/seasonal_forecasts.csv`
- Historical context: `data/c4_climate/historical_rainfall_yield.json`
- Join key: `location_id`
- Used for: prior extreme events, rainfall history, yield-loss pattern, and uncertainty framing.

## C5 Credit

- Main applications: `data/c5_finance/credit_applications.json`
- CSV context: `data/c5_finance/cooperative_repayment_history.csv`
- Join key: applicant country + state/region
- Used for: cooperative repayment rate, default rate, group history, and climate/fairness notes.

## Adding New Data

Add new rows to the CSV files using the existing headers. If the join key matches a JSON case, the app will include that CSV row in the advisory context automatically.

For example, a new C1 crop case with `"farmer_id": "F9999"` should have a matching soil row in `soil_profiles.csv` with `farmer_id` set to `F9999`.
