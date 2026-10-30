import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { ShieldCheck, Menu, X, Flag } from 'lucide-react';
import { Button } from '../ui/Button';

export function Navbar() {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 10);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-medium transition-all duration-200 pb-0.5 relative group ${
      isActive
        ? 'text-amber-400 border-b-2 border-amber-500'
        : 'text-[#9CA3AF] hover:text-[#F8FAFC]'
    }`;

  return (
    <nav
      aria-label="Main navigation"
      className={`sticky top-0 z-50 border-b border-[rgba(245,158,11,0.1)] bg-[#171A21]/90 backdrop-blur-xl transition-shadow duration-200 ${
        scrolled ? 'shadow-[0_4px_24px_rgba(0,0,0,0.4)]' : ''
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 focus-visible:ring-2 focus-visible:ring-amber-400 rounded-lg"
            aria-label="ScamShield AI — Home"
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500/20 to-amber-300/20 border border-amber-500/30">
              <ShieldCheck className="w-4 h-4 text-amber-400" aria-hidden="true" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-bold text-base">
                <span className="bg-gradient-to-r from-amber-400 to-amber-300 bg-clip-text text-transparent">
                  ScamShield
                </span>
                <span className="text-[#F8FAFC]"> AI</span>
              </span>
              <span className="text-[10px] text-[#9CA3AF]">Protect Your Money</span>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            <NavLink to="/" end className={navLinkClass}>
              Home
            </NavLink>
            <NavLink to="/dashboard" className={navLinkClass}>
              Scan Job
            </NavLink>
            <NavLink to="/intelligence" className={navLinkClass}>
              Scam Awareness
            </NavLink>
            <NavLink to="/safety" className={navLinkClass}>
              Safety Center
            </NavLink>
            <NavLink to="/simulator" className={navLinkClass}>
              Live Demo
            </NavLink>
          </div>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              icon={<Flag className="w-4 h-4" />}
              onClick={() => navigate('/report')}
            >
              Report Scam
            </Button>
            <Button variant="primary" size="sm" onClick={() => navigate('/dashboard')}>
              Analyze Now
            </Button>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-lg text-[#9CA3AF] hover:text-[#F8FAFC] focus-visible:ring-2 focus-visible:ring-amber-400 transition-colors"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-[rgba(245,158,11,0.1)] bg-[#171A21]/98 px-4 py-4 space-y-2">
          {[
            { to: '/', label: 'Home', end: true },
            { to: '/dashboard', label: 'Scan Job', end: false },
            { to: '/intelligence', label: 'Scam Awareness', end: false },
            { to: '/safety', label: 'Safety Center', end: false },
            { to: '/simulator', label: 'Live Demo', end: false },
            { to: '/report', label: 'Report Scam', end: false },
          ].map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-amber-500/10 text-amber-400'
                    : 'text-[#9CA3AF] hover:text-[#F8FAFC] hover:bg-amber-500/5'
                }`
              }
              onClick={() => setMobileOpen(false)}
            >
              {label}
            </NavLink>
          ))}
          <Button
            variant="primary"
            size="sm"
            className="w-full mt-2"
            onClick={() => {
              navigate('/dashboard');
              setMobileOpen(false);
            }}
          >
            Analyze Now
          </Button>
        </div>
      )}
    </nav>
  );
}
