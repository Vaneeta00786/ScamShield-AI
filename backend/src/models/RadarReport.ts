import mongoose, { Schema, Document } from 'mongoose';

export interface IRadarReport extends Document {
  scamType: string;
  platform: string;
  location: string;
  description: string;
  timestamp: number;
  upvotes: number;
  voterIps: string[];
}

const RadarReportSchema = new Schema<IRadarReport>({
  scamType: { type: String, required: true },
  platform: { type: String, required: true },
  location: { type: String, required: true },
  description: { type: String, required: true },
  timestamp: { type: Number, default: () => Date.now() },
  upvotes: { type: Number, default: 0 },
  voterIps: { type: [String], default: [] },
});

export const RadarReportModel = mongoose.model<IRadarReport>('RadarReport', RadarReportSchema);
