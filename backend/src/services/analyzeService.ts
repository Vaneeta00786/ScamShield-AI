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

const KNOWN_LEGIT_COMPANIES = [
  'tcs', 'wipro', 'infosys', 'accenture', 'hcl', 'ibm', 'cognizant',
  'capgemini', 'tech mahindra', 'amazon', 'google', 'microsoft',
];

const KEYWORD_WARNINGS: Array<{
  keywords: string[];
  warning: ScamWarningSign;
  scoreAdd: number;
  stage: ScamStage;
  inputTypes?: Array<'job_post' | 'chat' | 'offer_letter'>;
}> = [
  // ── Payment / Deposit ────────────────────────────────────────────
  {
    keywords: [
      'deposit', 'pay ₹', 'pay rs', 'registration fee', 'wallet activation',
      'security deposit', 'processing fee', 'joining fee', 'training fee',
      'id card fee', 'uniform deposit', 'refundable deposit', 'kyc fee',
    ],
    warning: {
      id: 'w-deposit',
      label: 'Upfront Deposit Required',
      description: 'The offer requires payment before work can begin. Legitimate jobs never charge workers.',
      severity: 'high',
    },
    scoreAdd: 30,
    stage: 'deposit_demand',
  },
  // ── Unlock tasks ─────────────────────────────────────────────────
  {
    keywords: ['unlock', 'activate wallet', 'activate your account'],
    warning: {
      id: 'w-unlock',
      label: 'Pay-to-Unlock Task Pattern',
      description: 'Asking you to pay to unlock tasks or earnings is a classic scam tactic.',
      severity: 'high',
    },
    scoreAdd: 25,
    stage: 'prepaid_task_escalation',
  },
  // ── Prepay ───────────────────────────────────────────────────────
  {
    keywords: ['prepay', 'pre-pay', 'prepaid', 'advance payment', 'pay in advance'],
    warning: {
      id: 'w-prepay',
      label: 'Prepayment Demand',
      description: 'Requiring prepayment before tasks or earnings are released is a known fraud pattern.',
      severity: 'high',
    },
    scoreAdd: 30,
    stage: 'prepaid_task_escalation',
  },
  // ── Telegram ─────────────────────────────────────────────────────
  {
    keywords: ['telegram', 't.me/'],
    warning: {
      id: 'w-telegram',
      label: 'Move to Private Channel',
      description: 'Directing communication to Telegram avoids accountability and is a common scam tactic.',
      severity: 'medium',
    },
    scoreAdd: 20,
    stage: 'trust_building',
  },
  // ── WhatsApp only ────────────────────────────────────────────────
  {
    keywords: ['whatsapp only', 'whatsapp number', 'contact on whatsapp', 'msg on whatsapp'],
    warning: {
      id: 'w-whatsapp',
      label: 'WhatsApp-Only Communication',
      description: 'Legitimate recruiters use official company email. WhatsApp-only contact is a red flag.',
      severity: 'medium',
    },
    scoreAdd: 15,
    stage: 'trust_building',
  },
  // ── Unrealistic earnings ─────────────────────────────────────────
  {
    keywords: [
      'earn ₹', 'earn rs', 'earning ₹', 'earning rs',
      'earn upto', 'earn up to', 'earn daily', 'guaranteed income',
      'guaranteed salary', 'guaranteed earnings', 'guaranteed returns',
    ],
    warning: {
      id: 'w-earn',
      label: 'Unrealistic Earning Claim',
      description: 'Promises of unusually high earnings are used to attract and deceive victims.',
      severity: 'medium',
    },
    scoreAdd: 15,
    stage: 'initial_attraction',
  },
  // ── Daily / per day ──────────────────────────────────────────────
  {
    keywords: ['daily', 'per day', 'per hour', 'every day'],
    warning: {
      id: 'w-daily',
      label: 'Daily Earnings Bait',
      description: 'Framing income as high daily amounts inflates perception of earnings to lure victims.',
      severity: 'low',
    },
    scoreAdd: 10,
    stage: 'initial_attraction',
  },
  // ── WFH ─────────────────────────────────────────────────────────
  {
    keywords: ['work from home', 'wfh', 'from home', 'home based', 'home-based', 'work at home'],
    warning: {
      id: 'w-wfh',
      label: 'Unverified WFH Claim',
      description: 'Fake WFH job offers are a very common scam vector, especially with high salary claims.',
      severity: 'low',
    },
    scoreAdd: 5,
    stage: 'initial_attraction',
  },
  // ── Liking tasks ─────────────────────────────────────────────────
  {
    keywords: ['liking', 'like videos', 'like posts', 'like and earn', 'like product'],
    warning: {
      id: 'w-liking',
      label: 'Paid Social Media Liking Task',
      description: 'No legitimate company pays for liking videos or posts. This is always a scam.',
      severity: 'high',
    },
    scoreAdd: 35,
    stage: 'small_task_payment',
  },
  // ── Simple task ──────────────────────────────────────────────────
  {
    keywords: ['simple task', 'easy task', 'simple work', 'easy work', 'easy job', 'no experience required', 'no experience needed'],
    warning: {
      id: 'w-simple',
      label: 'Vague Simple Task Description',
      description: 'Vague "simple task" job descriptions are used to attract victims without revealing the scam.',
      severity: 'medium',
    },
    scoreAdd: 15,
    stage: 'initial_attraction',
  },
  // ── Withdrawal ───────────────────────────────────────────────────
  {
    keywords: ['withdrawal fee', 'withdrawal blocked', 'cannot withdraw', 'withdraw blocked', 'tax to withdraw'],
    warning: {
      id: 'w-withdraw',
      label: 'Withdrawal Restriction Pattern',
      description: 'Blocking withdrawals unless more money is paid is a classic deposit-to-withdraw scam.',
      severity: 'high',
    },
    scoreAdd: 30,
    stage: 'withdrawal_blockage',
  },

  // ── OFFER LETTER SPECIFIC PATTERNS ───────────────────────────────
  {
    keywords: [
      'gmail.com', 'yahoo.com', 'rediffmail.com', 'hotmail.com', 'outlook.com',
    ],
    warning: {
      id: 'w-personal-email',
      label: 'Personal Email Used for Official Communication',
      description: 'Legitimate companies send offer letters from official company domains, not Gmail or Yahoo.',
      severity: 'high',
    },
    scoreAdd: 30,
    stage: 'trust_building',
    inputTypes: ['offer_letter', 'job_post'],
  },
  {
    keywords: [
      'selected without interview', 'no interview required', 'direct selection',
      'selected for the post', 'selected you for', 'you have been selected',
      'congratulations you are selected',
    ],
    warning: {
      id: 'w-no-interview',
      label: 'Selected Without Interview',
      description: 'Legitimate companies conduct proper interviews. Selection without any interview is a major red flag.',
      severity: 'high',
    },
    scoreAdd: 25,
    stage: 'initial_attraction',
    inputTypes: ['offer_letter'],
  },
  {
    keywords: [
      'send documents', 'submit documents', 'documents required urgently',
      'send aadhar', 'send pan', 'bank details required', 'share bank account',
      'send your details', 'kyc documents', 'send passport',
    ],
    warning: {
      id: 'w-documents',
      label: 'Urgent Document Request',
      description: 'Asking for Aadhaar, PAN or bank details before a formal process is identity theft risk.',
      severity: 'high',
    },
    scoreAdd: 25,
    stage: 'trust_building',
    inputTypes: ['offer_letter', 'job_post'],
  },
  {
    keywords: [
      'no experience', 'fresher', 'part time', 'part-time',
      'flexible hours', 'work 2 hours', 'work 3 hours', 'only 2 hours',
    ],
    warning: {
      id: 'w-parttime',
      label: 'Suspiciously Easy Job Requirements',
      description: 'Offers requiring minimal work for high pay are typically fraudulent.',
      severity: 'medium',
    },
    scoreAdd: 15,
    stage: 'initial_attraction',
  },
  {
    keywords: [
      'high salary', 'attractive salary', 'best salary', 'lakh per month',
      'lakhs per month', 'lpa', 'unlimited earning', 'unlimited income',
    ],
    warning: {
      id: 'w-highsalary',
      label: 'Unrealistically High Salary Offer',
      description: 'Inflated salary claims are used to lure victims into fake job schemes.',
      severity: 'medium',
    },
    scoreAdd: 15,
    stage: 'initial_attraction',
  },
  {
    keywords: [
      'urgently required', 'urgent hiring', 'immediate joining', 'join immediately',
      'joining in 24 hours', 'joining in 48 hours', 'limited seats', 'limited vacancy',
      'act fast', 'hurry', 'last date',
    ],
    warning: {
      id: 'w-urgency',
      label: 'Artificial Urgency Created',
      description: 'Creating time pressure prevents victims from verifying the offer independently.',
      severity: 'medium',
    },
    scoreAdd: 15,
    stage: 'trust_building',
  },
  {
    keywords: [
      'not registered', 'unregistered company', 'new company', 'startup opportunity',
      'private limited', 'pvt ltd',
    ],
    warning: {
      id: 'w-unregistered',
      label: 'Unverifiable Company',
      description: 'Companies without verifiable registration are a major red flag in recruitment.',
      severity: 'medium',
    },
    scoreAdd: 10,
    stage: 'initial_attraction',
  },
];

const SUSPICIOUS_PHRASE_PATTERNS: Array<{ pattern: RegExp; reason: string }> = [
  { pattern: /pay\s*[₹rs\.]*\s*\d+/i, reason: 'Requesting payment of a specific amount before work begins.' },
  { pattern: /earn\s*[₹rs\.]*\s*\d+\s*(daily|per day|a day)/i, reason: 'Unrealistically high daily income claim.' },
  { pattern: /join.*telegram/i, reason: 'Moving to Telegram avoids accountability.' },
  { pattern: /contact.*whatsapp.*only/i, reason: 'Legitimate recruiters use company email, not personal WhatsApp.' },
  { pattern: /registration\s*fee/i, reason: 'Real employers never charge candidates to apply or start work.' },
  { pattern: /wallet\s*activation/i, reason: 'Wallet activation fees are a fabricated charge.' },
  { pattern: /unlock.*task/i, reason: 'Paying to unlock tasks is a hallmark of prepaid task scams.' },
  { pattern: /simple\s*task.*earn/i, reason: 'Vague simple task promises paired with high earnings are classic scam bait.' },
  { pattern: /selected.*without.*interview/i, reason: 'No legitimate company selects candidates without any interview.' },
  { pattern: /(gmail|yahoo|rediffmail)\.com/i, reason: 'Official offer letters come from company domain emails, not personal email services.' },
  { pattern: /send.*aadhar|send.*pan|share.*bank/i, reason: 'Asking for sensitive documents/bank details upfront is identity fraud risk.' },
  { pattern: /\d+\s*lakh.*per\s*month|\d+\s*lpa/i, reason: 'Salary claims should be verified against industry standards.' },
  { pattern: /urgent(ly)?\s*(required|hiring|joining)/i, reason: 'Artificial urgency prevents victims from verifying the offer.' },
  { pattern: /joining\s*(fee|amount|charges)/i, reason: 'Real employers never charge a joining fee.' },
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
    'withdrawal_blockage', 'deposit_demand', 'prepaid_task_escalation',
    'small_task_payment', 'trust_building', 'initial_attraction',
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

  for (const { keywords, warning, scoreAdd, stage, inputTypes } of KEYWORD_WARNINGS) {
    // Skip if this warning is not applicable for this input type
    if (inputTypes && !inputTypes.includes(input.inputType)) continue;

    if (keywords.some((kw) => lowerText.includes(kw.toLowerCase()))) {
      if (!addedWarningIds.has(warning.id)) {
        detectedWarnings.push(warning);
        addedWarningIds.add(warning.id);
        riskScore += scoreAdd;
        detectedStages.push(stage);
      }
    }
  }

  // Offer letter: boost score slightly if multiple weak signals present
  if (input.inputType === 'offer_letter' && detectedWarnings.length >= 2) {
    riskScore = Math.min(riskScore + 10, 100);
  }

  riskScore = Math.min(100, riskScore);

  const riskLevel: RiskLevel =
    riskScore >= 60 ? 'HIGH_RISK' : riskScore >= 25 ? 'SUSPICIOUS' : 'SAFE';

  const currentStage = determineStage(detectedStages);
  const suspiciousPhrases = detectSuspiciousPhrases(input.text);
  const companyVerification = input.companyName ? verifyCompanyQuick(input.companyName) : null;

  let summary: string;
  if (riskLevel === 'HIGH_RISK') {
    summary = 'This offer matches multiple known scam patterns. High risk indicators detected — do not proceed, do not share personal information, and do not send any money. Report to cybercrime.gov.in or call 1930.';
  } else if (riskLevel === 'SUSPICIOUS') {
    summary = 'Several suspicious characteristics were detected. Exercise caution and verify the company independently before proceeding.';
  } else {
    summary = 'No major red flags detected in this offer. Always independently verify the company and never pay upfront fees before accepting any job.';
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
