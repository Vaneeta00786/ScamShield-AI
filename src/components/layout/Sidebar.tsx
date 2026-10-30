import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  LayoutDashboard,
  Search,
  Brain,
  Building2,
  Flag,
  Phone,
  X,
  MessageCircle,
  HelpCircle,
  Calculator,
  BookOpen,
  Activity,
  Link2,
  FolderLock,
  Radio,
  Bot,
} from 'lucide-react';
import type { DashboardSection } from '../../types';

interface SidebarProps {
  activeSection: DashboardSection;
  onSectionChange: (s: DashboardSection) => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

const navItems: {
  section: DashboardSection;
  label: string;
  icon: React.ReactNode;
  danger?: boolean;
}[] = [
  { section: 'overview', label: 'Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
  { section: 'analyze', label: 'Analyze Job', icon: <Search className="w-4 h-4" /> },
  { section: 'intelligence', label: 'Scam Intelligence', icon: <Brain className="w-4 h-4" /> },
  { section: 'verify', label: 'Company Verification', icon: <Building2 className="w-4 h-4" /> },
  { section: 'safety', label: 'Safety Center', icon: <ShieldCheck className="w-4 h-4" /> },
  { section: 'report', label: 'Report Scam', icon: <Flag className="w-4 h-4" />, danger: true },
];

const newFeatureItems: {
  section: DashboardSection;
  label: string;
  icon: React.ReactNode;
}[] = [
  { section: 'dna', label: 'Scam DNA', icon: <Activity className="w-4 h-4" /> },
  { section: 'links', label: 'Link Inspector', icon: <Link2 className="w-4 h-4" /> },
  { section: 'evidence', label: 'Evidence Locker', icon: <FolderLock className="w-4 h-4" /> },
  { section: 'radar', label: 'Scam Radar', icon: <Radio className="w-4 h-4" /> },
  { section: 'coach', label: 'AI Safety Coach', icon: <Bot className="w-4 h-4" /> },
];

function SidebarContent({
  activeSection,
  onSectionChange,
  onMobileClose,
}: Omit<SidebarProps, 'mobileOpen'>) {
  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-2 px-4 py-5 border-b border-[rgba(245,158,11,0.08)]">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500/20 to-amber-300/20 border border-amber-500/30">
          <ShieldCheck className="w-4 h-4 text-amber-400" aria-hidden="true" />
        </div>
        <div className="flex flex-col leading-none">
          <span className="font-bold text-sm">
            <span className="bg-gradient-to-r from-amber-500 to-amber-300 bg-clip-text text-transparent">
              ScamShield
            </span>
            <span className="text-[#F8FAFC]"> AI</span>
          </span>
          <span className="text-[10px] text-[#9CA3AF]">Protect Your Money</span>
        </div>
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-3 py-4 space-y-1" aria-label="Dashboard navigation">
        {navItems.map(({ section, label, icon, danger }) => {
          const isActive = activeSection === section;
          return (
            <button
              key={section}
              onClick={() => {
                onSectionChange(section);
                onMobileClose();
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 text-left border-l-2 ${
                isActive
                  ? 'bg-amber-500/10 text-amber-400 border-amber-500 pl-[10px] shadow-[inset_4px_0_8px_rgba(245,158,11,0.08)]'
                  : danger
                    ? 'text-red-400 hover:bg-red-500/10 border-transparent'
                    : 'text-[#9CA3AF] hover:text-[#F8FAFC] hover:bg-amber-500/5 border-transparent'
              }`}
              aria-current={isActive ? 'page' : undefined}
            >
              <span className={isActive ? 'text-amber-400' : undefined}>{icon}</span>
              {label}
            </button>
          );
        })}
      </nav>

      {/* New Features */}
      <div className="px-3 pb-2">
        <p className="text-[10px] text-[#9CA3AF] uppercase tracking-wider px-3 mb-1 font-semibold">New Features</p>
        {newFeatureItems.map(({ section, label, icon }) => {
          const isActive = activeSection === section;
          return (
            <button
              key={section}
              onClick={() => { onSectionChange(section); onMobileClose(); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 text-left border-l-2 ${
                isActive
                  ? 'bg-amber-500/10 text-amber-400 border-amber-500 pl-[10px] shadow-[inset_4px_0_8px_rgba(245,158,11,0.08)]'
                  : 'text-[#9CA3AF] hover:text-[#F8FAFC] hover:bg-amber-500/5 border-transparent'
              }`}
              aria-current={isActive ? 'page' : undefined}
            >
              <span className={isActive ? 'text-amber-400' : undefined}>{icon}</span>
              {label}
            </button>
          );
        })}
      </div>

      {/* Awareness Tools */}
      <div className="px-3 pb-2">
        <p className="text-[10px] text-[#9CA3AF] uppercase tracking-wider px-3 mb-1 font-semibold">Awareness Tools</p>
        {[
          { to: '/simulator', label: 'Scam Simulator', icon: <MessageCircle className="w-4 h-4" /> },
          { to: '/quiz', label: 'Safety Quiz', icon: <HelpCircle className="w-4 h-4" /> },
          { to: '/calculator', label: 'Loss Calculator', icon: <Calculator className="w-4 h-4" /> },
          { to: '/story', label: 'Victim Story', icon: <BookOpen className="w-4 h-4" /> },
        ].map(({ to, label, icon }) => (
          <Link
            key={to}
            to={to}
            onClick={onMobileClose}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 text-left border-l-2 text-[#9CA3AF] hover:text-[#F8FAFC] hover:bg-[rgba(245,158,11,0.05)] border-transparent"
          >
            <span style={{ color: '#F59E0B' }}>{icon}</span>
            {label}
          </Link>
        ))}
      </div>

      {/* Demo mode status */}
      <div className="px-4 py-2 mx-3 mb-2 rounded-lg bg-amber-500/5 border border-amber-500/15">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_6px_rgba(245,158,11,0.6)]" />
          <span className="text-xs text-[#9CA3AF]">Demo Mode Active</span>
        </div>
      </div>

      {/* Emergency helpline */}
      <div className="px-3 py-4 border-t border-[rgba(245,158,11,0.08)]">
        <a
          href="tel:1930"
          className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium hover:bg-red-500/20 transition-colors"
        >
          <Phone className="w-4 h-4" />
          <div>
            <div>Call 1930</div>
            <div className="text-xs text-red-400/70">Cybercrime Helpline</div>
          </div>
        </a>
        <Link
          to="/"
          className="block mt-2 text-center text-xs text-[#9CA3AF] hover:text-[#F8FAFC] py-1 transition-colors"
          onClick={onMobileClose}
        >
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}

export function Sidebar({ activeSection, onSectionChange, mobileOpen, onMobileClose }: SidebarProps) {
  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-60 shrink-0 flex-col bg-[#171A21] border-r border-[rgba(245,158,11,0.08)] min-h-0">
        <SidebarContent
          activeSection={activeSection}
          onSectionChange={onSectionChange}
          onMobileClose={onMobileClose}
        />
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 md:hidden"
          onClick={onMobileClose}
          aria-hidden="true"
        >
          <div className="absolute inset-0 bg-black/60" />
        </div>
      )}

      {/* Mobile drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-60 bg-[#171A21] border-r border-[rgba(245,158,11,0.08)] flex flex-col md:hidden transition-transform duration-300 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-label="Mobile sidebar"
      >
        <button
          onClick={onMobileClose}
          className="absolute top-3 right-3 p-1.5 rounded-lg text-[#9CA3AF] hover:text-[#F8FAFC] transition-colors"
          aria-label="Close sidebar"
        >
          <X className="w-4 h-4" />
        </button>
        <SidebarContent
          activeSection={activeSection}
          onSectionChange={onSectionChange}
          onMobileClose={onMobileClose}
        />
      </aside>
    </>
  );
}
