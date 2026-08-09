import React, { useState } from 'react';
import { LayoutGrid, List, ArrowUpDown, Sparkles } from 'lucide-react';
import { Paper, PaperSource, ViewMode, SortOption } from '../../types/research';
import { PaperCard } from './PaperCard';

interface RecommendationHubProps {
  papers: Paper[];
  isLoading: boolean;
  activeSource: PaperSource;
  searchQuery: string;
  onSearch: (query: string) => void;
  onAnalyze: (paper: Paper) => void;
  onToggleBookmark: (paperId: string) => void;
  onToggleCompare: (paper: Paper) => void;
  comparedPaperIds: string[];
}

type FilterMode = 'all' | 'top' | 'recent' | 'cited' | 'saved';

export const RecommendationHub: React.FC<RecommendationHubProps> = ({
  papers, isLoading, onAnalyze, onToggleBookmark, onToggleCompare, comparedPaperIds,
}) => {
  const [filter, setFilter] = useState<FilterMode>('all');
  const [sort, setSort] = useState<SortOption>('relevance');
  const [view, setView] = useState<ViewMode>('list');

  let list = papers.filter((p) => {
    if (filter === 'top') return p.recommendationScore >= 95;
    if (filter === 'recent') return parseInt(p.publishedDate) >= 2024;
    if (filter === 'cited') return p.citationsCount >= 1000;
    if (filter === 'saved') return p.isBookmarked;
    return true;
  });

  list = [...list].sort((a, b) => {
    if (sort === 'date') return new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime();
    if (sort === 'citations') return b.citationsCount - a.citationsCount;
    return b.recommendationScore - a.recommendationScore;
  });

  const FILTERS: { key: FilterMode; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'top', label: 'Top Match' },
    { key: 'recent', label: '2024+' },
    { key: 'cited', label: 'Highly Cited' },
    { key: 'saved', label: 'Saved' },
  ];

  return (
    <section className="space-y-4 animate-in">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-1 rounded-lg border border-[#e7e5e0] bg-white p-1">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`rounded-md px-3 py-1.5 text-[11px] font-medium transition ${
                filter === f.key
                  ? 'bg-stone-100 text-stone-800'
                  : 'text-stone-400 hover:text-stone-600'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 rounded-lg border border-[#e7e5e0] bg-white px-3 py-1.5">
            <ArrowUpDown size={12} className="text-stone-400" />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortOption)}
              className="bg-transparent text-[11px] font-medium text-stone-600 outline-none"
            >
              <option value="relevance">Relevance</option>
              <option value="citations">Citations</option>
              <option value="date">Date</option>
            </select>
          </div>

          <div className="flex rounded-lg border border-[#e7e5e0] bg-white p-0.5">
            <button
              onClick={() => setView('list')}
              className={`rounded-md p-1.5 transition ${view === 'list' ? 'bg-stone-100 text-stone-700' : 'text-stone-300'}`}
            >
              <List size={14} />
            </button>
            <button
              onClick={() => setView('grid')}
              className={`rounded-md p-1.5 transition ${view === 'grid' ? 'bg-stone-100 text-stone-700' : 'text-stone-300'}`}
            >
              <LayoutGrid size={14} />
            </button>
          </div>
        </div>
      </div>

      <p className="text-[11px] text-stone-400">{list.length} papers</p>

      {/* Loading */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="paper-card animate-pulse space-y-3">
              <div className="h-3 w-32 rounded bg-stone-100" />
              <div className="h-5 w-3/4 rounded bg-stone-100" />
              <div className="h-3 w-1/2 rounded bg-stone-100" />
            </div>
          ))}
        </div>
      ) : list.length === 0 ? (
        <div className="flex flex-col items-center py-16 text-center">
          <Sparkles size={28} className="mb-3 text-stone-200" />
          <p className="text-[13px] text-stone-400">No papers match this filter.</p>
        </div>
      ) : (
        <div className={view === 'grid' ? 'grid grid-cols-1 gap-4 lg:grid-cols-2' : 'space-y-3'}>
          {list.map((paper) => (
            <PaperCard
              key={paper.id}
              paper={paper}
              viewMode={view}
              onAnalyze={onAnalyze}
              onToggleBookmark={onToggleBookmark}
              onToggleCompare={onToggleCompare}
              isCompared={comparedPaperIds.includes(paper.id)}
            />
          ))}
        </div>
      )}
    </section>
  );
};
