import mongoose, { Schema, Document } from 'mongoose';

export interface IEvidenceFile extends Document {
  originalName: string;
  size: number;
  mimetype: string;
  uploadedAt: number;
  notes?: string;
  data: Buffer;
}

const EvidenceFileSchema = new Schema<IEvidenceFile>({
  originalName: { type: String, required: true },
  size: { type: Number, required: true },
  mimetype: { type: String, required: true },
  uploadedAt: { type: Number, default: () => Date.now() },
  notes: { type: String },
  data: { type: Buffer, required: true },
});

export const EvidenceFileModel = mongoose.model<IEvidenceFile>('EvidenceFile', EvidenceFileSchema);
