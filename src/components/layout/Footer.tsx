import { Link } from 'react-router-dom';
import { ShieldCheck, Phone, ExternalLink } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-[#111318] border-t border-[rgba(245,158,11,0.1)] mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500/20 to-amber-300/20 border border-amber-500/30">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
              </div>
              <span className="font-bold text-base">
                <span className="bg-gradient-to-r from-amber-500 to-amber-300 bg-clip-text text-transparent">
                  ScamShield
                </span>
                <span className="text-[#F8FAFC]"> AI</span>
              </span>
            </div>
            <p className="text-sm text-[#9CA3AF] leading-relaxed">
              Detect the Scam. Protect Your Money. An AI-powered tool to help job seekers identify
              scam patterns before they lose money.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-xs font-semibold text-[#9CA3AF]/60 uppercase tracking-widest mb-3">Navigation</h3>
            <ul className="space-y-2">
              {[
                { to: '/', label: 'Home' },
                { to: '/dashboard', label: 'Analyze Job' },
                { to: '/intelligence', label: 'Scam Intelligence' },
                { to: '/safety', label: 'Safety Center' },
                { to: '/report', label: 'Report Scam' },
                { to: '/verify', label: 'Company Verification' },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className="text-sm text-[#9CA3AF] hover:text-amber-400 transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Emergency */}
          <div>
            <h3 className="text-xs font-semibold text-[#9CA3AF]/60 uppercase tracking-widest mb-3">Emergency Help</h3>
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Phone className="w-5 h-5 text-red-400" />
                <span className="text-2xl font-bold text-red-400">1930</span>
              </div>
              <p className="text-xs text-[#9CA3AF] mb-3">Cybercrime Helpline — Available 24/7</p>
              <div className="flex flex-col gap-2">
                <a
                  href="tel:1930"
                  className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-red-500/20 text-red-400 text-sm font-medium hover:bg-red-500/30 transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  Call 1930 Now
                </a>
                <a
                  href="https://cybercrime.gov.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-[rgba(245,158,11,0.12)] text-[#9CA3AF] text-sm hover:text-[#F8FAFC] hover:border-amber-500/30 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  cybercrime.gov.in
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 pt-6 border-t border-[rgba(245,158,11,0.08)]">
          <p className="text-xs text-[#9CA3AF] text-center leading-relaxed">
            ⚠️ All analysis results shown on this platform are{' '}
            <strong className="text-caution">demonstration data only</strong> and do not constitute
            real AI verification or legal advice. For actual scam complaints, use{' '}
            <a
              href="https://cybercrime.gov.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-400 hover:underline"
            >
              cybercrime.gov.in
            </a>{' '}
            or call 1930.
          </p>
          <p className="text-xs text-[#9CA3AF] text-center mt-2">
            © {new Date().getFullYear()} ScamShield AI · CTBF-AI-11 Hackathon Demo
          </p>
        </div>
      </div>
    </footer>
  );
}
