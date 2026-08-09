import React from 'react';
import { Columns, X, Sparkles, Plus } from 'lucide-react';
import { Paper } from '../../types/research';
import { generateAIComparisonVerdict } from '../../services/aiSynthesisService';

interface PaperComparatorProps {
  comparedPapers: Paper[];
  onRemovePaper: (paperId: string) => void;
  onClearAll: () => void;
  onAnalyze: (paper: Paper) => void;
  onGoToDiscovery: () => void;
}

export const PaperComparator: React.FC<PaperComparatorProps> = ({
  comparedPapers,
  onRemovePaper,
  onClearAll,
  onAnalyze,
  onGoToDiscovery,
}) => {
  const verdict = generateAIComparisonVerdict(comparedPapers);

  if (comparedPapers.length === 0) {
    return (
      <div className="mx-auto max-w-md space-y-4 py-20 text-center animate-in">
        <Columns size={40} className="mx-auto text-stone-300" />
        <h3 className="font-serif text-xl font-semibold text-stone-900">No papers selected for comparison</h3>
        <p className="text-[13px] text-stone-500">
          Click "Compare" on paper cards in Discover mode to add publications side-by-side.
        </p>
        <button
          onClick={onGoToDiscovery}
          className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-[12px] font-semibold text-white transition hover:bg-indigo-700 shadow-sm"
        >
          <Plus size={14} /> Browse Papers
        </button>
      </div>
    );
  }

  return (
    <section className="space-y-5 animate-in">
      {/* AI Verdict */}
      <div className="surface p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-indigo-600" />
            <h3 className="font-serif text-lg font-semibold text-stone-900">AI Comparison Verdict</h3>
          </div>
          <button
            onClick={onClearAll}
            className="rounded-lg border border-[#e7e5e0] bg-stone-50 px-3 py-1 text-[11px] font-medium text-stone-600 transition hover:bg-stone-100"
          >
            Clear Selection ({comparedPapers.length})
          </button>
        </div>
        <p className="text-[13px] leading-relaxed text-stone-700 bg-stone-50 p-4 rounded-lg border border-stone-200/80 font-sans">
          {verdict}
        </p>
      </div>

      {/* Comparison Table */}
      <div className="overflow-x-auto rounded-xl border border-[#e7e5e0] bg-white shadow-sm">
        <table className="w-full min-w-[650px] text-left border-collapse">
          <thead>
            <tr className="border-b border-[#e7e5e0] bg-stone-50">
              <th className="sticky left-0 z-10 w-40 bg-stone-50 p-4 text-[11px] font-semibold uppercase text-stone-500 border-r border-[#e7e5e0]">
                Dimension
              </th>
              {comparedPapers.map((p) => (
                <th key={p.id} className="border-r border-[#e7e5e0] p-4 align-top min-w-[280px]">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="rounded-md bg-indigo-50 px-2 py-0.5 text-[10px] font-mono font-semibold text-indigo-600">
                      {p.recommendationScore}% Match
                    </span>
                    <button onClick={() => onRemovePaper(p.id)} className="text-stone-400 hover:text-rose-600">
                      <X size={15} />
                    </button>
                  </div>
                  <h4 className="font-serif text-[15px] font-semibold text-stone-900 leading-snug line-clamp-2">{p.title}</h4>
                  <p className="mt-1 text-[11px] text-stone-500 truncate">{p.authors.slice(0, 3).join(', ')}</p>
                  <button
                    onClick={() => onAnalyze(p)}
                    className="mt-3 rounded-md bg-indigo-600 px-3 py-1 text-[11px] font-semibold text-white transition hover:bg-indigo-700 shadow-sm"
                  >
                    Analyze
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e7e5e0] text-[13px]">
            <tr>
              <td className="sticky left-0 bg-stone-50 p-4 font-semibold text-stone-700 border-r border-[#e7e5e0]">Problem</td>
              {comparedPapers.map((p) => (
                <td key={p.id} className="border-r border-[#e7e5e0] p-4 text-stone-600 leading-relaxed">
                  {p.abstract.slice(0, 180)}...
                </td>
              ))}
            </tr>
            <tr>
              <td className="sticky left-0 bg-stone-50 p-4 font-semibold text-stone-700 border-r border-[#e7e5e0]">Methodology</td>
              {comparedPapers.map((p) => (
                <td key={p.id} className="border-r border-[#e7e5e0] p-4 text-stone-600 leading-relaxed">
                  {p.analysis.methodologyBreakdown}
                </td>
              ))}
            </tr>
            <tr>
              <td className="sticky left-0 bg-stone-50 p-4 font-semibold text-stone-700 border-r border-[#e7e5e0]">Results</td>
              {comparedPapers.map((p) => (
                <td key={p.id} className="border-r border-[#e7e5e0] p-4">
                  <div className="space-y-1.5">
                    {p.analysis.keyMetricsAndResults.map((m, i) => (
                      <div key={i} className="rounded-md bg-stone-50 p-2 border border-stone-200/60">
                        <span className="block text-[10px] text-stone-500">{m.metricName}</span>
                        <span className="font-mono font-semibold text-indigo-600 text-[12px]">{m.value}</span>
                      </div>
                    ))}
                  </div>
                </td>
              ))}
            </tr>
            <tr>
              <td className="sticky left-0 bg-stone-50 p-4 font-semibold text-stone-700 border-r border-[#e7e5e0]">Limitations</td>
              {comparedPapers.map((p) => (
                <td key={p.id} className="border-r border-[#e7e5e0] p-4">
                  <ul className="space-y-1 text-[12px] text-amber-800">
                    {p.analysis.limitations.map((l, i) => <li key={i}>⚠️ {l}</li>)}
                  </ul>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
};
