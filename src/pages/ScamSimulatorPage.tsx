import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, AlertTriangle, Shield, RefreshCw, ChevronRight } from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';

const CHAT_MESSAGES = [
  { id: 1, sender: 'recruiter', text: 'Hello! I saw your profile on LinkedIn. We have a great work-from-home opportunity. Earn ₹800–₹1500 per day just liking YouTube videos. No experience needed! 😊', time: '9:43 AM' },
  { id: 2, sender: 'you', text: 'Hi! That sounds interesting. Tell me more.', time: '9:45 AM' },
  { id: 3, sender: 'recruiter', text: "It's very simple! We are Global Task Network, a digital marketing company. You get assigned 30–40 tasks per day. Each task takes 2–3 minutes. We already have 50,000+ employees earning daily! 💰", time: '9:46 AM' },
  { id: 4, sender: 'you', text: 'Okay, how do I start?', time: '9:47 AM' },
  { id: 5, sender: 'recruiter', text: 'First, join our official Telegram group. We operate through Telegram for faster communication. Here is the link: t.me/GlobalTaskNetwork_Official', time: '9:48 AM', redFlag: '🚨 RED FLAG: Move to Telegram — scammers avoid platforms with complaint mechanisms' },
  { id: 6, sender: 'you', text: "I've joined. What next?", time: '9:52 AM' },
  { id: 7, sender: 'recruiter', text: 'Great! Now you will receive Task Set 1 — 10 videos to like. Your account shows ₹350 earned after completion! 🎉', time: '9:53 AM' },
  { id: 8, sender: 'you', text: "I completed them. But I can't see a way to withdraw?", time: '11:20 AM', redFlag: "🚨 RED FLAG: Pay to withdraw — your 'earnings' are fake numbers. This is Stage 4: Prepaid Escalation" },
  { id: 9, sender: 'recruiter', text: "Congratulations! To withdraw, you need to activate your earning wallet. This requires a small deposit of ₹500 only. This is fully refundable with your first withdrawal.", time: '11:22 AM' },
  { id: 10, sender: 'you', text: 'Why do I need to pay to withdraw money I already earned?', time: '11:25 AM', redFlag: "🚨 RED FLAG: 'Standard procedure' — NO legitimate job requires a deposit to receive your own wages" },
  { id: 11, sender: 'recruiter', text: "This is standard procedure for all new employees. It's a one-time security deposit. Don't worry — you will get it back immediately! Many employees have already done this and are earning ₹5000 daily. 🙏", time: '11:26 AM' },
  { id: 12, sender: 'you', text: 'Okay... I paid ₹500.', time: '2:15 PM', redFlag: '🚨 RED FLAG: Escalating fees — new charges appear every time. Total lost so far: ₹500' },
  { id: 13, sender: 'recruiter', text: 'Thank you! Now Task Set 2 is unlocked. Complete 20 tasks. Your balance is now ₹1,200! But to withdraw you need to upgrade to Premium Member for ₹2,000. Premium members withdraw instantly!', time: '2:17 PM' },
  { id: 14, sender: 'you', text: "Wait, I paid ₹500 already. Why more fees?", time: '3:30 PM' },
  { id: 15, sender: 'recruiter', text: "I understand. But if you don't upgrade in 24 hours, your account will be suspended and you will LOSE your ₹1,200 balance. This is your last chance. Please decide fast. ⏰", time: '3:31 PM', redFlag: '🚨 RED FLAG: Urgency pressure — 24hr deadline is a manipulation tactic. STOP ALL PAYMENTS NOW' },
] as const;

// Loosen the inferred type so we can read the optional redFlag field safely
type ChatMessage = {
  id: number;
  sender: 'recruiter' | 'you';
  text: string;
  time: string;
  redFlag?: string;
};

const MESSAGES = CHAT_MESSAGES as unknown as ChatMessage[];

const getRiskScore = (revealedCount: number) => {
  if (revealedCount >= 12) return 94;
  if (revealedCount >= 8) return 72;
  if (revealedCount >= 5) return 45;
  return 15;
};

const getStage = (revealedCount: number) => {
  if (revealedCount >= 12) return 'Deposit Demand';
  if (revealedCount >= 8) return 'Prepaid Escalation';
  if (revealedCount >= 5) return 'Trust Building';
  return 'Initial Contact';
};

const getRedFlagCount = (revealedCount: number) => {
  return MESSAGES.slice(0, revealedCount).filter((m) => m.redFlag).length;
};

export default function ScamSimulatorPage() {
  const navigate = useNavigate();
  const [revealed, setRevealed] = useState(0);
  const [typing, setTyping] = useState(false);
  const [activeRedFlag, setActiveRedFlag] = useState<string | null>(null);
  const [showEndOverlay, setShowEndOverlay] = useState(false);
  const chatBodyRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [revealed, typing]);

  // Auto-dismiss red flag after 6 seconds
  useEffect(() => {
    if (!activeRedFlag) return;
    const timer = setTimeout(() => setActiveRedFlag(null), 6000);
    return () => clearTimeout(timer);
  }, [activeRedFlag]);

  const handleNext = () => {
    if (revealed >= MESSAGES.length) return;
    const nextMsg = MESSAGES[revealed];

    if (nextMsg.sender === 'recruiter') {
      setTyping(true);
      setTimeout(() => {
        setTyping(false);
        setRevealed((r) => r + 1);
        if (nextMsg.redFlag) {
          setActiveRedFlag(nextMsg.redFlag);
        }
        if (revealed + 1 >= MESSAGES.length) {
          setShowEndOverlay(true);
        }
      }, 1200);
    } else {
      setRevealed((r) => r + 1);
      if (nextMsg.redFlag) {
        setActiveRedFlag(nextMsg.redFlag);
      }
      if (revealed + 1 >= MESSAGES.length) {
        setShowEndOverlay(true);
      }
    }
  };

  const handleRestart = () => {
    setRevealed(0);
    setTyping(false);
    setActiveRedFlag(null);
    setShowEndOverlay(false);
  };

  const riskScore = getRiskScore(revealed);
  const stage = getStage(revealed);
  const redFlagCount = getRedFlagCount(revealed);
  const progress = (revealed / MESSAGES.length) * 100;

  const getRiskColor = (score: number) => {
    if (score >= 80) return '#EF4444';
    if (score >= 50) return '#EAB308';
    return '#22C55E';
  };

  const getRiskBarClass = (score: number) => {
    if (score >= 80) return 'bg-red-500';
    if (score >= 50) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0D0F14]">
      <Navbar />

      {/* Header */}
      <div className="max-w-5xl mx-auto px-4 py-6 w-full">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[rgba(245,158,11,0.1)] border border-[rgba(245,158,11,0.2)] text-sm font-medium mb-3" style={{ color: '#F59E0B' }}>
            <MessageCircle className="w-4 h-4" />
            Live Scam Simulator
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#F8FAFC] mb-2">
            Watch a Job Scam{' '}
            <span style={{ background: 'linear-gradient(135deg,#FDE68A,#F59E0B)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Happen in Real Time
            </span>
          </h1>
          <p className="text-[#9CA3AF] max-w-2xl mx-auto text-sm">
            Step through a real WhatsApp job scam conversation. ScamShield AI detects each manipulation tactic as it unfolds.
          </p>
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Phone Mockup */}
          <div className="flex flex-col items-center">
            <div className="w-full max-w-sm mx-auto rounded-3xl border border-[rgba(245,158,11,0.15)] overflow-hidden shadow-2xl">
              {/* WhatsApp header */}
              <div className="flex items-center gap-3 py-3 px-4" style={{ background: '#075E54' }}>
                <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-sm">P</div>
                <div>
                  <div className="text-white font-semibold text-sm">Priya Recruiter 🟢</div>
                  <div className="text-white/80 text-xs">Online · Global Task Network</div>
                </div>
              </div>

              {/* Red flag banner */}
              <div
                className="overflow-hidden transition-all duration-500"
                style={{ maxHeight: activeRedFlag ? '80px' : '0px' }}
              >
                {activeRedFlag && (
                  <div className="bg-red-900/80 border-b border-red-500/50 px-4 py-2 flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                    <p className="text-xs text-red-300">{activeRedFlag}</p>
                  </div>
                )}
              </div>

              {/* Chat body */}
              <div
                ref={chatBodyRef}
                className="bg-[#111318] p-4 space-y-3 overflow-y-auto"
                style={{ minHeight: '480px', maxHeight: '480px' }}
              >
                {MESSAGES.slice(0, revealed).map((msg) => (
                  <div key={msg.id} className={`flex flex-col ${msg.sender === 'you' ? 'items-end' : 'items-start'}`}>
                    <div
                      className={`px-3 py-2 max-w-[80%] text-sm rounded-xl ${
                        msg.sender === 'recruiter'
                          ? 'bg-[#20232B] text-[#F8FAFC] rounded-tl-sm'
                          : 'rounded-tr-sm text-[#F8FAFC] border'
                      }`}
                      style={msg.sender === 'you' ? { background: 'rgba(245,158,11,0.2)', borderColor: 'rgba(245,158,11,0.3)' } : {}}
                    >
                      {msg.text}
                    </div>
                    <span className="text-xs text-gray-500 mt-1">{msg.time}</span>
                  </div>
                ))}

                {/* Typing indicator */}
                {typing && (
                  <div className="flex items-start">
                    <div className="bg-[#20232B] px-4 py-3 rounded-xl rounded-tl-sm flex items-center gap-1.5">
                      {[0, 1, 2].map((i) => (
                        <span
                          key={i}
                          className="w-2 h-2 rounded-full bg-gray-400"
                          style={{ animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite` }}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {revealed === 0 && !typing && (
                  <div className="flex items-center justify-center h-40 text-[#9CA3AF] text-sm text-center">
                    <div>
                      <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-40" />
                      Press "Next Message" to begin
                    </div>
                  </div>
                )}
              </div>

              {/* Controls */}
              <div className="bg-[#0D0F14] px-4 py-3 space-y-3">
                {/* Progress bar */}
                <div>
                  <div className="flex justify-between text-xs text-[#9CA3AF] mb-1">
                    <span>Progress</span>
                    <span>{revealed}/{CHAT_MESSAGES.length} messages</span>
                  </div>
                  <div className="w-full bg-[#20232B] h-2 rounded-full overflow-hidden">
                    <div
                      className="h-2 rounded-full transition-all duration-500"
                      style={{ width: `${progress}%`, background: '#F59E0B' }}
                    />
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={handleNext}
                    disabled={typing || revealed >= MESSAGES.length}
                    className="btn-primary flex-1 px-4 py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next Message <ChevronRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleRestart}
                    className="btn-secondary px-4 py-2 rounded-lg text-sm flex items-center gap-1"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Detection Panel */}
          <div className="glass-card flex flex-col gap-4">
            <div>
              <h2 className="text-lg font-bold mb-1" style={{ background: 'linear-gradient(135deg,#FDE68A,#F59E0B)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                🛡️ ScamShield Live Detection
              </h2>
              <p className="text-xs text-[#9CA3AF]">Real-time analysis as the conversation unfolds</p>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#111318] rounded-xl p-3">
                <div className="text-xs text-[#9CA3AF] mb-1">Stage Detected</div>
                <div className="font-bold text-sm text-[#F8FAFC]">{stage}</div>
              </div>
              <div className="bg-[#111318] rounded-xl p-3">
                <div className="text-xs text-[#9CA3AF] mb-1">Warning Signs</div>
                <div className="font-bold text-sm" style={{ color: redFlagCount > 0 ? '#EF4444' : '#22C55E' }}>
                  {redFlagCount} found
                </div>
              </div>
            </div>

            {/* Risk Score */}
            <div className="bg-[#111318] rounded-xl p-3">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-[#9CA3AF]">Risk Score</span>
                <span className="font-extrabold text-xl" style={{ color: getRiskColor(riskScore) }}>
                  {riskScore}/100
                </span>
              </div>
              <div className="w-full bg-[#20232B] h-3 rounded-full overflow-hidden">
                <div
                  className={`h-3 rounded-full transition-all duration-700 ${getRiskBarClass(riskScore)}`}
                  style={{ width: `${riskScore}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-[#9CA3AF] mt-1">
                <span>Low</span>
                <span>Medium</span>
                <span>High</span>
              </div>
            </div>

            {/* Red flags list */}
            <div className="bg-[#111318] rounded-xl p-3 flex-1">
              <div className="text-xs text-[#9CA3AF] mb-2 font-semibold">DETECTED RED FLAGS</div>
              {getRedFlagCount(revealed) === 0 ? (
                <p className="text-xs text-[#9CA3AF]">No red flags detected yet...</p>
              ) : (
                <div className="space-y-2">
                  {MESSAGES.slice(0, revealed).filter((m) => m.redFlag).map((m) => (
                    <div key={m.id} className="flex items-start gap-2">
                      <AlertTriangle className="w-3 h-3 text-red-400 shrink-0 mt-0.5" />
                      <p className="text-xs text-red-300">{m.redFlag}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ScamShield note */}
            <div className="bg-[rgba(245,158,11,0.05)] border border-[rgba(245,158,11,0.15)] rounded-xl p-3">
              <div className="flex items-start gap-2">
                <Shield className="w-4 h-4 shrink-0 mt-0.5" style={{ color: '#F59E0B' }} />
                <p className="text-xs text-[#9CA3AF]">
                  ScamShield AI identifies these patterns in real conversations. If you see similar messages, stop all payments immediately.
                </p>
              </div>
            </div>

            <button
              onClick={() => navigate('/analyze')}
              className="btn-primary w-full py-2.5 rounded-xl font-bold text-sm"
            >
              Analyze My Own Conversation →
            </button>
          </div>
        </div>
      </div>

      {/* End overlay */}
      {showEndOverlay && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="glass-card max-w-md w-full text-center">
            <div className="text-5xl mb-4">⛔</div>
            <h2 className="text-2xl font-extrabold text-red-400 mb-2">TOTAL MONEY LOST: ₹500</h2>
            <p className="text-[#9CA3AF] text-sm mb-2">
              If she continued, the average victim loses <span className="text-red-400 font-semibold">₹12,000–₹50,000</span>
            </p>
            <p className="text-[#9CA3AF] text-xs mb-6">
              Every additional "fee" was a new trap. The earnings were never real.
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => navigate('/report')}
                className="btn-primary w-full py-3 rounded-xl font-bold"
              >
                Report This Scam
              </button>
              <button
                onClick={() => navigate('/analyze')}
                className="btn-secondary w-full py-3 rounded-xl"
              >
                See How ScamShield Detects This
              </button>
              <button
                onClick={handleRestart}
                className="text-[#9CA3AF] hover:text-[#F8FAFC] text-sm underline underline-offset-4 transition-colors"
              >
                Start Over
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bounce keyframe */}
      <style>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-6px); }
        }
      `}</style>

      <Footer />
    </div>
  );
}
