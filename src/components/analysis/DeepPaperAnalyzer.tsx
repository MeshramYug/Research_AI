import React, { useState } from 'react';
import { X, Sparkles, Cpu, ExternalLink, Bookmark, Columns, AlertTriangle, Copy, Check } from 'lucide-react';
import { Paper } from '../../types/research';

interface DeepPaperAnalyzerProps {
  paper: Paper | null;
  onClose: () => void;
  onToggleBookmark: (paperId: string) => void;
  onToggleCompare: (paper: Paper) => void;
  isCompared: boolean;
  onAskCopilotAboutPaper: (paper: Paper) => void;
}

type Tab = 'summary' | 'methodology' | 'metrics' | 'equations' | 'limitations';

export const DeepPaperAnalyzer: React.FC<DeepPaperAnalyzerProps> = ({
  paper,
  onClose,
  onToggleBookmark,
  onToggleCompare,
  isCompared,
  onAskCopilotAboutPaper,
}) => {
  const [tab, setTab] = useState<Tab>('summary');
  const [copied, setCopied] = useState(false);

  if (!paper) return null;

  const copyBib = () => {
    const key = paper.authors[0]?.split(' ').pop()?.toLowerCase() + paper.publishedDate.split('-')[0];
    const bib = `@article{${key},\n  title={${paper.title}},\n  author={${paper.authors.join(' and ')}},\n  journal={${paper.journalOrConference}},\n  year={${paper.publishedDate.split('-')[0]}},\n  url={${paper.url}}\n}`;
    navigator.clipboard.writeText(bib);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const TABS: { key: Tab; label: string }[] = [
    { key: 'summary', label: 'Executive Summary' },
    { key: 'methodology', label: 'Methodology' },
    { key: 'metrics', label: 'Results' },
    { key: 'equations', label: 'Formulas' },
    { key: 'limitations', label: 'Limitations' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/40 p-4 backdrop-blur-xs">
      <div className="relative flex max-h-[88vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-[#e7e5e0] bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-[#e7e5e0] p-6 bg-[#fafaf8]">
          <div className="space-y-1.5 min-w-0">
            <div className="flex items-center gap-2 text-[11px]">
              <span className="rounded-md bg-indigo-50 px-2 py-0.5 font-mono font-semibold text-indigo-600">
                {paper.recommendationScore}% Match
              </span>
              <span className="text-stone-400">{paper.journalOrConference} · {paper.publishedDate}</span>
              <span className="text-stone-400 font-mono">{paper.citationsCount.toLocaleString()} citations</span>
            </div>
            <h2 className="font-serif text-xl font-semibold text-stone-900 leading-snug">{paper.title}</h2>
            <p className="text-[12px] text-stone-500 truncate">{paper.authors.join(', ')}</p>
          </div>
          <button onClick={onClose} className="flex-shrink-0 rounded-lg p-1.5 text-stone-400 transition hover:bg-stone-100 hover:text-stone-700">
            <X size={18} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-1 border-b border-[#e7e5e0] px-6 pt-2 bg-[#fafaf8]">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`rounded-t-lg px-3.5 py-2 text-[12px] font-medium transition ${
                tab === t.key ? 'bg-white text-indigo-600 font-semibold border-t-2 border-indigo-600 shadow-xs' : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {tab === 'summary' && (
            <>
              <div className="surface p-4 space-y-2 bg-indigo-50/40 border-indigo-100">
                <h4 className="text-[11px] font-semibold uppercase text-indigo-700">Executive AI Summary</h4>
                <p className="text-[13px] leading-relaxed text-stone-800">{paper.analysis.executiveSummary}</p>
              </div>
              <div className="space-y-2">
                <h4 className="text-[11px] font-semibold uppercase text-stone-400">Core Novelty & Contributions</h4>
                {paper.analysis.noveltyAndContributions.map((c, i) => (
                  <div key={i} className="flex items-start gap-2.5 rounded-xl border border-stone-200 bg-stone-50 p-3">
                    <Sparkles size={14} className="mt-0.5 flex-shrink-0 text-indigo-600" />
                    <span className="text-[13px] text-stone-800">{c}</span>
                  </div>
                ))}
              </div>
            </>
          )}

          {tab === 'methodology' && (
            <>
              <div className="surface p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <Cpu size={15} className="text-indigo-600" />
                  <h4 className="text-[13px] font-semibold text-stone-900">Architecture & Method</h4>
                </div>
                <p className="text-[13px] leading-relaxed text-stone-700">{paper.analysis.methodologyBreakdown}</p>
              </div>
              {paper.analysis.codeUrl && (
                <a href={paper.analysis.codeUrl} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-50 px-3.5 py-2 text-[12px] font-semibold text-indigo-600 transition hover:bg-indigo-100 border border-indigo-200">
                  <ExternalLink size={13} /> View Code Repository
                </a>
              )}
            </>
          )}

          {tab === 'metrics' && (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {paper.analysis.keyMetricsAndResults.map((m, i) => (
                <div key={i} className="surface p-4 space-y-1">
                  <span className="text-[11px] text-stone-500">{m.metricName}</span>
                  <span className="block text-xl font-bold font-mono text-indigo-600">{m.value}</span>
                  {m.benchmark && <span className="text-[10px] text-stone-400">{m.benchmark}</span>}
                </div>
              ))}
            </div>
          )}

          {tab === 'equations' && (
            <div className="space-y-4">
              {paper.analysis.equationsOrFormulas.map((eq, i) => (
                <div key={i} className="surface p-4 space-y-2">
                  <h5 className="text-[13px] font-semibold text-stone-900">{eq.name}</h5>
                  <div className="overflow-x-auto rounded-lg bg-stone-100 p-3.5 font-mono text-[13px] text-indigo-900 border border-stone-200">
                    {eq.latex}
                  </div>
                  <p className="text-[12px] italic text-stone-500">{eq.description}</p>
                </div>
              ))}
            </div>
          )}

          {tab === 'limitations' && (
            <>
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-amber-600">
                  <AlertTriangle size={14} />
                  <h4 className="text-[11px] font-semibold uppercase">Identified Limitations</h4>
                </div>
                {paper.analysis.limitations.map((l, i) => (
                  <div key={i} className="rounded-xl border border-amber-200 bg-amber-50/60 p-3 text-[12px] text-amber-900">
                    ⚠️ {l}
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                <h4 className="text-[11px] font-semibold uppercase text-stone-400">Future Research Scope</h4>
                {paper.analysis.futureResearchDirections.map((f, i) => (
                  <div key={i} className="rounded-xl border border-indigo-100 bg-indigo-50/60 p-3 text-[12px] text-indigo-900">
                    🚀 {f}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#e7e5e0] px-6 py-4 bg-[#fafaf8]">
          <div className="flex items-center gap-2">
            <button
              onClick={() => { onAskCopilotAboutPaper(paper); onClose(); }}
              className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-[12px] font-semibold text-white transition hover:bg-indigo-700 shadow-sm"
            >
              <Sparkles size={14} /> Ask AI Copilot
            </button>
            <button
              onClick={() => onToggleCompare(paper)}
              className={`flex items-center gap-1 rounded-lg border px-3 py-2 text-[12px] font-medium transition ${
                isCompared ? 'border-indigo-200 bg-indigo-50 text-indigo-600' : 'border-[#e7e5e0] bg-white text-stone-600 hover:text-stone-900'
              }`}
            >
              <Columns size={13} /> {isCompared ? 'Compared' : 'Compare'}
            </button>
            <button
              onClick={() => onToggleBookmark(paper.id)}
              className={`rounded-lg p-2 transition ${paper.isBookmarked ? 'text-amber-500' : 'text-stone-400 hover:text-stone-600'}`}
            >
              <Bookmark size={15} className={paper.isBookmarked ? 'fill-current' : ''} />
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={copyBib}
              className="flex items-center gap-1 rounded-lg border border-[#e7e5e0] bg-white px-3 py-2 text-[12px] text-stone-600 transition hover:bg-stone-50">
              {copied ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
              {copied ? 'Copied!' : 'BibTeX'}
            </button>
            {paper.pdfUrl && (
              <a href={paper.pdfUrl} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 rounded-lg bg-stone-100 px-3.5 py-2 text-[12px] font-semibold text-stone-800 transition hover:bg-stone-200">
                PDF <ExternalLink size={13} />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
