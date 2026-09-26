import React, { useState } from 'react';
import { Sparkles, AlertTriangle, CheckCircle2, ChevronRight, Edit3, Info, Camera, RefreshCw } from 'lucide-react';
import { Commodity, FoodAnalysisResult } from '../types/packwise.js';
import { COMMODITIES } from '../../server/db/knowledgeBase.js';

interface FoodAnalysisViewProps {
  imagePreview: string | null;
  analysisResult: FoodAnalysisResult | null;
  isAnalyzing: boolean;
  onAnalyze: () => void;
  onSelectCommodityManually: (commodity: Commodity) => void;
  onProceedToProfile: () => void;
  onChangeImage: () => void;
}

export const FoodAnalysisView: React.FC<FoodAnalysisViewProps> = ({
  imagePreview,
  analysisResult,
  isAnalyzing,
  onAnalyze,
  onSelectCommodityManually,
  onProceedToProfile,
  onChangeImage
}) => {
  const [isChangingCommodity, setIsChangingCommodity] = useState(false);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Header Bar */}
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider bg-emerald-50 px-2 py-0.5 rounded">
              Step 1: Visual Acquisition & Commodity Identification
            </span>
            <h2 className="text-xl font-bold text-slate-900 mt-1">
              Food Image Analysis
            </h2>
            <p className="text-xs text-slate-500">
              Inspect visual morphology, confirm commodity classification, and link to food property standards.
            </p>
          </div>

          <button
            onClick={onChangeImage}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Retake / Upload New</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Image Preview Column */}
          <div className="md:col-span-5 space-y-3">
            <div className="relative aspect-4/3 rounded-xl overflow-hidden bg-slate-900 border border-slate-200 shadow-inner group">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Captured Food Produce"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 p-4 text-center">
                  <Camera className="w-10 h-10 mb-2 text-slate-500" />
                  <span className="text-xs font-medium">No image loaded</span>
                </div>
              )}

              {analysisResult && (
                <div className="absolute bottom-2 left-2 right-2 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-lg text-white flex items-center justify-between">
                  <span className="text-xs font-semibold">{analysisResult.detectedCommodity}</span>
                  <span className="text-[11px] font-bold text-emerald-400">
                    {analysisResult.confidence}% confidence
                  </span>
                </div>
              )}
            </div>

            {!analysisResult && (
              <button
                disabled={isAnalyzing || !imagePreview}
                onClick={onAnalyze}
                className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-sm rounded-xl shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Analyzing Produce Anatomy...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Analyze Food</span>
                  </>
                )}
              </button>
            )}
          </div>

          {/* Analysis Results Column */}
          <div className="md:col-span-7 space-y-5">
            {!analysisResult && !isAnalyzing && (
              <div className="p-6 rounded-xl bg-slate-50 border border-dashed border-slate-300 text-center space-y-2">
                <Info className="w-8 h-8 text-slate-400 mx-auto" />
                <h4 className="font-bold text-slate-700 text-sm">Produce Ready for Recognition</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Click <strong>Analyze Food</strong> to run neural visual classification and retrieve validated physiological storage standards from the knowledge base.
                </p>
              </div>
            )}

            {isAnalyzing && (
              <div className="p-8 rounded-xl bg-emerald-50/50 border border-emerald-200 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mx-auto text-emerald-600 animate-spin">
                  <RefreshCw className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">Evaluating Optical & Morphological Traits</h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Matching external color, pericarp contours, and physical class against agricultural taxonomy...
                  </p>
                </div>
              </div>
            )}

            {analysisResult && (
              <div className="space-y-4 animate-in fade-in duration-300">
                {/* Confidence & Low Confidence Warning */}
                {analysisResult.isLowConfidence ? (
                  <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-amber-900">Low confidence — please confirm the commodity</h4>
                      <p className="text-xs text-amber-700 mt-0.5">
                        The visual match score is below 75%. Please verify if the identification below matches your actual food.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      <span className="text-xs font-bold text-emerald-900">
                        Commodity Successfully Identified
                      </span>
                    </div>
                    <span className="text-xs font-extrabold text-emerald-700 bg-white px-2 py-0.5 rounded-md border border-emerald-200 shadow-2xs">
                      {analysisResult.confidence}% Confidence
                    </span>
                  </div>
                )}

                {/* Detected Commodity Card */}
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                        Detected Commodity
                      </span>
                      <h3 className="text-2xl font-black text-slate-900">
                        {analysisResult.detectedCommodity}
                      </h3>
                    </div>

                    <button
                      onClick={() => setIsChangingCommodity(!isChangingCommodity)}
                      className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-white hover:bg-emerald-50 border border-emerald-300 rounded-lg shadow-2xs transition-colors"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Change Commodity</span>
                    </button>
                  </div>

                  {/* Manual Override Dropdown */}
                  {isChangingCommodity && (
                    <div className="p-3 bg-white rounded-lg border border-slate-300 space-y-2">
                      <label className="block text-xs font-bold text-slate-700">
                        Select Exact Commodity from Knowledge Base:
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 max-h-48 overflow-y-auto p-1">
                        {COMMODITIES.map((c) => (
                          <button
                            key={c.id}
                            type="button"
                            onClick={() => {
                              onSelectCommodityManually(c);
                              setIsChangingCommodity(false);
                            }}
                            className={`px-2.5 py-1.5 text-xs font-medium rounded text-left transition-colors ${
                              c.slug === analysisResult.commodityData.slug
                                ? 'bg-emerald-600 text-white font-bold'
                                : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                            }`}
                          >
                            {c.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-200 text-xs">
                    <div>
                      <span className="text-slate-500">Category:</span>{' '}
                      <span className="font-bold text-slate-800">{analysisResult.category}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Perishability:</span>{' '}
                      <span className="font-bold text-slate-800">{analysisResult.commodityData.perishability}</span>
                    </div>
                  </div>

                  {/* Visible Characteristics */}
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[11px] font-bold text-slate-600 uppercase">
                      Observed Visual Characteristics:
                    </span>
                    <ul className="text-xs text-slate-600 space-y-1">
                      {analysisResult.visibleCharacteristics.map((trait, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-emerald-500 font-bold">•</span>
                          <span>{trait}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Scientific Honesty Disclaimer Banner */}
                <div className="p-3.5 bg-blue-50/70 border border-blue-200/80 rounded-xl flex items-start gap-2.5 text-xs text-blue-900 leading-relaxed">
                  <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Scientific Integrity Note: </span>
                    <span>
                      AI image analysis recognizes the agricultural commodity cultivar. Reference physiological values (pH, cellular moisture %, respiration rate) are retrieved from empirical food-science benchmarks, not direct sensor probing.
                    </span>
                  </div>
                </div>

                {/* Proceed Button */}
                <div className="pt-2">
                  <button
                    onClick={onProceedToProfile}
                    className="w-full py-3 px-5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-xl shadow-md flex items-center justify-center gap-2 transition-all hover:translate-x-0.5"
                  >
                    <span>View Scientific Food Profile</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
