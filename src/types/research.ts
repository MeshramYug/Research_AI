export type PaperSource = 'arxiv' | 'openalex' | 'curated' | 'pubmed' | 'google_scholar';

export interface KeyMetric {
  metricName: string;
  value: string;
  benchmark?: string;
}

export interface Formula {
  name: string;
  latex: string;
  description: string;
}

export interface PaperAnalysis {
  executiveSummary: string;
  noveltyAndContributions: string[];
  methodologyBreakdown: string;
  keyMetricsAndResults: KeyMetric[];
  equationsOrFormulas: Formula[];
  limitations: string[];
  futureResearchDirections: string[];
  codeUrl?: string;
  datasetUrl?: string;
}

export interface Paper {
  id: string;
  title: string;
  authors: string[];
  publishedDate: string;
  journalOrConference: string;
  abstract: string;
  url: string;
  pdfUrl?: string;
  citationsCount: number;
  categories: string[];
  source: PaperSource;
  recommendationScore: number; // e.g. 99, 94, 88
  recommendationReason: string;
  analysis: PaperAnalysis;
  isBookmarked?: boolean;
}

export interface ResearchTopic {
  query: string;
  domain: string;
  subQuestions: string[];
  keyTerms: string[];
  hypotheses: string[];
}

export interface AIOverview {
  summary: string;
  keyConcepts: string[];
  researchDirection: string;
  emergingTrends: string[];
  relevantPaperCount: number;
}

export interface ResearchGap {
  id: string;
  title: string;
  description: string;
  supportingPaperCount: number;
  maturity: number; // 0 to 100 percentage
  potentialOpportunity: string;
  category: string;
}

export interface KnowledgeNode {
  id: string;
  label: string;
  type: 'paper' | 'concept' | 'author' | 'method' | 'dataset' | 'institution';
  paperId?: string;
  x: number;
  y: number;
  vx?: number;
  vy?: number;
  color?: string;
  radius: number;
  citationsCount?: number;
  details?: {
    affiliation?: string;
    publicationYear?: string;
    coAuthors?: string[];
    relatedPapersCount?: number;
  };
}

export interface KnowledgeEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
  weight: number;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  referencedPaperIds?: string[];
  suggestedFollowups?: string[];
}

export type MainTabId = 'discover' | 'graph' | 'compare';
export type WorkflowStepId = MainTabId;
export interface WorkflowStep {
  id: WorkflowStepId;
  name: string;
  description: string;
  iconName: string;
}
export type ViewMode = 'grid' | 'list';
export type SortOption = 'relevance' | 'date' | 'citations';
