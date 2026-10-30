import { randomUUID } from 'crypto';
import type { EvidenceFile } from '../types';
import { isDBConnected } from '../db/connect';
import { EvidenceFileModel } from '../models/EvidenceFile';

const evidenceStore: EvidenceFile[] = [];

export async function storeEvidence(file: Express.Multer.File, notes?: string): Promise<EvidenceFile> {
  if (isDBConnected()) {
    const doc = await EvidenceFileModel.create({
      originalName: file.originalname,
      size: file.size,
      mimetype: file.mimetype,
      uploadedAt: Date.now(),
      notes,
      data: file.buffer,
    });
    return {
      id: doc._id.toString(),
      originalName: doc.originalName,
      size: doc.size,
      mimetype: doc.mimetype,
      uploadedAt: doc.uploadedAt,
      notes: doc.notes,
    };
  }
  const entry: EvidenceFile = {
    id: randomUUID(),
    originalName: file.originalname,
    size: file.size,
    mimetype: file.mimetype,
    uploadedAt: Date.now(),
    notes,
  };
  evidenceStore.push(entry);
  return entry;
}

export async function getAllEvidence(): Promise<EvidenceFile[]> {
  if (isDBConnected()) {
    const docs = await EvidenceFileModel.find().select('-data').sort({ uploadedAt: -1 }).lean();
    return docs.map(d => ({
      id: d._id.toString(),
      originalName: d.originalName,
      size: d.size,
      mimetype: d.mimetype,
      uploadedAt: d.uploadedAt,
      notes: d.notes,
    }));
  }
  return [...evidenceStore];
}

export async function deleteEvidence(id: string): Promise<boolean> {
  if (isDBConnected()) {
    const result = await EvidenceFileModel.findByIdAndDelete(id);
    return result !== null;
  }
  const idx = evidenceStore.findIndex(e => e.id === id);
  if (idx === -1) return false;
  evidenceStore.splice(idx, 1);
  return true;
}
