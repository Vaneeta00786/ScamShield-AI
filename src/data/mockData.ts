import type {
  DashboardStats,
  WeeklyDataPoint,
  ScamPattern,
  ScanResult,
} from '../types';

export const DASHBOARD_STATS: DashboardStats = {
  totalScans: 1247,
  scamAlerts: 389,
  safeOffers: 724,
  suspiciousReviewed: 134,
};

export const WEEKLY_DATA: WeeklyDataPoint[] = [
  { day: 'Mon', scams: 12, safe: 28, suspicious: 7 },
  { day: 'Tue', scams: 19, safe: 31, suspicious: 11 },
  { day: 'Wed', scams: 8, safe: 42, suspicious: 5 },
  { day: 'Thu', scams: 24, safe: 19, suspicious: 14 },
  { day: 'Fri', scams: 31, safe: 24, suspicious: 18 },
  { day: 'Sat', scams: 15, safe: 35, suspicious: 9 },
  { day: 'Sun', scams: 10, safe: 47, suspicious: 6 },
];

export const SCAM_PATTERNS: ScamPattern[] = [
  {
    id: 'like-videos',
    title: 'Like Videos and Earn',
    emoji: '📱',
    description:
      'Victims are promised ₹300–₹1000 per task for simply liking YouTube or Instagram videos. Initial small payouts build trust before larger deposits are demanded.',
    warningSigns: [
      'Asked to join a Telegram group to receive tasks',
      'Initial payments are made to build trust',
      'Deposit required to "unlock" higher-paying tasks',
      'No written employment contract provided',
    ],
    typicalStage: 'small_task_payment',
    safetyAdvice:
      'No legitimate company pays you for liking social media videos. This is always a scam. Block and report immediately.',
  },
  {
    id: 'telegram-prepaid',
    title: 'Telegram Prepaid Task Scams',
    emoji: '💬',
    description:
      'Recruiters on Telegram offer high-paying "simple tasks". Victims are asked to prepay for each task batch, with withdrawals always blocked by new "fees".',
    warningSigns: [
      'Recruiter insists on communicating only via Telegram',
      'Must pay before receiving tasks or withdrawing earnings',
      'Urgent pressure: "limited slots available"',
      'Company cannot be found on any public registry',
    ],
    typicalStage: 'prepaid_task_escalation',
    safetyAdvice:
      'Legitimate work never requires you to pay upfront. If you cannot withdraw without paying a fee, you are being scammed.',
  },
  {
    id: 'fake-wfh',
    title: 'Fake Work-From-Home Jobs',
    emoji: '🏠',
    description:
      'Fraudulent WFH job posts on social media promise high salaries with no experience required. Victims are asked to pay a registration or training fee before starting.',
    warningSigns: [
      'Vague job description with unusually high salary',
      'Recruiter contacts via personal WhatsApp number',
      'Requests personal documents before any interview',
      'Company has no verifiable website or address',
    ],
    typicalStage: 'trust_building',
    safetyAdvice:
      'Verify the company on official directories before sharing any documents or money. Call the company directly using numbers found independently.',
  },
  {
    id: 'registration-fee',
    title: 'Registration Fee Scams',
    emoji: '💰',
    description:
      'Fake recruitment agencies charge candidates a "registration fee", "ID card fee", or "uniform deposit" before the job begins. The job never materialises.',
    warningSigns: [
      'Asked to pay a registration or processing fee',
      'Offer letter sent before any formal interview',
      'Fee amount increases after initial payment',
      'Recruiter becomes unreachable after payment',
    ],
    typicalStage: 'deposit_demand',
    safetyAdvice:
      'Real employers never charge candidates to apply or start work. Any upfront fee request is a scam — report it to 1930.',
  },
  {
    id: 'fake-agency',
    title: 'Fake Recruitment Agencies',
    emoji: '🏢',
    description:
      'Fake agencies impersonate well-known companies like TCS, Wipro or Amazon, sending official-looking offer letters and asking for document verification fees.',
    warningSigns: [
      'Uses well-known company name but contacts from Gmail/Yahoo',
      'Offer letter has spelling mistakes or wrong logos',
      'No HR email on the official company domain',
      'Asks for Aadhaar, PAN and bank details upfront',
    ],
    typicalStage: 'initial_attraction',
    safetyAdvice:
      'Always verify offer letters by calling the company\'s official number from their website. Never share documents with unverified recruiters.',
  },
  {
    id: 'deposit-withdraw',
    title: 'Deposit-to-Withdraw Scams',
    emoji: '🔒',
    description:
      'Victims are shown large "earned" balances in a fake app but cannot withdraw without depositing a "tax payment", "security deposit", or "wallet activation fee".',
    warningSigns: [
      'Cannot withdraw earnings without paying a fee first',
      'Balance keeps growing but withdrawal always fails',
      'New fees appear every time withdrawal is attempted',
      'App or website looks professional but is not on Play Store',
    ],
    typicalStage: 'withdrawal_blockage',
    safetyAdvice:
      'Your "earnings" do not exist — they are fake numbers in a scam app. Stop all payments and report to cybercrime.gov.in immediately.',
  },
];

export const MOCK_HIGH_RISK_RESULT: ScanResult = {
  id: 'demo-high-risk',
  timestamp: Date.now(),
  inputType: 'job_post',
  riskLevel: 'HIGH_RISK',
  riskScore: 87,
  warningSignsDetected: [
    {
      id: 'w1',
      label: 'Upfront Deposit Required',
      description: 'The offer requires payment before work can begin. Legitimate jobs never charge workers.',
      severity: 'high',
    },
    {
      id: 'w2',
      label: 'Unverifiable Company',
      description: 'No company registration found in public records. The company identity cannot be confirmed.',
      severity: 'high',
    },
    {
      id: 'w3',
      label: 'Move to Private Chat',
      description: 'Recruiter is pushing communication to Telegram or WhatsApp to avoid a paper trail.',
      severity: 'medium',
    },
    {
      id: 'w4',
      label: 'Task-to-Prepaid Escalation Pattern',
      description: 'The offer matches a known scam pattern where victims are gradually asked to pay more.',
      severity: 'high',
    },
  ],
  suspiciousPhrases: [
    {
      phrase: 'Pay ₹500 to unlock your tasks',
      reason: 'Legitimate jobs never charge workers to receive tasks.',
    },
    {
      phrase: 'Earn ₹5000 daily from home',
      reason: 'Unrealistically high income claim used to attract victims.',
    },
    {
      phrase: 'Join our Telegram group immediately',
      reason: 'Moving to private channels avoids accountability.',
    },
  ],
  currentStage: 'prepaid_task_escalation',
  companyVerification: {
    companyName: 'Unknown Corp',
    registryStatus: 'not_found',
    domainStatus: 'suspicious',
    note: '⚠️ Demo Data — not real MCA verification',
  },
  summary:
    'This offer matches a well-known Telegram task scam. You are being asked to deposit money before you can complete tasks or withdraw earnings. Victims typically lose ₹2,000–₹50,000 at this stage as every withdrawal attempt is blocked by new fees. Do not send any money.',
  isDemo: true,
};

export const MOCK_SUSPICIOUS_RESULT: ScanResult = {
  id: 'demo-suspicious',
  timestamp: Date.now(),
  inputType: 'offer_letter',
  riskLevel: 'SUSPICIOUS',
  riskScore: 52,
  warningSignsDetected: [
    {
      id: 'w1',
      label: 'Company Cannot Be Verified',
      description: 'The company name does not match any verified registration in public records.',
      severity: 'medium',
    },
    {
      id: 'w2',
      label: 'Request for Documents Too Early',
      description: 'Asking for Aadhaar, PAN or bank details before a formal interview is a red flag.',
      severity: 'medium',
    },
  ],
  suspiciousPhrases: [
    {
      phrase: 'Contact on WhatsApp only',
      reason: 'Legitimate recruiters use company email addresses.',
    },
  ],
  currentStage: 'trust_building',
  companyVerification: {
    companyName: 'Unverified Company',
    registryStatus: 'unverified',
    domainStatus: 'not_checked',
    note: '⚠️ Demo Data — not real MCA verification',
  },
  summary:
    'This offer has several suspicious characteristics. While no payment demand has been made yet, the recruiter may be building trust before revealing fees. Verify the company independently before sharing personal documents or proceeding further.',
  isDemo: true,
};

export const MOCK_SAFE_RESULT: ScanResult = {
  id: 'demo-safe',
  timestamp: Date.now(),
  inputType: 'job_post',
  riskLevel: 'SAFE',
  riskScore: 12,
  warningSignsDetected: [],
  suspiciousPhrases: [],
  currentStage: 'initial_attraction',
  companyVerification: {
    companyName: 'Verified Company',
    registryStatus: 'found',
    domainStatus: 'verified',
    note: '⚠️ Demo Data — not real MCA verification',
  },
  summary:
    'This job offer appears legitimate. The company has a verifiable presence, the salary range is reasonable for the role, and there are no requests for upfront payments or personal financial information. Always independently verify before accepting.',
  isDemo: true,
};

export const RECENT_ALERTS = [
  {
    id: 'a1',
    title: 'Telegram Task Scam Detected',
    description: 'Job post requesting ₹500 deposit to unlock earning tasks.',
    time: '2 minutes ago',
    riskLevel: 'HIGH_RISK' as const,
  },
  {
    id: 'a2',
    title: 'Fake WFH Offer Flagged',
    description: 'Unverifiable company offering ₹40,000/month for data entry.',
    time: '18 minutes ago',
    riskLevel: 'SUSPICIOUS' as const,
  },
  {
    id: 'a3',
    title: 'Fake Recruitment Agency',
    description: 'Impersonating a known IT company, requesting document fees.',
    time: '1 hour ago',
    riskLevel: 'HIGH_RISK' as const,
  },
  {
    id: 'a4',
    title: 'Legitimate Offer Confirmed',
    description: 'MNC job post — company verified, no red flags detected.',
    time: '3 hours ago',
    riskLevel: 'SAFE' as const,
  },
];
