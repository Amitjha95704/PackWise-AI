import React, { useState } from 'react';
import { ArrowRight, Edit3, ShieldAlert, Sparkles, Thermometer, Droplets, Wind, Box, Clock, ChevronDown } from 'lucide-react';
import { Commodity } from '../types/packwise.js';
import { COMMODITIES } from '../../server/db/knowledgeBase.js';

interface FoodProfileCardProps {
  commodity: Commodity;
  onProceedToJourney: () => void;
  onCommodityChange: (newCommodity: Commodity) => void;
  onBackToInput: () => void;
}

export const FoodProfileCard: React.FC<FoodProfileCardProps> = ({
  commodity,
  onProceedToJourney,
  onCommodityChange,
  onBackToInput
}) => {
  const [showCommoditySelector, setShowCommoditySelector] = useState(false);
  const props = commodity.properties;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider bg-emerald-100 px-2 py-0.5 rounded">
                Step 2: Food Knowledge Base Retrieval
              </span>
              <span className="text-xs text-slate-400">• Empirical Baseline</span>
            </div>
            <h2 className="text-2xl font-black text-slate-900 mt-1">
              Food Profile: {commodity.name}
            </h2>
            <p className="text-xs text-slate-500">
              Validated physiological thresholds and packaging protection mandates.
            </p>
          </div>

          <div className="relative">
            <button
              onClick={() => setShowCommoditySelector(!showCommoditySelector)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5 text-slate-600" />
              <span>Change Commodity</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {showCommoditySelector && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 p-2 z-30 grid grid-cols-2 gap-1 animate-in fade-in duration-150">
                {COMMODITIES.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      onCommodityChange(c);
                      setShowCommoditySelector(false);
                    }}
                    className={`px-2.5 py-1.5 text-xs text-left rounded font-medium transition-colors ${
                      c.slug === commodity.slug
                        ? 'bg-emerald-600 text-white font-bold'
                        : 'hover:bg-slate-100 text-slate-800'
                    }`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Overview Row */}
        <div className="p-6 bg-slate-50/70 border-b border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-2xs">
            <span className="text-[11px] font-semibold text-slate-400 block uppercase">Category</span>
            <span className="text-sm font-bold text-slate-900">{commodity.category}</span>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-2xs">
            <span className="text-[11px] font-semibold text-slate-400 block uppercase">Perishability</span>
            <span className={`text-sm font-bold ${
              commodity.perishability === 'ULTRA_HIGH' || commodity.perishability === 'HIGH'
                ? 'text-rose-600'
                : commodity.perishability === 'MEDIUM'
                ? 'text-amber-600'
                : 'text-emerald-700'
            }`}>
              {commodity.perishability.replace('_', ' ')}
            </span>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-2xs">
            <span className="text-[11px] font-semibold text-slate-400 block uppercase">Typical Shelf-Life</span>
            <span className="text-sm font-bold text-slate-900">{props.typicalShelfLifeDays} Days</span>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-2xs">
            <span className="text-[11px] font-semibold text-slate-400 block uppercase">Optimal Storage Temp</span>
            <span className="text-sm font-bold text-emerald-700">
              {props.optimalTempMinC}°C to {props.optimalTempMaxC}°C
            </span>
          </div>
        </div>

        {/* Detailed Reference Properties Grid */}
        <div className="p-6 space-y-6">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                Commodity Reference Properties (Knowledge Base Standard)
              </h3>
              <span className="text-[11px] text-slate-500 italic">
                Scientific empirical benchmarks
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
              {/* pH Range */}
              <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-1.5">
                <div className="flex items-center gap-2 text-slate-500 text-xs">
                  <Thermometer className="w-4 h-4 text-emerald-600" />
                  <span className="font-semibold uppercase tracking-wider text-[11px]">Typical pH Range</span>
                </div>
                <div className="text-lg font-black text-slate-900">
                  {props.typicalPhMin} – {props.typicalPhMax}
                </div>
                <p className="text-[11px] text-slate-500">
                  {props.typicalPhMin < 4.5 ? 'Acidic: Requires non-corrosive inert liner' : 'Mild / Neutral contact risk'}
                </p>
              </div>

              {/* Moisture */}
              <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-1.5">
                <div className="flex items-center gap-2 text-slate-500 text-xs">
                  <Droplets className="w-4 h-4 text-blue-600" />
                  <span className="font-semibold uppercase tracking-wider text-[11px]">Moisture Characteristics</span>
                </div>
                <div className="text-lg font-black text-slate-900">
                  {props.moistureContentPct}% <span className="text-xs font-bold text-blue-600">({props.moistureSensitivity})</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Optimal RH: {props.optimalRhMinPct}% – {props.optimalRhMaxPct}%
                </p>
              </div>

              {/* Respiration */}
              <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-1.5">
                <div className="flex items-center gap-2 text-slate-500 text-xs">
                  <Wind className="w-4 h-4 text-teal-600" />
                  <span className="font-semibold uppercase tracking-wider text-[11px]">Respiration Dynamics</span>
                </div>
                <div className="text-lg font-black text-slate-900">
                  {props.respirationRate.replace('_', ' ')}
                </div>
                <p className="text-[11px] text-slate-500">
                  Ethylene production: {props.ethyleneProduction.toLowerCase()}
                </p>
              </div>

              {/* Mechanical Sensitivity */}
              <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-1.5">
                <div className="flex items-center gap-2 text-slate-500 text-xs">
                  <Box className="w-4 h-4 text-amber-600" />
                  <span className="font-semibold uppercase tracking-wider text-[11px]">Mechanical Sensitivity</span>
                </div>
                <div className="text-lg font-black text-slate-900">
                  {props.mechanicalSensitivity.replace('_', ' ')}
                </div>
                <p className="text-[11px] text-slate-500">
                  Requires vibration absorption & compressive stacking strength
                </p>
              </div>

              {/* Chilling Injury */}
              <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-1.5">
                <div className="flex items-center gap-2 text-slate-500 text-xs">
                  <ShieldAlert className="w-4 h-4 text-rose-600" />
                  <span className="font-semibold uppercase tracking-wider text-[11px]">Chilling Injury Sensitivity</span>
                </div>
                <div className={`text-lg font-black ${props.chillingSensitivity ? 'text-rose-600' : 'text-emerald-700'}`}>
                  {props.chillingSensitivity ? 'Sensitive (< 10-12°C)' : 'Tolerant to Cold'}
                </div>
                <p className="text-[11px] text-slate-500">
                  {props.chillingSensitivity ? 'Do not freeze or over-chill in reefer' : 'Cold-chain refrigeration friendly'}
                </p>
              </div>

              {/* Shelf-Life Window */}
              <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-1.5">
                <div className="flex items-center gap-2 text-slate-500 text-xs">
                  <Clock className="w-4 h-4 text-purple-600" />
                  <span className="font-semibold uppercase tracking-wider text-[11px]">Baseline Shelf Life</span>
                </div>
                <div className="text-lg font-black text-slate-900">
                  {props.typicalShelfLifeDays} Days
                </div>
                <p className="text-[11px] text-slate-500">
                  Extendable up to 2-3x with barrier or MAP packaging
                </p>
              </div>
            </div>
          </div>

          {/* Key Deterioration & Packaging Mandates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/80 space-y-1">
              <span className="text-xs font-bold text-amber-900 uppercase">Primary Deterioration Factors</span>
              <p className="text-xs text-amber-800 leading-relaxed">
                {props.keyDeteriorationFactors}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200/80 space-y-1">
              <span className="text-xs font-bold text-emerald-900 uppercase">Packaging Material Requirements</span>
              <p className="text-xs text-emerald-800 leading-relaxed">
                {props.packagingRequirements}
              </p>
            </div>
          </div>

          {/* Notice: AI detected commodity from image */}
          <div className="p-3.5 bg-slate-100/90 rounded-xl text-xs text-slate-600 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                AI detected <strong>{commodity.name}</strong> from the input image. Reference values are retrieved from the knowledge base.
              </span>
            </div>
            <button
              onClick={() => setShowCommoditySelector(true)}
              className="text-xs font-bold text-emerald-700 hover:underline shrink-0"
            >
              Not correct? Change
            </button>
          </div>

          {/* Navigation Action Buttons */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={onBackToInput}
              className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-800 transition-colors"
            >
              ← Back to Image
            </button>

            <button
              onClick={onProceedToJourney}
              className="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-md shadow-emerald-600/25 transition-all hover:translate-x-0.5"
            >
              <span>Configure Journey & Weather</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
