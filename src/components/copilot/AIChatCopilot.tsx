import React, { useState } from 'react';
import { Sparkles, Send, Bot, User, X, ChevronRight } from 'lucide-react';
import { Paper, ChatMessage } from '../../types/research';
import { generateAIChatResponse } from '../../services/aiSynthesisService';

interface AIChatCopilotProps {
  isOpen: boolean;
  onClose: () => void;
  papers: Paper[];
  activePaper: Paper | null;
}

const PRESETS = [
  'Summarize this paper',
  'Explain methodology',
  'Identify research gaps',
  'Generate literature review',
  'Compare papers',
];

export const AIChatCopilot: React.FC<AIChatCopilotProps> = ({
  isOpen,
  onClose,
  papers,
  activePaper,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init',
      sender: 'ai',
      text: activePaper
        ? `I'm ready to analyze **"${activePaper.title}"**. What would you like to know?`
        : `I have ${papers.length} publications indexed. Ask me anything or pick a preset below.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestedFollowups: activePaper
        ? ['Summarize this paper', 'Explain methodology', 'Identify research gaps']
        : ['Identify research gaps', 'Generate literature review', 'Compare papers'],
    },
  ]);
  const [input, setInput] = useState('');

  if (!isOpen) return null;

  const send = (text?: string) => {
    const msg = text || input;
    if (!msg.trim()) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: msg.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updated = [...messages, userMsg];
    setMessages(updated);
    if (!text) setInput('');

    setTimeout(() => {
      const reply = generateAIChatResponse(msg, papers, activePaper || undefined);
      setMessages([...updated, reply]);
    }, 300);
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 flex w-full flex-col border-l border-[#e7e5e0] bg-white shadow-xl sm:w-[400px]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#e7e5e0] px-5 py-4 bg-[#fafaf8]">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600">
            <Sparkles size={15} className="text-white" />
          </div>
          <div>
            <h3 className="font-serif text-[15px] font-semibold text-stone-900">AI Copilot</h3>
            <p className="text-[11px] text-stone-400">
              {activePaper ? activePaper.title.slice(0, 28) + '...' : `${papers.length} papers indexed`}
            </p>
          </div>
        </div>
        <button onClick={onClose} className="rounded-lg p-1.5 text-stone-400 transition hover:bg-stone-100 hover:text-stone-700">
          <X size={18} />
        </button>
      </div>

      {/* Presets */}
      <div className="flex gap-1.5 overflow-x-auto border-b border-[#e7e5e0] px-4 py-2.5 bg-stone-50">
        {PRESETS.map((p, i) => (
          <button
            key={i}
            onClick={() => send(p)}
            className="flex-shrink-0 rounded-md border border-[#e7e5e0] bg-white px-2.5 py-1 text-[11px] font-medium text-stone-600 transition hover:border-indigo-300 hover:text-indigo-600 shadow-2xs"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Messages */}
      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-2.5 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div
              className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg text-white ${
                msg.sender === 'user' ? 'bg-indigo-600' : 'bg-stone-800'
              }`}
            >
              {msg.sender === 'user' ? <User size={13} /> : <Bot size={13} />}
            </div>
            <div
              className={`max-w-[85%] space-y-2 rounded-xl px-3.5 py-2.5 text-[12px] leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-indigo-600 text-white'
                  : 'border border-[#e7e5e0] bg-[#fafaf8] text-stone-800'
              }`}
            >
              <div className="whitespace-pre-wrap">{msg.text}</div>

              {msg.suggestedFollowups && msg.suggestedFollowups.length > 0 && (
                <div className="space-y-1 pt-1.5 border-t border-stone-200/60">
                  {msg.suggestedFollowups.map((f, i) => (
                    <button
                      key={i}
                      onClick={() => send(f)}
                      className="flex w-full items-center justify-between rounded-md border border-[#e7e5e0] bg-white px-2.5 py-1 text-[11px] font-medium text-stone-600 transition hover:text-indigo-600 hover:border-indigo-200"
                    >
                      <span>{f}</span>
                      <ChevronRight size={12} />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <form
        onSubmit={(e) => { e.preventDefault(); send(); }}
        className="flex items-center gap-2 border-t border-[#e7e5e0] p-4 bg-[#fafaf8]"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about papers, methods, or gaps..."
          className="flex-1 rounded-lg border border-[#e7e5e0] bg-white px-3 py-2 text-[12px] text-stone-800 placeholder-stone-400 outline-none transition focus:border-indigo-400"
        />
        <button
          type="submit"
          className="rounded-lg bg-indigo-600 p-2.5 text-white transition hover:bg-indigo-700 shadow-sm"
        >
          <Send size={14} />
        </button>
      </form>
    </div>
  );
};
