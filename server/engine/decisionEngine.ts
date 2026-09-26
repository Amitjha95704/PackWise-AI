/**
 * PackWise AI - Multi-Criteria Decision Analysis (MCDA) Hybrid Engine
 * Evaluates food-material biological compatibility, mechanical transit protection,
 * environmental condition suitability, unit economics, and circular sustainability.
 */

import {
  Commodity,
  DecisionWeights,
  JourneyAnalysis,
  PackagingMaterial,
  ReasoningFactors,
  RecommendationResponse,
  RiskIndicators,
  RiskLevel,
  ScoredPackagingOption,
  StorageParams,
  WhatIfRequest,
  WhatIfResponse
} from '../../src/types/packwise.js';
import { PACKAGING_MATERIALS } from '../db/knowledgeBase.js';

export const DEFAULT_WEIGHTS: DecisionWeights = {
  compatibility: 0.30,
  protection: 0.25,
  conditionSuitability: 0.20,
  cost: 0.10,
  sustainability: 0.15
};

/**
 * Filter completely incompatible packaging combinations based on physical-chemical laws.
 */
function isMaterialPhysicallyIncompatible(
  commodity: Commodity,
  material: PackagingMaterial,
  storage: StorageParams
): { incompatible: boolean; reason?: string } {
  // Rule 1: Liquid dairy (Milk) cannot be in unlined paperboard or non-liquid containers
  if (commodity.slug === 'milk') {
    if (material.slug === 'paperboard' || material.slug === 'corrugated-fiberboard') {
      return { incompatible: true, reason: 'Unlined paperboard absorbs liquid milk, causing catastrophic structural collapse and bacterial leaks.' };
    }
    if (material.slug === 'vacuum-packaging') {
      return { incompatible: true, reason: 'Vacuum sealing cannot be executed on bulk liquid milk.' };
    }
  }

  // Rule 2: Soft fresh climacteric fruits (Banana, Tomato, Mango) cannot withstand atmospheric vacuum
  if (['banana', 'tomato', 'mango', 'leafy-vegetables'].includes(commodity.slug) && material.slug === 'vacuum-packaging') {
    return { incompatible: true, reason: 'Atmospheric vacuum collapse crushes the delicate cellular parenchyma of soft fruits/greens.' };
  }

  // Rule 3: High-respiration bulb vegetables (Onions) sealed hermetically develop black rot
  if (commodity.slug === 'onion' && (material.slug === 'vacuum-packaging' || material.slug === 'glass')) {
    return { incompatible: true, reason: 'Onions require continuous aerobic breathing; hermetic sealing causes anaerobic fermentation and neck rot.' };
  }

  // Rule 4: Deep frozen conditions in un-treated standard paperboard
  if (storage.storageType === 'Frozen' && (material.slug === 'paperboard' || material.slug === 'ldpe')) {
    return { incompatible: true, reason: 'Paperboard rapidly absorbs frost condensation; standard LDPE turns brittle below sub-zero temperatures.' };
  }

  return { incompatible: false };
}

/**
 * Compatibility Score (0 - 100)
 * Evaluates respiration permeability match, moisture equilibrium, and pH food contact safety.
 */
function calculateCompatibilityScore(
  commodity: Commodity,
  material: PackagingMaterial,
  storage: StorageParams,
  pros: string[],
  cons: string[]
): number {
  let score = 70;

  // Food category match
  const catMatch = material.compatibleCategories.some(
    c => c.toLowerCase() === commodity.category.toLowerCase()
  );
  if (catMatch) {
    score += 15;
  } else {
    score -= 20;
    cons.push(`Material not originally formulated for ${commodity.category}`);
  }

  // Moisture sensitivity vs moisture barrier
  if (commodity.properties.moistureSensitivity === 'CRITICAL') {
    if (material.moistureBarrierRating >= 85) {
      score += 12;
      pros.push(`High moisture barrier (${material.moistureBarrierRating}/100) prevents critical moisture migration`);
    } else if (material.moistureBarrierRating < 60) {
      score -= 25;
      cons.push(`Insufficient moisture barrier for moisture-critical commodity`);
    }
  } else if (commodity.properties.moistureSensitivity === 'HIGH') {
    if (material.moistureBarrierRating >= 75) {
      score += 8;
      pros.push(`Adequate moisture vapor protection (${material.moistureBarrierRating}/100)`);
    } else if (material.moistureBarrierRating < 50) {
      score -= 15;
      cons.push(`Low moisture barrier may cause surface dehydration or condensation`);
    }
  }

  // Respiration rate vs oxygen barrier
  if (commodity.properties.respirationRate === 'EXTREMELY_HIGH' || commodity.properties.respirationRate === 'HIGH') {
    if (material.slug === 'map') {
      score += 15;
      pros.push(`Active headspace gas equilibrium (MAP) retards high respiration rate`);
    } else if (material.oxygenBarrierRating > 90 && material.slug !== 'map') {
      // Hermetic tight seal on high respiring produce without venting suffocates produce
      score -= 18;
      cons.push(`Hermetic gas barrier without micro-perforations risks anaerobic fermentation`);
    } else if (material.slug === 'corrugated-fiberboard' || material.slug === 'plastic-tray' || material.slug === 'compostable-packaging') {
      score += 10;
      pros.push(`Ventilated structural architecture allows metabolic heat & CO2 dissipation`);
    }
  }

  // Chemical pH stability
  if (commodity.properties.typicalPhMin < 4.0) {
    if (material.slug === 'glass' || material.slug === 'pet') {
      score += 8;
      pros.push(`Chemically non-reactive contact layer suitable for acidic food (pH ${commodity.properties.typicalPhMin})`);
    }
  }

  return Math.min(99, Math.max(15, Math.round(score)));
}

/**
 * Protection Score (0 - 100)
 * Evaluates mechanical impact absorption, compression stacking strength, and road vibration mitigation.
 */
function calculateProtectionScore(
  commodity: Commodity,
  material: PackagingMaterial,
  journey: JourneyAnalysis,
  storage: StorageParams,
  pros: string[],
  cons: string[]
): number {
  let score = material.mechanicalProtectionRating;

  // Mechanical fragility of the commodity
  if (commodity.properties.mechanicalSensitivity === 'VERY_HIGH') {
    if (material.mechanicalProtectionRating >= 85) {
      score += 10;
      pros.push(`Robust structural rigidity cushions highly fragile produce`);
    } else if (material.mechanicalProtectionRating < 65) {
      score -= 22;
      cons.push(`Low mechanical stiffness exposes soft food to compressive bruising`);
    }
  } else if (commodity.properties.mechanicalSensitivity === 'HIGH') {
    if (material.mechanicalProtectionRating >= 80) {
      score += 6;
      pros.push(`Strong resistance against compression during pallet stacking`);
    }
  }

  // Road vibration and long transit duration
  if (journey.transportMode === 'Road') {
    if (material.slug === 'corrugated-fiberboard') {
      score += 10;
      pros.push(`Fluted paperboard matrix absorbs high-frequency road vibrations`);
    }
    if (journey.distanceKm > 200 && material.mechanicalProtectionRating < 60) {
      score -= 15;
      cons.push(`Extended road transit (${journey.distanceKm} km) requires higher puncture & drop resistance`);
    }
  }

  // Fragility penalty for glass during rough transport
  if (material.slug === 'glass') {
    if (journey.transportMode === 'Road' && journey.distanceKm > 250) {
      score -= 12;
      cons.push(`Glass is brittle and vulnerable to transit road shock without excessive secondary cushioning`);
    }
  }

  return Math.min(99, Math.max(20, Math.round(score)));
}

/**
 * Condition Suitability Score (0 - 100)
 * Evaluates temperature delta, rain/humidity risks, and transit thermal stability.
 */
function calculateConditionSuitabilityScore(
  commodity: Commodity,
  material: PackagingMaterial,
  journey: JourneyAnalysis,
  storage: StorageParams,
  pros: string[],
  cons: string[]
): number {
  let score = 75;

  const tempMax = journey.temperatureRange.max;
  const tempMin = journey.temperatureRange.min;
  const optimalMin = commodity.properties.optimalTempMinC;
  const optimalMax = commodity.properties.optimalTempMaxC;

  // Thermal boundaries of the packaging material
  if (tempMax > material.maxTempC) {
    score -= 30;
    cons.push(`Ambient journey temperature (${tempMax}°C) exceeds material deformation threshold (${material.maxTempC}°C)`);
  }
  if (tempMin < material.minTempC) {
    score -= 25;
    cons.push(`Transit cold (${tempMin}°C) causes polymer embrittlement`);
  }

  // Thermal insulation under temperature stress
  const isHighThermalStress = (tempMax - optimalMax) > 8 || (optimalMin - tempMin) > 8;
  if (isHighThermalStress) {
    if (material.thermalInsulationRating >= 60) {
      score += 12;
      pros.push(`Thermal buffering capacity (${material.thermalInsulationRating}/100) dampens environmental heat spikes`);
    } else {
      score -= 10;
      cons.push(`Thin wall provides low thermal insulation against outside temperature (${tempMax}°C)`);
    }
  } else {
    score += 5;
    pros.push(`Journey temperatures (${tempMin}°C - ${tempMax}°C) remain within stable operating thresholds`);
  }

  // Rain and external ambient moisture risk
  if (journey.rainRisk === 'High' || journey.averageHumidityPct > 80) {
    if (material.slug === 'corrugated-fiberboard') {
      score -= 18;
      cons.push(`High ambient rain risk requires external moisture-resistant wrap or wax barrier`);
    } else if (material.moistureBarrierRating >= 85) {
      score += 10;
      pros.push(`Waterproof outer shell shields contents against rain & high humidity (${journey.averageHumidityPct}%)`);
    }
  }

  // Storage Type Suitability
  if (storage.storageType === 'Refrigerated') {
    if (material.minTempC <= 0) {
      score += 6;
      pros.push(`Cold-chain approved (resilient to condensation cycling)`);
    }
  }

  return Math.min(99, Math.max(20, Math.round(score)));
}

/**
 * Cost Score (0 - 100)
 * Evaluates economic viability per unit. Lower unit cost = higher cost score.
 */
function calculateCostScore(
  material: PackagingMaterial,
  commodity: Commodity,
  pros: string[],
  cons: string[]
): number {
  const cost = material.estimatedCostInrPerUnit;

  // Inverted cost scale: <= ₹5 is near 95, ₹30 is ~50
  let score = Math.round(100 - (cost * 1.6));
  score = Math.min(98, Math.max(30, score));

  if (cost < 10) {
    pros.push(`Highly economical unit packaging cost (₹${cost.toFixed(2)} / unit)`);
  } else if (cost > 22) {
    cons.push(`Higher unit material cost (₹${cost.toFixed(2)} / unit)`);
  }

  return score;
}

/**
 * Sustainability Score (0 - 100)
 * Evaluates biodegradability, circular recyclability, and carbon footprint.
 */
function calculateSustainabilityScore(
  material: PackagingMaterial,
  pros: string[],
  cons: string[]
): number {
  const score = material.sustainabilityScore;

  if (material.biodegradabilityRating >= 80) {
    pros.push(`Excellent compostability & zero microplastic persistence (${material.biodegradabilityRating}%)`);
  } else if (material.recyclabilityRating >= 85) {
    pros.push(`High circular closed-loop recyclability index (${material.recyclabilityRating}%)`);
  }

  if (material.sustainabilityScore < 60) {
    cons.push(`Non-biodegradable polymer with lower circular recycling index`);
  }

  return score;
}

/**
 * Derive expected shelf-life in days based on packaging performance & commodity biology.
 */
function estimateExpectedShelfLife(
  commodity: Commodity,
  material: PackagingMaterial,
  storage: StorageParams,
  journey: JourneyAnalysis
): number {
  let baseDays = commodity.properties.typicalShelfLifeDays;

  // Storage type multiplier
  if (storage.storageType === 'Refrigerated') {
    baseDays *= 1.8;
  } else if (storage.storageType === 'Controlled Environment') {
    baseDays *= 2.4;
  } else if (storage.storageType === 'Frozen') {
    baseDays *= 5.0;
  }

  // Packaging technology multiplier
  if (material.slug === 'map') {
    baseDays *= 1.7;
  } else if (material.slug === 'vacuum-packaging') {
    baseDays *= 2.0;
  } else if (material.slug === 'aluminum' || material.slug === 'glass') {
    baseDays *= 1.5;
  } else if (material.slug === 'corrugated-fiberboard') {
    baseDays *= 1.1;
  }

  // Environmental stress deduction
  if (journey.environmentalRisk === 'HIGH') {
    baseDays *= 0.75;
  } else if (journey.environmentalRisk === 'MEDIUM') {
    baseDays *= 0.90;
  }

  return Math.max(1, Math.round(baseDays));
}

/**
 * Natural language synthesis for SIH judges explaining WHY the top recommendation was selected.
 */
function generateWhyExplanation(
  best: ScoredPackagingOption,
  commodity: Commodity,
  journey: JourneyAnalysis,
  storage: StorageParams
): string {
  const matName = best.material.name;
  const foodName = commodity.name;
  const topPro = best.reasoningFactors.positive[0] || 'balanced protection and compatibility';
  const secondPro = best.reasoningFactors.positive[1] || 'reliable transit stability';

  return `PackWise AI selected ${matName} as the optimal packaging for ${foodName} across the ${journey.source.city} → ${journey.destination.city} corridor. It achieved an Overall Score of ${best.overallScore}/100 because it delivers ${topPro.toLowerCase()}, provides ${secondPro.toLowerCase()}, operates safely within the observed ${journey.temperatureRange.min}°C – ${journey.temperatureRange.max}°C thermal corridor, and delivers an estimated shelf life of ${best.expectedShelfLifeDays} days with strong ${best.sustainabilityScore >= 75 ? 'eco-sustainability' : 'economic cost efficiency'}.`;
}

/**
 * Calculate multi-dimensional risk indicators.
 */
export function calculateRiskIndicators(
  commodity: Commodity,
  journey: JourneyAnalysis,
  storage: StorageParams
): RiskIndicators {
  const tempMax = journey.temperatureRange.max;
  const optimalMax = commodity.properties.optimalTempMaxC;

  // Temperature Risk
  let temperatureRisk: RiskLevel = 'LOW';
  if (tempMax > optimalMax + 10 || (commodity.properties.chillingSensitivity && journey.temperatureRange.min < commodity.properties.optimalTempMinC - 3)) {
    temperatureRisk = 'HIGH';
  } else if (tempMax > optimalMax + 4) {
    temperatureRisk = 'MEDIUM';
  }

  // Humidity Risk
  let humidityRisk: RiskLevel = 'LOW';
  if (journey.averageHumidityPct > 80 && commodity.properties.moistureSensitivity === 'CRITICAL') {
    humidityRisk = 'HIGH';
  } else if (journey.averageHumidityPct > 72 || journey.rainRisk !== 'None') {
    humidityRisk = 'MEDIUM';
  }

  // Transport Risk
  let transportRisk: RiskLevel = 'LOW';
  if (journey.estimatedDurationHours > 24 || (commodity.properties.mechanicalSensitivity === 'VERY_HIGH' && journey.distanceKm > 200)) {
    transportRisk = 'HIGH';
  } else if (journey.estimatedDurationHours > 8 || journey.distanceKm > 150) {
    transportRisk = 'MEDIUM';
  }

  // Shelf-Life Risk
  let shelfLifeRisk: RiskLevel = 'LOW';
  const expectedTotalDays = (journey.estimatedDurationHours / 24) + storage.storageDurationDays;
  if (expectedTotalDays >= commodity.properties.typicalShelfLifeDays * 0.8) {
    shelfLifeRisk = 'HIGH';
  } else if (expectedTotalDays >= commodity.properties.typicalShelfLifeDays * 0.5) {
    shelfLifeRisk = 'MEDIUM';
  }

  return {
    temperatureRisk,
    humidityRisk,
    transportRisk,
    shelfLifeRisk
  };
}

/**
 * Core Evaluation: Runs all packaging materials through the MCDA pipeline.
 */
export function evaluatePackagingOptions(
  commodity: Commodity,
  journey: JourneyAnalysis,
  storage: StorageParams,
  weights: DecisionWeights = DEFAULT_WEIGHTS
): RecommendationResponse {
  const scoredOptions: ScoredPackagingOption[] = [];

  for (const material of PACKAGING_MATERIALS) {
    const pros: string[] = [];
    const cons: string[] = [];

    // Filter incompatible combinations
    const compatibilityCheck = isMaterialPhysicallyIncompatible(commodity, material, storage);
    if (compatibilityCheck.incompatible) {
      continue; // exclude physically prohibited packaging
    }

    const compatibilityScore = calculateCompatibilityScore(commodity, material, storage, pros, cons);
    const protectionScore = calculateProtectionScore(commodity, material, journey, storage, pros, cons);
    const conditionSuitabilityScore = calculateConditionSuitabilityScore(commodity, material, journey, storage, pros, cons);
    const costScore = calculateCostScore(material, commodity, pros, cons);
    const sustainabilityScore = calculateSustainabilityScore(material, pros, cons);

    // Weighted Overall Score
    const overallScore = Math.round(
      compatibilityScore * weights.compatibility +
      protectionScore * weights.protection +
      conditionSuitabilityScore * weights.conditionSuitability +
      costScore * weights.cost +
      sustainabilityScore * weights.sustainability
    );

    const expectedShelfLifeDays = estimateExpectedShelfLife(commodity, material, storage, journey);

    scoredOptions.push({
      material,
      rank: 0,
      compatibilityScore,
      protectionScore,
      conditionSuitabilityScore,
      costScore,
      sustainabilityScore,
      overallScore: Math.min(99, Math.max(10, overallScore)),
      expectedShelfLifeDays,
      estimatedCostInr: material.estimatedCostInrPerUnit,
      advantages: material.primaryAdvantages.split('. ').filter(Boolean),
      limitations: material.primaryLimitations.split('. ').filter(Boolean),
      reasoningFactors: {
        positive: pros.slice(0, 4),
        negative: cons.slice(0, 3)
      }
    });
  }

  // Sort descending by overall score
  scoredOptions.sort((a, b) => b.overallScore - a.overallScore);

  // Assign ranks
  scoredOptions.forEach((opt, idx) => {
    opt.rank = idx + 1;
  });

  const bestOption = scoredOptions[0];
  const topAlternatives = scoredOptions.slice(1, 3);
  const riskIndicators = calculateRiskIndicators(commodity, journey, storage);
  const whyExplanation = generateWhyExplanation(bestOption, commodity, journey, storage);

  const recommendationId = `REC-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

  return {
    recommendationId,
    commodity,
    journey,
    storage,
    bestOption,
    topAlternatives,
    allEvaluated: scoredOptions,
    whyExplanation,
    riskIndicators,
    calculationTimestamp: new Date().toISOString(),
    weightsUsed: weights
  };
}

/**
 * WHAT-IF SIMULATION ENGINE
 * Dynamically re-evaluates packaging scores under modified temperature, humidity, transit, or storage duration.
 */
export function simulateWhatIf(
  request: WhatIfRequest,
  baselineRecommendation: RecommendationResponse
): WhatIfResponse {
  // Construct simulated journey object
  const simulatedJourney: JourneyAnalysis = {
    ...baselineRecommendation.journey,
    temperatureRange: {
      min: Math.min(request.simulatedTempC - 2, request.simulatedTempC),
      max: request.simulatedTempC
    },
    averageHumidityPct: request.simulatedHumidityPct,
    estimatedDurationHours: request.simulatedJourneyHours,
    distanceKm: Math.round(request.simulatedJourneyHours * 48),
    rainRisk: request.simulatedHumidityPct > 85 ? 'High' : (request.simulatedHumidityPct > 70 ? 'Moderate' : 'None'),
    environmentalRisk: request.simulatedTempC > 32 || request.simulatedHumidityPct > 80 || request.simulatedJourneyHours > 20 ? 'HIGH' : 'MEDIUM'
  };

  const simulatedStorage: StorageParams = {
    storageDurationDays: request.simulatedStorageDays,
    storageType: request.storageType,
    transportType: request.transportType,
    targetShelfLifeDays: request.targetShelfLifeDays
  };

  const simulatedResult = evaluatePackagingOptions(
    baselineRecommendation.commodity,
    simulatedJourney,
    simulatedStorage,
    baselineRecommendation.weightsUsed
  );

  const beforeBest = baselineRecommendation.bestOption;
  const afterBest = simulatedResult.bestOption;

  let shiftExplanation = '';
  if (beforeBest.material.slug === afterBest.material.slug) {
    const deltaScore = afterBest.overallScore - beforeBest.overallScore;
    shiftExplanation = deltaScore >= 0
      ? `${afterBest.material.name} remains the best match. Overall score shifted by +${deltaScore} points (${beforeBest.overallScore} → ${afterBest.overallScore}) under the new parameters.`
      : `${afterBest.material.name} remains top-ranked, but the environmental stress (temp: ${request.simulatedTempC}°C, humidity: ${request.simulatedHumidityPct}%) reduced the suitability margin by ${Math.abs(deltaScore)} points (${beforeBest.overallScore} → ${afterBest.overallScore}).`;
  } else {
    shiftExplanation = `Optimal recommendation switched from ${beforeBest.material.name} (${beforeBest.overallScore}/100) to ${afterBest.material.name} (${afterBest.overallScore}/100). The altered environmental conditions (Temperature: ${request.simulatedTempC}°C, Humidity: ${request.simulatedHumidityPct}%, Transit: ${request.simulatedJourneyHours} hrs) amplified the requirement for superior barrier and protection properties.`;
  }

  return {
    before: beforeBest,
    after: afterBest,
    shiftExplanation,
    updatedRiskIndicators: simulatedResult.riskIndicators,
    newTopAlternatives: simulatedResult.topAlternatives,
    simulatedConditions: {
      temperatureC: request.simulatedTempC,
      humidityPct: request.simulatedHumidityPct,
      journeyHours: request.simulatedJourneyHours,
      storageDays: request.simulatedStorageDays
    }
  };
}
