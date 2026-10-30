import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Shield, AlertTriangle, Phone } from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';

const CHAPTERS = [
  {
    date: 'Monday, 9:43 AM',
    icon: '📱',
    iconColor: '#22C55E',
    stage: 'Stage 1: Initial Attraction',
    title: "It Started With a Simple WhatsApp Message",
    content: "My name is Priya. I'm 23, a recent graduate from Pune looking for work. I had been sending resumes for 3 months with no luck. Then I got a WhatsApp message: 'Hi Priya! Great opportunity — earn ₹800/day from home. Just like videos. No experience needed!' I was skeptical, but ₹800 a day... that's ₹24,000 a month. More than my first job offer.",
    hopePct: 90,
    moneyLost: '₹0',
    redFlags: 1,
    statsColor: 'green',
    isResolution: false,
  },
  {
    date: 'Tuesday, 11:15 AM',
    icon: '🤝',
    iconColor: '#F59E0B',
    stage: 'Stage 2: Trust Building',
    title: 'They Showed Me Proof',
    content: "They added me to a Telegram group with 847 members. People were posting screenshots of payments — ₹1,200 here, ₹3,500 there. The admin sent me an 'employee ID card' with my photo. It looked official. I completed my first set of tasks — 10 YouTube videos to like. The app showed ₹280 credited. I felt excited. This seemed real.",
    hopePct: 65,
    moneyLost: '₹0',
    redFlags: 3,
    statsColor: 'amber',
    isResolution: false,
  },
  {
    date: 'Wednesday, 3:30 PM',
    icon: '💸',
    iconColor: '#F59E0B',
    stage: 'Stage 3: Small Payment',
    title: 'Just ₹500 to Unlock Withdrawals',
    content: "When I tried to withdraw my ₹280, it said 'Wallet Activation Required — ₹500 deposit.' I hesitated. The group admin said: 'Don't worry, it's refunded with your first withdrawal. 50,000 employees have done this.' I saw other group members saying they got their refund. I paid ₹500 via UPI. My balance jumped to ₹850. I felt relieved.",
    hopePct: 35,
    moneyLost: '₹500',
    redFlags: 5,
    statsColor: 'amber',
    isResolution: false,
  },
  {
    date: 'Friday, 6:45 PM',
    icon: '🚨',
    iconColor: '#EF4444',
    stage: 'Stage 4: Escalation',
    title: 'The Fees Never Stopped',
    content: "After paying ₹500, I was assigned Task Set 2. I completed it. Balance: ₹1,800. But withdrawal still failed: 'Premium Upgrade required — ₹2,000.' I was angry. The admin said: 'Your ₹1,800 is protected. Just ₹2,000 to release it all.' I thought about my ₹500 already gone. I didn't want to lose that too. I paid ₹2,000. Balance: ₹4,200. Another withdrawal attempt. Another fee: ₹3,500.",
    hopePct: 15,
    moneyLost: '₹2,500',
    redFlags: 8,
    statsColor: 'red',
    isResolution: false,
  },
  {
    date: 'The Following Monday',
    icon: '🔒',
    iconColor: '#EF4444',
    stage: 'Stage 5: Deposit Demand',
    title: 'I Borrowed Money to Get My Money Back',
    content: "My balance showed ₹11,000. I could almost taste it. The admin said the final fee was ₹5,000 — a 'tax clearance' — and then I could withdraw everything. I borrowed ₹5,000 from my mother. After paying, the admin went quiet for 2 hours, then returned: 'System error. One more ₹3,000 for a technical fix.' That's when I knew. I started crying.",
    hopePct: 5,
    moneyLost: '₹10,500',
    redFlags: 12,
    statsColor: 'red',
    isResolution: false,
  },
  {
    date: 'If I had used ScamShield AI...',
    icon: '🛡️',
    iconColor: '#F59E0B',
    stage: 'Resolution',
    title: 'The Warning That Would Have Saved ₹10,500',
    content: "ScamShield AI would have flagged this at Chapter 1 — the very first message. 'Move to Telegram' is a Stage 1 red flag. 'Pay to unlock earnings' is Stage 4. The detection happens before the first rupee is lost. Priya's story is real — it happened to thousands of people last year. The names are changed. The losses are not.",
    hopePct: 100,
    moneyLost: '₹0 (with ScamShield)',
    redFlags: 0,
    statsColor: 'green',
    isResolution: true,
  },
];

export default function StoryPage() {
  const navigate = useNavigate();
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [visibleSections, setVisibleSections] = useState<Set<number>>(new Set());

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    sectionRefs.current.forEach((ref, idx) => {
      if (!ref) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => new Set([...prev, idx]));
            obs.disconnect();
          }
        },
        { threshold: 0.15 },
      );
      obs.observe(ref);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const getHopeColor = (pct: number) => {
    if (pct >= 60) return '#22C55E';
    if (pct >= 25) return '#F59E0B';
    return '#EF4444';
  };

  const getStatsTextColor = (color: string) => {
    if (color === 'green') return '#22C55E';
    if (color === 'amber') return '#F59E0B';
    return '#EF4444';
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0D0F14]">
      <Navbar />

      {/* Header */}
      <div className="max-w-4xl mx-auto px-4 py-12 text-center w-full">
        <div
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium mb-4 border"
          style={{ background: 'rgba(245,158,11,0.1)', borderColor: 'rgba(245,158,11,0.2)', color: '#F59E0B' }}
        >
          <BookOpen className="w-4 h-4" />
          Victim Story
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-[#F8FAFC] mb-3">
          Priya's Story
        </h1>
        <p className="text-[#9CA3AF] text-lg mb-2">A Real Account of Job Scam Fraud</p>
        <p className="text-sm text-[#9CA3AF] max-w-xl mx-auto">
          This is a true story — names have been changed. Follow Priya's journey through a job scam, chapter by chapter.
        </p>
      </div>

      {/* Timeline */}
      <div className="max-w-3xl mx-auto px-4 pb-12 w-full">
        <div className="relative">
          {/* Vertical line */}
          <div
            className="absolute left-4 top-0 bottom-0 w-0.5"
            style={{ background: 'linear-gradient(to bottom, #F59E0B, rgba(245,158,11,0.1))' }}
          />

          {CHAPTERS.map((chapter, idx) => (
            <div
              key={idx}
              ref={(el) => { sectionRefs.current[idx] = el; }}
              className="relative pl-12 pb-12"
            >
              {/* Chapter dot */}
              <div
                className="absolute left-0 w-8 h-8 rounded-full flex items-center justify-center text-base border-2"
                style={{
                  background: '#111318',
                  borderColor: chapter.iconColor,
                  top: '4px',
                }}
              >
                {chapter.icon}
              </div>

              {/* Chapter card */}
              <div
                className={`glass-card transition-all duration-700 ${
                  visibleSections.has(idx) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
              >
                {/* Stage badge */}
                <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
                  <span
                    className="text-xs font-bold px-2 py-1 rounded-full"
                    style={{
                      background: `${chapter.iconColor}20`,
                      color: chapter.iconColor,
                    }}
                  >
                    {chapter.stage}
                  </span>
                  <span className="text-xs text-[#9CA3AF]">{chapter.date}</span>
                </div>

                <h2 className="text-xl font-bold text-[#F8FAFC] mb-3">{chapter.title}</h2>
                <p className="text-[#9CA3AF] text-sm leading-relaxed mb-4">{chapter.content}</p>

                {/* Resolution embedded card */}
                {chapter.isResolution && (
                  <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-4 mb-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Shield className="w-4 h-4 text-red-400" />
                      <span className="text-sm font-bold text-red-300">🛡️ ScamShield Detection Result</span>
                    </div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-4xl font-extrabold text-red-400">94</span>
                      <span className="text-2xl text-[#9CA3AF]">/ 100</span>
                      <span className="px-3 py-1 bg-red-500/20 border border-red-500/40 rounded-full text-xs text-red-300 font-bold">
                        HIGH RISK
                      </span>
                    </div>
                    <div className="space-y-1 mb-3">
                      {[
                        'Unsolicited message from unknown contact',
                        'Move to Telegram — avoids complaint mechanisms',
                        'Pay-to-withdraw — earnings are fictional numbers',
                      ].map((flag, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-red-300">
                          <AlertTriangle className="w-3 h-3 shrink-0" />
                          {flag}
                        </div>
                      ))}
                    </div>
                    <div className="text-xs text-red-300/70">
                      Would have been flagged at: <strong className="text-red-300">First message</strong>
                    </div>
                  </div>
                )}

                {/* Stats strip */}
                <div className="grid grid-cols-3 gap-3 border-t border-[rgba(245,158,11,0.08)] pt-4">
                  <div className="text-center">
                    <div className="text-xs text-[#9CA3AF] mb-1">Money Lost</div>
                    <div
                      className="font-bold text-sm"
                      style={{ color: chapter.moneyLost === '₹0' || chapter.moneyLost === '₹0 (with ScamShield)' ? '#22C55E' : '#EF4444' }}
                    >
                      {chapter.moneyLost}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-[#9CA3AF] mb-1">Red Flags</div>
                    <div
                      className="font-bold text-sm"
                      style={{ color: getStatsTextColor(chapter.statsColor) }}
                    >
                      {chapter.redFlags}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-[#9CA3AF] mb-1">Hope Level</div>
                    <div className="w-full bg-[#20232B] h-2 rounded-full overflow-hidden mt-1">
                      <div
                        className="h-2 rounded-full transition-all duration-700"
                        style={{
                          width: `${chapter.hopePct}%`,
                          background: getHopeColor(chapter.hopePct),
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap gap-3 justify-center mb-8">
          <button
            onClick={() => navigate('/analyze')}
            className="btn-primary px-6 py-3 rounded-xl font-bold flex items-center gap-2"
          >
            <Shield className="w-4 h-4" />
            Analyze a Job Offer Now
          </button>
          <a
            href="tel:1930"
            className="px-6 py-3 rounded-xl font-bold flex items-center gap-2 border"
            style={{ background: 'rgba(245,158,11,0.15)', borderColor: 'rgba(245,158,11,0.4)', color: '#F59E0B', textDecoration: 'none' }}
          >
            <Phone className="w-4 h-4" />
            Call 1930
          </a>
        </div>
      </div>

      {/* Bottom stats bar */}
      <div
        className="border-t py-8"
        style={{ background: '#111318', borderColor: 'rgba(245,158,11,0.1)' }}
      >
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center mb-4">
            {[
              { value: '12,000+', label: 'victims in 2023' },
              { value: '₹18,500', label: 'average loss' },
              { value: '14%', label: 'recovery rate' },
            ].map(({ value, label }) => (
              <div key={label}>
                <div
                  className="text-2xl font-extrabold mb-1"
                  style={{ background: 'linear-gradient(135deg,#FDE68A,#F59E0B)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}
                >
                  {value}
                </div>
                <div className="text-xs text-[#9CA3AF]">{label}</div>
              </div>
            ))}
          </div>
          <p className="text-center text-xs text-[#9CA3AF]">
            Source: National Cybercrime Reporting Portal (NCRP) · NCRB Annual Report 2023 · Cybercrime Helpline 1930
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
}
