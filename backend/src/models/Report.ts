import mongoose, { Schema, Document } from 'mongoose';

export interface IReport extends Document {
  scamType: string;
  companyName: string;
  platform: string;
  description: string;
  timestamp: number;
}

const ReportSchema = new Schema<IReport>({
  scamType: { type: String, required: true },
  companyName: { type: String, required: true },
  platform: { type: String, required: true },
  description: { type: String, required: true },
  timestamp: { type: Number, default: () => Date.now() },
});

export const ReportModel = mongoose.model<IReport>('Report', ReportSchema);
