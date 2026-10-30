import { useNavigate } from 'react-router-dom';
import {
  Brain,
  Building2,
  TrendingUp,
  ShieldCheck,
  ArrowRight,
  Phone,
  ExternalLink,
} from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

const features = [
  {
    icon: <Brain className="w-6 h-6 text-amber-400" />,
    title: 'AI Scam Detection',
    desc: 'Instantly identifies 50+ known scam patterns in job posts, chats and offer letters.',
  },
  {
    icon: <Building2 className="w-6 h-6 text-amber-300" />,
    title: 'Company Verification',
    desc: 'Cross-references company details against public registry records and domain checks.',
  },
  {
    icon: <TrendingUp className="w-6 h-6 text-caution" />,
    title: 'Scam Stage Identification',
    desc: 'Identifies exactly which stage of the scam script you may be in, so you can act before the next payment.',
  },
  {
    icon: <ShieldCheck className="w-6 h-6 text-amber-400" />,
    title: 'Instant Safety Guidance',
    desc: 'Provides immediate, actionable steps to protect yourself in simple, non-technical language.',
  },
];

const steps = [
  {
    num: '01',
    title: 'Paste or Upload',
    desc: 'Share a job post, chat conversation, or offer letter — text or file.',
  },
  {
    num: '02',
    title: 'AI Analyses Patterns',
    desc: 'ScamShield checks for 50+ scam indicators and verifies company details.',
  },
  {
    num: '03',
    title: 'Get Instant Verdict',
    desc: 'Receive a clear risk rating, warning signs, and safety recommendations.',
  },
];

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-[#111318]">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden bg-animated-grid">
        {/* Decorative radial glows */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-300/5 rounded-full blur-3xl pointer-events-none translate-x-1/2 translate-y-1/2" />
        <div className="absolute inset-0 bg-gradient-to-b from-amber-900/5 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* Text */}
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm font-medium mb-6">
                <ShieldCheck className="w-3 h-3" />
                🛡️ AI-Powered Scam Protection
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
                Your Next Job Shouldn't Become Your Next{' '}
                <span className="bg-gradient-to-r from-amber-500 via-amber-300 to-[#FDE68A] bg-clip-text text-transparent">
                  Scam.
                </span>
              </h1>
              <p className="text-lg text-[#9CA3AF] max-w-xl mx-auto lg:mx-0 mb-8">
                ScamShield AI analyses job posts, chats and offer letters for scam patterns — and
                warns you before it's too late. Built for students, homemakers and first-time job
                seekers.
              </p>
              <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                <Button
                  variant="primary"
                  size="lg"
                  icon={<ArrowRight className="w-5 h-5" />}
                  onClick={() => navigate('/dashboard')}
                >
                  Analyze a Job Offer
                </Button>
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={() => navigate('/intelligence')}
                >
                  Learn About Scams
                </Button>
              </div>
              <button
                onClick={() => navigate('/story')}
                className="text-[#9CA3AF] hover:text-[#F8FAFC] text-sm underline underline-offset-4 transition-colors mt-2"
              >
                📖 Read Priya's Story — How She Lost ₹10,500
              </button>
            </div>

            {/* Decorative scan card */}
            <div className="flex-1 max-w-md w-full">
              <div className="gradient-border relative overflow-hidden">
                <div className="text-xs text-[#9CA3AF] mb-3 flex items-center justify-between">
                  <span>Job Post Analysis</span>
                  <span className="bg-red-500/20 text-red-400 border border-red-500/20 text-xs px-2 py-0.5 rounded-full animate-pulse font-bold">
                    HIGH RISK — 87/100
                  </span>
                </div>
                {/* Fake job post */}
                <div className="text-sm text-[#9CA3AF] space-y-2 relative">
                  <p>
                    "Urgent Hiring! Work from home and{' '}
                    <span className="bg-red-500/20 text-red-400 rounded px-1">
                      earn ₹5000 daily
                    </span>
                    . No experience needed."
                  </p>
                  <p>
                    "Simple tasks — like videos and posts.{' '}
                    <span className="bg-red-500/20 text-red-400 rounded px-1">
                      Join our Telegram group
                    </span>{' '}
                    immediately."
                  </p>
                  <p>
                    "
                    <span className="bg-red-500/20 text-red-400 rounded px-1">
                      Pay ₹500 to unlock
                    </span>{' '}
                    your first batch of tasks. Earn ₹3000 in return."
                  </p>
                  {/* Animated scan line */}
                  <div
                    className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-amber-500 to-transparent opacity-70"
                    style={{ animation: 'scan-move 2s linear infinite', top: 0 }}
                  />
                </div>
                {/* Warning signs list */}
                <div className="mt-4 space-y-1">
                  {['Upfront deposit required', 'Unverifiable company', 'Move to private chat'].map(
                    (w) => (
                      <div key={w} className="flex items-center gap-2 text-xs text-red-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                        {w}
                      </div>
                    ),
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-y border-[rgba(245,158,11,0.08)] bg-[#171A21]/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-wrap justify-center gap-8 md:gap-16">
            {[
              { value: '1,247+', label: 'Scams Detected' },
              { value: '6', label: 'Scam Types Covered' },
              { value: '1930', label: 'Cybercrime Helpline' },
            ].map(({ value, label }) => (
              <div key={label} className="text-center">
                <div className="text-2xl font-extrabold bg-gradient-to-r from-amber-500 to-amber-300 bg-clip-text text-transparent">
                  {value}
                </div>
                <div className="text-xs text-[#9CA3AF] mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[#F8FAFC] mb-3">How ScamShield Protects You</h2>
          <p className="text-[#9CA3AF] max-w-xl mx-auto">
            Four layers of protection to identify scams before they cost you money.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map(({ icon, title, desc }) => (
            <Card key={title} variant="glass" hover>
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center mb-4">
                {icon}
              </div>
              <h3 className="font-semibold text-[#F8FAFC] text-sm mb-2">{title}</h3>
              <p className="text-[#9CA3AF] text-xs leading-relaxed">{desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Awareness Tools */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#F8FAFC] mb-4">Interactive Awareness Tools</h2>
            <p className="text-[#9CA3AF] max-w-2xl mx-auto">Learn to recognize scams through hands-on interactive experiences</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { emoji: '📱', title: 'Scam Simulator', desc: "Watch a live WhatsApp scam play out step-by-step. See every manipulation tactic in real time.", route: '/simulator', cta: 'Try It →' },
              { emoji: '🛡️', title: 'Safety Quiz', desc: "Answer 7 questions about your job offer and find out if you're being scammed right now.", route: '/quiz', cta: 'Take Quiz →' },
              { emoji: '💰', title: 'Loss Calculator', desc: "Calculate your real and projected losses from a job scam and understand the true cost.", route: '/calculator', cta: 'Calculate →' },
              { emoji: '📖', title: "Priya's Story", desc: "Read how Priya lost ₹10,500 in a job scam. A true account, chapter by chapter.", route: '/story', cta: 'Read Story →' },
            ].map(({ emoji, title, desc, route, cta }) => (
              <div
                key={route}
                className="glass-card hover:border-[rgba(245,158,11,0.35)] transition-all duration-300 cursor-pointer group"
                onClick={() => navigate(route)}
                style={{ borderColor: 'rgba(245,158,11,0.15)' }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && navigate(route)}
              >
                <div className="text-3xl mb-3">{emoji}</div>
                <h3 className="font-bold text-[#F8FAFC] mb-2">{title}</h3>
                <p className="text-[#9CA3AF] text-sm mb-4">{desc}</p>
                <span className="text-sm font-semibold" style={{ color: '#F59E0B' }}>{cta}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-[#171A21]/30 border-y border-[rgba(245,158,11,0.08)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#F8FAFC] mb-3">How It Works</h2>
            <p className="text-[#9CA3AF]">Three simple steps to stay safe.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {steps.map(({ num, title, desc }) => (
              <div key={num} className="gradient-border text-center">
                <div className="text-5xl font-extrabold bg-gradient-to-r from-amber-500 to-amber-300 bg-clip-text text-transparent mb-4">
                  {num}
                </div>
                <h3 className="font-semibold text-[#F8FAFC] mb-2">{title}</h3>
                <p className="text-[#9CA3AF] text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="glass-card">
          <h2 className="text-3xl font-bold text-[#F8FAFC] mb-4">
            Protect Yourself From Job Scams Today
          </h2>
          <p className="text-[#9CA3AF] mb-8 max-w-md mx-auto">
            Free to use. No sign-up required. Paste your job offer and get results in seconds.
          </p>
          <Button
            variant="primary"
            size="lg"
            icon={<ArrowRight className="w-5 h-5" />}
            onClick={() => navigate('/dashboard')}
          >
            Start Free Analysis
          </Button>
        </div>
      </section>

      {/* About section */}
      <section id="about" className="border-t border-[rgba(245,158,11,0.08)] bg-[#171A21]/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-2xl font-bold text-[#F8FAFC] mb-4">About ScamShield AI</h2>
          <p className="text-[#9CA3AF] text-sm leading-relaxed mb-4">
            Thousands of students and homemakers are lured every year by "like videos and earn" offers on
            Telegram, fake work-from-home jobs, and deposit-based income schemes. Victims lose money in
            stages — small amounts first, then larger ones — before realising it's a scam.
          </p>
          <p className="text-[#9CA3AF] text-sm leading-relaxed mb-6">
            ScamShield AI is a demonstration tool built for the CTBF-AI-11 hackathon challenge. It shows
            how AI can analyse text content for scam patterns, identify the stage of a known scam script,
            and warn users before their next payment.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <a
              href="tel:1930"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium hover:bg-red-500/20 transition-colors"
            >
              <Phone className="w-4 h-4" />
              Call 1930 — Cybercrime Helpline
            </a>
            <a
              href="https://cybercrime.gov.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[rgba(245,158,11,0.12)] text-[#9CA3AF] text-sm hover:text-[#F8FAFC] hover:border-amber-500/30 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              cybercrime.gov.in
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
