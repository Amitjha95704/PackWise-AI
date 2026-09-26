import React, { useState } from 'react';
import { Sliders, RefreshCw, ArrowRight, CheckCircle2, AlertCircle, X, Sparkles } from 'lucide-react';
import { RecommendationResponse, WhatIfRequest, WhatIfResponse } from '../types/packwise.js';

interface WhatIfSimulatorProps {
  recommendation: RecommendationResponse;
  isOpen: boolean;
  onClose: () => void;
  onSimulate: (req: WhatIfRequest) => Promise<WhatIfResponse | null>;
  onApplyNewRecommendation?: (updated: WhatIfResponse) => void;
}

export const WhatIfSimulator: React.FC<WhatIfSimulatorProps> = ({
  recommendation,
  isOpen,
  onSimulate,
  onClose,
  onApplyNewRecommendation
}) => {
  if (!isOpen) return null;

  const [simTemp, setSimTemp] = useState<number>(recommendation.journey.temperatureRange.max + 5);
  const [simHumidity, setSimHumidity] = useState<number>(Math.min(95, recommendation.journey.averageHumidityPct + 15));
  const [simJourneyHours, setSimJourneyHours] = useState<number>(Math.round(recommendation.journey.estimatedDurationHours * 1.5));
  const [simStorageDays, setSimStorageDays] = useState<number>(recommendation.storage.storageDurationDays + 4);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [result, setResult] = useState<WhatIfResponse | null>(null);

  const handleRunSimulation = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsLoading(true);
    try {
      const res = await onSimulate({
        baselineRecommendationId: recommendation.recommendationId,
        commodityId: recommendation.commodity.id,
        simulatedTempC: Number(simTemp),
        simulatedHumidityPct: Number(simHumidity),
        simulatedJourneyHours: Number(simJourneyHours),
        simulatedStorageDays: Number(simStorageDays),
        storageType: recommendation.storage.storageType,
        transportType: recommendation.storage.transportType
      });
      setResult(res);
    } catch (err) {
      console.error('Simulation error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 my-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900">
                What-If Climate & Transit Stress Analysis
              </h2>
              <p className="text-xs text-slate-500">
                Dynamically re-evaluate packaging suitability under environmental shifts.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sliders Input Form */}
        <form onSubmit={handleRunSimulation} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Simulated Temperature */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-700">Simulated Temperature</span>
                <span className="font-extrabold text-amber-700">{simTemp}°C</span>
              </div>
              <input
                type="range"
                min="0"
                max="48"
                step="1"
                value={simTemp}
                onChange={(e) => setSimTemp(Number(e.target.value))}
                className="w-full accent-amber-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>0°C (Cold)</span>
                <span>Baseline ({recommendation.journey.temperatureRange.max}°C)</span>
                <span>48°C (Extreme)</span>
              </div>
            </div>

            {/* Simulated Humidity */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-700">Simulated Humidity</span>
                <span className="font-extrabold text-blue-700">{simHumidity}%</span>
              </div>
              <input
                type="range"
                min="20"
                max="99"
                step="1"
                value={simHumidity}
                onChange={(e) => setSimHumidity(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>20% (Dry)</span>
                <span>Baseline ({recommendation.journey.averageHumidityPct}%)</span>
                <span>99% (Monsoon)</span>
              </div>
            </div>

            {/* Simulated Journey Hours */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-700">Journey Duration</span>
                <span className="font-extrabold text-slate-900">{simJourneyHours} Hours</span>
              </div>
              <input
                type="range"
                min="1"
                max="96"
                step="1"
                value={simJourneyHours}
                onChange={(e) => setSimJourneyHours(Number(e.target.value))}
                className="w-full accent-slate-800 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>1h (Local)</span>
                <span>Baseline (~{recommendation.journey.estimatedDurationHours}h)</span>
                <span>96h (Transit Jam)</span>
              </div>
            </div>

            {/* Simulated Storage Duration */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-700">Storage Period</span>
                <span className="font-extrabold text-emerald-700">{simStorageDays} Days</span>
              </div>
              <input
                type="range"
                min="1"
                max="30"
                step="1"
                value={simStorageDays}
                onChange={(e) => setSimStorageDays(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>1 day</span>
                <span>Baseline ({recommendation.storage.storageDurationDays}d)</span>
                <span>30 days</span>
              </div>
            </div>
          </div>

          {/* Quick Presets */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500 pt-1">
            <span className="font-semibold text-slate-700">Simulate Preset Stress:</span>
            <button
              type="button"
              onClick={() => {
                setSimTemp(40);
                setSimHumidity(85);
                setSimJourneyHours(12);
              }}
              className="px-2 py-0.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-md text-[11px] font-medium"
            >
              Summer Heatwave (40°C)
            </button>
            <button
              type="button"
              onClick={() => {
                setSimTemp(26);
                setSimHumidity(95);
                setSimJourneyHours(18);
              }}
              className="px-2 py-0.5 bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 rounded-md text-[11px] font-medium"
            >
              Monsoon Downpour (95% RH)
            </button>
            <button
              type="button"
              onClick={() => {
                setSimJourneyHours(48);
                setSimStorageDays(14);
              }}
              className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 rounded-md text-[11px] font-medium"
            >
              Extended Logistic Delay (+48h)
            </button>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-sm rounded-xl shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Re-calculating Multi-Criteria Matrices...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Recalculate Packaging Recommendation</span>
              </>
            )}
          </button>
        </form>

        {/* BEFORE VS AFTER Comparison View */}
        {result && (
          <div className="border-t border-slate-200 pt-5 space-y-4 animate-in fade-in duration-200">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
              Simulation Outcome: Condition-Aware Dynamic Shift
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* BEFORE Card */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  BEFORE (Original Conditions)
                </span>
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 text-sm">{result.before.material.name}</h4>
                  <span className="text-base font-black text-slate-800">{result.before.overallScore}/100</span>
                </div>
                <div className="text-[11px] text-slate-500">
                  Protection: {result.before.protectionScore} • Shelf-Life: ~{result.before.expectedShelfLifeDays}d
                </div>
              </div>

              {/* AFTER Card */}
              <div className="p-4 bg-amber-50 rounded-xl border border-amber-300 space-y-2">
                <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block">
                  AFTER (Simulated Climate Stress)
                </span>
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-amber-950 text-sm">{result.after.material.name}</h4>
                  <span className="text-base font-black text-amber-900">{result.after.overallScore}/100</span>
                </div>
                <div className="text-[11px] text-amber-800">
                  Protection: {result.after.protectionScore} • Shelf-Life: ~{result.after.expectedShelfLifeDays}d
                </div>
              </div>
            </div>

            {/* Explanation of Why Recommendation Changed */}
            <div className="p-4 bg-blue-50/80 rounded-xl border border-blue-200 text-xs text-blue-900 space-y-1">
              <span className="font-bold block">Why Did the Score / Recommendation Shift?</span>
              <p className="leading-relaxed">
                {result.shiftExplanation}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
