import { useState, useEffect } from 'react';
import { AlertTriangle, ChevronDown, ChevronUp, ShieldCheck } from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Spinner } from '../components/ui/Spinner';
import { fetchScamPatterns } from '../api/intelligence';
import type { ScamPattern } from '../types';

const stageLabels: Record<string, string> = {
  initial_attraction: 'Initial Attraction',
  trust_building: 'Trust Building',
  small_task_payment: 'Small Task / Payment',
  prepaid_task_escalation: 'Prepaid Task Escalation',
  deposit_demand: 'Deposit Demand',
  withdrawal_blockage: 'Withdrawal Blockage',
};

const stageBadge: Record<string, 'info' | 'caution' | 'danger'> = {
  initial_attraction: 'info',
  trust_building: 'info',
  small_task_payment: 'caution',
  prepaid_task_escalation: 'caution',
  deposit_demand: 'danger',
  withdrawal_blockage: 'danger',
};

interface Props {
  standalone?: boolean;
}

function ScamIntelligenceContent() {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [patterns, setPatterns] = useState<ScamPattern[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchScamPatterns()
      .then(setPatterns)
      .catch((err: unknown) =>
        setError(err instanceof Error ? err.message : 'Failed to load patterns'),
      )
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center gap-4 py-20">
        <Spinner size="lg" />
        <p className="text-muted text-sm">Loading intelligence data…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-start gap-2 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm max-w-xl mx-auto mt-12">
        <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
        <span>{error}</span>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-extrabold text-primary mb-3">Scam Intelligence</h1>
        <p className="text-muted max-w-2xl">
          Learn about the most common job scam patterns targeting students, homemakers and
          first-time job seekers. Recognising these patterns is your first line of defence.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {patterns.map((pattern) => {
          const isOpen = expanded === pattern.id;
          return (
            <Card key={pattern.id} className="p-0 overflow-hidden">
              <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl" aria-hidden="true">
                      {pattern.emoji}
                    </span>
                    <div>
                      <h3 className="font-semibold text-primary text-sm">{pattern.title}</h3>
                      <Badge
                        variant={stageBadge[pattern.typicalStage] ?? 'neutral'}
                        size="sm"
                        className="mt-1"
                      >
                        Stage: {stageLabels[pattern.typicalStage] ?? pattern.typicalStage}
                      </Badge>
                    </div>
                  </div>
                  <button
                    onClick={() => setExpanded(isOpen ? null : pattern.id)}
                    className="shrink-0 text-muted hover:text-primary transition-colors p-1"
                    aria-expanded={isOpen}
                    aria-label={isOpen ? 'Hide details' : 'Show details'}
                  >
                    {isOpen ? (
                      <ChevronUp className="w-5 h-5" />
                    ) : (
                      <ChevronDown className="w-5 h-5" />
                    )}
                  </button>
                </div>
                <p className="text-muted text-sm mt-3 leading-relaxed">{pattern.description}</p>
              </div>

              <div
                className={`overflow-hidden transition-all duration-300 ${
                  isOpen ? 'max-h-96' : 'max-h-0'
                }`}
              >
                <div className="border-t border-white/5 p-5 space-y-4">
                  <div>
                    <h4 className="text-xs font-semibold text-caution uppercase tracking-wider mb-2 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      Warning Signs
                    </h4>
                    <ul className="space-y-1.5">
                      {pattern.warningSigns.map((sign) => (
                        <li key={sign} className="flex items-start gap-2 text-sm text-muted">
                          <span className="w-1.5 h-1.5 rounded-full bg-caution mt-1.5 shrink-0" />
                          {sign}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-success/10 border border-success/20 rounded-xl p-3">
                    <h4 className="text-xs font-semibold text-success uppercase tracking-wider mb-1 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" />
                      Safety Advice
                    </h4>
                    <p className="text-sm text-muted">{pattern.safetyAdvice}</p>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

export default function ScamIntelligencePage({ standalone = true }: Props) {
  if (!standalone) {
    return <ScamIntelligenceContent />;
  }
  return (
    <div className="min-h-screen flex flex-col bg-midnight">
      <Navbar />
      <main className="flex-1">
        <ScamIntelligenceContent />
      </main>
      <Footer />
    </div>
  );
}
