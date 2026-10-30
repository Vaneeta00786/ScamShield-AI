import { isDBConnected } from '../db/connect';
import { ScanRecordModel } from '../models/ScanRecord';
import type { DashboardStats, WeeklyDataPoint } from '../types';
import { DASHBOARD_STATS as SEED_STATS, WEEKLY_DATA as SEED_WEEKLY } from '../data/scamPatterns';

export async function recordScan(data: {
  inputType: string;
  riskLevel: string;
  riskScore: number;
  summary: string;
  companyName?: string;
}): Promise<void> {
  if (!isDBConnected()) return;
  try {
    await ScanRecordModel.create({ ...data, timestamp: Date.now() });
  } catch { /* non-critical */ }
}

export async function getLiveDashboardStats(): Promise<DashboardStats> {
  if (!isDBConnected()) return SEED_STATS;
  const [total, high, safe, suspicious] = await Promise.all([
    ScanRecordModel.countDocuments(),
    ScanRecordModel.countDocuments({ riskLevel: 'HIGH_RISK' }),
    ScanRecordModel.countDocuments({ riskLevel: 'SAFE' }),
    ScanRecordModel.countDocuments({ riskLevel: 'SUSPICIOUS' }),
  ]);
  return {
    totalScans: total + SEED_STATS.totalScans,
    scamAlerts: high + SEED_STATS.scamAlerts,
    safeOffers: safe + SEED_STATS.safeOffers,
    suspiciousReviewed: suspicious + SEED_STATS.suspiciousReviewed,
  };
}

export async function getLiveWeeklyData(): Promise<WeeklyDataPoint[]> {
  if (!isDBConnected()) return SEED_WEEKLY;
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const now = Date.now();
  const weekAgo = now - 7 * 24 * 60 * 60 * 1000;
  const records = await ScanRecordModel.find({ timestamp: { $gte: weekAgo } }).lean();
  const map = new Map<string, WeeklyDataPoint>();
  days.forEach(d => map.set(d, { day: d, scams: 0, safe: 0, suspicious: 0 }));
  for (const rec of records) {
    const day = days[new Date(rec.timestamp).getDay()];
    const pt = map.get(day)!;
    if (rec.riskLevel === 'HIGH_RISK') pt.scams++;
    else if (rec.riskLevel === 'SAFE') pt.safe++;
    else pt.suspicious++;
  }
  return days.map((d, i) => {
    const live = map.get(d)!;
    const seed = SEED_WEEKLY[i] ?? { scams: 0, safe: 0, suspicious: 0 };
    return {
      day: d,
      scams: live.scams + Math.floor(seed.scams * 0.3),
      safe: live.safe + Math.floor(seed.safe * 0.3),
      suspicious: live.suspicious + Math.floor(seed.suspicious * 0.3),
    };
  });
}

export interface ScanHistoryItem {
  id: string;
  inputType: string;
  riskLevel: string;
  riskScore: number;
  summary: string;
  companyName?: string;
  timestamp: number;
}

export async function getScanHistory(limit = 20): Promise<ScanHistoryItem[]> {
  if (!isDBConnected()) return [];
  const docs = await ScanRecordModel.find()
    .sort({ timestamp: -1 })
    .limit(limit)
    .lean();
  return docs.map(d => ({
    id: d._id.toString(),
    inputType: d.inputType,
    riskLevel: d.riskLevel,
    riskScore: d.riskScore,
    summary: d.summary,
    companyName: d.companyName,
    timestamp: d.timestamp,
  }));
}
