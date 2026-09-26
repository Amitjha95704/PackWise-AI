/**
 * PackWise AI - Journey & Environmental Weather Service
 * Dynamic Open-Meteo Geocoding and Forecast API integration.
 * Computes estimated route distance, transit duration, and journey environmental stress profiles.
 */

import { CITY_COORDINATES_MAP } from '../db/knowledgeBase.js';
import {
  JourneyAnalysis,
  RainRisk,
  RiskLevel,
  TransportType,
  WeatherCondition
} from '../../src/types/packwise.js';

interface GeocodeResult {
  city: string;
  latitude: number;
  longitude: number;
  country?: string;
  admin1?: string;
}

export async function geocodeLocation(cityName: string): Promise<GeocodeResult> {
  const cleanName = cityName.trim();
  const lowerName = cleanName.toLowerCase();

  // Try Open-Meteo Geocoding API
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cleanName)}&count=1&language=en&format=json`;

    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data && data.results && data.results.length > 0) {
        const top = data.results[0];
        return {
          city: top.name,
          latitude: Number(top.latitude),
          longitude: Number(top.longitude),
          country: top.country,
          admin1: top.admin1
        };
      }
    }
  } catch (err) {
    console.warn(`Geocoding API network issue for "${cityName}", checking stored knowledge base:`, err);
  }

  // Fallback to internal knowledge base coordinates
  if (CITY_COORDINATES_MAP[lowerName]) {
    const stored = CITY_COORDINATES_MAP[lowerName];
    return {
      city: cleanName.charAt(0).toUpperCase() + cleanName.slice(1),
      latitude: stored.lat,
      longitude: stored.lon,
      country: 'India',
      admin1: stored.state
    };
  }

  // If unknown, search for partial match in knowledge base
  const match = Object.keys(CITY_COORDINATES_MAP).find(k => lowerName.includes(k) || k.includes(lowerName));
  if (match) {
    const stored = CITY_COORDINATES_MAP[match];
    return {
      city: cleanName,
      latitude: stored.lat,
      longitude: stored.lon,
      country: 'India',
      admin1: stored.state
    };
  }

  // Generative geometric default if completely unknown
  return {
    city: cleanName,
    latitude: 19.0760,
    longitude: 72.8777,
    country: 'India'
  };
}

function getWeatherDescription(code: number): string {
  if (code === 0) return 'Clear Sky';
  if (code === 1 || code === 2) return 'Partly Cloudy';
  if (code === 3) return 'Overcast';
  if (code === 45 || code === 48) return 'Foggy / Mist';
  if (code >= 51 && code <= 55) return 'Light Drizzle';
  if (code >= 61 && code <= 65) return 'Rain Showers';
  if (code >= 71 && code <= 77) return 'Snow Flurries';
  if (code >= 80 && code <= 82) return 'Heavy Rain Showers';
  if (code >= 95) return 'Thunderstorm';
  return 'Fair Conditions';
}

export async function fetchLocationWeather(geo: GeocodeResult): Promise<WeatherCondition> {
  const lowerName = geo.city.toLowerCase();
  const storedFallback = CITY_COORDINATES_MAP[lowerName] || {
    defaultTempC: 27.0,
    defaultRh: 65.0
  };

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${geo.latitude.toFixed(4)}&longitude=${geo.longitude.toFixed(4)}&current=temperature_2m,relative_humidity_2m,precipitation,rain,weather_code&hourly=temperature_2m,relative_humidity_2m,rain&forecast_days=1`;

    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      const current = data.current || {};
      const temp = current.temperature_2m !== undefined ? Number(current.temperature_2m) : storedFallback.defaultTempC;
      const rh = current.relative_humidity_2m !== undefined ? Number(current.relative_humidity_2m) : storedFallback.defaultRh;
      const rain = current.rain !== undefined ? Number(current.rain) : (current.precipitation || 0);
      const code = current.weather_code !== undefined ? Number(current.weather_code) : 0;

      return {
        city: geo.city,
        latitude: geo.latitude,
        longitude: geo.longitude,
        temperatureC: Math.round(temp * 10) / 10,
        relativeHumidityPct: Math.round(rh),
        precipitationMm: Math.round(rain * 10) / 10,
        rainMm: Math.round(rain * 10) / 10,
        weatherCode: code,
        weatherDescription: getWeatherDescription(code),
        isLive: true
      };
    }
  } catch (err) {
    console.warn(`Open-Meteo weather API call failed for ${geo.city}, using benchmark seasonal data:`, err);
  }

  // Graceful fallback weather data
  return {
    city: geo.city,
    latitude: geo.latitude,
    longitude: geo.longitude,
    temperatureC: storedFallback.defaultTempC,
    relativeHumidityPct: storedFallback.defaultRh,
    precipitationMm: 0.0,
    rainMm: 0.0,
    weatherCode: 1,
    weatherDescription: 'Fair (Knowledge Base Benchmark)',
    isLive: false
  };
}

// Great-circle Haversine formula
function calculateHaversineDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export async function analyzeJourney(
  sourceCityName: string,
  destCityName: string,
  transportMode: TransportType = 'Road'
): Promise<JourneyAnalysis> {
  const sourceGeo = await geocodeLocation(sourceCityName);
  const destGeo = await geocodeLocation(destCityName);

  const [sourceWeather, destWeather] = await Promise.all([
    fetchLocationWeather(sourceGeo),
    fetchLocationWeather(destGeo)
  ]);

  // Distance estimation: Haversine distance with road circuity factor (~1.25x for realistic freight corridors)
  const aerialDistance = calculateHaversineDistanceKm(
    sourceGeo.latitude,
    sourceGeo.longitude,
    destGeo.latitude,
    destGeo.longitude
  );

  let roadFactor = 1.25;
  let avgSpeedKmh = 48; // Commercial freight truck speed in India

  if (transportMode === 'Rail') {
    roadFactor = 1.15;
    avgSpeedKmh = 42;
  } else if (transportMode === 'Air') {
    roadFactor = 1.05;
    avgSpeedKmh = 550;
  }

  // Minimum realistic road distance if cities are same or near
  const distanceKm = Math.max(15, Math.round(aerialDistance * roadFactor));
  let estimatedDurationHours = Math.round((distanceKm / avgSpeedKmh) * 10) / 10;
  if (transportMode === 'Air') {
    // Add 3 hours for air cargo airport handling, palletizing & clearance
    estimatedDurationHours = Math.round((estimatedDurationHours + 3.0) * 10) / 10;
  }

  // Journey Environmental Profile Calculation
  const tempMin = Math.min(sourceWeather.temperatureC, destWeather.temperatureC);
  const tempMax = Math.max(sourceWeather.temperatureC, destWeather.temperatureC);
  const avgHumidity = Math.round((sourceWeather.relativeHumidityPct + destWeather.relativeHumidityPct) / 2);
  const maxRain = Math.max(sourceWeather.rainMm, destWeather.rainMm);

  let rainRisk: RainRisk = 'None';
  if (maxRain > 8.0) {
    rainRisk = 'High';
  } else if (maxRain > 1.5) {
    rainRisk = 'Moderate';
  } else if (maxRain > 0.0) {
    rainRisk = 'Low';
  }

  // Environmental Risk Assessment
  let environmentalRisk: RiskLevel = 'LOW';
  if (tempMax > 34 || tempMin < 5 || avgHumidity > 80 || rainRisk === 'High' || estimatedDurationHours > 24) {
    environmentalRisk = 'HIGH';
  } else if (tempMax > 28 || avgHumidity > 70 || rainRisk === 'Moderate' || estimatedDurationHours > 8) {
    environmentalRisk = 'MEDIUM';
  }

  const isLive = sourceWeather.isLive && destWeather.isLive;

  return {
    source: sourceWeather,
    destination: destWeather,
    distanceKm,
    estimatedDurationHours,
    transportSpeedKmh: avgSpeedKmh,
    transportMode,
    temperatureRange: {
      min: tempMin,
      max: tempMax
    },
    averageHumidityPct: avgHumidity,
    rainRisk,
    environmentalRisk,
    isLiveWeather: isLive,
    environmentalProfileSummary: `Corridor ${sourceWeather.city} → ${destWeather.city} spans ${distanceKm} km. Thermal profile: ${tempMin}°C to ${tempMax}°C, mean ambient humidity: ${avgHumidity}%, estimated transit: ${estimatedDurationHours} hrs.`,
    disclaimer: isLive
      ? 'Estimated transit profile calculated from live Open-Meteo node forecasts and logistics corridor models (not live real-time GPS probe traffic).'
      : 'Live meteorological API unavailable or rate-limited; environmental baseline retrieved from seasonal agro-climatic corridor benchmarks.'
  };
}
