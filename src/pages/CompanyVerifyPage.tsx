import { useState } from 'react';
import { Building2, Search, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Spinner } from '../components/ui/Spinner';
import { verifyCompany } from '../api/verify';
import type { CompanyVerificationResult } from '../types';

interface Props {
  standalone?: boolean;
}

const inputClass =
  'w-full bg-card/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-primary placeholder-muted focus:border-amber-500/50 focus:outline-none transition-colors';

function CompanyVerifyContent() {
  const [companyName, setCompanyName] = useState('');
  const [cin, setCin] = useState('');
  const [website, setWebsite] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [result, setResult] = useState<CompanyVerificationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleVerify = async () => {
    if (!companyName.trim()) return;
    setIsVerifying(true);
    setResult(null);
    setError(null);
    try {
      const data = await verifyCompany({
        companyName: companyName.trim(),
        cin: cin.trim() || undefined,
        website: website.trim() || undefined,
      });
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Verification failed. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
    setCompanyName('');
    setCin('');
    setWebsite('');
  };

  const registryBadge = () => {
    if (!result) return null;
    if (result.registryStatus === 'found')
      return <Badge variant="success">Found in registry</Badge>;
    if (result.registryStatus === 'not_found')
      return <Badge variant="danger">Not found in registry</Badge>;
    return <Badge variant="caution">Could not be verified</Badge>;
  };

  const domainBadge = () => {
    if (!result) return null;
    if (result.domainStatus === 'verified')
      return (
        <span className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-success" />
          <Badge variant="success">Domain appears legitimate</Badge>
        </span>
      );
    if (result.domainStatus === 'suspicious')
      return (
        <span className="flex items-center gap-2">
          <XCircle className="w-4 h-4 text-danger" />
          <Badge variant="danger">Domain suspicious</Badge>
        </span>
      );
    return (
      <span className="flex items-center gap-2">
        <XCircle className="w-4 h-4 text-caution" />
        <Badge variant="caution">Not checked</Badge>
      </span>
    );
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-primary mb-3 flex items-center gap-3">
          <Building2 className="w-8 h-8 text-amber-400" />
          Company Verification
        </h1>
        <p className="text-muted">
          Enter company details to check against known registry data. Verify before trusting any
          recruiter.
        </p>
      </div>

      {/* Form */}
      <Card className="mb-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="company-name" className="block text-sm font-medium text-primary mb-1.5">
              Company Name <span className="text-red-400">*</span>
            </label>
            <input
              id="company-name"
              type="text"
              className={inputClass}
              placeholder="e.g. Acme Solutions Pvt Ltd"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="cin" className="block text-sm font-medium text-primary mb-1.5">
              CIN (Optional)
            </label>
            <input
              id="cin"
              type="text"
              className={inputClass}
              placeholder="U12345MH2020PTC123456"
              value={cin}
              onChange={(e) => setCin(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="website" className="block text-sm font-medium text-primary mb-1.5">
              Official Website / Domain (Optional)
            </label>
            <input
              id="website"
              type="text"
              className={inputClass}
              placeholder="e.g. www.acmesolutions.com"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
            />
          </div>
          <Button
            variant="primary"
            size="lg"
            className="w-full"
            onClick={handleVerify}
            loading={isVerifying}
            disabled={!companyName.trim()}
            icon={<Search className="w-4 h-4" />}
          >
            {isVerifying ? 'Verifying…' : 'Verify Company'}
          </Button>
        </div>
      </Card>

      {/* Loading */}
      {isVerifying && (
        <div className="flex flex-col items-center gap-4 py-8">
          <Spinner size="lg" />
          <p className="text-muted text-sm animate-pulse">Checking registry data…</p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="flex items-start gap-2 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm mb-4">
          <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Result */}
      {result && !isVerifying && (
        <div className="space-y-4">
          <Card>
            <h3 className="font-semibold text-primary mb-4 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-amber-400" />
              Verification Result for "{result.companyName}"
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-white/5">
                <span className="text-sm text-muted">Registry Status</span>
                {registryBadge()}
              </div>
              <div className="flex items-center justify-between py-2 border-b border-white/5">
                <span className="text-sm text-muted">Domain Status</span>
                {domainBadge()}
              </div>
              {result.incorporationDate && (
                <div className="flex items-center justify-between py-2 border-b border-white/5">
                  <span className="text-sm text-muted">Incorporation Date</span>
                  <span className="text-sm text-primary">{result.incorporationDate}</span>
                </div>
              )}
              {result.registeredAddress && (
                <div className="flex items-center justify-between py-2 border-b border-white/5">
                  <span className="text-sm text-muted">Registered Office</span>
                  <span className="text-sm text-primary text-right max-w-xs">
                    {result.registeredAddress}
                  </span>
                </div>
              )}
              {result.cin && (
                <div className="flex items-center justify-between py-2 border-b border-white/5">
                  <span className="text-sm text-muted">CIN</span>
                  <span className="text-sm font-mono text-amber-400">{result.cin}</span>
                </div>
              )}
              <div className="pt-2">
                <p className="text-xs text-muted">{result.note}</p>
              </div>
            </div>
          </Card>

          <Button variant="secondary" className="w-full" onClick={handleReset}>
            Verify Another Company
          </Button>
        </div>
      )}
    </div>
  );
}

export default function CompanyVerifyPage({ standalone = true }: Props) {
  if (!standalone) {
    return <CompanyVerifyContent />;
  }
  return (
    <div className="min-h-screen flex flex-col bg-midnight">
      <Navbar />
      <main className="flex-1">
        <CompanyVerifyContent />
      </main>
      <Footer />
    </div>
  );
}
