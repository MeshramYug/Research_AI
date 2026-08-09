import React from 'react';
import { Target } from 'lucide-react';
import { ResearchGap } from '../../types/research';

interface ResearchGapDetectorProps {
  gaps: ResearchGap[];
}

export const ResearchGapDetector: React.FC<ResearchGapDetectorProps> = ({ gaps }) => {
  return (
    <section className="space-y-4 animate-in">
      <div className="flex items-center gap-2">
        <Target size={16} className="text-indigo-600" />
        <h3 className="font-serif text-lg font-semibold text-stone-900">Unexplored Research Gaps</h3>
        <span className="rounded-full bg-stone-100 px-2.5 py-0.5 text-[11px] font-mono text-stone-500 font-medium">
          {gaps.length} Gaps Detected
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {gaps.map((gap) => (
          <div key={gap.id} className="surface p-5 space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px]">
                <span className="rounded-md bg-stone-100 px-2 py-0.5 text-stone-600 font-medium">
                  {gap.category}
                </span>
                <span className="text-stone-400">{gap.supportingPaperCount} Papers</span>
              </div>

              <h4 className="font-serif text-[15px] font-semibold text-stone-900 leading-snug">
                {gap.title}
              </h4>

              <p className="text-[12px] text-stone-600 leading-relaxed line-clamp-3">
                {gap.description}
              </p>
            </div>

            <div className="space-y-2 pt-2 border-t border-[#e7e5e0]">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-stone-500">Maturity</span>
                <span className="font-mono font-semibold text-indigo-600">{gap.maturity}%</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-stone-100 overflow-hidden">
                <div
                  className="h-full rounded-full bg-indigo-600"
                  style={{ width: `${gap.maturity}%` }}
                />
              </div>

              <p className="rounded-lg bg-indigo-50/60 p-2.5 text-[11px] text-indigo-900 leading-relaxed border border-indigo-100">
                <strong className="text-indigo-700 font-semibold">Opportunity:</strong> {gap.potentialOpportunity}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
