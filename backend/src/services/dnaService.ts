import type { DnaAnalysisResult, BehavioralSignal, RiskLevel } from '../types';

const TACTICS: Array<{
  id: string;
  label: string;
  description: string;
  category: BehavioralSignal['category'];
  keywords: string[];
  weight: number;
}> = [
  { id: 'act-now', label: 'Artificial Urgency', description: 'Creating false time pressure to prevent careful thinking', category: 'urgency', keywords: ['act now', 'limited time', 'hurry', 'deadline', 'expires', 'last chance', 'today only', 'urgent', 'immediately'], weight: 20 },
  { id: 'authority', label: 'False Authority', description: 'Impersonating trusted institutions to gain credibility', category: 'authority', keywords: ['rbi approved', 'government certified', 'sebi registered', 'ministry', 'official', 'authorized by', 'certified by', 'regulated'], weight: 25 },
  { id: 'isolation', label: 'Victim Isolation', description: 'Cutting victims off from support networks who might warn them', category: 'isolation', keywords: ["don't tell family", 'keep secret', 'confidential', 'private offer', 'only you', 'special selection', 'do not share', 'between us'], weight: 30 },
  { id: 'financial', label: 'Financial Pressure', description: 'Creating false investment or deposit obligations', category: 'financial', keywords: ['invest now', 'guaranteed returns', 'deposit to earn', 'registration fee', 'unlock tasks', 'pay to work', 'refundable', 'commission', 'daily earning'], weight: 25 },
  { id: 'trust', label: 'Trust Manipulation', description: 'Using fake proofs to manufacture credibility', category: 'trust', keywords: ['we paid you', 'see your earnings', 'withdrawals pending', 'balance showing', 'your account', 'proof of payment', 'screenshots'], weight: 15 },
];

export function analyzeBehavior(text: string): DnaAnalysisResult {
  const lower = text.toLowerCase();
  const detected: BehavioralSignal[] = [];
  const categoryScores: Record<string, number> = {};

  for (const tactic of TACTICS) {
    const matchCount = tactic.keywords.filter(kw => lower.includes(kw)).length;
    if (matchCount > 0) {
      const w = Math.min(tactic.weight * matchCount, tactic.weight * 2);
      detected.push({ id: tactic.id, label: tactic.label, description: tactic.description, weight: w, category: tactic.category });
      categoryScores[tactic.category] = (categoryScores[tactic.category] ?? 0) + w;
    }
  }

  const totalWeight = detected.reduce((sum, s) => sum + s.weight, 0);
  const behavioralScore = Math.min(Math.round(totalWeight * 1.5), 100);

  const riskLevel: RiskLevel =
    behavioralScore >= 60 ? 'HIGH_RISK' : behavioralScore >= 25 ? 'SUSPICIOUS' : 'SAFE';

  const primaryCategory = Object.entries(categoryScores).sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'none';
  const primaryTacticLabel = detected.find(d => d.category === primaryCategory)?.label ?? 'None detected';

  const warnings: Record<string, string> = {
    urgency: 'Urgency tactics exploit your fear of missing out, preventing rational decision-making.',
    authority: 'False authority exploits your trust in institutions — real government agencies never solicit investment jobs.',
    isolation: 'Isolation tactics remove your safety net. Legitimate employers never ask you to hide an opportunity.',
    financial: 'Financial pressure is the clearest scam signal — legitimate jobs pay you, they never ask you to pay first.',
    trust: 'Fabricated payment screenshots are the most common scam tool to make you believe you are earning.',
    none: 'Low manipulation signals detected. Still verify the company independently.',
  };

  const recommendations: Record<string, string> = {
    urgency: 'Take 24 hours before deciding. Legitimate offers do not expire overnight.',
    authority: 'Verify credentials at sebi.gov.in, rbi.org.in, or mca.gov.in before proceeding.',
    isolation: 'Immediately tell a trusted family member or friend about this opportunity.',
    financial: 'Never pay any amount to get a job. Report to cybercrime.gov.in right away.',
    trust: 'Demand a live bank transfer verification, not screenshots. Do not proceed on screenshots alone.',
    none: 'Exercise standard caution — verify the company registration and contact details independently.',
  };

  return {
    behavioralScore,
    riskLevel,
    manipulationTactics: detected,
    primaryTactic: primaryTacticLabel,
    vulnerabilityWarning: warnings[primaryCategory] ?? warnings['none'],
    recommendation: recommendations[primaryCategory] ?? recommendations['none'],
  };
}
