import { useState } from 'react';
import { Link2, AlertTriangle, ShieldCheck, Search } from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Spinner } from '../components/ui/Spinner';
import { inspectLink } from '../api/links';
import type { LinkInspectionResult } from '../types';

const riskBadgeVariant: Record<string, 'success' | 'caution' | 'danger'> = {
  SAFE: 'success',
  SUSPICIOUS: 'caution',
  HIGH_RISK: 'danger',
};

const riskLabel: Record<string, string> = {
  SAFE: 'Safe',
  SUSPICIOUS: 'Suspicious',
  HIGH_RISK: 'High Risk',
};

export function LinkInspectorSection() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<LinkInspectionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleInspect() {
    if (!url.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const data = await inspectLink(url.trim());
      setResult(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Inspection failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') void handleInspect();
  }

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
            <Link2 className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-[#F8FAFC]">Smart Link Inspector</h1>
            <p className="text-[#9CA3AF] text-sm">Analyze any URL for phishing and suspicious signals</p>
          </div>
        </div>
      </div>

      {/* Input */}
      <Card>
        <label htmlFor="link-url" className="block text-sm font-semibold text-[#F8FAFC] mb-2">
          Enter URL to inspect
        </label>
        <div className="flex gap-3">
          <input
            id="link-url"
            type="text"
            value={url}
            onChange={e => setUrl(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="https://example.com or paste any suspicious link..."
            className="flex-1 bg-[#111318] border border-[rgba(245,158,11,0.16)] rounded-xl px-4 py-3 text-sm text-[#F8FAFC] placeholder:text-[#4B5563] focus:outline-none focus:ring-2 focus:ring-amber-500/40"
          />
          <button
            onClick={handleInspect}
            disabled={loading || !url.trim()}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 text-[#111318] font-bold text-sm hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shrink-0"
          >
            {loading ? <Spinner size="sm" /> : <Search className="w-4 h-4" />}
            Inspect
          </button>
        </div>
        {result && (
          <button
            onClick={() => { setResult(null); setUrl(''); }}
            className="mt-3 text-sm text-[#9CA3AF] hover:text-[#F8FAFC] transition-colors"
          >
            ← Inspect another URL
          </button>
        )}
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
          {/* Risk banner */}
          <div
            className={`flex items-center justify-between p-4 rounded-xl border ${
              result.riskLevel === 'SAFE'
                ? 'bg-emerald-500/10 border-emerald-500/30'
                : result.riskLevel === 'SUSPICIOUS'
                ? 'bg-amber-500/10 border-amber-500/30'
                : 'bg-red-500/10 border-red-500/30'
            }`}
          >
            <div className="flex items-center gap-3">
              {result.riskLevel === 'SAFE'
                ? <ShieldCheck className="w-5 h-5 text-emerald-400" />
                : <AlertTriangle className={`w-5 h-5 ${result.riskLevel === 'HIGH_RISK' ? 'text-red-400' : 'text-amber-400'}`} />
              }
              <div>
                <p className="text-xs text-[#9CA3AF] mb-0.5">Analyzed URL</p>
                <p className="text-sm font-medium text-[#F8FAFC] break-all">{result.url}</p>
              </div>
            </div>
            <Badge variant={riskBadgeVariant[result.riskLevel]}>
              {riskLabel[result.riskLevel]}
            </Badge>
          </div>

          {/* Findings */}
          {result.findings.length > 0 ? (
            <Card>
              <h3 className="font-semibold text-[#F8FAFC] mb-4">
                Issues Found ({result.findings.length})
              </h3>
              <ul className="space-y-3">
                {result.findings.map((finding, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                    <span className="text-sm text-[#D1D5DB]">{finding}</span>
                  </li>
                ))}
              </ul>
            </Card>
          ) : (
            <Card>
              <div className="flex items-center gap-3 text-emerald-400">
                <ShieldCheck className="w-5 h-5" />
                <span className="text-sm font-semibold">No suspicious indicators found in this URL.</span>
              </div>
            </Card>
          )}

          {/* Meta */}
          <div className="grid grid-cols-2 gap-3">
            <Card className="!p-4">
              <p className="text-xs text-[#9CA3AF] mb-1">Domain Age</p>
              <p className="text-sm font-semibold text-[#F8FAFC]">{result.domainAge}</p>
            </Card>
            <Card className="!p-4">
              <p className="text-xs text-[#9CA3AF] mb-1">Redirect Count</p>
              <p className="text-sm font-semibold text-[#F8FAFC]">{result.redirectCount}</p>
            </Card>
          </div>

          {/* Recommendation */}
          <Card variant="highlight">
            <p className="text-xs text-[#9CA3AF] uppercase tracking-wider font-semibold mb-2">Recommendation</p>
            <p className="text-sm text-[#F8FAFC]">{result.recommendation}</p>
          </Card>
        </div>
      )}
    </div>
  );
}

export default function LinkInspectorPage() {
  return (
    <div className="min-h-screen bg-[#111318]">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <LinkInspectorSection />
      </main>
    </div>
  );
}
