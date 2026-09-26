/**
 * PackWise AI - Server Entry Point
 * Express REST API backend mounted with Vite dev server middlewares.
 */

import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { COMMODITIES, PACKAGING_MATERIALS } from './server/db/knowledgeBase.js';
import { analyzeFoodImage, findCommodityByName } from './server/services/foodAnalysisService.js';
import { analyzeJourney, geocodeLocation, fetchLocationWeather } from './server/services/journeyService.js';
import {
  evaluatePackagingOptions,
  simulateWhatIf,
  DEFAULT_WEIGHTS
} from './server/engine/decisionEngine.js';
import { RecommendationResponse, StorageParams, TransportType } from './src/types/packwise.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const isProd = process.env.NODE_ENV === 'production';

// Increase JSON payload limit for base64 camera image uploads
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// In-memory cache for generated recommendations (for What-If simulation and PDF export)
const recommendationStore = new Map<string, RecommendationResponse>();

// -------------------------------------------------------------
// REST API ROUTES
// -------------------------------------------------------------

/**
 * 1. GET /api/commodities - List all agricultural/food commodities
 */
app.get('/api/commodities', (req: Request, res: Response) => {
  res.json({
    success: true,
    count: COMMODITIES.length,
    commodities: COMMODITIES
  });
});

/**
 * 2. GET /api/packaging - List all packaging materials in knowledge base
 */
app.get('/api/packaging', (req: Request, res: Response) => {
  res.json({
    success: true,
    count: PACKAGING_MATERIALS.length,
    materials: PACKAGING_MATERIALS
  });
});

/**
 * 3. POST /api/food/analyze - Vision AI food identification & reference retrieval
 */
app.post('/api/food/analyze', async (req: Request, res: Response) => {
  try {
    const { imageBase64, suggestedName } = req.body;
    const result = await analyzeFoodImage(imageBase64, suggestedName);
    res.json({
      success: true,
      data: result
    });
  } catch (error: any) {
    console.error('Error analyzing food image:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to complete image analysis',
      error: error.message
    });
  }
});

/**
 * 4. GET /api/weather - Point weather query
 */
app.get('/api/weather', async (req: Request, res: Response) => {
  try {
    const cityName = (req.query.city as string) || 'Mumbai';
    const geo = await geocodeLocation(cityName);
    const weather = await fetchLocationWeather(geo);
    res.json({
      success: true,
      data: weather
    });
  } catch (error: any) {
    console.error('Error fetching weather:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve weather data',
      error: error.message
    });
  }
});

/**
 * 5. POST /api/journey/analyze - Route corridor environmental profile
 */
app.post('/api/journey/analyze', async (req: Request, res: Response) => {
  try {
    const { sourceCity, destCity, transportMode } = req.body;
    if (!sourceCity || !destCity) {
      return res.status(400).json({
        success: false,
        message: 'Both sourceCity and destCity are required.'
      });
    }

    const journey = await analyzeJourney(
      sourceCity,
      destCity,
      (transportMode as TransportType) || 'Road'
    );

    res.json({
      success: true,
      data: journey
    });
  } catch (error: any) {
    console.error('Error analyzing journey:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to calculate journey environmental profile',
      error: error.message
    });
  }
});

/**
 * 6. POST /api/recommendations - Core MCDA Decision Engine evaluation
 */
app.post('/api/recommendations', async (req: Request, res: Response) => {
  try {
    const { commodityId, commodityName, journey, storage, weights } = req.body;

    let commodity = COMMODITIES.find(c => c.id === Number(commodityId));
    if (!commodity && commodityName) {
      commodity = findCommodityByName(commodityName);
    }
    if (!commodity) {
      commodity = COMMODITIES[0]; // fallback to Tomato
    }

    if (!journey || !storage) {
      return res.status(400).json({
        success: false,
        message: 'journey and storage parameters are required.'
      });
    }

    const recommendation = evaluatePackagingOptions(
      commodity,
      journey,
      storage as StorageParams,
      weights || DEFAULT_WEIGHTS
    );

    // Save in store
    recommendationStore.set(recommendation.recommendationId, recommendation);

    res.json({
      success: true,
      data: recommendation
    });
  } catch (error: any) {
    console.error('Error computing recommendation:', error);
    res.status(500).json({
      success: false,
      message: 'Decision engine calculation failed',
      error: error.message
    });
  }
});

/**
 * 7. POST /api/recommendations/what-if - Re-evaluates under modified stresses
 */
app.post('/api/recommendations/what-if', (req: Request, res: Response) => {
  try {
    const {
      baselineRecommendationId,
      commodityId,
      simulatedTempC,
      simulatedHumidityPct,
      simulatedJourneyHours,
      simulatedStorageDays,
      storageType,
      transportType,
      targetShelfLifeDays
    } = req.body;

    let baseline = recommendationStore.get(baselineRecommendationId);

    // If baseline not in memory (e.g. fresh reload or demo), build default baseline
    if (!baseline) {
      const comm = COMMODITIES.find(c => c.id === Number(commodityId)) || COMMODITIES[0];
      const defaultStorage: StorageParams = {
        storageDurationDays: simulatedStorageDays || 5,
        storageType: (storageType as any) || 'Refrigerated',
        transportType: (transportType as any) || 'Road'
      };
      const defaultJourney = {
        source: {
          city: 'Mumbai',
          latitude: 19.076,
          longitude: 72.877,
          temperatureC: 28,
          relativeHumidityPct: 75,
          precipitationMm: 0,
          rainMm: 0,
          weatherCode: 1,
          weatherDescription: 'Clear',
          isLive: true
        },
        destination: {
          city: 'Pune',
          latitude: 18.520,
          longitude: 73.856,
          temperatureC: 25,
          relativeHumidityPct: 65,
          precipitationMm: 0,
          rainMm: 0,
          weatherCode: 1,
          weatherDescription: 'Clear',
          isLive: true
        },
        distanceKm: 150,
        estimatedDurationHours: 4.5,
        transportSpeedKmh: 48,
        transportMode: 'Road' as TransportType,
        temperatureRange: { min: 25, max: 28 },
        averageHumidityPct: 70,
        rainRisk: 'None' as const,
        environmentalRisk: 'LOW' as const,
        isLiveWeather: true,
        environmentalProfileSummary: 'Mumbai to Pune corridor',
        disclaimer: 'Baseline demo corridor'
      };
      baseline = evaluatePackagingOptions(comm, defaultJourney, defaultStorage);
      recommendationStore.set(baseline.recommendationId, baseline);
    }

    const whatIfResponse = simulateWhatIf(
      {
        baselineRecommendationId,
        commodityId: Number(commodityId),
        simulatedTempC: Number(simulatedTempC),
        simulatedHumidityPct: Number(simulatedHumidityPct),
        simulatedJourneyHours: Number(simulatedJourneyHours),
        simulatedStorageDays: Number(simulatedStorageDays),
        storageType: storageType || baseline.storage.storageType,
        transportType: transportType || baseline.storage.transportType,
        targetShelfLifeDays
      },
      baseline
    );

    res.json({
      success: true,
      data: whatIfResponse
    });
  } catch (error: any) {
    console.error('Error running What-If simulation:', error);
    res.status(500).json({
      success: false,
      message: 'What-If simulation failed',
      error: error.message
    });
  }
});

/**
 * 8. POST /api/reports/generate - Returns structured PDF report data
 */
app.post('/api/reports/generate', (req: Request, res: Response) => {
  const { recommendationId } = req.body;
  const recommendation = recommendationStore.get(recommendationId);

  if (!recommendation) {
    return res.status(404).json({
      success: false,
      message: 'Recommendation record not found'
    });
  }

  res.json({
    success: true,
    report: {
      title: 'PACKWISE AI - Packaging Recommendation Report',
      generatedAt: new Date().toISOString(),
      reportId: `REP-${recommendation.recommendationId}`,
      data: recommendation
    }
  });
});

// -------------------------------------------------------------
// VITE MIDDLEWARE / STATIC ASSETS
// -------------------------------------------------------------

async function startServer() {
  if (!isProd) {
    process.env.DISABLE_HMR = 'true';
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: false,
        watch: null
      },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[PackWise AI] Full-stack engine active at http://0.0.0.0:${PORT}`);
  });
}

startServer();
