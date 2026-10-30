import { randomUUID } from 'crypto';
import type { RadarReport } from '../types';
import { isDBConnected } from '../db/connect';
import { RadarReportModel } from '../models/RadarReport';

// In-memory fallback — keep existing 5 seeded entries
const radarReports: RadarReport[] = [
  { id: randomUUID(), scamType: 'Telegram Task Scam', platform: 'Telegram', location: 'Pan India', description: 'Fake data-entry tasks requiring upfront deposit. Victims shown fake wallet balance.', timestamp: Date.now() - 86400000 * 2, upvotes: 47 },
  { id: randomUUID(), scamType: 'Fake Job Offer', platform: 'LinkedIn', location: 'Bengaluru', description: 'Company impersonating Infosys offering WFH jobs requiring Rs 2500 registration fee.', timestamp: Date.now() - 86400000 * 5, upvotes: 32 },
  { id: randomUUID(), scamType: 'Investment Fraud', platform: 'WhatsApp', location: 'Mumbai', description: 'Group promising 30% daily returns on crypto investments. Withdrawals blocked after deposit.', timestamp: Date.now() - 86400000 * 8, upvotes: 61 },
  { id: randomUUID(), scamType: 'Part-Time Scam', platform: 'Instagram', location: 'Delhi', description: 'Clicking product images for Rs 800/day. Locked account after Rs 5000 deposited.', timestamp: Date.now() - 86400000 * 12, upvotes: 28 },
  { id: randomUUID(), scamType: 'Phishing Link', platform: 'SMS', location: 'Hyderabad', description: 'Fake SBI KYC update link stealing net banking credentials.', timestamp: Date.now() - 86400000 * 15, upvotes: 55 },
];

const upvoteTracker = new Map<string, Set<string>>();

export async function getRadarReports(): Promise<RadarReport[]> {
  if (isDBConnected()) {
    const docs = await RadarReportModel.find().sort({ timestamp: -1 }).limit(50).lean();
    return docs.map(d => ({
      id: (d._id as { toString(): string }).toString(),
      scamType: d.scamType,
      platform: d.platform,
      location: d.location,
      description: d.description,
      timestamp: d.timestamp,
      upvotes: d.upvotes,
    }));
  }
  return [...radarReports].sort((a, b) => b.timestamp - a.timestamp);
}

export async function submitRadarReport(data: Omit<RadarReport, 'id' | 'timestamp' | 'upvotes'>): Promise<RadarReport> {
  if (isDBConnected()) {
    const doc = await RadarReportModel.create({ ...data, timestamp: Date.now(), upvotes: 0, voterIps: [] });
    return {
      id: (doc._id as { toString(): string }).toString(),
      scamType: doc.scamType,
      platform: doc.platform,
      location: doc.location,
      description: doc.description,
      timestamp: doc.timestamp,
      upvotes: doc.upvotes,
    };
  }
  const report: RadarReport = { id: randomUUID(), ...data, timestamp: Date.now(), upvotes: 0 };
  radarReports.unshift(report);
  return report;
}

export async function upvoteReport(id: string, voterIp: string): Promise<{ report: RadarReport | null; alreadyVoted: boolean }> {
  if (isDBConnected()) {
    const doc = await RadarReportModel.findById(id);
    if (!doc) return { report: null, alreadyVoted: false };
    if (doc.voterIps.includes(voterIp)) {
      return {
        report: { id: doc._id.toString(), scamType: doc.scamType, platform: doc.platform, location: doc.location, description: doc.description, timestamp: doc.timestamp, upvotes: doc.upvotes },
        alreadyVoted: true,
      };
    }
    doc.voterIps.push(voterIp);
    doc.upvotes += 1;
    await doc.save();
    return {
      report: { id: doc._id.toString(), scamType: doc.scamType, platform: doc.platform, location: doc.location, description: doc.description, timestamp: doc.timestamp, upvotes: doc.upvotes },
      alreadyVoted: false,
    };
  }
  const report = radarReports.find(r => r.id === id);
  if (!report) return { report: null, alreadyVoted: false };
  if (!upvoteTracker.has(id)) upvoteTracker.set(id, new Set());
  const voters = upvoteTracker.get(id)!;
  if (voters.has(voterIp)) return { report, alreadyVoted: true };
  voters.add(voterIp);
  report.upvotes += 1;
  return { report, alreadyVoted: false };
}
