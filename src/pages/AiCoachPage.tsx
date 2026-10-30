import { useState, useEffect, useRef } from 'react';
import { Bot, Send, AlertTriangle, Phone } from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import { Card } from '../components/ui/Card';
import { Spinner } from '../components/ui/Spinner';
import { askCoach } from '../api/coach';
import type { CoachMessage } from '../types';

const STARTERS = [
  'What is a Telegram task scam?',
  'How do I verify a company?',
  'I already paid, what do I do?',
];

export function AiCoachSection() {
  const [messages, setMessages] = useState<CoachMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showUrgentBanner, setShowUrgentBanner] = useState(false);
  const [relatedTopics, setRelatedTopics] = useState<string[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  async function send(question: string) {
    if (!question.trim()) return;
    const userMsg: CoachMessage = { role: 'user', text: question, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setRelatedTopics([]);
    setLoading(true);

    try {
      const res = await askCoach(question);
      const coachMsg: CoachMessage = { role: 'coach', text: res.reply, timestamp: Date.now() };
      setMessages(prev => [...prev, coachMsg]);
      setRelatedTopics(res.relatedTopics);
      if (res.urgency === 'high') setShowUrgentBanner(true);
    } catch {
      const errMsg: CoachMessage = {
        role: 'coach',
        text: 'Sorry, I could not connect right now. Please try again.',
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, errMsg]);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      void send(input);
    }
  }

  return (
    <div className="space-y-4 max-w-3xl">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
          <Bot className="w-5 h-5 text-amber-400" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-[#F8FAFC]">AI Safety Coach</h1>
          <p className="text-[#9CA3AF] text-sm">Ask anything about job scams, company verification, or getting help</p>
        </div>
      </div>

      {/* Urgent banner */}
      {showUrgentBanner && (
        <div className="flex items-center gap-3 px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-xl">
          <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-bold text-red-400">If you have already sent money, call 1930 immediately.</p>
            <p className="text-xs text-[#9CA3AF] mt-0.5">India's National Cybercrime Helpline — available 24×7</p>
          </div>
          <a
            href="tel:1930"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/20 border border-red-500/30 text-red-400 text-sm font-bold hover:bg-red-500/30 transition-colors shrink-0"
          >
            <Phone className="w-3.5 h-3.5" />
            1930
          </a>
        </div>
      )}

      {/* Starter questions */}
      {messages.length === 0 && (
        <Card>
          <p className="text-sm text-[#9CA3AF] mb-3 font-medium">Quick questions to get started:</p>
          <div className="flex flex-wrap gap-2">
            {STARTERS.map(q => (
              <button
                key={q}
                onClick={() => { void send(q); }}
                className="px-3 py-1.5 rounded-full border border-[rgba(245,158,11,0.2)] text-xs text-amber-400 hover:bg-amber-500/10 hover:border-amber-500/40 transition-colors"
              >
                {q}
              </button>
            ))}
          </div>
        </Card>
      )}

      {/* Chat area */}
      {messages.length > 0 && (
        <div className="bg-[#171A21] border border-[rgba(245,158,11,0.08)] rounded-2xl p-4 space-y-4 min-h-[300px] max-h-[500px] overflow-y-auto">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'coach' && (
                <div className="w-7 h-7 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mr-2 shrink-0 mt-0.5">
                  <Bot className="w-3.5 h-3.5 text-amber-400" />
                </div>
              )}
              <div
                className={`max-w-[82%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-amber-500 text-[#111318] font-medium rounded-br-sm'
                    : 'bg-[#20232B] text-[#D1D5DB] rounded-bl-sm border border-[rgba(245,158,11,0.08)]'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="w-7 h-7 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mr-2 shrink-0">
                <Bot className="w-3.5 h-3.5 text-amber-400" />
              </div>
              <div className="px-4 py-3 rounded-2xl rounded-bl-sm bg-[#20232B] border border-[rgba(245,158,11,0.08)]">
                <Spinner size="sm" />
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      )}

      {/* Related topics */}
      {relatedTopics.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <span className="text-xs text-[#9CA3AF] self-center">Related:</span>
          {relatedTopics.map(topic => (
            <button
              key={topic}
              onClick={() => { setInput(topic); void send(topic); }}
              className="px-3 py-1.5 rounded-full border border-[rgba(245,158,11,0.2)] text-xs text-amber-400 hover:bg-amber-500/10 hover:border-amber-500/40 transition-colors"
            >
              {topic}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="flex gap-3">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about scams, company verification, how to report fraud..."
          className="flex-1 bg-[#171A21] border border-[rgba(245,158,11,0.16)] rounded-xl px-4 py-3 text-sm text-[#F8FAFC] placeholder:text-[#4B5563] focus:outline-none focus:ring-2 focus:ring-amber-500/40"
          disabled={loading}
          aria-label="Ask the AI Safety Coach"
        />
        <button
          onClick={() => { void send(input); }}
          disabled={loading || !input.trim()}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 text-[#111318] font-bold text-sm hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shrink-0"
        >
          {loading ? <Spinner size="sm" /> : <Send className="w-4 h-4" />}
          Ask
        </button>
      </div>
    </div>
  );
}

export default function AiCoachPage() {
  return (
    <div className="min-h-screen bg-[#111318]">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <AiCoachSection />
      </main>
    </div>
  );
}
