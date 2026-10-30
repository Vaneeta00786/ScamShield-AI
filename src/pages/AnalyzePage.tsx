import { useState, useRef, useEffect } from 'react';
import { Upload, AlertTriangle, FileText, CheckCircle2 } from 'lucide-react';
import { createWorker } from 'tesseract.js';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Button } from '../components/ui/Button';
import { Spinner } from '../components/ui/Spinner';
import { ScanResult } from '../components/analysis/ScanResult';
import { analyzeContent } from '../api/analyze';
import type { ScanResult as ScanResultType } from '../types';

type InputTab = 'job_post' | 'chat' | 'offer_letter';
type Platform = 'telegram' | 'whatsapp' | 'other';

const LOADING_MESSAGES = [
  'Reading content…',
  'Checking scam patterns…',
  'Verifying company details…',
  'Generating report…',
];

const OCR_MESSAGES = [
  'Reading image…',
  'Extracting text from offer letter…',
  'Processing document…',
  'Almost done…',
];

const inputClass =
  'w-full bg-card/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-primary placeholder-muted focus:border-amber-500/50 focus:outline-none transition-colors';

interface AnalyzeSectionProps {
  onViewSafety?: () => void;
  onReport?: () => void;
}

export function AnalyzeSection({ onViewSafety, onReport }: AnalyzeSectionProps) {
  const [activeTab, setActiveTab] = useState<InputTab>('job_post');
  const [jobPostText, setJobPostText] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [jobUrl, setJobUrl] = useState('');
  const [chatText, setChatText] = useState('');
  const [platform, setPlatform] = useState<Platform>('telegram');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [extractedText, setExtractedText] = useState('');
  const [ocrStatus, setOcrStatus] = useState<'idle' | 'processing' | 'done' | 'error'>('idle');
  const [ocrProgress, setOcrProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState(0);
  const [result, setResult] = useState<ScanResultType | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isLoading) return;
    const interval = setInterval(() => {
      setLoadingMsg((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, 600);
    return () => clearInterval(interval);
  }, [isLoading]);

  // OCR — extract text from image using Tesseract.js
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (!file) return;
    setUploadedFile(file);
    setExtractedText('');
    setOcrStatus('idle');

    // Only run OCR on images (not PDF — PDFs need different handling)
    if (file.type.startsWith('image/')) {
      setOcrStatus('processing');
      setOcrProgress(0);
      try {
        const worker = await createWorker('eng', 1, {
          logger: (m: { status: string; progress: number }) => {
            if (m.status === 'recognizing text') {
              setOcrProgress(Math.round(m.progress * 100));
            }
          },
        });
        const { data: { text } } = await worker.recognize(file);
        await worker.terminate();
        const cleanText = text.trim();
        if (cleanText.length > 10) {
          setExtractedText(cleanText);
          setOcrStatus('done');
        } else {
          setOcrStatus('error');
          setExtractedText('');
        }
      } catch {
        setOcrStatus('error');
      }
    } else if (file.type === 'application/pdf') {
      // PDF — ask user to paste text manually
      setOcrStatus('error');
    }
  };

  const handleAnalyze = async () => {
    setError(null);

    // Guard: offer_letter tab — if file was uploaded but OCR produced no text, ask user to paste manually
    if (activeTab === 'offer_letter' && extractedText.trim().length === 0) {
      if (uploadedFile !== null) {
        setError(
          'Could not extract text from the image. Please paste the offer letter text manually in the text box below.'
        );
        // Show the manual textarea
        setOcrStatus('error');
      }
      return;
    }

    setIsLoading(true);
    setLoadingMsg(0);

    const text =
      activeTab === 'job_post'
        ? jobPostText
        : activeTab === 'chat'
          ? chatText
          : extractedText;

    try {
      const scanResult = await analyzeContent({
        inputType: activeTab,
        text,
        companyName: companyName || undefined,
        jobUrl: jobUrl || undefined,
        platform: activeTab === 'chat' ? platform : undefined,
      });
      setResult(scanResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setJobPostText('');
    setCompanyName('');
    setJobUrl('');
    setChatText('');
    setExtractedText('');
    setUploadedFile(null);
    setOcrStatus('idle');
    setOcrProgress(0);
    setIsLoading(false);
    setError(null);
  };

  const canAnalyze =
    activeTab === 'job_post'
      ? jobPostText.trim().length > 0
      : activeTab === 'chat'
        ? chatText.trim().length > 0
        : extractedText.trim().length > 0 || uploadedFile !== null;

  const tabs: { id: InputTab; label: string }[] = [
    { id: 'job_post', label: 'Job Post' },
    { id: 'chat', label: 'Chat Conversation' },
    { id: 'offer_letter', label: 'Offer Letter' },
  ];

  if (result && !isLoading) {
    return (
      <ScanResult
        result={result}
        onAnalyzeAnother={handleReset}
        onViewSafety={onViewSafety ?? (() => {})}
        onReport={onReport ?? (() => {})}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-card rounded-xl">
        {tabs.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => { setActiveTab(id); setResult(null); setError(null); }}
            className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
              activeTab === id
                ? 'bg-amber-500/20 text-amber-400'
                : 'text-muted hover:text-primary'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Job Post Tab */}
      {activeTab === 'job_post' && (
        <div className="space-y-4">
          <textarea
            rows={8}
            className={`${inputClass} resize-none`}
            placeholder="Paste the job description here…&#10;&#10;Example: Earn ₹5000 daily from home, simple tasks, join our Telegram group, pay ₹500 to unlock your tasks…"
            value={jobPostText}
            onChange={(e) => setJobPostText(e.target.value)}
          />
          <input
            type="text"
            className={inputClass}
            placeholder="Company Name (optional)"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
          />
          <input
            type="url"
            className={inputClass}
            placeholder="Job Application URL (optional)"
            value={jobUrl}
            onChange={(e) => setJobUrl(e.target.value)}
          />
        </div>
      )}

      {/* Chat Tab */}
      {activeTab === 'chat' && (
        <div className="space-y-4">
          <textarea
            rows={10}
            className={`${inputClass} resize-none`}
            placeholder={`Paste the conversation here…\n\nExample:\nRecruiter: Congratulations! You have been selected for our home-based job.\nYou: What is the work?\nRecruiter: Simple task of liking videos. Earn ₹500 per task.\nRecruiter: First pay ₹500 to activate your wallet and receive tasks.`}
            value={chatText}
            onChange={(e) => setChatText(e.target.value)}
          />
          <div className="flex gap-2">
            {(['telegram', 'whatsapp', 'other'] as Platform[]).map((p) => (
              <button
                key={p}
                onClick={() => setPlatform(p)}
                className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
                  platform === p
                    ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                    : 'border-white/10 text-muted hover:text-primary hover:border-white/20'
                }`}
              >
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Offer Letter Tab — with OCR */}
      {activeTab === 'offer_letter' && (
        <div className="space-y-4">

          {/* Upload zone */}
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="w-full border-2 border-dashed border-white/20 rounded-2xl p-10 text-center hover:border-amber-500/40 transition-colors cursor-pointer"
          >
            <Upload className="w-10 h-10 text-muted mx-auto mb-3" />
            {uploadedFile ? (
              <div>
                <div className="text-amber-400 font-medium">{uploadedFile.name}</div>
                <div className="text-muted text-xs mt-1">Click to change file</div>
              </div>
            ) : (
              <div>
                <div className="text-primary font-medium mb-1">Upload Offer Letter Image</div>
                <div className="text-muted text-sm">JPG, PNG — AI will read text automatically</div>
                <div className="text-muted text-xs mt-1">(PDF: paste text manually below)</div>
              </div>
            )}
          </button>
          <input
            ref={fileRef}
            type="file"
            accept=".jpg,.jpeg,.png,.pdf"
            className="hidden"
            onChange={handleFileChange}
          />

          {/* OCR Processing */}
          {ocrStatus === 'processing' && (
            <div className="bg-card border border-amber-500/20 rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-3">
                <Spinner size="sm" />
                <span className="text-amber-400 text-sm font-medium animate-pulse">
                  {OCR_MESSAGES[Math.floor(ocrProgress / 25) % OCR_MESSAGES.length]}
                </span>
              </div>
              {/* Progress bar */}
              <div className="w-full bg-[#111318] rounded-full h-2">
                <div
                  className="h-2 rounded-full bg-amber-500 transition-all duration-300"
                  style={{ width: `${ocrProgress}%` }}
                />
              </div>
              <p className="text-xs text-muted">Reading text from image… {ocrProgress}%</p>
            </div>
          )}

          {/* OCR Success */}
          {ocrStatus === 'done' && extractedText && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 text-sm font-medium">
                <CheckCircle2 className="w-4 h-4" />
                Text extracted successfully — ready to analyze!
              </div>
              <div className="bg-card border border-emerald-500/20 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="w-4 h-4 text-amber-400" />
                  <span className="text-xs text-muted font-medium uppercase tracking-wider">Extracted Text Preview</span>
                </div>
                <p className="text-xs text-muted leading-relaxed max-h-32 overflow-y-auto whitespace-pre-wrap">
                  {extractedText.slice(0, 500)}{extractedText.length > 500 ? '…' : ''}
                </p>
              </div>
            </div>
          )}

          {/* OCR Error / PDF fallback */}
          {ocrStatus === 'error' && (
            <div className="space-y-3">
              <div className="flex items-start gap-2 bg-amber-500/10 border border-amber-500/30 rounded-xl px-4 py-3 text-amber-400 text-sm">
                <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
                <span>
                  {uploadedFile?.type === 'application/pdf'
                    ? 'PDF detected — please paste the offer letter text below for analysis.'
                    : 'Could not read text from this image. Please paste the text manually below.'}
                </span>
              </div>
              <textarea
                rows={8}
                className={`${inputClass} resize-none`}
                placeholder="Paste offer letter text here…&#10;&#10;Example: Dear Candidate, You have been selected. Please pay ₹2000 registration fee to confirm joining…"
                value={extractedText}
                onChange={(e) => setExtractedText(e.target.value)}
              />
            </div>
          )}

          {/* Manual override — edit extracted text */}
          {ocrStatus === 'done' && (
            <button
              onClick={() => setOcrStatus('error')}
              className="text-xs text-muted hover:text-amber-400 transition-colors underline"
            >
              Edit extracted text manually
            </button>
          )}

        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="flex items-start gap-2 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm">
          <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Analyze button */}
      {isLoading ? (
        <div className="flex flex-col items-center gap-4 py-6">
          <Spinner size="lg" />
          <p className="text-amber-400 text-sm animate-pulse">{LOADING_MESSAGES[loadingMsg]}</p>
        </div>
      ) : (
        <Button
          variant="primary"
          size="lg"
          className="w-full"
          onClick={handleAnalyze}
          disabled={!canAnalyze || ocrStatus === 'processing'}
        >
          {ocrStatus === 'processing' ? 'Reading image…' : 'Analyze for Scam'}
        </Button>
      )}
    </div>
  );
}

export default function AnalyzePage() {
  return (
    <div className="min-h-screen flex flex-col bg-midnight">
      <Navbar />
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-primary mb-3">Job Scam Analyzer</h1>
          <p className="text-muted">
            Paste a job post, chat conversation, or upload an offer letter image to check for scam patterns.
          </p>
        </div>
        <AnalyzeSection />
      </main>
      <Footer />
    </div>
  );
}
