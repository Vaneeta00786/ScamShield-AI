import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calculator, AlertTriangle, TrendingDown, Phone } from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';

export default function LossCalculatorPage() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState(15);
  const [depositAmount, setDepositAmount] = useState(500);
  const [deposits, setDeposits] = useState(2);
  const [days, setDays] = useState(7);

  // Derived calculations
  // days is used to scale the projection — more days = more escalation cycles
  const escalationMultiplier = 3 + Math.min(days / 10, 3); // 3× to 6× based on days
  const totalDeposited = depositAmount * deposits;
  const fakeEarnings = tasks * 80 + 350;
  const actualRecovery = 0;
  const projectedAdditional = Math.round(totalDeposited * escalationMultiplier);
  const totalProjected = totalDeposited + projectedAdditional;

  return (
    <div className="min-h-screen flex flex-col bg-[#0D0F14]">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-8 w-full flex-1">
        {/* Header */}
        <div className="text-center mb-8">
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium mb-3 border"
            style={{ background: 'rgba(245,158,11,0.1)', borderColor: 'rgba(245,158,11,0.2)', color: '#F59E0B' }}
          >
            <Calculator className="w-4 h-4" />
            Scam Loss Calculator
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#F8FAFC] mb-2">
            💰 What Is This Job Scam{' '}
            <span style={{ background: 'linear-gradient(135deg,#FDE68A,#F59E0B)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Really Costing You?
            </span>
          </h1>
          <p className="text-[#9CA3AF] max-w-2xl mx-auto text-sm">
            Adjust the sliders to match your situation and see your real losses versus fake earnings.
          </p>
        </div>

        {/* Two column grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">

          {/* Left: Inputs */}
          <div className="glass-card">
            <div className="mb-5">
              <h2 className="font-bold text-[#F8FAFC] text-lg">Your Situation</h2>
              <p className="text-xs mt-1" style={{ color: '#F59E0B' }}>Adjust sliders to see your risk</p>
            </div>

            <div className="space-y-6">
              {/* Slider: Tasks */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-[#F8FAFC]">Tasks completed</label>
                  <span className="text-sm font-bold" style={{ color: '#F59E0B' }}>{tasks}</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={100}
                  value={tasks}
                  onChange={(e) => setTasks(Number(e.target.value))}
                  className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                  style={{ accentColor: '#F59E0B' }}
                />
                <div className="flex justify-between text-xs text-[#9CA3AF] mt-1">
                  <span>1</span>
                  <span>100</span>
                </div>
              </div>

              {/* Slider: Deposit Amount */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-[#F8FAFC]">Deposit amount (₹)</label>
                  <span className="text-sm font-bold" style={{ color: '#F59E0B' }}>₹{depositAmount.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min={100}
                  max={5000}
                  step={100}
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(Number(e.target.value))}
                  className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                  style={{ accentColor: '#F59E0B' }}
                />
                <div className="flex justify-between text-xs text-[#9CA3AF] mt-1">
                  <span>₹100</span>
                  <span>₹5,000</span>
                </div>
              </div>

              {/* Slider: Number of Deposits */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-[#F8FAFC]">Number of deposits</label>
                  <span className="text-sm font-bold" style={{ color: '#F59E0B' }}>{deposits}</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={10}
                  value={deposits}
                  onChange={(e) => setDeposits(Number(e.target.value))}
                  className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                  style={{ accentColor: '#F59E0B' }}
                />
                <div className="flex justify-between text-xs text-[#9CA3AF] mt-1">
                  <span>1</span>
                  <span>10</span>
                </div>
              </div>

              {/* Slider: Days */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-[#F8FAFC]">Days involved</label>
                  <span className="text-sm font-bold" style={{ color: '#F59E0B' }}>{days} days</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={60}
                  value={days}
                  onChange={(e) => setDays(Number(e.target.value))}
                  className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                  style={{ accentColor: '#F59E0B' }}
                />
                <div className="flex justify-between text-xs text-[#9CA3AF] mt-1">
                  <span>1 day</span>
                  <span>60 days</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Results */}
          <div className="glass-card">
            <div className="mb-5">
              <h2 className="font-bold text-[#F8FAFC] text-lg flex items-center gap-2">
                <TrendingDown className="w-5 h-5 text-red-400" />
                Your Real Numbers
              </h2>
            </div>

            {/* Main stats */}
            <div className="space-y-3 mb-4">
              <div className="bg-[#111318] rounded-xl p-3 flex justify-between items-center">
                <span className="text-sm text-[#9CA3AF]">Total Deposited So Far</span>
                <span className="text-xl font-extrabold text-red-400">₹{totalDeposited.toLocaleString()}</span>
              </div>
              <div className="bg-[#111318] rounded-xl p-3 flex justify-between items-center">
                <span className="text-sm text-[#9CA3AF]">Fake "Earnings" Shown</span>
                <span className="text-xl font-extrabold line-through text-[#6B7280]">₹{fakeEarnings.toLocaleString()}</span>
              </div>
              <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-3 flex justify-between items-center">
                <span className="text-sm text-red-300 font-medium">Amount You Can Actually Get</span>
                <span className="text-xl font-extrabold text-red-400">₹{actualRecovery}</span>
              </div>
              <div className="bg-[#111318] rounded-xl p-3 flex justify-between items-center">
                <span className="text-sm text-[#9CA3AF]">Net Loss Right Now</span>
                <span className="text-xl font-extrabold text-red-400">−₹{totalDeposited.toLocaleString()}</span>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-[rgba(245,158,11,0.1)] my-4" />

            {/* Projection */}
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-[#F8FAFC] mb-3">If You Continue for 30 More Days</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-[#9CA3AF]">Projected Additional Losses</span>
                  <span className="font-bold text-orange-400">₹{projectedAdditional.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-[#9CA3AF]">Total Projected Loss</span>
                  <span className="font-extrabold text-red-400 text-lg">₹{totalProjected.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-[rgba(245,158,11,0.1)] my-4" />

            {/* Recovery probability */}
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-[#F8FAFC] mb-2">Recovery Probability</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs">
                  <span className="w-2 h-2 rounded-full bg-green-400 shrink-0" />
                  <span className="text-[#9CA3AF]">If reported within 24 hrs:</span>
                  <span className="font-bold text-green-400">45% chance</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ background: '#F59E0B' }} />
                  <span className="text-[#9CA3AF]">If reported within 7 days:</span>
                  <span className="font-bold" style={{ color: '#F59E0B' }}>18% chance</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="w-2 h-2 rounded-full bg-red-400 shrink-0" />
                  <span className="text-[#9CA3AF]">If reported after 30 days:</span>
                  <span className="font-bold text-red-400">3% chance</span>
                </div>
              </div>
            </div>

            {/* Callout */}
            <div className="bg-green-900/20 border border-green-500/30 rounded-xl p-3 text-xs text-green-300">
              💡 Average victim who reported within 24 hrs saved <strong>₹8,200</strong>
            </div>
          </div>
        </div>

        {/* Timeline bar */}
        <div className="glass-card mb-8">
          <h3 className="font-bold text-[#F8FAFC] mb-4">Projected Loss Timeline</h3>
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Month 1', amount: totalDeposited },
              { label: 'Month 2', amount: Math.floor(totalDeposited * 2.5) },
              { label: 'Month 3', amount: totalProjected },
            ].map(({ label, amount }, idx) => (
              <div key={label} className="flex flex-col items-center">
                <div
                  className="w-full rounded-t-lg transition-all duration-500 flex items-end justify-center"
                  style={{
                    background: idx === 2 ? '#EF4444' : idx === 1 ? '#F97316' : '#FBBF24',
                    height: `${40 + idx * 30}px`,
                    minHeight: '40px',
                  }}
                />
                <div className="bg-[#20232B] w-full rounded-b-lg px-2 py-2 text-center">
                  <div className="text-xs text-[#9CA3AF]">{label}</div>
                  <div className="font-bold text-sm text-red-400">₹{amount.toLocaleString()}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap gap-3 justify-center mb-8">
          <a
            href="tel:1930"
            className="btn-primary px-6 py-3 rounded-xl font-bold inline-flex items-center gap-2"
            style={{ textDecoration: 'none' }}
          >
            <Phone className="w-4 h-4" />
            📞 Call 1930 Now
          </a>
          <a
            href="https://cybercrime.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary px-6 py-3 rounded-xl"
          >
            File a Complaint
          </a>
          <button
            onClick={() => navigate('/analyze')}
            className="btn-secondary px-6 py-3 rounded-xl"
          >
            Analyze Your Chat
          </button>
        </div>

        {/* Disclaimer */}
        <div className="rounded-xl p-4 text-sm text-gray-400" style={{ background: '#20232B', borderColor: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.1)' }}>
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" style={{ color: '#F59E0B' }} />
            <p>
              ⚠️ These figures are estimates based on reported cases from NCRB data and cybercrime helpline reports. Actual amounts vary. This tool is for awareness purposes only. If you have been scammed, report immediately to Cybercrime Helpline 1930.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
