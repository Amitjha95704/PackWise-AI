import React, { useState } from 'react';
import {
  MapPin,
  CloudRain,
  Thermometer,
  Droplets,
  Truck,
  Train,
  Plane,
  ArrowRight,
  RefreshCw,
  Sliders,
  CheckCircle2,
  Sparkles,
  Info
} from 'lucide-react';
import { JourneyAnalysis, StorageParams, StorageType, TransportType } from '../types/packwise.js';

interface JourneyWeatherViewProps {
  commodityName: string;
  sourceCity: string;
  destCity: string;
  journey: JourneyAnalysis | null;
  storage: StorageParams;
  isAnalyzingJourney: boolean;
  onSourceChange: (city: string) => void;
  onDestChange: (city: string) => void;
  onAnalyzeJourney: () => void;
  onStorageChange: (storage: StorageParams) => void;
  onProceedToRecommendation: () => void;
  onBackToProfile: () => void;
}

const COMMON_INDIAN_CITIES = [
  'Mumbai', 'Pune', 'Nashik', 'Delhi', 'Bengaluru',
  'Chennai', 'Hyderabad', 'Kolkata', 'Ahmedabad', 'Jaipur',
  'Lucknow', 'Nagpur', 'Chandigarh', 'Indore', 'Surat'
];

export const JourneyWeatherView: React.FC<JourneyWeatherViewProps> = ({
  commodityName,
  sourceCity,
  destCity,
  journey,
  storage,
  isAnalyzingJourney,
  onSourceChange,
  onDestChange,
  onAnalyzeJourney,
  onStorageChange,
  onProceedToRecommendation,
  onBackToProfile
}) => {
  const [sourceInput, setSourceInput] = useState(sourceCity);
  const [destInput, setDestInput] = useState(destCity);

  const handleRunJourneyAnalysis = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!sourceInput.trim() || !destInput.trim()) return;
    onSourceChange(sourceInput.trim());
    onDestChange(destInput.trim());
    onAnalyzeJourney();
  };

  const handleSwapCities = () => {
    const temp = sourceInput;
    setSourceInput(destInput);
    setDestInput(temp);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider bg-emerald-100 px-2 py-0.5 rounded">
              Step 3 & 4: Logistics Corridor & Environmental Stress
            </span>
            <h2 className="text-2xl font-black text-slate-900 mt-1">
              Journey, Weather & Storage Setup
            </h2>
            <p className="text-xs text-slate-500">
              Live meteorological geocoding via Open-Meteo across transit route for {commodityName}.
            </p>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 rounded-lg text-xs font-semibold text-slate-700">
            <Truck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Mode: {storage.transportType}</span>
          </div>
        </div>

        {/* City Input & Quick Select Form */}
        <div className="p-6 space-y-5 bg-slate-50/50 border-b border-slate-100">
          <form onSubmit={handleRunJourneyAnalysis} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-11 gap-3 items-center">
              {/* Source City */}
              <div className="sm:col-span-5 space-y-1">
                <label className="block text-xs font-bold text-slate-700">
                  Origin / Source Location
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-emerald-600 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={sourceInput}
                    onChange={(e) => setSourceInput(e.target.value)}
                    placeholder="Enter city (e.g. Mumbai, Nashik)"
                    className="w-full pl-9 pr-3 py-2.5 bg-white rounded-xl border border-slate-300 text-sm font-semibold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-2xs"
                  />
                </div>
              </div>

              {/* Swap Button */}
              <div className="sm:col-span-1 flex justify-center pt-4 sm:pt-4">
                <button
                  type="button"
                  onClick={handleSwapCities}
                  className="p-2 rounded-xl bg-white border border-slate-300 hover:bg-slate-100 text-slate-600 transition-colors shadow-2xs"
                  title="Swap Origin and Destination"
                >
                  ⇄
                </button>
              </div>

              {/* Destination City */}
              <div className="sm:col-span-5 space-y-1">
                <label className="block text-xs font-bold text-slate-700">
                  Destination Location
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-blue-600 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={destInput}
                    onChange={(e) => setDestInput(e.target.value)}
                    placeholder="Enter city (e.g. Pune, Delhi)"
                    className="w-full pl-9 pr-3 py-2.5 bg-white rounded-xl border border-slate-300 text-sm font-semibold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-2xs"
                  />
                </div>
              </div>
            </div>

            {/* Quick Suggestions */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500">
              <span className="font-semibold text-slate-600">Quick corridors:</span>
              <button
                type="button"
                onClick={() => {
                  setSourceInput('Mumbai');
                  setDestInput('Pune');
                }}
                className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700 hover:border-emerald-500 text-[11px] font-medium transition-colors"
              >
                Mumbai → Pune (SIH Demo)
              </button>
              <button
                type="button"
                onClick={() => {
                  setSourceInput('Nashik');
                  setDestInput('Mumbai');
                }}
                className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700 hover:border-emerald-500 text-[11px] font-medium transition-colors"
              >
                Nashik → Mumbai (Agro Corridor)
              </button>
              <button
                type="button"
                onClick={() => {
                  setSourceInput('Delhi');
                  setDestInput('Bengaluru');
                }}
                className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700 hover:border-emerald-500 text-[11px] font-medium transition-colors"
              >
                Delhi → Bengaluru (Long Haul)
              </button>
            </div>

            {/* Submit Analyze Journey Button */}
            <button
              type="submit"
              disabled={isAnalyzingJourney || !sourceInput || !destInput}
              className="w-full py-3 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-bold text-sm rounded-xl shadow-md flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
            >
              {isAnalyzingJourney ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Connecting to Open-Meteo Synoptic Forecast Nodes...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <span>Analyze Journey & Fetch Weather</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Environmental Analysis Results Cards */}
        {journey && (
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Transit Environmental Profile</span>
              </h3>
              <span className={`text-xs font-extrabold px-2.5 py-0.5 rounded-md border ${
                journey.environmentalRisk === 'HIGH'
                  ? 'bg-rose-50 text-rose-700 border-rose-200'
                  : journey.environmentalRisk === 'MEDIUM'
                  ? 'bg-amber-50 text-amber-700 border-amber-200'
                  : 'bg-emerald-50 text-emerald-700 border-emerald-200'
              }`}>
                Risk: {journey.environmentalRisk}
              </span>
            </div>

            {/* Source & Destination Side-by-Side Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Source Card */}
              <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span className="text-xs font-bold text-slate-700 uppercase">Source Conditions</span>
                  </div>
                  <span className="text-sm font-black text-slate-900">{journey.source.city}</span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-2 bg-slate-50 rounded-lg">
                    <span className="text-[10px] text-slate-400 block font-semibold">TEMP</span>
                    <span className="text-base font-extrabold text-slate-900">
                      {journey.source.temperatureC}°C
                    </span>
                  </div>

                  <div className="p-2 bg-slate-50 rounded-lg">
                    <span className="text-[10px] text-slate-400 block font-semibold">RAIN</span>
                    <span className="text-base font-extrabold text-slate-900">
                      {journey.source.rainMm} mm
                    </span>
                  </div>

                  <div className="p-2 bg-slate-50 rounded-lg">
                    <span className="text-[10px] text-slate-400 block font-semibold">HUMIDITY</span>
                    <span className="text-base font-extrabold text-slate-900">
                      {journey.source.relativeHumidityPct}%
                    </span>
                  </div>
                </div>

                <div className="text-[11px] text-slate-500 flex items-center justify-between pt-1">
                  <span>Sky: {journey.source.weatherDescription}</span>
                  <span className="text-emerald-700 font-semibold">{journey.source.isLive ? '● Live API' : '○ Regional Data'}</span>
                </div>
              </div>

              {/* Destination Card */}
              <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                    <span className="text-xs font-bold text-slate-700 uppercase">Destination Conditions</span>
                  </div>
                  <span className="text-sm font-black text-slate-900">{journey.destination.city}</span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-2 bg-slate-50 rounded-lg">
                    <span className="text-[10px] text-slate-400 block font-semibold">TEMP</span>
                    <span className="text-base font-extrabold text-slate-900">
                      {journey.destination.temperatureC}°C
                    </span>
                  </div>

                  <div className="p-2 bg-slate-50 rounded-lg">
                    <span className="text-[10px] text-slate-400 block font-semibold">RAIN</span>
                    <span className="text-base font-extrabold text-slate-900">
                      {journey.destination.rainMm} mm
                    </span>
                  </div>

                  <div className="p-2 bg-slate-50 rounded-lg">
                    <span className="text-[10px] text-slate-400 block font-semibold">HUMIDITY</span>
                    <span className="text-base font-extrabold text-slate-900">
                      {journey.destination.relativeHumidityPct}%
                    </span>
                  </div>
                </div>

                <div className="text-[11px] text-slate-500 flex items-center justify-between pt-1">
                  <span>Sky: {journey.destination.weatherDescription}</span>
                  <span className="text-blue-700 font-semibold">{journey.destination.isLive ? '● Live API' : '○ Regional Data'}</span>
                </div>
              </div>
            </div>

            {/* Corridor Stress Indicators */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <span className="text-[10px] font-semibold text-slate-500 uppercase block">Distance</span>
                <span className="text-base font-black text-slate-900">{journey.distanceKm} km</span>
              </div>

              <div>
                <span className="text-[10px] font-semibold text-slate-500 uppercase block">Transit Duration</span>
                <span className="text-base font-black text-slate-900">~{journey.estimatedDurationHours} Hours</span>
              </div>

              <div>
                <span className="text-[10px] font-semibold text-slate-500 uppercase block">Temperature Range</span>
                <span className="text-base font-black text-emerald-700">
                  {journey.temperatureRange.min}°C – {journey.temperatureRange.max}°C
                </span>
              </div>

              <div>
                <span className="text-[10px] font-semibold text-slate-500 uppercase block">Rain Risk</span>
                <span className={`text-base font-black ${
                  journey.rainRisk === 'High' ? 'text-rose-600' : journey.rainRisk === 'Moderate' ? 'text-amber-600' : 'text-emerald-700'
                }`}>
                  {journey.rainRisk}
                </span>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 italic">
              {journey.disclaimer}
            </p>

            {/* Storage & Shelf-Life Configuration Sub-Form */}
            <div className="border-t border-slate-200 pt-6 space-y-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
                <Sliders className="w-4 h-4 text-emerald-600" />
                <span>Storage & Shelf-Life Parameters</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Storage Duration */}
                <div className="space-y-1.5 p-3.5 bg-white rounded-xl border border-slate-200">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-700">Storage Duration</span>
                    <span className="font-extrabold text-emerald-700">{storage.storageDurationDays} Days</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="30"
                    value={storage.storageDurationDays}
                    onChange={(e) => onStorageChange({ ...storage, storageDurationDays: Number(e.target.value) })}
                    className="w-full accent-emerald-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>1 day</span>
                    <span>15 days</span>
                    <span>30 days</span>
                  </div>
                </div>

                {/* Storage Type */}
                <div className="space-y-1.5 p-3.5 bg-white rounded-xl border border-slate-200">
                  <label className="block text-xs font-bold text-slate-700">
                    Storage Protocol
                  </label>
                  <select
                    value={storage.storageType}
                    onChange={(e) => onStorageChange({ ...storage, storageType: e.target.value as StorageType })}
                    className="w-full p-2 bg-slate-50 rounded-lg border border-slate-300 text-xs font-semibold text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
                  >
                    <option value="Ambient">Ambient</option>
                    <option value="Refrigerated">Refrigerated (Reefer Cold Chain)</option>
                    <option value="Controlled Environment">Controlled Atmosphere (CA)</option>
                    <option value="Frozen">Frozen (Sub-Zero Cold Chain)</option>
                  </select>
                </div>

                {/* Transport Mode */}
                <div className="space-y-1.5 p-3.5 bg-white rounded-xl border border-slate-200">
                  <label className="block text-xs font-bold text-slate-700">
                    Transport Mode
                  </label>
                  <select
                    value={storage.transportType}
                    onChange={(e) => onStorageChange({ ...storage, transportType: e.target.value as TransportType })}
                    className="w-full p-2 bg-slate-50 rounded-lg border border-slate-300 text-xs font-semibold text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
                  >
                    <option value="Road">Road Freight (Truck / Van)</option>
                    <option value="Rail">Rail Freight (Express Cargo)</option>
                    <option value="Air">Air Cargo (Express Reefer)</option>
                  </select>
                </div>

                {/* Target Shelf Life */}
                <div className="space-y-1.5 p-3.5 bg-white rounded-xl border border-slate-200">
                  <label className="block text-xs font-bold text-slate-700">
                    Target Shelf Life (Opt)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="365"
                    value={storage.targetShelfLifeDays || 7}
                    onChange={(e) => onStorageChange({ ...storage, targetShelfLifeDays: Number(e.target.value) })}
                    placeholder="e.g. 7 days"
                    className="w-full p-2 bg-slate-50 rounded-lg border border-slate-300 text-xs font-semibold text-slate-800"
                  />
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={onBackToProfile}
                className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-800"
              >
                ← Back to Food Profile
              </button>

              <button
                type="button"
                onClick={onProceedToRecommendation}
                className="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-600/25 transition-all hover:scale-105"
              >
                <span>Run Decision Engine & Recommend</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
