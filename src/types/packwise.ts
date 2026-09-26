/**
 * PackWise AI - Core Domain Types & DTOs
 * Intelligent Food Packaging Material Recommendation System
 */

export type PerishabilityLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'ULTRA_HIGH';
export type SensitivityLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL' | 'VERY_HIGH';
export type RespirationLevel = 'VERY_LOW' | 'LOW' | 'MODERATE' | 'HIGH' | 'EXTREMELY_HIGH';
export type StorageType = 'Ambient' | 'Refrigerated' | 'Frozen' | 'Controlled Environment';
export type TransportType = 'Road' | 'Rail' | 'Air' | 'Other';
export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';
export type RainRisk = 'None' | 'Low' | 'Moderate' | 'High';

export interface FoodProperty {
  commodityId: number;
  typicalPhMin: number;
  typicalPhMax: number;
  moistureContentPct: number;
  moistureSensitivity: SensitivityLevel;
  respirationRate: RespirationLevel;
  mechanicalSensitivity: SensitivityLevel;
  chillingSensitivity: boolean;
  optimalTempMinC: number;
  optimalTempMaxC: number;
  optimalRhMinPct: number;
  optimalRhMaxPct: number;
  typicalShelfLifeDays: number;
  ethyleneProduction: 'VERY_LOW' | 'LOW' | 'MEDIUM' | 'HIGH';
  keyDeteriorationFactors: string;
  packagingRequirements: string;
}

export interface Commodity {
  id: number;
  name: string;
  slug: string;
  category: string;
  perishability: PerishabilityLevel;
  description: string;
  properties: FoodProperty;
  sampleImageUrl?: string;
}

export interface PackagingMaterial {
  id: number;
  name: string;
  slug: string;
  category: string;
  moistureBarrierRating: number; // 0-100
  oxygenBarrierRating: number;   // 0-100
  mechanicalProtectionRating: number; // 0-100
  thermalInsulationRating: number;    // 0-100
  minTempC: number;
  maxTempC: number;
  estimatedCostInrPerUnit: number;
  recyclabilityRating: number;  // 0-100
  biodegradabilityRating: number; // 0-100
  sustainabilityScore: number;  // 0-100
  foodGradeCertified: boolean;
  compatibleCategories: string[];
  primaryAdvantages: string;
  primaryLimitations: string;
  specifications: string;
}

export interface FoodAnalysisResult {
  detectedCommodity: string;
  category: string;
  confidence: number; // 0-100
  visibleCharacteristics: string[];
  source: 'ai_vision' | 'preset_demo' | 'manual_fallback' | 'fallback';
  isLowConfidence: boolean;
  commodityData: Commodity;
  userImagePreview?: string;
  scientificHonestyNotice: string;
}

export interface WeatherCondition {
  city: string;
  latitude: number;
  longitude: number;
  temperatureC: number;
  relativeHumidityPct: number;
  precipitationMm: number;
  rainMm: number;
  weatherCode: number;
  weatherDescription: string;
  isLive: boolean;
}

export interface JourneyAnalysis {
  source: WeatherCondition;
  destination: WeatherCondition;
  distanceKm: number;
  estimatedDurationHours: number;
  transportSpeedKmh: number;
  transportMode: TransportType;
  temperatureRange: {
    min: number;
    max: number;
  };
  averageHumidityPct: number;
  rainRisk: RainRisk;
  environmentalRisk: RiskLevel;
  isLiveWeather: boolean;
  environmentalProfileSummary: string;
  disclaimer: string;
}

export interface StorageParams {
  storageDurationDays: number;
  storageType: StorageType;
  targetShelfLifeDays?: number;
  transportType: TransportType;
}

export interface DecisionWeights {
  compatibility: number;       // default: 0.30
  protection: number;          // default: 0.25
  conditionSuitability: number;// default: 0.20
  cost: number;                // default: 0.10
  sustainability: number;      // default: 0.15
}

export interface ReasoningFactors {
  positive: string[];
  negative: string[];
}

export interface ScoredPackagingOption {
  material: PackagingMaterial;
  rank: number;
  compatibilityScore: number;
  protectionScore: number;
  conditionSuitabilityScore: number;
  costScore: number;
  sustainabilityScore: number;
  overallScore: number;
  expectedShelfLifeDays: number;
  estimatedCostInr: number;
  advantages: string[];
  limitations: string[];
  reasoningFactors: ReasoningFactors;
}

export interface RiskIndicators {
  temperatureRisk: RiskLevel;
  humidityRisk: RiskLevel;
  transportRisk: RiskLevel;
  shelfLifeRisk: RiskLevel;
}

export interface RecommendationResponse {
  recommendationId: string;
  commodity: Commodity;
  journey: JourneyAnalysis;
  storage: StorageParams;
  bestOption: ScoredPackagingOption;
  topAlternatives: ScoredPackagingOption[];
  allEvaluated: ScoredPackagingOption[];
  whyExplanation: string;
  riskIndicators: RiskIndicators;
  calculationTimestamp: string;
  weightsUsed: DecisionWeights;
  whatIfApplied?: boolean;
}

export interface WhatIfRequest {
  baselineRecommendationId: string;
  commodityId: number;
  simulatedTempC: number;
  simulatedHumidityPct: number;
  simulatedJourneyHours: number;
  simulatedStorageDays: number;
  storageType: StorageType;
  transportType: TransportType;
  targetShelfLifeDays?: number;
}

export interface WhatIfResponse {
  before: ScoredPackagingOption;
  after: ScoredPackagingOption;
  shiftExplanation: string;
  updatedRiskIndicators: RiskIndicators;
  newTopAlternatives: ScoredPackagingOption[];
  simulatedConditions: {
    temperatureC: number;
    humidityPct: number;
    journeyHours: number;
    storageDays: number;
  };
}
