# PACKWISE AI
### Intelligent Food Packaging Material Recommendation System
**Smart India Hackathon Prototype**

PackWise AI is an intelligent, condition-aware decision support platform that evaluates agricultural commodities, transit geography, synoptic meteorological forecasts, and storage requirements to recommend optimal, cost-effective, and sustainable food packaging materials.

---

## 1. Project Overview
Post-harvest food spoilage and packaging mismatch cause massive agricultural losses and excessive plastic waste across global supply chains. Existing systems either rely on static packaging lookups or generic AI chatbots that lack physical-chemical grounding.

PackWise AI introduces a **grounded hybrid decision pipeline**:
1. **Visual Commodity Recognition**: Identifies the agricultural cultivar from photos without making scientifically dishonest claims about direct chemical sensor readings.
2. **Food Knowledge Base Linkage**: Retrieves empirical physiological baseline standards (respiration rate, moisture sensitivity, optimal temperature, chilling injury threshold, and typical shelf life).
3. **Dynamic Open-Meteo Meteorological Geocoding**: Calculates the ambient thermal corridor, precipitation, and relative humidity between origin and destination.
4. **Multi-Criteria Decision Analysis (MCDA)**: Evaluates 12 engineering packaging materials across Compatibility, Protection, Condition Suitability, Unit Cost, and Circular Sustainability.
5. **Explainability & What-If Stress Simulation**: Explains concrete decision drivers and dynamically re-evaluates recommendations under climate shifts.
6. **Downloadable PDF Dossier**: Produces verifiable vector reports for farmers, packaging engineers, and supply chain managers.

---

## 2. System Architecture

```text
                        +----------------------------+
                        |      USER / CLIENT         |
                        | (React + Vite + Tailwind)  |
                        +--------------+-------------+
                                       |
                   HTTP POST /api/food/analyze (Image / Sample)
                                       v
                        +----------------------------+
                        |   Food Analysis Service    |
                        |   - Gemini 3.8 Flash Vision|
                        |   - Deterministic Fallback |
                        +--------------+-------------+
                                       |
                     Retrieved Commodity Identifier
                                       v
                        +----------------------------+
                        |    Food Knowledge Base     |
                        |  (12 Empirical Crops / DB) |
                        +--------------+-------------+
                                       |
                 Origin & Destination (e.g. Mumbai -> Pune)
                                       v
                        +----------------------------+
                        |   Journey Weather Service  |
                        |  - Open-Meteo Geocoding    |
                        |  - Open-Meteo Synoptic API |
                        |  - Haversine Transit Model |
                        +--------------+-------------+
                                       |
                    Corridor Thermal & Humidity Envelope
                                       v
                        +----------------------------+
                        |    MCDA Decision Engine    |
                        | - Incompatibility Gate     |
                        | - Compatibility Score (30%)|
                        | - Protection Score (25%)   |
                        | - Condition Fit (20%)      |
                        | - Unit Cost Score (10%)    |
                        | - Sustainability (15%)     |
                        +--------------+-------------+
                                       |
                        +----------------------------+
                        |    PackWise Recommendation |
                        |  - Top #1 Optimal Material |
                        |  - Top 2 Ranked Alt Options|
                        |  - Grounded Explanations   |
                        |  - What-If Simulation      |
                        |  - Downloadable PDF Report |
                        +----------------------------+
```

---

## 3. Core Features
- **Instant SIH Demo Mode**: One-click execution of a validated Tomato route (Mumbai → Pune) with immediate results.
- **Hardware Camera & File Upload**: Real HTML5 webcam stream with shutter capture and local image drag-and-drop.
- **Scientific Honesty Boundary**: Separates visual cultivar classification from reference chemistry (pH, cellular moisture, respiration) to maintain scientific credibility.
- **Dynamic Weather Geocoding**: Queries Open-Meteo REST APIs for real-time temperature, precipitation, and relative humidity across any global city.
- **MCDA Scoring Engine**: Evaluates 12 distinct packaging materials using configurable multi-criteria weights.
- **Natural Language Decision Explainability**: Synthesizes concrete rationale and isolates trade-offs directly from calculated scores.
- **What-If Climate Simulation**: Interactive sliders for temperature, humidity, transit duration, and storage to observe dynamic score shifts.
- **Vector PDF & Print Dossier**: Generates multi-page formatted engineering reports using `jspdf`.
- **Relational MySQL Database Ready**: Complete DDL (`schema.sql`) and seed data (`data.sql`) with Docker support.

---

## 4. Tech Stack

### Frontend
- **React 19** with **TypeScript**
- **Vite** build tooling
- **Tailwind CSS v4**
- **Lucide React** icons
- **jsPDF** vector PDF generation
- **canvas-confetti**

### Backend
- **Express.js (Node / TypeScript)** monolith mounted with Vite dev middleware
- **@google/genai** SDK (`gemini-3.8-flash`) for server-side visual commodity identification
- **Open-Meteo REST APIs** (Geocoding & Forecast)

### Relational Database
- **MySQL 8.0+** relational schema with entities: `commodities`, `food_properties`, `packaging_materials`, `compatibility_rules`, and `recommendations`.

---

## 5. Setup Instructions

### Prerequisites
- Node.js 20+ installed
- (Optional) Docker & Docker Compose
- (Optional) Gemini API Key

### Local Installation
```bash
# 1. Install dependencies
npm install

# 2. Configure environment variables (optional)
cp .env.example .env

# 3. Start development server (serves frontend + backend on port 3000)
npm run dev
```
Navigate to `http://localhost:3000`.

### Docker Deployment
```bash
# Build and run containerized application with MySQL
docker-compose up --build
```

---

## 6. Environment Variables
Create a `.env` file in the root directory:
```env
# Port for the Express server
PORT=3000

# Google Gemini API Key for vision commodity recognition (optional - fallback included)
GEMINI_API_KEY="YOUR_GEMINI_API_KEY"

# Optional MySQL Configuration (when connecting to external database)
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_DATABASE=packwise_db
MYSQL_USER=packwise_user
MYSQL_PASSWORD=packwise_pass
```

---

## 7. Database Setup
The repository includes production-ready SQL scripts:
- `schema.sql`: Full MySQL table DDL, foreign keys, cascades, and constraints.
- `data.sql`: Seed data for 12 commodities, detailed physical food properties, 12 packaging materials, and compatibility rules.

To load manually into MySQL:
```bash
mysql -u root -p < schema.sql
mysql -u root -p < data.sql
```

---

## 8. REST API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/food/analyze` | AI vision recognition & food reference retrieval |
| `GET` | `/api/commodities` | List all 12 validated food commodities |
| `GET` | `/api/packaging` | List all 12 packaging materials & ratings |
| `POST` | `/api/journey/analyze` | Open-Meteo geocoding & route weather corridor |
| `GET` | `/api/weather` | Point weather query for any city |
| `POST` | `/api/recommendations` | MCDA Decision Engine evaluation & ranking |
| `POST` | `/api/recommendations/what-if`| Dynamic re-evaluation under simulated climate stress |
| `POST` | `/api/reports/generate` | Generates structured recommendation dossier |

---

## 9. How Recommendation Scoring Works
Every packaging material is evaluated across five weighted axes:

$$\text{Overall Score} = (0.30 \times C) + (0.25 \times P) + (0.20 \times S_{\text{cond}}) + (0.10 \times S_{\text{cost}}) + (0.15 \times S_{\text{sust}})$$

1. **Incompatibility Gate**: Physical incompatibilities (e.g., liquid milk in unlined paperboard, vacuum packaging on soft fruits) receive an immediate disqualification.
2. **Compatibility Score ($C$)**: Evaluates respiration dynamics, moisture sensitivity versus material barrier, and pH contact inertness.
3. **Protection Score ($P$)**: Evaluates mechanical burst factor, compression resistance, and road transit shock absorption.
4. **Condition Suitability ($S_{\text{cond}}$)**: Evaluates packaging performance within the corridor thermal range ($\min T$ to $\max T$) and ambient rain risk.
5. **Cost Score ($S_{\text{cost}}$)**: Evaluates material unit cost in ₹ INR per unit.
6. **Sustainability Score ($S_{\text{sust}}$)**: Evaluates biodegradability (EN 13432) and closed-loop recyclability index.

---

## 10. How Weather Integration Works
1. **Geocoding**: User inputs origin (e.g. `Mumbai`) and destination (e.g. `Pune`). The system queries the Open-Meteo Geocoding API to resolve coordinates.
2. **Synoptic Forecast**: Queries Open-Meteo for `temperature_2m`, `precipitation`, `rain`, and `relative_humidity_2m`.
3. **Corridor Profile**: Computes the thermal window ($\min T$ to $\max T$), mean relative humidity, rain risk index (`None`, `Low`, `Moderate`, `High`), and overall transit environmental risk.
4. **Fallback Mechanism**: If the meteorological API is unreachable or rate-limited, the system falls back to stored regional agro-climatic corridor benchmarks without crashing.

---

## 11. How AI Image Analysis Works
- **Model**: Uses `@google/genai` with `gemini-3.8-flash`.
- **System Prompting**: Instructs the model to inspect morphological contours, color pigmentation, and fruit class.
- **Scientific Honesty Guardrail**: The system never claims an optical camera directly measures pH, cellular water content, or respiration rate. Reference physical properties are retrieved from empirical food-science benchmarks.
- **Deterministic Fallback**: If no API key is provided or network issues occur, the system utilizes deterministic morphological heuristics to ensure 100% demo uptime.

---

## 12. How to Run Demo Mode
Click the prominent **[Try Demo]** button in the header or hero banner.
The system will automatically:
1. Load a high-resolution sample image of **Tomato**.
2. Identify the cultivar as **Fresh Produce** (96% confidence).
3. Populate empirical properties (pH 4.3–4.9, 94% moisture, high respiration).
4. Fetch live weather for **Mumbai → Pune** (150 km, ~4.5h transit).
5. Run the MCDA engine and recommend **Corrugated Fiberboard** (Score 91/100).
6. Enable What-If simulation and instant PDF report download.

---

## 13. How to Generate PDF Reports
1. Run an analysis or launch Demo Mode.
2. Navigate to the Recommendation Dashboard.
3. Click **[Download Report (PDF)]**.
4. A multi-page engineering document will be downloaded containing food benchmarks, transit weather, scoring breakdown, alternative comparisons, and scientific disclaimers.
5. Alternatively, click **[View Full Report]** to view and print the dossier directly via browser printing.
