import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Award,
  ShieldCheck,
  Thermometer,
  IndianRupee,
  Leaf,
  Clock,
  CheckCircle2,
  FileDown,
  Sliders,
  Printer,
  ChevronRight,
  TrendingUp,
  AlertTriangle,
  Info
} from 'lucide-react';
import { RecommendationResponse, ScoredPackagingOption } from '../types/packwise.js';

interface RecommendationDashboardProps {
  recommendation: RecommendationResponse;
  onOpenWhatIf: () => void;
  onDownloadPdf: () => void;
  onOpenPrintModal: () => void;
  onOpenArchitecture: () => void;
}

export const RecommendationDashboard: React.FC<RecommendationDashboardProps> = ({
  recommendation,
  onOpenWhatIf,
  onDownloadPdf,
  onOpenPrintModal,
  onOpenArchitecture
}) => {
  const best = recommendation.bestOption;
  const commodity = recommendation.commodity;
  const journey = recommendation.journey;

  useEffect(() => {
    // Fire festive confetti on arrival to recommendation
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#10B981', '#059669', '#34D399', '#F59E0B']
      });
    } catch (e) {
      // ignore
    }
  }, [recommendation.recommendationId]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Top Banner & Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-extrabold text-emerald-800 uppercase tracking-wider bg-emerald-100 px-2 py-0.5 rounded">
              PackWise Decision Engine
            </span>
            <span className="text-xs text-slate-400">
              Ref #{recommendation.recommendationId.substring(0, 14)}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
            Packaging Recommendation
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Optimal protective match for <strong>{commodity.name}</strong> across corridor{' '}
            <strong>{journey.source.city} → {journey.destination.city}</strong>.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={onOpenWhatIf}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl transition-all shadow-2xs hover:scale-105"
          >
            <Sliders className="w-3.5 h-3.5 text-slate-600" />
            <span>What-If Analysis</span>
          </button>

          <button
            onClick={onOpenPrintModal}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl transition-all shadow-2xs"
            title="Inspect formatted printable dossier"
          >
            <Printer className="w-3.5 h-3.5 text-slate-600" />
            <span>View Full Report</span>
          </button>

          <button
            onClick={onDownloadPdf}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md shadow-emerald-600/25 transition-all hover:scale-105 active:scale-95"
          >
            <FileDown className="w-3.5 h-3.5" />
            <span>Download Report (PDF)</span>
          </button>
        </div>
      </div>

      {/* #1 Recommended Packaging Hero Card */}
      <div className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        {/* Subtle decorative circles */}
        <div className="absolute -right-12 -top-12 w-64 h-64 rounded-full bg-emerald-500/10 pointer-events-none blur-2xl" />
        <div className="absolute right-24 bottom-0 w-48 h-48 rounded-full bg-teal-400/10 pointer-events-none blur-xl" />

        <div className="relative z-10 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-emerald-700/50 pb-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-200 text-xs font-bold uppercase tracking-wider mb-2">
                <Award className="w-4 h-4 text-emerald-300" />
                <span>Rank #1 Recommended Solution</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
                {best.material.name}
              </h2>
              <p className="text-xs sm:text-sm text-emerald-200/90 mt-1 max-w-xl">
                {best.material.specifications}
              </p>
            </div>

            {/* Score Ring / Pill */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-white/15 flex flex-col items-center justify-center shrink-0 min-w-[130px]">
              <span className="text-[11px] font-bold text-emerald-200 uppercase tracking-widest">
                Overall Match
              </span>
              <div className="flex items-baseline gap-1 my-0.5">
                <span className="text-4xl sm:text-5xl font-black text-white">{best.overallScore}</span>
                <span className="text-sm font-bold text-emerald-300">/100</span>
              </div>
              <span className="text-[10px] font-semibold text-emerald-300 bg-emerald-500/30 px-2 py-0.5 rounded-full">
                High Confidence
              </span>
            </div>
          </div>

          {/* Core Score Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-1">
            {/* Protection */}
            <div className="bg-white/10 backdrop-blur-xs rounded-xl p-3.5 border border-white/10 space-y-1">
              <div className="flex items-center justify-between text-emerald-200 text-xs">
                <span className="font-semibold uppercase tracking-wider text-[10px]">Protection</span>
                <ShieldCheck className="w-3.5 h-3.5" />
              </div>
              <div className="text-xl font-black text-white">{best.protectionScore}/100</div>
              <span className="text-[11px] text-emerald-300 font-medium block">
                {best.protectionScore >= 80 ? 'Superior Rigidity' : 'Moderate Defense'}
              </span>
            </div>

            {/* Condition Suitability */}
            <div className="bg-white/10 backdrop-blur-xs rounded-xl p-3.5 border border-white/10 space-y-1">
              <div className="flex items-center justify-between text-emerald-200 text-xs">
                <span className="font-semibold uppercase tracking-wider text-[10px]">Condition Fit</span>
                <Thermometer className="w-3.5 h-3.5" />
              </div>
              <div className="text-xl font-black text-white">{best.conditionSuitabilityScore}/100</div>
              <span className="text-[11px] text-emerald-300 font-medium block">
                {best.conditionSuitabilityScore >= 75 ? 'Optimal Thermal' : 'Acceptable Fit'}
              </span>
            </div>

            {/* Unit Cost */}
            <div className="bg-white/10 backdrop-blur-xs rounded-xl p-3.5 border border-white/10 space-y-1">
              <div className="flex items-center justify-between text-emerald-200 text-xs">
                <span className="font-semibold uppercase tracking-wider text-[10px]">Unit Cost</span>
                <IndianRupee className="w-3.5 h-3.5" />
              </div>
              <div className="text-xl font-black text-white">₹{best.estimatedCostInr.toFixed(2)}</div>
              <span className="text-[11px] text-emerald-300 font-medium block">
                Score: {best.costScore}/100
              </span>
            </div>

            {/* Sustainability */}
            <div className="bg-white/10 backdrop-blur-xs rounded-xl p-3.5 border border-white/10 space-y-1">
              <div className="flex items-center justify-between text-emerald-200 text-xs">
                <span className="font-semibold uppercase tracking-wider text-[10px]">Sustainability</span>
                <Leaf className="w-3.5 h-3.5" />
              </div>
              <div className="text-xl font-black text-white">{best.sustainabilityScore}/100</div>
              <span className="text-[11px] text-emerald-300 font-medium block">
                {best.material.biodegradabilityRating >= 80 ? 'Compostable' : 'Recyclable Stream'}
              </span>
            </div>

            {/* Expected Shelf-Life */}
            <div className="bg-white/10 backdrop-blur-xs rounded-xl p-3.5 border border-white/10 space-y-1 col-span-2 sm:col-span-1">
              <div className="flex items-center justify-between text-emerald-200 text-xs">
                <span className="font-semibold uppercase tracking-wider text-[10px]">Shelf Life</span>
                <Clock className="w-3.5 h-3.5" />
              </div>
              <div className="text-xl font-black text-white">~{best.expectedShelfLifeDays} Days</div>
              <span className="text-[11px] text-emerald-300 font-medium block">
                +{(best.expectedShelfLifeDays - commodity.properties.typicalShelfLifeDays)}d vs baseline
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* WHY THIS PACKAGING? Natural Language Explanation */}
      <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-600 animate-pulse" />
            <h3 className="text-base font-black text-slate-900 tracking-tight">
              Why This Packaging? (Grounded Synthesis)
            </h3>
          </div>
          <span className="text-xs font-semibold text-slate-400">
            Rules + Weighted Decision Model
          </span>
        </div>

        <p className="text-sm text-slate-700 leading-relaxed font-medium">
          {recommendation.whyExplanation}
        </p>

        {/* Explainability Breakdown: Factors that influenced score */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {/* Positive Factors */}
          <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-2">
            <span className="text-xs font-extrabold text-emerald-900 uppercase tracking-wide flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Positive Decision Drivers (+)</span>
            </span>
            <ul className="text-xs text-emerald-900 space-y-1.5">
              {best.reasoningFactors.positive.map((pro, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="font-bold text-emerald-600">+</span>
                  <span>{pro}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Trade-offs / Limitations */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <span className="text-xs font-extrabold text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
              <Info className="w-4 h-4 text-slate-500" />
              <span>Trade-offs & Constraints (-)</span>
            </span>
            {best.reasoningFactors.negative.length > 0 ? (
              <ul className="text-xs text-slate-600 space-y-1.5">
                {best.reasoningFactors.negative.map((con, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="font-bold text-rose-500">-</span>
                    <span>{con}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-slate-500 italic">
                No significant negative penalties flagged within the specified route parameters.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Corridor Risk Indicators */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <span>Transit & Storage Risk Assessment</span>
          </h3>
          <span className="text-xs text-slate-500">Configurable scientific safety thresholds</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          {/* Temperature Risk */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase block">Temperature Risk</span>
            <span className={`text-sm font-black px-2.5 py-0.5 rounded-full inline-block ${
              recommendation.riskIndicators.temperatureRisk === 'HIGH'
                ? 'bg-rose-100 text-rose-800'
                : recommendation.riskIndicators.temperatureRisk === 'MEDIUM'
                ? 'bg-amber-100 text-amber-800'
                : 'bg-emerald-100 text-emerald-800'
            }`}>
              {recommendation.riskIndicators.temperatureRisk}
            </span>
            <span className="text-[10px] text-slate-400 block pt-0.5">
              Corridor: {journey.temperatureRange.min}°C - {journey.temperatureRange.max}°C
            </span>
          </div>

          {/* Humidity Risk */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase block">Humidity Risk</span>
            <span className={`text-sm font-black px-2.5 py-0.5 rounded-full inline-block ${
              recommendation.riskIndicators.humidityRisk === 'HIGH'
                ? 'bg-rose-100 text-rose-800'
                : recommendation.riskIndicators.humidityRisk === 'MEDIUM'
                ? 'bg-amber-100 text-amber-800'
                : 'bg-emerald-100 text-emerald-800'
            }`}>
              {recommendation.riskIndicators.humidityRisk}
            </span>
            <span className="text-[10px] text-slate-400 block pt-0.5">
              Ambient RH: {journey.averageHumidityPct}%
            </span>
          </div>

          {/* Transport Risk */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase block">Transport Shock</span>
            <span className={`text-sm font-black px-2.5 py-0.5 rounded-full inline-block ${
              recommendation.riskIndicators.transportRisk === 'HIGH'
                ? 'bg-rose-100 text-rose-800'
                : recommendation.riskIndicators.transportRisk === 'MEDIUM'
                ? 'bg-amber-100 text-amber-800'
                : 'bg-emerald-100 text-emerald-800'
            }`}>
              {recommendation.riskIndicators.transportRisk}
            </span>
            <span className="text-[10px] text-slate-400 block pt-0.5">
              {journey.distanceKm} km (~{journey.estimatedDurationHours}h)
            </span>
          </div>

          {/* Shelf Life Risk */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase block">Shelf-Life Risk</span>
            <span className={`text-sm font-black px-2.5 py-0.5 rounded-full inline-block ${
              recommendation.riskIndicators.shelfLifeRisk === 'HIGH'
                ? 'bg-rose-100 text-rose-800'
                : recommendation.riskIndicators.shelfLifeRisk === 'MEDIUM'
                ? 'bg-amber-100 text-amber-800'
                : 'bg-emerald-100 text-emerald-800'
            }`}>
              {recommendation.riskIndicators.shelfLifeRisk}
            </span>
            <span className="text-[10px] text-slate-400 block pt-0.5">
              Target: {recommendation.storage.storageDurationDays}d storage
            </span>
          </div>
        </div>
      </div>

      {/* Alternative Packaging Options (Comparative Cards) */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-base font-black text-slate-900 tracking-tight">
              Top Alternative Packaging Options
            </h3>
            <p className="text-xs text-slate-500">
              Ranked alternatives evaluated across the same multi-criteria decision pipeline.
            </p>
          </div>
          <span className="text-xs font-semibold px-2 py-1 bg-slate-100 rounded-md text-slate-700">
            Top 3 Evaluated
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recommendation.topAlternatives.map((alt) => (
            <div
              key={alt.material.id}
              className="p-5 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 transition-all space-y-4 shadow-2xs"
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                    Alternative #{alt.rank}
                  </span>
                  <h4 className="text-lg font-bold text-slate-900 mt-0.5">
                    {alt.material.name}
                  </h4>
                </div>
                <div className="text-right">
                  <span className="text-xl font-black text-slate-900">{alt.overallScore}</span>
                  <span className="text-xs font-semibold text-slate-400">/100</span>
                </div>
              </div>

              {/* Quick Spec Metrics */}
              <div className="grid grid-cols-3 gap-2 text-center text-xs py-2 bg-slate-50 rounded-xl">
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold">UNIT COST</span>
                  <span className="font-extrabold text-slate-800">₹{alt.estimatedCostInr.toFixed(2)}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold">PROTECTION</span>
                  <span className="font-extrabold text-slate-800">{alt.protectionScore}/100</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold">SUSTAINABILITY</span>
                  <span className="font-extrabold text-emerald-700">{alt.sustainabilityScore}/100</span>
                </div>
              </div>

              {/* Main Advantage & Limitation */}
              <div className="space-y-1.5 text-xs">
                <div className="flex items-start gap-1.5 text-emerald-800">
                  <span className="font-bold text-emerald-600">Advantage:</span>
                  <span>{alt.advantages[0] || 'Economical alternative packaging'}</span>
                </div>
                <div className="flex items-start gap-1.5 text-slate-600">
                  <span className="font-bold text-rose-500">Limitation:</span>
                  <span>{alt.limitations[0] || 'Lower thermal buffering performance'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Visual Multi-Criteria Comparison Bar Chart */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
          Multi-Criteria Performance Comparison
        </h3>

        <div className="space-y-3">
          {[best, ...recommendation.topAlternatives].map((item) => (
            <div key={item.material.id} className="space-y-1">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-800">
                  #{item.rank} {item.material.name}
                </span>
                <span className="font-extrabold text-slate-900">{item.overallScore}/100</span>
              </div>
              <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden flex">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    item.rank === 1
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-600'
                      : item.rank === 2
                      ? 'bg-emerald-300'
                      : 'bg-slate-300'
                  }`}
                  style={{ width: `${item.overallScore}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom CTA for What-If & PDF */}
      <div className="p-6 bg-emerald-50/60 rounded-2xl border border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-bold text-emerald-950">
            Simulate Climate Shifts or Download Official SIH Report
          </h4>
          <p className="text-xs text-emerald-800 mt-0.5">
            Test how seasonal heatwaves, monsoons, or transit delays shift the ranking in real-time.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenWhatIf}
            className="flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold rounded-xl border border-slate-300 shadow-2xs transition-all hover:scale-105"
          >
            <Sliders className="w-4 h-4 text-emerald-600" />
            <span>Simulate What-If</span>
          </button>

          <button
            onClick={onDownloadPdf}
            className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-600/25 transition-all hover:scale-105"
          >
            <FileDown className="w-4 h-4" />
            <span>Download PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
};
