# Implementation Plan — ScamShield AI Feature Extension

<!-- VERIFICATION RESULTS (updated by implementation agent)
Backend tsc --noEmit: EXIT 0 (0 errors)
Frontend vite build: EXIT 0 (success, 2648 modules transformed)
Date: Implementation complete
-->

> **Golden rule**: APPEND-ONLY. Never delete, rename, or overwrite any existing line.
> Every step leaves the project in a buildable, runnable state.

---

## Pre-flight Notes (from reading actual files)

| Topic | Finding |
|---|---|
| Backend entry | `backend/src/index.ts` — CORS currently allows only `GET POST OPTIONS`. The new evidence DELETE route needs `DELETE` added. |
| Backend `isDemo` | `ScanResult.isDemo` is typed as `true` (literal) in `backend/src/types/index.ts` but as `boolean` in the frontend `src/types/index.ts`. Do **not** change either — they already differ and existing code compiles fine. |
| Frontend `api/client.ts` | Sets `'Content-Type': 'application/json'` on every request. The evidence FormData upload must bypass this by calling `fetch()` directly (not through `api.post`) so the browser can set the multipart boundary itself. |
| multer types | `Express.Multer.File` is the correct type exposed via `@types/multer`. Import it as `import { type File as MulterFile } from 'express'; declare module 'express' { ... }` — actually the cleanest approach is just to reference the globally augmented `Express.Multer.File` type after `@types/multer` is installed; no manual augmentation needed. |
| Dashboard switch | `renderSection()` currently has no `default` case and returns `undefined` for unknown sections. Adding new cases is safe — TypeScript exhaustiveness won't break because `DashboardSection` is a union (not an enum). |
| Sidebar `DashboardSection` import | Sidebar imports `DashboardSection` from `../../types`. Extending the union there automatically widens the sidebar prop type — no separate sidebar type file needed. |
| lucide-react icons | `Activity`, `Link2`, `FolderLock`, `Radio`, `Bot` — all available in lucide-react. Confirm none collide with existing imports in Sidebar (existing imports: `ShieldCheck LayoutDashboard Search Brain Building2 Flag Phone X MessageCircle HelpCircle Calculator BookOpen`). No collisions. |
| Backend `ts-node-dev` script | `npm run dev` in backend uses `ts-node-dev`. New route files are picked up automatically — no config change needed. |
| Vite proxy | Already proxies `/api` → `http://localhost:3001`. New routes under `/api/dna`, `/api/links`, `/api/evidence`, `/api/radar`, `/api/coach` work automatically. |

---

## Step 1 — Extend `backend/src/types/index.ts` with 7 new interfaces

**What**: Append 7 new interfaces at the very end of the file. Touch zero existing lines.

**Interfaces to append**:

```ts
// ── NEW: Scam DNA ──────────────────────────────────────────────────────────────
export interface BehavioralSignal {
  tactic: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
  keywords: string[];
}

export interface DnaAnalysisResult {
  behavioralScore: number;           // 0-100
  riskLevel: RiskLevel;              // reuse existing RiskLevel union
  manipulationTactics: BehavioralSignal[];
  primaryTactic: string;
  vulnerabilityWarning: string;
  recommendation: string;
}

// ── NEW: Smart Link Inspector ──────────────────────────────────────────────────
export interface LinkFinding {
  check: string;
  detail: string;
  severity: 'high' | 'medium' | 'low';
}

export interface LinkInspectionResult {
  url: string;
  riskLevel: RiskLevel;
  findings: LinkFinding[];
  findingCount: number;
  summary: string;
}

// ── NEW: Evidence Locker ───────────────────────────────────────────────────────
export interface EvidenceFile {
  id: string;
  originalName: string;
  mimeType: string;
  size: number;              // bytes
  uploadedAt: number;        // Date.now()
  description: string;
  storedBuffer: Buffer;      // kept in memory; never serialised to client
}

// ── NEW: Scam Radar ────────────────────────────────────────────────────────────
export interface RadarReport {
  id: string;
  title: string;
  description: string;
  location: string;
  scamType: string;
  platform: string;
  upvotes: number;
  timestamp: number;
}

// ── NEW: AI Safety Coach ───────────────────────────────────────────────────────
export interface CoachMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface CoachResponse {
  answer: string;
  urgency: 'high' | 'normal';
  relatedTopics: string[];
  emergencyAction?: string;   // set when urgency=high
}
```

**Files**: `backend/src/types/index.ts`

**Gotcha**: `EvidenceFile.storedBuffer` is `Buffer` — this is fine in Node/Express but must be stripped before sending to the client (the evidence route serialises only the metadata fields, not `storedBuffer`).

**Verify**: `cd backend && npx tsc --noEmit` — no TypeScript errors.

---

## Step 2 — Install `multer` in the backend

**What**: Run `npm install multer @types/multer` inside `backend/`. This adds runtime and type support for multipart file uploads. No existing dependency is affected.

**Files**: `backend/package.json` and `backend/package-lock.json` (auto-updated by npm)

**Command**:
```
cd c:\Users\bhoom\Desktop\ScamShield-AI\backend && "C:\Program Files\nodejs\npm.cmd" install multer @types/multer
```

**Verify**: `cat backend/package.json` shows `"multer"` under `dependencies`; `cd backend && npx tsc --noEmit` still passes.

---

## Step 3 — Create `backend/src/services/dnaService.ts`

**What**: Implement `analyzeBehavior(text: string): DnaAnalysisResult`. Use keyword matching against 5 tactic categories. Score is accumulated (each matched tactic adds weight) then capped at 100. Derive `riskLevel` using the same thresholds as `analyzeService` (≥60 → HIGH_RISK, ≥30 → SUSPICIOUS, else SAFE).

**Full logic**:

```ts
import type { BehavioralSignal, DnaAnalysisResult, RiskLevel } from '../types';

const TACTIC_DEFINITIONS: BehavioralSignal[] = [
  {
    tactic: 'Urgency & Pressure',
    description: 'Creating artificial time pressure to prevent rational decision-making.',
    severity: 'high',
    keywords: ['urgent', 'immediately', 'limited time', 'act now', 'today only', 'last chance', 'hurry', 'expire', 'deadline'],
  },
  {
    tactic: 'False Authority',
    description: 'Impersonating officials, government bodies, or well-known companies.',
    severity: 'high',
    keywords: ['rbi', 'sebi', 'government', 'police', 'cbi', 'income tax', 'official notice', 'legal action', 'court order'],
  },
  {
    tactic: 'Isolation Tactic',
    description: 'Discouraging the victim from seeking outside verification.',
    severity: 'medium',
    keywords: ['do not tell', "don't share", 'keep secret', 'confidential offer', 'private channel', 'only you'],
  },
  {
    tactic: 'Financial Lure',
    description: 'Promising unrealistic financial gains to lower the victim\'s guard.',
    severity: 'medium',
    keywords: ['earn ₹', 'guaranteed income', 'passive income', '₹5000 daily', '₹10000', 'high returns', 'double your money'],
  },
  {
    tactic: 'Trust Manipulation',
    description: 'Building false rapport before making fraudulent requests.',
    severity: 'low',
    keywords: ['we trust you', 'selected you', 'special offer', 'exclusive member', 'you qualify', 'congratulations'],
  },
];

const SCORE_WEIGHTS: Record<BehavioralSignal['severity'], number> = {
  high: 30,
  medium: 20,
  low: 10,
};

export function analyzeBehavior(text: string): DnaAnalysisResult {
  const lower = text.toLowerCase();
  const matched: BehavioralSignal[] = [];

  for (const tactic of TACTIC_DEFINITIONS) {
    if (tactic.keywords.some((kw) => lower.includes(kw))) {
      matched.push(tactic);
    }
  }

  const rawScore = matched.reduce((sum, t) => sum + SCORE_WEIGHTS[t.severity], 0);
  const behavioralScore = Math.min(100, rawScore);

  const riskLevel: RiskLevel =
    behavioralScore >= 60 ? 'HIGH_RISK' : behavioralScore >= 30 ? 'SUSPICIOUS' : 'SAFE';

  const primaryTactic = matched.length > 0 ? matched[0].tactic : 'None detected';

  const vulnerabilityWarning =
    matched.length === 0
      ? 'No manipulation tactics detected.'
      : `This content uses ${matched.length} psychological manipulation tactic${matched.length > 1 ? 's' : ''}. The primary tactic is "${primaryTactic}".`;

  const recommendation =
    riskLevel === 'HIGH_RISK'
      ? 'Multiple manipulation tactics detected. Do not engage further — report to cybercrime.gov.in or call 1930.'
      : riskLevel === 'SUSPICIOUS'
        ? 'Suspicious behavioral patterns present. Verify independently before taking any action or sharing personal details.'
        : 'Behavioral profile appears low risk. Continue to exercise caution with any financial transaction.';

  return {
    behavioralScore,
    riskLevel,
    manipulationTactics: matched,
    primaryTactic,
    vulnerabilityWarning,
    recommendation,
  };
}
```

**Files**: `backend/src/services/dnaService.ts` (new file)

**Verify**: `cd backend && npx tsc --noEmit` — no errors.

---

## Step 4 — Create `backend/src/services/linkService.ts`

**What**: Implement `inspectLink(url: string): LinkInspectionResult`. Run 7 independent checks, collect `LinkFinding[]`, then derive `riskLevel` by finding count: 0 = SAFE, 1-2 = SUSPICIOUS, 3+ = HIGH_RISK.

**Full logic**:

```ts
import type { LinkFinding, LinkInspectionResult, RiskLevel } from '../types';

const SUSPICIOUS_TLDS = ['.tk', '.xyz', '.ru', '.ml', '.ga', '.cf', '.click', '.download'];
const SUSPICIOUS_KEYWORDS = ['login', 'verify', 'secure', 'bank', 'payment', 'account', 'update', 'confirm'];
const KNOWN_BRAND_PATTERNS: Array<[RegExp, string]> = [
  [/paypp?al/i,  'PayPal'],
  [/amaz[o0]n/i, 'Amazon'],
  [/g[o0]{2}gle/i, 'Google'],
  [/micros[o0]ft/i, 'Microsoft'],
  [/facebo[o0]k/i, 'Facebook'],
  [/netfl[i1]x/i, 'Netflix'],
  [/app[l1]e/i, 'Apple'],
];

function countSubdomains(hostname: string): number {
  // e.g. a.b.c.com → 4 parts = 2 subdomains
  return hostname.split('.').length - 2;
}

export function inspectLink(rawUrl: string): LinkInspectionResult {
  const findings: LinkFinding[] = [];

  // Normalise — prepend https:// if protocol missing for URL parsing
  let normalised = rawUrl.trim();
  const hasProtocol = /^https?:\/\//i.test(normalised);
  if (!hasProtocol) normalised = 'https://' + normalised;

  let parsed: URL | null = null;
  try {
    parsed = new URL(normalised);
  } catch {
    findings.push({
      check: 'Invalid URL',
      detail: 'The URL could not be parsed — it may be malformed.',
      severity: 'high',
    });
    return buildResult(rawUrl, findings);
  }

  const hostname = parsed.hostname.toLowerCase();
  const fullUrl = parsed.toString();

  // Check 1: URL length
  if (fullUrl.length > 100) {
    findings.push({
      check: 'Excessively Long URL',
      detail: `URL is ${fullUrl.length} characters. Long URLs often disguise malicious destinations.`,
      severity: 'medium',
    });
  }

  // Check 2: IP address
  if (/^(\d{1,3}\.){3}\d{1,3}$/.test(hostname)) {
    findings.push({
      check: 'IP Address Instead of Domain',
      detail: 'Legitimate websites use domain names, not raw IP addresses.',
      severity: 'high',
    });
  }

  // Check 3: Too many subdomains
  if (countSubdomains(hostname) > 3) {
    findings.push({
      check: 'Excessive Subdomains',
      detail: `Hostname has ${countSubdomains(hostname)} subdomains. Scammers use deep nesting to hide real domain.`,
      severity: 'medium',
    });
  }

  // Check 4: Suspicious TLD
  const matchedTld = SUSPICIOUS_TLDS.find((tld) => hostname.endsWith(tld));
  if (matchedTld) {
    findings.push({
      check: 'Suspicious Top-Level Domain',
      detail: `Domain uses ${matchedTld} — a TLD commonly associated with free/disposable scam domains.`,
      severity: 'high',
    });
  }

  // Check 5: Suspicious keywords in path/query
  const pathAndQuery = (parsed.pathname + parsed.search).toLowerCase();
  const matchedKw = SUSPICIOUS_KEYWORDS.find((kw) => pathAndQuery.includes(kw));
  if (matchedKw) {
    findings.push({
      check: 'Suspicious Keyword in URL',
      detail: `URL contains "${matchedKw}" — a keyword frequently used in phishing URLs.`,
      severity: 'medium',
    });
  }

  // Check 6: HTTP (not HTTPS)
  if (parsed.protocol === 'http:' && hasProtocol) {
    findings.push({
      check: 'No HTTPS Encryption',
      detail: 'The URL uses plain HTTP. Legitimate sites use HTTPS for user security.',
      severity: 'medium',
    });
  }

  // Check 7: Known brand misspelling
  for (const [pattern, brand] of KNOWN_BRAND_PATTERNS) {
    if (pattern.test(hostname)) {
      const isActualBrand = hostname === brand.toLowerCase() + '.com' ||
        hostname.endsWith('.' + brand.toLowerCase() + '.com');
      if (!isActualBrand) {
        findings.push({
          check: 'Brand Name Impersonation',
          detail: `Hostname appears to impersonate ${brand} — verify the exact domain spelling.`,
          severity: 'high',
        });
        break;
      }
    }
  }

  return buildResult(rawUrl, findings);
}

function buildResult(url: string, findings: LinkFinding[]): LinkInspectionResult {
  const count = findings.length;
  const riskLevel: RiskLevel =
    count === 0 ? 'SAFE' : count <= 2 ? 'SUSPICIOUS' : 'HIGH_RISK';

  const summary =
    count === 0
      ? 'No suspicious indicators found. The URL appears safe, but always verify the source.'
      : count <= 2
        ? `${count} potential issue${count > 1 ? 's' : ''} found. Exercise caution before clicking.`
        : `${count} red flags detected. This URL is likely malicious — do not proceed.`;

  return { url, riskLevel, findings, findingCount: count, summary };
}
```

**Files**: `backend/src/services/linkService.ts` (new file)

**Gotcha**: The brand misspelling check is intentionally conservative — it only fires when the hostname *contains* the brand pattern but does NOT exactly match `brand.com` or `*.brand.com`. This prevents false positives on legitimate subdomains.

**Verify**: `cd backend && npx tsc --noEmit` — no errors.

---

## Step 5 — Create `backend/src/services/evidenceService.ts`

**What**: In-memory store (array of `EvidenceFile`). Provides `storeEvidence`, `getAllEvidence`, `deleteEvidence`. Uses `Express.Multer.File` from `@types/multer` (installed in step 2). The `storedBuffer` field holds `file.buffer` from multer's memory storage.

**Full implementation**:

```ts
import type { EvidenceFile } from '../types';

const evidenceStore: EvidenceFile[] = [];

export function storeEvidence(
  file: Express.Multer.File,
  description: string
): Omit<EvidenceFile, 'storedBuffer'> {
  const entry: EvidenceFile = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    originalName: file.originalname,
    mimeType: file.mimetype,
    size: file.size,
    uploadedAt: Date.now(),
    description,
    storedBuffer: file.buffer,
  };
  evidenceStore.push(entry);
  // Return without buffer — never send binary to client
  const { storedBuffer: _, ...meta } = entry;
  return meta;
}

export function getAllEvidence(): Omit<EvidenceFile, 'storedBuffer'>[] {
  return evidenceStore.map(({ storedBuffer: _, ...meta }) => meta);
}

export function deleteEvidence(id: string): boolean {
  const idx = evidenceStore.findIndex((e) => e.id === id);
  if (idx === -1) return false;
  evidenceStore.splice(idx, 1);
  return true;
}
```

**Files**: `backend/src/services/evidenceService.ts` (new file)

**Gotcha**: `Express.Multer.File` is globally available after `@types/multer` install — no import needed. The destructuring `{ storedBuffer: _, ...meta }` pattern strips the buffer before returning metadata. TypeScript may warn about the unused `_` variable; prefix it with underscore to silence strict mode: `storedBuffer: _stripped`.

**Verify**: `cd backend && npx tsc --noEmit` — no errors.

---

## Step 6 — Create `backend/src/services/radarService.ts`

**What**: In-memory store pre-seeded with 5 realistic `RadarReport` entries. Provides `submitRadarReport`, `getRadarReports`, `upvoteReport`.

**Full implementation**:

```ts
import type { RadarReport } from '../types';

let nextId = 6;

const radarStore: RadarReport[] = [
  {
    id: '1',
    title: 'Fake Amazon Work-From-Home Job',
    description: 'Recruiter on Telegram asked for ₹2000 registration fee for "Amazon packer" role. Disappeared after payment.',
    location: 'Mumbai, Maharashtra',
    scamType: 'Job Scam',
    platform: 'Telegram',
    upvotes: 47,
    timestamp: Date.now() - 1000 * 60 * 60 * 24 * 2,
  },
  {
    id: '2',
    title: 'WhatsApp Investment Scam (Crypto)',
    description: 'Unknown number promised 30% monthly returns on crypto investment. Blocked after receiving ₹50,000.',
    location: 'Bengaluru, Karnataka',
    scamType: 'Investment Fraud',
    platform: 'WhatsApp',
    upvotes: 82,
    timestamp: Date.now() - 1000 * 60 * 60 * 24 * 5,
  },
  {
    id: '3',
    title: 'Fake SEBI OTP Verification Call',
    description: 'Caller claimed to be from SEBI, asked for Aadhaar OTP to "verify KYC". Bank account drained immediately.',
    location: 'Delhi NCR',
    scamType: 'Phishing / Vishing',
    platform: 'Phone Call',
    upvotes: 134,
    timestamp: Date.now() - 1000 * 60 * 60 * 24 * 1,
  },
  {
    id: '4',
    title: 'Like-and-Earn Task Scam',
    description: 'Job offered ₹500 per YouTube like. First few tasks paid out, then demanded ₹5000 to "unlock premium tasks".',
    location: 'Hyderabad, Telangana',
    scamType: 'Task Scam',
    platform: 'Telegram',
    upvotes: 96,
    timestamp: Date.now() - 1000 * 60 * 60 * 24 * 3,
  },
  {
    id: '5',
    title: 'Fake Offer Letter from "TCS"',
    description: 'Received a convincing offer letter from "TCS HR" Gmail account. Asked for ₹3500 joining kit fee.',
    location: 'Pune, Maharashtra',
    scamType: 'Job Scam',
    platform: 'Email',
    upvotes: 61,
    timestamp: Date.now() - 1000 * 60 * 60 * 24 * 7,
  },
];

export function getRadarReports(): RadarReport[] {
  return [...radarStore].sort((a, b) => b.timestamp - a.timestamp);
}

export function submitRadarReport(
  data: Omit<RadarReport, 'id' | 'upvotes' | 'timestamp'>
): RadarReport {
  const report: RadarReport = {
    ...data,
    id: String(nextId++),
    upvotes: 0,
    timestamp: Date.now(),
  };
  radarStore.push(report);
  return report;
}

export function upvoteReport(id: string): RadarReport | null {
  const report = radarStore.find((r) => r.id === id);
  if (!report) return null;
  report.upvotes += 1;
  return { ...report };
}
```

**Files**: `backend/src/services/radarService.ts` (new file)

**Verify**: `cd backend && npx tsc --noEmit` — no errors.

---

## Step 7 — Create `backend/src/services/coachService.ts`

**What**: Rule-based `askCoach(question: string): CoachResponse`. Matches question against topic keywords, returns canned response. Sets `urgency = 'high'` and `emergencyAction` if question mentions `'already paid'`, `'sent money'`, or `'transferred'`.

**Full implementation**:

```ts
import type { CoachResponse } from '../types';

interface TopicRule {
  keywords: string[];
  answer: string;
  relatedTopics: string[];
}

const TOPIC_RULES: TopicRule[] = [
  {
    keywords: ['telegram', 'telegram job', 'telegram scam'],
    answer:
      'Telegram is the most common platform for job scams in India. Legitimate recruiters never move interviews or job offers to Telegram. If a recruiter asks you to join a Telegram group and pay any fee, it is almost certainly a scam. Block and report the contact immediately.',
    relatedTopics: [
      'What should I do if I already sent money?',
      'How can I verify if a company is real?',
      'What is a registration fee scam?',
    ],
  },
  {
    keywords: ['verify company', 'check company', 'company real', 'legitimate company', 'company genuine'],
    answer:
      'To verify a company: (1) Search the company name on the Ministry of Corporate Affairs portal at mca.gov.in. (2) Check if the recruiter email ends with the official company domain (not Gmail/Yahoo). (3) Call the company\'s official phone number listed on their website — not the number the recruiter gave you. (4) Search "[Company Name] scam" on Google.',
    relatedTopics: [
      'What is a fake offer letter scam?',
      'How do I check a company on MCA?',
      'Is it safe to share my Aadhaar with an employer?',
    ],
  },
  {
    keywords: ['registration fee', 'joining fee', 'training fee', 'kit fee', 'uniform fee'],
    answer:
      'No legitimate employer ever asks candidates to pay a registration, joining, training, uniform, or kit fee. This is a textbook scam. The moment any recruiter demands payment before you start working, stop all communication and report to cybercrime.gov.in.',
    relatedTopics: [
      'What is a job scam?',
      'How do I report a job scam?',
      'Can I recover my money after being scammed?',
    ],
  },
  {
    keywords: ['real job', 'genuine job', 'is this job real', 'job offer real', 'offer real'],
    answer:
      'Signs of a genuine job offer: official company email domain, detailed job description with proper responsibilities, interview via video call or in person, no upfront fees, salary within industry norms, and offer letter on company letterhead with CIN number. Red flags: jobs on Telegram/WhatsApp, vague task descriptions, guaranteed daily income claims, and any upfront payment demand.',
    relatedTopics: [
      'How do I verify a company?',
      'What is an offer letter scam?',
      'What are common job scam platforms?',
    ],
  },
  {
    keywords: ['already paid', 'sent money', 'transferred money', 'lost money', 'paid fee'],
    answer:
      'Act immediately. Call the National Cybercrime Helpline at 1930 right now — this is a 24/7 line for financial fraud. File a complaint on cybercrime.gov.in. Contact your bank to attempt a transaction reversal — do this within the first few hours. Take screenshots of all conversations and transactions before blocking the scammer.',
    relatedTopics: [
      'How do I file a cybercrime complaint?',
      'Can I get my money back from a scam?',
      'What evidence should I collect?',
    ],
  },
  {
    keywords: ['1930', 'helpline', 'cybercrime helpline', 'report number'],
    answer:
      '1930 is India\'s National Cyber Crime Helpline. Call it if you have been scammed financially or if you suspect fraud. It is available 24/7. You can also file complaints online at cybercrime.gov.in. For physical reports, visit your nearest police station and ask for the Cybercrime Cell.',
    relatedTopics: [
      'What documents do I need to file a complaint?',
      'What happens after I file a cybercrime complaint?',
      'How long does cybercrime investigation take?',
    ],
  },
  {
    keywords: ['cybercrime', 'file complaint', 'report scam', 'where to report', 'complaint'],
    answer:
      'Report cybercrime in India via: (1) Online portal — cybercrime.gov.in (fastest). (2) National helpline — call 1930 (24/7). (3) Offline — visit your local police station\'s Cybercrime Cell with a written complaint, screenshots, and transaction records. Keep all evidence: screenshots of chats, transaction IDs, phone numbers, and email headers.',
    relatedTopics: [
      'What evidence should I keep?',
      'Call 1930 immediately',
      'Can the police recover my money?',
    ],
  },
];

const DEFAULT_RESPONSE: Omit<CoachResponse, 'urgency' | 'emergencyAction'> = {
  answer:
    'I couldn\'t find a specific answer for your question. Common scam safety tips: never pay upfront fees, always verify companies on mca.gov.in, do not share OTPs, and call 1930 if you suspect fraud.',
  relatedTopics: [
    'How do I verify a company?',
    'What should I do if I already sent money?',
    'How do I report a scam?',
  ],
};

const URGENCY_TRIGGERS = ['already paid', 'sent money', 'transferred', 'lost money', 'paid fee', 'scammed me'];

export function askCoach(question: string): CoachResponse {
  const lower = question.toLowerCase();

  const isUrgent = URGENCY_TRIGGERS.some((trigger) => lower.includes(trigger));

  const matchedRule = TOPIC_RULES.find((rule) =>
    rule.keywords.some((kw) => lower.includes(kw))
  );

  const base = matchedRule
    ? { answer: matchedRule.answer, relatedTopics: matchedRule.relatedTopics }
    : DEFAULT_RESPONSE;

  return {
    ...base,
    urgency: isUrgent ? 'high' : 'normal',
    ...(isUrgent
      ? { emergencyAction: 'Call 1930 (Cybercrime Helpline) immediately and file a complaint at cybercrime.gov.in' }
      : {}),
  };
}
```

**Files**: `backend/src/services/coachService.ts` (new file)

**Verify**: `cd backend && npx tsc --noEmit` — no errors.

---

## Step 8 — Create 5 new backend route files

> Follow the exact same Router pattern as `backend/src/routes/analyze.ts` and `backend/src/routes/report.ts`.

### 8a. `backend/src/routes/dna.ts`

```ts
import { Router, Request, Response, NextFunction } from 'express';
import { requireFields } from '../middleware/validate';
import { analyzeBehavior } from '../services/dnaService';

const router = Router();

router.post(
  '/',
  requireFields(['text']),
  (req: Request, res: Response, next: NextFunction): void => {
    try {
      const { text } = req.body as { text: string };
      res.json(analyzeBehavior(text));
    } catch (err) {
      next(err);
    }
  }
);

export default router;
```

### 8b. `backend/src/routes/links.ts`

```ts
import { Router, Request, Response, NextFunction } from 'express';
import { requireFields } from '../middleware/validate';
import { inspectLink } from '../services/linkService';

const router = Router();

router.post(
  '/',
  requireFields(['url']),
  (req: Request, res: Response, next: NextFunction): void => {
    try {
      const { url } = req.body as { url: string };
      res.json(inspectLink(url));
    } catch (err) {
      next(err);
    }
  }
);

export default router;
```

### 8c. `backend/src/routes/evidence.ts`

```ts
import { Router, Request, Response, NextFunction } from 'express';
import multer from 'multer';
import { storeEvidence, getAllEvidence, deleteEvidence } from '../services/evidenceService';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter: (_req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'video/mp4'];
    cb(null, allowed.includes(file.mimetype));
  },
});

const router = Router();

// GET /api/evidence
router.get('/', (_req: Request, res: Response, next: NextFunction): void => {
  try {
    res.json(getAllEvidence());
  } catch (err) {
    next(err);
  }
});

// POST /api/evidence  — multipart/form-data; field name: 'file'
router.post(
  '/',
  upload.single('file'),
  (req: Request, res: Response, next: NextFunction): void => {
    try {
      if (!req.file) {
        const err = Object.assign(new Error('No file uploaded'), { status: 400 });
        next(err);
        return;
      }
      const description = (req.body as { description?: string }).description ?? '';
      const meta = storeEvidence(req.file, description);
      res.status(201).json({ success: true, evidence: meta });
    } catch (err) {
      next(err);
    }
  }
);

// DELETE /api/evidence/:id
router.delete('/:id', (req: Request, res: Response, next: NextFunction): void => {
  try {
    const deleted = deleteEvidence(req.params.id);
    if (!deleted) {
      const err = Object.assign(new Error('Evidence not found'), { status: 404 });
      next(err);
      return;
    }
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

export default router;
```

**Gotcha**: The `fileFilter` callback signature is `(_req, file, cb)`. TypeScript strict mode requires the return type to be `void` — the `cb(null, boolean)` pattern from multer's types is correct here.

### 8d. `backend/src/routes/radar.ts`

```ts
import { Router, Request, Response, NextFunction } from 'express';
import { requireFields } from '../middleware/validate';
import { getRadarReports, submitRadarReport, upvoteReport } from '../services/radarService';

const router = Router();

router.get('/', (_req: Request, res: Response, next: NextFunction): void => {
  try {
    res.json(getRadarReports());
  } catch (err) {
    next(err);
  }
});

router.post(
  '/',
  requireFields(['title', 'description', 'location', 'scamType', 'platform']),
  (req: Request, res: Response, next: NextFunction): void => {
    try {
      const data = req.body as {
        title: string;
        description: string;
        location: string;
        scamType: string;
        platform: string;
      };
      res.status(201).json(submitRadarReport(data));
    } catch (err) {
      next(err);
    }
  }
);

router.post('/:id/upvote', (req: Request, res: Response, next: NextFunction): void => {
  try {
    const report = upvoteReport(req.params.id);
    if (!report) {
      const err = Object.assign(new Error('Report not found'), { status: 404 });
      next(err);
      return;
    }
    res.json(report);
  } catch (err) {
    next(err);
  }
});

export default router;
```

### 8e. `backend/src/routes/coach.ts`

```ts
import { Router, Request, Response, NextFunction } from 'express';
import { requireFields } from '../middleware/validate';
import { askCoach } from '../services/coachService';

const router = Router();

router.post(
  '/',
  requireFields(['question']),
  (req: Request, res: Response, next: NextFunction): void => {
    try {
      const { question } = req.body as { question: string };
      res.json(askCoach(question));
    } catch (err) {
      next(err);
    }
  }
);

export default router;
```

**Files**: 
- `backend/src/routes/dna.ts`
- `backend/src/routes/links.ts`
- `backend/src/routes/evidence.ts`
- `backend/src/routes/radar.ts`
- `backend/src/routes/coach.ts`

**Verify**: `cd backend && npx tsc --noEmit` — no errors.

---

## Step 9 — Modify `backend/src/index.ts` — append new imports and mounts

**What**: Add 5 import lines and 5 `app.use()` lines, and extend the existing CORS `methods` array to include `'DELETE'`. This is the **only line change** in the existing code — the `methods` array modification.

**Find the existing CORS block**:
```ts
  cors({
    origin: FRONTEND_URL,
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type'],
  })
```

**Change only `methods`** to:
```ts
    methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
```

**Then append** (after `intelligenceRouter` import, before `dotenv.config()`):
```ts
import dnaRouter from './routes/dna';
import linksRouter from './routes/links';
import evidenceRouter from './routes/evidence';
import radarRouter from './routes/radar';
import coachRouter from './routes/coach';
```

**And append** (after `app.use('/api/intelligence', intelligenceRouter);`):
```ts
app.use('/api/dna', dnaRouter);
app.use('/api/links', linksRouter);
app.use('/api/evidence', evidenceRouter);
app.use('/api/radar', radarRouter);
app.use('/api/coach', coachRouter);
```

**Files**: `backend/src/index.ts`

**Gotcha**: The `allowedHeaders` in CORS currently only lists `'Content-Type'`. Multer multipart requests don't add extra headers beyond Content-Type, so no additional CORS header changes are needed. However the evidence POST sends multipart — the browser will set `Content-Type: multipart/form-data; boundary=...` automatically. This is covered by the existing `'Content-Type'` allowedHeader.

**Verify**: 
1. `cd backend && npx tsc --noEmit` — no errors.
2. `cd backend && npm run dev` — server starts without errors, logs `ScamShield API running on http://localhost:3001`.

---

## Step 10 — Modify `src/types/index.ts` — extend `DashboardSection` union + append frontend interfaces

**What**: 
1. Replace the existing `DashboardSection` type line to add 5 new values. The existing 6 values must be preserved unchanged.
2. Append frontend interfaces for the 5 new features at the bottom.

**Change `DashboardSection`** from:
```ts
export type DashboardSection =
  | 'overview'
  | 'analyze'
  | 'intelligence'
  | 'verify'
  | 'safety'
  | 'report';
```

**To**:
```ts
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
```

**Then append at the bottom of the file** (after existing `Toast` interface):
```ts
// ── NEW: Scam DNA ──────────────────────────────────────────────────────────────
export interface BehavioralSignal {
  tactic: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
  keywords: string[];
}

export interface DnaAnalysisResult {
  behavioralScore: number;
  riskLevel: RiskLevel;
  manipulationTactics: BehavioralSignal[];
  primaryTactic: string;
  vulnerabilityWarning: string;
  recommendation: string;
}

// ── NEW: Smart Link Inspector ──────────────────────────────────────────────────
export interface LinkFinding {
  check: string;
  detail: string;
  severity: 'high' | 'medium' | 'low';
}

export interface LinkInspectionResult {
  url: string;
  riskLevel: RiskLevel;
  findings: LinkFinding[];
  findingCount: number;
  summary: string;
}

// ── NEW: Evidence Locker ───────────────────────────────────────────────────────
export interface EvidenceMeta {
  id: string;
  originalName: string;
  mimeType: string;
  size: number;
  uploadedAt: number;
  description: string;
}

// ── NEW: Scam Radar ────────────────────────────────────────────────────────────
export interface RadarReport {
  id: string;
  title: string;
  description: string;
  location: string;
  scamType: string;
  platform: string;
  upvotes: number;
  timestamp: number;
}

// ── NEW: AI Safety Coach ───────────────────────────────────────────────────────
export interface CoachResponse {
  answer: string;
  urgency: 'high' | 'normal';
  relatedTopics: string[];
  emergencyAction?: string;
}
```

**Note**: Frontend `EvidenceMeta` omits `storedBuffer` (that field lives only in the backend `EvidenceFile` type). The frontend receives only metadata.

**Files**: `src/types/index.ts`

**Verify**: `npm run build` (frontend root) — `tsc --noEmit` passes, no type errors.

---

## Step 11 — Create 5 new frontend API files

> Pattern to follow: `src/api/analyze.ts` — import `api` from `./client`, define request/response types inline if not already in `src/types`, export a named function.

### 11a. `src/api/dna.ts`
```ts
import { api } from './client';
import type { DnaAnalysisResult } from '../types';

export function analyzeDna(text: string): Promise<DnaAnalysisResult> {
  return api.post<DnaAnalysisResult>('/dna', { text });
}
```

### 11b. `src/api/links.ts`
```ts
import { api } from './client';
import type { LinkInspectionResult } from '../types';

export function inspectLink(url: string): Promise<LinkInspectionResult> {
  return api.post<LinkInspectionResult>('/links', { url });
}
```

### 11c. `src/api/evidence.ts`

**Gotcha**: `api.post` in `client.ts` hardcodes `'Content-Type': 'application/json'`. Multer multipart requires the browser to set Content-Type with the boundary. The `uploadEvidence` function must call `fetch()` directly **without** the Content-Type header.

```ts
import { api } from './client';
import type { EvidenceMeta } from '../types';

export function getEvidence(): Promise<EvidenceMeta[]> {
  return api.get<EvidenceMeta[]>('/evidence');
}

export async function uploadEvidence(
  file: File,
  description: string
): Promise<{ success: boolean; evidence: EvidenceMeta }> {
  const form = new FormData();
  form.append('file', file);
  form.append('description', description);

  // Do NOT use api.post here — it sets Content-Type: application/json
  // which breaks multipart form boundary detection
  const res = await fetch('/api/evidence', { method: 'POST', body: form });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error((body as { error?: string }).error ?? `Upload failed ${res.status}`);
  }
  return res.json();
}

export async function deleteEvidence(id: string): Promise<{ success: boolean }> {
  const res = await fetch(`/api/evidence/${id}`, { method: 'DELETE' });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error((body as { error?: string }).error ?? `Delete failed ${res.status}`);
  }
  return res.json();
}
```

### 11d. `src/api/radar.ts`
```ts
import { api } from './client';
import type { RadarReport } from '../types';

export interface RadarSubmission {
  title: string;
  description: string;
  location: string;
  scamType: string;
  platform: string;
}

export function getRadarReports(): Promise<RadarReport[]> {
  return api.get<RadarReport[]>('/radar');
}

export function submitRadarReport(data: RadarSubmission): Promise<RadarReport> {
  return api.post<RadarReport>('/radar', data);
}

export function upvoteRadarReport(id: string): Promise<RadarReport> {
  return api.post<RadarReport>(`/radar/${id}/upvote`, {});
}
```

### 11e. `src/api/coach.ts`
```ts
import { api } from './client';
import type { CoachResponse } from '../types';

export function askCoach(question: string): Promise<CoachResponse> {
  return api.post<CoachResponse>('/coach', { question });
}
```

**Files**: 
- `src/api/dna.ts`
- `src/api/links.ts`
- `src/api/evidence.ts`
- `src/api/radar.ts`
- `src/api/coach.ts`

**Verify**: `npm run build` — TypeScript no errors in api layer.

---

## Step 12 — Create 5 new frontend page files

> Design rules (from reading existing pages):
> - Background: `bg-[#111318]` on standalone, `bg-[#20232B]` on Card
> - Headings: `text-[#F8FAFC]` with `font-extrabold`
> - Muted text: `text-[#9CA3AF]`
> - Accent: `text-amber-400`, `border-amber-500/30`, `bg-amber-500/10`
> - Use `Card`, `Button`, `Badge`, `Spinner` from `../components/ui/`
> - Use `Navbar` and `Footer` from `../components/layout/` (standalone page wrapper only)
> - Each file exports **two** things: a named `Section` component (used by DashboardPage) and a `default` page component (used by router)
> - The standalone page wraps the section in `<div className="min-h-screen flex flex-col bg-[#111318]"><Navbar /><main ...>{section}</main><Footer /></div>`

### 12a. `src/pages/ScamDnaPage.tsx`

Sections: Text input textarea + "Analyze Behavior" button → calls `analyzeDna()` → shows behavioral score as `ProgressBar`, lists manipulation tactics as cards with severity badges, shows recommendation.

Key UI elements:
- `ProgressBar` colored red if score≥60, amber if ≥30, green if <30
- Each `BehavioralSignal` card shows tactic name, description, severity badge
- `vulnerabilityWarning` and `recommendation` in a highlighted Card at bottom

### 12b. `src/pages/LinkInspectorPage.tsx`

Sections: URL text input + "Inspect Link" button → calls `inspectLink()` → shows overall risk badge, list of `LinkFinding[]` each with check name + detail + severity badge, summary text.

Key UI elements:
- Risk level shown as large colored badge (green/amber/red)
- Each finding in a row with severity icon prefix
- Empty findings state shows a green shield "This URL appears safe"

### 12c. `src/pages/EvidenceLockerPage.tsx`

Sections: Upload zone (file input) + description textarea + "Upload Evidence" button → calls `uploadEvidence()` → refreshes list. List shows `EvidenceMeta[]` cards with filename, size, date, description, and a red "Delete" button per item.

Key UI elements:
- Upload zone matches existing `AnalyzePage` offer_letter upload zone style (dashed border, Upload icon)
- File size formatted as `(size / 1024).toFixed(1) + ' KB'`
- Date formatted as `new Date(uploadedAt).toLocaleDateString('en-IN')`
- Accepted: image/jpeg, image/png, image/gif, application/pdf, video/mp4

### 12d. `src/pages/ScamRadarPage.tsx`

Sections: Two tabs — "Browse Reports" and "Submit Report".

Browse tab: Loads `getRadarReports()` on mount, displays `RadarReport[]` as cards with upvote button, scam type badge, platform, location, timestamp.

Submit tab: Form with title / description / location / scamType (select) / platform (select) → calls `submitRadarReport()` → switches to browse tab and refreshes.

Key UI elements:
- Tab bar styled same as `AnalyzePage` tabs (bg-card, amber active state)
- Each report card has upvote button with thumbs-up icon and count
- scamType and platform as `<select>` with existing input class styling

### 12e. `src/pages/AiCoachPage.tsx`

Sections: Chat UI. Input field at bottom + "Ask" button → calls `askCoach()` → appends messages to conversation array. User messages right-aligned, assistant messages left-aligned.

Key UI elements:
- Conversation area scrollable, auto-scrolls to bottom on new message
- If `urgency === 'high'`, show red alert banner with `emergencyAction`
- Related topics shown as clickable chip buttons that pre-fill the input
- Amber bot avatar circle on left of each assistant message

**Files**:
- `src/pages/ScamDnaPage.tsx`
- `src/pages/LinkInspectorPage.tsx`
- `src/pages/EvidenceLockerPage.tsx`
- `src/pages/ScamRadarPage.tsx`
- `src/pages/AiCoachPage.tsx`

**Verify**: `npm run build` — all 5 new pages type-check without errors.

---

## Step 13 — Modify `src/App.tsx` — append 5 imports + 5 Route entries

**What**: Add exactly these lines — nothing else changes.

**Append after existing `StoryPage` import**:
```ts
import ScamDnaPage from './pages/ScamDnaPage';
import LinkInspectorPage from './pages/LinkInspectorPage';
import EvidenceLockerPage from './pages/EvidenceLockerPage';
import ScamRadarPage from './pages/ScamRadarPage';
import AiCoachPage from './pages/AiCoachPage';
```

**Append after existing `<Route path="/story" element={<StoryPage />} />` line and before `<Route path="*" ...>`**:
```tsx
<Route path="/dna" element={<ScamDnaPage />} />
<Route path="/links" element={<LinkInspectorPage />} />
<Route path="/evidence" element={<EvidenceLockerPage />} />
<Route path="/radar" element={<ScamRadarPage />} />
<Route path="/coach" element={<AiCoachPage />} />
```

**Files**: `src/App.tsx`

**Verify**: `npm run build` — no errors; navigate to `/dna` in browser renders the page.

---

## Step 14 — Modify `src/components/layout/Sidebar.tsx` — add New Features section

**What**: Add 5 new nav items below existing items in a new labelled section. Do NOT modify `navItems` array.

**Add import** to the existing `lucide-react` import block:
```ts
import {
  // ... existing imports ...
  Activity,
  Link2,
  FolderLock,
  Radio,
  Bot,
} from 'lucide-react';
```

**Add** a `newFeatureItems` array after the `navItems` array definition:
```ts
const newFeatureItems: {
  section: DashboardSection;
  label: string;
  icon: React.ReactNode;
}[] = [
  { section: 'dna', label: 'Scam DNA', icon: <Activity className="w-4 h-4" /> },
  { section: 'links', label: 'Link Inspector', icon: <Link2 className="w-4 h-4" /> },
  { section: 'evidence', label: 'Evidence Locker', icon: <FolderLock className="w-4 h-4" /> },
  { section: 'radar', label: 'Scam Radar', icon: <Radio className="w-4 h-4" /> },
  { section: 'coach', label: 'AI Safety Coach', icon: <Bot className="w-4 h-4" /> },
];
```

**In `SidebarContent`**, append this block after the closing `</nav>` tag and before the Awareness Tools `<div>`:
```tsx
{/* New Features */}
<div className="px-3 pb-2">
  <p className="text-[10px] text-[#9CA3AF] uppercase tracking-wider px-3 mb-1 font-semibold">
    New Features
  </p>
  {newFeatureItems.map(({ section, label, icon }) => {
    const isActive = activeSection === section;
    return (
      <button
        key={section}
        onClick={() => {
          onSectionChange(section);
          onMobileClose();
        }}
        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 text-left border-l-2 ${
          isActive
            ? 'bg-amber-500/10 text-amber-400 border-amber-500 pl-[10px] shadow-[inset_4px_0_8px_rgba(245,158,11,0.08)]'
            : 'text-[#9CA3AF] hover:text-[#F8FAFC] hover:bg-amber-500/5 border-transparent'
        }`}
        aria-current={isActive ? 'page' : undefined}
      >
        <span className={isActive ? 'text-amber-400' : undefined}>{icon}</span>
        {label}
      </button>
    );
  })}
</div>
```

**Files**: `src/components/layout/Sidebar.tsx`

**Gotcha**: `newFeatureItems` needs `React` in scope for JSX. The file already uses JSX so React is implicitly available via the Vite React plugin — no explicit import needed.

**Verify**: `npm run build` — Sidebar compiles without errors; sidebar renders new section in browser.

---

## Step 15 — Modify `src/pages/DashboardPage.tsx` — import 5 section exports + add 5 switch cases

**What**: Import the named `Section` exports from each new page file, and add 5 new cases to `renderSection()`.

**Append** after existing `import ReportPage from './ReportPage';`:
```ts
import { ScamDnaSection } from './ScamDnaPage';
import { LinkInspectorSection } from './LinkInspectorPage';
import { EvidenceLockerSection } from './EvidenceLockerPage';
import { ScamRadarSection } from './ScamRadarPage';
import { AiCoachSection } from './AiCoachPage';
```

**In `renderSection()` switch**, append after the `case 'report':` block and before the closing brace:
```ts
      case 'dna':
        return (
          <div>
            <h1 className="text-2xl font-extrabold text-[#F8FAFC] mb-6">Scam DNA Analyzer</h1>
            <ScamDnaSection />
          </div>
        );
      case 'links':
        return (
          <div>
            <h1 className="text-2xl font-extrabold text-[#F8FAFC] mb-6">Smart Link Inspector</h1>
            <LinkInspectorSection />
          </div>
        );
      case 'evidence':
        return (
          <div>
            <h1 className="text-2xl font-extrabold text-[#F8FAFC] mb-6">Scam Evidence Locker</h1>
            <EvidenceLockerSection />
          </div>
        );
      case 'radar':
        return (
          <div>
            <h1 className="text-2xl font-extrabold text-[#F8FAFC] mb-6">Scam Radar</h1>
            <ScamRadarSection />
          </div>
        );
      case 'coach':
        return (
          <div>
            <h1 className="text-2xl font-extrabold text-[#F8FAFC] mb-6">AI Safety Coach</h1>
            <AiCoachSection />
          </div>
        );
```

**Files**: `src/pages/DashboardPage.tsx`

**Gotcha**: The existing `renderSection()` switch has no `default` case and TypeScript doesn't complain because it uses a union type. After adding the new union values in step 10, all values are covered by cases — TypeScript is satisfied.

**Verify**: `npm run build` — no errors. Clicking "Scam DNA" in the dashboard sidebar renders `ScamDnaSection`. Clicking "AI Safety Coach" renders `AiCoachSection`. All existing sidebar items still navigate to existing sections.

---

## Final Integration Verification

After all 15 steps are complete:

1. **Backend**: `cd backend && npm run dev` — server starts on port 3001. Test with:
   - `curl -X POST http://localhost:3001/api/dna -H "Content-Type: application/json" -d "{\"text\":\"pay now urgent telegram\"}"` → returns `DnaAnalysisResult`
   - `curl -X POST http://localhost:3001/api/links -H "Content-Type: application/json" -d "{\"url\":\"http://amaz0n-verify.tk/login\"}"` → returns `LinkInspectionResult` with `HIGH_RISK`
   - `curl http://localhost:3001/api/radar` → returns 5 pre-seeded reports
   - `curl -X POST http://localhost:3001/api/coach -H "Content-Type: application/json" -d "{\"question\":\"I already paid registration fee\"}"` → returns `urgency: 'high'`

2. **Frontend**: `npm run dev` at project root — Vite starts on port 5173. Verify:
   - All 11 existing routes still work (`/`, `/dashboard`, `/analyze`, `/verify`, `/intelligence`, `/safety`, `/report`, `/simulator`, `/quiz`, `/calculator`, `/story`)
   - All 5 new routes work (`/dna`, `/links`, `/evidence`, `/radar`, `/coach`)
   - Dashboard sidebar shows both original nav items and "New Features" section
   - Clicking new sidebar items renders corresponding sections inside dashboard

3. **Build check**: `npm run build` at project root → exits 0 with no TypeScript errors.
