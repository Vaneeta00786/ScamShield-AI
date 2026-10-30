import mongoose, { Schema, Document } from 'mongoose';

export interface IScanRecord extends Document {
  inputType: string;
  riskLevel: string;
  riskScore: number;
  summary: string;
  timestamp: number;
  companyName?: string;
}

const ScanRecordSchema = new Schema<IScanRecord>({
  inputType: { type: String, required: true },
  riskLevel: { type: String, required: true },
  riskScore: { type: Number, required: true },
  summary: { type: String, required: true },
  timestamp: { type: Number, default: () => Date.now() },
  companyName: { type: String },
});

export const ScanRecordModel = mongoose.model<IScanRecord>('ScanRecord', ScanRecordSchema);
