import React from 'react';
import { Upload, Camera, Sparkles, ShieldCheck, Leaf, Compass, ArrowRight } from 'lucide-react';
import { COMMODITIES } from '../../server/db/knowledgeBase.js';
import { Commodity } from '../types/packwise.js';

interface LandingHeroProps {
  onUploadClick: () => void;
  onTakePhotoClick: () => void;
  onTryDemo: () => void;
  onSelectCommodityDemo: (commodity: Commodity) => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  onUploadClick,
  onTakePhotoClick,
  onTryDemo,
  onSelectCommodityDemo
}) => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12 space-y-12">
      {/* Hero Section */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-semibold">
          <Leaf className="w-3.5 h-3.5 text-emerald-600" />
          <span>Condition-Aware Decision Support Engine</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
          Intelligent Packaging <br className="hidden sm:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-700">
            Decision Platform
          </span>
        </h1>

        <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
          Analyze your food, journey and environmental conditions to identify scientifically suitable, cost-effective, and sustainable packaging options.
        </p>

        {/* Primary Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
          <button
            onClick={onUploadClick}
            className="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-600/25 transition-all hover:-translate-y-0.5"
          >
            <Upload className="w-4 h-4" />
            <span>Upload Food Image</span>
          </button>

          <button
            onClick={onTakePhotoClick}
            className="flex items-center gap-2 px-5 py-3 bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm rounded-xl border border-slate-300 shadow-xs transition-all hover:-translate-y-0.5"
          >
            <Camera className="w-4 h-4 text-emerald-600" />
            <span>Take Photo</span>
          </button>

          <button
            onClick={onTryDemo}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-emerald-600 hover:from-amber-600 hover:to-emerald-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-amber-500/20 transition-all hover:scale-105"
          >
            <Sparkles className="w-4 h-4 animate-bounce" />
            <span>Try Demo (Mumbai → Pune)</span>
          </button>
        </div>

        <p className="text-[11px] text-slate-400">
          Ready for Smart India Hackathon Live Demonstration • Zero setup required
        </p>
      </div>

      {/* Feature Highlights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="w-9 h-9 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700">
            <Camera className="w-4 h-4" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm">Visual Recognition & Science</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            AI vision identifies commodity morphology; physiological respiration, pH, and chilling thresholds are retrieved from the knowledge base.
          </p>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700">
            <Compass className="w-4 h-4" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm">Dynamic Weather & Route</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Dynamic Open-Meteo forecasts build an estimated thermal corridor, ambient relative humidity, and transit duration profile.
          </p>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="w-9 h-9 rounded-lg bg-purple-100 flex items-center justify-center text-purple-700">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm">Multi-Criteria Decision Engine</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            MCDA model weights physical barrier, vibration protection, condition suitability, unit cost in ₹, and circular sustainability index.
          </p>
        </div>
      </div>

      {/* Quick Commodity Selection Gallery for Demo/Instant Test */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Select a Predefined Commodity</h3>
            <p className="text-xs text-slate-500">
              Judges can click any commodity below to run instant recognition and benchmarking:
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md">
            12 Validated Crops & Foods
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {COMMODITIES.map((c) => (
            <button
              key={c.id}
              onClick={() => onSelectCommodityDemo(c)}
              className="group p-3 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50 bg-white transition-all text-left flex flex-col justify-between h-36 relative overflow-hidden shadow-2xs hover:shadow-md"
            >
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100/80 px-1.5 py-0.5 rounded">
                  {c.category.split(' ')[0]}
                </span>
                <h4 className="font-bold text-slate-900 text-sm group-hover:text-emerald-700 transition-colors">
                  {c.name}
                </h4>
                <p className="text-[11px] text-slate-500 line-clamp-2">
                  {c.properties.moistureSensitivity} moisture, {c.properties.respirationRate.toLowerCase()} resp.
                </p>
              </div>

              <div className="pt-2 flex items-center justify-between text-[11px] font-semibold text-emerald-600 group-hover:text-emerald-800">
                <span>Select</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
