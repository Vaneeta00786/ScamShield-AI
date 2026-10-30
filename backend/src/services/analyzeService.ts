import type {
  ScanResult,
  ScamWarningSign,
  SuspiciousPhrase,
  ScamStage,
  RiskLevel,
  CompanyVerificationResult,
} from '../types';

interface AnalyzeInput {
  inputType: 'job_post' | 'chat' | 'offer_letter';
  text: string;
  companyName?: string;
  jobUrl?: string;
  platform?: string;
}

const KNOWN_LEGIT_COMPANIES = ['tcs', 'wipro', 'infosys', 'accenture', 'hcl', 'ibm', 'cognizant', 'capgemini', 'tech mahindra', 'amazon', 'google', 'microsoft'];

const KEYWORD_WARNINGS: Array<{
  keywords: string[];
  warning: ScamWarningSign;
  scoreAdd: number;
  stage: ScamStage;
}> = [
  {
    keywords: ['deposit', 'pay ₹', 'registration fee', 'wallet activation'],
    warning: {
      id: 'w-deposit',
      label: 'Upfront Deposit Required',
      description: 'The offer requires payment before work can begin. Legitimate jobs never charge workers.',
      severity: 'high',
    },
    scoreAdd: 30,
    stage: 'deposit_demand',
  },
  {
    keywords: ['unlock'],
    warning: {
      id: 'w-unlock',
      label: 'Pay-to-Unlock Task Pattern',
      description: 'Asking you to pay to unlock tasks or earnings is a classic scam tactic.',
      severity: 'high',
    },
    scoreAdd: 25,
    stage: 'prepaid_task_escalation',
  },
  {
    keywords: ['prepay', 'pre-pay', 'prepaid'],
    warning: {
      id: 'w-prepay',
      label: 'Prepayment Demand',
      description: 'Requiring prepayment before tasks or earnings are released is a known fraud pattern.',
      severity: 'high',
    },
    scoreAdd: 30,
    stage: 'prepaid_task_escalation',
  },
  {
    keywords: ['telegram'],
    warning: {
      id: 'w-telegram',
      label: 'Move to Private Channel',
      description: 'Directing communication to Telegram avoids accountability and is a common scam tactic.',
      severity: 'medium',
    },
    scoreAdd: 20,
    stage: 'trust_building',
  },
  {
    keywords: ['whatsapp only', 'whatsapp number'],
    warning: {
      id: 'w-whatsapp',
      label: 'WhatsApp-Only Communication',
      description: 'Legitimate recruiters use official company email. WhatsApp-only contact is a red flag.',
      severity: 'medium',
    },
    scoreAdd: 15,
    stage: 'trust_building',
  },
  {
    keywords: ['earn ₹', 'earning ₹'],
    warning: {
      id: 'w-earn',
      label: 'Unrealistic Earning Claim',
      description: 'Promises of unusually high daily earnings are used to attract and deceive victims.',
      severity: 'medium',
    },
    scoreAdd: 15,
    stage: 'initial_attraction',
  },
  {
    keywords: ['daily', 'per day'],
    warning: {
      id: 'w-daily',
      label: 'Daily Earnings Bait',
      description: 'Framing income as high daily amounts inflates perception of earnings to lure victims.',
      severity: 'low',
    },
    scoreAdd: 10,
    stage: 'initial_attraction',
  },
  {
    keywords: ['home', 'work from home', 'wfh', 'from home'],
    warning: {
      id: 'w-wfh',
      label: 'Unverified WFH Claim',
      description: 'Fake WFH job offers are a very common scam vector, especially with high salary claims.',
      severity: 'low',
    },
    scoreAdd: 5,
    stage: 'initial_attraction',
  },
  {
    keywords: ['liking', 'like videos', 'like posts'],
    warning: {
      id: 'w-liking',
      label: 'Paid Social Media Liking Task',
      description: 'No legitimate company pays for liking videos or posts. This is always a scam.',
      severity: 'high',
    },
    scoreAdd: 35,
    stage: 'small_task_payment',
  },
  {
    keywords: ['simple task', 'easy task', 'simple work'],
    warning: {
      id: 'w-simple',
      label: 'Vague Simple Task Description',
      description: 'Vague "simple task" job descriptions are used to attract victims without revealing the scam.',
      severity: 'medium',
    },
    scoreAdd: 15,
    stage: 'initial_attraction',
  },
  {
    keywords: ['withdraw', 'withdrawal fee', 'withdrawal blocked'],
    warning: {
      id: 'w-withdraw',
      label: 'Withdrawal Restriction Pattern',
      description: 'Blocking withdrawals unless more money is paid is a classic deposit-to-withdraw scam.',
      severity: 'high',
    },
    scoreAdd: 30,
    stage: 'withdrawal_blockage',
  },
];

const SUSPICIOUS_PHRASE_PATTERNS: Array<{ pattern: RegExp; reason: string }> = [
  {
    pattern: /pay\s*[₹rs\.]*\s*\d+/i,
    reason: 'Requesting payment of a specific amount before work begins.',
  },
  {
    pattern: /earn\s*[₹rs\.]*\s*\d+\s*(daily|per day|a day)/i,
    reason: 'Unrealistically high daily income claim used to attract victims.',
  },
  {
    pattern: /join.*telegram/i,
    reason: 'Moving to Telegram avoids accountability and is a common scam tactic.',
  },
  {
    pattern: /contact.*whatsapp.*only/i,
    reason: 'Legitimate recruiters use company email addresses, not personal WhatsApp.',
  },
  {
    pattern: /registration\s*fee/i,
    reason: 'Real employers never charge candidates to apply or start work.',
  },
  {
    pattern: /wallet\s*activation/i,
    reason: 'Wallet activation fees are a fabricated charge used to extract money from victims.',
  },
  {
    pattern: /unlock.*task/i,
    reason: 'Paying to unlock tasks is a hallmark of prepaid task scams.',
  },
  {
    pattern: /simple\s*task.*earn/i,
    reason: 'Vague simple task promises paired with high earnings are classic scam bait.',
  },
];

function detectSuspiciousPhrases(text: string): SuspiciousPhrase[] {
  const found: SuspiciousPhrase[] = [];
  const lowerText = text.toLowerCase();
  for (const { pattern, reason } of SUSPICIOUS_PHRASE_PATTERNS) {
    const match = lowerText.match(pattern);
    if (match) {
      found.push({ phrase: match[0], reason });
    }
  }
  return found;
}

function determineStage(stages: ScamStage[]): ScamStage {
  const priority: ScamStage[] = [
    'withdrawal_blockage',
    'deposit_demand',
    'prepaid_task_escalation',
    'small_task_payment',
    'trust_building',
    'initial_attraction',
  ];
  for (const s of priority) {
    if (stages.includes(s)) return s;
  }
  return 'initial_attraction';
}

function verifyCompanyQuick(companyName: string): CompanyVerificationResult {
  const lower = companyName.toLowerCase().trim();
  const isLegit = KNOWN_LEGIT_COMPANIES.some((c) => lower.includes(c));
  return {
    companyName,
    registryStatus: isLegit ? 'found' : 'unverified',
    domainStatus: isLegit ? 'verified' : 'not_checked',
    note: isLegit
      ? 'Known legitimate company — always verify offer letters on the official website.'
      : 'Company not found in known-legit list. Verify independently on MCA21 or the company website.',
  };
}

export function analyzeText(input: AnalyzeInput): ScanResult {
  const lowerText = input.text.toLowerCase();
  const detectedWarnings: ScamWarningSign[] = [];
  const detectedStages: ScamStage[] = [];
  let riskScore = 0;
  const addedWarningIds = new Set<string>();

  for (const { keywords, warning, scoreAdd, stage } of KEYWORD_WARNINGS) {
    if (keywords.some((kw) => lowerText.includes(kw.toLowerCase()))) {
      if (!addedWarningIds.has(warning.id)) {
        detectedWarnings.push(warning);
        addedWarningIds.add(warning.id);
        riskScore += scoreAdd;
        detectedStages.push(stage);
      }
    }
  }

  // Cap score at 100
  riskScore = Math.min(100, riskScore);

  const riskLevel: RiskLevel =
    riskScore >= 60 ? 'HIGH_RISK' : riskScore >= 30 ? 'SUSPICIOUS' : 'SAFE';

  const currentStage = determineStage(detectedStages);

  const suspiciousPhrases = detectSuspiciousPhrases(input.text);

  const companyVerification = input.companyName
    ? verifyCompanyQuick(input.companyName)
    : null;

  let summary: string;
  if (riskLevel === 'HIGH_RISK') {
    summary =
      'This offer matches multiple known scam patterns. High risk indicators detected — do not proceed, do not share personal information, and do not send any money. Report to cybercrime.gov.in or call 1930.';
  } else if (riskLevel === 'SUSPICIOUS') {
    summary =
      'Several suspicious characteristics were detected. While no definitive scam pattern was matched, exercise caution. Verify the company independently before proceeding.';
  } else {
    summary =
      'No major red flags detected in this offer. Always independently verify the company and never pay upfront fees before accepting any job.';
  }

  return {
    id: Date.now().toString(36),
    timestamp: Date.now(),
    inputType: input.inputType,
    riskLevel,
    riskScore,
    warningSignsDetected: detectedWarnings,
    suspiciousPhrases,
    currentStage,
    companyVerification,
    summary,
    isDemo: false,
  };
}
