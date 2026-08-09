import React from 'react';
import { Brain, TrendingUp, Lightbulb } from 'lucide-react';
import { AIOverview } from '../../types/research';

interface AIResearchOverviewProps {
  overview: AIOverview;
}

export const AIResearchOverview: React.FC<AIResearchOverviewProps> = ({ overview }) => {
  return (
    <section className="space-y-4 animate-in">
      {/* Summary Box */}
      <div className="surface p-5 space-y-2">
        <div className="flex items-center gap-2">
          <Brain size={16} className="text-indigo-600" />
          <h3 className="font-serif text-lg font-semibold text-stone-900">AI Briefing</h3>
        </div>
        <p className="text-[13px] leading-relaxed text-stone-700">{overview.summary}</p>
        <p className="text-[12px] text-stone-400 italic">{overview.researchDirection}</p>
      </div>

      {/* 2-Column Concepts & Trends */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Concepts */}
        <div className="surface p-5 space-y-3">
          <div className="flex items-center gap-2">
            <Lightbulb size={15} className="text-amber-600" />
            <h4 className="text-[14px] font-semibold text-stone-900">Key Concepts</h4>
          </div>
          <ul className="space-y-1.5">
            {overview.keyConcepts.map((c, i) => (
              <li key={i} className="flex items-start gap-2 text-[12px] text-stone-600">
                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-500" />
                {c}
              </li>
            ))}
          </ul>
        </div>

        {/* Trends */}
        <div className="surface p-5 space-y-3">
          <div className="flex items-center gap-2">
            <TrendingUp size={15} className="text-emerald-600" />
            <h4 className="text-[14px] font-semibold text-stone-900">Emerging Trends</h4>
          </div>
          <ul className="space-y-1.5">
            {overview.emergingTrends.map((t, i) => (
              <li key={i} className="flex items-start gap-2 text-[12px] text-stone-600">
                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-emerald-500" />
                {t}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};
