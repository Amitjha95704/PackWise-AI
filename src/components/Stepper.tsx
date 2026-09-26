import React from 'react';
import { Camera, BookOpen, MapPin, Sliders, CheckCircle2, FileText } from 'lucide-react';

interface StepperProps {
  currentStep: number; // 1 to 6
  onStepClick?: (step: number) => void;
  maxAccessibleStep: number;
}

const STEPS = [
  { step: 1, label: 'Food Image', icon: Camera },
  { step: 2, label: 'Food Profile', icon: BookOpen },
  { step: 3, label: 'Journey & Weather', icon: MapPin },
  { step: 4, label: 'Storage & Transit', icon: Sliders },
  { step: 5, label: 'Recommendation', icon: CheckCircle2 },
  { step: 6, label: 'What-If & Report', icon: FileText }
];

export const Stepper: React.FC<StepperProps> = ({
  currentStep,
  onStepClick,
  maxAccessibleStep
}) => {
  return (
    <div className="w-full bg-white border-b border-slate-200 py-3 px-4 shadow-xs">
      <div className="max-w-5xl mx-auto flex items-center justify-between overflow-x-auto no-scrollbar gap-2 sm:gap-4">
        {STEPS.map((s, index) => {
          const Icon = s.icon;
          const isCurrent = currentStep === s.step;
          const isCompleted = currentStep > s.step;
          const isClickable = s.step <= maxAccessibleStep;

          return (
            <React.Fragment key={s.step}>
              <button
                type="button"
                disabled={!isClickable}
                onClick={() => isClickable && onStepClick && onStepClick(s.step)}
                className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  isCurrent
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 ring-2 ring-emerald-500/20 shadow-xs'
                    : isCompleted
                    ? 'text-slate-700 hover:bg-slate-100 cursor-pointer'
                    : 'text-slate-400 cursor-not-allowed opacity-60'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold ${
                    isCurrent
                      ? 'bg-emerald-600 text-white'
                      : isCompleted
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  {isCompleted ? '✓' : s.step}
                </div>
                <span className="hidden sm:inline">{s.label}</span>
              </button>

              {index < STEPS.length - 1 && (
                <div
                  className={`h-0.5 flex-1 min-w-[12px] sm:min-w-[24px] ${
                    isCompleted ? 'bg-emerald-500' : 'bg-slate-200'
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
