/**
 * PackWise AI - Client REST API Client
 */

import {
  Commodity,
  FoodAnalysisResult,
  JourneyAnalysis,
  PackagingMaterial,
  RecommendationResponse,
  StorageParams,
  TransportType,
  WhatIfRequest,
  WhatIfResponse
} from '../types/packwise.js';

export async function fetchCommodities(): Promise<Commodity[]> {
  const res = await fetch('/api/commodities');
  const json = await res.json();
  return json.commodities || [];
}

export async function fetchPackagingMaterials(): Promise<PackagingMaterial[]> {
  const res = await fetch('/api/packaging');
  const json = await res.json();
  return json.materials || [];
}

export async function analyzeFood(
  imageBase64?: string,
  suggestedName?: string
): Promise<FoodAnalysisResult> {
  const res = await fetch('/api/food/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ imageBase64, suggestedName })
  });

  const json = await res.json();
  if (!json.success) {
    throw new Error(json.message || 'Failed to analyze food produce');
  }
  return json.data;
}

export async function analyzeJourney(
  sourceCity: string,
  destCity: string,
  transportMode: TransportType = 'Road'
): Promise<JourneyAnalysis> {
  const res = await fetch('/api/journey/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sourceCity, destCity, transportMode })
  });

  const json = await res.json();
  if (!json.success) {
    throw new Error(json.message || 'Failed to calculate journey environmental profile');
  }
  return json.data;
}

export async function generateRecommendation(
  commodityId: number,
  journey: JourneyAnalysis,
  storage: StorageParams
): Promise<RecommendationResponse> {
  const res = await fetch('/api/recommendations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ commodityId, journey, storage })
  });

  const json = await res.json();
  if (!json.success) {
    throw new Error(json.message || 'Recommendation calculation failed');
  }
  return json.data;
}

export async function runWhatIf(req: WhatIfRequest): Promise<WhatIfResponse> {
  const res = await fetch('/api/recommendations/what-if', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req)
  });

  const json = await res.json();
  if (!json.success) {
    throw new Error(json.message || 'What-If calculation failed');
  }
  return json.data;
}
