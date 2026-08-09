import React, { useState } from 'react';
import { Search, Sparkles } from 'lucide-react';
import { ResearchTopic } from '../../types/research';

interface TopicExplorerProps {
  currentTopic: ResearchTopic;
  onUpdateTopic: (query: string, domain?: string) => void;
}

const PRESETS = [
  { label: '🔥 DeepSeek R1 Reasoning', query: 'DeepSeek R1 reasoning RL alignment' },
  { label: '⚡ Transformer & FlashAttention', query: 'FlashAttention linear state space models Mamba' },
  { label: '🧬 AlphaFold 3 Structure', query: 'AlphaFold 3 protein ligand structure prediction' },
  { label: '⚛️ Quantum ML Benchmarks', query: 'Quantum neural networks variational circuit optimization' }
];

export const TopicExplorer: React.FC<TopicExplorerProps> = ({
  currentTopic,
  onUpdateTopic
}) => {
  const [queryInput, setQueryInput] = useState(currentTopic.query);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (queryInput.trim()) {
      onUpdateTopic(queryInput.trim());
    }
  };

  return (
    <div className="bg-[#fafaf8] rounded-xl p-4 border border-[#e7e5e0] space-y-3">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-stone-400" />
          <input
            type="text"
            value={queryInput}
            onChange={(e) => setQueryInput(e.target.value)}
            placeholder="Ask a research question..."
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-white border border-stone-200 text-stone-800 text-xs focus:outline-none focus:border-indigo-500"
          />
        </div>
        <button
          type="submit"
          className="flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Research</span>
        </button>
      </form>
    </div>
  );
};
