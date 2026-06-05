# AgriIntel Africa — Product Requirements Document
**Challenge:** OPay & Google National Innovation Challenge 2026 — AgriTech Track
**Prepared by:** Naajih Siraj
**Version:** 1.0
**Date:** June 5, 2026

---

## 1. Executive Summary

**AgriIntel Africa** is an AI-powered farming intelligence platform that gives African smallholder farmers access to expert-level advice they currently have no access to. Through one unified platform, a farmer can diagnose crop diseases, get personalized planting advice, decide when and where to sell their harvest, understand climate risks before planting, and apply for credit based on their actual farm performance — not just their bank history.

The platform is built on **5 intelligence modules**, each powered by Claude AI, each backed by real structured datasets that are already available and ready to feed the system.

---

## 2. The Problem

African smallholder farmers collectively lose billions of dollars annually because they lack timely, accurate, personalized information:

- A farmer in Kano sees yellow streaks on his maize leaves. He has no idea what it is. By the time he finds out, the crop is gone.
- A farmer in Kaduna harvests 980kg of tomatoes. She considers transporting them to Lagos for a better price. She doesn't know the tomatoes will rot in 3 days before she arrives.
- A farmer in Katsina applies for a bank loan. The bank rejects him because he has no formal credit history — even though he has repaid his cooperative loan 12 times consecutively.
- A farmer in Dodoma, Tanzania plants his sorghum on the traditional date. He doesn't know the rains are coming 9 days late this year and his crop has a 40% chance of failing.

These are not small problems. They are the difference between feeding a family and losing everything.

**The core issue:** Farmers have land, labour, and the will to farm. What they lack is information. AgriIntel Africa is the information layer that was missing.

---

## 3. What We Are Building

AgriIntel Africa is a **web-based AI advisory platform** with 5 core modules:

| Module | Name | What It Does |
|---|---|---|
| C1 | Crop Health Diagnostics | Diagnose crop disease from symptoms and photo tags + recommend treatment |
| C2 | Extension Services | Personalized farming advisory delivered via the farmer's preferred channel |
| C3 | Post-Harvest & Market Intelligence | Sell-or-store decisions + buyer matching + market price arbitrage |
| C4 | Climate Resilience Advisor | Adjusted planting dates + variety recommendations based on seasonal forecasts |
| C5 | Farm Credit Scoring | AI credit scoring for farmers with no formal banking history |

---

## 4. What We Already Have (The Dataset)

This is critical. We are not building blind. We have **structured, realistic test data** for all 5 modules already prepared. This data will be loaded into our system and used to power the AI responses and demonstrate the platform live.

### C1 — Crop Health Dataset
**File:** `c1_crop_health/crop_disease_cases.json` + `soil_profiles.csv`

8 real crop disease cases across 5 countries:

| Case | Farmer | Country | Crop | Disease | Severity |
|---|---|---|---|---|---|
| CH001 | F1042 | Nigeria (Kano) | Maize | Maize streak virus | Moderate |
| CH002 | F2071 | Kenya (Nakuru) | Potato | Late blight | High |
| CH003 | F3015 | Ethiopia (Oromia) | Teff | Teff leaf blight | Low |
| CH004 | F4088 | Nigeria (Kaduna) | Sorghum | Downy mildew | Moderate |
| CH005 | F5020 | Ghana (Ashanti) | Cocoa | Black pod disease | High |
| CH006 | F6033 | Kenya (Rift Valley) | Beans | Angular leaf spot | Moderate |
| CH007 | F7004 | Nigeria (Borno) | Groundnut | Groundnut rust | Moderate |
| CH008 | F8051 | Tanzania (Mbeya) | Wheat | Stripe rust | High |

Each case has: symptoms, photo tags, expected diagnosis, recommended treatment, locally available inputs, and a language test (Hausa, Swahili, Amharic, Twi, Kanuri).

Soil profiles are cross-referenced to each farmer — pH, nitrogen, phosphorus, potassium, fertiliser recommendations.

---

### C2 — Extension Services Dataset
**File:** `c2_extension/farmer_profiles.json` + `seasonal_calendar_advisory.csv`

5 farmer profiles across Nigeria, Kenya, Senegal, Ethiopia with deep personalization data:

| Farmer | Name | Country | Phone | Channel | Key Challenge |
|---|---|---|---|---|---|
| F2001 | Amina Yusuf | Nigeria | Feature phone | SMS in Hausa | Female farmer, no extension visits, can't afford full fertiliser |
| F2002 | Joseph Okello | Kenya | Smartphone | WhatsApp voice (Luo) | Wants to diversify to tomatoes |
| F2003 | Fatou Diallo | Senegal | Basic phone | Voice call in Wolof | Illiterate, no cash, no road access in wet season |
| F2004 | Tesfaye Bekele | Ethiopia | Smartphone | App in Amharic | Wants to export teff, slow threshing problem |
| F2005 | Chukwuemeka Eze | Nigeria | Smartphone | App in English/Igbo | Large farmer, wants to export yam flour |

**Key edge cases the AI must handle:**
- F2003 (Fatou): Illiterate, no smartphone, no mobile money — system must route to voice call in Wolof only
- F2001 (Amina): Feature phone only — SMS responses, not app-based

---

### C3 — Post-Harvest & Market Dataset
**File:** `c3_postharvest/market_prices.csv` + `storage_advisory.json`

12 commodity price records across Nigeria, Kenya, Ghana with arbitrage signals:

**Critical test cases:**
- **Tomato arbitrage:** Lagos price (₦450/kg) vs Kano price (₦610/kg) — 35% gap on same day. System must recommend routing to Kano not Lagos.
- **Cassava processing:** Fresh cassava at ₦95/kg vs Gari (processed) at ₦900/kg — 9x value difference. System must recommend processing.
- **Onion timing:** Sokoto onion price rising +19% over 30 days — seasonal scarcity window open 2-4 weeks. System must flag time sensitivity.
- **F3002 tomato (critical test):** 980kg of tomatoes in Kaduna. Lagos price looks better but transport takes 14 hours and shelf life is 3 days. System must recommend selling locally or to Dangote Tomato Factory in Kaduna — NOT Lagos.

3 storage advisory cases with full sell-or-store decisions and matched buyers already in data.

---

### C4 — Climate Resilience Dataset
**File:** `c4_climate/seasonal_forecasts.csv` + `historical_rainfall_yield.json`

8 location forecasts across Nigeria, Kenya, Ethiopia, Ghana, Tanzania, Senegal, Uganda:

**Key cases:**
- **CL006 (Dodoma, Tanzania):** Very late onset, -14% rainfall, 40% crop failure probability. System must recommend fallowing 50% of land — NOT just a variety change.
- **CL004 (Northern Ghana):** Late onset + below-normal rain — system must recommend sorghum over maize this season.
- **CL007 (Senegal):** Below-normal year — system must say skip groundnut entirely, only 90-day millet viable.
- **CL004 has 65% forecast confidence** — system must communicate uncertainty, not present as certain.

---

### C5 — Farm Credit Scoring Dataset
**File:** `c5_finance/credit_applications.json` + `cooperative_repayment_history.csv`

6 credit application archetypes with expected decisions:

| Applicant | Country | Expected Decision | Key Signal |
|---|---|---|---|
| AC001 — Musa Ibrahim | Nigeria | APPROVE | 12/12 cooperative repayments + OPay mobile money confirms income |
| AC002 — Grace Adeyemi | Nigeria | CONDITIONAL APPROVE (₦50k not ₦80k) | Thin profile but consistent mobile money flows |
| AC003 — Abdirahman Farah | Ethiopia | REFER TO HUMAN — do not auto-reject | NDVI decline is climate-driven, not farmer failure |
| AC004 — Patrick Njoroge | Kenya | APPROVE high confidence | Titled land, formal credit, M-Pesa income confirmed, high NDVI |
| AC005 — Blessing Okafor | Nigeria | APPROVE with cooperative guarantee | 1 late repayment in drought year — should not penalise |
| AC006 — Kofi Mensah | Ghana | DECLINE | Cashew year 3 revenue speculative, repayment gap |

**Fairness test:** AC003 — a model that auto-rejects based on low NDVI alone FAILS. The decline is climate-driven. System must refer to human review.

**OPay connection:** AC001 uses OPay mobile money as the primary alternative credit signal. This directly ties the platform to OPay's ecosystem.

---

## 5. How The AI Works

### 5.1 The Core Pattern
Every module follows the same pattern:

```
Structured data from dataset
        ↓
Backend formats it into a Claude prompt
        ↓
Claude AI analyzes and generates response
        ↓
Response parsed and displayed to user
        ↓
Decision + reasoning shown clearly
```

### 5.2 Example — C1 Crop Diagnosis Prompt
```
You are AgriIntel, an expert crop disease diagnostician for African smallholder farmers.

FARMER LOCATION: Kano, Nigeria — Sudan Savanna AEZ
CROP: Maize at V6 stage (32 days after planting)
SYMPTOMS: Yellow and white streaks running parallel along leaves. Younger leaves more affected. Stunted growth.
PHOTO TAGS: yellowing, leaf_streak, stunted
SOIL DATA: Sandy loam, pH 6.1, Low organic matter (1.2%), Good drainage
LOCALLY AVAILABLE INPUTS: Cypermethrin 10EC (Kano agro-shops), SAMMAZ 15 seed (IITA)
LANGUAGE: Respond in Hausa (with English translation)
CONFIDENCE FLOOR: Do not diagnose with less than 80% confidence

Diagnose the disease, explain why, state severity, and give step-by-step treatment using only locally available inputs.

Return as JSON: { diagnosis, confidence, severity, explanation, treatment_steps, prevention_next_season }
```

### 5.3 Example — C5 Credit Scoring Prompt
```
You are AgriIntel Credit, an AI credit scoring engine for African smallholder farmers
who have no formal banking history.

APPLICANT: Musa Ibrahim, Katsina, Nigeria
FARM: 3.2ha, Groundnut + Millet, 15 years experience
COOPERATIVE: Member 6 years — 12/12 loan cycles repaid on time
MOBILE MONEY (OPay): 6-month avg balance ₦18,400 | Inflows ₦285,000 | Outflows ₦269,000
AGRO-DEALER CREDIT: 3 seasons, always paid within 60 days of harvest
SATELLITE NDVI: 0.61 (improved +0.05 YoY — farm productivity increasing)
LOAN REQUEST: ₦150,000 for certified seed + fertiliser
ESTIMATED REVENUE: ₦390,000 | REPAYMENT CAPACITY: ₦220,000

SCORING RULES:
- Cooperative repayment record is a strong positive signal
- Mobile money flow pattern confirms income seasonality
- NDVI improvement indicates growing farm productivity
- AC003 principle: if data is absent due to climate/external factors, refer to human — never auto-reject
- AC005 principle: a single late repayment in a documented drought year must not penalise

Return JSON: { decision, score_band, confidence, reasoning, conditions, risk_flags }
```

---

## 6. Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| **Next.js 14 (App Router)** | Main web application |
| **TypeScript** | Type safety |
| **Tailwind CSS** | Styling |
| **shadcn/ui** | Component library |
| **Recharts** | Charts for market prices, climate trends, credit scores |
| **Lucide React** | Icons |

### Backend
| Technology | Purpose |
|---|---|
| **Node.js + Express** | REST API |
| **TypeScript** | Type safety |
| **Prisma ORM** | Database access |
| **PostgreSQL** | Data storage |
| **Zod** | Request validation |

### AI Layer
| Technology | Purpose |
|---|---|
| **Anthropic Claude API** | Core AI reasoning for all 5 modules |
| **Model:** claude-sonnet-4-20250514 | Fast, accurate, cost-efficient |
| **Structured JSON prompts** | Every module sends structured data, receives structured JSON |

### Data Layer
| Technology | Purpose |
|---|---|
| **JSON/CSV seed files** | All 5 datasets already prepared and ready to load |
| **Prisma seed script** | Loads all datasets into PostgreSQL on startup |
| **Faker.js** | Generate additional demo farmers if needed |

### DevOps
| Technology | Purpose |
|---|---|
| **GitHub** | Monorepo, collaboration via feature branches |
| **pnpm workspaces** | Monorepo package management |
| **Vercel** | Frontend deployment |
| **Railway** | Backend + PostgreSQL deployment |

---

## 7. Repository Structure

```
agriintel-africa/
├── apps/
│   ├── web/                          # Next.js frontend
│   │   ├── app/
│   │   │   ├── page.tsx              # Landing / module selector
│   │   │   ├── crop-health/
│   │   │   │   ├── page.tsx          # C1: Disease diagnosis form
│   │   │   │   └── [case_id]/page.tsx # C1: Result + AI diagnosis
│   │   │   ├── extension/
│   │   │   │   ├── page.tsx          # C2: Farmer profile selector
│   │   │   │   └── [farmer_id]/page.tsx # C2: Personalized advisory
│   │   │   ├── market/
│   │   │   │   ├── page.tsx          # C3: Market prices dashboard
│   │   │   │   └── advisory/page.tsx # C3: Sell-or-store decision
│   │   │   ├── climate/
│   │   │   │   ├── page.tsx          # C4: Location + crop selector
│   │   │   │   └── [location_id]/page.tsx # C4: Planting advice
│   │   │   └── credit/
│   │   │       ├── page.tsx          # C5: Credit application form
│   │   │       └── [applicant_id]/page.tsx # C5: Credit decision
│   │   └── components/
│   │       ├── ModuleCard.tsx
│   │       ├── AIResponseCard.tsx
│   │       ├── SeverityBadge.tsx
│   │       ├── MarketPriceTable.tsx
│   │       ├── ClimateChart.tsx
│   │       └── CreditScoreGauge.tsx
│   └── api/                          # Express backend
│       ├── src/
│       │   ├── routes/
│       │   │   ├── crop-health.ts    # C1 routes
│       │   │   ├── extension.ts      # C2 routes
│       │   │   ├── market.ts         # C3 routes
│       │   │   ├── climate.ts        # C4 routes
│       │   │   └── credit.ts         # C5 routes
│       │   ├── services/
│       │   │   ├── ai.service.ts     # Claude API — shared prompt engine
│       │   │   ├── crop.service.ts
│       │   │   ├── market.service.ts
│       │   │   ├── climate.service.ts
│       │   │   └── credit.service.ts
│       │   ├── prisma/
│       │   │   └── schema.prisma
│       │   └── seed/
│       │       ├── seed.ts           # Main seed runner
│       │       ├── c1_crop_health/   # Copy dataset files here
│       │       ├── c2_extension/
│       │       ├── c3_postharvest/
│       │       ├── c4_climate/
│       │       └── c5_finance/
│       └── package.json
├── packages/
│   └── types/                        # Shared TypeScript types
│       └── index.ts
├── data/                             # Raw dataset files
│   ├── c1_crop_health/
│   ├── c2_extension/
│   ├── c3_postharvest/
│   ├── c4_climate/
│   └── c5_finance/
├── pnpm-workspace.yaml
└── package.json
```

---

## 8. Database Models

```typescript
// C1 — Crop Disease Cases
model CropCase {
  id                  String @id @default(cuid())
  caseId              String @unique  // CH001, CH002...
  farmerId            String
  country             String
  state               String
  crop                String
  cropStage           String
  symptoms            String
  photoTags           String[]
  expectedDiagnosis   String
  severity            String
  recommendedAction   String
  localInputs         String[]
  languageTest        String
  confidenceFloor     Float
  aiDiagnosis         Json?   // Claude response stored here
}

// C2 — Farmer Profiles
model FarmerProfile {
  id                String @id @default(cuid())
  farmerId          String @unique
  name              String
  country           String
  language          String
  phoneType         String
  preferredChannel  String
  crops             String[]
  farmSizeHa        Float
  constraints       String
  goals             String
  aiAdvisory        Json?
}

// C3 — Market Prices
model MarketPrice {
  id              String @id @default(cuid())
  recordId        String @unique
  date            DateTime
  commodity       String
  marketName      String
  country         String
  state           String
  priceLocal      Float
  currency        String
  priceUsd        Float
  trend7Day       Float
  trend30Day      Float
  notes           String
}

// C3 — Storage Advisory
model StorageAdvisory {
  id            String @id @default(cuid())
  farmerId      String
  commodity     String
  quantityKg    Float
  shelfLifeDays Int
  risk          String
  recommendation String
  sellOrStore   String
  matchedBuyers Json
  aiDecision    Json?
}

// C4 — Climate Forecasts
model ClimateForecast {
  id                    String @id @default(cuid())
  locationId            String @unique
  country               String
  stateRegion           String
  crop                  String
  forecastOnset         String
  forecastConfidence    Float
  rainfallAnomalyPct    Float
  drySpellRisk          String
  floodRisk             String
  recommendedPlantDate  String
  adjustedVariety       String
  rationale             String
  aiAdvisory            Json?
}

// C5 — Credit Applications
model CreditApplication {
  id                    String @id @default(cuid())
  applicantId           String @unique
  name                  String
  country               String
  farmSizeHa            Float
  landTenure            String
  cooperativeMember     Boolean
  cooperativeRecord     String?
  mobileMoneyProvider   String?
  ndviLastSeason        Float?
  ndviChangeYoy         Float?
  requestedLoan         Float
  loanPurpose           String
  expectedDecision      String
  aiDecision            Json?
}
```

---

## 9. Build Plan

### Phase 1 — Setup (45 mins)
- [ ] Create GitHub repo: `agriintel-africa`
- [ ] Initialize pnpm monorepo with workspaces
- [ ] Setup Next.js 14 app with TypeScript + Tailwind
- [ ] Setup Express API with TypeScript
- [ ] Copy all 5 dataset folders into `/data`
- [ ] Setup Prisma schema with all 5 models
- [ ] Run migrations + write seed script to load all datasets
- [ ] Setup `.env` — `ANTHROPIC_API_KEY`, `DATABASE_URL`
- [ ] Test database seeded correctly

### Phase 2 — AI Service + Backend Routes (2 hours)
- [ ] Build `ai.service.ts` — shared Claude prompt engine with JSON parsing
- [ ] Build C1 route + service — feed case data to Claude, return diagnosis
- [ ] Build C3 route + service — market price arbitrage + sell-or-store decision
- [ ] Build C5 route + service — credit scoring with fairness rules
- [ ] Build C4 route + service — climate planting advisory
- [ ] Build C2 route + service — personalized farmer advisory
- [ ] Test all 5 routes with Postman — confirm Claude returns valid JSON

### Phase 3 — Frontend (2 hours)
- [ ] Build landing page — 5 module cards with descriptions
- [ ] Build C1 page — select farmer/case, show AI diagnosis + treatment steps
- [ ] Build C3 page — market prices table + sell-or-store advisory
- [ ] Build C5 page — credit application + AI decision with score gauge
- [ ] Build C4 page — location forecast + planting date recommendation
- [ ] Build C2 page — farmer profile + personalized advisory
- [ ] Connect all pages to backend API

### Phase 4 — Polish + Demo Prep (45 mins)
- [ ] Verify all 5 demo flows work end to end
- [ ] Prepare 5 demo scenarios (one per module)
- [ ] Deploy frontend to Vercel
- [ ] Deploy backend + database to Railway
- [ ] Confirm live demo works

---

## 10. Collaboration Split

| Module | Who |
|---|---|
| Monorepo setup, backend, AI service, C5 Credit, C1 Crop | **Naajih** |
| Frontend, UI components, C3 Market, C4 Climate pages | **Collaborator** |
| Seed script, shared types, deployment | **Both** |

---

## 11. Demo Script (For Judges)

**Opening line:**
> *"Every year, African farmers lose billions — not because they don't work hard, but because they don't have information. AgriIntel Africa changes that."*

**Demo flow:**

1. **C1 — Crop Health:** Select Farmer F1042 in Kano. Show maize streak virus diagnosis in Hausa + English. Show locally available treatment in Kano.

2. **C3 — Market:** Show tomato price map — Lagos ₦450 vs Kano ₦610. AI recommends routing to Kano. Show F3002 (Kaduna tomato farmer) — AI says do NOT go to Lagos, sell locally within 48 hours.

3. **C5 — Credit:** Show AC001 (Musa Ibrahim) — no bank history but 12/12 cooperative repayments + OPay mobile money. AI approves ₦150,000. Show AC003 (Ethiopia) — AI refers to human instead of auto-rejecting, because NDVI decline is climate-driven.

4. **C4 — Climate:** Show CL006 (Dodoma, Tanzania) — AI recommends fallowing 50% of land, not just changing variety. 40% crop failure risk if planted on traditional date.

5. **C2 — Extension:** Show Fatou Diallo (Senegal) — illiterate, basic phone, Wolof only. AI routes her advice as a voice call in Wolof, not a text message.

**Closing line:**
> *"AgriIntel Africa is not AI for the sake of AI. It is five specific problems, five datasets, and five AI modules that together put an agricultural expert in the pocket of every African farmer — regardless of language, phone type, or bank account."*

---

## 12. Why This Wins

| Criterion | How We Score |
|---|---|
| **Insight (30%)** | Deep understanding of African farming realities — fairness in credit, language barriers, perishable logistics, climate uncertainty |
| **Usefulness (25%)** | Real farmers, real problems, real data — every module solves a specific daily pain point |
| **Craft (20%)** | 5 modules, clean UI, multilingual, works on low-data connections |
| **Ambition (15%)** | 5 integrated AI modules, 6 countries, 9 languages, offline-capable |
| **Demo (10%)** | Live working software with real data — every demo scenario tells a story |

---

## 13. What Makes This Different From Every Other AgriTech Submission

Most teams will build a crop disease detector. That is one feature.

AgriIntel Africa is the complete intelligence layer for an African farmer's entire farming year:

- **Before planting** → Climate advisory tells you when and what to plant (C4)
- **During the season** → Extension services give you personalized advice (C2)
- **When something goes wrong** → Crop health diagnoses your disease in your language (C1)
- **After harvest** → Market intelligence tells you where to sell and when (C3)
- **When you need capital** → Credit scoring gets you a loan based on your real farm performance (C5)

No other team will have this breadth, this data, or this story.

---

*AgriIntel Africa — PRD v1.0 | Prepared by Naajih Siraj*
