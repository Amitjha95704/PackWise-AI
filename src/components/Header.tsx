import React from 'react';
import { Package, Sparkles, Database, RotateCcw, Award } from 'lucide-react';

interface HeaderProps {
  onReset: () => void;
  onTryDemo: () => void;
  onOpenArchitecture: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onReset,
  onTryDemo,
  onOpenArchitecture
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div 
          onClick={onReset}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-tight text-slate-900">
                PACKWISE <span className="text-emerald-600">AI</span>
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                <Award className="w-3 h-3 text-emerald-700" />
                SIH Prototype
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
              Intelligent Food Packaging Material Recommendation System
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onOpenArchitecture}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors border border-slate-200"
            title="Inspect Knowledge Base, Relational Schema & Engine Formulas"
          >
            <Database className="w-3.5 h-3.5 text-slate-600" />
            <span className="hidden md:inline">Knowledge Base & DDL</span>
            <span className="md:hidden">DB/Docs</span>
          </button>

          <button
            onClick={onTryDemo}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 border border-emerald-300 rounded-lg shadow-sm transition-all hover:scale-[1.02]"
            title="Instantly test end-to-end Tomato scenario (Mumbai to Pune)"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
            <span>Try Demo</span>
          </button>

          <button
            onClick={onReset}
            className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
            title="Restart Journey"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
