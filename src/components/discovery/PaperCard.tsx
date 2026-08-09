import React from 'react';
import { Bookmark, ExternalLink, FileText, Columns, Check } from 'lucide-react';
import { Paper, ViewMode } from '../../types/research';

interface PaperCardProps {
  paper: Paper;
  viewMode: ViewMode;
  onAnalyze: (paper: Paper) => void;
  onToggleBookmark: (paperId: string) => void;
  onToggleCompare: (paper: Paper) => void;
  isCompared: boolean;
}

export const PaperCard: React.FC<PaperCardProps> = ({
  paper,
  viewMode,
  onAnalyze,
  onToggleBookmark,
  onToggleCompare,
  isCompared,
}) => {
  if (viewMode === 'list') {
    return (
      <article className="paper-card flex items-start gap-4">
        {/* Match badge */}
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-[12px] font-bold text-indigo-600 font-mono">
          {paper.recommendationScore}%
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 space-y-1.5">
          <div className="flex items-center gap-2 text-[11px] text-stone-400">
            <span className="font-medium text-stone-500">{paper.journalOrConference}</span>
            <span>·</span>
            <span>{paper.publishedDate.split('-')[0]}</span>
            <span>·</span>
            <span className="font-mono">{paper.citationsCount.toLocaleString()} cites</span>
          </div>

          <h3
            onClick={() => onAnalyze(paper)}
            className="cursor-pointer font-serif text-[17px] leading-snug text-stone-900 transition hover:text-indigo-600 line-clamp-1"
          >
            {paper.title}
          </h3>

          <p className="text-[12px] text-stone-400 line-clamp-1">
            {paper.authors.slice(0, 4).join(', ')}{paper.authors.length > 4 ? ' et al.' : ''}
          </p>

          <p className="text-[12px] text-stone-500 leading-relaxed line-clamp-1">
            {paper.analysis.executiveSummary}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <button
            onClick={() => onAnalyze(paper)}
            className="rounded-lg bg-indigo-600 px-3 py-1.5 text-[11px] font-semibold text-white transition hover:bg-indigo-700"
          >
            Analyze
          </button>
          <button
            onClick={() => onToggleCompare(paper)}
            className={`rounded-lg border px-2.5 py-1.5 text-[11px] font-medium transition ${
              isCompared
                ? 'border-indigo-200 bg-indigo-50 text-indigo-600'
                : 'border-[#e7e5e0] text-stone-400 hover:text-stone-600'
            }`}
          >
            {isCompared ? <Check size={12} /> : <Columns size={12} />}
          </button>
          <button
            onClick={() => onToggleBookmark(paper.id)}
            className={`rounded-lg p-1.5 transition ${
              paper.isBookmarked ? 'text-amber-500' : 'text-stone-300 hover:text-stone-500'
            }`}
          >
            <Bookmark size={14} className={paper.isBookmarked ? 'fill-current' : ''} />
          </button>
        </div>
      </article>
    );
  }

  // Grid view
  return (
    <article className="paper-card flex flex-col space-y-3">
      <div className="flex items-center justify-between text-[11px]">
        <span className="text-stone-400">
          {paper.journalOrConference} · {paper.publishedDate.split('-')[0]}
        </span>
        <span className="rounded-md bg-indigo-50 px-2 py-0.5 font-mono font-semibold text-indigo-600">
          {paper.recommendationScore}%
        </span>
      </div>

      <h3
        onClick={() => onAnalyze(paper)}
        className="cursor-pointer font-serif text-[16px] leading-snug text-stone-900 transition hover:text-indigo-600 line-clamp-2"
      >
        {paper.title}
      </h3>

      <p className="text-[11px] text-stone-400 line-clamp-1">
        {paper.authors.slice(0, 3).join(', ')}{paper.authors.length > 3 ? ` +${paper.authors.length - 3}` : ''}
      </p>

      <p className="text-[12px] text-stone-500 leading-relaxed line-clamp-2">
        {paper.analysis.executiveSummary}
      </p>

      <div className="flex flex-wrap gap-1.5">
        {paper.categories.slice(0, 3).map((tag, i) => (
          <span key={i} className="rounded-md bg-stone-50 border border-stone-100 px-2 py-0.5 text-[10px] text-stone-400">
            {tag}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between border-t border-stone-100 pt-3">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onAnalyze(paper)}
            className="rounded-lg bg-indigo-600 px-3 py-1.5 text-[11px] font-semibold text-white transition hover:bg-indigo-700"
          >
            <FileText size={12} className="inline mr-1" />
            Analyze
          </button>
          <button
            onClick={() => onToggleCompare(paper)}
            className={`rounded-lg border px-2.5 py-1.5 text-[11px] font-medium transition ${
              isCompared
                ? 'border-indigo-200 bg-indigo-50 text-indigo-600'
                : 'border-[#e7e5e0] text-stone-400 hover:text-stone-600'
            }`}
          >
            {isCompared ? 'Added' : 'Compare'}
          </button>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onToggleBookmark(paper.id)}
            className={`rounded-lg p-1.5 transition ${paper.isBookmarked ? 'text-amber-500' : 'text-stone-300 hover:text-stone-500'}`}
          >
            <Bookmark size={14} className={paper.isBookmarked ? 'fill-current' : ''} />
          </button>
          <a href={paper.url} target="_blank" rel="noopener noreferrer" className="rounded-lg p-1.5 text-stone-300 hover:text-stone-500">
            <ExternalLink size={14} />
          </a>
        </div>
      </div>

      <div className="text-right text-[10px] font-mono text-stone-300">
        {paper.citationsCount.toLocaleString()} citations
      </div>
    </article>
  );
};
