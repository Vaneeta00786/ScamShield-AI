# ScamShield AI — 5-Feature Extension (Scam DNA, Link Inspector, Evidence Locker, Scam Radar, AI Safety Coach)

This change extends the existing ScamShield AI project with five new backend services, five new backend routes, five new frontend pages (each exporting both a named Section and a default Page), and corresponding frontend API modules. The extension adds `DashboardSection` union members, a `newFeatureItems` sidebar group, and five new `renderSection()` cases in `DashboardPage`. All original routes, pages, components, and services are present and untouched.

**Watch for:** (1) **confirmed** — `dnaService.ts` computes a `riskLevel` value internally but the field is absent from both the `DnaAnalysisResult` type and the service's return object. The value is dead code. The UI can never surface `SAFE`/`SUSPICIOUS`/`HIGH_RISK` for Scam DNA results. (2) **confirmed** — Evidence metadata is held in a module-level in-memory array; a server restart silently destroys all uploaded evidence with no warning to the user beyond "not persisted to disk".

**Verdict**: APPROVED

---

## High-level view

The preserve-and-extend requirement is fully met. All ten original backend routes (`analyze`, `verify`, `report`, `reports`, `dashboard`, `intelligence`) are mounted in `index.ts` alongside the five new ones. No original file was deleted or had content removed. The `DashboardSection` union was extended by appending five new members. The sidebar `navItems` array is untouched; new feature links live in a separate `newFeatureItems` array rendered in a labelled "New Features" group. All five new frontend pages export a named `*Section` component (used by `DashboardPage`) and a standalone default page (used by `App.tsx`).

The type contracts between frontend and backend are deliberately divergent in two places that pre-existed this change: `ScanResult.isDemo` is `true` (literal) on the frontend and `boolean` on the backend. For the new types, `BehavioralSignal`, `EvidenceFile`, `RadarReport`, `CoachMessage`, and `CoachResponse` are structurally identical between `src/types/index.ts` and `backend/src/types/index.ts`. `LinkInspectionResult` is also identical, including the `isSuspicious`, `domainAge`, and `redirectCount` fields that exist in both.

`DnaAnalysisResult` on the backend computes a `riskLevel` in `dnaService.ts` but the field is not included in the returned object — the backend type doesn't declare it and neither does the frontend. The UI renders a score bar with its own colour thresholds (≤40 green, ≤70 amber, >70 red), so the feature works, but the backend's internal `riskLevel` computation is dead code.

The evidence upload path diverges from the plan: the backend registers the multipart handler on `POST /api/evidence/upload` while the plan spec targeted `POST /api/evidence`. The frontend `api/evidence.ts` correctly calls `/evidence/upload`, so frontend and backend are aligned with each other — only the plan is out of date.

Scam Radar's submit and upvote endpoints use paths `/radar/submit` and `/radar/upvote/:id`. The frontend `api/radar.ts` calls exactly those paths. Both are consistent.

---

<details>
<summary>Issues (3)</summary>

1. **Dead `riskLevel` in dnaService** — `dnaService.ts` computes `riskLevel: RiskLevel` but does not include it in the returned `DnaAnalysisResult`. The frontend cannot surface risk-level categorisation for Scam DNA results. Add `riskLevel` to the `DnaAnalysisResult` interface in both `backend/src/types/index.ts` and `src/types/index.ts`, then include it in the service's return value and display it in `ScamDnaPage.tsx` alongside the score bar.

2. **EvidenceLocker memory-only storage with no restart persistence** — `evidenceService.ts` holds all files in a module-level array. Any server restart clears all evidence. The UI notifies users via a disclaimer banner, but the disclaimer text says "not persisted to disk" without mentioning that a server restart also destroys everything. If the backend crashes mid-session, uploaded evidence is silently lost. For a hackathon demo this is acceptable but should be called out in the disclaimer or addressed with a simple file-system write.

3. **Radar upvote is mutable without identity check** — `upvoteReport` in `radarService.ts` increments `report.upvotes` in place on the stored object and returns a shallow copy. Any user can upvote the same report repeatedly with no deduplication. For demo purposes this is harmless, but the endpoint has no rate limiting or session token guard.

</details>

---

<details>
<summary>Details</summary>

### Dead `riskLevel` computation in dnaService — confirmed

`dnaService.ts` derives `const riskLevel: RiskLevel = behavioralScore >= 60 ? 'HIGH_RISK' : ...` but the return statement is `{ behavioralScore, manipulationTactics: detected, primaryTactic, vulnerabilityWarning, recommendation }` — `riskLevel` is omitted. `DnaAnalysisResult` in both type files does not declare a `riskLevel` field, so TypeScript does not complain, but the value is computed and thrown away. The `ScoreBar` component in `ScamDnaPage.tsx` re-derives thresholds from `behavioralScore` independently (`score <= 40` → low, `score <= 70` → moderate), which gives a visually consistent UI, but the named risk levels (`SAFE`, `SUSPICIOUS`, `HIGH_RISK`) used throughout the rest of the app never appear on the Scam DNA result card, and the backend does no extra work that the score bar alone couldn't do.

### EvidenceLocker — multer bytes stay in process, metadata and buffer both lost on restart

`multer.memoryStorage()` keeps the raw file buffer in Node process heap for the lifetime of the request, but `evidenceService.ts` discards the buffer immediately — only metadata (`id`, `originalName`, `size`, `mimetype`, `uploadedAt`, `notes`) survives in the module-level array. The client disclaimer says files are "not persisted to disk", but does not mention that the metadata index is also destroyed on any server restart or crash. A user who uploads evidence, then experiences a backend restart before filing a complaint, sees an empty locker with no warning.

</details>

---

<details>
<summary>File map</summary>

| File | Change |
|---|---|
| `backend/src/index.ts` | Added imports and mounts for 5 new routers; CORS extended with DELETE |
| `backend/src/types/index.ts` | Appended 7 new interfaces for all 5 features |
| `backend/src/services/dnaService.ts` | New — keyword-based behavioral pattern scoring |
| `backend/src/services/linkService.ts` | New — 7-check URL inspection service |
| `backend/src/services/evidenceService.ts` | New — in-memory evidence metadata store |
| `backend/src/services/radarService.ts` | New — seeded in-memory community report store |
| `backend/src/services/coachService.ts` | New — rule-based Q&A coach with urgency detection |
| `backend/src/routes/dna.ts` | New — POST /api/dna |
| `backend/src/routes/links.ts` | New — POST /api/links |
| `backend/src/routes/evidence.ts` | New — GET/POST /api/evidence, DELETE /api/evidence/:id |
| `backend/src/routes/radar.ts` | New — GET /api/radar, POST /submit, POST /upvote/:id |
| `backend/src/routes/coach.ts` | New — POST /api/coach |
| `src/types/index.ts` | Appended 6 new interfaces; DashboardSection union extended with 5 new members |
| `src/App.tsx` | Added imports and routes for 5 new pages |
| `src/components/layout/Sidebar.tsx` | Added newFeatureItems array and "New Features" section; original navItems untouched |
| `src/pages/DashboardPage.tsx` | Added 5 new case imports and renderSection() cases |
| `src/pages/ScamDnaPage.tsx` | New — named ScamDnaSection + default page |
| `src/pages/LinkInspectorPage.tsx` | New — named LinkInspectorSection + default page |
| `src/pages/EvidenceLockerPage.tsx` | New — named EvidenceLockerSection + default page |
| `src/pages/ScamRadarPage.tsx` | New — named ScamRadarSection + default page |
| `src/pages/AiCoachPage.tsx` | New — named AiCoachSection + default page |
| `src/api/dna.ts` | New — analyzeBehavior() API call |
| `src/api/links.ts` | New — inspectLink() API call |
| `src/api/evidence.ts` | New — uploadEvidence(), getEvidence(), deleteEvidence() using raw fetch |
| `src/api/radar.ts` | New — getRadarReports(), submitRadarReport(), upvoteReport() |
| `src/api/coach.ts` | New — askCoach() API call |

</details>
