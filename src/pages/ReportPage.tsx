import { useState, useRef } from 'react';
import { Phone, ExternalLink, AlertTriangle, Upload, Flag, CheckCircle2 } from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useToast } from '../context/ToastContext';
import { submitReport } from '../api/report';

interface Props {
  standalone?: boolean;
}

const inputClass =
  'w-full bg-card/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-primary placeholder-muted focus:border-amber-500/50 focus:outline-none transition-colors';

const selectClass =
  'w-full bg-card/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-primary focus:border-amber-500/50 focus:outline-none transition-colors appearance-none';

function ReportContent() {
  const { showToast } = useToast();
  const [scamType, setScamType] = useState('');
  const [recruiterName, setRecruiterName] = useState('');
  const [platform, setPlatform] = useState('');
  const [description, setDescription] = useState('');
  const [evidenceFile, setEvidenceFile] = useState<File | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await submitReport({
        scamType,
        companyName: recruiterName,
        platform,
        description,
      });
      showToast(
        'Report submitted. Please also file an official complaint at cybercrime.gov.in',
        'success',
      );
      setSubmitted(true);
    } catch {
      showToast('Failed to submit report. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setScamType('');
    setRecruiterName('');
    setPlatform('');
    setDescription('');
    setEvidenceFile(null);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-primary mb-3 flex items-center gap-3">
          <Flag className="w-8 h-8 text-red-400" />
          Report a Scam
        </h1>
        <p className="text-muted">
          Document what happened. To file an official complaint, use the buttons below.
        </p>
      </div>

      {/* Prominent disclaimer */}
      <div className="bg-caution/10 border-2 border-caution/30 rounded-xl p-4 mb-6">
        <div className="flex items-start gap-2 text-caution">
          <AlertTriangle className="w-5 h-5 mt-0.5 shrink-0" />
          <div>
            <div className="font-bold text-sm">IMPORTANT</div>
            <div className="text-xs mt-1 text-muted">
              Submitting this form does <strong className="text-caution">NOT</strong> automatically
              file a complaint with any authority. To file an actual complaint, use the official
              portal below.
            </div>
          </div>
        </div>
      </div>

      {/* 1930 section */}
      <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-5 mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Phone className="w-5 h-5 text-red-400" />
          <div>
            <div className="font-bold text-red-400 text-lg">Cybercrime Helpline: 1930</div>
            <div className="text-xs text-muted">Available 24/7 for cybercrime reporting</div>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <a href="tel:1930">
            <Button variant="danger" size="sm" icon={<Phone className="w-4 h-4" />}>
              Call 1930 Now
            </Button>
          </a>
          <a href="https://cybercrime.gov.in/" target="_blank" rel="noopener noreferrer">
            <Button variant="secondary" size="sm" icon={<ExternalLink className="w-4 h-4" />}>
              File at cybercrime.gov.in
            </Button>
          </a>
        </div>
      </div>

      {submitted ? (
        <Card className="text-center py-10">
          <CheckCircle2 className="w-12 h-12 text-success mx-auto mb-4" />
          <h2 className="text-xl font-bold text-primary mb-2">Report Submitted</h2>
          <p className="text-muted text-sm mb-6 max-w-xs mx-auto">
            Your report has been recorded. Remember to also file an official complaint at{' '}
            <a
              href="https://cybercrime.gov.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-400 hover:underline"
            >
              cybercrime.gov.in
            </a>{' '}
            or call 1930.
          </p>
          <Button variant="secondary" onClick={handleReset}>
            Submit Another Report
          </Button>
        </Card>
      ) : (
        <Card>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="scam-type" className="block text-sm font-medium text-primary mb-1.5">
                Scam Type <span className="text-red-400">*</span>
              </label>
              <select
                id="scam-type"
                className={selectClass}
                value={scamType}
                onChange={(e) => setScamType(e.target.value)}
                required
              >
                <option value="">Select scam type…</option>
                <option value="telegram-task">Telegram Task Scam</option>
                <option value="fake-wfh">Fake WFH Job</option>
                <option value="registration-fee">Registration Fee Scam</option>
                <option value="fake-recruitment">Fake Recruitment Agency</option>
                <option value="deposit-scam">Deposit Scam</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="recruiter" className="block text-sm font-medium text-primary mb-1.5">
                Company / Recruiter Name <span className="text-red-400">*</span>
              </label>
              <input
                id="recruiter"
                type="text"
                className={inputClass}
                placeholder="Name as it appeared in the message or job post"
                value={recruiterName}
                onChange={(e) => setRecruiterName(e.target.value)}
                required
              />
            </div>

            <div>
              <label htmlFor="platform" className="block text-sm font-medium text-primary mb-1.5">
                Platform <span className="text-red-400">*</span>
              </label>
              <select
                id="platform"
                className={selectClass}
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                required
              >
                <option value="">Select platform…</option>
                <option value="telegram">Telegram</option>
                <option value="whatsapp">WhatsApp</option>
                <option value="email">Email</option>
                <option value="phone">Phone / SMS</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-primary mb-1.5">
                Description <span className="text-red-400">*</span>
              </label>
              <textarea
                id="description"
                rows={5}
                className={`${inputClass} resize-none`}
                placeholder="Describe what happened. Include amounts, dates, and any links or contact details shared by the scammer."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            {/* Evidence upload */}
            <div>
              <label className="block text-sm font-medium text-primary mb-1.5">
                Upload Evidence (Optional)
              </label>
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="w-full border-2 border-dashed border-white/20 rounded-xl p-6 text-center hover:border-amber-500/40 transition-colors cursor-pointer"
              >
                <Upload className="w-6 h-6 text-muted mx-auto mb-2" />
                {evidenceFile ? (
                  <span className="text-sm text-amber-400">{evidenceFile.name}</span>
                ) : (
                  <span className="text-sm text-muted">
                    Click to upload screenshots or PDFs
                  </span>
                )}
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="image/*,.pdf"
                className="hidden"
                onChange={(e) => setEvidenceFile(e.target.files?.[0] ?? null)}
              />
            </div>

            <Button
              variant="primary"
              size="lg"
              className="w-full"
              type="submit"
              loading={isSubmitting}
            >
              {isSubmitting ? 'Submitting…' : 'Submit Report'}
            </Button>
          </form>
        </Card>
      )}
    </div>
  );
}

export default function ReportPage({ standalone = true }: Props) {
  if (!standalone) {
    return <ReportContent />;
  }
  return (
    <div className="min-h-screen flex flex-col bg-midnight">
      <Navbar />
      <main className="flex-1">
        <ReportContent />
      </main>
      <Footer />
    </div>
  );
}
