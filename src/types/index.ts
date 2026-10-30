export type RiskLevel = 'SAFE' | 'SUSPICIOUS' | 'HIGH_RISK';

export type ScamStage =
  | 'initial_attraction'
  | 'trust_building'
  | 'small_task_payment'
  | 'prepaid_task_escalation'
  | 'deposit_demand'
  | 'withdrawal_blockage';

export interface ScamWarningSign {
  id: string;
  label: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
}

export interface SuspiciousPhrase {
  phrase: string;
  reason: string;
}

export interface CompanyVerificationResult {
  companyName: string;
  registryStatus: 'found' | 'not_found' | 'unverified';
  domainStatus: 'verified' | 'suspicious' | 'not_checked';
  cin?: string;
  registeredAddress?: string;
  incorporationDate?: string;
  note: string;
}

export interface ScanResult {
  id: string;
  timestamp: number;
  inputType: 'job_post' | 'chat' | 'offer_letter';
  riskLevel: RiskLevel;
  riskScore: number;
  warningSignsDetected: ScamWarningSign[];
  suspiciousPhrases: SuspiciousPhrase[];
  currentStage: ScamStage;
  companyVerification: CompanyVerificationResult | null;
  summary: string;
  isDemo: boolean;
}

export interface DashboardStats {
  totalScans: number;
  scamAlerts: number;
  safeOffers: number;
  suspiciousReviewed: number;
}

export interface WeeklyDataPoint {
  day: string;
  scams: number;
  safe: number;
  suspicious: number;
}

export interface ScamPattern {
  id: string;
  title: string;
  emoji: string;
  description: string;
  warningSigns: string[];
  typicalStage: ScamStage;
  safetyAdvice: string;
}

export interface ReportFormData {
  scamType: string;
  companyName: string;
  platform: string;
  description: string;
  evidenceFiles: File[];
}

export type DashboardSection =
  | 'overview'
  | 'analyze'
  | 'intelligence'
  | 'verify'
  | 'safety'
  | 'report'
  | 'dna'
  | 'links'
  | 'evidence'
  | 'radar'
  | 'coach';

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

// NEW: Scam DNA
export interface BehavioralSignal {
  id: string;
  label: string;
  description: string;
  weight: number;
  category: 'urgency' | 'authority' | 'isolation' | 'financial' | 'trust';
}

export interface DnaAnalysisResult {
  behavioralScore: number;
  riskLevel: RiskLevel;
  manipulationTactics: BehavioralSignal[];
  primaryTactic: string;
  vulnerabilityWarning: string;
  recommendation: string;
}

// NEW: Link Inspector
export interface LinkInspectionResult {
  url: string;
  isSuspicious: boolean;
  riskLevel: RiskLevel;
  findings: string[];
  domainAge: string;
  redirectCount: number;
  recommendation: string;
}

// NEW: Evidence Locker
export interface EvidenceFile {
  id: string;
  originalName: string;
  size: number;
  mimetype: string;
  uploadedAt: number;
  notes?: string;
}

// NEW: Scam Radar
export interface RadarReport {
  id: string;
  scamType: string;
  platform: string;
  location: string;
  description: string;
  timestamp: number;
  upvotes: number;
}

// NEW: CoachMessage
export interface CoachMessage {
  role: 'user' | 'coach';
  text: string;
  timestamp: number;
}

// NEW: CoachResponse
export interface CoachResponse {
  reply: string;
  relatedTopics: string[];
  urgency: 'low' | 'medium' | 'high';
}
