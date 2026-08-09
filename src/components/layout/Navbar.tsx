import React, { useState } from 'react';
import { Search, Network, Columns, Sparkles, BookOpen, Key, Check } from 'lucide-react';
import { PaperSource, MainTabId } from '../../types/research';

interface NavbarProps {
  activeTab: MainTabId;
  onTabChange: (tab: MainTabId) => void;
  activeSource: PaperSource;
  onSourceChange: (source: PaperSource) => void;
  totalPapers: number;
  selectedCompareCount: number;
  onOpenAIChat: () => void;
  onFocusSearch: () => void;
  onSaveSerpApiKey?: (key: string) => void;
}

const NAV_ITEMS: { id: MainTabId; label: string; icon: React.ReactNode }[] = [
  { id: 'discover', label: 'Discover', icon: <Search size={16} /> },
  { id: 'graph', label: 'Knowledge Graph', icon: <Network size={16} /> },
  { id: 'compare', label: 'Compare & Export', icon: <Columns size={16} /> },
];

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onTabChange,
  activeSource,
  onSourceChange,
  selectedCompareCount,
  onOpenAIChat,
  onFocusSearch,
  onSaveSerpApiKey
}) => {
  const [showKeyInput, setShowKeyInput] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState(() => localStorage.getItem('SERPAPI_KEY') || '');
  const [savedKey, setSavedKey] = useState(false);

  const handleSaveKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKeyInput.trim()) {
      localStorage.setItem('SERPAPI_KEY', apiKeyInput.trim());
      if (onSaveSerpApiKey) onSaveSerpApiKey(apiKeyInput.trim());
      setSavedKey(true);
      setTimeout(() => {
        setSavedKey(false);
        setShowKeyInput(false);
      }, 1500);
    }
  };

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-[220px] flex-col border-r border-[#e7e5e0] bg-[#f5f4f0]">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 pt-5 pb-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600">
          <BookOpen size={15} className="text-white" />
        </div>
        <span className="text-[15px] font-semibold text-stone-900 tracking-tight">
          Research<span className="text-indigo-600">AI</span>
        </span>
      </div>

      {/* Quick search */}
      <button
        onClick={onFocusSearch}
        className="mx-4 mb-4 flex items-center gap-2 rounded-lg border border-[#e7e5e0] bg-white px-3 py-2 text-[12px] text-stone-400 transition hover:border-stone-300"
      >
        <Search size={13} />
        <span className="flex-1 text-left">Search papers...</span>
        <kbd className="rounded border border-stone-200 bg-stone-50 px-1.5 py-0.5 text-[10px] font-mono text-stone-400">⌘K</kbd>
      </button>

      {/* Navigation */}
      <nav className="flex-1 space-y-0.5 px-3">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`sidebar-link w-full ${activeTab === item.id ? 'active' : ''}`}
          >
            {item.icon}
            <span>{item.label}</span>
            {item.id === 'compare' && selectedCompareCount > 0 && (
              <span className="ml-auto flex h-5 min-w-[20px] items-center justify-center rounded-full bg-indigo-100 text-[10px] font-semibold text-indigo-600">
                {selectedCompareCount}
              </span>
            )}
          </button>
        ))}
      </nav>

      {/* Source selector */}
      <div className="border-t border-[#e7e5e0] px-4 py-3 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-stone-400">Source</span>
          <button
            onClick={() => setShowKeyInput(!showKeyInput)}
            className="text-[10px] text-stone-400 hover:text-indigo-600 flex items-center gap-1"
            title="Configure SerpAPI Google Scholar key"
          >
            <Key size={10} /> Key
          </button>
        </div>

        {/* API Key Modal / Form */}
        {showKeyInput && (
          <form onSubmit={handleSaveKey} className="space-y-1.5 p-2 rounded-lg bg-white border border-[#e7e5e0]">
            <span className="text-[10px] text-stone-500 font-medium block">SerpAPI Key (Scholar)</span>
            <input
              type="password"
              value={apiKeyInput}
              onChange={(e) => setApiKeyInput(e.target.value)}
              placeholder="Paste SerpAPI Key..."
              className="w-full px-2 py-1 text-[11px] rounded border border-stone-200 focus:outline-none focus:border-indigo-500"
            />
            <button
              type="submit"
              className="w-full py-1 text-[10px] font-semibold text-white bg-indigo-600 rounded hover:bg-indigo-700 flex items-center justify-center gap-1"
            >
              {savedKey ? <><Check size={10} /> Saved!</> : 'Save Key'}
            </button>
          </form>
        )}

        <div className="grid grid-cols-2 gap-1">
          {(
            [
              { id: 'curated', label: 'Curated' },
              { id: 'arxiv', label: 'arXiv' },
              { id: 'openalex', label: 'OpenAlex' },
              { id: 'google_scholar', label: 'Scholar' }
            ] as const
          ).map((src) => (
            <button
              key={src.id}
              onClick={() => onSourceChange(src.id as PaperSource)}
              className={`rounded-md px-2 py-1 text-[10px] font-medium text-center transition ${
                activeSource === src.id
                  ? 'bg-indigo-100 text-indigo-700 font-semibold'
                  : 'text-stone-400 hover:text-stone-600 hover:bg-stone-100'
              }`}
            >
              {src.label}
            </button>
          ))}
        </div>
      </div>

      {/* AI Copilot button */}
      <div className="border-t border-[#e7e5e0] p-4">
        <button
          onClick={onOpenAIChat}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-[12px] font-semibold text-white transition hover:bg-indigo-700 shadow-sm"
        >
          <Sparkles size={14} />
          AI Copilot
        </button>
      </div>
    </aside>
  );
};
