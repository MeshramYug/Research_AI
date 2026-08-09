import React, { useState } from 'react';
import { Search, ArrowRight } from 'lucide-react';
import { ResearchTopic } from '../../types/research';

interface ResearchSearchAreaProps {
  currentTopic: ResearchTopic;
  onUpdateTopic: (query: string, domain?: string) => void;
  searchInputRef?: React.RefObject<HTMLInputElement | null>;
}

const SUGGESTIONS = [
  { label: 'Transformer Optimization', q: 'FlashAttention linear state space models Mamba' },
  { label: 'LLM Reasoning', q: 'DeepSeek R1 reasoning RL alignment' },
  { label: 'Protein Folding', q: 'AlphaFold 3 protein ligand structure prediction' },
  { label: 'RAG Systems', q: 'Retrieval Augmented Generation hybrid search' },
];

export const ResearchSearchArea: React.FC<ResearchSearchAreaProps> = ({
  currentTopic,
  onUpdateTopic,
  searchInputRef,
}) => {
  const [query, setQuery] = useState(currentTopic.query);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) onUpdateTopic(query.trim());
  };

  return (
    <section className="space-y-4 animate-in">
      <div className="space-y-1">
        <h1 className="font-serif text-3xl text-stone-900">Discover Research</h1>
        <p className="text-[13px] text-stone-400">
          Search across papers, analyze methods, and map knowledge connections.
        </p>
      </div>

      {/* Search bar */}
      <form
        onSubmit={submit}
        className="flex items-center gap-3 rounded-xl border border-[#e7e5e0] bg-white px-4 py-2.5 transition focus-within:border-indigo-300 focus-within:ring-2 focus-within:ring-indigo-100"
      >
        <Search size={16} className="flex-shrink-0 text-stone-300" />
        <input
          ref={searchInputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search topics, papers, or ask a question..."
          className="flex-1 bg-transparent text-[14px] text-stone-800 placeholder-stone-400 outline-none"
        />
        <button
          type="submit"
          className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-1.5 text-[12px] font-semibold text-white transition hover:bg-indigo-700"
        >
          Search <ArrowRight size={13} />
        </button>
      </form>

      {/* Suggestions */}
      <div className="flex flex-wrap gap-2">
        {SUGGESTIONS.map((s) => (
          <button
            key={s.label}
            onClick={() => { setQuery(s.q); onUpdateTopic(s.q); }}
            className="rounded-full border border-[#e7e5e0] bg-white px-3 py-1 text-[11px] font-medium text-stone-500 transition hover:border-indigo-200 hover:text-indigo-600"
          >
            {s.label}
          </button>
        ))}
      </div>
    </section>
  );
};
