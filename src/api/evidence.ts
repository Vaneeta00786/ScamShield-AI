import type { EvidenceFile } from '../types';

const BASE = '/api';

export async function uploadEvidence(file: File, notes?: string): Promise<EvidenceFile> {
  const formData = new FormData();
  formData.append('file', file);
  if (notes) formData.append('notes', notes);
  const res = await fetch(`${BASE}/evidence/upload`, { method: 'POST', body: formData });
  if (!res.ok) {
    const body = await res.json().catch(() => ({})) as { error?: string };
    throw new Error(body.error ?? `Upload failed ${res.status}`);
  }
  return res.json() as Promise<EvidenceFile>;
}

export async function getEvidence(): Promise<EvidenceFile[]> {
  const res = await fetch(`${BASE}/evidence`);
  if (!res.ok) throw new Error(`API error ${res.status}`);
  // Backend returns { files: EvidenceFile[], notice: string }
  const data = await res.json() as { files?: EvidenceFile[] } | EvidenceFile[];
  if (Array.isArray(data)) return data;
  return data.files ?? [];
}

export async function deleteEvidence(id: string): Promise<void> {
  const res = await fetch(`${BASE}/evidence/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error(`API error ${res.status}`);
}
