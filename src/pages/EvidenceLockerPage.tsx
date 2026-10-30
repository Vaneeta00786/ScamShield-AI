import { useState, useEffect, useRef } from 'react';
import { FolderLock, Upload, Trash2, AlertTriangle, ShieldCheck, FileText } from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import { Card } from '../components/ui/Card';
import { Spinner } from '../components/ui/Spinner';
import { uploadEvidence, getEvidence, deleteEvidence } from '../api/evidence';
import type { EvidenceFile } from '../types';

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatTime(ts: number): string {
  return new Date(ts).toLocaleString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

export function EvidenceLockerSection() {
  const [files, setFiles] = useState<EvidenceFile[]>([]);
  const [notes, setNotes] = useState('');
  const [uploading, setUploading] = useState(false);
  const [loadingFiles, setLoadingFiles] = useState(true);
  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getEvidence()
      .then(setFiles)
      .catch(() => setFiles([]))
      .finally(() => setLoadingFiles(false));
  }, []);

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) setSelectedFile(file);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    setSelectedFile(file);
  }

  async function handleUpload() {
    if (!selectedFile) return;
    setUploading(true);
    setUploadError(null);
    try {
      const uploaded = await uploadEvidence(selectedFile, notes || undefined);
      setFiles(prev => [uploaded, ...prev]);
      setSelectedFile(null);
      setNotes('');
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (e) {
      setUploadError(e instanceof Error ? e.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(id: string) {
    setDeletingId(id);
    try {
      await deleteEvidence(id);
      setFiles(prev => prev.filter(f => f.id !== id));
    } catch {
      // silent
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
            <FolderLock className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-[#F8FAFC]">Scam Evidence Locker</h1>
            <p className="text-[#9CA3AF] text-sm">Securely store screenshots and documents for your complaint</p>
          </div>
        </div>
      </div>

      {/* Privacy notice */}
      <div className="flex items-start gap-3 px-4 py-3 bg-amber-500/5 border border-amber-500/20 rounded-xl">
        <ShieldCheck className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
        <p className="text-xs text-[#9CA3AF]">
          Files are stored in server memory only and are not persisted to disk. For official legal evidence, download and submit directly via{' '}
          <a href="https://cybercrime.gov.in" target="_blank" rel="noreferrer" className="text-amber-400 hover:underline">cybercrime.gov.in</a>.
        </p>
      </div>

      {/* Upload zone */}
      <Card>
        <h3 className="font-semibold text-[#F8FAFC] mb-4">Upload Evidence</h3>

        {/* Drop zone */}
        <div
          onDrop={handleDrop}
          onDragOver={e => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
            dragOver
              ? 'border-amber-500/60 bg-amber-500/5'
              : 'border-[rgba(245,158,11,0.2)] hover:border-amber-500/40 hover:bg-amber-500/5'
          }`}
          role="button"
          aria-label="Upload evidence file"
          tabIndex={0}
          onKeyDown={e => { if (e.key === 'Enter') fileInputRef.current?.click(); }}
        >
          <Upload className="w-8 h-8 text-amber-400 mx-auto mb-2" />
          {selectedFile ? (
            <div>
              <p className="text-sm font-semibold text-[#F8FAFC]">{selectedFile.name}</p>
              <p className="text-xs text-[#9CA3AF] mt-1">{formatBytes(selectedFile.size)}</p>
            </div>
          ) : (
            <div>
              <p className="text-sm text-[#F8FAFC]">Drag & drop or click to select</p>
              <p className="text-xs text-[#9CA3AF] mt-1">Images (JPG, PNG, GIF) and PDF — max 10 MB</p>
            </div>
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,application/pdf"
          onChange={handleFileChange}
          className="hidden"
          aria-label="Select file"
        />

        {/* Notes */}
        <div className="mt-4">
          <label htmlFor="evidence-notes" className="block text-sm text-[#9CA3AF] mb-2">
            Notes (optional)
          </label>
          <textarea
            id="evidence-notes"
            value={notes}
            onChange={e => setNotes(e.target.value)}
            rows={2}
            placeholder="Describe what this evidence shows..."
            className="w-full bg-[#111318] border border-[rgba(245,158,11,0.16)] rounded-xl px-4 py-3 text-sm text-[#F8FAFC] placeholder:text-[#4B5563] focus:outline-none focus:ring-2 focus:ring-amber-500/40 resize-none"
          />
        </div>

        {uploadError && (
          <div className="mt-3 flex items-center gap-2 text-red-400 text-sm">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            {uploadError}
          </div>
        )}

        <button
          onClick={handleUpload}
          disabled={uploading || !selectedFile}
          className="mt-4 flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 text-[#111318] font-bold text-sm hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {uploading ? <Spinner size="sm" /> : <Upload className="w-4 h-4" />}
          Upload Evidence
        </button>
      </Card>

      {/* File list */}
      <Card>
        <h3 className="font-semibold text-[#F8FAFC] mb-4">
          Stored Evidence {!loadingFiles && `(${files.length})`}
        </h3>

        {loadingFiles ? (
          <div className="flex items-center gap-3 py-4">
            <Spinner size="sm" />
            <span className="text-sm text-[#9CA3AF]">Loading files…</span>
          </div>
        ) : files.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="w-10 h-10 text-[#374151] mx-auto mb-2" />
            <p className="text-sm text-[#9CA3AF]">No evidence uploaded yet.</p>
          </div>
        ) : (
          <ul className="space-y-3">
            {files.map(f => (
              <li
                key={f.id}
                className="flex items-center justify-between gap-3 p-3 rounded-xl bg-[#111318] border border-[rgba(245,158,11,0.08)]"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <FileText className="w-5 h-5 text-amber-400 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-[#F8FAFC] truncate">{f.originalName}</p>
                    <p className="text-xs text-[#9CA3AF]">
                      {formatBytes(f.size)} · {formatTime(f.uploadedAt)}
                    </p>
                    {f.notes && (
                      <p className="text-xs text-[#6B7280] mt-0.5 truncate">{f.notes}</p>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => { void handleDelete(f.id); }}
                  disabled={deletingId === f.id}
                  aria-label={`Delete ${f.originalName}`}
                  className="p-1.5 rounded-lg text-[#6B7280] hover:text-red-400 hover:bg-red-500/10 disabled:opacity-50 transition-colors shrink-0"
                >
                  {deletingId === f.id ? <Spinner size="sm" /> : <Trash2 className="w-4 h-4" />}
                </button>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}

export default function EvidenceLockerPage() {
  return (
    <div className="min-h-screen bg-[#111318]">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <EvidenceLockerSection />
      </main>
    </div>
  );
}
