import type { StoredReport } from '../types';
import { isDBConnected } from '../db/connect';
import { ReportModel } from '../models/Report';

// In-memory fallback (kept from original)
const reports: StoredReport[] = [];

export async function addReport(data: Omit<StoredReport, 'id' | 'timestamp'>): Promise<StoredReport> {
  if (isDBConnected()) {
    const doc = await ReportModel.create({ ...data, timestamp: Date.now() });
    return {
      id: (doc._id as { toString(): string }).toString(),
      scamType: doc.scamType,
      companyName: doc.companyName,
      platform: doc.platform,
      description: doc.description,
      timestamp: doc.timestamp,
    };
  }
  // Fallback
  const report: StoredReport = { ...data, id: Date.now().toString(36), timestamp: Date.now() };
  reports.push(report);
  return report;
}

export async function getAllReports(): Promise<StoredReport[]> {
  if (isDBConnected()) {
    const docs = await ReportModel.find().sort({ timestamp: -1 }).limit(100).lean();
    return docs.map(d => ({
      id: (d._id as { toString(): string }).toString(),
      scamType: d.scamType,
      companyName: d.companyName,
      platform: d.platform,
      description: d.description,
      timestamp: d.timestamp,
    }));
  }
  return [...reports];
}
