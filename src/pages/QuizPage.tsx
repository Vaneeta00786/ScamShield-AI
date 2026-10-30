import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, AlertTriangle, XCircle, ChevronRight, Share2 } from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';

const QUESTIONS = [
  {
    id: 1,
    question: 'How did this job opportunity reach you?',
    options: [
      { text: "Through a company's official website or job portal", points: 0 },
      { text: 'A recruiter messaged me on LinkedIn/Naukri', points: 1 },
      { text: 'Someone messaged me on WhatsApp or Telegram', points: 3 },
      { text: 'A friend forwarded a message in a group', points: 2 },
    ],
  },
  {
    id: 2,
    question: 'What does the job involve?',
    options: [
      { text: 'A clearly described role at a named company', points: 0 },
      { text: "'Simple tasks' like liking videos, rating apps, or data entry", points: 4 },
      { text: 'Customer service or a professional skill-based role', points: 0 },
      { text: "I'm not exactly sure what the work is", points: 2 },
    ],
  },
  {
    id: 3,
    question: 'Have you been asked to pay any money?',
    options: [
      { text: 'No, not at all', points: 0 },
      { text: "A small 'registration' or 'ID card' fee", points: 4 },
      { text: "A 'security deposit' to unlock tasks or withdraw earnings", points: 5 },
      { text: "A 'training fee' or 'software cost'", points: 3 },
    ],
  },
  {
    id: 4,
    question: 'Where does the recruiter want to communicate?',
    options: [
      { text: "Via the company's official email address", points: 0 },
      { text: 'LinkedIn or Naukri messaging', points: 1 },
      { text: 'Personal WhatsApp number', points: 3 },
      { text: 'Telegram group', points: 4 },
    ],
  },
  {
    id: 5,
    question: 'Have you seen or received an offer letter?',
    options: [
      { text: 'Yes, on official company letterhead with a company email', points: 0 },
      { text: 'Yes, but it came from a Gmail/Yahoo address', points: 3 },
      { text: 'No offer letter yet', points: 1 },
      { text: "The job 'starts immediately' with no paperwork", points: 3 },
    ],
  },
  {
    id: 6,
    question: 'Can you verify this company exists?',
    options: [
      { text: 'Yes — found on Google, MCA registry, and their website looks real', points: 0 },
      { text: 'Found a website but it looks recently created and basic', points: 2 },
      { text: 'Cannot find the company anywhere online', points: 4 },
      { text: 'The company name keeps changing', points: 5 },
    ],
  },
  {
    id: 7,
    question: 'What happens if you ask questions or delay?',
    options: [
      { text: 'They are patient and answer all questions professionally', points: 0 },
      { text: 'They become slightly pushy', points: 2 },
      { text: "They say your 'slot will be given to someone else'", points: 3 },
      { text: "They say you'll 'lose your earnings' if you don't act now", points: 5 },
    ],
  },
];

const getResult = (score: number) => {
  if (score <= 5) return {
    title: '✅ Looks Legitimate',
    color: 'green',
    level: 'safe',
    message: "This opportunity shows no major scam indicators. However, always verify independently before sharing documents or accepting. Use ScamShield's Company Verify tool.",
  };
  if (score <= 12) return {
    title: '⚠️ Suspicious — Proceed Carefully',
    color: 'amber',
    level: 'suspicious',
    message: "Several warning signs detected. This could be a genuine opportunity or the early stages of a scam. Do NOT pay any money and verify the company thoroughly before proceeding.",
  };
  if (score <= 20) return {
    title: '🚨 HIGH RISK — This Is Likely a Scam',
    color: 'red',
    level: 'high',
    message: 'Strong indicators of a job scam detected. You are likely at an advanced stage of a known scam script. Do not make any payments. Block the recruiter and report to Helpline 1930 immediately.',
  };
  return {
    title: '🚨 CRITICAL — You Are Being Scammed Right Now',
    color: 'red',
    level: 'critical',
    message: 'You are almost certainly in an active scam. STOP all communication and payments IMMEDIATELY. Every additional payment will be a loss. Call 1930 now.',
  };
};

export default function QuizPage() {
  const navigate = useNavigate();
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [copied, setCopied] = useState(false);
  const [fadeIn, setFadeIn] = useState(true);

  // Fade animation on question change
  useEffect(() => {
    setFadeIn(false);
    const t = setTimeout(() => setFadeIn(true), 50);
    return () => clearTimeout(t);
  }, [currentQ]);

  const handleOptionSelect = (idx: number) => {
    setSelectedOption(idx);
  };

  const handleNext = () => {
    if (selectedOption === null) return;
    const newAnswers = [...answers, selectedOption];
    setAnswers(newAnswers);

    if (currentQ + 1 >= QUESTIONS.length) {
      setShowResult(true);
    } else {
      setSelectedOption(null);
      setCurrentQ((q) => q + 1);
    }
  };

  const totalScore = answers.reduce(
    (sum, optIdx, qIdx) => sum + QUESTIONS[qIdx].options[optIdx].points,
    0,
  );

  const result = getResult(totalScore);

  const handleShare = () => {
    const text = `I just checked a job offer with ScamShield AI. Risk Score: ${totalScore}/28. Stay safe! Check yours at scamshield.ai 🛡️`;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleRestart = () => {
    setCurrentQ(0);
    setAnswers([]);
    setSelectedOption(null);
    setShowResult(false);
    setCopied(false);
  };

  const getResultBorderColor = () => {
    if (result.level === 'safe') return 'border-green-500/40';
    if (result.level === 'suspicious') return 'border-yellow-500/40';
    return 'border-red-500/40';
  };

  const getResultTextColor = () => {
    if (result.level === 'safe') return '#22C55E';
    if (result.level === 'suspicious') return '#F59E0B';
    return '#EF4444';
  };

  if (showResult) {
    return (
      <div className="min-h-screen flex flex-col bg-[#0D0F14]">
        <Navbar />
        <div className="max-w-2xl mx-auto px-4 py-12 w-full flex-1">
          {/* Result card */}
          <div className={`glass-card border-2 ${getResultBorderColor()} mb-6`}>
            <div className="text-center mb-6">
              <div
                className="text-2xl font-extrabold mb-2"
                style={{ color: getResultTextColor() }}
              >
                {result.title}
              </div>
              <div className="flex items-center justify-center gap-3 mb-4">
                <span className="text-5xl font-extrabold" style={{ color: getResultTextColor() }}>
                  {totalScore}
                </span>
                <span className="text-2xl text-[#9CA3AF]">/28</span>
              </div>
              <p className="text-[#9CA3AF] text-sm leading-relaxed">{result.message}</p>
            </div>

            {/* Answer breakdown */}
            <div className="border-t border-[rgba(245,158,11,0.1)] pt-4 mb-4">
              <h3 className="text-sm font-semibold text-[#F8FAFC] mb-3">Your Answers</h3>
              <div className="space-y-2">
                {answers.map((optIdx, qIdx) => {
                  const pts = QUESTIONS[qIdx].options[optIdx].points;
                  return (
                    <div key={qIdx} className="flex items-start gap-2 text-xs">
                      {pts === 0 ? (
                        <CheckCircle className="w-3.5 h-3.5 text-green-400 shrink-0 mt-0.5" />
                      ) : pts <= 2 ? (
                        <AlertTriangle className="w-3.5 h-3.5 text-yellow-400 shrink-0 mt-0.5" />
                      ) : (
                        <XCircle className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
                      )}
                      <div>
                        <span className="text-[#9CA3AF]">Q{qIdx + 1}: </span>
                        <span className="text-[#F8FAFC]">{QUESTIONS[qIdx].options[optIdx].text}</span>
                        {pts > 0 && (
                          <span className="text-red-400 ml-1">(+{pts} risk pts)</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col gap-3">
              <button
                onClick={() => navigate('/analyze')}
                className="btn-primary w-full py-3 rounded-xl font-bold"
              >
                Analyze Full Chat / Post
              </button>
              <div className="flex gap-3">
                <a
                  href="tel:1930"
                  className="flex-1 py-2.5 rounded-xl font-bold text-sm text-center border"
                  style={{ background: 'rgba(245,158,11,0.15)', borderColor: 'rgba(245,158,11,0.4)', color: '#F59E0B' }}
                >
                  📞 Call 1930
                </a>
                <button
                  onClick={() => navigate('/report')}
                  className="btn-secondary flex-1 py-2.5 rounded-xl text-sm"
                >
                  Report Now
                </button>
              </div>
              <button
                onClick={handleShare}
                className="flex items-center justify-center gap-2 text-sm py-2.5 rounded-xl border border-[rgba(245,158,11,0.2)] text-[#9CA3AF] hover:text-[#F8FAFC] hover:border-[rgba(245,158,11,0.4)] transition-all"
              >
                <Share2 className="w-4 h-4" />
                {copied ? '✅ Copied!' : 'Share Result'}
              </button>
              <button
                onClick={handleRestart}
                className="text-[#9CA3AF] hover:text-[#F8FAFC] text-sm underline underline-offset-4 transition-colors"
              >
                Take Quiz Again
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const question = QUESTIONS[currentQ];

  return (
    <div className="min-h-screen flex flex-col bg-[#0D0F14]">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-12 w-full flex-1">
        {/* Header */}
        <div className="text-center mb-8">
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium mb-3 border"
            style={{ background: 'rgba(245,158,11,0.1)', borderColor: 'rgba(245,158,11,0.2)', color: '#F59E0B' }}
          >
            🛡️ Job Scam Safety Quiz
          </div>
          <h1 className="text-3xl font-extrabold text-[#F8FAFC] mb-2">
            Is Your Job Offer Real?
          </h1>
          <p className="text-[#9CA3AF] text-sm">
            Answer 7 questions about your job offer to get an instant scam risk score.
          </p>
        </div>

        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between text-xs text-[#9CA3AF] mb-2">
            <span>Question {currentQ + 1} of {QUESTIONS.length}</span>
            <span>{Math.round(((currentQ) / QUESTIONS.length) * 100)}% complete</span>
          </div>
          <div className="w-full bg-[#20232B] h-2 rounded-full overflow-hidden">
            <div
              className="h-2 rounded-full transition-all duration-500"
              style={{ width: `${((currentQ) / QUESTIONS.length) * 100}%`, background: '#F59E0B' }}
            />
          </div>
        </div>

        {/* Question card */}
        <div
          className="glass-card transition-all duration-300"
          style={{ opacity: fadeIn ? 1 : 0, transform: fadeIn ? 'translateY(0)' : 'translateY(12px)' }}
        >
          <h2 className="text-lg font-bold text-[#F8FAFC] mb-5">{question.question}</h2>

          <div className="space-y-3 mb-6">
            {question.options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleOptionSelect(idx)}
                className="w-full text-left px-4 py-3 rounded-xl border transition-all duration-200 text-sm text-[#F8FAFC]"
                style={
                  selectedOption === idx
                    ? { borderColor: '#F59E0B', background: 'rgba(245,158,11,0.12)' }
                    : { borderColor: 'rgba(245,158,11,0.15)', background: 'transparent' }
                }
                onMouseEnter={(e) => {
                  if (selectedOption !== idx) {
                    (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(245,158,11,0.4)';
                    (e.currentTarget as HTMLButtonElement).style.background = 'rgba(245,158,11,0.05)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedOption !== idx) {
                    (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(245,158,11,0.15)';
                    (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
                  }
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center"
                    style={{ borderColor: selectedOption === idx ? '#F59E0B' : 'rgba(245,158,11,0.3)' }}
                  >
                    {selectedOption === idx && (
                      <div className="w-2 h-2 rounded-full" style={{ background: '#F59E0B' }} />
                    )}
                  </div>
                  {opt.text}
                </div>
              </button>
            ))}
          </div>

          {selectedOption !== null && (
            <button
              onClick={handleNext}
              className="btn-primary w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2"
            >
              {currentQ + 1 >= QUESTIONS.length ? 'See My Result' : 'Next Question'}
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
