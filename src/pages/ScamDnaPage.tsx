import { useState } from 'react';
import { AlertTriangle, Activity, ShieldCheck, Zap } from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Spinner } from '../components/ui/Spinner';
import { analyzeBehavior } from '../api/dna';
import type { DnaAnalysisResult, BehavioralSignal, RiskLevel } from '../types';

const riskBadge: Record<RiskLevel, 'success' | 'caution' | 'danger'> = {
  SAFE: 'success',
  SUSPICIOUS: 'caution',
  HIGH_RISK: 'danger',
};
const riskLabel: Record<RiskLevel, string> = {
  SAFE: 'Safe',
  SUSPICIOUS: 'Suspicious',
  HIGH_RISK: 'High Risk',
};

const categoryBadgeVariant: Record<BehavioralSignal['category'], 'danger' | 'info' | 'caution' | 'neutral' | 'success'> = {
  urgency: 'danger',
  authority: 'info',
  isolation: 'neutral',
  financial: 'caution',
  trust: 'success',
};

const categoryLabel: Record<BehavioralSignal['category'], string> = {
  urgency: 'Urgency',
  authority: 'Authority',
  isolation: 'Isolation',
  financial: 'Financial',
  trust: 'Trust',
};

function ScoreBar({ score }: { score: number }) {
  const color =
    score <= 40 ? 'bg-emerald-500' : score <= 70 ? 'bg-amber-400' : 'bg-red-500';
  const label =
    score <= 40 ? 'Low Risk' : score <= 70 ? 'Moderate Risk' : 'High Risk';
  const textColor =
    score <= 40 ? 'text-emerald-400' : score <= 70 ? 'text-amber-400' : 'text-red-400';
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm text-[#9CA3AF]">Behavioral Manipulation Score</span>
        <span className={`text-2xl font-extrabold ${textColor}`}>{score}/100</span>
      </div>
      <div className="w-full bg-[#111318] rounded-full h-3 overflow-hidden">
        <div
          className={`h-3 rounded-full transition-all duration-700 ${color}`}
          style={{ width: `${score}%` }}
          role="progressbar"
          aria-valuenow={score}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
      <p className={`text-xs font-semibold ${textColor}`}>{label}</p>
    </div>
  );
}

export function ScamDnaSection() {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DnaAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleAnalyze() {
    if (!text.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const data = await analyzeBehavior(text);
      setResult(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Analysis failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
            <Activity className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-[#F8FAFC]">Scam DNA Analyzer</h1>
            <p className="text-[#9CA3AF] text-sm">Detect behavioural manipulation patterns in any text</p>
          </div>
        </div>
      </div>

      {/* Input */}
      <Card>
        <label htmlFor="dna-text" className="block text-sm font-semibold text-[#F8FAFC] mb-2">
          Paste message, job post, or chat
        </label>
        <textarea
          id="dna-text"
          value={text}
          onChange={e => setText(e.target.value)}
          rows={7}
          placeholder="Paste the suspicious text here — a job offer, WhatsApp message, Telegram chat, or email..."
          className="w-full bg-[#111318] border border-[rgba(245,158,11,0.16)] rounded-xl px-4 py-3 text-sm text-[#F8FAFC] placeholder:text-[#4B5563] focus:outline-none focus:ring-2 focus:ring-amber-500/40 resize-none"
        />
        <div className="mt-4 flex items-center gap-3">
          <button
            onClick={handleAnalyze}
            disabled={loading || !text.trim()}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 text-[#111318] font-bold text-sm hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? <Spinner size="sm" /> : <Zap className="w-4 h-4" />}
            Analyze Behavior
          </button>
          {result && (
            <button
              onClick={() => { setResult(null); setText(''); }}
              className="text-sm text-[#9CA3AF] hover:text-[#F8FAFC] transition-colors"
            >
              Clear
            </button>
          )}
        </div>
      </Card>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-3 px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      {/* Result */}
      {result && (
        <div className="space-y-4">
          {/* Score */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-[#9CA3AF] font-semibold uppercase tracking-wider">Behavioral Risk Level</span>
              <Badge variant={riskBadge[result.riskLevel]}>{riskLabel[result.riskLevel]}</Badge>
            </div>
            <ScoreBar score={result.behavioralScore} />
          </Card>

          {/* Primary tactic */}
          <Card variant="highlight">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-400 mt-0.5 shrink-0" />
              <div className="space-y-1">
                <p className="text-xs text-[#9CA3AF] uppercase tracking-wider font-semibold">Primary Tactic Detected</p>
                <p className="font-bold text-[#F8FAFC]">{result.primaryTactic}</p>
                <p className="text-sm text-[#9CA3AF]">{result.vulnerabilityWarning}</p>
              </div>
            </div>
          </Card>

          {/* Detected tactics */}
          {result.manipulationTactics.length > 0 ? (
            <Card>
              <h3 className="font-semibold text-[#F8FAFC] mb-4">
                Manipulation Tactics Detected ({result.manipulationTactics.length})
              </h3>
              <div className="space-y-3">
                {result.manipulationTactics.map(tactic => (
                  <div
                    key={tactic.id}
                    className="flex items-start gap-3 p-3 rounded-xl bg-[#111318] border border-[rgba(245,158,11,0.08)]"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="font-semibold text-sm text-[#F8FAFC]">{tactic.label}</span>
                        <Badge variant={categoryBadgeVariant[tactic.category]} size="sm">
                          {categoryLabel[tactic.category]}
                        </Badge>
                        <span className="text-xs text-[#9CA3AF]">weight: {tactic.weight}</span>
                      </div>
                      <p className="text-xs text-[#9CA3AF]">{tactic.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          ) : (
            <Card>
              <div className="flex items-center gap-3 text-emerald-400">
                <ShieldCheck className="w-5 h-5" />
                <span className="text-sm font-semibold">No manipulation tactics detected in this text.</span>
              </div>
            </Card>
          )}

          {/* Recommendation */}
          <Card>
            <p className="text-xs text-[#9CA3AF] uppercase tracking-wider font-semibold mb-2">Recommendation</p>
            <p className="text-sm text-[#F8FAFC]">{result.recommendation}</p>
          </Card>
        </div>
      )}
    </div>
  );
}

export default function ScamDnaPage() {
  return (
    <div className="min-h-screen bg-[#111318]">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <ScamDnaSection />
      </main>
    </div>
  );
}
