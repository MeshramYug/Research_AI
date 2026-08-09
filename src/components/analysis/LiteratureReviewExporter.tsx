import React, { useState } from 'react';
import { Download, Copy, Check, FileText, BookOpen } from 'lucide-react';
import { ResearchTopic, Paper } from '../../types/research';
import { generateLiteratureReviewMarkdown } from '../../services/aiSynthesisService';

interface LiteratureReviewExporterProps {
  topic: ResearchTopic;
  papers: Paper[];
}

export const LiteratureReviewExporter: React.FC<LiteratureReviewExporterProps> = ({
  topic,
  papers,
}) => {
  const [copiedMd, setCopiedMd] = useState(false);

  const md = generateLiteratureReviewMarkdown(topic, papers);

  const copyMd = () => {
    navigator.clipboard.writeText(md);
    setCopiedMd(true);
    setTimeout(() => setCopiedMd(false), 2000);
  };

  const downloadMd = () => {
    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `review_${topic.query.replace(/[^a-zA-Z0-9]/g, '_')}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadBib = () => {
    let bib = '';
    papers.forEach((p) => {
      const key = p.authors[0]?.split(' ').pop()?.toLowerCase() + p.publishedDate.split('-')[0];
      bib += `@article{${key},\n  title={${p.title}},\n  author={${p.authors.join(' and ')}},\n  journal={${p.journalOrConference}},\n  year={${p.publishedDate.split('-')[0]}},\n  url={${p.url}}\n}\n\n`;
    });
    const blob = new Blob([bib], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `refs_${topic.query.replace(/[^a-zA-Z0-9]/g, '_')}.bib`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section className="space-y-4 animate-in">
      {/* Toolbar */}
      <div className="surface flex flex-wrap items-center justify-between gap-3 p-4">
        <div className="flex items-center gap-2.5">
          <BookOpen size={18} className="text-emerald-600" />
          <div>
            <h3 className="font-serif text-base font-semibold text-stone-900">Literature Review Synthesis</h3>
            <p className="text-[11px] text-stone-400">{papers.length} publications synthesized</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={copyMd}
            className="flex items-center gap-1.5 rounded-lg border border-[#e7e5e0] bg-white px-3 py-1.5 text-[12px] font-medium text-stone-600 transition hover:bg-stone-50">
            {copiedMd ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
            {copiedMd ? 'Copied!' : 'Copy Markdown'}
          </button>
          <button onClick={downloadMd}
            className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-1.5 text-[12px] font-semibold text-white transition hover:bg-indigo-700 shadow-sm">
            <Download size={13} /> Export .MD
          </button>
          <button onClick={downloadBib}
            className="flex items-center gap-1.5 rounded-lg border border-[#e7e5e0] bg-white px-3 py-1.5 text-[12px] font-medium text-stone-600 transition hover:bg-stone-50">
            <FileText size={13} /> Export .BIB
          </button>
        </div>
      </div>

      {/* Preview Box */}
      <div className="surface max-h-[500px] overflow-y-auto p-6">
        <pre className="whitespace-pre-wrap font-mono text-[12px] leading-relaxed text-stone-700 bg-stone-50 p-5 rounded-lg border border-stone-200">
          {md}
        </pre>
      </div>
    </section>
  );
};
