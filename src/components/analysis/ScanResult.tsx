import { ShieldCheck, AlertTriangle, ShieldX, Flag } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { ProgressBar } from '../ui/ProgressBar';
import type { ScanResult as ScanResultType, ScamStage, RiskLevel } from '../../types';

const STAGE_ORDER: ScamStage[] = [
  'initial_attraction',
  'trust_building',
  'small_task_payment',
  'prepaid_task_escalation',
  'deposit_demand',
  'withdrawal_blockage',
];

const STAGE_LABELS: Record<ScamStage, string> = {
  initial_attraction: 'Initial Attraction',
  trust_building: 'Trust Building',
  small_task_payment: 'Small Task / Payment',
  prepaid_task_escalation: 'Prepaid Task Escalation',
  deposit_demand: 'Deposit Demand',
  withdrawal_blockage: 'Withdrawal Blockage',
};

const riskConfig: Record<
  RiskLevel,
  { bg: string; border: string; textColor: string; label: string; icon: React.ReactNode }
> = {
  SAFE: {
    bg: 'bg-success/10',
    border: 'border-success/30',
    textColor: 'text-success',
    label: 'SAFE',
    icon: <ShieldCheck className="w-10 h-10 text-success" />,
  },
  SUSPICIOUS: {
    bg: 'bg-caution/10',
    border: 'border-caution/30',
    textColor: 'text-caution',
    label: 'SUSPICIOUS',
    icon: <AlertTriangle className="w-10 h-10 text-caution" />,
  },
  HIGH_RISK: {
    bg: 'bg-red-500/10',
    border: 'border-red-500/30',
    textColor: 'text-red-400',
    label: 'HIGH RISK',
    icon: <ShieldX className="w-10 h-10 text-red-400" />,
  },
};

const progressColor: Record<RiskLevel, 'green' | 'amber' | 'red'> = {
  SAFE: 'green',
  SUSPICIOUS: 'amber',
  HIGH_RISK: 'red',
};

const severityColors = {
  high: 'bg-red-400',
  medium: 'bg-caution',
  low: 'bg-amber-500',
};

interface ScanResultProps {
  result: ScanResultType;
  onAnalyzeAnother: () => void;
  onViewSafety: () => void;
  onReport: () => void;
}

export function ScanResult({ result, onAnalyzeAnother, onViewSafety, onReport }: ScanResultProps) {
  const config = riskConfig[result.riskLevel];
  const currentStageIndex = STAGE_ORDER.indexOf(result.currentStage);

  const registryBadgeVariant = {
    found: 'success',
    not_found: 'danger',
    unverified: 'caution',
  } as const;

  return (
    <div className="space-y-6">
      {/* Demo disclaimer */}
      <div className="flex items-start gap-2 bg-caution/10 border border-caution/30 rounded-xl px-4 py-3 text-caution text-sm">
        <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
        <span>
          <strong>Demo Data —</strong> These results are simulated for demonstration purposes only
          and do not represent real AI analysis or actual verification.
        </span>
      </div>

      {/* Risk classification hero */}
      <div
        className={`flex flex-col sm:flex-row items-center gap-5 p-6 rounded-2xl border ${config.bg} ${config.border}`}
      >
        {config.icon}
        <div className="text-center sm:text-left">
          <div className={`text-3xl font-extrabold ${config.textColor}`}>{config.label}</div>
          <div className="text-muted text-sm mt-1">Risk Score: <span className={`font-bold text-xl ${config.textColor}`}>{result.riskScore}</span>/100</div>
        </div>
        <div className="flex-1 sm:ml-4 w-full sm:w-auto">
          <ProgressBar value={result.riskScore} label="Risk Level" color={progressColor[result.riskLevel]} />
        </div>
      </div>

      {/* Warning signs */}
      <Card>
        <h3 className="text-base font-semibold text-primary mb-4 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-caution" />
          Detected Warning Signs
        </h3>
        {result.warningSignsDetected.length === 0 ? (
          <div className="flex items-center gap-2 text-success text-sm">
            <ShieldCheck className="w-4 h-4" />
            No major warning signs detected.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {result.warningSignsDetected.map((sign) => (
              <div key={sign.id} className="flex items-start gap-3 bg-white/5 rounded-xl p-3">
                <span
                  className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${severityColors[sign.severity]}`}
                />
                <div>
                  <div className="text-sm font-medium text-primary">{sign.label}</div>
                  <div className="text-xs text-muted mt-0.5">{sign.description}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Suspicious phrases */}
      {result.suspiciousPhrases.length > 0 && (
        <Card>
          <h3 className="text-base font-semibold text-primary mb-4">Suspicious Phrases Detected</h3>
          <div className="space-y-2">
            {result.suspiciousPhrases.map((sp, i) => (
              <div
                key={i}
                className="bg-red-500/10 border border-red-500/20 rounded-lg p-3"
              >
                <div className="text-red-400 font-mono text-sm">"{sp.phrase}"</div>
                <div className="text-muted text-xs mt-1">⚠️ {sp.reason}</div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Plain-language explanation */}
      <Card variant="glass">
        <h3 className="text-base font-semibold text-primary mb-2">What this means for you</h3>
        <p className="text-sm text-muted leading-relaxed">{result.summary}</p>
      </Card>

      {/* Company verification */}
      {result.companyVerification && (
        <Card>
          <h3 className="text-base font-semibold text-primary mb-4 flex items-center gap-2">
            Company Verification
          </h3>
          <div className="flex flex-wrap gap-3 mb-3">
            <div className="flex items-center gap-2 text-sm text-muted">
              Registry Status:
              <Badge variant={registryBadgeVariant[result.companyVerification.registryStatus]}>
                {result.companyVerification.registryStatus === 'found'
                  ? 'Found'
                  : result.companyVerification.registryStatus === 'not_found'
                    ? 'Not Found'
                    : 'Unverified'}
              </Badge>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted">
              Domain:
              <Badge
                variant={
                  result.companyVerification.domainStatus === 'verified'
                    ? 'success'
                    : result.companyVerification.domainStatus === 'suspicious'
                      ? 'danger'
                      : 'neutral'
                }
              >
                {result.companyVerification.domainStatus === 'verified'
                  ? 'Verified'
                  : result.companyVerification.domainStatus === 'suspicious'
                    ? 'Suspicious'
                    : 'Not Checked'}
              </Badge>
            </div>
          </div>
          <div className="text-xs text-caution bg-caution/10 border border-caution/20 rounded-lg px-3 py-2">
            {result.companyVerification.note}
          </div>
        </Card>
      )}

      {/* Scam stage tracker */}
      <Card>
        <h3 className="text-base font-semibold text-primary mb-4">Scam Script Stage Tracker</h3>

        {/* Desktop: horizontal stepper */}
        <div className="hidden sm:flex items-start">
          {STAGE_ORDER.map((stage, idx) => {
            const isPast = idx < currentStageIndex;
            const isCurrent = idx === currentStageIndex;
            const isFuture = idx > currentStageIndex;
            return (
              <div key={stage} className="flex-1 flex flex-col items-center relative">
                {/* Connecting line (left side) */}
                {idx > 0 && (
                  <div
                    className={`absolute left-0 top-[14px] w-1/2 h-0.5 ${
                      idx <= currentStageIndex ? 'bg-amber-500' : 'bg-white/10'
                    }`}
                  />
                )}
                {/* Connecting line (right side) */}
                {idx < STAGE_ORDER.length - 1 && (
                  <div
                    className={`absolute right-0 top-[14px] w-1/2 h-0.5 ${
                      idx < currentStageIndex ? 'bg-amber-500' : 'bg-white/10'
                    }`}
                  />
                )}
                {/* Circle */}
                <div
                  className={`relative z-10 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${
                    isCurrent
                      ? 'bg-amber-500 border-amber-500 text-graphite animate-pulse'
                      : isPast
                        ? 'bg-amber-500/30 border-amber-500 text-amber-400'
                        : 'bg-transparent border-white/20 text-muted'
                  }`}
                >
                  {idx + 1}
                </div>
                {/* Label */}
                <div
                  className={`mt-2 text-center text-[10px] font-medium leading-tight max-w-[80px] ${
                    isCurrent
                      ? 'text-amber-400'
                      : isPast
                        ? 'text-amber-400/60'
                        : isFuture
                          ? 'text-muted/50'
                          : 'text-muted'
                  }`}
                >
                  {STAGE_LABELS[stage]}
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile: compact display */}
        <div className="sm:hidden">
          <div className="flex items-center gap-3 bg-amber-500/10 border border-amber-500/30 rounded-xl px-4 py-3">
            <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-graphite font-bold text-sm">
              {currentStageIndex + 1}
            </div>
            <div>
              <div className="text-amber-400 font-semibold text-sm">{STAGE_LABELS[result.currentStage]}</div>
              <div className="text-muted text-xs">Stage {currentStageIndex + 1} of {STAGE_ORDER.length}</div>
            </div>
          </div>
        </div>

        <p className="mt-4 text-sm text-muted">
          Current stage:{' '}
          <span className="text-amber-400 font-medium">{STAGE_LABELS[result.currentStage]}</span>
        </p>
      </Card>

      {/* Critical warning */}
      {result.riskLevel !== 'SAFE' && (
        <div className="bg-red-500/10 border-2 border-red-500/40 rounded-2xl p-5 text-center">
          <div className="text-red-400 font-bold text-lg">
            🚨 Do not send money to unlock tasks, rewards or withdrawals.
          </div>
          <p className="text-muted text-sm mt-2">
            If someone is asking you to pay to receive your earnings, it is a scam.
          </p>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex flex-wrap gap-3">
        <Button variant="secondary" onClick={onAnalyzeAnother}>
          Analyze Another Offer
        </Button>
        <Button
          variant="ghost"
          icon={<ShieldCheck className="w-4 h-4" />}
          onClick={onViewSafety}
        >
          View Safety Recommendations
        </Button>
        <Button
          variant="danger"
          icon={<Flag className="w-4 h-4" />}
          onClick={onReport}
        >
          Report Scam
        </Button>
      </div>
    </div>
  );
}
