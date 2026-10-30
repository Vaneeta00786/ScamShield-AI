import { useState, useEffect } from 'react';
import { Menu, Search, AlertTriangle, ShieldCheck } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Navbar } from '../components/layout/Navbar';
import { Sidebar } from '../components/layout/Sidebar';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Spinner } from '../components/ui/Spinner';
import { AnalyzeSection } from './AnalyzePage';
import ScamIntelligencePage from './ScamIntelligencePage';
import CompanyVerifyPage from './CompanyVerifyPage';
import SafetyCenterPage from './SafetyCenterPage';
import ReportPage from './ReportPage';
import { ScamDnaSection } from './ScamDnaPage';
import { LinkInspectorSection } from './LinkInspectorPage';
import { EvidenceLockerSection } from './EvidenceLockerPage';
import { ScamRadarSection } from './ScamRadarPage';
import { AiCoachSection } from './AiCoachPage';
import { fetchDashboardStats, fetchWeeklyData, fetchAlerts } from '../api/dashboard';
import type { DashboardSection, RiskLevel, DashboardStats, WeeklyDataPoint } from '../types';
import type { AlertItem } from '../api/dashboard';

const riskBadgeVariant: Record<RiskLevel, 'danger' | 'caution' | 'success'> = {
  HIGH_RISK: 'danger',
  SUSPICIOUS: 'caution',
  SAFE: 'success',
};

const riskLabel: Record<RiskLevel, string> = {
  HIGH_RISK: 'High Risk',
  SUSPICIOUS: 'Suspicious',
  SAFE: 'Safe',
};

function OverviewSection({ onSectionChange }: { onSectionChange: (s: DashboardSection) => void }) {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [weeklyData, setWeeklyData] = useState<WeeklyDataPoint[]>([]);
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchDashboardStats(), fetchWeeklyData(), fetchAlerts()])
      .then(([s, w, a]) => {
        setStats(s);
        setWeeklyData(w);
        setAlerts(a);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center gap-4 py-20">
        <Spinner size="lg" />
        <p className="text-muted text-sm">Loading dashboard…</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-extrabold text-[#F8FAFC]">Welcome to ScamShield AI</h1>
        <p className="text-[#9CA3AF] mt-1">Protecting job seekers from financial scams.</p>
      </div>

      {/* Stat cards */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-[#20232B] to-[#272B35] border border-amber-500/20 rounded-2xl p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0">
              <Search className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <div className="text-2xl font-extrabold text-[#F8FAFC]">
                {stats.totalScans.toLocaleString()}
              </div>
              <div className="text-xs text-[#9CA3AF]">Total Scans</div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-[#2B1414] to-[#3a1f1f] border border-red-500/20 rounded-2xl p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-6 h-6 text-red-400" />
            </div>
            <div>
              <div className="text-2xl font-extrabold text-red-400">
                {stats.scamAlerts.toLocaleString()}
              </div>
              <div className="text-xs text-[#9CA3AF]">Scam Alerts</div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-[#20232B] to-[#272B35] border border-emerald-500/20 rounded-2xl p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6 text-emerald-300" />
            </div>
            <div>
              <div className="text-2xl font-extrabold text-emerald-300">
                {stats.safeOffers.toLocaleString()}
              </div>
              <div className="text-xs text-[#9CA3AF]">Safe Offers</div>
            </div>
          </div>
        </div>
      )}

      {/* Chart */}
      {weeklyData.length > 0 && (
        <Card>
          <h3 className="font-semibold text-[#F8FAFC] mb-6">Weekly Scan Activity</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={weeklyData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
              <XAxis dataKey="day" tick={{ fill: '#9CA3AF', fontSize: 12 }} />
              <YAxis tick={{ fill: '#9CA3AF', fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  background: '#20232B',
                  border: '1px solid rgba(245,158,11,0.16)',
                  borderRadius: '12px',
                  color: '#F8FAFC',
                }}
              />
              <Legend wrapperStyle={{ fontSize: 12, color: '#9CA3AF' }} />
              <Bar dataKey="scams" name="Scam Alerts" fill="#EF4444" radius={[4, 4, 0, 0]} />
              <Bar dataKey="safe" name="Safe Offers" fill="#34D399" radius={[4, 4, 0, 0]} />
              <Bar dataKey="suspicious" name="Suspicious" fill="#FFCA72" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      )}

      {/* Recent alerts */}
      {alerts.length > 0 && (
        <Card>
          <h3 className="font-semibold text-[#F8FAFC] mb-4">Recent Threat Alerts</h3>
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className="flex items-center justify-between py-2 border-b border-[rgba(245,158,11,0.08)] last:border-0"
              >
                <div className="flex-1 min-w-0 mr-3">
                  <div className="text-sm font-medium text-[#F8FAFC] truncate">{alert.title}</div>
                  <div className="text-xs text-[#9CA3AF] truncate">{alert.description}</div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <Badge variant={riskBadgeVariant[alert.riskLevel]} size="sm">
                    {riskLabel[alert.riskLevel]}
                  </Badge>
                  <span className="text-xs text-[#9CA3AF] hidden sm:inline">{alert.time}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          onClick={() => onSectionChange('analyze')}
          className="gradient-border text-left hover:opacity-90 transition-opacity"
        >
          <div className="font-semibold text-[#F8FAFC] mb-1">Analyze a Job Offer</div>
          <div className="text-sm text-[#9CA3AF]">Paste a job post, chat or upload an offer letter</div>
        </button>
        <button
          onClick={() => onSectionChange('intelligence')}
          className="gradient-border text-left hover:opacity-90 transition-opacity"
        >
          <div className="font-semibold text-[#F8FAFC] mb-1">Learn About Scam Patterns</div>
          <div className="text-sm text-[#9CA3AF]">Explore 6 common scam types with warning signs</div>
        </button>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [activeSection, setActiveSection] = useState<DashboardSection>('overview');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const renderSection = () => {
    switch (activeSection) {
      case 'overview':
        return <OverviewSection onSectionChange={setActiveSection} />;
      case 'analyze':
        return (
          <div>
            <h1 className="text-2xl font-extrabold text-[#F8FAFC] mb-6">Job Scam Analyzer</h1>
            <AnalyzeSection
              onViewSafety={() => setActiveSection('safety')}
              onReport={() => setActiveSection('report')}
            />
          </div>
        );
      case 'intelligence':
        return <ScamIntelligencePage standalone={false} />;
      case 'verify':
        return <CompanyVerifyPage standalone={false} />;
      case 'safety':
        return <SafetyCenterPage standalone={false} />;
      case 'report':
        return <ReportPage standalone={false} />;
      case 'dna': return <ScamDnaSection />;
      case 'links': return <LinkInspectorSection />;
      case 'evidence': return <EvidenceLockerSection />;
      case 'radar': return <ScamRadarSection />;
      case 'coach': return <AiCoachSection />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#111318]">
      <Navbar />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          activeSection={activeSection}
          onSectionChange={setActiveSection}
          mobileOpen={mobileSidebarOpen}
          onMobileClose={() => setMobileSidebarOpen(false)}
        />

        <main className="flex-1 overflow-y-auto scrollbar-thin">
          {/* Mobile header with hamburger */}
          <div className="md:hidden flex items-center gap-3 px-4 py-3 border-b border-[rgba(245,158,11,0.08)] bg-[#111318]/80 sticky top-0 z-30 backdrop-blur">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="p-2 rounded-lg text-[#A7B8AF] hover:text-[#F8FAFC] transition-colors"
              aria-label="Open navigation"
            >
              <Menu className="w-5 h-5" />
            </button>
            <span className="text-sm font-medium text-[#F8FAFC]">Dashboard</span>
          </div>

          <div className="p-6 lg:p-8">
            {renderSection()}
          </div>
        </main>
      </div>
    </div>
  );
}
