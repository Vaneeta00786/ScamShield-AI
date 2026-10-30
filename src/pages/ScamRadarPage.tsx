import { useState, useEffect } from 'react';
import { Radio, ThumbsUp, AlertTriangle, Plus, MapPin, Smartphone } from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Spinner } from '../components/ui/Spinner';
import { getRadarReports, submitRadarReport, upvoteReport } from '../api/radar';
import type { RadarReport } from '../types';

function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor(diff / 3600000);
  const mins = Math.floor(diff / 60000);
  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  return `${mins}m ago`;
}

const scamTypeBadgeVariant = (type: string): 'danger' | 'caution' | 'info' | 'neutral' => {
  const t = type.toLowerCase();
  if (t.includes('fraud') || t.includes('phish')) return 'danger';
  if (t.includes('job') || t.includes('scam') || t.includes('fake')) return 'caution';
  if (t.includes('invest')) return 'info';
  return 'neutral';
};

export function ScamRadarSection() {
  const [reports, setReports] = useState<RadarReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [upvotingId, setUpvotingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [form, setForm] = useState({ scamType: '', platform: '', location: '', description: '' });

  useEffect(() => {
    getRadarReports()
      .then(setReports)
      .catch(() => setReports([]))
      .finally(() => setLoading(false));
  }, []);

  async function handleUpvote(id: string) {
    setUpvotingId(id);
    try {
      const updated = await upvoteReport(id);
      setReports(prev => prev.map(r => r.id === id ? updated : r));
    } catch {
      // silent
    } finally {
      setUpvotingId(null);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.scamType || !form.platform || !form.location || !form.description) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const newReport = await submitRadarReport(form);
      setReports(prev => [newReport, ...prev]);
      setForm({ scamType: '', platform: '', location: '', description: '' });
      setShowForm(false);
    } catch (e) {
      setSubmitError(e instanceof Error ? e.message : 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
            <Radio className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-[#F8FAFC]">Scam Radar</h1>
            <p className="text-[#9CA3AF] text-sm">Community-reported scam intelligence</p>
          </div>
        </div>
        <button
          onClick={() => setShowForm(v => !v)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 text-[#111318] font-bold text-sm hover:bg-amber-400 transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          Report Scam
        </button>
      </div>

      {/* Submit form */}
      {showForm && (
        <Card>
          <h3 className="font-semibold text-[#F8FAFC] mb-4">Submit a Scam Report</h3>
          <form onSubmit={e => { void handleSubmit(e); }} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-[#9CA3AF] mb-1.5 font-medium">Scam Type *</label>
                <input
                  type="text"
                  value={form.scamType}
                  onChange={e => setForm(prev => ({ ...prev, scamType: e.target.value }))}
                  placeholder="e.g. Task Scam, Job Fraud"
                  className="w-full bg-[#111318] border border-[rgba(245,158,11,0.16)] rounded-xl px-3 py-2.5 text-sm text-[#F8FAFC] placeholder:text-[#4B5563] focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                  required
                />
              </div>
              <div>
                <label className="block text-xs text-[#9CA3AF] mb-1.5 font-medium">Platform *</label>
                <input
                  type="text"
                  value={form.platform}
                  onChange={e => setForm(prev => ({ ...prev, platform: e.target.value }))}
                  placeholder="e.g. Telegram, WhatsApp"
                  className="w-full bg-[#111318] border border-[rgba(245,158,11,0.16)] rounded-xl px-3 py-2.5 text-sm text-[#F8FAFC] placeholder:text-[#4B5563] focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-xs text-[#9CA3AF] mb-1.5 font-medium">Location *</label>
              <input
                type="text"
                value={form.location}
                onChange={e => setForm(prev => ({ ...prev, location: e.target.value }))}
                placeholder="City or region (e.g. Mumbai, Pan India)"
                className="w-full bg-[#111318] border border-[rgba(245,158,11,0.16)] rounded-xl px-3 py-2.5 text-sm text-[#F8FAFC] placeholder:text-[#4B5563] focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                required
              />
            </div>
            <div>
              <label className="block text-xs text-[#9CA3AF] mb-1.5 font-medium">Description *</label>
              <textarea
                value={form.description}
                onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                placeholder="Describe how the scam worked..."
                className="w-full bg-[#111318] border border-[rgba(245,158,11,0.16)] rounded-xl px-3 py-2.5 text-sm text-[#F8FAFC] placeholder:text-[#4B5563] focus:outline-none focus:ring-2 focus:ring-amber-500/40 resize-none"
                required
              />
            </div>
            {submitError && (
              <div className="flex items-center gap-2 text-red-400 text-sm">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                {submitError}
              </div>
            )}
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 text-[#111318] font-bold text-sm hover:bg-amber-400 disabled:opacity-50 transition-colors"
              >
                {submitting ? <Spinner size="sm" /> : null}
                Submit Report
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="text-sm text-[#9CA3AF] hover:text-[#F8FAFC] transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </Card>
      )}

      {/* Reports list */}
      {loading ? (
        <div className="flex items-center gap-3 py-8">
          <Spinner />
          <span className="text-sm text-[#9CA3AF]">Loading community reports…</span>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-[#9CA3AF]">{reports.length} reports from the community</p>
          {reports.map(report => (
            <Card key={report.id} hover>
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0 space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant={scamTypeBadgeVariant(report.scamType)}>
                      {report.scamType}
                    </Badge>
                    <span className="text-xs text-[#9CA3AF]">{timeAgo(report.timestamp)}</span>
                  </div>
                  <p className="text-sm text-[#D1D5DB]">{report.description}</p>
                  <div className="flex items-center gap-4 text-xs text-[#6B7280]">
                    <span className="flex items-center gap-1">
                      <Smartphone className="w-3 h-3" />
                      {report.platform}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {report.location}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => { void handleUpvote(report.id); }}
                  disabled={upvotingId === report.id}
                  className="flex flex-col items-center gap-1 px-3 py-2 rounded-xl border border-[rgba(245,158,11,0.16)] hover:bg-amber-500/10 hover:border-amber-500/30 disabled:opacity-50 transition-colors shrink-0"
                  aria-label={`Upvote this report (${report.upvotes} votes)`}
                >
                  {upvotingId === report.id
                    ? <Spinner size="sm" />
                    : <ThumbsUp className="w-4 h-4 text-amber-400" />
                  }
                  <span className="text-xs font-bold text-amber-400">{report.upvotes}</span>
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ScamRadarPage() {
  return (
    <div className="min-h-screen bg-[#111318]">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <ScamRadarSection />
      </main>
    </div>
  );
}
