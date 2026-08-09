import { ResearchTopic, Paper, ChatMessage, AIOverview, ResearchGap } from '../types/research';

/**
 * Generates a dynamic AI-driven high level overview for a research query.
 */
export function generateAIResearchOverview(topic: ResearchTopic, papers: Paper[]): AIOverview {
  const query = topic.query || 'LLM Reasoning & Transformer Optimization';
  
  const keyConcepts = Array.from(new Set(
    papers.flatMap(p => p.categories).concat(
      query.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1))
    )
  )).filter(c => c.length > 2).slice(0, 5);

  const paperTitlesStr = papers.slice(0, 2).map(p => `"${p.title}"`).join(' and ');

  return {
    summary: `Literature synthesis on "${query}" reveals key advancements across ${papers.length} publications. Key highlights include findings from ${paperTitlesStr || 'recent preprints'}.`,
    keyConcepts: keyConcepts.length > 0 ? keyConcepts : ['Algorithmic Architecture', 'Empirical Benchmarks', 'Optimization', 'Scaling Laws', 'System Design'],
    researchDirection: `Shifting from conventional baselines towards domain-specific empirical optimization and scalable methodologies in ${topic.domain}.`,
    emergingTrends: [
      `Scaling efficiency in ${query}`,
      'Open-source dataset & code reproducibility',
      'Cross-domain benchmarking and validation'
    ],
    relevantPaperCount: papers.length
  };
}

/**
 * Generates AI-detected research gaps & opportunities.
 */
export function generateResearchGaps(topic: ResearchTopic, papers: Paper[]): ResearchGap[] {
  const query = topic.query || 'Research Topic';

  return [
    {
      id: 'gap-1',
      title: `Scalability & Efficiency in ${query}`,
      description: `Current models and algorithms for "${query}" encounter memory and computational bottlenecks when scaling to larger input contexts or real-time deployments.`,
      supportingPaperCount: Math.max(1, Math.floor(papers.length * 0.6)),
      maturity: 45,
      potentialOpportunity: `Opportunity to design sub-quadratic algorithms or hardware-aware kernels tailored to ${query}.`,
      category: 'System Architecture'
    },
    {
      id: 'gap-2',
      title: `Out-of-Distribution Generalization & Robustness`,
      description: `Evaluations in current literature heavily rely on standard benchmark datasets, leaving performance on noisy real-world data underspecified.`,
      supportingPaperCount: Math.max(1, Math.floor(papers.length * 0.4)),
      maturity: 38,
      potentialOpportunity: `Opportunity to introduce robust evaluation suites and synthetic data generation frameworks for ${query}.`,
      category: 'Evaluation & Benchmarking'
    },
    {
      id: 'gap-3',
      title: `Interpretability & Theoretical Guarantees`,
      description: `While empirical gains are substantial, theoretical upper bounds and mechanistic explanations for observed improvements remain incomplete.`,
      supportingPaperCount: Math.max(1, Math.floor(papers.length * 0.3)),
      maturity: 30,
      potentialOpportunity: `Formulate mathematical bounds and mechanistic interpretability probes for state-of-the-art models in ${query}.`,
      category: 'Theoretical AI'
    }
  ];
}

/**
 * Generates an automated AI Verdict when comparing multiple publications.
 */
export function generateAIComparisonVerdict(papers: Paper[]): string {
  if (papers.length === 0) return 'Select two or more papers to generate an AI comparison verdict.';
  if (papers.length === 1) return `Paper "${papers[0].title}" provides strong empirical foundations in ${papers[0].categories[0] || 'AI'}. Add another paper to compare.`;
  
  const p1 = papers[0];
  const p2 = papers[1];

  return `AI Verdict: "${p1.title}" (${p1.publishedDate.split('-')[0]}) establishes foundational architectural principles with citation impact (${p1.citationsCount.toLocaleString()} cites), whereas "${p2.title}" (${p2.publishedDate.split('-')[0]}) introduces targeted empirical optimizations delivering state-of-the-art benchmark results (${p2.analysis.keyMetricsAndResults[0]?.value || 'higher efficiency'}).`;
}

/**
 * Formulates a research strategy based on a raw user query.
 */
export function generateResearchTopicStrategy(query: string, domainHint?: string): ResearchTopic {
  const cleanQuery = query.trim() || 'Large Language Model Reasoning & Optimization';
  
  const domain = domainHint || (
    cleanQuery.toLowerCase().includes('bio') || cleanQuery.toLowerCase().includes('protein') || cleanQuery.toLowerCase().includes('dna') 
      ? 'Computational Biology & Molecular AI'
      : cleanQuery.toLowerCase().includes('quantum') 
      ? 'Quantum Information & Physics AI'
      : cleanQuery.toLowerCase().includes('vision') || cleanQuery.toLowerCase().includes('image') || cleanQuery.toLowerCase().includes('video')
      ? 'Computer Vision & Multimodal Intelligence'
      : 'Artificial Intelligence & Deep Learning'
  );

  return {
    query: cleanQuery,
    domain,
    subQuestions: [
      `What are the current architectural bottlenecks when scaling ${cleanQuery}?`,
      `How do modern state-of-the-art methods compare in computational efficiency and memory overhead?`,
      `What empirical benchmarks best evaluate robustness and out-of-distribution generalization?`,
      `Which emerging paradigms show the highest potential for next-generation breakthroughs?`
    ],
    keyTerms: [
      cleanQuery,
      'Attention Mechanism',
      'Benchmark Performance',
      'Scaling Laws',
      'Reinforcement Learning',
      'Optimization'
    ],
    hypotheses: [
      `Hypothesis 1: Targeted algorithmic optimization reduces computational complexity for ${cleanQuery}.`,
      `Hypothesis 2: Unsupervised / RL post-training enhances emergent reasoning stability across domain tasks.`,
      `Hypothesis 3: Custom hardware-aware implementation yields higher memory bandwidth utilization.`
    ]
  };
}

/**
 * Generates context-aware response for the AI Chat Copilot.
 */
export function generateAIChatResponse(
  userText: string,
  papers: Paper[],
  activePaper?: Paper
): ChatMessage {
  const textLower = userText.toLowerCase();
  let responseText = '';
  let refPaperIds: string[] = [];
  let followups: string[] = [];

  if (activePaper) {
    refPaperIds.push(activePaper.id);
    
    if (textLower.includes('summary') || textLower.includes('explain')) {
      responseText = `**Executive Summary of "${activePaper.title}"**:\n\n${activePaper.analysis.executiveSummary}\n\n**Core Innovations:**\n` +
        activePaper.analysis.noveltyAndContributions.map(c => `• ${c}`).join('\n');
      followups = ['Explain methodology', 'What are the main limitations?', 'Find related papers'];
    } 
    else if (textLower.includes('method') || textLower.includes('architecture')) {
      responseText = `**Methodology Breakdown for "${activePaper.title}"**:\n\n${activePaper.analysis.methodologyBreakdown}\n\n**Key Operational Metrics:**\n` +
        activePaper.analysis.keyMetricsAndResults.map(m => `• **${m.metricName}**: ${m.value} (${m.benchmark || 'N/A'})`).join('\n');
      followups = ['Show mathematical equations', 'Compare with other papers', 'Where can I find the code?'];
    }
    else if (textLower.includes('gap') || textLower.includes('limitation')) {
      responseText = `**Limitations & Identified Gaps in "${activePaper.title}"**:\n\n` +
        activePaper.analysis.limitations.map(l => `⚠️ ${l}`).join('\n') +
        `\n\n**Future Directions:**\n` +
        activePaper.analysis.futureResearchDirections.map(f => `🚀 ${f}`).join('\n');
      followups = ['Generate literature review', 'Compare with other indexed papers'];
    }
    else {
      responseText = `Regarding **"${activePaper.title}"**:\n\n${activePaper.abstract.slice(0, 320)}...\n\nHow else can I assist your analysis of this paper?`;
      followups = ['Summarize key contributions', 'Explain methodology details', 'Identify research gaps'];
    }
  } else {
    if (textLower.includes('gap')) {
      responseText = `**AI-Detected Research Gaps Across Current Literature**:\n\n1. **Inference Efficiency**: Memory & compute scaling bottlenecks.\n2. **Out-of-Distribution Robustness**: Lack of real-world stress testing.\n3. **Theoretical Interpretability**: Missing mathematical convergence bounds.\n\nWould you like me to drill into any specific gap?`;
      followups = ['Explore Inference Efficiency gap', 'Summarize indexed papers', 'Generate literature review'];
    } else if (papers.length > 0) {
      refPaperIds = papers.slice(0, 3).map(p => p.id);
      responseText = `Indexed **${papers.length} research publications** in workspace.\n\nTop matches:\n` +
        papers.slice(0, 3).map(p => `• **${p.title}** (${p.publishedDate.split('-')[0]}): ${p.citationsCount.toLocaleString()} citations`).join('\n\n') +
        `\n\nWhat topic or paper would you like me to analyze?`;
      followups = ['Identify potential research gaps', 'Which paper has highest citations?', 'Generate literature review'];
    } else {
      responseText = `Welcome to **ResearchAI Copilot**! Type a question or select a preset action below to begin your analysis.`;
      followups = ['Summarize DeepSeek R1', 'Explain FlashAttention-2', 'Compare Transformers vs Mamba'];
    }
  }

  return {
    id: `msg-${Date.now()}`,
    sender: 'ai',
    text: responseText,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    referencedPaperIds: refPaperIds,
    suggestedFollowups: followups
  };
}

/**
 * Generates Markdown Literature Review.
 */
export function generateLiteratureReviewMarkdown(topic: ResearchTopic, papers: Paper[]): string {
  const dateStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  
  let md = `# Literature Review: ${topic.query}\n`;
  md += `**Domain**: ${topic.domain}  \n`;
  md += `**Generated By**: ResearchAI Workspace | **Date**: ${dateStr}  \n\n`;
  
  md += `## 1. Executive Overview & Scope\n`;
  md += `This literature review synthesizes key developments across ${papers.length} state-of-the-art publications focusing on "${topic.query}".\n\n`;

  md += `## 2. Paper Analysis & Synthesis\n\n`;
  papers.forEach((p, idx) => {
    md += `### 2.${idx + 1} ${p.title} (${p.publishedDate.split('-')[0]})\n`;
    md += `**Authors**: ${p.authors.join(', ')}  \n`;
    md += `**Venue**: ${p.journalOrConference} | **Citations**: ${p.citationsCount.toLocaleString()}  \n`;
    md += `**Summary**: ${p.analysis.executiveSummary}\n\n`;
  });

  md += `## 3. Comparative Synthesis Matrix\n\n`;
  md += `| Paper Title | Year | Citations | Core Approach | Recommendation Match |\n`;
  md += `| :--- | :---: | :---: | :--- | :---: |\n`;
  papers.forEach(p => {
    md += `| **${p.title.slice(0, 32)}...** | ${p.publishedDate.split('-')[0]} | ${p.citationsCount} | ${p.categories[0] || 'AI'} | ${p.recommendationScore}% |\n`;
  });

  return md;
}
