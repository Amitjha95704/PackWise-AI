import React from 'react';
import { X, Printer, FileDown, ShieldCheck, CheckCircle2, Leaf, Thermometer, IndianRupee, Clock } from 'lucide-react';
import { RecommendationResponse, WhatIfResponse } from '../types/packwise.js';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  recommendation: RecommendationResponse;
  whatIfResult?: WhatIfResponse | null;
  onDownloadPdf: () => void;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  recommendation,
  whatIfResult,
  onDownloadPdf
}) => {
  if (!isOpen) return null;

  const best = recommendation.bestOption;
  const comm = recommendation.commodity;
  const props = comm.properties;
  const journey = recommendation.journey;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-4xl w-full p-6 sm:p-10 shadow-2xl border border-slate-200 my-8 space-y-6 print:p-0 print:border-none print:shadow-none">
        {/* Top Header Actions (hidden during print) */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-4 no-print">
          <div>
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider bg-emerald-100 px-2 py-0.5 rounded">
              SIH Official Report View
            </span>
            <h2 className="text-xl font-black text-slate-900 mt-1">
              Food Packaging Recommendation Dossier
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors border border-slate-200"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Dossier</span>
            </button>

            <button
              onClick={onDownloadPdf}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition-colors"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Report Document Body */}
        <div className="space-y-6 text-slate-900 font-sans">
          {/* Document Title Header */}
          <div className="bg-emerald-800 text-white p-6 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-300">
                PackWise AI Engineering Report
              </span>
              <h1 className="text-2xl font-black">Food Packaging Material Recommendation</h1>
              <p className="text-xs text-emerald-100 mt-1">
                Generated: {new Date(recommendation.calculationTimestamp).toLocaleString()} • Ref ID: {recommendation.recommendationId}
              </p>
            </div>
            <div className="text-left sm:text-right bg-emerald-900/60 p-3 rounded-xl border border-emerald-700/50">
              <span className="text-[10px] text-emerald-300 uppercase block font-bold">Smart India Hackathon</span>
              <span className="text-xs font-bold text-white">Condition-Aware Decision Engine</span>
            </div>
          </div>

          {/* 1. Food Profile */}
          <div className="p-4 rounded-xl border border-slate-200 space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-emerald-800 border-b border-slate-100 pb-1.5">
              1. Food Commodity Profile & Scientific Reference
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <span className="text-slate-400 block font-semibold">Commodity</span>
                <span className="font-bold text-slate-900 text-sm">{comm.name}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-semibold">Category</span>
                <span className="font-bold text-slate-900">{comm.category}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-semibold">Perishability</span>
                <span className="font-bold text-rose-600">{comm.perishability}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-semibold">Optimal Storage Temp</span>
                <span className="font-bold text-slate-900">{props.optimalTempMinC}°C to {props.optimalTempMaxC}°C</span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs pt-1 text-slate-600 border-t border-slate-100">
              <div>pH Range: <strong>{props.typicalPhMin} – {props.typicalPhMax}</strong></div>
              <div>Moisture: <strong>{props.moistureContentPct}% ({props.moistureSensitivity})</strong></div>
              <div>Respiration: <strong>{props.respirationRate}</strong></div>
              <div>Mechanical Sensitivity: <strong>{props.mechanicalSensitivity}</strong></div>
              <div>Chilling Sensitive: <strong>{props.chillingSensitivity ? 'Yes (< 12°C)' : 'No'}</strong></div>
              <div>Baseline Shelf Life: <strong>{props.typicalShelfLifeDays} Days</strong></div>
            </div>
          </div>

          {/* 2. Journey & Environmental Conditions */}
          <div className="p-4 rounded-xl border border-slate-200 space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-emerald-800 border-b border-slate-100 pb-1.5">
              2. Transit Corridor & Open-Meteo Meteorological Conditions
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <span className="text-slate-400 block font-semibold">Origin</span>
                <span className="font-bold text-slate-900">{journey.source.city} ({journey.source.temperatureC}°C, RH {journey.source.relativeHumidityPct}%)</span>
              </div>
              <div>
                <span className="text-slate-400 block font-semibold">Destination</span>
                <span className="font-bold text-slate-900">{journey.destination.city} ({journey.destination.temperatureC}°C, RH {journey.destination.relativeHumidityPct}%)</span>
              </div>
              <div>
                <span className="text-slate-400 block font-semibold">Distance & Duration</span>
                <span className="font-bold text-slate-900">{journey.distanceKm} km (~{journey.estimatedDurationHours}h)</span>
              </div>
              <div>
                <span className="text-slate-400 block font-semibold">Corridor Thermal Range</span>
                <span className="font-bold text-emerald-700">{journey.temperatureRange.min}°C – {journey.temperatureRange.max}°C</span>
              </div>
            </div>
          </div>

          {/* 3. Top Recommendation */}
          <div className="p-5 rounded-xl bg-emerald-50/70 border border-emerald-300 space-y-3">
            <div className="flex items-center justify-between border-b border-emerald-200 pb-2">
              <div>
                <span className="text-xs font-bold text-emerald-800 uppercase">3. Optimal Packaging Recommendation</span>
                <h2 className="text-xl font-black text-emerald-950 mt-0.5">{best.material.name}</h2>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black text-emerald-900">{best.overallScore}/100</span>
                <span className="text-[10px] text-emerald-700 block font-bold">MATCH SCORE</span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="bg-white p-2.5 rounded-lg border border-emerald-200/80">
                <span className="text-slate-500 block text-[10px]">PROTECTION</span>
                <span className="font-bold text-slate-900">{best.protectionScore}/100</span>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-emerald-200/80">
                <span className="text-slate-500 block text-[10px]">CONDITION FIT</span>
                <span className="font-bold text-slate-900">{best.conditionSuitabilityScore}/100</span>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-emerald-200/80">
                <span className="text-slate-500 block text-[10px]">UNIT COST</span>
                <span className="font-bold text-slate-900">₹{best.estimatedCostInr.toFixed(2)}</span>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-emerald-200/80">
                <span className="text-slate-500 block text-[10px]">SUSTAINABILITY</span>
                <span className="font-bold text-emerald-700">{best.sustainabilityScore}/100</span>
              </div>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed font-medium pt-1">
              <strong>Why Chosen:</strong> {recommendation.whyExplanation}
            </p>
          </div>

          {/* 4. Alternatives Table */}
          <div className="p-4 rounded-xl border border-slate-200 space-y-2">
            <h3 className="text-xs font-black uppercase tracking-wider text-emerald-800 border-b border-slate-100 pb-1.5">
              4. Comparative Alternatives
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 font-semibold">
                    <th className="pb-1.5">Rank</th>
                    <th className="pb-1.5">Material</th>
                    <th className="pb-1.5">Score</th>
                    <th className="pb-1.5">Unit Cost</th>
                    <th className="pb-1.5">Protection</th>
                    <th className="pb-1.5">Sustainability</th>
                    <th className="pb-1.5">Primary Advantage</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recommendation.topAlternatives.map((alt) => (
                    <tr key={alt.material.id}>
                      <td className="py-2 font-bold text-slate-600">#{alt.rank}</td>
                      <td className="py-2 font-bold text-slate-900">{alt.material.name}</td>
                      <td className="py-2 font-extrabold text-emerald-700">{alt.overallScore}/100</td>
                      <td className="py-2 text-slate-700">₹{alt.estimatedCostInr.toFixed(2)}</td>
                      <td className="py-2 text-slate-700">{alt.protectionScore}/100</td>
                      <td className="py-2 text-slate-700">{alt.sustainabilityScore}/100</td>
                      <td className="py-2 text-slate-600">{alt.advantages[0] || 'Cost-efficient'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 5. What-If Simulation Section if ran */}
          {whatIfResult && (
            <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-300 space-y-1 text-xs">
              <h3 className="font-bold text-amber-950 uppercase">5. What-If Stress Simulation Outcome</h3>
              <p className="text-amber-900">
                {whatIfResult.shiftExplanation}
              </p>
            </div>
          )}

          {/* Scientific Honesty Disclaimer */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-500 leading-relaxed">
            <span className="font-bold text-slate-700">Scientific Validation Disclaimer: </span>
            Camera vision performs morphological cultivar identification only. Physical-chemical parameters (pH, transpiration, respiration) are verified through the PackWise Knowledge Base. Route meteorology is obtained dynamically from Open-Meteo forecast nodes.
          </div>
        </div>
      </div>
    </div>
  );
};
