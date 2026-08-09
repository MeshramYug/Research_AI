import React, { useState, useEffect, useRef } from 'react';
import { Navbar } from './components/layout/Navbar';
import { ResearchSearchArea } from './components/discovery/ResearchSearchArea';
import { AIResearchOverview } from './components/discovery/AIResearchOverview';
import { ResearchGapDetector } from './components/discovery/ResearchGapDetector';
import { RecommendationHub } from './components/discovery/RecommendationHub';
import { KnowledgeGraphCanvas } from './components/graph/KnowledgeGraphCanvas';
import { PaperComparator } from './components/analysis/PaperComparator';
import { LiteratureReviewExporter } from './components/analysis/LiteratureReviewExporter';
import { DeepPaperAnalyzer } from './components/analysis/DeepPaperAnalyzer';
import { AIChatCopilot } from './components/copilot/AIChatCopilot';

import { Paper, PaperSource, MainTabId, ResearchTopic } from './types/research';
import { CURATED_PAPERS } from './mockData/curatedPapers';
import {
  generateResearchTopicStrategy,
  generateAIResearchOverview,
  generateResearchGaps,
} from './services/aiSynthesisService';
import { searchArxivPapers } from './services/arxivService';
import { searchOpenAlexPapers } from './services/openAlexService';
import { searchGoogleScholarPapers } from './services/googleScholarService';
import { searchSemanticScholarPapers } from './services/semanticScholarService';

type SubTab = 'papers' | 'briefing' | 'gaps';

export const App: React.FC = () => {
  const [tab, setTab] = useState<MainTabId>('discover');
  const [subTab, setSubTab] = useState<SubTab>('papers');
  const [source, setSource] = useState<PaperSource>('curated');
  const [serpApiKey, setSerpApiKey] = useState(() => localStorage.getItem('SERPAPI_KEY') || '');

  const [topic, setTopic] = useState<ResearchTopic>(() =>
    generateResearchTopicStrategy('DeepSeek R1 reasoning & Transformer optimization')
  );

  const [papers, setPapers] = useState<Paper[]>(CURATED_PAPERS);
  const [loading, setLoading] = useState(false);

  const [selectedPaper, setSelectedPaper] = useState<Paper | null>(null);
  const [compareIds, setCompareIds] = useState<string[]>([
    CURATED_PAPERS[0].id,
    CURATED_PAPERS[1].id,
  ]);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatPaper, setChatPaper] = useState<Paper | null>(null);

  const searchRef = useRef<HTMLInputElement | null>(null);

  // ⌘K shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (tab !== 'discover') setTab('discover');
        setTimeout(() => searchRef.current?.focus(), 100);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [tab]);

  // Robust live paper search function across Curated, arXiv, OpenAlex, Semantic Scholar, and Google Scholar (SerpAPI)
  const fetchPapers = async (q: string, src: PaperSource = source) => {
    setLoading(true);
    let res: Paper[] = [];
    const queryClean = q.trim().toLowerCase();

    if (src === 'google_scholar') {
      const scholarResults = await searchGoogleScholarPapers(q, serpApiKey);
      if (scholarResults.length > 0) {
        res = scholarResults;
      } else {
        const [s2Res, arxivRes] = await Promise.all([
          searchSemanticScholarPapers(q),
          searchArxivPapers(q)
        ]);
        res = [...s2Res, ...arxivRes];
      }
    } else if (src === 'curated') {
      const curatedMatch = CURATED_PAPERS.filter(
        (p) =>
          p.title.toLowerCase().includes(queryClean) ||
          p.abstract.toLowerCase().includes(queryClean) ||
          p.categories.some((c) => c.toLowerCase().includes(queryClean)) ||
          p.authors.some((a) => a.toLowerCase().includes(queryClean))
      );

      if (curatedMatch.length > 0 && queryClean === 'deepseek r1 reasoning & transformer optimization') {
        res = curatedMatch;
      } else {
        const [s2Res, arxivRes, openAlexRes] = await Promise.all([
          searchSemanticScholarPapers(q),
          searchArxivPapers(q),
          searchOpenAlexPapers(q)
        ]);

        const combined = [...curatedMatch, ...s2Res, ...arxivRes, ...openAlexRes];

        const seenTitles = new Set<string>();
        const uniquePapers: Paper[] = [];

        combined.forEach(p => {
          const normTitle = p.title.toLowerCase().replace(/[^a-z0-9]/g, '');
          if (!seenTitles.has(normTitle)) {
            seenTitles.add(normTitle);
            uniquePapers.push(p);
          }
        });

        uniquePapers.sort((a, b) => b.recommendationScore - a.recommendationScore);
        res = uniquePapers.length > 0 ? uniquePapers : CURATED_PAPERS;
      }
    } else if (src === 'arxiv') {
      const r = await searchArxivPapers(q);
      res = r.length ? r : CURATED_PAPERS;
    } else if (src === 'openalex') {
      const r = await searchOpenAlexPapers(q);
      res = r.length ? r : CURATED_PAPERS;
    }

    setPapers(res);
    setLoading(false);
  };

  const updateTopic = (q: string, domain?: string) => {
    setTopic(generateResearchTopicStrategy(q, domain));
    fetchPapers(q, source);
  };

  const changeSource = (s: PaperSource) => {
    setSource(s);
    fetchPapers(topic.query, s);
  };

  const toggleBookmark = (id: string) =>
    setPapers((prev) => prev.map((p) => (p.id === id ? { ...p, isBookmarked: !p.isBookmarked } : p)));

  const toggleCompare = (paper: Paper) =>
    setCompareIds((prev) =>
      prev.includes(paper.id) ? prev.filter((id) => id !== paper.id) : [...prev, paper.id]
    );

  const askCopilot = (paper: Paper) => {
    setChatPaper(paper);
    setChatOpen(true);
  };

  const overview = generateAIResearchOverview(topic, papers);
  const gaps = generateResearchGaps(topic, papers);
  const compared = papers.filter((p) => compareIds.includes(p.id));

  const SUB_TABS: { key: SubTab; label: string; count?: number }[] = [
    { key: 'papers', label: 'Publications', count: papers.length },
    { key: 'briefing', label: 'AI Briefing' },
    { key: 'gaps', label: 'Research Gaps', count: gaps.length },
  ];

  return (
    <div className="min-h-screen bg-[#fafaf8] text-stone-800 flex">
      {/* Sidebar Navigation */}
      <Navbar
        activeTab={tab}
        onTabChange={setTab}
        activeSource={source}
        onSourceChange={changeSource}
        totalPapers={papers.length}
        selectedCompareCount={compareIds.length}
        onOpenAIChat={() => { setChatPaper(null); setChatOpen(true); }}
        onFocusSearch={() => { setTab('discover'); setTimeout(() => searchRef.current?.focus(), 100); }}
        onSaveSerpApiKey={(key) => setSerpApiKey(key)}
      />

      {/* Main Workspace Area (Margin Left 220px to accommodate fixed sidebar) */}
      <div className="flex-1 ml-[220px] min-h-screen">
        <main className="mx-auto max-w-5xl px-8 py-8 space-y-8">
          
          {/* ── Discover Tab ── */}
          {tab === 'discover' && (
            <div className="space-y-6">
              <ResearchSearchArea
                currentTopic={topic}
                onUpdateTopic={updateTopic}
                searchInputRef={searchRef}
              />

              {/* Sub-navigation tabs */}
              <div className="flex items-center gap-1.5 border-b border-[#e7e5e0] pb-2">
                {SUB_TABS.map((s) => (
                  <button
                    key={s.key}
                    onClick={() => setSubTab(s.key)}
                    className={`rounded-md px-3.5 py-1.5 text-[13px] font-medium transition ${
                      subTab === s.key
                        ? 'bg-stone-200/80 text-stone-900 font-semibold'
                        : 'text-stone-500 hover:text-stone-800 hover:bg-stone-100'
                    }`}
                  >
                    {s.label}
                    {s.count !== undefined && (
                      <span className="ml-1.5 text-[11px] font-mono text-stone-400">{s.count}</span>
                    )}
                  </button>
                ))}
              </div>

              {subTab === 'papers' && (
                <RecommendationHub
                  papers={papers}
                  isLoading={loading}
                  activeSource={source}
                  searchQuery={topic.query}
                  onSearch={(q) => fetchPapers(q, source)}
                  onAnalyze={setSelectedPaper}
                  onToggleBookmark={toggleBookmark}
                  onToggleCompare={toggleCompare}
                  comparedPaperIds={compareIds}
                />
              )}
              {subTab === 'briefing' && <AIResearchOverview overview={overview} />}
              {subTab === 'gaps' && <ResearchGapDetector gaps={gaps} />}
            </div>
          )}

          {/* ── Knowledge Mesh Tab ── */}
          {tab === 'graph' && (
            <KnowledgeGraphCanvas papers={papers} onSelectPaper={setSelectedPaper} />
          )}

          {/* ── Compare Tab ── */}
          {tab === 'compare' && (
            <div className="space-y-8">
              <PaperComparator
                comparedPapers={compared}
                onRemovePaper={(id) => setCompareIds((prev) => prev.filter((x) => x !== id))}
                onClearAll={() => setCompareIds([])}
                onAnalyze={setSelectedPaper}
                onGoToDiscovery={() => setTab('discover')}
              />
              <LiteratureReviewExporter topic={topic} papers={papers} />
            </div>
          )}

        </main>
      </div>

      {/* Deep Paper Analyzer Modal */}
      {selectedPaper && (
        <DeepPaperAnalyzer
          paper={selectedPaper}
          onClose={() => setSelectedPaper(null)}
          onToggleBookmark={toggleBookmark}
          onToggleCompare={toggleCompare}
          isCompared={compareIds.includes(selectedPaper.id)}
          onAskCopilotAboutPaper={askCopilot}
        />
      )}

      {/* AI Chat Copilot Drawer */}
      <AIChatCopilot
        isOpen={chatOpen}
        onClose={() => setChatOpen(false)}
        papers={papers}
        activePaper={chatPaper}
      />
    </div>
  );
};

export default App;
